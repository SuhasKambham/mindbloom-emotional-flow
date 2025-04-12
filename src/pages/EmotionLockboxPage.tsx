import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { 
  Lock, 
  Plus, 
  Save, 
  Trash, 
  Search,
  Eye,
  EyeOff,
  LockIcon,
  ShieldAlert
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PrivateEntry } from "@/lib/supabase";

const EmotionLockboxPage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<PrivateEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<PrivateEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PrivateEntry | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Sample password - in a real app, this would be securely stored and managed
  const DEMO_PASSWORD = "mindbloom123";

  useEffect(() => {
    if (user && authorized) {
      fetchEntries();
    }
  }, [user, authorized]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEntries(entries);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = entries.filter(
        entry => 
          entry.title.toLowerCase().includes(lowercasedQuery) ||
          entry.content.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredEntries(filtered);
    }
  }, [searchQuery, entries]);

  const fetchEntries = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("private_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEntries(data as PrivateEntry[] || []);
      setFilteredEntries(data as PrivateEntry[] || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch private entries",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedEntry(null);
  };

  const handleAddEntry = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditEntry = (entry: PrivateEntry) => {
    setSelectedEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setShowForm(true);
  };

  const handleSaveEntry = async () => {
    if (!user) return;
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Title is required",
      });
      return;
    }

    try {
      const entryData = {
        user_id: user.id,
        title,
        content,
      };

      if (selectedEntry) {
        // Update
        const { error } = await supabase
          .from("private_entries")
          .update(entryData)
          .eq("id", selectedEntry.id);

        if (error) throw error;

        setEntries(prev => 
          prev.map(entry => entry.id === selectedEntry.id ? { ...entry, ...entryData } : entry)
        );

        toast({
          title: "Success",
          description: "Private entry updated successfully",
        });
      } else {
        // Create
        const { data, error } = await supabase
          .from("private_entries")
          .insert([entryData])
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          setEntries(prev => [data[0] as PrivateEntry, ...prev]);
        }

        toast({
          title: "Success",
          description: "Private entry saved successfully",
        });
      }

      resetForm();
      setShowForm(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save private entry",
      });
    }
  };

  const handleDeleteEntry = async () => {
    if (!selectedEntry) return;

    try {
      const { error } = await supabase
        .from("private_entries")
        .delete()
        .eq("id", selectedEntry.id);

      if (error) throw error;

      setEntries(prev => prev.filter(entry => entry.id !== selectedEntry.id));

      toast({
        title: "Success",
        description: "Private entry deleted successfully",
      });

      setConfirmDialog(false);
      resetForm();
      setShowForm(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete private entry",
      });
    }
  };

  const handleVerifyPassword = () => {
    if (password === DEMO_PASSWORD) {
      setAuthorized(true);
      setPasswordDialog(false);
      setPasswordError("");
      
      // In a real app, you would store this in a secure way
      sessionStorage.setItem("lockbox_authorized", "true");
      
      toast({
        title: "Authorized",
        description: "You now have access to your private thoughts",
      });
    } else {
      setPasswordError("Incorrect password");
    }
  };

  const toggleContentVisibility = () => {
    setContentVisible(!contentVisible);
  };

  return (
    <div className="animate-fade-in">
      {!authorized ? (
        <div className="animate-fade-in">
          <h1 className="page-title">Emotion Lockbox</h1>
          
          <Card className="max-w-md mx-auto p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-mindbloom-soft-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-mindbloom-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-mindbloom-tertiary mb-2">
                Secure Thoughts Space
              </h2>
              <p className="text-muted-foreground">
                Enter your password to access your private thoughts and emotions.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="password" className="sr-only">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  className="text-center"
                />
                {passwordError && (
                  <p className="text-destructive text-sm mt-1">{passwordError}</p>
                )}
              </div>
              
              <Button 
                onClick={handleVerifyPassword}
                className="w-full bg-mindbloom-primary hover:bg-mindbloom-secondary"
              >
                <Lock className="mr-2 h-4 w-4" /> Unlock
              </Button>
              
              <div className="text-xs text-muted-foreground pt-2">
                <p>For demonstration purposes, use: "mindbloom123"</p>
                <p className="mt-1">In a real app, this would use secure encryption</p>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div>
          <div className="mb-8">
            <h1 className="page-title">Emotion Lockbox</h1>
            <p className="text-muted-foreground mb-4">
              A secure, private space for your most sensitive thoughts and feelings.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your private entries..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={toggleContentVisibility}
                className="border-mindbloom-soft-purple"
              >
                {contentVisible ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" /> Hide Content
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" /> Show Content
                  </>
                )}
              </Button>
              <Button 
                onClick={handleAddEntry}
                className="bg-mindbloom-primary hover:bg-mindbloom-secondary"
              >
                <Plus className="mr-2 h-4 w-4" /> New Private Entry
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="p-6 space-y-4">
                  <div className="h-6 bg-mindbloom-soft-purple/30 rounded animate-pulse w-1/3"></div>
                  <div className="h-4 bg-mindbloom-soft-purple/20 rounded animate-pulse w-1/5"></div>
                  <div className="h-24 bg-mindbloom-soft-purple/30 rounded animate-pulse"></div>
                </Card>
              ))}
            </div>
          ) : showForm ? (
            <Card className="p-6">
              <h3 className="card-title mb-6">
                {selectedEntry ? "Edit Private Entry" : "New Private Entry"}
              </h3>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Give your entry a title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your private thoughts here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-2 min-h-[200px]"
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
                      disabled={!title}
                      className="bg-mindbloom-primary hover:bg-mindbloom-secondary"
                    >
                      <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : filteredEntries.length > 0 ? (
            <div className="grid gap-4">
              {filteredEntries.map(entry => (
                <Card 
                  key={entry.id} 
                  className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleEditEntry(entry)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-mindbloom-tertiary">
                      {entry.title}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(entry.created_at), "MMM d, yyyy")}
                    </div>
                  </div>
                  
                  {contentVisible ? (
                    <p className="text-muted-foreground">
                      {entry.content}
                    </p>
                  ) : (
                    <div className="flex items-center text-muted-foreground py-4">
                      <LockIcon className="h-4 w-4 mr-2" />
                      <span>Content hidden for privacy. Click "Show Content" to view.</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="mb-4">
                <ShieldAlert className="h-12 w-12 text-mindbloom-primary/50 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-mindbloom-tertiary mb-2">
                No private entries yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Create your first private entry to store sensitive thoughts securely
              </p>
              <Button 
                onClick={handleAddEntry}
                className="bg-mindbloom-primary hover:bg-mindbloom-secondary"
              >
                <Plus className="mr-2 h-4 w-4" /> Create Your First Entry
              </Button>
            </Card>
          )}

          <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your private entry.
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
      )}
    </div>
  );
};

export default EmotionLockboxPage;
