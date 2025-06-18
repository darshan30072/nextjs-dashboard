// utils/toastConfig.ts
import { ToasterProps } from "react-hot-toast";

export const toastOptions: ToasterProps["toastOptions"] = {
  // Default style for all toasts
  style: {
    background: "#1f2937", // dark gray
    color: "#ffffff",
    padding: "12px 16px",
    borderRadius: "8px",
    fontWeight: 600,
  },

  // Specific styles per type
  success: {
    style: {
      background: "#16a34a", // green
      color: "#fff",
    },
    iconTheme: {
      primary: "#bbf7d0", // light green
      secondary: "#166534", // dark green
    },
  },

  error: {
    style: {
      background: "#b91c1c", // red
      color: "#fff",
    },
    iconTheme: {
      primary: "#fecaca", // light red
      secondary: "#7f1d1d", // dark red
    },
  },

  // Optional: customize update toast
  blank: {
    style: {
      background: "#2563eb", // blue
      color: "#fff",
    },   
  },
};
