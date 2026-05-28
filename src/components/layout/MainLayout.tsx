import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthData } from '@/hooks/useAuthData';
import { ROUTES } from '@/config/routes';
import NotificationModal from '@/components/ui/NotificationModal';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { logout, user } = useAuthData();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifBtnRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  const menuItems = [
    {
      name: 'Dashboard',
      path: ROUTES.dashboard,
      activeIcon: '/icons/sidebar/dashboardActive.svg',
      inactiveIcon: '/icons/sidebar/dashboardInactive.svg',
    },
    {
      name: 'Users',
      path: ROUTES.users,
      activeIcon: '/icons/sidebar/usersActive.svg',
      inactiveIcon: '/icons/sidebar/usersInactive.svg',
    },
    {
      name: 'Reporters',
      path: ROUTES.reporters,
      activeIcon: '/icons/sidebar/reportersActive.svg',
      inactiveIcon: '/icons/sidebar/reportersInactive.svg',
    },
    {
      name: 'News Feed',
      path: '/news-feed',
      activeIcon: '/icons/sidebar/newsfeedActive.svg',
      inactiveIcon: '/icons/sidebar/newsfeedInactive.svg',
    },
    {
      name: 'Campaigns',
      path: '/campaigns',
      activeIcon: '/icons/sidebar/campaignsActive.svg',
      inactiveIcon: '/icons/sidebar/campaignsInactive.svg',
    },
    {
      name: 'Settings',
      path: '/settings',
      activeIcon: '/icons/sidebar/seetingsInactive.svg', // using settings inactive for both
      inactiveIcon: '/icons/sidebar/seetingsInactive.svg',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login);
  };

  return (
    <div className="flex min-h-screen bg-[#FFFFFF]">
      {/* Sidebar */}
      <aside className="w-[236px] bg-white border-r border-[#DCE5EF] flex flex-col justify-between p-6 fixed h-full left-0 top-0 z-20">
        <div>
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <img src="/icons/logo.svg" alt="Social Society News Logo" className="w-10 h-10 object-contain" />
            <div className="flex flex-col">
              <span className="text-base-custom font-semibold text-[#4D4D4D] leading-tight font-poppins">Social Society</span>
              <span className="text-md-custom font-medium text-[#4D4D4D] font-poppins">News</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === ROUTES.dashboard && location.pathname === '/');
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    if (
                      item.path === ROUTES.dashboard ||
                      item.path === ROUTES.users ||
                      item.path === ROUTES.reporters
                    ) {
                      navigate(item.path);
                    } else {
                      navigate('#');
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-3.5 rounded-xl  font-poppins font-medium text-md-custom w-full text-left ${isActive
                    ? 'bg-btn-primary text-white'
                    : 'text-text-secondary'
                    }`}
                >
                  <img
                    src={isActive ? item.activeIcon : item.inactiveIcon}
                    alt={`${item.name} Icon`}
                    className="w-5 h-5 object-contain"
                  />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="border-t border-[#DCE5EF] pt-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-text-secondary  font-poppins font-medium text-md-custom w-full text-left"
          >
            <img
              src="/icons/sidebar/log-out.svg"
              alt="Logout Icon"
              className="w-5 h-5 object-contain"
            />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 pl-[230px]">
        {/* Header */}
        <header className="h-[70px] bg-white border-b border-[#DCE5EF] flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            {/* Left side empty or matching the header design */}
          </div>

          {/* Right side Section */}
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <div className="relative">
              <button
                ref={notifBtnRef}
                onClick={() => setNotifOpen((prev) => !prev)}
                aria-label="Open notifications"
                aria-expanded={notifOpen}
                className="w-10 h-10 rounded-xl border border-[#DCE5EF] flex items-center justify-center bg-white shadow-card"
              >
                <img src="/icons/notificationIcon.svg" alt="Notifications" className="w-[20px] h-[20px] object-contain" />
              </button>

              <NotificationModal
                isOpen={notifOpen}
                onClose={() => setNotifOpen(false)}
                anchorRef={notifBtnRef}
              />
            </div>

            {/* Profile Info */}
            <div className="relative flex items-center gap-3" ref={profileMenuRef}>
              <div className="flex flex-col text-right">
                <span className="text-xs-custom font-medium text-text-secondary font-poppins">Hello</span>
                <span className="text-md-custom font-medium text-text-primary font-poppins">
                  {user?.name || 'Carlos Bracewell'}
                </span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                alt="User Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white cursor-pointer"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
              />

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-[200px] h-[94px] mt-2 bg-white border border-[#DCE5EF] rounded-xl shadow-card z-50 py-3 px-2">


                  <button
                    onClick={() => { setProfileMenuOpen(false); }}
                    className="flex items-center gap-1 w-full px-4 py-2"
                  >
                    <img src="/icons/editProfile.svg" alt="Edit Profile" className="w-5 h-5 object-contain" />
                    <span className="text-md-custom font-medium text-text-secondary font-poppins">Edit Profile</span>
                  </button>

                  <button
                    onClick={() => { setProfileMenuOpen(false); }}
                    className="flex items-center gap-1 w-full px-4 py-2"
                  >
                    <img src="/icons/accountSettings.svg" alt="Account Settings" className="w-5 h-5 object-contain" />
                    <span className="text-md-custom font-medium text-text-secondary font-poppins">Account Settings</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Inner Content Area */}
        <main className="p-8 pt-4 min-h-[calc(100vh-70px)] bg-[#F4F7FC]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
