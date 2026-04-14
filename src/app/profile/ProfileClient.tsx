"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserProfile, UserStatus } from "@/lib/types";
import Navbar from "@/components/Navbar";
import StatusToggle from "@/components/StatusToggle";

export default function ProfileClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<UserStatus>("free");
  const [customMessage, setCustomMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = useCallback(async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) return;

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (data) {
      const p = data as UserProfile;
      setProfile(p);
      setName(p.name);
      setStatus(p.status);
      setCustomMessage(p.custom_message);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleStatusChange = async (newStatus: UserStatus) => {
    setStatus(newStatus);
    // Immediately save status change
    if (profile) {
      await supabase
        .from("users")
        .update({ status: newStatus })
        .eq("id", profile.id);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from("users")
      .update({
        name,
        status,
        custom_message: customMessage,
      })
      .eq("id", profile.id);

    setSaving(false);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="app-shell">
        <div className="aurora-bg">
          <div className="aurora-blob aurora-blob-1" />
          <div className="aurora-blob aurora-blob-2" />
          <div className="aurora-blob aurora-blob-3" />
        </div>
        <Navbar />
        <main className="profile-main">
          <div className="profile-loading">Loading profile...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Aurora background */}
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>

      <Navbar userName={profile?.name || profile?.email} />

      <main className="profile-main">
        <div className="profile-header">
          <h1 className="profile-title">Your Profile</h1>
          <p className="profile-subtitle">Update your status and info</p>
        </div>

        <div className="profile-card">
          {/* Status Toggle */}
          <div className="profile-section">
            <h2 className="profile-section-title">Current Status</h2>
            <StatusToggle status={status} onChange={handleStatusChange} />
            <p className="profile-status-hint">
              {status === "free"
                ? "Your partner will see you're available 💚"
                : "Your partner will know not to disturb you 🔴"}
            </p>
          </div>

          <div className="profile-divider" />

          {/* Name */}
          <div className="profile-section">
            <label htmlFor="profile-name" className="profile-field-label">
              Display Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="profile-input"
            />
          </div>

          {/* Custom Message */}
          <div className="profile-section">
            <label htmlFor="profile-message" className="profile-field-label">
              Custom Message
            </label>
            <textarea
              id="profile-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="e.g., In a meeting until 3pm..."
              className="profile-textarea"
              rows={3}
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className={`profile-save ${saved ? "profile-save-success" : ""}`}
            id="profile-save-btn"
          >
            {saving ? (
              <span className="auth-spinner" />
            ) : saved ? (
              "✓ Saved!"
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
