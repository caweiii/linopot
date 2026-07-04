import React, { useState } from 'react';
import { Bell, X, Check, CloudSun, AlertCircle, TrendingUp } from 'lucide-react';

interface HeaderProps {
  onNavigate: (tab: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Tomorrow's prediction is ready",
      desc: "46 portions recommended based on perfect Friday weather.",
      time: "Just now",
      type: "prediction",
      unread: true,
    },
    {
      id: 2,
      title: "Great job yesterday!",
      desc: "You achieved 94% accuracy with only 5 leftover portions.",
      time: "2 hours ago",
      type: "success",
      unread: true,
    },
    {
      id: 3,
      title: "Weather Alert: Clear Skies",
      desc: "Sunny weather tomorrow. Perfect for outdoor dining at Siti's Nasi Lemak.",
      time: "5 hours ago",
      type: "weather",
      unread: true,
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (n: typeof notifications[0]) => {
    // Navigate to respective tab if helpful
    if (n.type === 'prediction') {
      onNavigate('forecast');
    } else if (n.type === 'success') {
      onNavigate('history');
    }
    // Mark as read
    setNotifications(notifications.map(item => item.id === n.id ? { ...item, unread: false } : item));
    setUnreadCount(prev => Math.max(0, prev - (n.unread ? 1 : 0)));
    setShowNotifications(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-100 px-4 py-4 flex items-center justify-between">
      {/* Logo and Name */}
      <div 
        className="flex items-center gap-1 cursor-pointer select-none active:scale-95 transition-transform"
        onClick={() => onNavigate('home')}
        id="header-logo-container"
      >
        <span className="font-sans text-xl font-black text-primary-purple tracking-tight">
          Linopot
        </span>
      </div>

      {/* Bell Notification Icon */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 active:scale-90 transition-all cursor-pointer"
          id="header-notification-button"
          aria-label="View notifications"
        >
          <Bell className="w-6 h-6 text-zinc-600" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-primary-purple rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* Notifications Dropdown Card */}
        {showNotifications && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowNotifications(false)} 
            />
            <div 
              className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-zinc-100 overflow-hidden z-50 animate-fade-in"
              id="header-notifications-dropdown"
            >
              <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <h3 className="font-bold text-zinc-800 text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead}
                    className="text-xs text-primary-purple hover:underline font-bold"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-zinc-100">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-zinc-400 text-sm">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-4 flex gap-3 hover:bg-zinc-50 cursor-pointer transition-colors ${
                        n.unread ? 'bg-primary-purple/[0.03]' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {n.type === 'prediction' && (
                          <div className="w-8 h-8 rounded-full bg-primary-purple/10 text-primary-purple flex items-center justify-center">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                        )}
                        {n.type === 'success' && (
                          <div className="w-8 h-8 rounded-full bg-secondary-green/10 text-secondary-green flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                        {n.type === 'weather' && (
                          <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                            <CloudSun className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline gap-1">
                          <h4 className={`text-xs font-bold text-zinc-800 ${n.unread ? 'text-primary-purple' : ''}`}>
                            {n.title}
                          </h4>
                          <span className="text-[10px] text-zinc-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{n.desc}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
