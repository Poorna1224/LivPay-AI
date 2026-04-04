import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    zone: "",
    platform: "",
    partner_id: "",
    weekly_income: "",
    payout_method: "UPI",
    aadhaar_number: "",
    pan_number: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        weekly_income: Number(formData.weekly_income),
      };

      await register(payload);
      setMessage(`Welcome! Registration successful!`);
      setTimeout(() => {
        navigate("/worker-dashboard");
      }, 1500);

    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Registration failed. Please try again.");
      }
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

      <div className="max-w-6xl w-full grid lg:grid-cols-5 gap-8 items-center relative z-10">
        <div className="lg:col-span-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-2xl font-bold gradient-text">LivPay AI</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Protect Your <span className="gradient-text">Gig Income</span>
          </h1>
          <p className="text-lg text-muted mb-8 max-w-md mx-auto lg:mx-0">
            AI-powered parametric insurance designed specifically for gig workers. 
            Get coverage based on real-time risk data.
          </p>

          <div className="space-y-4 max-w-sm mx-auto lg:mx-0">
            <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Instant Coverage</h3>
                <p className="text-muted text-sm mt-1">Get protected in under 60 seconds with our AI-powered onboarding.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Hyper-Local Pricing</h3>
                <p className="text-muted text-sm mt-1">Risk assessment based on your exact city and work zone.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Register Worker</h2>
              <p className="text-muted text-sm">Fill in your details and KYC information</p>
            </div>

            {message && (
              <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl mb-6 flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {message}
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-xl mb-6 flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Full Name</label>
                  <input className="input-dark" type="text" name="name" placeholder="e.g. Rahul Kumar" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Email</label>
                  <input className="input-dark" type="email" name="email" placeholder="e.g. rahul@email.com" value={formData.email} onChange={handleChange} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Phone Number</label>
                  <input className="input-dark" type="text" name="phone" placeholder="e.g. 9876543210" value={formData.phone} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Password</label>
                  <input className="input-dark" type="password" name="password" placeholder="Create password" value={formData.password} onChange={handleChange} required />
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-sm font-semibold text-white mb-3">KYC Details (Optional)</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Aadhaar Number</label>
                    <input className="input-dark" type="text" name="aadhaar_number" placeholder="e.g. 123456789012" value={formData.aadhaar_number} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">PAN Number</label>
                    <input className="input-dark" type="text" name="pan_number" placeholder="e.g. ABCDE1234F" value={formData.pan_number} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-sm font-semibold text-white mb-3">Work Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">City</label>
                    <input className="input-dark" type="text" name="city" placeholder="e.g. Hyderabad" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Work Zone</label>
                    <input className="input-dark" type="text" name="zone" placeholder="e.g. Ameerpet" value={formData.zone} onChange={handleChange} required />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Platform</label>
                    <select className="input-dark cursor-pointer" name="platform" value={formData.platform} onChange={handleChange} required>
                      <option value="">Select Platform</option>
                      <option value="Swiggy">Swiggy</option>
                      <option value="Zomato">Zomato</option>
                      <option value="Uber">Uber</option>
                      <option value="Ola">Ola</option>
                      <option value="Rapido">Rapido</option>
                      <option value="Dunzo">Dunzo</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Partner ID</label>
                    <input className="input-dark" type="text" name="partner_id" placeholder="Your partner ID" value={formData.partner_id} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Weekly Income (INR)</label>
                    <input className="input-dark" type="number" name="weekly_income" placeholder="e.g. 5000" value={formData.weekly_income} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Payout Method</label>
                    <select className="input-dark cursor-pointer" name="payout_method" value={formData.payout_method} onChange={handleChange}>
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Wallet">Wallet</option>
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed mt-6">
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Register Worker
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
