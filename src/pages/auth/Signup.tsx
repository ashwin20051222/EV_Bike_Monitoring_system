import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';

export function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await signUp(email, password);
      setStatus('Account created. Check your inbox and then sign in.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-16">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary-500">
            YoloRacer Pet
          </p>
          <h1 className="text-2xl font-semibold">Create an account</h1>
          <p className="text-sm text-slate-500">
            We&apos;ll ask you to add your first bike next.
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-1 text-sm font-medium">
            Email
            <input
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-white/10 dark:bg-slate-900"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
            />
          </label>
          <label className="block space-y-1 text-sm font-medium">
            Password
            <input
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-white/10 dark:bg-slate-900"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
            />
          </label>

          {status && (
            <p className="text-sm text-primary-600" role="status">
              {status}
            </p>
          )}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Creating...' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link className="text-primary-500 hover:underline" to="/login">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}

