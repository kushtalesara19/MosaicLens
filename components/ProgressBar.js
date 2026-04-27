export default function ProgressBar({ fetched, total, done }) {
  if (done) return null;

  const percentage = total > 0 ? (fetched / total) * 100 : 0;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${percentage}%`,
          backgroundColor: 'var(--accent-blue)',
          boxShadow: '0 0 10px var(--accent-blue)',
          transition: 'width 0.3s ease-out',
        }}
      />
    </div>
  );
}
