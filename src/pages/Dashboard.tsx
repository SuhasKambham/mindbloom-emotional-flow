
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { 
  BarChart2, 
  Calendar, 
  Smile, 
  Frown, 
  Meh, 
  BookOpen, 
  ArrowRight, 
  Target, 
  Moon
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const { user } = useAuth();
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [entryCount, setEntryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [moodCounts, setMoodCounts] = useState({
    positive: 0,
    neutral: 0,
    negative: 0,
  });
  const currentDate = new Date();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      setLoading(true);
      
      try {
        // Fetch recent entries
        const { data: entries, error: entriesError } = await supabase
          .from("journal_entries")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (entriesError) throw entriesError;

        // Get entry count
        const { count, error: countError } = await supabase
          .from("journal_entries")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (countError) throw countError;

        // Count moods
        const { data: moodData, error: moodError } = await supabase
          .from("journal_entries")
          .select("mood")
          .eq("user_id", user.id);

        if (moodError) throw moodError;

        const moodTotals = {
          positive: 0,
          neutral: 0,
          negative: 0,
        };

        moodData?.forEach((entry) => {
          const mood = entry.mood.toLowerCase();
          if (["happy", "excited", "grateful", "content", "peaceful"].includes(mood)) {
            moodTotals.positive++;
          } else if (["sad", "angry", "anxious", "frustrated", "overwhelmed"].includes(mood)) {
            moodTotals.negative++;
          } else {
            moodTotals.neutral++;
          }
        });

        setRecentEntries(entries || []);
        setEntryCount(count || 0);
        setMoodCounts(moodTotals);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const getMoodIcon = (mood: string) => {
    const lowerMood = mood.toLowerCase();
    
    if (["happy", "excited", "grateful", "content", "peaceful"].includes(lowerMood)) {
      return <Smile className="h-5 w-5 text-green-500" />;
    } else if (["sad", "angry", "anxious", "frustrated", "overwhelmed"].includes(lowerMood)) {
      return <Frown className="h-5 w-5 text-red-500" />;
    } else {
      return <Meh className="h-5 w-5 text-amber-500" />;
    }
  };

  const calculateMoodPercentage = () => {
    const total = moodCounts.positive + moodCounts.neutral + moodCounts.negative;
    return total === 0 ? 0 : Math.round((moodCounts.positive / total) * 100);
  };

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">
        Welcome, {user?.email?.split('@')[0] || 'User'}
      </h1>
      
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-medium text-mindbloom-tertiary">
              Today is {format(currentDate, "EEEE, MMMM do, yyyy")}
            </h2>
            <p className="text-muted-foreground">
              {entryCount === 0 
                ? "Start your journaling journey today!" 
                : `You've written ${entryCount} journal ${entryCount === 1 ? 'entry' : 'entries'} so far.`}
            </p>
          </div>
          
          <Link to="/journal">
            <Button className="bg-mindbloom-primary hover:bg-mindbloom-secondary">
              <BookOpen className="mr-2 h-5 w-5" /> 
              New Journal Entry
            </Button>
          </Link>
        </div>
      </div>
      
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 space-y-4">
              <div className="h-4 bg-mindbloom-soft-purple/30 rounded animate-pulse w-2/3"></div>
              <div className="h-10 bg-mindbloom-soft-purple/20 rounded animate-pulse"></div>
              <div className="h-4 bg-mindbloom-soft-purple/30 rounded animate-pulse w-1/2"></div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="dashboard-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="card-title">Mood Overview</h3>
                <BarChart2 className="h-5 w-5 text-mindbloom-primary" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Smile className="h-5 w-5 text-green-500 mr-2" /> Positive
                  </span>
                  <span className="font-medium">{moodCounts.positive}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Meh className="h-5 w-5 text-amber-500 mr-2" /> Neutral
                  </span>
                  <span className="font-medium">{moodCounts.neutral}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Frown className="h-5 w-5 text-red-500 mr-2" /> Negative
                  </span>
                  <span className="font-medium">{moodCounts.negative}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Positive Mood Score</span>
                    <span>{calculateMoodPercentage()}%</span>
                  </div>
                  <Progress value={calculateMoodPercentage()} className="h-2" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link to="/weekly-summary">
                  <Button variant="link" className="p-0 text-mindbloom-primary">
                    View detailed insights <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
            
            <Card className="dashboard-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="card-title">Calendar View</h3>
                <Calendar className="h-5 w-5 text-mindbloom-primary" />
              </div>
              <p className="text-muted-foreground mb-4">
                Track your emotional patterns over time with our mood calendar.
              </p>
              <div className="mt-4 pt-4 border-t">
                <Link to="/mood-calendar">
                  <Button className="w-full bg-mindbloom-primary hover:bg-mindbloom-secondary">
                    View Mood Calendar
                  </Button>
                </Link>
              </div>
            </Card>
            
            <Card className="dashboard-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="card-title">Quick Access</h3>
                <Target className="h-5 w-5 text-mindbloom-primary" />
              </div>
              <div className="space-y-3">
                <Link to="/goals-feelings">
                  <Button variant="outline" className="w-full justify-start border-mindbloom-soft-purple">
                    <Target className="mr-2 h-4 w-4 text-mindbloom-secondary" /> 
                    Goals & Feelings
                  </Button>
                </Link>
                <Link to="/cycle-tracking">
                  <Button variant="outline" className="w-full justify-start border-mindbloom-soft-purple">
                    <Moon className="mr-2 h-4 w-4 text-mindbloom-secondary" /> 
                    Cycle Tracking
                  </Button>
                </Link>
                <Link to="/journal">
                  <Button variant="outline" className="w-full justify-start border-mindbloom-soft-purple">
                    <BookOpen className="mr-2 h-4 w-4 text-mindbloom-secondary" /> 
                    Journal
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
          
          {/* Recent Entries */}
          <h2 className="text-2xl font-semibold mb-4 text-mindbloom-secondary">
            Recent Journal Entries
          </h2>
          
          {recentEntries.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {recentEntries.map((entry) => (
                <Card key={entry.id} className="journal-card">
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-medium text-mindbloom-tertiary">
                      {entry.title || format(new Date(entry.date), "MMMM d, yyyy")}
                    </div>
                    <div className="flex items-center">
                      {getMoodIcon(entry.mood)}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">
                    {format(new Date(entry.date), "EEEE, MMMM d")}
                  </p>
                  <p className="line-clamp-3 text-sm">
                    {entry.content}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="mb-4">
                <BookOpen className="h-12 w-12 text-mindbloom-primary/50 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-mindbloom-tertiary mb-2">
                No journal entries yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start capturing your thoughts and emotions in your personal journal.
              </p>
              <Link to="/journal">
                <Button className="bg-mindbloom-primary hover:bg-mindbloom-secondary">
                  Create Your First Entry
                </Button>
              </Link>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
