export default function SkillsAnalysis({ matching, missing, jobSkills, resumeSkills }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {/* Matching Skills */}
      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">✅</span>
          Matching Keywords
          <span style={{
            marginLeft: 'auto',
            background: 'rgba(16,217,141,0.15)',
            color: 'var(--accent-green)',
            borderRadius: '100px',
            padding: '2px 10px',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}>
            {matching.length}
          </span>
        </div>
        {matching.length > 0 ? (
          <div className="tag-list">
            {matching.map(k => (
              <span key={k} className="tag tag-green">{k}</span>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No matching keywords found. Try tailoring your resume to the JD.
          </p>
        )}
      </div>

      {/* Missing Skills */}
      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">❌</span>
          Missing Keywords
          <span style={{
            marginLeft: 'auto',
            background: 'rgba(248,113,113,0.15)',
            color: 'var(--accent-red)',
            borderRadius: '100px',
            padding: '2px 10px',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}>
            {missing.length}
          </span>
        </div>
        {missing.length > 0 ? (
          <div className="tag-list">
            {missing.map(k => (
              <span key={k} className="tag tag-red">{k}</span>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--accent-green)', fontSize: '0.85rem' }}>
            🎉 All job keywords found in your resume!
          </p>
        )}
      </div>

      {/* Your Skills */}
      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">🧠</span>
          Skills on Your Resume
          <span style={{
            marginLeft: 'auto',
            background: 'rgba(99,120,255,0.15)',
            color: 'var(--accent-primary)',
            borderRadius: '100px',
            padding: '2px 10px',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}>
            {resumeSkills.length}
          </span>
        </div>
        <div className="tag-list">
          {resumeSkills.length > 0
            ? resumeSkills.map(s => (
                <span key={s} className="tag tag-blue">{s}</span>
              ))
            : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No skills detected</span>}
        </div>
      </div>

      {/* Job Required Skills */}
      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">📋</span>
          Job Requires
          <span style={{
            marginLeft: 'auto',
            background: 'rgba(167,139,250,0.15)',
            color: 'var(--accent-secondary)',
            borderRadius: '100px',
            padding: '2px 10px',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}>
            {jobSkills.length}
          </span>
        </div>
        <div className="tag-list">
          {jobSkills.length > 0
            ? jobSkills.map(s => (
                <span key={s} className="tag tag-purple">{s}</span>
              ))
            : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No skills detected in JD</span>}
        </div>
      </div>
    </div>
  );
}
