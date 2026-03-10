import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo_ivory-blush.svg";

// Reusable password input with show/hide eye toggle
const PasswordInput = ({
  className,
  placeholder,
  value,
  onChange,
  required,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        className={`${className} pr-10`}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-velvet-rose-mist flex items-center p-0"
      >
        {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
      </button>
    </div>
  );
};

const AuthModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isOpen) {
      setLoginForm({ email: "", password: "" });
      setRegisterForm({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setLoading(false);
    }
  }, [isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(loginForm.email, loginForm.password);
      toast.success(
        `Welcome back, ${user.fullName || user.email.split("@")[0]}!`,
      );
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (registerForm.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await register({
        fullName: registerForm.fullName,
        email: registerForm.email,
        password: registerForm.password,
      });
      toast.success("Account created! Welcome to Juvelle ✨");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-cocoa-orchid border border-velvet-rose-mist text-ivory-blush placeholder:text-velvet-rose-mist/60 rounded-lg px-4 py-2.5 text-sm font-poppins outline-none focus:border-ivory-blush transition duration-200";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-midnight-truffle/75 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[400px] z-51"
            >
              <div className="bg-midnight-truffle border border-velvet-rose-mist/30 rounded-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <img src={logo} alt="Juvelle Logo" className="h-6 w-auto" />
                    <h2 className="text-ivory-blush font-montserrat font-bold text-xl m-0">
                      Juvelle
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-velvet-rose-mist bg-transparent border-none cursor-pointer p-1 hover:text-ivory-blush transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex bg-cocoa-orchid rounded-lg p-1 mb-6">
                  {["login", "register"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`flex-1 py-2 px-2 rounded-md border-none font-inter text-sm font-medium cursor-pointer transition-all duration-200 ${
                        tab === t
                          ? "bg-royal-plum-veil text-ivory-blush"
                          : "bg-transparent text-velvet-rose-mist hover:text-ivory-blush"
                      }`}
                    >
                      {t === "login" ? "Login" : "Register"}
                    </button>
                  ))}
                </div>

                {/* Login Form */}
                {tab === "login" && (
                  <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                      className={inputCls}
                      type="email"
                      placeholder="Email address"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm((p) => ({ ...p, email: e.target.value }))
                      }
                      required
                    />
                    <PasswordInput
                      className={inputCls}
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm((p) => ({
                          ...p,
                          password: e.target.value,
                        }))
                      }
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex items-center justify-center gap-2 border-none rounded p-2.5 font-montserrat font-semibold text-[0.875rem] transition-colors duration-200 ${
                        loading
                          ? "bg-cocoa-orchid text-ivory-blush cursor-not-allowed"
                          : "bg-cocoa-orchid text-ivory-blush cursor-pointer hover:bg-cocoa-orchid/90"
                      }`}
                    >
                      {loading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-velvet-rose-mist border-t-transparent rounded-full animate-spin inline-block" />
                          Signing in…
                        </>
                      ) : (
                        "Login"
                      )}
                    </button>
                  </form>
                )}

                {/* Register Form */}
                {tab === "register" && (
                  <form
                    onSubmit={handleRegister}
                    className="flex flex-col gap-4"
                  >
                    <input
                      className={inputCls}
                      type="text"
                      placeholder="Full name"
                      value={registerForm.fullName}
                      onChange={(e) =>
                        setRegisterForm((p) => ({
                          ...p,
                          fullName: e.target.value,
                        }))
                      }
                    />
                    <input
                      className={inputCls}
                      type="email"
                      placeholder="Email address"
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm((p) => ({
                          ...p,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                    <PasswordInput
                      className={inputCls}
                      placeholder="Password (min 8 chars)"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm((p) => ({
                          ...p,
                          password: e.target.value,
                        }))
                      }
                      required
                    />
                    <PasswordInput
                      className={inputCls}
                      placeholder="Confirm password"
                      value={registerForm.confirmPassword}
                      onChange={(e) =>
                        setRegisterForm((p) => ({
                          ...p,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex items-center justify-center gap-2 border-none rounded p-2.5 font-montserrat font-semibold text-[0.875rem] transition-colors duration-200 ${
                        loading
                          ? "bg-cocoa-orchid text-ivory-blush cursor-not-allowed"
                          : "bg-cocoa-orchid text-ivory-blush cursor-pointer hover:bg-cocoa-orchid/90"
                      }`}
                    >
                      {loading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-velvet-rose-mist border-t-transparent rounded-full animate-spin inline-block" />
                          Creating account…
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
