import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Shield,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../lib/userApi';

const ROLES = ['admin', 'manager', 'employee'];
const PAGE_SIZE = 10;

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');

  // Role change modal
  const [roleModal, setRoleModal] = useState({ open: false, user: null, role: '' });
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();
  const { user: currentUser } = useAuth();

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await userApi.listUsers(page * PAGE_SIZE, PAGE_SIZE);
      setUsers(data);
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [page, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Role change
  const openRoleModal = (user) => {
    setRoleModal({ open: true, user, role: user.role });
  };

  const handleRoleChange = async () => {
    if (!roleModal.user || roleModal.role === roleModal.user.role) {
      setRoleModal({ open: false, user: null, role: '' });
      return;
    }
    setIsUpdatingRole(true);
    try {
      await userApi.updateUserRole(roleModal.user._id, roleModal.role);
      toast.success(`Role updated to ${roleModal.role}`);
      setRoleModal({ open: false, user: null, role: '' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update role');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // Delete
  const openDeleteModal = (user) => {
    setDeleteModal({ open: true, user });
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    setIsDeleting(true);
    try {
      await userApi.deleteUser(deleteModal.user._id);
      toast.success('User deleted successfully');
      setDeleteModal({ open: false, user: null });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter users by search (client-side)
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Users</h1>
          <p className="text-text-secondary mt-1">
            Manage all user accounts and roles.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search by name, email, or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-3 rounded-standard bg-surface border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          id="user-search"
        />
      </div>

      {/* Users Table */}
      <Card padding="p-0" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">
                  User
                </th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3 hidden sm:table-cell">
                  Department
                </th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">
                  Role
                </th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3 hidden md:table-cell">
                  Joined
                </th>
                <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <Spinner size={24} />
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-text-secondary"
                  >
                    <Users size={32} className="mx-auto mb-2 text-text-muted" />
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSelf = u._id === currentUser?._id;
                  return (
                    <tr
                      key={u._id}
                      className="hover:bg-surface-hover transition-colors duration-150"
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-primary-light">
                              {u.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">
                              {u.name}
                              {isSelf && (
                                <span className="text-xs text-text-muted ml-1.5">(you)</span>
                              )}
                            </p>
                            <p className="text-xs text-text-secondary truncate">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-sm text-text-secondary">
                          {u.department || '—'}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <Badge role={u.role} />
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-text-secondary">
                          {new Date(u.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openRoleModal(u)}
                            className="p-2 rounded-standard text-text-muted hover:text-primary hover:bg-primary-bg transition-all duration-200 cursor-pointer"
                            title="Change role"
                            aria-label={`Change role for ${u.name}`}
                          >
                            <Shield size={18} />
                          </button>
                          {!isSelf && (
                            <button
                              onClick={() => openDeleteModal(u)}
                              className="p-2 rounded-standard text-text-muted hover:text-error hover:bg-error-bg transition-all duration-200 cursor-pointer"
                              title="Delete user"
                              aria-label={`Delete ${u.name}`}
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-border">
            <p className="text-xs text-text-muted">
              Showing {page * PAGE_SIZE + 1}–
              {page * PAGE_SIZE + filteredUsers.length} users
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1.5 rounded-standard text-text-muted hover:text-text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-text-secondary px-2">
                Page {page + 1}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore}
                className="p-1.5 rounded-standard text-text-muted hover:text-text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Role Change Modal */}
      <Modal
        isOpen={roleModal.open}
        onClose={() => setRoleModal({ open: false, user: null, role: '' })}
        title="Change user role"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Change role for <span className="text-text-primary font-medium">{roleModal.user?.name}</span>
          </p>
          <div className="flex flex-col gap-2">
            {ROLES.map((role) => (
              <label
                key={role}
                className={`
                  flex items-center gap-3 p-3 rounded-standard border cursor-pointer
                  transition-all duration-200
                  ${
                    roleModal.role === role
                      ? 'border-primary bg-primary-bg'
                      : 'border-border hover:border-border hover:bg-surface-hover'
                  }
                `}
              >
                <input
                  type="radio"
                  name="role"
                  value={role}
                  checked={roleModal.role === role}
                  onChange={() =>
                    setRoleModal((prev) => ({ ...prev, role }))
                  }
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    roleModal.role === role
                      ? 'border-primary'
                      : 'border-text-muted'
                  }`}
                >
                  {roleModal.role === role && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-sm text-text-primary capitalize">{role}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() =>
                setRoleModal({ open: false, user: null, role: '' })
              }
            >
              Cancel
            </Button>
            <Button onClick={handleRoleChange} isLoading={isUpdatingRole}>
              Update role
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        title="Delete user"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to delete{' '}
            <span className="text-text-primary font-medium">
              {deleteModal.user?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ open: false, user: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete user
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
