import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'password', 'delete'
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    isActive: true
  });

  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [pagination.page, search, filterRole, filterActive]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll(
        pagination.page,
        pagination.limit,
        search,
        filterRole,
        filterActive
      );
      setUsers(response.data.users);
      setPagination(prev => ({ ...prev, ...response.data.pagination }));
    } catch (error) {
      toast.error('Error loading users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await usersAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedUser(null);
    setFormData({ name: '', email: '', password: '', role: 'user', isActive: true });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      password: ''
    });
    setShowModal(true);
  };

  const handleChangePassword = (user) => {
    setModalMode('password');
    setSelectedUser(user);
    setFormData({ password: '', confirmPassword: '' });
    setShowModal(true);
  };

  const handleDelete = (user) => {
    setModalMode('delete');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleToggleStatus = async (user) => {
    try {
      await usersAPI.toggleStatus(user.id);
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast.error(error.message || 'Error toggling user status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === 'create') {
        await usersAPI.create(formData);
        toast.success('User created successfully');
      } else if (modalMode === 'edit') {
        const { password, ...updateData } = formData;
        await usersAPI.update(selectedUser.id, updateData);
        toast.success('User updated successfully');
      } else if (modalMode === 'password') {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        await usersAPI.changePassword(selectedUser.id, formData.password);
        toast.success('Password changed successfully');
      } else if (modalMode === 'delete') {
        await usersAPI.delete(selectedUser.id);
        toast.success('User deleted successfully');
      }

      setShowModal(false);
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast.error(error.message || 'Error performing operation');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'user': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'viewer': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
        <div className="text-center">
          <h2 className="text-2xl text-red-400 mb-4">Access Denied</h2>
          <p className="text-gray-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage system users, roles, and permissions</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="text-gray-400 text-sm mb-2">Total Users</div>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="text-gray-400 text-sm mb-2">Active</div>
              <div className="text-3xl font-bold text-green-400">{stats.active}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="text-gray-400 text-sm mb-2">Inactive</div>
              <div className="text-3xl font-bold text-red-400">{stats.inactive}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="text-gray-400 text-sm mb-2">Admins</div>
              <div className="text-3xl font-bold text-cyan-400">{stats.byRole?.admin || 0}</div>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="viewer">Viewer</option>
            </select>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all"
            >
              + Create User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading...</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Last Login</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                      <td className="px-6 py-4 text-gray-300">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          user.isActive
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleChangePassword(user)}
                            className="px-3 py-1 text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded transition-colors"
                          >
                            Password
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`px-3 py-1 text-sm rounded transition-colors ${
                              user.isActive
                                ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10'
                                : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                            }`}
                            disabled={user.id === currentUser.id}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                            disabled={user.id === currentUser.id}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {users.length} of {pagination.total} users
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-slate-700/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-300">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 bg-slate-700/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-white/10 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {modalMode === 'create' && 'Create New User'}
              {modalMode === 'edit' && 'Edit User'}
              {modalMode === 'password' && 'Change Password'}
              {modalMode === 'delete' && 'Delete User'}
            </h3>

            {modalMode === 'delete' ? (
              <div>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete <span className="font-bold text-white">{selectedUser?.name}</span>?
                  This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {modalMode !== 'password' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                  </>
                )}

                {(modalMode === 'create' || modalMode === 'password') && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {modalMode === 'password' ? 'New Password' : 'Password'}
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                        required
                        minLength={6}
                      />
                    </div>
                    {modalMode === 'password' && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                        <input
                          type="password"
                          value={formData.confirmPassword || ''}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                          required
                        />
                      </div>
                    )}
                  </>
                )}

                {modalMode !== 'password' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    {modalMode === 'edit' && (
                      <div className="mb-4 flex items-center">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="mr-2"
                        />
                        <label htmlFor="isActive" className="text-sm text-gray-300">Active</label>
                      </div>
                    )}
                  </>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-colors"
                  >
                    {modalMode === 'create' ? 'Create' : modalMode === 'password' ? 'Change Password' : 'Save'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
