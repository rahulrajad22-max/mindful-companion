import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Send, MessageSquareHeart, Sparkles, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ANONYMOUS_NAMES = [
  "Brave Dolphin", "Gentle Owl", "Kind Panda", "Wise Fox", "Calm Turtle",
  "Happy Starfish", "Brave Lion", "Peaceful Dove", "Strong Oak", "Bright Moon",
  "Warm Sunflower", "Quiet River", "Bold Eagle", "Sweet Hummingbird", "Free Butterfly",
  "Hopeful Sparrow", "Steady Mountain", "Dancing Leaf", "Shining Star", "Caring Bear",
];

const CATEGORIES = ["encouragement", "advice", "gratitude", "venting"] as const;
type Category = typeof CATEGORIES[number];

interface Post {
  id: string;
  content: string;
  anonymous_name: string;
  category: string;
  hearts: number;
  created_at: string;
  user_id: string;
}

export default function Community() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [category, setCategory] = useState<Category>("encouragement");
  const [filterCat, setFilterCat] = useState<Category | "all">("all");
  const [myReactions, setMyReactions] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const getRandomName = () => ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)];

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (!error && data) setPosts(data);
    setLoading(false);
  };

  const fetchMyReactions = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("post_reactions")
      .select("post_id")
      .eq("user_id", user.id);
    if (data) setMyReactions(new Set(data.map((r) => r.post_id)));
  };

  useEffect(() => {
    fetchPosts();
    fetchMyReactions();

    const channel = supabase
      .channel("community_posts_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleSubmit = async () => {
    if (!newPost.trim() || !user) return;
    if (newPost.trim().length < 10) {
      toast.error(t("community.tooShort"));
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("community_posts").insert({
      user_id: user.id,
      content: newPost.trim(),
      anonymous_name: getRandomName(),
      category,
    });
    if (error) {
      toast.error(t("community.postError"));
    } else {
      setNewPost("");
      toast.success(t("community.postSuccess"));
    }
    setSubmitting(false);
  };

  const handleHeart = async (postId: string) => {
    if (!user) return;
    const alreadyHearted = myReactions.has(postId);

    if (alreadyHearted) {
      await supabase.from("post_reactions").delete().eq("post_id", postId).eq("user_id", user.id);
      await supabase.from("community_posts").update({ hearts: Math.max(0, (posts.find(p => p.id === postId)?.hearts || 1) - 1) }).eq("id", postId);
      setMyReactions((prev) => { const s = new Set(prev); s.delete(postId); return s; });
    } else {
      await supabase.from("post_reactions").insert({ post_id: postId, user_id: user.id });
      await supabase.from("community_posts").update({ hearts: (posts.find(p => p.id === postId)?.hearts || 0) + 1 }).eq("id", postId);
      setMyReactions((prev) => new Set(prev).add(postId));
    }
    fetchPosts();
  };

  const categoryColors: Record<string, string> = {
    encouragement: "bg-green-500/10 text-green-600 dark:text-green-400",
    advice: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    gratitude: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    venting: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  };

  const categoryEmojis: Record<string, string> = {
    encouragement: "💪",
    advice: "💡",
    gratitude: "🙏",
    venting: "💭",
  };

  const filteredPosts = filterCat === "all" ? posts : posts.filter((p) => p.category === filterCat);

  const timeAgo = (date: string) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 1) return t("community.justNow");
    if (mins < 60) return `${mins}m`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h`;
    return `${Math.floor(mins / 1440)}d`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-2xl mx-auto px-4 py-8 pb-28 md:pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
            <MessageSquareHeart className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t("community.badge")}</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t("community.title")}</h1>
          <p className="text-muted-foreground">{t("community.subtitle")}</p>
        </div>

        {/* Create Post */}
        <Card className="mb-6 border-primary/20">
          <CardContent className="pt-6 space-y-4">
            <Textarea
              placeholder={t("community.placeholder")}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-all",
                      category === cat
                        ? "ring-2 ring-primary " + categoryColors[cat]
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {categoryEmojis[cat]} {t(`community.cat_${cat}`)}
                  </button>
                ))}
              </div>
              <Button onClick={handleSubmit} disabled={submitting || !newPost.trim()} size="sm" className="gap-2">
                <Send className="h-4 w-4" />
                {t("community.post")}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {t("community.anonymousNote")}
            </p>
          </CardContent>
        </Card>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <button
            onClick={() => setFilterCat("all")}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap",
              filterCat === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            {t("community.all")}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                filterCat === cat ? categoryColors[cat] + " ring-2 ring-primary" : "bg-muted text-muted-foreground"
              )}
            >
              {categoryEmojis[cat]} {t(`community.cat_${cat}`)}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">{t("community.loading")}</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquareHeart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">{t("community.empty")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="transition-all hover:shadow-md">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                        {post.anonymous_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{post.anonymous_name}</p>
                        <p className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={cn("text-xs", categoryColors[post.category])}>
                      {categoryEmojis[post.category]} {t(`community.cat_${post.category}`)}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>
                  <button
                    onClick={() => handleHeart(post.id)}
                    className={cn(
                      "flex items-center gap-1.5 text-xs transition-all",
                      myReactions.has(post.id)
                        ? "text-red-500"
                        : "text-muted-foreground hover:text-red-400"
                    )}
                  >
                    <Heart className={cn("h-4 w-4", myReactions.has(post.id) && "fill-current")} />
                    {post.hearts}
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
