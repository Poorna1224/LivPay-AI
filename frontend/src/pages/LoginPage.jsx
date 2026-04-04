import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login, adminLogin, isAuthenticated, isAdmin } = useAuth();
  const [role, setRole] = useState("worker");
  const [formData, setFormData] = useState({ phone: "", password: "", admin_pin: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate("/admin-dashboard");
      } else {
        navigate("/worker-dashboard");
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (role === "admin") {
        await adminLogin(formData.phone, formData.admin_pin);
      } else {
        await login(formData.phone, formData.password);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-2xl font-bold gradient-text">LivPay AI</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-muted mt-2">Sign in to access your dashboard</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/40 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setRole("worker")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                role === "worker" ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              Worker Login
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                role === "admin" ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              Admin Login
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-xl mb-6 flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Phone Number</label>
              <input
                className="input-dark"
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {role === "admin" ? (
              <div>
                <label className="block text-sm font-medium text-white mb-1">Admin PIN</label>
                <input
                  className="input-dark"
                  type="password"
                  name="admin_pin"
                  placeholder="Enter admin PIN"
                  value={formData.admin_pin}
                  onChange={handleChange}
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-white mb-1">Password</label>
                <input
                  className="input-dark"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-50"
            >
              {loading ? "Signing in..." : role === "admin" ? "Sign In as Admin" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
