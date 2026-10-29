import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    const clientErrors = {};
    if (!form.email.includes('@')) clientErrors.email = 'Некорректный email';
    if (form.password.length < 8) clientErrors.password = 'Минимум 8 символов';
    if (form.password !== form.password2) clientErrors.password2 = 'Пароли не совпадают';
    if (Object.keys(clientErrors).length) return setErrors(clientErrors);

    try {
      await api.post('/auth/register/', form);
      navigate('/login');
    } catch (err) {
      setErrors(err.response?.data || { general: 'Ошибка регистрации' });
    }
  };

  return (
    <div className="form-box">
      <h2>Регистрация</h2>
      <p className="muted">Создайте аккаунт и начните вести прогресс</p>
      <form onSubmit={submit}>
        <div className="field">
          <input name="username" placeholder="Логин" value={form.username} onChange={change} required />
          {errors.username && <div className="error">{errors.username}</div>}
        </div>
        <div className="field">
          <input name="email" placeholder="Email" value={form.email} onChange={change} required />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div className="field">
          <input name="password" type="password" placeholder="Пароль (≥ 8 символов)" value={form.password} onChange={change} required />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>
        <div className="field">
          <input name="password2" type="password" placeholder="Повтор пароля" value={form.password2} onChange={change} required />
          {errors.password2 && <div className="error">{errors.password2}</div>}
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
          Зарегистрироваться
        </button>
      </form>
      <p className="muted" style={{ marginTop: 16 }}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}