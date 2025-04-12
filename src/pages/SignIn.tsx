
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-tr from-mindbloom-soft-purple via-white to-mindbloom-soft-green">
      <div className="absolute top-4 left-4">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-mindbloom-secondary hover:text-mindbloom-primary transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-mindbloom-primary flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="font-semibold">MindBloom</span>
        </Link>
      </div>
      
      <Card className="w-full max-w-md shadow-lg border-mindbloom-soft-purple">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-mindbloom-secondary">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to continue your emotional journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-mindbloom-soft-purple focus-visible:ring-mindbloom-primary"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-mindbloom-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-mindbloom-soft-purple focus-visible:ring-mindbloom-primary"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-mindbloom-primary hover:bg-mindbloom-secondary"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center">
                  <LogIn className="mr-2 h-5 w-5" /> Sign In
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-mindbloom-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
