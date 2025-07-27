'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Admin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', createdAt: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'loading') {
      console.log('Session loading...');
      return; // Wait for session to load
    }
    console.log('Session in useEffect:', session);
    // Temporary bypass for testing - check if page loads
    if (!session) {
      console.log('No session, redirecting to /login');
      router.push('/login');
    } else {
      console.log('Session exists, fetching users');
      fetchUsers();
    }
    // Revert to proper role check after testing: if (!session || (session.user?.role !== 'admin' && session.user?.role !== undefined)) {
    //   router.push('/login');
    // } else {
    //   fetchUsers();
    // }
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', {
        credentials: 'include', // Ensure session cookies are sent
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      console.log('Fetched users:', data);
      if (Array.isArray(data)) setUsers(data);
      else setError('Unexpected data format from API');
    } catch (err) {
      console.error('Fetch users error:', err);
      setError(`Failed to fetch users: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `/api/users/${editingId}` : '/api/users';
    const method = editingId ? 'PUT' : 'POST';
    const submitData = { ...form, createdAt: form.createdAt || new Date().toISOString() }; // Ensure createdAt is set
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (res.ok) {
        setForm({ name: '', email: '', password: '', role: 'user', createdAt: '' });
        setEditingId(null);
        fetchUsers();
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(`Operation failed: ${err.message}`);
    }
  };

  const handleEdit = (user) => {
    // Exclude password from edit to prevent plaintext exposure
    setForm({ name: user.name, email: user.email, password: '', role: user.role, createdAt: user.createdAt });
    setEditingId(user._id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      console.error('Delete error:', err);
      setError(`Failed to delete user: ${err.message}`);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return null; // This should handle the redirect case
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%223%22 fill=%22rgba(255,255,255,0.2)%22/%3E%3C/svg%3E')] animate-pulse opacity-20 pointer-events-none" />
      <div className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl transform transition-all duration-500 hover:shadow-2xl z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl pointer-events-none" />
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 relative z-20">Admin Panel - User Management</h1>
        {error && <p className="text-red-500 bg-red-100 p-2 mb-4 rounded">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-20">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
              required
              placeholder="Enter new password or leave blank"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              id="role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700 mb-2">Created At</label>
            <input
              type="text"
              id="createdAt"
              value={form.createdAt ? new Date(form.createdAt).toLocaleString() : ''}
              onChange={(e) => setForm({ ...form, createdAt: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
              readOnly
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 font-semibold relative z-20"
          >
            {editingId ? 'Update User' : 'Create User'}
          </button>
        </form>
        <div className="mt-8 relative z-20">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Users List</h2>
          {error && <p className="text-red-500 bg-red-100 p-2 mb-4 rounded">{error}</p>}
          {users.length === 0 ? (
            <p className="text-center text-gray-500">No users found. Create a user to populate the table.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border-b">ID</th>
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Email</th>
                  <th className="p-3 border-b">Password</th>
                  <th className="p-3 border-b">Role</th>
                  <th className="p-3 border-b">Created At</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{user._id}</td>
                    <td className="p-3 border-b">{user.name}</td>
                    <td className="p-3 border-b">{user.email}</td>
                    <td className="p-3 border-b">******** (Hashed)</td> {/* Masked for security */}
                    <td className="p-3 border-b">{user.role}</td>
                    <td className="p-3 border-b">{new Date(user.createdAt).toLocaleString()}</td>
                    <td className="p-3 border-b">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="mt-6 w-full bg-gradient-to-r from-red-500 to-pink-600 text-white p-3 rounded-lg hover:from-red-600 hover:to-pink-700 focus:ring-4 focus:ring-red-300 transition-all duration-300 font-semibold relative z-20"
        >
          Logout
        </button>
      </div>
    </div>
  );
}