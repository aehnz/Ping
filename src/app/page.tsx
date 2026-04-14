import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Animated background blobs */}
      <div className="landing-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <main className="landing-content">
        <div className="landing-badge">
          <span className="badge-dot badge-dot-green" />
          <span className="badge-dot badge-dot-red" />
          Ping
        </div>

        <h1 className="landing-title">
          Don&apos;t guess.
          <br />
          <span className="landing-title-accent">Just ping.</span>
        </h1>

        <p className="landing-subtitle">
          See when they&apos;re free. Be there at the right moment.
        </p>

        <div className="landing-cta">
          <Link href="/login" className="cta-button" id="cta-get-started">
            Get Started
            <span className="cta-arrow">→</span>
          </Link>
        </div>

        <div className="landing-preview">
          <div className="preview-card preview-card-free">
            <div className="preview-dot preview-dot-free" />
            <div>
              <div className="preview-name">Bebo</div>
              <div className="preview-status preview-status-free">Free</div>
            </div>
          </div>
          <div className="preview-connector">
            <span>✦</span>
          </div>
          <div className="preview-card preview-card-dnd">
            <div className="preview-dot preview-dot-dnd" />
            <div>
              <div className="preview-name">Bebu</div>
              <div className="preview-status preview-status-dnd">Do Not Disturb</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <p>For the moments you don&apos;t want to miss.</p>
      </footer>
    </div>
  );
}
