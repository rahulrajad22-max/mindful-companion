import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sun, Moon, Droplets, Activity, Pencil } from "lucide-react";
import { toast } from "sonner";

interface WellnessData {
  sleep: number;
  water: number;
  exercise: number;
  journalEntries: number;
}

interface WellnessTrackerProps {
  data: WellnessData;
  onUpdate: (data: WellnessData) => void;
}

export function WellnessTracker({ data, onUpdate }: WellnessTrackerProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [editingField, setEditingField] = useState<keyof WellnessData | null>(null);
  const [tempValue, setTempValue] = useState("");

  const openEdit = (field: keyof WellnessData) => {
    setEditingField(field);
    setTempValue(data[field].toString());
    setEditOpen(true);
  };

  const handleSave = () => {
    if (editingField === null) return;
    
    const value = parseInt(tempValue, 10);
    if (isNaN(value) || value < 0) {
      toast.error("Please enter a valid positive number");
      return;
    }

    const maxValues: Record<keyof WellnessData, number> = {
      sleep: 24,
      water: 20,
      exercise: 300,
      journalEntries: 50,
    };

    if (value > maxValues[editingField]) {
      toast.error(`Maximum value is ${maxValues[editingField]}`);
      return;
    }

    onUpdate({ ...data, [editingField]: value });
    toast.success("Wellness data updated!");
    setEditOpen(false);
    setEditingField(null);
  };

  const getFieldLabel = (field: keyof WellnessData) => {
    const labels: Record<keyof WellnessData, string> = {
      sleep: "Hours of Sleep",
      water: "Glasses of Water",
      exercise: "Minutes of Exercise",
      journalEntries: "Journal Entries",
    };
    return labels[field];
  };

  const stats = [
    { key: "sleep" as const, icon: Sun, value: data.sleep, unit: "hrs sleep", color: "text-mood-okay" },
    { key: "water" as const, icon: Droplets, value: data.water, unit: "glasses water", color: "text-primary" },
    { key: "exercise" as const, icon: Activity, value: data.exercise, unit: "min exercise", color: "text-mood-great" },
    { key: "journalEntries" as const, icon: Moon, value: data.journalEntries, unit: "journal entries", color: "text-secondary-foreground" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Today's Wellness</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
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
            <Button onClick={handleSave} className="w-full">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
