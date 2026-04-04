import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { getUserDashboard, getUserPremium, getIncomeLossPrediction } from "../services/dashboardService";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function WorkerDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [premiumData, setPremiumData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const demoDashboard = {
    weekly_income: 6500,
    policy_count: 0,
    trigger_count: 0,
    claim_count: 0,
    total_claim_amount: 0,
  };

  const demoPremium = {
    weekly_premium: 149,
    coverage_amount: 5000,
    risk_level: "Medium",
  };

  const demoPrediction = {
    income_loss_risk_score: 42,
    risk_level: "Medium",
    reason: "Live backend data is unavailable, so demo analytics are being shown.",
    suggested_action: "Start the FastAPI backend to see real worker metrics and AI risk scores.",
    alert_message: "Demo mode is active until backend responses are available.",
    weather_data: { rainfall_mm: 12, temperature_c: 31 },
    traffic_data: { traffic_index: 58 },
    platform_demand_data: { platform_demand_index: 66 },
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError("");
    try {
      const [dashboard, premium, prediction] = await Promise.all([
        getUserDashboard(user.id),
        getUserPremium(user.id),
        getIncomeLossPrediction(user.id),
      ]);
      setDashboardData(dashboard);
      setPremiumData(premium);
      setPredictionData(prediction);
    } catch (err) {
      console.error("Error fetching data:", err);
      setDashboardData(demoDashboard);
      setPremiumData(demoPremium);
      setPredictionData(demoPrediction);
      setError("Backend data could not be loaded. Showing demo dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    if (level === "High") return "text-red-400 bg-red-500/10 border-red-500/20";
    if (level === "Medium") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  };

  const claimsTrend = [
    { label: "Mon", claims: Math.max(0, Math.round((dashboardData?.claim_count || 0) * 0.2)) },
    { label: "Tue", claims: Math.max(0, Math.round((dashboardData?.claim_count || 0) * 0.35)) },
    { label: "Wed", claims: Math.max(0, Math.round((dashboardData?.claim_count || 0) * 0.45)) },
    { label: "Thu", claims: Math.max(0, Math.round((dashboardData?.claim_count || 0) * 0.55)) },
    { label: "Fri", claims: Math.max(0, Math.round((dashboardData?.claim_count || 0) * 0.7)) },
    { label: "Sat", claims: Math.max(0, Math.round((dashboardData?.claim_count || 0) * 0.9)) },
    { label: "Sun", claims: dashboardData?.claim_count || 0 },
  ];

  const riskDistribution = [
    {
      name: premiumData?.risk_level || "Low Risk",
      value: Math.max(20, predictionData?.income_loss_risk_score || 0),
      color:
        premiumData?.risk_level === "High"
          ? "#ef4444"
          : premiumData?.risk_level === "Medium"
            ? "#f59e0b"
            : "#10b981",
    },
    {
      name: "Safety Buffer",
      value: Math.max(5, 100 - (predictionData?.income_loss_risk_score || 0)),
      color: "#334155",
    },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {error && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-amber-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
        {predictionData?.risk_level === "High" && (
          <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-500/30 rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-400">High Income Loss Risk Alert</h3>
                <p className="text-red-300/80 text-sm">{predictionData.alert_message}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-red-400">{predictionData.income_loss_risk_score}%</p>
                <p className="text-xs text-red-400/60">Risk Score</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs text-slate-500">Weekly</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{formatCurrency(dashboardData?.weekly_income || 0)}</p>
            <p className="text-sm text-slate-400">Weekly Income</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-xs text-slate-500">Premium</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400 mb-1">{formatCurrency(premiumData?.weekly_premium || 0)}</p>
            <p className="text-sm text-slate-400">Weekly Premium</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-purple-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs text-slate-500">Coverage</span>
            </div>
            <p className="text-2xl font-bold text-purple-400 mb-1">{formatCurrency(premiumData?.coverage_amount || 0)}</p>
            <p className="text-sm text-slate-400">Coverage Amount</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs text-slate-500">Risk Level</span>
            </div>
            <p className={`text-lg font-bold mb-1 px-3 py-1 rounded-lg border inline-block ${getRiskColor(premiumData?.risk_level)}`}>
              {premiumData?.risk_level || "Low"}
            </p>
            <p className="text-sm text-slate-400 mt-2">Risk Assessment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">AI Risk Analysis</h3>
            </div>

            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading prediction...</div>
            ) : predictionData ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">Risk Score</span>
                    <span className="text-xl font-bold text-white">{predictionData.income_loss_risk_score}%</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        predictionData.risk_level === "High"
                          ? "bg-gradient-to-r from-red-500 to-orange-500"
                          : predictionData.risk_level === "Medium"
                            ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                            : "bg-gradient-to-r from-emerald-500 to-teal-500"
                      }`}
                      style={{ width: `${predictionData.income_loss_risk_score}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Primary Reason</p>
                  <p className="text-sm text-white">{predictionData.reason}</p>
                </div>

                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                  <p className="text-xs text-indigo-400 mb-1">Recommended Action</p>
                  <p className="text-sm text-white">{predictionData.suggested_action}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">Unable to load prediction.</div>
            )}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Weather and Demand Signals</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Rainfall</p>
                <p className="text-xl font-bold text-white">{predictionData?.weather_data?.rainfall_mm || 0} mm</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Temperature</p>
                <p className="text-xl font-bold text-white">{predictionData?.weather_data?.temperature_c || 0} C</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Traffic Index</p>
                <p className="text-xl font-bold text-amber-400">{predictionData?.traffic_data?.traffic_index || 0}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Platform Demand</p>
                <p className="text-xl font-bold text-emerald-400">{predictionData?.platform_demand_data?.platform_demand_index || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <span className="text-sm text-slate-400">Active Policies</span>
            <p className="text-2xl font-bold text-white mt-2">{dashboardData?.policy_count || 0}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <span className="text-sm text-slate-400">Triggers</span>
            <p className="text-2xl font-bold text-white mt-2">{dashboardData?.trigger_count || 0}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <span className="text-sm text-slate-400">Total Claims</span>
            <p className="text-2xl font-bold text-white mt-2">{dashboardData?.claim_count || 0}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <span className="text-sm text-slate-400">Claimed Amount</span>
            <p className="text-2xl font-bold text-emerald-400 mt-2">{formatCurrency(dashboardData?.total_claim_amount || 0)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Claims Per Week</h3>
              <span className="text-xs text-slate-500">Dashboard chart</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={claimsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }} />
                <Bar dataKey="claims" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Risk Level Distribution</h3>
              <span className="text-xs text-slate-500">AI risk mix</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={riskDistribution} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={4}>
                  {riskDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 mt-3">
              {riskDistribution.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/policy" className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm text-white">Create Policy</span>
            </Link>
            <Link to="/claims" className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-sm text-white">View Claims</span>
            </Link>
            <Link to="/payments" className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <span className="text-sm text-white">Payments</span>
            </Link>
            <Link to="/ai-risk" className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-sm text-white">AI Analysis</span>
            </Link>
          </div>
        </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default WorkerDashboard;
