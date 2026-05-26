import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex bg-[#F2F9FF] font-poppins">
      <div className="hidden lg:block lg:w-[50%] xl:w-[55%] h-screen relative p-6 lg:pr-3">
        <div className="w-full h-screen rounded-3xl overflow-hidden">
          <img
            src="/assets/auth-left.jpg"
            alt="Social Society News"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      {/* Right Side: Centered Content */}
      <div className="w-full lg:w-[50%] xl:w-[45%] flex items-center justify-center p-6 md:p-8 lg:pl-3">
        <div className="w-full max-w-[620px] bg-white rounded-xl shadow-card border-color p-8 md:p-12 flex flex-col justify-between min-h-[645px]">
          <div className="flex-1 flex flex-col justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
