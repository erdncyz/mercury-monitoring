import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

const API_URL = 'http://localhost:3001/api/auth';

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'login'
            ? { username, password }
            : { username, password, email }
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu');
      if (mode === 'login' && data.token) {
        localStorage.setItem('token', data.token);
        onAuthSuccess();
        navigate('/');
      } else if (mode === 'register') {
        setMode('login');
        setError('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex flex-col items-center mb-2">
        <span className="text-4xl text-blue-600 font-bold">☿</span>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center">
        {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        {mode === 'register' && (
          <input
            type="email"
            placeholder="E-posta (isteğe bağlı)"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        )}
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading ? 'İşleniyor...' : mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
        </button>
      </form>
      <div className="mt-4 text-center text-sm">
        {mode === 'login' ? (
          <>
            Hesabınız yok mu?{' '}
            <button className="text-blue-600 underline" onClick={() => setMode('register')}>
              Kayıt Ol
            </button>
          </>
        ) : (
          <>
            Zaten hesabınız var mı?{' '}
            <button className="text-blue-600 underline" onClick={() => setMode('login')}>
              Giriş Yap
            </button>
          </>
        )}
      </div>
    </div>
  );
} 