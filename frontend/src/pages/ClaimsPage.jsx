import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { getClaimsByUser, getTriggersByUser } from "../services/dashboardService";

function ClaimsPage() {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [triggers, setTriggers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

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
      const [claimsData, triggersData] = await Promise.all([
        getClaimsByUser(user.id),
        getTriggersByUser(user.id)
      ]);
      setClaims(claimsData);
      setTriggers(triggersData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setClaims([]);
      setTriggers([]);
      setError("Claims data could not be loaded. Start the backend to see live claims and triggers.");
    }
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    if (status === "paid" || status === "approved") {
      return <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Paid</span>;
    }
    if (status === "rejected") {
      return <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400 border border-red-500/30">Rejected</span>;
    }
    return <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Pending</span>;
  };

  const getTriggerIcon = (type) => {
    if (type?.toLowerCase().includes("rain")) {
      return { icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", color: "text-blue-400 bg-blue-500/20" };
    }
    if (type?.toLowerCase().includes("storm")) {
      return { icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "text-purple-400 bg-purple-500/20" };
    }
    return { icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", color: "text-amber-400 bg-amber-500/20" };
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
        {error && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-amber-200">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Claims & Payouts</h2>
            <p className="text-slate-400 mt-1">View your triggers and claim history</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{triggers.length}</p>
                    <p className="text-sm text-slate-400">Active Triggers</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{claims.length}</p>
                    <p className="text-sm text-slate-400">Total Claims</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-400">
                      {formatCurrency(claims.reduce((sum, c) => sum + (c.claim_amount || 0), 0))}
                    </p>
                    <p className="text-sm text-slate-400">Total Claimed</p>
                  </div>
                </div>
              </div>
            </div>

            {triggers.length > 0 && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Active Triggers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {triggers.map((trigger) => {
                    const { icon, color } = getTriggerIcon(trigger.trigger_type);
                    return (
                      <div key={trigger.id} className="bg-slate-800/50 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-white">#{trigger.id}</p>
                            <p className="text-sm text-slate-400">{trigger.trigger_type}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-slate-500">Value</p>
                            <p className="text-white font-medium">{trigger.trigger_value}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Zone</p>
                            <p className="text-white font-medium">{trigger.zone}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Claim History</h3>
              {claims.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Claims Yet</h3>
                  <p className="text-slate-400">Your claims will appear here once triggers are detected and processed.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Claim ID</th>
                        <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Trigger ID</th>
                        <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Amount</th>
                        <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.map((claim) => (
                        <tr key={claim.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                          <td className="py-3 px-4 text-white font-medium">#{claim.id}</td>
                          <td className="py-3 px-4 text-slate-400">#{claim.trigger_id}</td>
                          <td className="py-3 px-4 text-emerald-400 font-semibold">{formatCurrency(claim.claim_amount || 0)}</td>
                          <td className="py-3 px-4">{getStatusBadge(claim.status)}</td>
                          <td className="py-3 px-4 text-slate-400 text-sm">
                            {new Date(claim.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default ClaimsPage;
