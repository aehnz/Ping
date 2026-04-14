"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/lib/types";
import Navbar from "@/components/Navbar";
import UserCard from "@/components/UserCard";
import PartnerLink from "@/components/PartnerLink";

export default function DashboardClient() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [partner, setPartner] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) return;

    // Fetch current user profile
    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (profile) {
      setCurrentUser(profile as UserProfile);

      // Fetch partner if linked
      if (profile.partner_id) {
        const { data: partnerProfile } = await supabase
          .from("users")
          .select("*")
          .eq("id", profile.partner_id)
          .single();

        if (partnerProfile) {
          setPartner(partnerProfile as UserProfile);
        }
      }
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time subscription for partner updates
  useEffect(() => {
    if (!currentUser?.partner_id) return;

    const channel = supabase
      .channel("partner-status")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${currentUser.partner_id}`,
        },
        (payload) => {
          setPartner(payload.new as UserProfile);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.partner_id, supabase]);

  // Real-time subscription for own profile changes (from other tabs)
  useEffect(() => {
    if (!currentUser?.id) return;

    const channel = supabase
      .channel("own-status")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${currentUser.id}`,
        },
        (payload) => {
          setCurrentUser(payload.new as UserProfile);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id, supabase]);

  return (
    <div className="app-shell">
      <Navbar userName={currentUser?.name || currentUser?.email} />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Your real-time connection at a glance
          </p>
        </div>

        <div className="dashboard-grid">
          <UserCard user={currentUser} label="You" isLoading={loading} />
          <UserCard user={partner} label="Partner" isLoading={loading} />
        </div>

        {currentUser && !currentUser.partner_id && !loading && (
          <PartnerLink
            partnerCode={currentUser.partner_code}
            onLinked={fetchData}
          />
        )}
      </main>
    </div>
  );
}
