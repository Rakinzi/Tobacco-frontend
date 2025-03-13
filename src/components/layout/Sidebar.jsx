import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  BarChart, 
  Users, 
  FileText, 
  Settings, 
  X,
  Leaf 
} from 'lucide-react';
import { Button } from '../ui/button';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  const getNavItems = () => {
    const commonItems = [
      { to: '/', icon: <Home className="h-4 w-4" />, label: 'Dashboard' },
      { to: '/auctions', icon: <Package className="h-4 w-4" />, label: 'Auctions' },
    ];
    
    switch (user?.user_type) {
      case 'admin':
        return [
          ...commonItems,
          { to: '/users', icon: <Users className="h-4 w-4" />, label: 'Users' },
          { to: '/reports', icon: <BarChart className="h-4 w-4" />, label: 'Reports' },
          { to: '/settings', icon: <Settings className="h-4 w-4" />, label: 'Settings' },
        ];
      case 'trader':
        return [
          ...commonItems,
          { to: '/my-listings', icon: <FileText className="h-4 w-4" />, label: 'My Listings' },
          { to: '/orders', icon: <ShoppingCart className="h-4 w-4" />, label: 'Orders' },
        ];
      case 'buyer':
        return [
          ...commonItems,
          { to: '/my-bids', icon: <BarChart className="h-4 w-4" />, label: 'My Bids' },
          { to: '/orders', icon: <ShoppingCart className="h-4 w-4" />, label: 'Orders' },
        ];
      case 'timb_officer':
        return [
          ...commonItems,
          { to: '/pending-clearance', icon: <FileText className="h-4 w-4" />, label: 'Pending Clearance' },
          { to: '/reports', icon: <BarChart className="h-4 w-4" />, label: 'Reports' },
        ];
      default:
        return commonItems;
    }
  };
  
  const navItems = getNavItems();
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-zinc-950 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative flex flex-col h-full">
          {/* Background pattern */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.15),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(34,197,94,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-soft-light"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full border-r border-green-500/20">
            {/* Sidebar header */}
            <div className="flex items-center gap-2 h-12 px-3 border-b border-green-500/20">
              <Leaf className="h-4 w-4 text-green-500" />
              <h2 className="text-sm font-bold text-white">TobaccoTrade</h2>
              <Button 
                variant="ghost" 
                size="sm"
                className="md:hidden ml-auto text-green-500 hover:text-green-400 hover:bg-green-500/10 h-7 w-7" 
                onClick={toggleSidebar}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-2">
              <ul className="space-y-0.5">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink 
                      end={item.to === '/'} 
                      to={item.to}
                      className={({ isActive }) => `
                        group flex items-center gap-2 px-2.5 py-2 rounded-md transition-all duration-200
                        ${isActive 
                          ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/30 shadow-sm shadow-green-900/30' 
                          : 'text-zinc-400 hover:text-green-400 hover:bg-green-500/10'
                        }
                      `}
                    >
                      <span className={`transition-colors duration-200 ${
                        location.pathname === item.to 
                          ? 'text-green-400' 
                          : 'text-zinc-400 group-hover:text-green-400'
                      }`}>
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Sidebar footer */}
            <div className="px-3 py-2 border-t border-green-500/20">
              <p className="text-[10px] text-green-500">
                © {new Date().getFullYear()} TobaccoTrade
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;