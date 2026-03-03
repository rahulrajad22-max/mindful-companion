import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Loader2, Bot, User, Sparkles, Heart } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wellness-chat`;

export default function Chat() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const quickPrompts = [
    { icon: "😟", text: t("chat.quickPrompts.q1") },
    { icon: "😴", text: t("chat.quickPrompts.q2") },
    { icon: "🧘", text: t("chat.quickPrompts.q3") },
    { icon: "📝", text: t("chat.quickPrompts.q4") },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const streamChat = async (allMessages: Message[]) => {
    setIsLoading(true);
    let assistantSoFar = "";
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: allMessages }),
      });
      if (!resp.ok) { const err = await resp.json().catch(() => ({ error: "Failed to connect" })); throw new Error(err.error || "Chat failed"); }
      if (!resp.body) throw new Error("No response body");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch { buffer = line + "\n" + buffer; break; }
        }
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Something went wrong");
      setMessages((prev) => [...prev, { role: "assistant", content: t("chat.errorResponse") }]);
    } finally { setIsLoading(false); }
  };

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;
    const userMsg: Message = { role: "user", content: msg };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    await streamChat(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <ParallaxBackground variant="page" />
      <main className="container flex-1 flex flex-col py-4 max-w-3xl">
        <div className="text-center mb-4 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-soft border border-primary/20 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t("chat.badge")}</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">{t("chat.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("chat.subtitle")}</p>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden border-border/30 bg-card/50 backdrop-blur-sm">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-6 py-8">
                <div className="gradient-accent p-4 rounded-2xl shadow-glow">
                  <Bot className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-display text-lg font-semibold text-foreground">{t("chat.greeting")}</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">{t("chat.greetingSubtitle")}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                  {quickPrompts.map((p) => (
                    <button key={p.text} onClick={() => handleSend(p.text)} className="text-left p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-primary/5 hover:border-primary/30 transition-all text-sm group">
                      <span className="text-lg">{p.icon}</span>
                      <p className="text-muted-foreground group-hover:text-foreground mt-1 text-xs">{p.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`}>
                  {msg.role === "assistant" && (
                    <div className="gradient-accent p-1.5 rounded-lg h-fit mt-1 shrink-0"><Bot className="h-4 w-4 text-primary-foreground" /></div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted/60 text-foreground rounded-bl-md"}`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                    ) : (<p className="text-sm">{msg.content}</p>)}
                  </div>
                  {msg.role === "user" && (
                    <div className="bg-secondary p-1.5 rounded-lg h-fit mt-1 shrink-0"><User className="h-4 w-4 text-secondary-foreground" /></div>
                  )}
                </div>
              ))
            )}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex gap-3 items-start animate-fade-up">
                <div className="gradient-accent p-1.5 rounded-lg shrink-0"><Bot className="h-4 w-4 text-primary-foreground" /></div>
                <div className="bg-muted/60 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border/30 p-3">
            <div className="flex gap-2 items-end">
              <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={t("chat.placeholder")} rows={1} className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading} size="icon" className="h-11 w-11 rounded-xl shrink-0">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
              <Heart className="h-3 w-3" /> {t("chat.disclaimer")}
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}
