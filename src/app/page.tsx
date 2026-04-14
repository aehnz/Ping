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
          Real-Time Status
        </div>

        <h1 className="landing-title">
          Know When Your
          <br />
          <span className="landing-title-accent">Partner is Free</span>
        </h1>

        <p className="landing-subtitle">
          A beautifully simple way for couples to share their availability.
          <br />
          Set your status. See theirs. In real time.
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
              <div className="preview-name">Alex</div>
              <div className="preview-status preview-status-free">Free</div>
            </div>
          </div>
          <div className="preview-connector">
            <span>💕</span>
          </div>
          <div className="preview-card preview-card-dnd">
            <div className="preview-dot preview-dot-dnd" />
            <div>
              <div className="preview-name">Jordan</div>
              <div className="preview-status preview-status-dnd">Do Not Disturb</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <p>Built with ❤️ for couples everywhere</p>
      </footer>
    </div>
  );
}
