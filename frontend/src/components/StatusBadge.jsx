function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-badge--${status || 'pending'}`}>
      {status || 'pending'}
    </span>
  );
}

export default StatusBadge;
