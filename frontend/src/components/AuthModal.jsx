import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";

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
    <div style={{ position: "relative" }}>
      <input
        className={className}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={{ paddingRight: "2.5rem" }}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#cf9db8",
          display: "flex",
          alignItems: "center",
          padding: 0,
        }}
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

  const spinnerStyle = {
    width: "14px",
    height: "14px",
    border: "2px solid #cf9db8",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  };

  const submitBtnStyle = (loading) => ({
    background: loading ? "#413038" : "#553858",
    color: "#f3e6ec",
    border: "none",
    borderRadius: "4px",
    padding: "10px",
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 600,
    fontSize: "0.875rem",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "background 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  });

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
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(46, 31, 36, 0.75)",
              backdropFilter: "blur(4px)",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "400px", zIndex: 51 }}
            >
              <div
                style={{
                  background: "#2e1f24",
                  border: "1px solid rgba(207,157,184,0.3)",
                  borderRadius: "12px",
                  padding: "2rem",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <h2
                    style={{
                      color: "#f3e6ec",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      margin: 0,
                    }}
                  >
                    Juvelle
                  </h2>
                  <button
                    onClick={onClose}
                    style={{
                      color: "#cf9db8",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Tabs */}
                <div
                  style={{
                    display: "flex",
                    background: "#413038",
                    borderRadius: "8px",
                    padding: "4px",
                    marginBottom: "1.5rem",
                  }}
                >
                  {["login", "register"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "6px",
                        border: "none",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        background: tab === t ? "#553858" : "transparent",
                        color: tab === t ? "#f3e6ec" : "#cf9db8",
                      }}
                    >
                      {t === "login" ? "Login" : "Register"}
                    </button>
                  ))}
                </div>

                {/* Login Form */}
                {tab === "login" && (
                  <form
                    onSubmit={handleLogin}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
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
                      style={submitBtnStyle(loading)}
                    >
                      {loading ? (
                        <>
                          <span style={spinnerStyle} />
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
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
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
                      style={submitBtnStyle(loading)}
                    >
                      {loading ? (
                        <>
                          <span style={spinnerStyle} />
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

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
