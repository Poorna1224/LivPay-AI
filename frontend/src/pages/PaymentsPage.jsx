import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { getPayoutsByUser } from "../services/payoutService";
import { getPaymentSummary, getPaymentsByUser, payWeeklyPremium } from "../services/paymentService";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value) => {
  if (!value) return "Not paid yet";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function PaymentsPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      const [summaryData, paymentData, payoutData] = await Promise.all([
        getPaymentSummary(user.id),
        getPaymentsByUser(user.id),
        getPayoutsByUser(user.id),
      ]);
      setSummary(summaryData);
      setPayments(paymentData);
      setPayouts(payoutData);
    } catch (err) {
      setError("Unable to load payment details right now.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (!user?.id) return;
    setPaying(true);
    setError("");
    setSuccessMessage("");
    try {
      const payment = await payWeeklyPremium(user.id);
      setSuccessMessage(
        `Premium paid successfully. Transaction ID: ${payment.transaction_id}. Your next weekly due date has been updated.`
      );
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to process premium payment.");
    } finally {
      setPaying(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
      case "processed":
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Completed</span>;
      case "pending":
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Pending</span>;
      case "failed":
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400 border border-red-500/30">Failed</span>;
      default:
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30">{status}</span>;
    }
  };

  const planStyles = {
    Low: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    Medium: "text-amber-300 bg-amber-500/10 border-amber-500/20",
    High: "text-red-300 bg-red-500/10 border-red-500/20",
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
        <div>
          <h2 className="text-2xl font-bold text-white">Payments</h2>
          <p className="text-slate-400 mt-1">Know exactly how much to pay, when to pay again, and what protection your plan gives you.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-emerald-300">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-indigo-900/80 via-slate-900 to-purple-900/80 border border-indigo-500/20 rounded-3xl p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">Weekly Premium Plan</p>
                  <h3 className="text-3xl font-bold text-white mt-2">
                    Pay {formatCurrency(summary?.weekly_premium || 0)} every week
                  </h3>
                  <p className="text-slate-300 mt-3 max-w-2xl">
                    Your premium is fixed from your current salary and risk profile. Right now your plan is{" "}
                    <span className="font-semibold text-white">{summary?.coverage_label}</span> with{" "}
                    <span className="font-semibold text-white">{formatCurrency(summary?.coverage_amount || 0)}</span> coverage.
                  </p>
                </div>

                <div className="flex flex-col gap-3 min-w-[220px]">
                  <button
                    onClick={handlePayNow}
                    disabled={paying}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-60"
                  >
                    {paying ? "Processing..." : `Pay ${formatCurrency(summary?.amount_due_now || 0)} Now`}
                  </button>
                  <p className="text-xs text-slate-400">
                    Demo payment mode: the app records the weekly premium payment instantly using your saved method.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                <p className="text-sm text-slate-400">Risk Level</p>
                <div className={`inline-flex mt-3 px-3 py-1.5 rounded-full border text-sm font-semibold ${planStyles[summary?.risk_level] || "text-slate-300 bg-slate-500/10 border-slate-500/20"}`}>
                  {summary?.risk_level || "Not available"}
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                <p className="text-sm text-slate-400">Saved Payment Method</p>
                <p className="text-2xl font-bold text-white mt-2">{summary?.payment_method || user.payout_method}</p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                <p className="text-sm text-slate-400">Last Premium Payment</p>
                <p className="text-2xl font-bold text-white mt-2">{formatDate(summary?.last_payment_date)}</p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                <p className="text-sm text-slate-400">Next Due Date</p>
                <p className="text-2xl font-bold text-amber-300 mt-2">{formatDate(summary?.next_due_date)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                <p className="text-sm text-slate-400">How We Fixed Your Premium</p>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="flex justify-between items-center">
                    <span>Low Risk</span>
                    <span className="font-semibold text-white">₹20 / week</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Medium Risk</span>
                    <span className="font-semibold text-white">₹30 / week</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>High Risk</span>
                    <span className="font-semibold text-white">₹40 / week</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                <p className="text-sm text-slate-400">Why Your Current Tier Was Chosen</p>
                <p className="text-white mt-3">
                  City risk, work zone risk, and your weekly income together decide the premium tier. Your current weekly income is{" "}
                  <span className="font-semibold text-emerald-300">{formatCurrency(summary?.weekly_income || 0)}</span>.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                <p className="text-sm text-slate-400">When To Pay Again</p>
                <p className="text-white mt-3">
                  Once you pay today, the app automatically pushes your next due date by{" "}
                  <span className="font-semibold text-amber-300">7 days</span>. Come back before that date and use the same saved payment method.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Premium Payment History</h3>
                {payments.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    No premium payments yet. Make your first weekly payment to activate your schedule.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Transaction</th>
                          <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Date</th>
                          <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Amount</th>
                          <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments
                          .filter((payment) => payment.type === "premium")
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((payment) => (
                            <tr key={payment.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                              <td className="py-3 px-4 text-white font-medium">{payment.transaction_id || `#${payment.id}`}</td>
                              <td className="py-3 px-4 text-slate-400 text-sm">{formatDate(payment.date)}</td>
                              <td className="py-3 px-4 text-emerald-400 font-semibold">{formatCurrency(payment.amount)}</td>
                              <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Insurance Payout History</h3>
                {payouts.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    No insurance payouts yet. Approved claims will appear here.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">ID</th>
                          <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Date</th>
                          <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Amount</th>
                          <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payouts.map((payout) => (
                          <tr key={payout.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                            <td className="py-3 px-4 text-white font-medium">#{payout.id}</td>
                            <td className="py-3 px-4 text-slate-400 text-sm">{formatDate(payout.created_at)}</td>
                            <td className="py-3 px-4 text-emerald-400 font-semibold">{formatCurrency(payout.amount)}</td>
                            <td className="py-3 px-4">{getStatusBadge(payout.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default PaymentsPage;
