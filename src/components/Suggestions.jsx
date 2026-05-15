import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, ArrowRight } from 'lucide-react';

function Collapsible({ title, icon, count, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '18px 24px',
          background: 'transparent', border: 'none',
          color: 'var(--text-primary)', fontFamily: 'inherit',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: open ? '1px solid var(--border)' : 'none',
        }}
      >
        <span style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'rgba(99,120,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>{icon}</span>
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{title}</span>
        {count !== undefined && (
          <span style={{
            marginLeft: 8, background: 'rgba(99,120,255,0.15)',
            color: 'var(--accent-primary)', borderRadius: '100px',
            padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700,
          }}>{count}</span>
        )}
        <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      {open && <div style={{ padding: '20px 24px' }}>{children}</div>}
    </div>
  );
}

export default function Suggestions({ suggestions }) {
  const {
    bullet_improvements = [],
    missing_skills_advice = [],
    section_suggestions = [],
    formatting_tips = [],
    quantification_tips = [],
    action_verb_tips = [],
    skill_roadmap = [],
    priority_actions = [],
  } = suggestions;

  const getPriorityClass = (action) => {
    if (action.includes('🔴')) return 'priority-high';
    if (action.includes('🟡')) return 'priority-medium';
    return 'priority-ok';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Priority Actions */}
      {priority_actions.length > 0 && (
        <div className="card">
          <div className="card-title">
            <span className="card-title-icon">🚨</span>
            Priority Action Plan
          </div>
          {priority_actions.map((action, i) => (
            <div key={i} className={`priority-item ${getPriorityClass(action)}`}>
              {action}
            </div>
          ))}
        </div>
      )}

      {/* Bullet Improvements */}
      {bullet_improvements.length > 0 && (
        <Collapsible
          title="Bullet Point Rewrites"
          icon="✍️"
          count={bullet_improvements.length}
          defaultOpen
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {bullet_improvements.map((item, i) => (
              <div key={i} className="suggestion-item">
                <div className="suggestion-label">Before</div>
                <div className="suggestion-original">• {item.original}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
                  <ArrowRight size={14} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 500 }}>
                    AI Suggestion
                  </span>
                </div>
                <div className="suggestion-label">After</div>
                <div className="suggestion-improved">• {item.improved}</div>
                <div style={{
                  marginTop: 10, padding: '6px 10px',
                  background: 'rgba(99,120,255,0.07)',
                  borderRadius: 6, fontSize: '0.75rem',
                  color: 'var(--text-muted)', display: 'flex', gap: 6, alignItems: 'center',
                }}>
                  <Lightbulb size={12} color="var(--accent-secondary)" />
                  {item.tip}
                </div>
              </div>
            ))}
          </div>
        </Collapsible>
      )}

      {/* Missing Skills */}
      {missing_skills_advice.length > 0 && (
        <Collapsible title="Missing Skills Advice" icon="🎯" count={missing_skills_advice.length}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {missing_skills_advice.map((advice, i) => (
              <div key={i} style={{
                padding: '12px 16px',
                background: 'rgba(245,158,11,0.06)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 10,
                fontSize: '0.86rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}>
                <span style={{ color: 'var(--accent-orange)', fontWeight: 600 }}>💡 </span>
                {advice}
              </div>
            ))}
          </div>
        </Collapsible>
      )}

      {/* Section Suggestions */}
      {section_suggestions.length > 0 && (
        <Collapsible title="Section Improvements" icon="📝" count={section_suggestions.length}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {section_suggestions.map((s, i) => (
              <div key={i} style={{
                padding: '12px 16px',
                background: 'rgba(56,189,248,0.06)',
                border: '1px solid rgba(56,189,248,0.2)',
                borderRadius: 10,
                fontSize: '0.86rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}>
                {s}
              </div>
            ))}
          </div>
        </Collapsible>
      )}

      {/* Quantification Tips */}
      {quantification_tips.length > 0 && (
        <Collapsible title="Quantification Tips" icon="📈" count={quantification_tips.length}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {quantification_tips.map((t, i) => (
              <div key={i} style={{
                padding: '12px 16px',
                background: 'rgba(16,217,141,0.06)',
                border: '1px solid rgba(16,217,141,0.2)',
                borderRadius: 10,
                fontSize: '0.86rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
              }}>
                {t}
              </div>
            ))}
          </div>
        </Collapsible>
      )}

      {/* Action Verb Tips */}
      {action_verb_tips.length > 0 && (
        <Collapsible title="Action Verb Tips" icon="⚡" count={action_verb_tips.length}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {action_verb_tips.map((t, i) => (
              <div key={i} style={{
                padding: '12px 16px',
                background: 'rgba(167,139,250,0.06)',
                border: '1px solid rgba(167,139,250,0.2)',
                borderRadius: 10,
                fontSize: '0.86rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
              }}>
                {t}
              </div>
            ))}
          </div>
        </Collapsible>
      )}

      {/* Formatting Tips */}
      {formatting_tips.length > 0 && (
        <Collapsible title="Formatting Fixes" icon="🎨" count={formatting_tips.length}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {formatting_tips.map((t, i) => (
              <div key={i} style={{
                padding: '12px 16px',
                background: 'rgba(248,113,113,0.06)',
                border: '1px solid rgba(248,113,113,0.2)',
                borderRadius: 10,
                fontSize: '0.86rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}>
                ⚠️ {t}
              </div>
            ))}
          </div>
        </Collapsible>
      )}

      {/* Skill Roadmap */}
      {skill_roadmap.length > 0 && (
        <Collapsible title="Skill Gap Roadmap" icon="🗺️" count={skill_roadmap.length}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
            Based on the job description, here's a learning roadmap to close skill gaps:
          </p>
          <div>
            {skill_roadmap.map((step, i) => (
              <div key={i} className="roadmap-item">
                <div className="roadmap-num">{i + 1}</div>
                <span>{step.replace(/^📚\s*/, '')}</span>
              </div>
            ))}
          </div>
        </Collapsible>
      )}
    </div>
  );
}
