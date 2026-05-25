import { useAuthData } from '@/hooks/useAuthData';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingBag,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  ShieldCheck,
  UserMinus,
} from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuthData();

  // Simple statistics dataset
  const stats = [
    {
      label: 'Total Revenue',
      value: '$245,670.80',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Active Users',
      value: '18,432',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-primary bg-primary-50 border-primary-100',
    },
    {
      label: 'Sales Vol.',
      value: '2,945',
      change: '-1.4%',
      trend: 'down',
      icon: ShoppingBag,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      label: 'Conversions',
      value: '3.42%',
      change: '+4.8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      action: 'Purchased Enterprise License',
      time: '5 minutes ago',
      amount: '+$1,200.00',
    },
    {
      id: 2,
      user: 'Michael Chen',
      email: 'm.chen@example.com',
      action: 'Upgraded team seat',
      time: '23 minutes ago',
      amount: '+$150.00',
    },
    {
      id: 3,
      user: 'David Ross',
      email: 'd.ross@example.com',
      action: 'Requested API access',
      time: '1 hour ago',
      amount: 'Pending',
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Navigation Bar / Header */}
        <header className="mb-8 flex flex-col justify-between gap-4 rounded-xl border border-white/20 bg-white/60 p-6 backdrop-blur-md sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white shadow-card">
              <span className="font-play text-xl font-bold">SSN</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-text">SSN Admin Dashboard</h1>
              <p className="text-sm text-text-muted">
                Welcome back, <span className="font-semibold text-primary">{user?.name ?? 'Admin'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input Mock */}
            <div className="relative hidden md:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-text-subtle" />
              </span>
              <input
                type="text"
                placeholder="Quick search..."
                className="h-10 rounded-md border border-border bg-white pl-9 pr-4 text-sm text-text placeholder-text-subtle focus:border-primary focus:outline-none"
              />
            </div>

            {/* Notification Mock */}
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-md border border-border bg-white text-text-muted hover:bg-surface-muted transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
            </button>

            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              leftIcon={<LogOut className="h-4 w-4" />}
              onClick={logout}
            >
              Sign Out
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/20 bg-white/70 p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-text-muted">{stat.label}</span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-text">{stat.value}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${stat.trend === 'up'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                    }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Activity List */}
          <div className="lg:col-span-2 rounded-xl border border-white/20 bg-white/70 p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-text">Recent Activity</h2>
                <p className="text-xs text-text-muted">Real-time application audit logs</p>
              </div>
              <Button variant="link" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />}>
                View All
              </Button>
            </div>

            <div className="flow-root">
              <ul className="-my-5 divide-y divide-border">
                {recentActivities.map(activity => (
                  <li key={activity.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-text">
                          {activity.user}
                        </p>
                        <p className="truncate text-xs text-text-muted">
                          {activity.action}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold text-text">
                          {activity.amount}
                        </span>
                        <span className="text-xs text-text-subtle">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="rounded-xl border border-white/20 bg-white/70 p-6 shadow-card">
            <h2 className="text-lg font-bold text-text mb-6">Quick Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold text-text">Security Shield</p>
                    <p className="text-xs text-text-muted">Active and monitoring</p>
                  </div>
                </div>
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
                <div className="flex items-center gap-3">
                  <UserMinus className="h-5 w-5 text-rose-500" />
                  <div>
                    <p className="text-sm font-semibold text-text">Maintenance Mode</p>
                    <p className="text-xs text-text-muted">Currently disabled</p>
                  </div>
                </div>
                <div className="h-2.5 w-2.5 rounded-full bg-border" />
              </div>

              <div className="pt-4">
                <Button variant="primary" fullWidth>
                  Generate PDF Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
