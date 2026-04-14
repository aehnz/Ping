"use client";

import { UserProfile } from "@/lib/types";

function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 10) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${diffDay}d ago`;
}

interface UserCardProps {
  user: UserProfile | null;
  label: string;
  isLoading?: boolean;
}

export default function UserCard({ user, label, isLoading }: UserCardProps) {
  if (isLoading) {
    return (
      <div className="user-card">
        <span className="card-label">{label}</span>
        <div className="card-loading">
          <div className="loading-pulse" />
          <div className="loading-pulse loading-pulse-short" />
          <div className="loading-pulse loading-pulse-shorter" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-card user-card-empty">
        <span className="card-label">{label}</span>
        <div className="card-empty-content">
          <div className="empty-icon">💫</div>
          <p className="empty-text">No partner linked yet</p>
        </div>
      </div>
    );
  }

  const isFree = user.status === "free";

  return (
    <div className={`user-card ${isFree ? "user-card-free" : "user-card-dnd"}`}>
      <span className="card-label">{label}</span>

      <div className="card-header">
        <div className={`status-dot ${isFree ? "status-dot-free" : "status-dot-dnd"}`}>
          <div className="status-dot-inner" />
        </div>
        <div className="card-header-info">
          <h3 className="card-name">{user.name || user.email}</h3>
          <span className={`status-badge ${isFree ? "badge-free" : "badge-dnd"}`}>
            {isFree ? "Free" : "Do Not Disturb"}
          </span>
        </div>
      </div>

      {user.custom_message && (
        <div className="card-message">
          <span className="message-icon">💬</span>
          <p className="message-text">&ldquo;{user.custom_message}&rdquo;</p>
        </div>
      )}

      <div className="card-footer">
        <span className="card-updated">Updated {getRelativeTime(user.updated_at)}</span>
      </div>
    </div>
  );
}
