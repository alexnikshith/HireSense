import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';

export default function UploadSection({ onAnalyze, loading }) {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [charCount, setCharCount] = useState(0);

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: loading,
  });

  const handleJDChange = (e) => {
    setJobDesc(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSubmit = () => {
    if (file && jobDesc.trim().length >= 50) {
      onAnalyze(file, jobDesc);
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
  };

  const isReady = file && jobDesc.trim().length >= 50;

  const sampleJD = `Senior Software Engineer – Backend

We are looking for a skilled Backend Engineer to join our growing team. 

Requirements:
• 3+ years of experience in Python and FastAPI or Django
• Strong knowledge of PostgreSQL, Redis, and MongoDB
• Experience with Docker, Kubernetes, and AWS
• Familiarity with microservices architecture and REST API design
• Proficiency in Git, CI/CD pipelines (GitHub Actions or Jenkins)
• Experience with machine learning pipelines is a plus
• Strong communication and team collaboration skills
• Problem-solving mindset and attention to detail`;

  return (
    <div className="upload-grid container">
      {/* PDF Dropzone */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)' }}>
          <div className="card-title">
            <span className="card-title-icon">📄</span>
            Upload Resume
          </div>
        </div>
        <div style={{ padding: '20px 24px 24px' }}>
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
            style={{ minHeight: file ? '120px' : '200px' }}
          >
            <input {...getInputProps()} />
            {file ? (
              <>
                <div style={{
                  width: 48, height: 48,
                  background: 'rgba(16,217,141,0.15)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FileText size={22} color="var(--accent-green)" />
                </div>
                <div className="file-accepted">
                  <CheckCircle size={16} />
                  {file.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {(file.size / 1024).toFixed(1)} KB
                </div>
                <button
                  onClick={clearFile}
                  style={{
                    background: 'rgba(248,113,113,0.15)',
                    border: '1px solid rgba(248,113,113,0.3)',
                    borderRadius: '100px',
                    color: 'var(--accent-red)',
                    padding: '4px 12px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <X size={12} /> Remove
                </button>
              </>
            ) : (
              <>
                <div className="dropzone-icon">
                  <Upload size={22} color="white" />
                </div>
                <h3>{isDragActive ? 'Drop it here!' : 'Drag & drop your resume'}</h3>
                <p>or click to browse — PDF only</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)' }}>
          <div className="card-title">
            <span className="card-title-icon">💼</span>
            Job Description
          </div>
        </div>
        <div style={{ padding: '16px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <textarea
            className="jd-textarea"
            placeholder="Paste the job description here…&#10;&#10;Tip: Include skills, requirements, and responsibilities for best results."
            value={jobDesc}
            onChange={handleJDChange}
            disabled={loading}
            style={{ flex: 1, minHeight: '180px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: charCount < 50 ? 'var(--accent-red)' : 'var(--text-muted)' }}>
              {charCount < 50 ? `${50 - charCount} more chars needed` : `${charCount} characters`}
            </span>
            <button
              className="btn-secondary"
              onClick={() => { setJobDesc(sampleJD); setCharCount(sampleJD.length); }}
              disabled={loading}
            >
              Try Sample JD
            </button>
          </div>

          <button
            className="btn-analyze"
            onClick={handleSubmit}
            disabled={!isReady || loading}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                Analyzing…
              </>
            ) : (
              <>
                ✨ Analyze Resume
              </>
            )}
          </button>
          {!file && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Upload a PDF resume to get started
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
