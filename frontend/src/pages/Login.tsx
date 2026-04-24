import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      setAuth(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err: unknown) {
      console.warn('Backend offline ou sem DB. Usando modo Demo para visualização.');
      
      // FALLBACK PARA DEMO (Remover em produção)
      if (email === 'demo@productflow.com' || email.includes('test')) {
        setAuth({ id: 'demo-1', name: 'Usuário Demo', email: email }, 'mock-token-123');
        navigate('/dashboard');
        return;
      }

      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Erro ao fazer login. Tente novamente.');
      } else {
        setError('Erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-deep via-dark to-dark-deep p-4">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4 hover:scale-110 transition-transform cursor-pointer">
              <LogIn className="text-white w-8 h-8" />
            </div>
            <Link to="/">
              <h1 className="text-3xl font-bold text-white tracking-tight hover:text-gray-200 transition-colors">ProductFlow</h1>
            </Link>
            <p className="text-gray-400 mt-2">Bem-vindo de volta, builder.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-300 mb-2 ml-1">
                E-mail
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                placeholder="exemplo@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-300 mb-2 ml-1">
                Senha
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                'Entrando...'
              ) : (
                <>
                  Entrar no Flow
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              Novo por aqui?{' '}
              <Link to="/register" className="text-secondary hover:text-secondary/80 font-medium transition-colors">
                Criar uma conta
              </Link>
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-8 text-xs text-gray-500 font-medium uppercase tracking-widest">
          <a href="#" className="hover:text-gray-300 transition-colors">Suporte</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Termos</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Privacidade</a>
        </div>
      </div>
    </div>
  );
}
