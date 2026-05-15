import { useState } from 'react';
import axios from 'axios';
import './index.css';
import UploadSection from './components/UploadSection';
import Dashboard from './components/Dashboard';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8000');

const LOADING_STEPS = [
  { id: 1, label: '📄 Parsing PDF resume…' },
  { id: 2, label: '🧠 Running NLP analysis…' },
  { id: 3, label: '🎯 Matching job description…' },
  { id: 4, label: '📊 Computing ATS score…' },
  { id: 5, label: '✨ Generating smart suggestions…' },
];

export default function App() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (file, jobDescription) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setStep(0);

    // Simulate step-by-step progress
    const stepInterval = setInterval(() => {
      setStep(prev => {
        if (prev < LOADING_STEPS.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 900);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('job_description', jobDescription);

      const response = await axios.post(`${API_BASE}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });

      clearInterval(stepInterval);
      setStep(LOADING_STEPS.length);
      setResult(response.data);
    } catch (err) {
      clearInterval(stepInterval);
      const msg =
        err.response?.data?.detail ||
        err.message ||
        'Unknown error. Make sure the backend is running on port 8000.';
      setError(msg);
    } finally {
      setLoading(false);
      setStep(0);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <>
      <div className="app-bg" />
      <div className="app-wrapper">
        {/* HERO */}
        <header className="hero">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            AI-Powered Resume Intelligence System
          </div>
          <h1>
            Get Your Resume <span className="gradient-text">ATS-Ready</span>
            <br />in Seconds
          </h1>
          <p>
            Upload your resume, paste a job description, and get instant
            ATS scores, job match analysis, and AI-powered suggestions
            to land more interviews.
          </p>
        </header>

        {/* Error banner */}
        {error && (
          <div className="error-banner container">
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <strong>Analysis Failed:</strong> {error}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-overlay container">
            <div className="spinner" />
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem' }}>
              Analyzing your resume…
            </h3>
            <div className="loading-steps">
              {LOADING_STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={`loading-step ${
                    i < step ? 'done' : i === step ? 'active' : ''
                  }`}
                >
                  {i < step ? '✅' : i === step ? '⏳' : '○'}
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload (shown when no result) */}
        {!loading && !result && (
          <UploadSection onAnalyze={handleAnalyze} loading={loading} />
        )}

        {/* Dashboard */}
        {!loading && result && (
          <Dashboard data={result} onReset={handleReset} />
        )}

        <footer className="footer">
          <p>Resume Intelligence System · Built with FastAPI + spaCy + React</p>
        </footer>
      </div>
    </>
  );
}
