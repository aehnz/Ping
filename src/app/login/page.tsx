"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (isLogin) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      setSuccess("Check your email to confirm your account, then log in!");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <a href="/" className="auth-brand">
            <span className="brand-dot" />
            Status
          </a>
          <p className="auth-tagline">Stay connected, effortlessly</p>
        </div>

        {/* Tab Toggle */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? "auth-tab-active" : ""}`}
            onClick={() => { setIsLogin(true); setError(""); setSuccess(""); }}
            id="tab-login"
          >
            Log In
          </button>
          <button
            className={`auth-tab ${!isLogin ? "auth-tab-active" : ""}`}
            onClick={() => { setIsLogin(false); setError(""); setSuccess(""); }}
            id="tab-signup"
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="form-input"
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="auth-error" id="auth-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {success && (
            <div className="auth-success" id="auth-success">
              <span>✅</span> {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-submit"
            id="auth-submit"
          >
            {loading ? (
              <span className="auth-spinner" />
            ) : isLogin ? (
              "Log In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
