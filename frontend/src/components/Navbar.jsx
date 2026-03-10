import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiSettings,
  FiMenu,
  FiX,
} from "react-icons/fi";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/store");
  };

  return (
    <>
      <div className="w-full relative z-[60]" ref={navbarRef}>
        <nav className="w-full bg-royal-plum-veil flex items-center justify-between px-4 sm:px-5 py-3 relative z-[61]">
          {/* Left Side: Burger Menu + Brand */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-ivory-blush hover:text-velvet-rose-mist focus:outline-none transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <div className="text-ivory-blush font-montserrat text-xl sm:text-2xl font-bold tracking-wide">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                Juvelle
              </Link>
            </div>
          </div>

          {/* Center links */}
          <div className="hidden md:flex gap-4 text-ivory-blush font-inter text-sm">
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
          <div className="flex items-center gap-2 sm:gap-3 text-ivory-blush">
            {user ? (
              <>
                {/* Cart icon */}
                <Link
                  to="/cart"
                  className="relative p-2 hover:bg-ivory-blush hover:text-royal-plum-veil rounded-sm transition duration-200"
                  title="Cart"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-velvet-rose-mist text-midnight-truffle text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-inter">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
                {/* Profile */}
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 text-sm font-inter hover:bg-ivory-blush hover:text-royal-plum-veil px-2 py-1 rounded-sm transition duration-200"
                  onClick={() => setMobileMenuOpen(false)}
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
                    onClick={() => setMobileMenuOpen(false)}
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
                onClick={() => {
                  setAuthOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="text-sm font-inter bg-ivory-blush text-royal-plum-veil px-2 sm:px-3 py-1 sm:py-1.5 rounded-sm hover:bg-velvet-rose-mist transition duration-200 font-medium tracking-wide"
              >
                Login
              </button>
            )}
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-royal-plum-veil shadow-xl transition-all duration-300 ease-in-out border-b border-velvet-rose-mist/20 overflow-hidden ${
            mobileMenuOpen
              ? "max-h-[400px] opacity-100"
              : "max-h-0 opacity-0 border-none px-0"
          }`}
        >
          <div className="flex flex-col py-2 px-5 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-ivory-blush font-inter font-medium text-base py-3 border-b border-ivory-blush/10 last:border-0 hover:text-velvet-rose-mist transition duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;
