import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const validate = () => {
    const errs: typeof errors = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const { error } = await signIn(email, password);
      if (error) {
        let msg = error.message;
        if (error.message.includes('Invalid login credentials')) {
          msg = 'Invalid email or password. Please check your credentials and try again.';
        }
        setErrors({ general: msg });
        toast.error(msg);
      } else {
        toast.success('Signed in successfully!');
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      const msg = err?.message || 'An unexpected error occurred during sign in.';
      setErrors({ general: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sign in to your account</h2>
        <p className="text-sm text-slate-500 mt-1">
          Welcome back! Access and track your job applications.
        </p>
      </div>

      {errors.general && (
        <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4" />}
          disabled={loading}
          required
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-slate-600 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            disabled={loading}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={loading}
          leftIcon={<LogIn className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
        Don&apos;t have an account yet?{' '}
        <Link
          to="/register"
          className="font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-colors"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
};
