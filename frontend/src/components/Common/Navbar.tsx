import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', label: 'My Calendar', icon: 'pi pi-calendar' },
    { path: '/marketplace', label: 'Marketplace', icon: 'pi pi-shopping-cart' },
    { path: '/notifications', label: 'Notifications', icon: 'pi pi-bell' }
  ];

  return (
    <nav className="surface-0 shadow-2 p-3 flex align-items-center justify-content-between">
      <div className="flex align-items-center">
        <i className="pi pi-refresh text-primary text-2xl mr-2"></i>
        <h2 className="m-0 text-primary">SlotSwapper</h2>
      </div>
      
      <div className="flex gap-3">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`p-button p-button-text ${
              isActive(item.path) ? 'p-button-primary' : 'p-button-secondary'
            }`}
            onClick={() => navigate(item.path)}
          >
            <i className={`${item.icon} mr-2`}></i>
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex align-items-center gap-3">
        <span className="text-color-secondary">Hello, {user?.name}</span>
        <button 
          className="p-button p-button-outlined p-button-secondary"
          onClick={handleLogout}
        >
          <i className="pi pi-sign-out mr-2"></i>
          Logout
        </button>
      </div>
    </nav>
  );
};