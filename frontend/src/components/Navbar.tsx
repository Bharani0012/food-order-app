import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-white" : "text-orange-100 hover:text-white"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-20 bg-orange-600 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <Link
          to={user ? "/menu" : "/login"}
          className="flex items-center gap-2 text-white font-bold text-lg tracking-tight"
        >
          <span className="text-2xl leading-none">🍔</span>
          Food Order
        </Link>
        <div className="flex items-center gap-5">
          {user && (
            <>
              <NavLink to="/menu" className={navLinkClasses}>
                Menu
              </NavLink>
              <NavLink to="/orders" className={navLinkClasses}>
                Orders
              </NavLink>
              <NavLink to="/cart" className={navLinkClasses}>
                <span className="relative inline-flex items-center gap-1">
                  Cart
                  {totalCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-white text-orange-600 text-xs font-bold leading-none">
                      {totalCount}
                    </span>
                  )}
                </span>
              </NavLink>
            </>
          )}
          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-orange-400/60">
              <span className="text-sm text-orange-100 hidden sm:inline">
                Hi, <span className="text-white font-semibold">{user.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-orange-100 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink to="/login" className={navLinkClasses}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="text-sm font-semibold bg-white text-orange-600 px-3 py-1.5 rounded-full hover:bg-orange-50 transition-colors"
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
