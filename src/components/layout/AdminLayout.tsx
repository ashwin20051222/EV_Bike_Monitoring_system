import { NavLink, Outlet } from 'react-router-dom';
import { Shield, Users, Key } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { label: 'Overview', to: '/admin/dashboard', icon: <Shield size={16} /> },
];

export function AdminLayout() {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/90 px-6 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-primary-300">
              Admin Console
            </p>
            <h1 className="text-2xl font-semibold">YoloRacer Command Ops</h1>
            <p className="text-xs text-white/50">
              Signed in as {profile?.full_name ?? 'Admin'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <div className="flex">
        <aside className="hidden w-64 border-r border-white/10 p-6 lg:block">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                    isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-8 space-y-4 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <Users size={16} />
              Manage users & bikes
            </div>
            <div className="flex items-center gap-2">
              <Key size={16} />
              Issue device keys
            </div>
          </div>
        </aside>
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

