import { useState } from 'react';
import { ScoreRing, DimensionBars, MatchScoreCard } from './ScoreCards';
import SkillsAnalysis from './SkillsAnalysis';
import SectionFeedback from './SectionFeedback';
import Suggestions from './Suggestions';
import { RadarChart, SkillDonutChart } from './Charts';
import { RotateCcw, FileText, Clock, Hash } from 'lucide-react';

const TABS = [
  { id: 'overview', label: '📊 Overview' },
  { id: 'skills', label: '🧠 Skills' },
  { id: 'suggestions', label: '✨ Suggestions' },
  { id: 'sections', label: '📋 Sections' },
];

export default function Dashboard({ data, onReset }) {
  const [tab, setTab] = useState('overview');
  const { resume_meta, ats, matching, profile, suggestions } = data;

  const statCards = [
    {
      label: 'ATS Score',
      value: `${ats.overall_score}/100`,
      gradient: 'var(--gradient-primary)',
      icon: <FileText size={18} />,
    },
    {
      label: 'Job Match',
      value: `${matching.match_score}%`,
      gradient: 'var(--gradient-green)',
      icon: '🎯',
    },
    {
      label: 'Skills Found',
      value: profile.skills.length,
      gradient: 'linear-gradient(135deg,#38bdf8,#6378ff)',
      icon: '🧠',
    },
    {
      label: 'Words',
      value: resume_meta.word_count,
      gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
      icon: <Hash size={18} />,
    },
  ];

  return (
    <div className="dashboard container">
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.4rem', fontWeight: 700 }}>
            Analysis Results
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            {resume_meta.filename} · {resume_meta.page_count} page{resume_meta.page_count !== 1 ? 's' : ''}
            {resume_meta.has_tables && ' · ⚠️ Tables detected'}
            {resume_meta.has_images && ' · ⚠️ Images detected'}
          </p>
        </div>
        <button className="btn-secondary" onClick={onReset} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RotateCcw size={14} />
          Analyze Another
        </button>
      </div>

      {/* Quick stat cards */}
      <div className="stats-grid" style={{ padding: 0 }}>
        {statCards.map((s, i) => (
          <div key={i} className="stat-card fade-in-up">
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: s.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}>{s.icon}</div>
            </div>
            <div className="stat-value" style={{ background: s.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {s.value}
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-list">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="dashboard-top-row">
            <ScoreRing
              score={ats.overall_score}
              grade={ats.grade}
              label={`Grade ${ats.grade} · ${getScoreLabel(ats.overall_score)}`}
            />
            <DimensionBars dimensions={ats.dimensions} />
            <MatchScoreCard matchData={matching} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <RadarChart dimensions={ats.dimensions} />
            <SkillDonutChart
              resumeSkillCount={matching.matching_keywords.length}
              missingCount={matching.missing_keywords.length}
            />
          </div>
          {ats.formatting_issues.length > 0 && (
            <div className="card" style={{ borderColor: 'rgba(248,113,113,0.3)' }}>
              <div className="card-title">
                <span className="card-title-icon">⚠️</span>
                Formatting Issues
              </div>
              {ats.formatting_issues.map((issue, i) => (
                <div key={i} style={{
                  padding: '10px 14px',
                  background: 'rgba(248,113,113,0.07)',
                  border: '1px solid rgba(248,113,113,0.2)',
                  borderRadius: 8, fontSize: '0.86rem',
                  color: 'var(--text-secondary)', marginBottom: 8,
                }}>
                  ⚠️ {issue}
                </div>
              ))}
            </div>
          )}

          {/* Profile quick stats */}
          <div className="card">
            <div className="card-title">
              <span className="card-title-icon">👤</span>
              Resume Profile
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { label: 'Experience Est.', value: `${profile.experience_years} yrs`, color: 'var(--accent-primary)' },
                { label: 'Bullet Points', value: profile.bullet_count, color: 'var(--accent-blue)' },
                { label: 'Weak Bullets', value: profile.weak_bullet_count, color: 'var(--accent-orange)' },
                { label: 'Technical Skills', value: profile.technical_skills.length, color: 'var(--accent-green)' },
                { label: 'Soft Skills', value: profile.soft_skills.length, color: 'var(--accent-secondary)' },
                { label: 'Action Verb %', value: `${Math.round(profile.action_verb_score * 100)}%`, color: 'var(--accent-green)' },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '14px', background: 'rgba(255,255,255,0.02)',
                  borderRadius: 10, border: '1px solid var(--border)',
                }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'skills' && (
        <div className="fade-in-up">
          <SkillsAnalysis
            matching={matching.matching_keywords}
            missing={matching.missing_keywords}
            jobSkills={matching.job_skills}
            resumeSkills={matching.resume_skills}
          />
        </div>
      )}

      {tab === 'suggestions' && (
        <div className="fade-in-up">
          <Suggestions suggestions={suggestions} />
        </div>
      )}

      {tab === 'sections' && (
        <div className="fade-in-up">
          <SectionFeedback sectionFeedback={ats.section_feedback} />
        </div>
      )}
    </div>
  );
}

function getScoreLabel(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Needs Major Work';
}
