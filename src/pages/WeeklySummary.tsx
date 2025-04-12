
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  subWeeks, 
  addWeeks,
  eachDayOfInterval,
  isSameDay
} from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { BarChart, BarChart2, ChevronLeft, ChevronRight, Calendar, BookOpen } from "lucide-react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  mood_intensity: number;
  content: string;
  tags: string[];
}

interface DailyMoodCount {
  date: string;
  count: number;
}

interface MoodCount {
  mood: string;
  count: number;
  emoji: string;
  color: string;
}

interface TagCount {
  tag: string;
  count: number;
}

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

const getMoodColor = (mood: string): string => {
  const moodColorMap: { [key: string]: string } = {
    Happy: "#4ade80", // green-400
    Excited: "#facc15", // yellow-400
    Grateful: "#c084fc", // purple-400
    Content: "#60a5fa", // blue-400
    Peaceful: "#22d3ee", // cyan-400
    Neutral: "#9ca3af", // gray-400
    Tired: "#818cf8", // indigo-400
    Bored: "#94a3b8", // slate-400
    Sad: "#3b82f6", // blue-500
    Angry: "#ef4444", // red-500
    Anxious: "#f59e0b", // amber-500
    Frustrated: "#f97316", // orange-500
    Overwhelmed: "#f43f5e", // rose-500
  };
  
  return moodColorMap[mood] || "#9ca3af"; // default to gray-400
};

