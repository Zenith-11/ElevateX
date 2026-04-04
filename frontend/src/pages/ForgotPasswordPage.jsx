import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { authApi } from '../lib/authApi';
import { useToast } from '../components/ui/Toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      setIsSent(true);
      toast.success('Reset instructions sent!');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we'll send you reset instructions"
    >
      {isSent ? (
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-success-bg border border-success/20 flex items-center justify-center mx-auto">
            <Mail size={22} className="text-success" />
          </div>
          <div>
            <p className="text-sm text-text-primary font-medium">Check your email</p>
            <p className="text-sm text-text-secondary mt-1">
              If an account with that email exists, we've sent password reset instructions.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover transition-colors"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="forgot-email"
            label="Email address"
            type="email"
            placeholder="you@company.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            autoComplete="email"
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
          >
            Send reset link
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              Back to sign in
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
