
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, BookOpen, Calendar, BarChart2, Target, Moon, Bot } from "lucide-react";

const About = () => {
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
            <Link to="/about" className="text-mindbloom-primary font-medium">
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

      <div className="container max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-mindbloom-secondary mb-6 text-center">About MindBloom</h1>
        
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <h2 className="text-2xl font-semibold text-mindbloom-tertiary mb-6">Our Story</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            MindBloom was created with a simple mission: to help people develop deeper emotional awareness
            and foster personal growth through mindful journaling and mood tracking.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            We believe that understanding our emotional patterns is the foundation of well-being and personal 
            development. By providing tools to track, visualize, and reflect on your emotional journey, 
            MindBloom empowers you to cultivate self-awareness and emotional intelligence.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Our platform is designed to be a safe, private space for emotional exploration. Whether you're 
            navigating daily stresses, working toward personal goals, or simply wanting to understand yourself 
            better, MindBloom provides the structure and insights to support your journey.
          </p>
          
          <div className="border-l-4 border-mindbloom-primary pl-4 py-2 mb-6">
            <p className="text-mindbloom-tertiary italic">
              "The journey of self-discovery begins with acknowledging how we feel in each moment."
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <h2 className="text-2xl font-semibold text-mindbloom-tertiary mb-6">Our Philosophy</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-medium text-mindbloom-secondary mb-3 flex items-center">
                <Heart className="mr-2 h-5 w-5 text-mindbloom-primary" /> Emotional Awareness
              </h3>
              <p className="text-gray-700">
                We believe that acknowledging and understanding our emotions is the first step toward 
                psychological well-being and personal growth.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-mindbloom-secondary mb-3 flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-mindbloom-primary" /> Pattern Recognition
              </h3>
              <p className="text-gray-700">
                By tracking emotions over time, we can identify patterns that influence our well-being 
                and make informed choices about our lives.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-mindbloom-secondary mb-3 flex items-center">
                <Target className="mr-2 h-5 w-5 text-mindbloom-primary" /> Intentional Growth
              </h3>
              <p className="text-gray-700">
                Setting meaningful goals and connecting them to our emotional journey creates a pathway 
                for purposeful development.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-mindbloom-secondary mb-3 flex items-center">
                <Bot className="mr-2 h-5 w-5 text-mindbloom-primary" /> Technological Support
              </h3>
              <p className="text-gray-700">
                We harness technology thoughtfully to provide insights and guidance while maintaining 
                the human-centered nature of emotional work.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-mindbloom-tertiary mb-6">Join Our Community</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            MindBloom is more than just a tool—it's a community of people committed to emotional growth 
            and well-being. By joining MindBloom, you become part of a movement that values emotional 
            intelligence and authentic living.
          </p>
          
          <div className="text-center">
            <Link to="/signup">
              <Button size="lg" className="bg-mindbloom-primary hover:bg-mindbloom-secondary text-white text-lg px-8 py-6">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

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
              <Link to="/about" className="text-mindbloom-primary hover:text-mindbloom-secondary transition-colors">
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

export default About;
