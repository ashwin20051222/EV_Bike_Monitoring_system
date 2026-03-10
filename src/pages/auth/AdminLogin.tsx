import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';

export function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(
    (location.state as { message?: string } | null)?.message ?? null
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      const profile = await signIn(email, password);
      if (profile?.role !== 'admin') {
        setStatus('This account does not have admin privileges.');
        await signOut();
        return;
      }
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16">
      <Card className="w-full max-w-lg bg-slate-900/80 p-8 text-white">
        <div className="flex items-center gap-3">
          <Shield />
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-primary-300">
              Admin
            </p>
            <h1 className="text-2xl font-semibold">Operator Console</h1>
            <p className="text-sm text-white/60">
              Provision bikes, manage API access and users.
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-1 text-sm font-medium">
            Work Email
            <input
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
            />
          </label>
          <label className="block space-y-1 text-sm font-medium">
            Password
            <input
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
            />
          </label>
          {status && (
            <p className="text-sm text-rose-300" role="status">
              {status}
            </p>
          )}
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Authorizing...' : 'Authenticate'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-white/60">
          Need rider access?{' '}
          <Link to="/login" className="text-primary-300 hover:underline">
            Use the standard portal
          </Link>
        </p>
      </Card>
    </div>
  );
}

