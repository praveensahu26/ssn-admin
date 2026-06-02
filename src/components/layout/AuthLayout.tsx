import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-[#F2F9FF] p-6 font-poppins md:p-8 lg:gap-6">
      <div className="hidden min-h-0 lg:block lg:w-[50%] xl:w-[55%]">
        <div className="h-full min-h-[600px] overflow-hidden rounded-3xl">
          <img
            src="/assets/auth-left.jpg"
            alt="Social Society News"
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>

      {/* Right Side: Centered Content */}
      <div className="flex min-h-0 w-full items-stretch justify-center lg:w-[50%] xl:w-[45%]">
        <div className="flex h-full min-h-[600px] w-full max-w-[720px] flex-col overflow-y-auto rounded-xl border-color bg-white p-8 shadow-card">
          <div className="flex flex-1 flex-col justify-start pt-15">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
