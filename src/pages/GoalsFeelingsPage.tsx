
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { format, parseISO } from "date-fns";
import { 
  CalendarIcon, 
  Check, 
  Edit, 
  Plus, 
  Target, 
  Trash,
  Clock,
  ChevronRight,
  CheckCircle,
  Circle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { GoalType } from "@/lib/supabase";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const emotionOptions = [
  { value: "Happy", emoji: "😊" },
  { value: "Excited", emoji: "🤩" },
  { value: "Grateful", emoji: "🙏" },
  { value: "Content", emoji: "😌" },
  { value: "Peaceful", emoji: "😇" },
  { value: "Proud", emoji: "🥹" },
  { value: "Motivated", emoji: "💪" },
  { value: "Inspired", emoji: "✨" },
  { value: "Hopeful", emoji: "🌈" },
  { value: "Loved", emoji: "❤️" },
  { value: "Neutral", emoji: "😐" },
  { value: "Bored", emoji: "🥱" },
  { value: "Tired", emoji: "😴" },
  { value: "Sad", emoji: "😢" },
  { value: "Anxious", emoji: "😰" },
  { value: "Frustrated", emoji: "😤" },
  { value: "Overwhelmed", emoji: "😩" },
  { value: "Disappointed", emoji: "😞" },
  { value: "Lonely", emoji: "🥺" },
  { value: "Insecure", emoji: "😟" },
];

const goalStatusOptions = [
  { value: "not-started", label: "Not Started", icon: <Circle className="h-4 w-4 text-muted-foreground" /> },
  { value: "in-progress", label: "In Progress", icon: <AlertCircle className="h-4 w-4 text-amber-500" /> },
  { value: "completed", label: "Completed", icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
  { value: "abandoned", label: "Abandoned", icon: <XCircle className="h-4 w-4 text-red-500" /> },
];

const GoalsFeelingsPage = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<GoalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState("not-started");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("goals")
        .select()
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch goals",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTargetDate(undefined);
    setStatus("not-started");
    setSelectedEmotions([]);
    setSelectedGoal(null);
  };

  const handleAddGoal = () => {
    resetForm();
    setShowGoalForm(true);
  };

  const handleEditGoal = (goal: GoalType) => {
    setSelectedGoal(goal);
    setTitle(goal.title);
    setDescription(goal.description || "");
    setTargetDate(goal.target_date ? new Date(goal.target_date) : undefined);
    setStatus(goal.status);
    setSelectedEmotions(goal.related_emotions || []);
    setShowGoalForm(true);
  };

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSaveGoal = async () => {
    if (!user) return;
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Goal title is required",
      });
      return;
    }

    try {
      const goalData = {
        user_id: user.id,
        title,
        description: description || null,
        target_date: targetDate ? format(targetDate, "yyyy-MM-dd") : null,
        status,
        related_emotions: selectedEmotions,
      };

      if (selectedGoal) {
        // Update
        const { error } = await supabase
          .from("goals")
          .update(goalData)
          .eq("id", selectedGoal.id);

        if (error) throw error;

        setGoals(prev => 
          prev.map(g => g.id === selectedGoal.id ? { ...g, ...goalData, id: selectedGoal.id } : g)
        );

        toast({
          title: "Success",
          description: "Goal updated successfully",
        });
      } else {
        // Create
        const { data, error } = await supabase
          .from("goals")
          .insert([goalData])
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          setGoals(prev => [data[0], ...prev]);
        }

        toast({
          title: "Success",
          description: "Goal created successfully",
        });
      }

      resetForm();
      setShowGoalForm(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save goal",
      });
    }
  };

  const handleDeleteGoal = async () => {
    if (!selectedGoal) return;

    try {
      const { error } = await supabase
        .from("goals")
        .delete()
        .eq("id", selectedGoal.id);

      if (error) throw error;

      setGoals(prev => prev.filter(g => g.id !== selectedGoal.id));

      toast({
        title: "Success",
        description: "Goal deleted successfully",
      });

      setConfirmDialog(false);
      resetForm();
      setShowGoalForm(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete goal",
      });
    }
  };

  const getStatusDetails = (statusValue: string) => {
    return goalStatusOptions.find(option => option.value === statusValue) || goalStatusOptions[0];
  };

  const getEmotionEmoji = (emotion: string) => {
    const found = emotionOptions.find(e => e.value === emotion);
    return found ? found.emoji : "";
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title">Goals & Feelings</h1>
        <p className="text-muted-foreground mb-4">
          Track your emotional progress related to personal goals and aspirations.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-mindbloom-tertiary">Your Goals</h2>
          <p className="text-sm text-muted-foreground">
            Connect your emotions to goals that matter to you
          </p>
        </div>
        <Button 
          onClick={handleAddGoal}
          className="bg-mindbloom-primary hover:bg-mindbloom-secondary"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Goal
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6 space-y-4">
              <div className="h-6 bg-mindbloom-soft-purple/30 rounded animate-pulse w-2/3"></div>
              <div className="h-4 bg-mindbloom-soft-purple/20 rounded animate-pulse w-1/4"></div>
              <div className="h-16 bg-mindbloom-soft-purple/30 rounded animate-pulse"></div>
            </Card>
          ))}
        </div>
      ) : showGoalForm ? (
        <Card className="p-6">
          <h3 className="card-title mb-6">
            {selectedGoal ? "Edit Goal" : "Create New Goal"}
          </h3>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Goal Title *</Label>
              <Input
                id="title"
                placeholder="What do you want to achieve?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add details about your goal..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Target Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-2"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {targetDate ? (
                        format(targetDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={targetDate}
                      onSelect={setTargetDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Status</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {goalStatusOptions.map(option => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={status === option.value ? "default" : "outline"}
                      className={status === option.value 
                        ? "bg-mindbloom-primary hover:bg-mindbloom-secondary" 
                        : ""}
                      onClick={() => setStatus(option.value)}
                    >
                      {option.icon}
                      <span className="ml-2">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Related Emotions</Label>
              <div className="flex flex-wrap gap-2">
                {emotionOptions.map(emotion => (
                  <button
                    key={emotion.value}
                    type="button"
                    onClick={() => toggleEmotion(emotion.value)}
                    className={`emotion-tag border transition-colors ${
                      selectedEmotions.includes(emotion.value)
                        ? "bg-mindbloom-soft-purple text-mindbloom-tertiary border-mindbloom-primary/40"
                        : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {emotion.emoji} {emotion.value}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <div>
                {selectedGoal && (
                  <Button 
                    variant="destructive" 
                    onClick={() => setConfirmDialog(true)}
                  >
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setShowGoalForm(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveGoal}
                  disabled={!title}
                  className="bg-mindbloom-primary hover:bg-mindbloom-secondary"
                >
                  <Check className="mr-2 h-4 w-4" /> Save Goal
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : goals.length > 0 ? (
        <div className="grid gap-4">
          {goals.map(goal => (
            <Card 
              key={goal.id} 
              className="p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleEditGoal(goal)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-mindbloom-tertiary">
                    {goal.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-3 mt-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      {getStatusDetails(goal.status).icon}
                      <span className="ml-1">{getStatusDetails(goal.status).label}</span>
                    </div>
                    
                    {goal.target_date && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Target: {format(parseISO(goal.target_date), "MMM d, yyyy")}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="p-0 h-auto hover:bg-transparent text-mindbloom-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditGoal(goal);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    <span className="sr-only md:not-sr-only">Edit</span>
                  </Button>
                </div>
              </div>
              
              {goal.description && (
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {goal.description}
                </p>
              )}
              
              {goal.related_emotions && goal.related_emotions.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Related Emotions:</div>
                  <div className="flex flex-wrap gap-2">
                    {goal.related_emotions.map(emotion => (
                      <span 
                        key={emotion} 
                        className="emotion-tag bg-mindbloom-soft-purple/50 text-mindbloom-tertiary"
                      >
                        {getEmotionEmoji(emotion)} {emotion}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="mb-4">
            <Target className="h-12 w-12 text-mindbloom-primary/50 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-mindbloom-tertiary mb-2">
            No goals created yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Start by creating a goal and connecting it to your emotions
          </p>
          <Button 
            onClick={handleAddGoal}
            className="bg-mindbloom-primary hover:bg-mindbloom-secondary"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Your First Goal
          </Button>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your goal.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteGoal}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoalsFeelingsPage;
