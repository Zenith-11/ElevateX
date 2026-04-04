import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, KeyRound, ArrowLeft } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { authApi } from '../lib/authApi';
import { useToast } from '../components/ui/Toast';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!token.trim()) newErrors.token = 'Reset token is required';
    if (!newPassword) newErrors.newPassword = 'New password is required';
    else if (newPassword.length < 8)
      newErrors.newPassword = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await authApi.resetPassword(token, newPassword);
      toast.success('Password reset successfully!');
      navigate('/login', { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.detail || 'Failed to reset password. The token may have expired.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your reset token and choose a new password"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="reset-token"
          label="Reset token"
          placeholder="Paste your reset token"
          icon={KeyRound}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          error={errors.token}
        />

        <Input
          id="reset-password"
          label="New password"
          type="password"
          placeholder="Min. 8 characters"
          icon={Lock}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors.newPassword}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full"
        >
          Reset password
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
    </AuthLayout>
  );
}
