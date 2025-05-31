
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Check for redirect URL in localStorage
      const redirectUrl = localStorage.getItem('redirectUrl');
      if (redirectUrl) {
        localStorage.removeItem('redirectUrl');
        navigate(redirectUrl);
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await resetPassword(email);
        
        if (error) {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Check your email',
            description: 'We sent you a password reset link.',
          });
          setIsForgotPassword(false);
          setEmail('');
        }
      } else {
        const { error } = isSignUp 
          ? await signUp(email, password)
          : await signIn(email, password);

        if (error) {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        } else if (isSignUp) {
          toast({
            title: 'Success',
            description: 'Account created successfully! You are now signed in.',
          });
          // Switch to sign in mode after successful signup
          setIsSignUp(false);
          setPassword(''); // Clear password for security
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (isForgotPassword) return 'Reset Password';
    return isSignUp ? 'Create Account' : 'Welcome Back';
  };

  const getButtonText = () => {
    if (loading) return 'Loading...';
    if (isForgotPassword) return 'Send Reset Link';
    return isSignUp ? 'Sign Up' : 'Sign In';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-12 w-12 text-field-green" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {getTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            {!isForgotPassword && (
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-field-green hover:bg-field-dark"
              disabled={loading}
            >
              {getButtonText()}
            </Button>
          </form>
          <div className="mt-4 text-center space-y-2">
            {!isForgotPassword && !isSignUp && (
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-sm text-field-green hover:underline block w-full"
              >
                Forgot your password?
              </button>
            )}
            {!isForgotPassword && (
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-field-green hover:underline"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            )}
            {isForgotPassword && (
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setEmail('');
                }}
                className="text-sm text-field-green hover:underline"
              >
                Back to sign in
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
