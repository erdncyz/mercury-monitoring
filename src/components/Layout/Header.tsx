import { Bell, Settings, User, Search } from 'lucide-react';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onProfileClick?: () => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  hasUnreadNotifications?: boolean;
}

export default function Header({ searchQuery = '', onSearchChange = () => {}, onProfileClick, onNotificationsClick, onSettingsClick, hasUnreadNotifications }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-3xl text-blue-600 font-bold">☿</span>
          <h1 className="text-2xl font-bold text-gray-900">Mercury Monitoring</h1>
          <div className="hidden md:block w-px h-6 bg-gray-300"></div>
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              All Systems Operational
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search monitors..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
          
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" onClick={onNotificationsClick}>
            <Bell className="w-5 h-5" />
            {hasUnreadNotifications && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
          </button>
          
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" onClick={onSettingsClick}>
            <Settings className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" onClick={onProfileClick}>
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}