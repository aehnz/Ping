"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface PartnerLinkProps {
  partnerCode: string;
  onLinked: () => void;
}

export default function PartnerLink({ partnerCode, onLinked }: PartnerLinkProps) {
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(partnerCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLink = async () => {
    if (!inputCode.trim()) {
      setError("Please enter a partner code");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: rpcError } = await supabase.rpc("link_partner", {
      partner_code_input: inputCode.trim(),
    });

    if (rpcError) {
      setError(rpcError.message);
      setLoading(false);
      return;
    }

    if (data && !data.success) {
      setError(data.error);
      setLoading(false);
      return;
    }

    onLinked();
    setLoading(false);
  };

  return (
    <div className="partner-link-card">
      <h3 className="partner-link-title">Link Your Partner 💑</h3>
      <p className="partner-link-desc">
        Share your code with your partner, or enter theirs to connect.
      </p>

      {/* Your code */}
      <div className="partner-code-section">
        <label className="partner-code-label">Your Partner Code</label>
        <div className="partner-code-display">
          <code className="partner-code-value">{partnerCode}</code>
          <button onClick={handleCopy} className="partner-code-copy" id="copy-partner-code">
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Enter partner code */}
      <div className="partner-input-section">
        <label className="partner-input-label">Enter Partner&apos;s Code</label>
        <div className="partner-input-row">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Paste partner code here..."
            className="partner-input"
            id="partner-code-input"
          />
          <button
            onClick={handleLink}
            disabled={loading}
            className="partner-link-btn"
            id="link-partner-btn"
          >
            {loading ? "Linking..." : "Link"}
          </button>
        </div>
        {error && <p className="partner-error">{error}</p>}
      </div>
    </div>
  );
}
