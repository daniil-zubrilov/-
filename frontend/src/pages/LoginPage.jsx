import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/token/', { username, password });
      localStorage.setItem('access', data.access);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Слишком много попыток. Попробуйте через минуту.');
      } else {
        setError('Неверный логин или пароль');
      }
    }
  };

  return (
    <div className="form-box">
      <h2>Вход</h2>
      <p className="muted">Войдите, чтобы вести дневник тренировок</p>
      <form onSubmit={submit}>
        <div className="field">
          <input placeholder="Логин" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="field">
          <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
          Войти
        </button>
      </form>
      <p className="muted" style={{ marginTop: 16 }}>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
}