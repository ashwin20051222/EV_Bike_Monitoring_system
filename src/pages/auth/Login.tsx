import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(
    (location.state as { message?: string } | null)?.message ?? null
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await signIn(email, password);
      navigate('/dashboard', { replace: true });
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
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-slate-500">
            Monitor every bike, everywhere.
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
            <p className="text-sm text-red-500" role="alert">
              {status}
            </p>
          )}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Signing in...' : 'Access dashboard'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link className="text-primary-500 hover:underline" to="/signup">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}

