import { useEffect, useRef, useState } from 'react';

function getScoreColor(score) {
  if (score >= 80) return '#10d98d';
  if (score >= 60) return '#38bdf8';
  if (score >= 40) return '#f59e0b';
  return '#f87171';
}

function getGradeColor(grade) {
  const map = { A: '#10d98d', B: '#38bdf8', C: '#f59e0b', D: '#f87171', F: '#ef4444' };
  return map[grade] || '#6378ff';
}

export function ScoreRing({ score, grade, label, size = 160 }) {
  const [animated, setAnimated] = useState(0);
  const r = size / 2 - 12;
  const circ = 2 * Math.PI * r;
  const color = getScoreColor(score);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circ - (animated / 100) * circ;

  return (
    <div className="score-ring-card card">
      <div className="ring-wrapper" style={{ width: size, height: size }}>
        <svg className="ring-svg" width={size} height={size}>
          <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} />
          <circle
            className="ring-fill"
            cx={size / 2} cy={size / 2} r={r}
            stroke={color}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{
              filter: `drop-shadow(0 0 8px ${color}80)`,
            }}
          />
        </svg>
        <div className="ring-label">
          <div className="ring-score" style={{ color }}>
            {Math.round(animated)}
          </div>
          <div className="ring-grade" style={{
            background: `linear-gradient(135deg, ${color}, ${color}aa)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Grade {grade}
          </div>
        </div>
      </div>
      <div className="score-label">
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          ATS Score
        </span>
        <br />
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{label}</span>
      </div>
    </div>
  );
}

export function DimensionBars({ dimensions }) {
  const labels = {
    keyword_relevance: 'Keyword Relevance',
    section_completeness: 'Section Completeness',
    formatting: 'Formatting',
    action_verbs: 'Action Verbs',
    quantification: 'Quantification',
    length: 'Resume Length',
  };

  return (
    <div className="card">
      <div className="card-title">
        <span className="card-title-icon">📊</span>
        ATS Dimension Breakdown
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {Object.entries(dimensions).map(([key, val]) => (
          <ProgressBar
            key={key}
            label={labels[key] || key}
            value={val}
          />
        ))}
      </div>
    </div>
  );
}

export function ProgressBar({ label, value, colorOverride }) {
  const [animated, setAnimated] = useState(0);
  const color = colorOverride || getScoreColor(value);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 150);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="progress-bar-row">
      <div className="progress-bar-label">
        <span>{label}</span>
        <span style={{ color }}>{Math.round(value)}%</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${animated}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
    </div>
  );
}

export function MatchScoreCard({ matchData }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnim(matchData.match_score), 100);
    return () => clearTimeout(t);
  }, [matchData.match_score]);

  const color = getScoreColor(matchData.match_score);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="card-title">
        <span className="card-title-icon">🎯</span>
        Job Match Score
      </div>
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <div className="match-score-big" style={{
          background: `linear-gradient(135deg, ${color}, ${color}aa)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {Math.round(anim)}%
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
          {matchData.match_score >= 70
            ? '🔥 Excellent match!'
            : matchData.match_score >= 50
            ? '👍 Good match — some gaps'
            : '⚠️ Low match — needs improvement'}
        </p>
      </div>
      <ProgressBar
        label="Match"
        value={matchData.match_score}
        colorOverride={color}
      />
      <div>
        <div className="section-divider">Keyword Density</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <ProgressBar
              label="JD Keyword Coverage"
              value={matchData.keyword_density * 100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
