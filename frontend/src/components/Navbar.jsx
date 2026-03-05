import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import AuthModal from "./AuthModal.jsx";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Store", to: "/store" },
  { label: "About", to: "/about" },
  { label: "Legal", to: "/legal" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/store");
  };

  return (
    <>
      <div className="w-full">
        <nav className="w-full bg-royal-plum-veil flex items-center justify-between px-5 py-3">
          {/* Brand */}
          <div className="text-ivory-blush font-montserrat text-2xl font-bold">
            <Link to="/">Juvelle</Link>
          </div>

          {/* Center links */}
          <div className="flex gap-4 text-ivory-blush font-inter text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="nav-underline-link px-2 py-1"
              >
                {link.label}
                <span className="nav-underline" />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 text-ivory-blush">
            {/* Cart icon */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-ivory-blush hover:text-royal-plum-veil rounded-sm transition duration-200"
              title="Cart"
            >
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-velvet-rose-mist text-midnight-truffle text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center font-inter">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <>
                {/* Profile */}
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 text-sm font-inter hover:bg-ivory-blush hover:text-royal-plum-veil px-2 py-1 rounded-sm transition duration-200"
                >
                  <FiUser size={16} />
                  <span className="hidden sm:inline max-w-24 truncate">
                    {user.fullName || user.email.split("@")[0]}
                  </span>
                </Link>

                {/* Admin link */}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 text-sm font-inter hover:bg-ivory-blush hover:text-royal-plum-veil px-2 py-1 rounded-sm transition duration-200"
                    title="Admin"
                  >
                    <FiSettings size={16} />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm font-inter hover:bg-ivory-blush hover:text-royal-plum-veil px-2 py-1 rounded-sm transition duration-200 cursor-pointer"
                  title="Logout"
                >
                  <FiLogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="text-sm font-inter bg-ivory-blush text-royal-plum-veil px-3 py-1.5 rounded-sm hover:bg-velvet-rose-mist transition duration-200 font-medium"
              >
                Login
              </button>
            )}
          </div>
        </nav>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;