const WeeklySummary = () => {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [moodCounts, setMoodCounts] = useState<MoodCount[]>([]);
  const [tagCounts, setTagCounts] = useState<TagCount[]>([]);
  const [dailyCounts, setDailyCounts] = useState<DailyMoodCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEntries, setTotalEntries] = useState(0);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  useEffect(() => {
    if (user) {
      fetchWeekEntries();
    }
  }, [user, currentWeek]);

  const fetchWeekEntries = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const start = format(weekStart, "yyyy-MM-dd");
      const end = format(weekEnd, "yyyy-MM-dd");
      
      // Fetch entries for the week
      const { data, error } = await supabase
        .from("journal_entries")
        .select("id, date, mood, mood_intensity, content, tags")
        .eq("user_id", user.id)
        .gte("date", start)
        .lte("date", end)
        .order("date", { ascending: true });
      
      if (error) throw error;
      
      setEntries(data || []);
      
      // Calculate mood counts
      const moodMap = new Map<string, number>();
      
      data?.forEach(entry => {
        const count = moodMap.get(entry.mood) || 0;
        moodMap.set(entry.mood, count + 1);
      });
      
      const moodCountArray: MoodCount[] = Array.from(moodMap.entries()).map(([mood, count]) => ({
        mood,
        count,
        emoji: getMoodEmoji(mood),
        color: getMoodColor(mood)
      }));
      
      // Sort by count descending
      moodCountArray.sort((a, b) => b.count - a.count);
      
      setMoodCounts(moodCountArray);
      
      // Calculate tag counts
      const tagMap = new Map<string, number>();
      
      data?.forEach(entry => {
        entry.tags?.forEach(tag => {
          const count = tagMap.get(tag) || 0;
          tagMap.set(tag, count + 1);
        });
      });
      
      const tagCountArray: TagCount[] = Array.from(tagMap.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 tags
      
      setTagCounts(tagCountArray);
      
      // Calculate daily counts
      const dailyCountMap = new Map<string, number>();
      
      daysOfWeek.forEach(day => {
        const dateStr = format(day, "yyyy-MM-dd");
        dailyCountMap.set(dateStr, 0);
      });
      
      data?.forEach(entry => {
        const count = dailyCountMap.get(entry.date) || 0;
        dailyCountMap.set(entry.date, count + 1);
      });
      
      const dailyCountArray: DailyMoodCount[] = Array.from(dailyCountMap.entries())
        .map(([date, count]) => ({ 
          date, 
          count,
        }));
      
      setDailyCounts(dailyCountArray);
      
      // Calculate total entries
      const { count, error: countError } = await supabase
        .from("journal_entries")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      
      if (countError) throw countError;
      
      setTotalEntries(count || 0);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch weekly data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(prevWeek => subWeeks(prevWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prevWeek => addWeeks(prevWeek, 1));
  };

  const formatDayForChart = (dateStr: string) => {
    return format(new Date(dateStr), "EEE");
  };

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="font-medium text-sm">{format(new Date(payload[0].payload.date), "EEEE, MMM d")}</p>
          <p className="text-sm">
            <span className="font-medium">{payload[0].value}</span> {payload[0].value === 1 ? "entry" : "entries"}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title">Weekly Summary</h1>
        <p className="text-muted-foreground mb-4">
          Review your emotional patterns and journaling insights for the week.
        </p>
      </div>

      <Card className="p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePreviousWeek}
            className="border-mindbloom-soft-purple"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:ml-2">Previous</span>
          </Button>
          
          <h2 className="text-xl font-semibold text-mindbloom-tertiary">
            Week of {format(weekStart, "MMMM d")} - {format(weekEnd, "MMMM d, yyyy")}
          </h2>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextWeek}
            className="border-mindbloom-soft-purple"
          >
            <span className="sr-only md:not-sr-only md:mr-2">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="card-title">Weekly Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Week Entries</span>
                  <span className="font-medium">{entries.length}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Total Journal Entries</span>
                  <span className="font-medium">{totalEntries}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Most Frequent Mood</span>
                  <span className="font-medium flex items-center">
                    {moodCounts.length > 0 ? (
                      <>
                        <span className="mr-2">{moodCounts[0].emoji}</span>
                        {moodCounts[0].mood}
                      </>
                    ) : (
                      "No entries"
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Journaling Streak</span>
                  <span className="font-medium">🔥 Coming soon</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="h-64">
                <h3 className="card-title mb-4">Entries by Day</h3>
                
                {dailyCounts.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={dailyCounts}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDayForChart} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tickCount={5}
                      />
                      <Tooltip content={customTooltip} />
                      <Bar dataKey="count" fill="#9b87f5" radius={[4, 4, 0, 0]}>
                        {dailyCounts.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={dailyCounts[index].count > 0 ? "#9b87f5" : "#e5e7eb"}
                          />
                        ))}
                      </Bar>
                    </ReBarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart2 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No entries for this week</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title">Mood Distribution</h3>
            <BarChart className="h-5 w-5 text-mindbloom-primary" />
          </div>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-8 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : moodCounts.length > 0 ? (
            <div className="space-y-4">
              {moodCounts.map(mood => (
                <div key={mood.mood} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <span className="mr-2">{mood.emoji}</span>
                      {mood.mood}
                    </span>
                    <span>{mood.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ 
                        width: `${(mood.count / entries.length) * 100}%`,
                        backgroundColor: mood.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No mood data available for this week
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title">Recent Entries</h3>
            <BookOpen className="h-5 w-5 text-mindbloom-primary" />
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-3 border rounded-lg">
                  <div className="h-5 w-1/3 bg-gray-100 rounded animate-pulse mb-2"></div>
                  <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : entries.length > 0 ? (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {entries.slice(0, 5).map(entry => (
                <div key={entry.id} className="p-3 border border-mindbloom-soft-purple rounded-lg hover:bg-mindbloom-soft-purple/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {format(new Date(entry.date), "EEE, MMM d")}
                    </span>
                    <span className="text-sm flex items-center">
                      {getMoodEmoji(entry.mood)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {entry.content}
                  </p>
                </div>
              ))}
              
              {entries.length > 5 && (
                <Button 
                  variant="ghost"
                  className="w-full text-mindbloom-primary hover:text-mindbloom-secondary hover:bg-mindbloom-soft-purple/20"
                  onClick={() => window.location.href = "/journal"}
                >
                  View all entries
                </Button>
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="text-muted-foreground mb-4">No entries for this week</div>
              <Button 
                className="bg-mindbloom-primary hover:bg-mindbloom-secondary"
                onClick={() => window.location.href = "/journal"}
              >
                Create Entry
              </Button>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title">Common Themes & Tags</h3>
            <Calendar className="h-5 w-5 text-mindbloom-primary" />
          </div>
          
          {loading ? (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-8 w-20 bg-gray-100 rounded-full animate-pulse"></div>
              ))}
            </div>
          ) : tagCounts.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tagCounts.map(tag => (
                <div 
                  key={tag.tag}
                  className="rounded-full px-3 py-1 text-sm bg-mindbloom-soft-purple flex items-center gap-1"
                >
                  <span>{tag.tag}</span>
                  <span className="text-xs bg-white bg-opacity-30 rounded-full w-5 h-5 flex items-center justify-center">
                    {tag.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              No tags found for this week's entries
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default WeeklySummary;
