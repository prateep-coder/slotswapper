import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
      <div className="text-center mb-5">
        <div className="text-900 text-3xl font-medium mb-3">Create Account</div>
        <span className="text-600 font-medium line-height-3">Already have an account?</span>
        <Link to="/login" className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
          Sign in here
        </Link>
      </div>

      {error && (
        <div className="p-message p-message-error mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="name" className="block text-900 font-medium mb-2">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-inputtext"
          placeholder="Your full name"
          required
        />

        <label htmlFor="email" className="block text-900 font-medium mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-inputtext"
          placeholder="Email address"
          required
        />

        <label htmlFor="password" className="block text-900 font-medium mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-inputtext"
          placeholder="Password (min 6 characters)"
          required
        />

        <label htmlFor="confirmPassword" className="block text-900 font-medium mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-3 p-inputtext"
          placeholder="Confirm password"
          required
        />

        <button
          type="submit"
          className="w-full p-button p-button-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="pi pi-spin pi-spinner mr-2"></i>
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  );
};