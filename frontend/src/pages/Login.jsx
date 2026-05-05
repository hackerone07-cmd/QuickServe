import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getErrorMessage } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const destination = location.state?.from?.pathname || '/services';

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      await login(form);
      navigate(destination, { replace: true });
    } catch (error) {
      setMessage(getErrorMessage(error, 'We could not sign you in.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-panel auth-panel--accent">
        <span className="eyebrow">Welcome back</span>
        <h1>Sign in to manage your QuickServe journey.</h1>
        <p>
          Customers can track bookings and reviews. Providers can add services and
          manage their schedule from one place.
        </p>
      </section>

      <section className="auth-panel">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">Account access</span>
              <h2>Sign in</h2>
              <p>Use your registered email and password to continue.</p>
            </div>
          </div>

          <label className="field field--full">
            <span>Email</span>
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              required
              type="email"
              value={form.email}
            />
          </label>

          <label className="field field--full">
            <span>Password</span>
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              required
              type="password"
              value={form.password}
            />
          </label>

          <button className="button button--primary" disabled={submitting} type="submit">
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
          {message ? <p className="form-message">{message}</p> : null}
          <p className="auth-note">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Login;
