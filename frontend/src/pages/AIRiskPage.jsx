import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { getIncomeLossPrediction } from "../services/dashboardService";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function AIRiskPage() {
  const { user } = useAuth();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchPrediction();
    }
  }, [user]);

  const fetchPrediction = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await getIncomeLossPrediction(user.id);
      setPrediction(data);
    } catch (err) {
      console.error("Error fetching prediction:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    if (level === "High") return { bg: "from-red-500 to-orange-500", text: "text-red-400" };
    if (level === "Medium") return { bg: "from-amber-500 to-yellow-500", text: "text-amber-400" };
    return { bg: "from-emerald-500 to-teal-500", text: "text-emerald-400" };
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">AI Risk Analysis</h2>
            <p className="text-slate-400 mt-1">Real-time income loss prediction powered by AI</p>
          </div>
          <button
            onClick={fetchPrediction}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
          >
            Refresh Analysis
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        ) : prediction ? (
          <>
            <div className={`bg-gradient-to-r ${getRiskColor(prediction.risk_level).bg} rounded-2xl p-8 relative overflow-hidden`}>
              <div className="relative flex items-end justify-between gap-6">
                <div>
                  <p className="text-sm text-white/80 mb-2">Income Loss Risk Score</p>
                  <p className="text-6xl font-bold text-white">{prediction.income_loss_risk_score}%</p>
                  <span className="inline-flex mt-3 px-4 py-1.5 bg-white/20 rounded-full text-white font-medium text-sm">
                    {prediction.risk_level} Risk
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm mb-1">Alert Message</p>
                  <p className="text-xl font-semibold text-white max-w-sm">{prediction.alert_message}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Risk Factors</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-400">Risk Score</span>
                      <span className="text-sm font-medium text-white">{prediction.income_loss_risk_score}%</span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${
                          prediction.risk_level === "High"
                            ? "from-red-500 to-orange-500"
                            : prediction.risk_level === "Medium"
                              ? "from-amber-500 to-yellow-500"
                              : "from-emerald-500 to-teal-500"
                        }`}
                        style={{ width: `${prediction.income_loss_risk_score}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Primary Reason</p>
                    <p className="text-white font-medium">{prediction.reason}</p>
                  </div>

                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <p className="text-xs text-indigo-400 mb-1">Suggested Action</p>
                    <p className="text-slate-200">{prediction.suggested_action}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Environmental Data</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Rainfall</p>
                    <p className="text-2xl font-bold text-white">{prediction.weather_data?.rainfall_mm || 0} mm</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Temperature</p>
                    <p className="text-2xl font-bold text-white">{prediction.weather_data?.temperature_c || 0} C</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Traffic Index</p>
                    <p className="text-2xl font-bold text-amber-400">{prediction.traffic_data?.traffic_index || 0}</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Platform Demand</p>
                    <p className="text-2xl font-bold text-emerald-400">{prediction.platform_demand_data?.platform_demand_index || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Your Profile Data</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">City</p>
                  <p className="text-white font-medium">{prediction.city}</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Zone</p>
                  <p className="text-white font-medium">{prediction.zone}</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Weekly Income</p>
                  <p className="text-white font-medium">{formatCurrency(prediction.weekly_income)}</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Risk Level</p>
                  <p className={`font-medium ${getRiskColor(prediction.risk_level).text}`}>{prediction.risk_level}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
            <p className="text-slate-400">Unable to load prediction data. Please try again.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AIRiskPage;
