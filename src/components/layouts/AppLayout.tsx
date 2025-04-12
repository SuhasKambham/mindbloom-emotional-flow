
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Home, 
  BookOpen, 
  BarChart2, 
  Target, 
  Moon,
  Lock, 
  Bot, 
  Menu, 
  X, 
  LogOut,
  User
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Journal", path: "/journal", icon: <BookOpen className="h-5 w-5" /> },
    { name: "Mood Calendar", path: "/mood-calendar", icon: <Calendar className="h-5 w-5" /> },
    { name: "Weekly Summary", path: "/weekly-summary", icon: <BarChart2 className="h-5 w-5" /> },
    { name: "Goals & Feelings", path: "/goals-feelings", icon: <Target className="h-5 w-5" /> },
    { name: "Cycle Tracking", path: "/cycle-tracking", icon: <Moon className="h-5 w-5" /> },
    { name: "Emotion Lockbox", path: "/emotion-lockbox", icon: <Lock className="h-5 w-5" /> },
    { name: "AI Note", path: "/ai-note", icon: <Bot className="h-5 w-5" /> },
  ];

  return (
    <div className="flex min-h-screen bg-mindbloom-soft-gray">
      {/* Mobile menu button */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-40">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleMobileMenu}
            className="bg-white shadow-md"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      )}

      {/* Sidebar navigation */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out 
          bg-white shadow-lg flex flex-col
          ${isMobile ? (mobileMenuOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        `}
      >
        <div className="p-4 border-b">
          <Link to="/dashboard" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <div className="w-10 h-10 rounded-full bg-mindbloom-primary flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <span className="text-xl font-bold text-mindbloom-tertiary">MindBloom</span>
          </Link>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="px-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-mindbloom-soft-purple flex items-center justify-center">
              <User className="h-4 w-4 text-mindbloom-secondary" />
            </div>
            <div className="text-sm truncate">
              {user?.email}
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Overlay to close menu when clicked outside on mobile */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20"
          onClick={closeMobileMenu}
        />
      )}

      {/* Main content */}
      <main className={`flex-1 ${isMobile ? 'pl-0' : 'pl-64'} transition-all duration-300`}>
        <div className="container max-w-6xl py-8 px-4 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
