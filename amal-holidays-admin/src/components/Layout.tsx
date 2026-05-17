import React from 'react';
import { Outlet } from 'react-router';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-grow ml-72 bg-background p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
