import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  email?: string;
  isAdmin?: number;
  createdAt?: string;
}

interface ProfileProps {
  onLogout: () => void;
}

const API_URL = 'http://localhost:3001/api/auth/me';

export default function Profile({ onLogout }: ProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Oturum bulunamadı.');
      setLoading(false);
      return;
    }
    fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Kullanıcı bilgisi alınamadı.');
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <div className="text-center mt-12">Yükleniyor...</div>;
  if (error) return <div className="text-center mt-12 text-red-600">{error}</div>;

  return (
    <div className="max-w-sm mx-auto mt-12 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex flex-col items-center mb-2">
        <span className="text-4xl text-blue-600 font-bold">☿</span>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center">Profil</h2>
      <div className="space-y-2">
        <div><b>Kullanıcı Adı:</b> {user?.username}</div>
        {user?.email && <div><b>E-posta:</b> {user.email}</div>}
        <div><b>Oluşturulma:</b> {user?.createdAt?.slice(0, 10)}</div>
        {user?.isAdmin ? <div><b>Yetki:</b> Admin</div> : null}
      </div>
      <button
        onClick={handleBack}
        className="w-full mt-6 mb-2 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition-colors"
      >
        Geri
      </button>
      <button
        onClick={handleLogout}
        className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors"
      >
        Çıkış Yap
      </button>
    </div>
  );
} 