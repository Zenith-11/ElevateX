import { useState } from 'react';
import { User, Mail, Building2, Lock, Save } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { userApi } from '../lib/userApi';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePasswordChange = (field) => (e) => {
    setPasswordData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const update = {};
      if (formData.name !== user?.name) update.name = formData.name;
      if (formData.department !== (user?.department || ''))
        update.department = formData.department || null;

      if (Object.keys(update).length === 0) {
        toast.info('No changes to save');
        setIsSaving(false);
        return;
      }

      await userApi.updateUser(user._id, update);
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!passwordData.newPassword)
      newErrors.newPassword = 'New password is required';
    else if (passwordData.newPassword.length < 8)
      newErrors.newPassword = 'Password must be at least 8 characters';

    if (passwordData.newPassword !== passwordData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsChangingPassword(true);
    try {
      await userApi.updateUser(user._id, {
        password: passwordData.newPassword,
      });
      setPasswordData({ newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Profile</h1>
        <p className="text-text-secondary mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Profile Header Card */}
      <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
          <span className="text-2xl font-semibold text-primary-light">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-text-primary">
              {user?.name}
            </h2>
            <Badge role={user?.role} />
          </div>
          <p className="text-sm text-text-secondary mt-0.5">{user?.email}</p>
        </div>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>Update your name and department</CardDescription>
        </CardHeader>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="profile-name"
              label="Full name"
              icon={User}
              value={formData.name}
              onChange={handleChange('name')}
            />
            <Input
              id="profile-department"
              label="Department"
              icon={Building2}
              placeholder="e.g. Engineering"
              value={formData.department}
              onChange={handleChange('department')}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="profile-email"
              label="Email"
              icon={Mail}
              value={user?.email || ''}
              disabled
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={isSaving}>
              <Save size={18} />
              Save changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>
            Choose a strong password with at least 8 characters
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="profile-new-password"
              label="New password"
              type="password"
              icon={Lock}
              placeholder="Min. 8 characters"
              value={passwordData.newPassword}
              onChange={handlePasswordChange('newPassword')}
              error={errors.newPassword}
              autoComplete="new-password"
            />
            <Input
              id="profile-confirm-password"
              label="Confirm new password"
              type="password"
              icon={Lock}
              placeholder="Repeat password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange('confirmPassword')}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="secondary"
              isLoading={isChangingPassword}
            >
              <Lock size={18} />
              Update password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
