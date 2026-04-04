import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building2 } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.department) delete payload.department;
      await register(payload);
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const detail = err.response?.data?.detail;
      const message =
        typeof detail === 'string'
          ? detail
          : 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Get started with ElevateX in seconds"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="register-name"
          label="Full name"
          placeholder="John Doe"
          icon={User}
          value={formData.name}
          onChange={handleChange('name')}
          error={errors.name}
          autoComplete="name"
        />

        <Input
          id="register-email"
          label="Email"
          type="email"
          placeholder="you@company.com"
          icon={Mail}
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          id="register-password"
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          icon={Lock}
          value={formData.password}
          onChange={handleChange('password')}
          error={errors.password}
          autoComplete="new-password"
        />

        <Input
          id="register-department"
          label="Department (optional)"
          placeholder="e.g. Engineering"
          icon={Building2}
          value={formData.department}
          onChange={handleChange('department')}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full"
          size="md"
        >
          Create account
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-border text-center">
        <p className="text-sm text-text-secondary">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary hover:text-primary-hover font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
