"use client";

import { UserStatus } from "@/lib/types";

interface StatusToggleProps {
  status: UserStatus;
  onChange: (status: UserStatus) => void;
  disabled?: boolean;
}

export default function StatusToggle({ status, onChange, disabled }: StatusToggleProps) {
  const isFree = status === "free";

  return (
    <div className="status-toggle-container">
      <span className={`toggle-label ${isFree ? "toggle-label-active-free" : ""}`}>
        Free
      </span>

      <button
        type="button"
        className={`toggle-track ${isFree ? "toggle-track-free" : "toggle-track-dnd"}`}
        onClick={() => onChange(isFree ? "dnd" : "free")}
        disabled={disabled}
        aria-label={`Switch to ${isFree ? "Do Not Disturb" : "Free"}`}
        id="status-toggle"
      >
        <div className={`toggle-thumb ${isFree ? "toggle-thumb-free" : "toggle-thumb-dnd"}`} />
      </button>

      <span className={`toggle-label ${!isFree ? "toggle-label-active-dnd" : ""}`}>
        DND
      </span>
    </div>
  );
}
