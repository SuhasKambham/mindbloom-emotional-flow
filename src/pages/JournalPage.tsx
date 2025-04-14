import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { 
  Save, 
  BookOpen, 
  Search, 
  Trash, 
  Edit, 
  Calendar, 
  Clock
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";

interface JournalEntry {
  id: string;
  created_at: string;
  user_id: string;
  date: string;
  title: string | null;
  content: string;
  mood: string;
  mood_intensity: number;
  tags: string[];
  is_private: boolean;
}

const moods = [
  { name: "Happy", emoji: "😊", color: "bg-green-100 text-green-800 border-green-300" },
  { name: "Excited", emoji: "🤩", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  { name: "Grateful", emoji: "🙏", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { name: "Content", emoji: "😌", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { name: "Peaceful", emoji: "😇", color: "bg-cyan-100 text-cyan-800 border-cyan-300" },
  { name: "Neutral", emoji: "😐", color: "bg-gray-100 text-gray-800 border-gray-300" },
  { name: "Tired", emoji: "😴", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  { name: "Bored", emoji: "🥱", color: "bg-slate-100 text-slate-800 border-slate-300" },
  { name: "Sad", emoji: "😢", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { name: "Angry", emoji: "😠", color: "bg-red-100 text-red-800 border-red-300" },
  { name: "Anxious", emoji: "😰", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { name: "Frustrated", emoji: "😤", color: "bg-orange-100 text-orange-800 border-orange-300" },
  { name: "Overwhelmed", emoji: "😩", color: "bg-rose-100 text-rose-800 border-rose-300" },
];

const emotionTags = [
  "Proud", "Inspired", "Loved", "Motivated", "Creative", 
  "Calm", "Hopeful", "Confident", "Focused", "Vulnerable",
  "Stressed", "Disappointed", "Confused", "Lonely", "Insecure"
];

const JournalPage = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  const [isNewEntry, setIsNewEntry] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("Neutral");
  const [moodIntensity, setMoodIntensity] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    fetchJournalEntries();
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEntries(entries);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = entries.filter(
        entry => 
          (entry.title?.toLowerCase().includes(lowercasedQuery) || false) ||
          entry.content.toLowerCase().includes(lowercasedQuery) ||
          entry.mood.toLowerCase().includes(lowercasedQuery) ||
          entry.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
      );
      setFilteredEntries(filtered);
    }
  }, [searchQuery, entries]);

  const fetchJournalEntries = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("journal_entries")
        .select()
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
      setFilteredEntries(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch journal entries",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setActiveEntry(null);
    setTitle("");
    setContent("");
    setSelectedMood("Neutral");
    setMoodIntensity(5);
    setSelectedTags([]);
    setIsPrivate(false);
    setIsNewEntry(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setActiveEntry(entry);
    setTitle(entry.title || "");
    setContent(entry.content);
    setSelectedMood(entry.mood);
    setMoodIntensity(entry.mood_intensity);
    setSelectedTags(entry.tags);
    setIsPrivate(entry.is_private);
    setIsNewEntry(false);
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      const today = new Date();
      const entryData = {
        user_id: user.id,
        date: format(today, "yyyy-MM-dd"),
        title: title.trim() || null,
        content,
        mood: selectedMood,
        mood_intensity: moodIntensity,
        tags: selectedTags,
        is_private: isPrivate,
      };

      if (isNewEntry) {
        const { data, error } = await supabase
          .from("journal_entries")
          .insert([entryData])
          .select();

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Journal entry created successfully",
        });
        
        if (data && data.length > 0) {
          setEntries(prev => [data[0], ...prev]);
        }
      } else if (activeEntry) {
        const { error } = await supabase
          .from("journal_entries")
          .update(entryData)
          .eq("id", activeEntry.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Journal entry updated successfully",
        });
        
        setEntries(prev => 
          prev.map(entry => 
            entry.id === activeEntry.id 
              ? { ...entry, ...entryData } 
              : entry
          )
        );
      }

      setIsNewEntry(false);
      setActiveEntry(null);
      setTitle("");
      setContent("");
      setSelectedMood("Neutral");
      setMoodIntensity(5);
      setSelectedTags([]);
      setIsPrivate(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save journal entry",
      });
    }
  };

  const handleDelete = async () => {
    if (!activeEntry) return;

    try {
      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", activeEntry.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Journal entry deleted successfully",
      });
      
      setEntries(prev => prev.filter(entry => entry.id !== activeEntry.id));
      setActiveEntry(null);
      setDeleteDialogOpen(false);
      setIsNewEntry(false);
      
      setTitle("");
      setContent("");
      setSelectedMood("Neutral");
      setMoodIntensity(5);
      setSelectedTags([]);
      setIsPrivate(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete journal entry",
      });
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
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

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">Journal</h1>

      <Tabs defaultValue="entries" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="entries" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" /> Entries
          </TabsTrigger>
          <TabsTrigger value="write" className="flex items-center">
            <Edit className="mr-2 h-4 w-4" /> {isNewEntry ? "New Entry" : activeEntry ? "Edit Entry" : "Write"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search entries by title, content, mood or tags..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 space-y-4">
                  <div className="h-6 bg-mindbloom-soft-purple/30 rounded animate-pulse w-1/3"></div>
                  <div className="h-4 bg-mindbloom-soft-purple/20 rounded animate-pulse w-1/4"></div>
                  <div className="h-16 bg-mindbloom-soft-purple/30 rounded animate-pulse"></div>
                </Card>
              ))}
            </div>
          ) : filteredEntries.length > 0 ? (
            <div className="grid gap-4">
              {filteredEntries.map((entry) => (
                <Card 
                  key={entry.id} 
                  className="p-6 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleEditEntry(entry)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <h3 className="text-xl font-semibold text-mindbloom-tertiary">
                      {entry.title || format(new Date(entry.date), "EEEE, MMMM d, yyyy")}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`emotion-tag ${getMoodColor(entry.mood)} px-3 py-1 rounded-full text-sm border`}>
                        {getMoodEmoji(entry.mood)} {entry.mood}
                      </span>
                      {entry.is_private && (
                        <span className="emotion-tag bg-gray-100 text-gray-800 border-gray-300">
                          🔒 Private
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-3 gap-4">
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {format(new Date(entry.date), "MMM d, yyyy")}
                    </span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {format(new Date(entry.created_at), "h:mm a")}
                    </span>
                  </div>

                  <p className="line-clamp-3 mb-4">
                    {entry.content}
                  </p>

                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="emotion-tag bg-mindbloom-soft-purple/50 text-mindbloom-tertiary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="mb-4">
                <BookOpen className="h-12 w-12 text-mindbloom-primary/50 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-mindbloom-tertiary mb-2">
                {searchQuery ? "No entries match your search" : "No journal entries yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? "Try a different search term or clear your search" 
                  : "Start capturing your thoughts and emotions in your personal journal"}
              </p>
              <Button 
                onClick={handleCreateNew}
                className="bg-mindbloom-primary hover:bg-mindbloom-secondary"
              >
                Create Your First Entry
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="write">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  placeholder="Give your entry a title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="content">Your Thoughts</Label>
                <Textarea
                  id="content"
                  placeholder="What's on your mind today?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-2 min-h-[200px]"
                />
              </div>

              <div>
                <Label className="mb-2 block">How are you feeling?</Label>
                <div className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-7'} gap-2`}>
                  {moods.map((mood) => (
                    <button
                      key={mood.name}
                      type="button"
                      onClick={() => setSelectedMood(mood.name)}
                      className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                        selectedMood === mood.name
                          ? `${mood.color} border-2`
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-xs mt-1">{mood.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Intensity</Label>
                <div className="flex items-center gap-3">
                  <span className="text-sm">Mild</span>
                  <Slider
                    value={[moodIntensity]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => setMoodIntensity(value[0])}
                    className="flex-1"
                  />
                  <span className="text-sm">Intense</span>
                </div>
                <div className="text-center mt-1 text-sm text-muted-foreground">
                  {moodIntensity}/10
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Tags (Optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {emotionTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`emotion-tag border transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-mindbloom-soft-purple text-mindbloom-tertiary border-mindbloom-primary/40"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="private"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-mindbloom-primary focus:ring-mindbloom-primary"
                />
                <Label htmlFor="private" className="text-sm font-normal cursor-pointer">
                  Mark as private (only visible to you)
                </Label>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <div>
                  {!isNewEntry && activeEntry && (
                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete your journal entry.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleDelete}>
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsNewEntry(false);
                    setActiveEntry(null);
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={!content || !selectedMood}
                    className="bg-mindbloom-primary hover:bg-mindbloom-secondary"
                  >
                    <Save className="mr-2 h-4 w-4" /> Save
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JournalPage;
