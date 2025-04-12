
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
import { format, addMonths } from "date-fns";
import { 
  CalendarIcon, 
  Wand2,
  Bot,
  Save,
  Download,
  Mail,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const AINotePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiNoteLoading, setAiNoteLoading] = useState(false);
  const [aiNote, setAiNote] = useState<string>("");
  const [futureDate, setFutureDate] = useState<Date | undefined>(addMonths(new Date(), 3));
  const [timeframe, setTimeframe] = useState("3months");
  const [noteType, setNoteType] = useState("motivational");
  const [recentMoods, setRecentMoods] = useState<{mood: string; count: number}[]>([]);
  const [recentGoals, setRecentGoals] = useState<string[]>([]);
  const [journalCount, setJournalCount] = useState(0);
  const [customPrompt, setCustomPrompt] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch moods from journal entries
      const { data: journalData, error: journalError } = await supabase
        .from("journal_entries")
        .select("mood")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30);
      
      if (journalError) throw journalError;
      
      // Calculate mood counts
      const moodMap = new Map<string, number>();
      
      journalData?.forEach(entry => {
        const count = moodMap.get(entry.mood) || 0;
        moodMap.set(entry.mood, count + 1);
      });
      
      const moodCountArray = Array.from(moodMap.entries())
        .map(([mood, count]) => ({ mood, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 moods
      
      setRecentMoods(moodCountArray);
      
      // Get total journal count
      const { count, error: countError } = await supabase
        .from("journal_entries")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      
      if (countError) throw countError;
      
      setJournalCount(count || 0);
      
      // Fetch goals
      const { data: goalsData, error: goalsError } = await supabase
        .from("goals")
        .select("title")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (goalsError) throw goalsError;
      
      setRecentGoals(goalsData?.map(goal => goal.title) || []);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch user data",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTimeframeText = (timeframe: string): string => {
    switch (timeframe) {
      case "1month": return "1 month";
      case "3months": return "3 months";
      case "6months": return "6 months";
      case "1year": return "1 year";
      default: return "future";
    }
  };

  const handleGenerateNote = async () => {
    if (!user) return;
    
    try {
      setAiNoteLoading(true);
      
      const moodText = recentMoods.length > 0
        ? `Your most frequent moods recently have been: ${recentMoods.map(m => m.mood).join(", ")}.`
        : "You haven't recorded many moods yet.";
      
      const goalsText = recentGoals.length > 0
        ? `You're working on these goals: ${recentGoals.join(", ")}.`
        : "You haven't set any specific goals yet.";
      
      const journalText = journalCount > 0
        ? `You've written ${journalCount} journal entries, reflecting on your emotional journey.`
        : "You're just beginning your journaling journey.";
      
      const timeframeText = getTimeframeText(timeframe);
      
      let promptBase = "";
      
      switch (noteType) {
        case "motivational":
          promptBase = `Write a motivational letter from my future self ${timeframeText} from now. ${moodText} ${goalsText} ${journalText} Make it encouraging and inspiring.`;
          break;
        case "reflective":
          promptBase = `Write a reflective letter from my future self ${timeframeText} from now, looking back on my growth. ${moodText} ${goalsText} ${journalText} Focus on emotional growth and wisdom gained.`;
          break;
        case "practical":
          promptBase = `Write a practical letter from my future self ${timeframeText} from now with actionable advice. ${moodText} ${goalsText} ${journalText} Include specific steps I could take.`;
          break;
        case "custom":
          promptBase = customPrompt || "Write a letter from my future self.";
          break;
      }
      
      // In a real application, this would call an API
      // For demo purposes, we'll simulate an AI response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a sample response based on the inputs
      const sampleResponse = generateSampleResponse(promptBase, timeframeText, recentMoods, recentGoals);
      
      setAiNote(sampleResponse);
      
      toast({
        title: "Success",
        description: "Your AI note has been generated",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate AI note",
      });
    } finally {
      setAiNoteLoading(false);
    }
  };

  const generateSampleResponse = (
    prompt: string, 
    timeframe: string, 
    moods: {mood: string; count: number}[], 
    goals: string[]
  ): string => {
    // This is a simplified simulation - in a real app, you'd call an AI API
    const date = format(futureDate || addMonths(new Date(), 3), "MMMM d, yyyy");
    
    const dominantMood = moods.length > 0 ? moods[0].mood.toLowerCase() : "reflective";
    const userName = user?.email?.split('@')[0] || "Friend";
    
    let letter = `Dear ${userName},\n\n`;
    
    letter += `I'm writing to you from ${date}, ${timeframe} into your future. `;
    
    if (noteType === "motivational") {
      letter += `I wanted to reach out and tell you how proud I am of the journey you've been on. `;
      
      if (moods.length > 0) {
        if (["Happy", "Excited", "Grateful", "Content", "Peaceful"].includes(moods[0].mood)) {
          letter += `I see that you've been feeling ${moods[0].mood.toLowerCase()} lately, and I want you to know that your positive outlook has been building a foundation for even greater happiness. `;
        } else if (["Sad", "Angry", "Anxious", "Frustrated", "Overwhelmed"].includes(moods[0].mood)) {
          letter += `I noticed you've been feeling ${moods[0].mood.toLowerCase()} lately. Those challenging emotions have taught you resilience, and I want you to know things do get better. `;
        } else {
          letter += `I can see that you've been experiencing a range of emotions. This emotional awareness has been key to your growth. `;
        }
      }
      
      if (goals.length > 0) {
        letter += `I'm amazed at how far you've come with your goals, especially ${goals[0]}. Keep pushing forward - the results are worth it.\n\n`;
      } else {
        letter += `I encourage you to set meaningful goals. Having direction has made all the difference in my journey.\n\n`;
      }
      
      letter += `Remember that every journal entry, every moment of reflection, brings you closer to understanding yourself. The practice of emotional awareness you're building now is your superpower.\n\n`;
      
      letter += `When challenges come - and they will - remember that you have everything you need within you to overcome them. You are stronger and more capable than you realize.\n\n`;
      
      letter += `With love and belief in you,\n`;
      letter += `Your Future Self`;
      
    } else if (noteType === "reflective") {
      letter += `Looking back from where I stand now, I can see how much our emotional journey has shaped us. `;
      
      if (journalCount > 10) {
        letter += `Those ${journalCount} journal entries you've written have become a treasure trove of self-discovery. `;
      } else if (journalCount > 0) {
        letter += `The journaling practice you've started has blossomed into something truly meaningful. `;
      } else {
        letter += `The journaling practice you're about to begin will change everything. `;
      }
      
      if (moods.length > 0) {
        letter += `I remember feeling ${moods[0].mood.toLowerCase()} so often then. Now I understand how that emotion was teaching us about what we truly value.\n\n`;
      } else {
        letter += `I've learned that all emotions - even the difficult ones - have wisdom to offer when we listen closely.\n\n`;
      }
      
      if (goals.length > 0) {
        letter += `That goal of ${goals[0]} that seemed so important? It led us down an unexpected path that brought even greater fulfillment than we imagined.\n\n`;
      } else {
        letter += `The journey of discovering what truly matters to us has been illuminating. Sometimes the goals we haven't yet articulated are guiding us nonetheless.\n\n`;
      }
      
      letter += `The practice of noticing your emotions without judgment has become second nature to me now. This compassionate awareness has transformed how I relate to myself and others.\n\n`;
      
      letter += `Trust the unfolding of your path. The dots connect looking backward, and I'm grateful for every step of the journey - even the painful ones.\n\n`;
      
      letter += `With loving awareness,\n`;
      letter += `Your Future Self`;
      
    } else if (noteType === "practical") {
      letter += `I'm reaching out with some practical wisdom I've gained that might be helpful to you now. `;
      
      letter += `Here are three specific things I've learned that have made a significant difference:\n\n`;
      
      letter += `1. Consistent emotional check-ins. Take 5 minutes each morning to notice how you're feeling without trying to change anything. This simple practice has improved my emotional intelligence dramatically.\n\n`;
      
      if (moods.length > 0 && ["Anxious", "Overwhelmed", "Stressed"].includes(moods[0].mood)) {
        letter += `2. For managing ${moods[0].mood.toLowerCase()} feelings: I found that a 4-7-8 breathing technique (inhale for 4, hold for 7, exhale for 8) practiced for just 2 minutes can reset your nervous system. This has been life-changing.\n\n`;
      } else {
        letter += `2. Build transition rituals between activities. A 2-minute break to breathe and set an intention before moving to the next task has helped me stay present and reduced my stress significantly.\n\n`;
      }
      
      if (goals.length > 0) {
        letter += `3. About your goal of ${goals[0]}: break it down into weekly mini-goals. The consistency of small wins creates momentum that makes the bigger goal achievable.\n\n`;
      } else {
        letter += `3. Consider setting one 90-day goal that excites you but doesn't overwhelm you. The timeframe is long enough to accomplish something meaningful but short enough to stay motivated.\n\n`;
      }
      
      letter += `Remember to celebrate your progress, no matter how small. The habit of acknowledging growth reinforces positive change.\n\n`;
      
      letter += `I believe in your ability to implement these practices. They've made all the difference for me.\n\n`;
      
      letter += `With practical support,\n`;
      letter += `Your Future Self`;
      
    } else {
      // Custom note
      letter += `I've been reflecting on our journey, and wanted to share some thoughts with you.\n\n`;
      
      letter += `The path from where you are now to where I am has been filled with learning, growth, and unexpected turns. There have been challenges, certainly, but also moments of joy and discovery that I wouldn't trade for anything.\n\n`;
      
      if (moods.length > 0) {
        letter += `I remember feeling ${moods[0].mood.toLowerCase()} so often during this time. Those emotions were signposts, guiding us toward what truly matters.\n\n`;
      }
      
      if (goals.length > 0) {
        letter += `Keep focusing on ${goals[0]}. The effort you're putting in now is creating foundations for fulfillment that will sustain you in ways you can't yet imagine.\n\n`;
      }
      
      letter += `Trust yourself. The wisdom you seek is already within you, emerging through your practice of reflection and emotional awareness.\n\n`;
      
      letter += `With compassion and connection,\n`;
      letter += `Your Future Self`;
    }
    
    return letter;
  };

  const handleDownload = () => {
    if (!aiNote) return;
    
    const element = document.createElement("a");
    const file = new Blob([aiNote], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `FutureNote_${format(new Date(), "yyyy-MM-dd")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSetTimeframe = (value: string) => {
    setTimeframe(value);
    
    // Adjust future date based on timeframe
    const now = new Date();
    switch(value) {
      case "1month":
        setFutureDate(addMonths(now, 1));
        break;
      case "3months":
        setFutureDate(addMonths(now, 3));
        break;
      case "6months":
        setFutureDate(addMonths(now, 6));
        break;
      case "1year":
        setFutureDate(addMonths(now, 12));
        break;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title">AI Note to Future Self</h1>
        <p className="text-muted-foreground mb-4">
          Generate a personalized letter using AI based on your emotional trends and goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="card-title">Note Settings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Customize your AI-generated note
              </p>
            </div>

            <div>
              <Label>Future Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-2"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {futureDate ? (
                      format(futureDate, "MMMM d, yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={futureDate}
                    onSelect={setFutureDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Timeframe</Label>
              <RadioGroup 
                value={timeframe} 
                onValueChange={handleSetTimeframe}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1month" id="1month" />
                  <Label htmlFor="1month" className="cursor-pointer">1 month from now</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3months" id="3months" />
                  <Label htmlFor="3months" className="cursor-pointer">3 months from now</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6months" id="6months" />
                  <Label htmlFor="6months" className="cursor-pointer">6 months from now</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1year" id="1year" />
                  <Label htmlFor="1year" className="cursor-pointer">1 year from now</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Note Type</Label>
              <RadioGroup 
                value={noteType} 
                onValueChange={setNoteType}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="motivational" id="motivational" />
                  <Label htmlFor="motivational" className="cursor-pointer">Motivational</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reflective" id="reflective" />
                  <Label htmlFor="reflective" className="cursor-pointer">Reflective</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="practical" id="practical" />
                  <Label htmlFor="practical" className="cursor-pointer">Practical Advice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom" className="cursor-pointer">Custom Prompt</Label>
                </div>
              </RadioGroup>
            </div>

            {noteType === "custom" && (
              <div>
                <Label htmlFor="customPrompt">Custom Prompt</Label>
                <Textarea
                  id="customPrompt"
                  placeholder="Write your custom prompt here..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="mt-2 h-24"
                />
              </div>
            )}

            <Button 
              onClick={handleGenerateNote}
              disabled={aiNoteLoading}
              className="w-full bg-mindbloom-primary hover:bg-mindbloom-secondary"
            >
              {aiNoteLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Generate Note
                </>
              )}
            </Button>
          </Card>

          <Card className="p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="card-title">Data Insights</h3>
              <Bot className="h-5 w-5 text-mindbloom-primary" />
            </div>
            
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-8 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Journal Entries</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{journalCount} entries</span>
                    <Clock className="h-4 w-4 text-mindbloom-primary/70" />
                  </div>
                </div>
                
                {recentMoods.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Top Moods</h4>
                    <div className="space-y-1">
                      {recentMoods.map((mood, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-muted-foreground">{mood.mood}</span>
                          <span className="text-sm">{mood.count}x</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {recentGoals.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Recent Goals</h4>
                    <div className="space-y-1">
                      {recentGoals.map((goal, index) => (
                        <div key={index} className="text-muted-foreground text-sm line-clamp-1">
                          • {goal}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(recentMoods.length === 0 || recentGoals.length === 0) && (
                  <div className="text-sm bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start">
                    <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-amber-800">
                        For better AI notes, continue adding journal entries and goals to provide more data.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="card-title">
                Your Note to Future Self
              </h3>
              
              {aiNote && (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDownload}
                    className="text-mindbloom-primary border-mindbloom-soft-purple"
                  >
                    <Download className="h-4 w-4 mr-2" /> Save
                  </Button>
                </div>
              )}
            </div>
            
            {aiNoteLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-mindbloom-soft-purple border-t-mindbloom-primary rounded-full animate-spin mb-4"></div>
                <p className="text-lg text-mindbloom-secondary">Crafting your personalized note...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Analyzing your emotional patterns and insights
                </p>
              </div>
            ) : aiNote ? (
              <div className="bg-mindbloom-soft-purple/20 rounded-lg p-6 font-serif relative">
                <div className="absolute top-4 right-4 text-mindbloom-primary/40">
                  <Mail className="h-6 w-6" />
                </div>
                
                {futureDate && (
                  <div className="text-right text-sm text-mindbloom-tertiary mb-4">
                    {format(futureDate, "MMMM d, yyyy")}
                  </div>
                )}
                
                <div className="prose prose-sm max-w-none whitespace-pre-line">
                  {aiNote}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Bot className="h-16 w-16 text-mindbloom-primary/30 mb-4" />
                <h3 className="text-xl font-medium text-mindbloom-tertiary mb-2">
                  No Note Generated Yet
                </h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Your AI-generated note will appear here. Customize the settings on the left
                  and click "Generate Note" to create a personalized message from your future self.
                </p>
                <Button 
                  onClick={handleGenerateNote}
                  className="bg-mindbloom-primary hover:bg-mindbloom-secondary"
                >
                  <Wand2 className="mr-2 h-4 w-4" /> Generate Note
                </Button>
              </div>
            )}
          </Card>
          
          {aiNote && (
            <div className="mt-4 text-sm text-muted-foreground italic text-center">
              <p>
                Note: This AI-generated content is for personal reflection and inspiration.
                For a more personalized experience, continue journaling and tracking your moods.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AINotePage;
