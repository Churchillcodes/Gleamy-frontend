import React from "react";
import toast from "react-hot-toast";

/**
 * Shows an in-app confirmation toast instead of the browser's native
 * confirm() dialog, so it matches the rest of the app's styling.
 * Stays open until the admin picks an option (duration: Infinity) —
 * same pattern used for order cancellation.
 *
 * @param {string} message - The question to ask, e.g. "Archive this product?"
 * @param {function} onConfirm - Called if the admin confirms
 * @param {object} [options]
 * @param {string} [options.confirmLabel="Yes, Continue"]
 * @param {string} [options.cancelLabel="Keep It"]
 */
export function confirmToast(message, onConfirm, options = {}) {
  const { confirmLabel = "Yes, Continue", cancelLabel = "Keep It" } = options;

  toast(
    (t) => (
      <div className="flex flex-col gap-3 min-w-[220px]">
        <p className="text-sm font-semibold text-charcoal-text leading-snug">
          {message}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-walnut-brown/25 text-walnut-brown bg-white hover:bg-walnut-brown/5 transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      style: {
        background: "#FFFFFF",
        color: "#2B2622",
        border: "1px solid rgba(92,64,51,0.15)",
        boxShadow: "0 10px 25px -5px rgba(92,64,51,0.15)",
        maxWidth: "360px",
      },
    },
  );
}
