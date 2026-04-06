import { useAuthForm } from '../hooks/useAuthForm';
import { useAuth } from '../hooks/useAuth';
import React from 'react';

export function AuthPage() {
  const { user, logout } = useAuth();
  const form = useAuthForm();

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome!</h1>
            <p className="text-gray-600 mt-2">Library Management System</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Logged in as:</p>
              <p className="text-lg font-semibold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-indigo-600 font-medium mt-2">Role: {user.role}</p>
            </div>

            <button
              onClick={logout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Library Management</h1>
          <p className="text-gray-600 mt-2">{form.isLogin ? 'Sign In' : 'Create Account'}</p>
        </div>

        <form onSubmit={form.handleSubmit} className="space-y-4">
          {!form.isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => form.setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Your name"
                required={!form.isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => form.setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => form.setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          {form.error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{form.error}</div>}

          <button
            type="submit"
            disabled={form.loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            {form.loading ? 'Processing...' : form.isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm mb-3">
            {form.isLogin ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            onClick={() => form.setIsLogin(!form.isLogin)}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            {form.isLogin ? 'Create One' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
