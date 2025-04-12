
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  BookOpen, 
  Calendar, 
  BarChart, 
  Target, 
  Moon, 
  Lock, 
  Bot,
  Check
} from "lucide-react";

const Features = () => {
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
            <Link to="/features" className="text-mindbloom-primary font-medium">
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

      <div className="container max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-mindbloom-secondary mb-6 text-center">
          Features
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 text-center">
          Discover the tools that will help you understand your emotions, track your growth,
          and nurture your mental well-being.
        </p>
        
        {/* Feature Sections */}
        <div className="space-y-16">
          {/* Journal */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl font-bold text-mindbloom-tertiary mb-4 flex items-center">
                <BookOpen className="mr-3 h-6 w-6 text-mindbloom-primary" /> Daily Journaling
              </h2>
              <p className="text-gray-700 mb-4">
                Capture your thoughts and emotions in a beautiful, simple interface designed for reflection.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                  <span>Track your mood with emoji tags and intensity levels</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                  <span>Add emotion tags to better categorize your feelings</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                  <span>Private journaling mode for sensitive thoughts</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                  <span>Search through past entries to track your growth</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button className="bg-mindbloom-primary hover:bg-mindbloom-secondary">
                  Start Journaling
                </Button>
              </Link>
            </div>
            <div className="order-1 md:order-2 bg-mindbloom-soft-purple rounded-xl p-6 shadow-lg">
              <div className="bg-white rounded-lg p-5 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-medium">Today's Journal</div>
                  <div className="flex space-x-1">
                    <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                    <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                    <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {["Happy 😊", "Grateful 🙏", "Peaceful 😇"].map((mood, i) => (
                      <span key={i} className="px-3 py-1 text-xs rounded-full bg-mindbloom-soft-purple/50">
                        {mood}
                      </span>
                    ))}
                  </div>
                  <div className="h-32 bg-gray-50 rounded-md border border-gray-200 p-3 text-sm text-gray-500">
                    Today I'm feeling grateful for the small moments of joy...
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" className="bg-mindbloom-primary text-white">Save Entry</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mood Calendar */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-mindbloom-soft-green rounded-xl p-6 shadow-lg">
              <div className="bg-white rounded-lg p-5 shadow-inner">
                <div className="text-center font-medium mb-3">April 2023</div>
                <div className="grid grid-cols-7 gap-1 text-xs text-center mb-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <div key={i}>{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array(31).fill(null).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-8 w-full flex items-center justify-center rounded-md text-xs ${
                        i % 3 === 0 
                          ? 'bg-green-100' 
                          : i % 5 === 0 
                          ? 'bg-blue-100' 
                          : i % 7 === 0 
                          ? 'bg-red-100' 
                          : 'bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-mindbloom-tertiary mb-4 flex items-center">
                <Calendar className="mr-3 h-6 w-6 text-mindbloom-primary" /> Mood Calendar
              </h2>
              <p className="text-gray-700 mb-4">
                Visualize your emotional journey with a beautiful, interactive calendar that reflects your moods over time.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                  <span>See your mood patterns at a glance with color-coded days</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                  <span>Track your emotional trends across weeks and months</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                  <span>Identify patterns related to specific events or cycles</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                  <span>Click on any day to view detailed journal entries</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button className="bg-mindbloom-primary hover:bg-mindbloom-secondary">
                  Explore the Calendar
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Weekly Insights */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl font-bold text-mindbloom-tertiary mb-4 flex items-center">
                <BarChart className="mr-3 h-6 w-6 text-mindbloom-primary" /> Weekly Insights
              </h2>
              <p className="text-gray-700 mb-4">
                Get a clear summary of your emotional landscape with weekly mood analysis and journaling statistics.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                  <span>Visualize your dominant moods each week</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                  <span>Track your journaling consistency and patterns</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                  <span>Identify emotional triggers and positive influences</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                  <span>Receive personalized insights based on your entries</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button className="bg-mindbloom-primary hover:bg-mindbloom-secondary">
                  Unlock Insights
                </Button>
              </Link>
            </div>
            <div className="order-1 md:order-2 bg-mindbloom-soft-blue rounded-xl p-6 shadow-lg">
              <div className="bg-white rounded-lg p-5 shadow-inner">
                <div className="font-medium mb-3">Weekly Mood Summary</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Happy 😊</span>
                    <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-400 h-2.5 rounded-full w-3/4"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Neutral 😐</span>
                    <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gray-400 h-2.5 rounded-full w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Anxious 😰</span>
                    <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                      <div className="bg-amber-400 h-2.5 rounded-full w-1/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Features Grid */}
          <div>
            <h2 className="text-2xl font-bold text-mindbloom-tertiary mb-8 text-center">
              More Powerful Features
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-mindbloom-soft-purple rounded-full flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-mindbloom-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-mindbloom-tertiary">Goals & Feelings</h3>
                <p className="text-gray-600 text-sm">
                  Connect your emotional journey to your personal growth goals and track your progress.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-mindbloom-soft-pink rounded-full flex items-center justify-center mb-4">
                  <Moon className="h-6 w-6 text-mindbloom-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-mindbloom-tertiary">Cycle Tracking</h3>
                <p className="text-gray-600 text-sm">
                  Track cycle-related mood changes for deeper understanding of your emotional patterns.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-mindbloom-soft-green rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-mindbloom-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-mindbloom-tertiary">Emotion Lockbox</h3>
                <p className="text-gray-600 text-sm">
                  A secure, private space for your most sensitive thoughts and feelings.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-mindbloom-soft-blue rounded-full flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-mindbloom-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-mindbloom-tertiary">AI-Powered Notes</h3>
                <p className="text-gray-600 text-sm">
                  Generate personalized notes from your future self based on your emotional patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-mindbloom-secondary mb-6">
            Ready to Start Your Emotional Journey?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of users who are discovering deeper emotional awareness and 
            personal growth through MindBloom.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-mindbloom-primary hover:bg-mindbloom-secondary text-white text-lg px-8 py-6">
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
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
              <Link to="/features" className="text-mindbloom-primary hover:text-mindbloom-secondary transition-colors">
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

export default Features;
