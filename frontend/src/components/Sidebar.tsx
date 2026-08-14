import React from 'react';
import { 
  Compass, 
  PlusCircle, 
  Map, 
  Bookmark, 
  Sparkles, 
  PieChart, 
  Activity, 
  Settings, 
  Sun, 
  Moon, 
  ChevronLeft, 
  ChevronRight,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { useUIStore } from '../stores/useUIStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useTripStore } from '../stores/useTripStore';

export const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar, activeTab, setActiveTab, theme, toggleTheme, openWizard, openAuthModal } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { userTrips } = useTripStore();

  const navItems = [
    { id: 'planner', label: 'Planner', icon: Compass },
    { id: 'my-trips', label: 'My Trips', icon: Map },
    { id: 'discover', label: 'Discover', icon: Sparkles },
    { id: 'budget', label: 'Budget', icon: PieChart },
    { id: 'agent-activity', label: 'Agent Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-slate-900 border-r border-slate-800 flex flex-col justify-between ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div>
        {/* Logo Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <div className="flex items-center space-x-3 overflow-hidden cursor-pointer" onClick={() => setActiveTab('planner')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
              <Compass className="w-6 h-6 animate-pulse-subtle" />
            </div>
            {sidebarOpen && (
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                Voyage<span className="text-indigo-400 font-semibold">AI</span>
              </span>
            )}
          </div>
          <button 
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Primary CTA */}
        <div className="p-3">
          <button
            onClick={openWizard}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-95 ${
              !sidebarOpen ? 'px-0' : ''
            }`}
          >
            <PlusCircle className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>New Trip</span>}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/20' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Recent Trips Section */}
        {sidebarOpen && userTrips.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-800/80 mt-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recent Trips</h4>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {userTrips.slice(0, 4).map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActiveTab('my-trips')}
                  className="flex items-center space-x-2 p-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800/60 cursor-pointer truncate"
                >
                  <Map className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{t.destination}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Profile & Theme Toggle */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors text-sm"
        >
          <div className="flex items-center space-x-3">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
            {sidebarOpen && <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>}
          </div>
        </button>

        {isAuthenticated && user ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {sidebarOpen && (
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-200 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button onClick={logout} className="p-1 text-slate-400 hover:text-red-400 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          sidebarOpen && (
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 border border-slate-700/60 transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )
        )}
      </div>
    </aside>
  );
};
