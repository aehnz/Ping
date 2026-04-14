"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface NavbarProps {
  userName?: string;
}

export default function Navbar({ userName }: NavbarProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/dashboard" className="navbar-brand">
          <span className="brand-dot" />
          Ping
        </Link>

        <div className="navbar-links">
          <Link href="/dashboard" className="nav-link" id="nav-dashboard">
            Dashboard
          </Link>
          <Link href="/profile" className="nav-link" id="nav-profile">
            Profile
          </Link>
        </div>

        <div className="navbar-right">
          {userName && <span className="nav-username">{userName}</span>}
          <button onClick={handleLogout} className="nav-logout" id="nav-logout">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
