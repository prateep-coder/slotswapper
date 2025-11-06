import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
      <div className="text-center mb-5">
        <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
        <span className="text-600 font-medium line-height-3">Don't have an account?</span>
        <Link to="/signup" className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
          Create today!
        </Link>
      </div>

      {error && (
        <div className="p-message p-message-error mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
          placeholder="Password"
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
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </div>
  );
};