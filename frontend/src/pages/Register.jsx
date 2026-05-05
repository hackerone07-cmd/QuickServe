import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getErrorMessage } from '../services/api';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    phone: '',
    location: '',
  });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const createdUser = await register(form);
      navigate(createdUser.role === 'admin' ? '/admin' : '/services', {
        replace: true,
      });
    } catch (error) {
      setMessage(getErrorMessage(error, 'We could not create that account.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-panel auth-panel--accent">
        <span className="eyebrow">Create your profile</span>
        <h1>Start as a customer or list yourself as a provider.</h1>
        <p>
          Registration is wired to your backend auth flow, with role-aware entry into
          the app after signup.
        </p>
      </section>

      <section className="auth-panel">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">Quick onboarding</span>
              <h2>Create account</h2>
              <p>Share a few details and we will drop you into the right flow.</p>
            </div>
          </div>

          <label className="field">
            <span>Name</span>
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              required
              type="text"
              value={form.name}
            />
          </label>

          <label className="field">
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

          <label className="field">
            <span>Password</span>
            <input
              minLength="6"
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              required
              type="password"
              value={form.password}
            />
          </label>

          <label className="field">
            <span>Role</span>
            <select
              onChange={(event) =>
                setForm((current) => ({ ...current, role: event.target.value }))
              }
              value={form.role}
            >
              <option value="customer">Customer</option>
              <option value="provider">Provider</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label className="field">
            <span>Phone</span>
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, phone: event.target.value }))
              }
              type="tel"
              value={form.phone}
            />
          </label>

          <label className="field">
            <span>Location</span>
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, location: event.target.value }))
              }
              required
              type="text"
              value={form.location}
            />
          </label>

          <button className="button button--primary" disabled={submitting} type="submit">
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
          {message ? <p className="form-message">{message}</p> : null}
          <p className="auth-note">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Register;
