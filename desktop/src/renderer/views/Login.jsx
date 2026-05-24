import React, { useState } from 'react';
import { LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { login } from '../api/auth.js';

export default function Login({ onAuthenticated }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(form);
      onAuthenticated();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-heading">
          <span className="brand-mark large">SV</span>
          <div>
            <h1 id="login-title">School Voting</h1>
            <p>Sign in to the academic election workspace</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>Username</span>
            <div className="input-frame">
              <UserRound size={18} />
              <input
                autoComplete="username"
                autoFocus
                name="username"
                onChange={handleChange}
                required
                type="text"
                value={form.username}
              />
            </div>
          </label>

          <label>
            <span>Password</span>
            <div className="input-frame">
              <LockKeyhole size={18} />
              <input
                autoComplete="current-password"
                name="password"
                onChange={handleChange}
                required
                type="password"
                value={form.password}
              />
            </div>
          </label>

          {error ? <div className="error-banner">{error}</div> : null}

          <button className="primary-button full-width" disabled={isSubmitting} type="submit">
            <ShieldCheck size={18} />
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
