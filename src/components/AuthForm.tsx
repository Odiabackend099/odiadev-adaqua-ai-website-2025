import React, { useState } from 'react';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mock authentication - in production, integrate with Supabase
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (!isLogin && !fullName) {
        throw new Error('Full name is required for signup');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success
      onAuthSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e2240] flex items-center justify-center p-4">
      <div className="bg-[#132a52] p-8 rounded-2xl shadow-xl border border-[#b08d57] w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/images/logo-fingerprint.png" alt="ODIADEV" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">ODIADEV</h1>
          <p className="text-gray-300">
            {isLogin ? 'Welcome back to Adaqua AI' : 'Join ODIADEV and experience Adaqua AI'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-[#0e2240] border border-[#b08d57] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b08d57]"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#0e2240] border border-[#b08d57] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b08d57]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#0e2240] border border-[#b08d57] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b08d57]"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#b08d57] text-black py-2 px-4 rounded-lg font-semibold hover:bg-[#a07c4f] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#b08d57] hover:text-[#a07c4f] text-sm"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
