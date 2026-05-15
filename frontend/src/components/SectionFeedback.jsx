export default function SectionFeedback({ sectionFeedback }) {
  const statusOrder = { missing: 0, weak: 1, good: 2 };
  const sorted = Object.entries(sectionFeedback).sort(
    ([, a], [, b]) => statusOrder[a.status] - statusOrder[b.status]
  );

  const statusConfig = {
    good: { dot: 'status-good', label: 'Good', badge: 'tag-green' },
    weak: { dot: 'status-weak', label: 'Needs Work', badge: 'tag-orange' },
    missing: { dot: 'status-missing', label: 'Missing', badge: 'tag-red' },
  };

  const counts = {
    good: sorted.filter(([, v]) => v.status === 'good').length,
    weak: sorted.filter(([, v]) => v.status === 'weak').length,
    missing: sorted.filter(([, v]) => v.status === 'missing').length,
  };

  return (
    <div className="card">
      <div className="card-title">
        <span className="card-title-icon">📋</span>
        Section-Wise Feedback
      </div>

      {/* Summary counts */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{
          flex: 1, padding: '10px 14px',
          background: 'rgba(16,217,141,0.08)',
          border: '1px solid rgba(16,217,141,0.2)',
          borderRadius: 10, textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-green)' }}>
            {counts.good}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>GOOD</div>
        </div>
        <div style={{
          flex: 1, padding: '10px 14px',
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 10, textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-orange)' }}>
            {counts.weak}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>WEAK</div>
        </div>
        <div style={{
          flex: 1, padding: '10px 14px',
          background: 'rgba(248,113,113,0.08)',
          border: '1px solid rgba(248,113,113,0.2)',
          borderRadius: 10, textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-red)' }}>
            {counts.missing}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>MISSING</div>
        </div>
      </div>

      {/* Individual rows */}
      {sorted.map(([section, fb]) => {
        const cfg = statusConfig[fb.status] || statusConfig.missing;
        return (
          <div key={section} className="section-fb-row">
            <div className={`section-status-dot ${cfg.dot}`} />
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3,
              }}>
                <span style={{ fontWeight: 600, fontSize: '0.88rem', textTransform: 'capitalize' }}>
                  {section}
                </span>
                <span className={`tag ${cfg.badge}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                  {cfg.label}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {fb.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
