function LoadingState({ label = 'Loading experience...' }) {
  return (
    <div className="state-card state-card--centered" role="status">
      <span className="spinner" />
      <p>{label}</p>
    </div>
  );
}

export default LoadingState;
