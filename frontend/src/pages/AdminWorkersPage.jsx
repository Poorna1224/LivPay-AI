import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { deleteWorker, getRegisteredWorkers } from "../services/adminService";
import { useAuth } from "../contexts/AuthContext";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatWorkerLocation = (worker) => {
  if (!worker) return "";
  return `${worker.city}, ${worker.zone} | ${worker.platform}`;
};

function AdminWorkersPage() {
  const navigate = useNavigate();
  const { user, selectWorker, clearSelectedWorker } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [deletingWorkerId, setDeletingWorkerId] = useState(null);

  const loadWorkers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRegisteredWorkers();
      setWorkers(data);
    } catch (err) {
      setError("Unable to load registered workers from the database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  const totalIncome = useMemo(
    () => workers.reduce((sum, worker) => sum + (worker.weekly_income || 0), 0),
    [workers]
  );

  const cityCount = useMemo(() => new Set(workers.map((worker) => worker.city)).size, [workers]);
  const latestWorker = workers.length > 0 ? [...workers].sort((a, b) => b.id - a.id)[0] : null;
  const selectedWorkerId = user?.role === "worker" ? user.id : null;
  const selectedWorker = workers.find((worker) => worker.id === selectedWorkerId) || user;

  const handleOpenWorkerView = (worker) => {
    selectWorker(worker);
    navigate("/worker-dashboard");
  };

  const handleDeleteWorker = async (worker) => {
    const confirmed = window.confirm(
      `Delete worker ${worker.name} (${worker.phone}) and all related policies, triggers, claims, payouts, notifications, and payments?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingWorkerId(worker.id);
    setError("");
    setActionMessage("");

    try {
      const result = await deleteWorker(worker.id);
      if (selectedWorkerId === worker.id) {
        clearSelectedWorker();
      }
      setActionMessage(
        `${worker.name} was removed successfully. Deleted ${result.deleted.policies} policies, ${result.deleted.triggers} triggers, and ${result.deleted.claims} claims.`
      );
      await loadWorkers();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete the selected worker.");
    } finally {
      setDeletingWorkerId(null);
    }
  };

  return (
    <AdminSidebar>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-900 rounded-2xl border border-sky-500/20 p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Workers</p>
              <h1 className="text-3xl font-bold text-white mt-2">Registered Workers</h1>
              <p className="text-slate-300 mt-2 max-w-2xl">
                Every worker registered through the app is listed here directly from the users table.
              </p>
            </div>
            <button
              onClick={loadWorkers}
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "Refresh Workers"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300">
            {error}
          </div>
        )}

        {actionMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-emerald-300">
            {actionMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">Total Registered Workers</p>
            <p className="text-2xl font-bold text-white mt-2">{workers.length}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">Combined Weekly Income</p>
            <p className="text-2xl font-bold text-emerald-400 mt-2">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">Cities Covered</p>
            <p className="text-2xl font-bold text-sky-300 mt-2">{cityCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">Currently Selected Worker</p>
            {selectedWorkerId ? (
              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold text-white">{selectedWorker?.name}</p>
                  <p className="text-slate-400 mt-1">{formatWorkerLocation(selectedWorker)}</p>
                  <p className="text-xs text-emerald-400 mt-2">
                    Worker ID #{selectedWorkerId} is active for dashboard, policy, claims, payments, AI risk, and notifications.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/worker-dashboard")}
                  className="px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-medium hover:bg-indigo-500/30"
                >
                  Open Dashboard
                </button>
              </div>
            ) : (
              <p className="text-slate-400 mt-3">
                Select a worker below to open the worker-facing pages with live PostgreSQL data.
              </p>
            )}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">Latest Registration</p>
            {latestWorker ? (
              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold text-white">{latestWorker.name}</p>
                  <p className="text-slate-400 mt-1">{formatWorkerLocation(latestWorker)}</p>
                </div>
                <button
                  onClick={() => handleOpenWorkerView(latestWorker)}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium hover:bg-emerald-500/30"
                >
                  Open Worker View
                </button>
              </div>
            ) : (
              <p className="text-slate-400 mt-3">No recent registrations yet.</p>
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Worker Directory</h2>
          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading workers...</div>
          ) : workers.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              No workers found yet. Register a new worker and refresh this page.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Phone</th>
                    <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">City / Zone</th>
                    <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Platform</th>
                    <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Weekly Income</th>
                    <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Payout</th>
                    <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((worker) => (
                    <tr
                      key={worker.id}
                      className={`border-b border-slate-800/50 hover:bg-slate-800/30 ${
                        selectedWorkerId === worker.id ? "bg-emerald-500/5" : ""
                      }`}
                    >
                      <td className="py-3 px-4 text-white font-medium">
                        <div className="flex items-center gap-3">
                          <div>
                            {worker.name}
                            {selectedWorkerId === worker.id && (
                              <div className="text-xs text-emerald-400 mt-1">Selected for worker view</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{worker.phone}</td>
                      <td className="py-3 px-4 text-slate-300">
                        {worker.city}
                        <div className="text-xs text-slate-500 mt-1">{worker.zone}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{worker.platform}</td>
                      <td className="py-3 px-4 text-emerald-400 font-semibold">
                        {formatCurrency(worker.weekly_income || 0)}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{worker.payout_method}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenWorkerView(worker)}
                            className="px-3 py-2 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-sm font-medium hover:bg-indigo-500/25"
                          >
                            View Dashboard
                          </button>
                          <button
                            onClick={() => handleDeleteWorker(worker)}
                            disabled={deletingWorkerId === worker.id}
                            className="px-3 py-2 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-sm font-medium hover:bg-red-500/25 disabled:opacity-60"
                          >
                            {deletingWorkerId === worker.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminSidebar>
  );
}

export default AdminWorkersPage;
