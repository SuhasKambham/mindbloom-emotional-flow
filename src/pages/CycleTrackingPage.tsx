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
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { 
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Save,
  Moon,
  Trash,
  DropletIcon,
  CloudRainIcon,
  ThermometerIcon,
  HeartIcon,
  ActivityIcon,
  RefreshCwIcon,
  PillIcon,
  LucideIcon
} from "lucide-react";
import { CycleData } from "@/lib/supabase";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

type Symptom = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const symptoms: Symptom[] = [
  { id: "period", label: "Period", icon: DropletIcon },
  { id: "cramps", label: "Cramps", icon: ActivityIcon },
  { id: "headache", label: "Headache", icon: ThermometerIcon },
  { id: "bloating", label: "Bloating", icon: RefreshCwIcon },
  { id: "fatigue", label: "Fatigue", icon: CloudRainIcon },
  { id: "tender-breasts", label: "Tender Breasts", icon: HeartIcon },
  { id: "mood-swings", label: "Mood Swings", icon: PillIcon },
];

const moods = [
  { name: "Happy", emoji: "😊", color: "bg-green-100 text-green-800 border-green-300" },
  { name: "Calm", emoji: "😌", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { name: "Neutral", emoji: "😐", color: "bg-gray-100 text-gray-800 border-gray-300" },
  { name: "Tired", emoji: "😴", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  { name: "Sad", emoji: "😢", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { name: "Irritable", emoji: "😤", color: "bg-orange-100 text-orange-800 border-orange-300" },
  { name: "Anxious", emoji: "😰", color: "bg-amber-100 text-amber-800 border-amber-300" },
];

const CycleTrackingPage = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [cycleData, setCycleData] = useState<CycleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<CycleData | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const [cycleDay, setCycleDay] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState("Neutral");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (user) {
      fetchMonthData();
    }
  }, [user, currentMonth]);

  const fetchMonthData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      
      const startDateStr = format(start, "yyyy-MM-dd");
      const endDateStr = format(end, "yyyy-MM-dd");
      
      const { data, error } = await supabase
        .from("cycle_tracking")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", startDateStr)
        .lte("date", endDateStr)
        .order("date", { ascending: false });
      
      if (error) throw error;
      setCycleData(data || []);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch cycle data",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCycleDay(1);
    setSelectedSymptoms([]);
    setSelectedMood("Neutral");
    setNotes("");
    setSelectedEntry(null);
  };

  const handleAddEntry = () => {
    resetForm();
    setShowForm(true);
  };

  const handleDateSelection = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    
    const entry = cycleData.find(data => 
      isSameDay(new Date(data.date), date)
    );
    
    if (entry) {
      setSelectedEntry(entry);
      setCycleDay(entry.cycle_day);
      setSelectedSymptoms(entry.symptoms);
      setSelectedMood(entry.mood);
      setNotes(entry.notes || "");
    } else {
      resetForm();
    }
    
    setShowForm(true);
  };

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSaveEntry = async () => {
    if (!user || !selectedDate) return;

    try {
      const entryData = {
        user_id: user.id,
        date: format(selectedDate, "yyyy-MM-dd"),
        cycle_day: cycleDay,
        symptoms: selectedSymptoms,
        mood: selectedMood,
        notes: notes || null,
      };

      if (selectedEntry) {
        const { error } = await supabase
          .from("cycle_tracking")
          .update(entryData)
          .eq("id", selectedEntry.id);

        if (error) throw error;

        setCycleData(prev => 
          prev.map(entry => entry.id === selectedEntry.id ? { ...entry, ...entryData } : entry)
        );

        toast({
          title: "Success",
          description: "Cycle data updated successfully",
        });
      } else {
        const { data, error } = await supabase
          .from("cycle_tracking")
          .insert([entryData])
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          setCycleData(prev => [data[0], ...prev]);
        }

        toast({
          title: "Success",
          description: "Cycle data saved successfully",
        });
      }

      resetForm();
      setShowForm(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save cycle data",
      });
    }
  };

  const handleDeleteEntry = async () => {
    if (!selectedEntry) return;

    try {
      const { error } = await supabase
        .from("cycle_tracking")
        .delete()
        .eq("id", selectedEntry.id);

      if (error) throw error;

      setCycleData(prev => prev.filter(entry => entry.id !== selectedEntry.id));

      toast({
        title: "Success",
        description: "Cycle data deleted successfully",
      });

      setConfirmDialog(false);
      resetForm();
      setShowForm(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete cycle data",
      });
    }
  };

  const getMoodColor = (mood: string) => {
    const foundMood = moods.find(m => m.name === mood);
    return foundMood ? foundMood.color : "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getMoodEmoji = (mood: string) => {
    const foundMood = moods.find(m => m.name === mood);
    return foundMood ? foundMood.emoji : "😐";
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  const getSymptomLabel = (symptomId: string): string => {
    const symptom = symptoms.find(s => s.id === symptomId);
    return symptom ? symptom.label : symptomId;
  };

  const getDateEntryClass = (date: Date) => {
    const entry = cycleData.find(data => 
      isSameDay(new Date(data.date), date)
    );
    
    if (!entry) return "";
    
    if (entry.symptoms.includes("period")) {
      return "bg-red-100 text-red-800 font-medium";
    }
    
    if (entry.symptoms.length > 0) {
      return "bg-amber-50 text-amber-800";
    }
    
    return "bg-blue-50 text-blue-800";
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title">Cycle Tracking</h1>
        <p className="text-muted-foreground mb-4">
          Track cycle-related mood changes and symptoms for deeper emotional understanding.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePreviousMonth}
                className="border-mindbloom-soft-purple"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-2">Previous</span>
              </Button>
              
              <h2 className="text-xl font-semibold text-mindbloom-tertiary">
                {format(currentMonth, "MMMM yyyy")}
              </h2>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleNextMonth}
                className="border-mindbloom-soft-purple"
              >
                <span className="sr-only md:not-sr-only md:mr-2">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {loading ? (
              <div className="h-96 bg-gray-100 rounded-lg animate-pulse"></div>
            ) : (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelection}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="rounded-md border"
                modifiers={{
                  booked: date => {
                    return cycleData.some(data => 
                      isSameDay(new Date(data.date), date)
                    );
                  }
                }}
                modifiersClassNames={{
                  booked: "font-medium",
                }}
                components={{
                  Day: (props) => {
                    const dateClass = getDateEntryClass(props.date);
                    
                    return (
                      <div
                        className={`flex items-center justify-center h-9 w-9 ${dateClass}`}
                        {...props}
                      >
                        {props.date.getDate()}
                      </div>
                    );
                  }
                }}
              />
            )}
            
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleAddEntry}
                className="bg-mindbloom-primary hover:bg-mindbloom-secondary"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Today's Entry
              </Button>
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="p-6">
            <h3 className="card-title mb-4">Recent Entries</h3>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : cycleData.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {cycleData.slice(0, 5).map(entry => (
                  <div 
                    key={entry.id}
                    className="p-3 border border-mindbloom-soft-purple rounded-lg hover:bg-mindbloom-soft-purple/10 cursor-pointer"
                    onClick={() => handleDateSelection(new Date(entry.date))}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">
                        {format(parseISO(entry.date), "EEEE, MMM d")}
                      </div>
                      <div className={`emotion-tag ${getMoodColor(entry.mood)}`}>
                        {getMoodEmoji(entry.mood)} {entry.mood}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-muted-foreground">
                        Cycle day {entry.cycle_day}
                      </div>
                      <div>
                        {entry.symptoms.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {entry.symptoms.length} {entry.symptoms.length === 1 ? 'symptom' : 'symptoms'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {cycleData.length > 5 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" className="text-mindbloom-primary hover:text-mindbloom-secondary hover:bg-mindbloom-soft-purple/20">
                      View all entries
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Moon className="h-12 w-12 text-mindbloom-primary/50 mx-auto mb-3" />
                <p className="text-muted-foreground mb-6">
                  No cycle tracking data recorded yet
                </p>
                <Button
                  onClick={handleAddEntry}
                  className="bg-mindbloom-primary hover:bg-mindbloom-secondary"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Entry
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {showForm && (
        <div className="mt-8">
          <Card className="p-6">
            <h3 className="card-title mb-6">
              {selectedEntry ? "Edit Entry" : "New Entry"} - {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Today"}
            </h3>
            
            <div className="space-y-6">
              <div>
                <Label>Cycle Day</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCycleDay(prev => Math.max(1, prev - 1))}
                    disabled={cycleDay <= 1}
                  >
                    -
                  </Button>
                  <span className="font-medium text-lg w-8 text-center">{cycleDay}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCycleDay(prev => prev + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="mb-3 block">Symptoms</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {symptoms.map(symptom => {
                    const isSelected = selectedSymptoms.includes(symptom.id);
                    const Icon = symptom.icon;
                    
                    return (
                      <button
                        key={symptom.id}
                        type="button"
                        onClick={() => toggleSymptom(symptom.id)}
                        className={`
                          flex items-center p-3 rounded-lg border transition-all
                          ${isSelected 
                            ? "bg-mindbloom-soft-purple text-mindbloom-tertiary border-mindbloom-primary/40" 
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"}
                        `}
                      >
                        <Icon className={`h-4 w-4 mr-2 ${isSelected ? "text-mindbloom-primary" : ""}`} />
                        <span className="text-sm">{symptom.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <Label className="mb-3 block">Mood</Label>
                <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                  {moods.map(mood => (
                    <button
                      key={mood.name}
                      type="button"
                      onClick={() => setSelectedMood(mood.name)}
                      className={`
                        flex flex-col items-center p-3 rounded-lg border transition-all
                        ${selectedMood === mood.name 
                          ? `${mood.color} border-2` 
                          : "border-gray-200 hover:bg-gray-50"}
                      `}
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-xs mt-1">{mood.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <div>
                  {selectedEntry && (
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
                      setShowForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveEntry}
                    className="bg-mindbloom-primary hover:bg-mindbloom-secondary"
                  >
                    <Save className="mr-2 h-4 w-4" /> Save
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this cycle tracking entry.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEntry}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CycleTrackingPage;
