
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Heart, 
  BarChart, 
  Calendar, 
  Target, 
  Moon, 
  Lock, 
  Bot 
} from "lucide-react";

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-mindbloom-soft-purple/40 to-white">
      {/* Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
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
            <Link to="/contact" className="text-mindbloom-tertiary hover:text-mindbloom-primary transition-colors">
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-mindbloom-secondary animate-fade-in">
            <span className="block">Your emotions,</span>
            <span className="text-mindbloom-primary">visualized</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12">
            A minimalist mood journaling and emotional insight platform for personal growth and mental flourishing.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-mindbloom-primary hover:bg-mindbloom-secondary text-white text-lg px-8 py-6">
                Start Journaling <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="outline" className="text-mindbloom-tertiary border-mindbloom-tertiary hover:bg-mindbloom-soft-purple/50 text-lg px-8 py-6">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-mindbloom-secondary">
            Discover Emotional Clarity
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-mindbloom-soft-purple/30 rounded-xl p-6 transition-transform hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-mindbloom-primary rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-mindbloom-tertiary">Daily Journaling</h3>
              <p className="text-gray-600">Capture your emotions with text and sentiment tags in a beautiful, simple interface.</p>
            </div>
            
            <div className="bg-mindbloom-soft-green/30 rounded-xl p-6 transition-transform hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-mindbloom-primary rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-mindbloom-tertiary">Mood Calendar</h3>
              <p className="text-gray-600">Visualize your emotional journey with an interactive heatmap calendar.</p>
            </div>
            
            <div className="bg-mindbloom-soft-blue/30 rounded-xl p-6 transition-transform hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-mindbloom-primary rounded-full flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-mindbloom-tertiary">Weekly Insights</h3>
              <p className="text-gray-600">Get a summary of your dominant moods and journaling habits each week.</p>
            </div>
            
            <div className="bg-mindbloom-soft-pink/30 rounded-xl p-6 transition-transform hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-mindbloom-primary rounded-full flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-mindbloom-tertiary">Goal Tracking</h3>
              <p className="text-gray-600">Connect your emotional journey to your personal growth goals.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="bg-mindbloom-soft-purple/30 rounded-xl p-6 transition-transform hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-mindbloom-primary rounded-full flex items-center justify-center mb-4">
                <Moon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-mindbloom-tertiary">Cycle Tracking</h3>
              <p className="text-gray-600">Track cycle-related mood changes for deeper emotional understanding.</p>
            </div>
            
            <div className="bg-mindbloom-soft-green/30 rounded-xl p-6 transition-transform hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-mindbloom-primary rounded-full flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-mindbloom-tertiary">Emotion Lockbox</h3>
              <p className="text-gray-600">A secure, private space for your most sensitive thoughts and feelings.</p>
            </div>
            
            <div className="bg-mindbloom-soft-blue/30 rounded-xl p-6 transition-transform hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-mindbloom-primary rounded-full flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-mindbloom-tertiary">AI Insights</h3>
              <p className="text-gray-600">Generate personalized notes to your future self based on your emotional patterns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-mindbloom-primary/20 to-mindbloom-soft-purple/40">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-mindbloom-secondary">
            Begin Your Emotional Journey Today
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10">
            Join thousands of users discovering deeper emotional awareness and personal growth through MindBloom's simple yet powerful tools.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-mindbloom-primary hover:bg-mindbloom-secondary text-white text-lg px-8 py-6">
              Start Journaling <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
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
              <Link to="/contact" className="text-mindbloom-tertiary hover:text-mindbloom-primary transition-colors">
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

export default LandingPage;
