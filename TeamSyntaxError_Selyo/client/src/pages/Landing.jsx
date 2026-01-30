import { Link } from 'react-router-dom'
import './Landing.css'

function Landing() {
    return (
        <div className="landing">
            {/* Header */}
            <header className="landing-header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo">
                            <span className="logo-icon">◆</span>
                            <span className="logo-text">SELYO</span>
                        </div>
                        <nav className="header-nav">
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            A Digital Command Center for<br />
                            <span className="text-navy">Registrar Requests</span>
                        </h1>
                        <p className="hero-subtitle">
                            Streamline your academic document requests with SELYO — a modern,
                            efficient, and secure digital workflow system designed for Philippine
                            state universities.
                        </p>
                        <div className="hero-actions">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Get Started
                            </Link>
                            <Link to="/login" className="btn btn-secondary btn-lg">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <h2 className="section-title">How SELYO Works</h2>
                    <p className="section-subtitle">
                        Simple, transparent, and efficient processing of your academic requests
                    </p>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📝</div>
                            <h3>Submit Request</h3>
                            <p>Fill out the digital form and upload required documents from anywhere, anytime.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3>Track Status</h3>
                            <p>Monitor your request's progress in real-time through your personal dashboard.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">✅</div>
                            <h3>Get Approved</h3>
                            <p>Receive instant notification when your request is approved or if action is needed.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3>Claim with QR</h3>
                            <p>Present your unique QR code at the registrar for quick and secure document pickup.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Request Types */}
            <section className="request-types">
                <div className="container">
                    <h2 className="section-title">Supported Request Types</h2>

                    <div className="request-types-grid">
                        <div className="request-type-card">
                            <div className="request-type-header">
                                <span className="request-type-icon">📄</span>
                                <h3>Transcript of Records (TOR)</h3>
                            </div>
                            <p>Request official academic transcripts for employment, further studies, or personal records.</p>
                        </div>

                        <div className="request-type-card">
                            <div className="request-type-header">
                                <span className="request-type-icon">🔄</span>
                                <h3>Shifting</h3>
                            </div>
                            <p>Apply to transfer to a different course or program within the university.</p>
                        </div>

                        <div className="request-type-card">
                            <div className="request-type-header">
                                <span className="request-type-icon">📋</span>
                                <h3>Add / Drop</h3>
                            </div>
                            <p>Modify your enrolled subjects by adding or dropping courses during the adjustment period.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to streamline your registrar experience?</h2>
                        <p>Join SELYO today and say goodbye to long queues and manual processing.</p>
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Create Your Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <span className="logo-icon">◆</span>
                            <span className="logo-text">SELYO</span>
                        </div>
                        <p className="footer-text">
                            © 2024 SELYO Digital Registrar System. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Landing
