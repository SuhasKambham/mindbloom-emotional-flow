import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, addMonths, subMonths } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DayEntry {
  date: Date;
  entry?: {
    id: string;
    mood: string;
    mood_intensity: number;
    content: string;
  };
}

const moodColors = {
  Happy: { bg: "bg-green-500", intensity: (intensity: number) => `bg-green-${Math.min(900, intensity * 100)}` },
  Excited: { bg: "bg-yellow-500", intensity: (intensity: number) => `bg-yellow-${Math.min(900, intensity * 100)}` },
  Grateful: { bg: "bg-purple-500", intensity: (intensity: number) => `bg-purple-${Math.min(900, intensity * 100)}` },
  Content: { bg: "bg-blue-500", intensity: (intensity: number) => `bg-blue-${Math.min(900, intensity * 100)}` },
  Peaceful: { bg: "bg-cyan-500", intensity: (intensity: number) => `bg-cyan-${Math.min(900, intensity * 100)}` },
  Neutral: { bg: "bg-gray-400", intensity: (intensity: number) => `bg-gray-${Math.min(900, intensity * 100)}` },
  Tired: { bg: "bg-indigo-400", intensity: (intensity: number) => `bg-indigo-${Math.min(900, intensity * 100)}` },
  Bored: { bg: "bg-slate-400", intensity: (intensity: number) => `bg-slate-${Math.min(900, intensity * 100)}` },
  Sad: { bg: "bg-blue-600", intensity: (intensity: number) => `bg-blue-${Math.min(900, intensity * 100)}` },
  Angry: { bg: "bg-red-500", intensity: (intensity: number) => `bg-red-${Math.min(900, intensity * 100)}` },
  Anxious: { bg: "bg-amber-500", intensity: (intensity: number) => `bg-amber-${Math.min(900, intensity * 100)}` },
  Frustrated: { bg: "bg-orange-500", intensity: (intensity: number) => `bg-orange-${Math.min(900, intensity * 100)}` },
  Overwhelmed: { bg: "bg-rose-500", intensity: (intensity: number) => `bg-rose-${Math.min(900, intensity * 100)}` }
};

const defaultMood = { bg: "bg-gray-200", intensity: () => "bg-gray-200" };

const getMoodEmoji = (mood: string): string => {
  const moodMap: { [key: string]: string } = {
    Happy: "😊",
    Excited: "🤩",
    Grateful: "🙏",
    Content: "😌",
    Peaceful: "😇",
    Neutral: "😐",
    Tired: "😴",
    Bored: "🥱",
    Sad: "😢",
    Angry: "😠",
    Anxious: "😰",
    Frustrated: "😤",
    Overwhelmed: "😩"
  };
  
  return moodMap[mood] || "😐";
};

const getMoodColor = (mood: string, intensity: number = 5): string => {
  const moodColorConfig = moodColors[mood as keyof typeof moodColors] || defaultMood;
  
  // Calculate the opacity based on intensity (1-10)
  const opacity = Math.max(0.3, intensity / 10);
  const baseColor = moodColorConfig.bg.replace("bg-", "");
  
  // Modify for specific moods with better visualization
  if (mood === "Happy" || mood === "Excited" || mood === "Grateful") {
    return `${moodColorConfig.bg} opacity-${Math.round(opacity * 100)}`;
  } else if (mood === "Sad" || mood === "Angry" || mood === "Anxious") {
    return `${moodColorConfig.bg} opacity-${Math.round(opacity * 100)}`;
  }
  
  return `${moodColorConfig.bg} opacity-${Math.round(opacity * 100)}`;
};

