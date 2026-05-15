import { useEffect, useRef } from 'react';
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
} from 'chart.js';

Chart.register(
  RadarController, RadialLinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend,
  DoughnutController, ArcElement,
);

export function RadarChart({ dimensions }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  const labels = [
    'Keywords', 'Sections', 'Formatting',
    'Action Verbs', 'Quantification', 'Length',
  ];

  const data = [
    dimensions.keyword_relevance,
    dimensions.section_completeness,
    dimensions.formatting,
    dimensions.action_verbs,
    dimensions.quantification,
    dimensions.length,
  ];

  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ref.current, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: 'ATS Score',
          data,
          backgroundColor: 'rgba(99,120,255,0.15)',
          borderColor: '#6378ff',
          borderWidth: 2,
          pointBackgroundColor: '#6378ff',
          pointRadius: 4,
          pointHoverRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            min: 0, max: 100,
            ticks: {
              stepSize: 25,
              color: 'rgba(148,163,184,0.6)',
              backdropColor: 'transparent',
              font: { size: 10 },
            },
            grid: { color: 'rgba(99,120,255,0.1)' },
            angleLines: { color: 'rgba(99,120,255,0.1)' },
            pointLabels: {
              color: '#94a3b8',
              font: { size: 11, family: 'Inter, sans-serif' },
            },
          },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [dimensions]);

  return (
    <div className="card">
      <div className="card-title">
        <span className="card-title-icon">🕸️</span>
        Skills Radar
      </div>
      <canvas ref={ref} style={{ maxHeight: 280 }} />
    </div>
  );
}

export function SkillDonutChart({ resumeSkillCount, missingCount }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const total = resumeSkillCount + missingCount;
    chartRef.current = new Chart(ref.current, {
      type: 'doughnut',
      data: {
        labels: ['Skills Matched', 'Skills Missing'],
        datasets: [{
          data: [resumeSkillCount, missingCount],
          backgroundColor: ['rgba(16,217,141,0.8)', 'rgba(248,113,113,0.6)'],
          borderColor: ['#10d98d', '#f87171'],
          borderWidth: 2,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              font: { size: 12, family: 'Inter, sans-serif' },
              padding: 16,
              usePointStyle: true,
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.raw} (${Math.round(ctx.raw / total * 100)}%)`,
            },
          },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [resumeSkillCount, missingCount]);

  return (
    <div className="card">
      <div className="card-title">
        <span className="card-title-icon">🍩</span>
        Skill Coverage
      </div>
      <canvas ref={ref} style={{ maxHeight: 240 }} />
    </div>
  );
}
