import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sun, Moon, Droplets, Activity, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface WellnessData {
  sleep: number;
  water: number;
  exercise: number;
  journalEntries: number;
}

interface WellnessTrackerProps {
  journalCount?: number;
}

export function WellnessTracker({ journalCount = 0 }: WellnessTrackerProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingField, setEditingField] = useState<keyof Omit<WellnessData, 'journalEntries'> | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [data, setData] = useState<WellnessData>({
    sleep: 0,
    water: 0,
    exercise: 0,
    journalEntries: journalCount,
  });

  useEffect(() => {
    if (user) {
      fetchTodayLog();
    }
  }, [user]);

  useEffect(() => {
    setData(prev => ({ ...prev, journalEntries: journalCount }));
  }, [journalCount]);

  const fetchTodayLog = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: log, error } = await supabase
        .from("wellness_logs")
        .select("sleep_hours, water_glasses, exercise_minutes")
        .eq("user_id", user.id)
        .eq("log_date", today)
        .maybeSingle();

      if (error) throw error;

      if (log) {
        setData(prev => ({
          ...prev,
          sleep: log.sleep_hours,
          water: log.water_glasses,
          exercise: log.exercise_minutes,
        }));
      }
    } catch (error) {
      console.error("Error fetching wellness log:", error);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (field: keyof Omit<WellnessData, 'journalEntries'>) => {
    setEditingField(field);
    setTempValue(data[field].toString());
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (editingField === null || !user) return;
    
    const value = parseInt(tempValue, 10);
    if (isNaN(value) || value < 0) {
      toast.error("Please enter a valid positive number");
      return;
    }

    const maxValues: Record<keyof Omit<WellnessData, 'journalEntries'>, number> = {
      sleep: 24,
      water: 20,
      exercise: 300,
    };

    if (value > maxValues[editingField]) {
      toast.error(`Maximum value is ${maxValues[editingField]}`);
      return;
    }

    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const fieldMap: Record<string, string> = {
        sleep: "sleep_hours",
        water: "water_glasses",
        exercise: "exercise_minutes",
      };

      // First try to get existing record
      const { data: existing } = await supabase
        .from("wellness_logs")
        .select("id, sleep_hours, water_glasses, exercise_minutes")
        .eq("user_id", user.id)
        .eq("log_date", today)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from("wellness_logs")
          .update({ [fieldMap[editingField]]: value })
          .eq("id", existing.id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from("wellness_logs")
          .insert({
            user_id: user.id,
            log_date: today,
            [fieldMap[editingField]]: value,
          });
        
        if (error) throw error;
      }

      setData(prev => ({ ...prev, [editingField]: value }));
      toast.success("Wellness data updated!");
      setEditOpen(false);
      setEditingField(null);
    } catch (error) {
      console.error("Error saving wellness log:", error);
      toast.error("Failed to save wellness data");
    } finally {
      setSaving(false);
    }
  };

  const getFieldLabel = (field: keyof Omit<WellnessData, 'journalEntries'>) => {
    const labels: Record<keyof Omit<WellnessData, 'journalEntries'>, string> = {
      sleep: "Hours of Sleep",
      water: "Glasses of Water",
      exercise: "Minutes of Exercise",
    };
    return labels[field];
  };

  const editableStats = [
    { key: "sleep" as const, icon: Sun, value: data.sleep, unit: "hrs sleep", color: "text-mood-okay" },
    { key: "water" as const, icon: Droplets, value: data.water, unit: "glasses water", color: "text-primary" },
    { key: "exercise" as const, icon: Activity, value: data.exercise, unit: "min exercise", color: "text-mood-great" },
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Today's Wellness</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Today's Wellness</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {editableStats.map((stat) => (
          <button
            key={stat.key}
            onClick={() => openEdit(stat.key)}
            className="text-center p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors relative group cursor-pointer"
          >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Pencil className="h-3 w-3 text-muted-foreground" />
            </div>
            <stat.icon className={`h-5 w-5 ${stat.color} mx-auto mb-1`} />
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.unit}</p>
          </button>
        ))}
        
        {/* Journal entries - not editable */}
        <div className="text-center p-3 rounded-xl bg-muted/50">
          <Moon className="h-5 w-5 text-secondary-foreground mx-auto mb-1" />
          <p className="text-2xl font-display font-bold text-foreground">{data.journalEntries}</p>
          <p className="text-xs text-muted-foreground">journal entries</p>
        </div>
      </CardContent>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[320px]">
          <DialogHeader>
            <DialogTitle>
              Update {editingField ? getFieldLabel(editingField) : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="value">
                {editingField ? getFieldLabel(editingField) : "Value"}
              </Label>
              <Input
                id="value"
                type="number"
                min="0"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
            <Button onClick={handleSave} className="w-full" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
