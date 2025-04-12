
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp, HelpCircle, MessageCircle, BookOpen, Mail } from "lucide-react";
import { useState } from "react";

// FAQ item interface
interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);

  // FAQ data
  const faqs: FaqItem[] = [
    {
      question: "How do I get started with MindBloom?",
      answer: (
        <div>
          <p className="mb-2">Getting started is easy! Just follow these steps:</p>
          <ol className="list-decimal list-inside space-y-1 pl-2">
            <li>Create an account by signing up with your email</li>
            <li>Access your dashboard</li>
            <li>Start by creating your first journal entry</li>
            <li>Explore other features like the Mood Calendar and Weekly Summary</li>
          </ol>
        </div>
      )
    },
    {
      question: "Is my data private and secure?",
      answer: (
        <div>
          <p>
            Yes, your privacy is our top priority. All your journal entries and personal data are encrypted 
            and stored securely. Only you can access your data, and we never share or sell your information 
            to third parties.
          </p>
        </div>
      )
    },
    {
      question: "How does the Mood Calendar work?",
      answer: (
        <div>
          <p>
            The Mood Calendar visualizes your emotional journey by color-coding days based on the moods you've 
            logged in your journal entries. This gives you a bird's-eye view of your emotional patterns over time.
            Click on any day to see the details of your journal entry for that day.
          </p>
        </div>
      )
    },
    {
      question: "What is the Emotion Lockbox feature?",
      answer: (
        <div>
          <p>
            The Emotion Lockbox is a secure, password-protected space for your most sensitive thoughts and feelings.
            Entries saved in the Lockbox have an additional layer of encryption, ensuring your private thoughts
            remain private.
          </p>
        </div>
      )
    },
    {
      question: "How is AI used in the Note to Future Self feature?",
      answer: (
        <div>
          <p>
            The AI Note feature analyzes your mood patterns, journaling habits, and goals to generate a personalized
            letter from your "future self." This feature provides encouragement, reflection, or practical advice
            based on your emotional data. The AI's role is to help you gain new perspectives on your emotional journey.
          </p>
        </div>
      )
    },
    {
      question: "Can I export my journal entries?",
      answer: (
        <div>
          <p>
            Yes! You can export your journal entries and mood data in various formats. This feature 
            is available in your account settings. You can choose to export all entries or select a specific 
            date range.
          </p>
        </div>
      )
    },
    {
      question: "How does the Cycle Tracking feature work?",
      answer: (
        <div>
          <p>
            The Cycle Tracking feature allows you to monitor how hormonal cycles affect your moods and emotions.
            You can log cycle days, symptoms, and emotions, then visualize patterns using our specialized 
            calendar view. This helps identify correlations between your cycle and emotional patterns.
          </p>
        </div>
      )
    },
    {
      question: "Is there a mobile app for MindBloom?",
      answer: (
        <div>
          <p>
            Currently, MindBloom is available as a web application that works on all devices, including 
            mobile browsers. Our responsive design ensures a great experience on smartphones and tablets.
            We're working on dedicated mobile apps which will be coming soon!
          </p>
        </div>
      )
    },
  ];

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery.trim() === ""
    ? faqs
    : faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (typeof faq.answer === 'string' && faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  // Toggle FAQ expansion
  const toggleFaq = (index: number) => {
    setExpandedFaqs(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
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
            <Link to="/help" className="text-mindbloom-primary font-medium">
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
        <h1 className="text-4xl font-bold text-mindbloom-secondary mb-6 text-center">Help Center</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 text-center">
          Find answers to common questions and learn how to make the most of MindBloom.
        </p>
        
        {/* Search */}
        <div className="relative mb-12 max-w-2xl mx-auto">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-mindbloom-primary focus:border-mindbloom-primary bg-white"
            placeholder="Search for help topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* FAQs */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <h2 className="text-2xl font-semibold text-mindbloom-tertiary mb-6 flex items-center">
            <HelpCircle className="mr-2 h-5 w-5 text-mindbloom-primary" /> Frequently Asked Questions
          </h2>
          
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button
                    className="w-full flex justify-between items-center p-4 text-left focus:outline-none focus:ring-2 focus:ring-mindbloom-primary/40"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-medium text-mindbloom-tertiary">{faq.question}</span>
                    {expandedFaqs.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-mindbloom-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-mindbloom-primary flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaqs.includes(index) && (
                    <div className="p-4 bg-gray-50 border-t text-gray-700">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No results found for "{searchQuery}"</p>
              <p className="text-sm text-gray-400">Try a different search term or browse the categories below</p>
            </div>
          )}
        </div>
        
        {/* Help Categories */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-full bg-mindbloom-soft-purple flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-mindbloom-primary" />
            </div>
            <h3 className="text-xl font-medium text-mindbloom-tertiary mb-2">User Guides</h3>
            <p className="text-gray-600 mb-4">
              Detailed guides on how to use all MindBloom features
            </p>
            <Link to="/help">
              <Button variant="link" className="p-0 h-auto text-mindbloom-primary hover:text-mindbloom-secondary">
                Browse guides
              </Button>
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-full bg-mindbloom-soft-green flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-mindbloom-primary" />
            </div>
            <h3 className="text-xl font-medium text-mindbloom-tertiary mb-2">Community Support</h3>
            <p className="text-gray-600 mb-4">
              Connect with other users and share journaling tips
            </p>
            <Link to="/help">
              <Button variant="link" className="p-0 h-auto text-mindbloom-primary hover:text-mindbloom-secondary">
                Join community
              </Button>
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-full bg-mindbloom-soft-blue flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-mindbloom-primary" />
            </div>
            <h3 className="text-xl font-medium text-mindbloom-tertiary mb-2">Contact Support</h3>
            <p className="text-gray-600 mb-4">
              Need personalized help? Our support team is ready
            </p>
            <Link to="/contact">
              <Button variant="link" className="p-0 h-auto text-mindbloom-primary hover:text-mindbloom-secondary">
                Contact us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-12 mt-12">
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
              <Link to="/help" className="text-mindbloom-primary hover:text-mindbloom-secondary transition-colors">
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

export default Help;
