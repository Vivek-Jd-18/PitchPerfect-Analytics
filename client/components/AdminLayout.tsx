import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-dashboard-light">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-dashboard-panelDark text-white flex-shrink-0 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-700 font-bold text-xl tracking-wide">
          PitchPerfect
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="#" className="block px-4 py-2 rounded-md bg-brand-600 text-white font-medium">
            Roster
          </a>
          <a href="#" className="block px-4 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            Match Logs
          </a>
          <a href="#" className="block px-4 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            Lineup Engine
          </a>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button className="w-full px-4 py-2 bg-gray-800 text-sm text-gray-300 rounded hover:bg-gray-700">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Admin User</span>
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
