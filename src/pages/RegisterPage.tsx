import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const RegisterPage: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
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
      const { error } = await signUp(email, password);
      if (error) {
        let msg = error.message;
        if (error.message.includes('User already registered')) {
          msg = 'An account with this email already exists. Try signing in.';
        }
        setErrors({ general: msg });
        toast.error(msg);
      } else {
        toast.success('Registration successful!');
        setIsSuccess(true);
      }
    } catch (err: any) {
      const msg = err?.message || 'An error occurred during registration.';
      setErrors({ general: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-4 space-y-4">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Account Created!</h3>
        <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
          Your account has been registered for <span className="font-semibold text-slate-900">{email}</span>.
          If your Supabase project requires email confirmation, please check your inbox to verify your email.
        </p>
        <div className="pt-2">
          <Button onClick={() => navigate('/login')} className="w-full">
            Proceed to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create your account</h2>
        <p className="text-sm text-slate-500 mt-1">
          Start tracking your job search and applications in one place.
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

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="At least 6 characters"
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

        <Input
          label="Confirm password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          leftIcon={<Lock className="w-4 h-4" />}
          disabled={loading}
          required
        />

        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={loading}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};
