import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="state-card state-card--centered">
      <span className="eyebrow">404</span>
      <h1>That page wandered off.</h1>
      <p>The route you requested does not exist in the current QuickServe frontend.</p>
      <Link className="button button--primary" to="/">
        Back to home
      </Link>
    </div>
  );
}

export default NotFound;
