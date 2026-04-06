import React from 'react';
import { useAuthForm } from '../hooks/useAuthForm';
import { useAuth } from '../hooks/useAuth';

export function AuthPage() {
  const { user, logout } = useAuth();
  const form = useAuthForm();

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
            <p className="text-gray-600 mt-2">Library Management System</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
              <p className="text-sm text-gray-600 mb-1">User Profile</p>
              <p className="text-2xl font-bold text-gray-800 mb-1">{user.name}</p>
              <p className="text-sm text-gray-600 mb-3">{user.email}</p>
              <div className="flex items-center">
                <span className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Library Management</h1>
            <p className="text-gray-600 mt-2 font-medium">
              {form.isLogin ? 'Sign In to Your Account' : 'Create New Account'}
            </p>
          </div>
        </div>

        <form onSubmit={form.handleSubmit} className="space-y-4">
          {!form.isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => form.setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="John Doe"
                required={!form.isLogin}
                disabled={form.loading}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => form.setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="you@example.com"
              required
              disabled={form.loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => form.setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="••••••••"
              required
              disabled={form.loading}
            />
          </div>

          {form.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{form.error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={form.loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            {form.loading ? 'Processing...' : form.isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm text-center mb-3">
            {form.isLogin ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            type="button"
            onClick={() => form.setIsLogin(!form.isLogin)}
            className="w-full text-indigo-600 hover:text-indigo-700 font-semibold text-sm py-2 px-4 rounded-lg hover:bg-indigo-50 transition"
          >
            {form.isLogin ? 'Create One' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
