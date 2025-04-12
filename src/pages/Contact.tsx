
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Phone, 
  MapPin,
  Twitter,
  Instagram,
  Facebook,
  Linkedin
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Contact = () => {
  const isMobile = useIsMobile();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill out all required fields",
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid email address",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Simulate form submission with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success notification
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-mindbloom-soft-purple/40 to-white">
      {/* Navigation */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-mindbloom-primary flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <span className="text-xl font-bold text-mindbloom-tertiary">MindBloom</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="text-mindbloom-tertiary hover:text-mindbloom-primary transition-colors">
              About
            </Link>
            <Link to="/features" className="text-mindbloom-tertiary hover:text-mindbloom-primary transition-colors">
              Features
            </Link>
            <Link to="/help" className="text-mindbloom-tertiary hover:text-mindbloom-primary transition-colors">
              Help
            </Link>
            <Link to="/contact" className="text-mindbloom-primary font-medium">
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center space-x-3">
            <Link to="/signin">
              <Button variant="ghost" className="text-mindbloom-tertiary hover:text-mindbloom-primary hover:bg-mindbloom-soft-purple/50">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-mindbloom-primary hover:bg-mindbloom-secondary text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-mindbloom-secondary mb-6 text-center">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 text-center">
          Have questions or feedback? We'd love to hear from you.
        </p>
        
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-semibold text-mindbloom-tertiary mb-6 flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-mindbloom-primary" /> Send a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="What's this about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 min-h-[150px]"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-mindbloom-primary hover:bg-mindbloom-secondary"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-semibold text-mindbloom-tertiary mb-6 flex items-center">
                <Mail className="mr-2 h-5 w-5 text-mindbloom-primary" /> Contact Information
              </h2>
              
              <div className="space-y-5">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-mindbloom-primary mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">support@mindbloom.com</p>
                    <p className="text-gray-600">info@mindbloom.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-mindbloom-primary mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">Mon-Fri, 9am-5pm PST</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-mindbloom-primary mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-gray-600">
                      123 Mindful Street<br />
                      San Francisco, CA 94103<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-semibold text-mindbloom-tertiary mb-6">
                Follow Us
              </h2>
              
              <div className="flex justify-around">
                <a href="#" className="p-3 rounded-full bg-mindbloom-soft-purple text-mindbloom-primary hover:bg-mindbloom-soft-purple/70 transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="p-3 rounded-full bg-mindbloom-soft-purple text-mindbloom-primary hover:bg-mindbloom-soft-purple/70 transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="p-3 rounded-full bg-mindbloom-soft-purple text-mindbloom-primary hover:bg-mindbloom-soft-purple/70 transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="p-3 rounded-full bg-mindbloom-soft-purple text-mindbloom-primary hover:bg-mindbloom-soft-purple/70 transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div className="bg-mindbloom-primary/10 rounded-xl p-6 border border-mindbloom-primary/20">
              <h3 className="font-medium text-lg text-mindbloom-tertiary mb-2">
                Need quick help?
              </h3>
              <p className="text-gray-600 mb-4">
                Check our comprehensive <Link to="/help" className="text-mindbloom-primary hover:underline">Help Center</Link> for
                answers to frequently asked questions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-12 mt-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-mindbloom-primary flex items-center justify-center text-white font-bold">
                M
              </div>
              <span className="text-lg font-bold text-mindbloom-tertiary">MindBloom</span>
            </div>
            
            <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0 mb-6 md:mb-0">
              <Link to="/about" className="text-mindbloom-tertiary hover:text-mindbloom-primary transition-colors">
                About
              </Link>
              <Link to="/features" className="text-mindbloom-tertiary hover:text-mindbloom-primary transition-colors">
                Features
              </Link>
              <Link to="/help" className="text-mindbloom-tertiary hover:text-mindbloom-primary transition-colors">
                Help
              </Link>
              <Link to="/contact" className="text-mindbloom-primary hover:text-mindbloom-secondary transition-colors">
                Contact
              </Link>
            </div>
            
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} MindBloom. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
