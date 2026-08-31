import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuthData } from '@/hooks/useAuthData';
import { ROUTES } from '@/config/routes';
import NotificationModal from '@/components/ui/NotificationModal';
import { notificationServices } from '@/services/notificationServices';

const UNREAD_POLL_INTERVAL_MS = 30000;

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchUnreadCount = async () => {
      try {
        const response = await notificationServices.getUnreadCount();
        if (isMounted && response.data) {
          setUnreadCount(response.data.count);
        }
      } catch {
        // Ignore — badge just stays at its last known value.
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, UNREAD_POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (notifOpen) {
      setUnreadCount(0);
    }
  }, [notifOpen]);

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

  useEffect(() => {
    setMobileSidebarOpen(false);
    setProfileMenuOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

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
      path: ROUTES.newsFeed,
      activeIcon: '/icons/sidebar/newsfeedActive.svg',
      inactiveIcon: '/icons/sidebar/newsfeedInactive.svg',
    },
    {
      name: 'Campaigns',
      path: ROUTES.campaigns,
      activeIcon: '/icons/sidebar/campaignsActive.svg',
      inactiveIcon: '/icons/sidebar/campaignsInactive.svg',
    },
    {
      name: 'Reports',
      path: ROUTES.reports,
      activeIcon: '/icons/sidebar/reportsActive.svg',
      inactiveIcon: '/icons/sidebar/reportsInactive.svg',
    },
    {
      name: 'Categories',
      path: ROUTES.categories,
      activeIcon: '/icons/sidebar/categoriesActive.svg',
      inactiveIcon: '/icons/sidebar/categoriesInactive.svg',
    },
    {
      name: 'Settings',
      path: ROUTES.settings,
      activeIcon: '/icons/sidebar/seetingsInactive.svg', // using settings inactive for both
      inactiveIcon: '/icons/sidebar/seetingsInactive.svg',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileSidebarOpen(false);
  };

  const isSidebarItemActive = (path: string) => {
    if (path === ROUTES.dashboard) {
      return location.pathname === path || location.pathname === ROUTES.root;
    }

    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const renderSidebarContent = (compact = false) => (
    <div className="flex h-full min-h-0 flex-col justify-between gap-6">
      <div className="min-h-0 overflow-y-auto overflow-x-hidden">
        {/* Logo Section */}
        <button
          type="button"
          className={`mb-10 flex items-center gap-3 px-2 text-left ${compact ? 'justify-center px-0' : ''}`}
          onClick={() => handleNavigate(ROUTES.dashboard)}
          aria-label="Go to dashboard"
        >
          <img src="/icons/logo.svg" alt="Social Society News Logo" className="h-10 w-10 object-contain" />
          {!compact && (
            <div className="flex flex-col">
              <span className="text-base-custom font-semibold text-[#4D4D4D] leading-tight font-poppins">Social Society</span>
              <span className="text-md-custom font-medium text-[#4D4D4D] font-poppins">News</span>
            </div>
          )}
        </button>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = isSidebarItemActive(item.path);
            return (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.path)}
                title={compact ? item.name : undefined}
                aria-label={item.name}
                className={`flex items-center gap-2 rounded-xl font-poppins font-medium text-md-custom w-full text-left ${
                  compact ? 'justify-center px-3 py-3.5' : 'px-4 py-3.5'
                } ${isActive ? 'bg-btn-primary text-white' : 'text-text-secondary'}`}
              >
                <img
                  src={isActive ? item.activeIcon : item.inactiveIcon}
                  alt=""
                  className="w-5 h-5 object-contain"
                />
                {!compact && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Section */}
      <div className="shrink-0 border-t border-[#DCE5EF] pt-6">
        <button
          onClick={handleLogout}
          title={compact ? 'Logout' : undefined}
          aria-label="Logout"
          className={`flex items-center gap-4 rounded-xl text-text-secondary font-poppins font-medium text-md-custom w-full text-left ${
            compact ? 'justify-center px-3 py-3.5' : 'px-4 py-3.5'
          }`}
        >
          <img
            src="/icons/sidebar/log-out.svg"
            alt=""
            className="w-5 h-5 object-contain"
          />
          {!compact && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FFFFFF]">
      {mobileSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          aria-label="Close navigation"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[286px] max-w-[86vw] flex-col justify-between border-r border-[#DCE5EF] bg-white p-6 transition-transform duration-300 md:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE5EF] text-text-secondary"
          aria-label="Close navigation"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
        {renderSidebarContent(false)}
      </aside>

      {/* Desktop / Tablet Sidebar */}
      <aside className="fixed left-0 top-0 z-20 hidden h-[calc(100dvh-24px)] flex-col overflow-hidden border-r border-[#DCE5EF] bg-white p-4 md:flex md:w-[76px] xl:w-[236px] xl:p-6">
        <div className="h-full min-h-0 xl:hidden">{renderSidebarContent(true)}</div>
        <div className="hidden h-full min-h-0 xl:block">{renderSidebarContent(false)}</div>
      </aside>

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 overflow-hidden md:pl-[76px] xl:pl-[236px]">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-[#DCE5EF] bg-white px-4 sm:px-6 md:h-[70px] md:justify-end lg:px-8">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCE5EF] text-text-secondary shadow-card md:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Right side Section */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Notification Bell */}
            <div className="relative">
              <button
                ref={notifBtnRef}
                onClick={() => setNotifOpen((prev) => !prev)}
                aria-label="Open notifications"
                aria-expanded={notifOpen}
                className="relative w-10 h-10 rounded-xl border border-[#DCE5EF] flex items-center justify-center bg-white shadow-card"
              >
                <img src="/icons/notificationIcon.svg" alt="Notifications" className="w-[20px] h-[20px] object-contain" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium leading-none text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <NotificationModal
                isOpen={notifOpen}
                onClose={() => setNotifOpen(false)}
                anchorRef={notifBtnRef}
              />
            </div>

            {/* Profile Info */}
            <div className="relative flex items-center gap-3" ref={profileMenuRef}>
              <div className="hidden flex-col text-right sm:flex">
                <span className="text-xs-custom font-medium text-text-secondary font-poppins">Hello</span>
                <span className="text-md-custom font-medium text-text-primary font-poppins">
                  {user?.name || 'Carlos Bracewell'}
                </span>
              </div>
              <img
                src="/assets/notFound.png"
                alt="User Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white cursor-pointer"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
              />

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-[200px] h-[94px] mt-2 bg-white border border-[#DCE5EF] rounded-xl shadow-card z-50 py-3 px-2">


                  <button
                    onClick={() => { setProfileMenuOpen(false); navigate(`${ROUTES.settings}?tab=profile`); }}
                    className="flex items-center gap-1 w-full px-4 py-2"
                  >
                    <img src="/icons/editProfile.svg" alt="Edit Profile" className="w-5 h-5 object-contain" />
                    <span className="text-md-custom font-medium text-text-secondary font-poppins">Edit Profile</span>
                  </button>

                  <button
                    onClick={() => { setProfileMenuOpen(false); navigate(`${ROUTES.settings}?tab=account`); }}
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
        <main className="h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden bg-[#F4F7FC] p-4 pt-4 sm:p-6 md:h-[calc(100vh-70px)] xl:p-8 xl:pt-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