const MoodCalendar = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState<DayEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<DayEntry | null>(null);

  useEffect(() => {
    if (user) {
      fetchMonthEntries();
    }
  }, [user, currentMonth]);

  const fetchMonthEntries = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      
      // Get all days in the month
      const daysInMonth = eachDayOfInterval({ start, end });
      
      // Format dates for Supabase query
      const startDateStr = format(start, "yyyy-MM-dd");
      const endDateStr = format(end, "yyyy-MM-dd");
      
      // Fetch entries for the month
      const { data, error } = await supabase
        .from("journal_entries")
        .select("id, date, mood, mood_intensity, content")
        .eq("user_id", user.id)
        .gte("date", startDateStr)
        .lte("date", endDateStr)
        .order("date", { ascending: true });
      
      if (error) throw error;
      
      // Map entries to days
      const daysWithEntries = daysInMonth.map(day => {
        const entry = data?.find(entry => 
          isSameDay(new Date(entry.date), day)
        );
        
        return {
          date: day,
          entry: entry ? {
            id: entry.id,
            mood: entry.mood,
            mood_intensity: entry.mood_intensity,
            content: entry.content
          } : undefined
        };
      });
      
      setDays(daysWithEntries);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch mood data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  const handleDayClick = (day: DayEntry) => {
    setSelectedDay(day);
  };

  const generateCalendarGrid = () => {
    if (days.length === 0) return null;

    const firstDayOfMonth = getDay(days[0].date);
    
    // Create empty cells for days before first day of month
    const blanks = Array(firstDayOfMonth).fill(null).map((_, i) => (
      <div key={`blank-${i}`} className="h-16 p-1" />
    ));
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="text-center font-medium text-sm py-2">
            {day}
          </div>
        ))}
        
        {/* Blank days + actual days */}
        {blanks.concat(
          days.map((day, index) => {
            const isToday = isSameDay(day.date, new Date());
            
            return (
              <div 
                key={index}
                onClick={() => handleDayClick(day)}
                className={`
                  h-16 p-1 rounded-lg border border-gray-200 overflow-hidden
                  transition-all duration-200 hover:shadow-md cursor-pointer
                  ${isToday ? "ring-2 ring-mindbloom-primary ring-offset-2" : ""}
                `}
              >
                <div className="flex flex-col h-full">
                  <div className="text-xs text-right mb-1">
                    {format(day.date, "d")}
                  </div>
                  
                  {day.entry ? (
                    <div 
                      className={`
                        flex-1 rounded-md ${getMoodColor(day.entry.mood, day.entry.mood_intensity)}
                        flex items-center justify-center
                      `}
                    >
                      <div className="text-lg">
                        {getMoodEmoji(day.entry.mood)}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 bg-gray-100 bg-opacity-50 rounded-md flex items-center justify-center text-gray-400">
                      <span className="text-xs">No entry</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title">Mood Calendar</h1>
        <p className="text-muted-foreground mb-4">
          Visualize your emotional journey through time and identify patterns in your moods.
        </p>
      </div>

      <Card className="p-6 mb-8">
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
          <div className="grid grid-cols-7 gap-1">
            {Array(7).fill(null).map((_, i) => (
              <div key={`header-${i}`} className="text-center font-medium text-sm py-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]}
              </div>
            ))}
            {Array(35).fill(null).map((_, i) => (
              <div key={`day-${i}`} className="h-16 rounded-lg border border-gray-200 p-1 animate-pulse bg-gray-100"></div>
            ))}
          </div>
        ) : (
          generateCalendarGrid()
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title">Selected Day Details</h3>
          </div>
          
          {selectedDay ? (
            <div>
              <div className="text-lg font-medium mb-2">
                {format(selectedDay.date, "EEEE, MMMM d, yyyy")}
              </div>
              
              {selectedDay.entry ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${getMoodColor(selectedDay.entry.mood)}`}>
                      <span className="text-2xl">{getMoodEmoji(selectedDay.entry.mood)}</span>
                    </div>
                    <div>
                      <div className="font-medium">{selectedDay.entry.mood}</div>
                      <div className="text-sm text-muted-foreground">
                        Intensity: {selectedDay.entry.mood_intensity}/10
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Journal Entry:</h4>
                    <p className="text-sm text-muted-foreground line-clamp-6">
                      {selectedDay.entry.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="text-muted-foreground mb-4">No entry for this day</div>
                  <Button 
                    variant="outline" 
                    className="border-mindbloom-soft-purple"
                    onClick={() => window.location.href = "/journal"}
                  >
                    Create Entry
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="text-muted-foreground mb-2">Click on a day to view details</div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title">Mood Legend</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(moodColors).map(([mood, _]) => (
              <TooltipProvider key={mood}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getMoodColor(mood, 10)}`}>
                        <span>{getMoodEmoji(mood)}</span>
                      </div>
                      <span className="text-sm">{mood}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      Intensity is shown by color opacity
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              The opacity of colors reflects the intensity of emotion recorded in your journal entries.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MoodCalendar;
