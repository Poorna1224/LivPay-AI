import { useState, createContext, useContext, useCallback } from "react";

const NotificationContext = createContext();

export const notificationTypes = {
  HIGH_RISK: "high_risk",
  TRIGGER_DETECTED: "trigger_detected",
  CLAIM_CREATED: "claim_created",
  FRAUD_COMPLETED: "fraud_completed",
  PAYOUT_PROCESSED: "payout_processed",
  POLICY_EXPIRING: "policy_expiring",
  PREMIUM_UPDATED: "premium_updated",
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
};

export const getNotificationConfig = (type) => {
  const configs = {
    [notificationTypes.HIGH_RISK]: {
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      text: "text-red-400",
      label: "High Risk Alert",
    },
    [notificationTypes.TRIGGER_DETECTED]: {
      icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      label: "Trigger Detected",
    },
    [notificationTypes.CLAIM_CREATED]: {
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
      label: "Claim Created",
    },
    [notificationTypes.FRAUD_COMPLETED]: {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      label: "Fraud Check",
    },
    [notificationTypes.PAYOUT_PROCESSED]: {
      icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      label: "Payout Processed",
    },
    [notificationTypes.POLICY_EXPIRING]: {
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      text: "text-orange-400",
      label: "Policy Expiring",
    },
    [notificationTypes.PREMIUM_UPDATED]: {
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400",
      label: "Premium Updated",
    },
    [notificationTypes.INFO]: {
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
      label: "Info",
    },
    [notificationTypes.SUCCESS]: {
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      label: "Success",
    },
    [notificationTypes.WARNING]: {
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      label: "Warning",
    },
    [notificationTypes.ERROR]: {
      icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      text: "text-red-400",
      label: "Error",
    },
  };
  return configs[type] || configs.info;
};

const initialNotifications = [
  {
    id: 1,
    type: notificationTypes.HIGH_RISK,
    title: "High Income Loss Risk Detected",
    message: "Your income loss risk score has increased to 78% due to heavy rainfall in your zone.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
  },
  {
    id: 2,
    type: notificationTypes.TRIGGER_DETECTED,
    title: "Rainfall Trigger Activated",
    message: "A rainfall trigger has been detected in Hyderabad - Ameerpet zone. You may be eligible for a claim.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: 3,
    type: notificationTypes.CLAIM_CREATED,
    title: "Claim Created Successfully",
    message: "Claim #CLM-2847 has been created from trigger #TRG-1204. Claim amount: INR 2,500.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: true,
  },
  {
    id: 4,
    type: notificationTypes.PAYOUT_PROCESSED,
    title: "Payout Processed",
    message: "Payout of INR 2,500 has been processed to your UPI account.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
  },
  {
    id: 5,
    type: notificationTypes.POLICY_EXPIRING,
    title: "Policy Expiring Soon",
    message: "Your policy #POL-8923 is expiring in 3 days. Consider renewing to maintain coverage.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [toasts, setToasts] = useState([]);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    
    const config = getNotificationConfig(notification.type);
    const newToast = {
      id: Date.now(),
      ...notification,
      config,
    };
    setToasts((prev) => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 5000);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        toasts,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        removeToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
