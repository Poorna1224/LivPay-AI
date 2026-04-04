import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { getSchedulerStatus, getSchedulerLogs, runSchedulerManual } from "../services/schedulerService";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const toTitleCase = (value = "") =>
  String(value)
    .replace(/_/g, " ")
    .trim()
    .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

const getSourceStyles = (source = "") => {
  const normalized = source.toLowerCase();
  if (normalized === "weather") return "bg-blue-500/10 text-blue-300 border-blue-500/20";
  if (normalized === "aqi") return "bg-amber-500/10 text-amber-300 border-amber-500/20";
  if (normalized === "traffic") return "bg-rose-500/10 text-rose-300 border-rose-500/20";
  return "bg-slate-500/10 text-slate-300 border-slate-500/20";
};

const formatMetric = (trigger) => {
  const source = trigger?.source?.toLowerCase();
  const triggerType = trigger?.trigger_type?.toLowerCase() || "";
  const value = trigger?.trigger_value;

  if (value === undefined || value === null) {
    return "N/A";
  }

  if (source === "weather" || triggerType.includes("heat")) {
    return `${value}°C`;
  }

  if (source === "aqi") {
    return `${value} AQI`;
  }

  if (source === "traffic") {
    return `Level ${value}`;
  }

  return String(value);
};

function AdminTriggersPage() {
  const [status, setStatus] = useState(null);
  const [triggerData, setTriggerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [schedulerStatus, currentTriggers] = await Promise.all([
        getSchedulerStatus(),
        getSchedulerLogs(),
      ]);
      setStatus(schedulerStatus);
      setTriggerData(currentTriggers);
    } catch (err) {
      setError("Unable to load scheduler and trigger data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunNow = async () => {
    setRunning(true);
    setError("");
    try {
      await runSchedulerManual();
      await loadData();
    } catch (err) {
      setError("Manual scheduler run failed.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <AdminSidebar>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-cyan-900 rounded-2xl border border-indigo-500/20 p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">Automation</p>
              <h1 className="text-3xl font-bold text-white mt-2">System Trigger Scheduler</h1>
              <p className="text-slate-300 mt-2 max-w-2xl">
                Monitor the 10-minute automation loop for weather, AQI, traffic, and platform-demand checks.
              </p>
            </div>
            <button
              onClick={handleRunNow}
              disabled={running}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-medium disabled:opacity-60"
            >
              {running ? "Running..." : "Run Scheduler Now"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">Scheduler Status</p>
            <p className="text-2xl font-bold text-emerald-400 mt-2">
              {status?.running || status?.scheduler_running ? "Running" : "Idle"}
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">Execution Interval</p>
            <p className="text-2xl font-bold text-white mt-2">{status?.interval || "10 mins"}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">Detected Triggers</p>
            <p className="text-2xl font-bold text-amber-400 mt-2">{triggerData?.detected_triggers?.length || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Automation Workflow</h2>
            <div className="space-y-3">
              {[
                "Check Weather API",
                "Check AQI API",
                "Check Traffic API",
                "Check Platform Demand Data",
                "Create trigger if threshold is exceeded",
                "Create claim and continue fraud review flow",
                "Prepare payout processing stage",
              ].map((step, index) => (
                <div key={step} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-slate-200">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Current Trigger Feed</h2>
            {loading ? (
              <div className="py-12 text-center text-slate-400">Loading triggers...</div>
            ) : !triggerData?.detected_triggers?.length ? (
              <div className="py-12 text-center text-slate-400">
                No active triggers were returned from the scheduler snapshot yet. Use "Run Scheduler Now" after the backend starts, or wait for the next interval.
              </div>
            ) : (
              <div className="space-y-4">
                {triggerData.detected_triggers.map((trigger, index) => (
                  <div key={`${trigger.trigger_type || trigger.type}-${index}`} className="p-5 bg-slate-800/50 rounded-2xl border border-slate-700">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white text-lg">
                          {toTitleCase(trigger.trigger_type || trigger.type || "Trigger")}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">Threshold exceeded for this monitored risk signal.</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs border border-amber-500/20 whitespace-nowrap">
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                      <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-700">
                        <p className="text-xs uppercase tracking-wide text-slate-500">City</p>
                        <p className="text-sm font-medium text-white mt-1">{toTitleCase(trigger.city || "Unknown")}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-700">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Zone</p>
                        <p className="text-sm font-medium text-white mt-1">{toTitleCase(trigger.zone || "Unknown")}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-700">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Measured Value</p>
                        <p className="text-sm font-medium text-white mt-1">{formatMetric(trigger)}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-700">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Source</p>
                        <span className={`inline-flex mt-1 px-2.5 py-1 rounded-full text-xs border ${getSourceStyles(trigger.source)}`}>
                          {toTitleCase(trigger.source || "system")}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-700">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Estimated Claim</p>
                        <p className="text-sm font-semibold text-emerald-300 mt-1">
                          {formatCurrency(trigger.claim_amount || 0)}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-700">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Feed Meaning</p>
                        <p className="text-sm text-slate-300 mt-1">
                          This trigger can create or support an automated claim flow for impacted workers.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}

export default AdminTriggersPage;
