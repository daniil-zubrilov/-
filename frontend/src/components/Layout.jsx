import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('access');
    navigate('/login');
  };

  return (
    <>
      <header className="header">
        <h2><Link to="/">🏋️ FitDiary</Link></h2>
        <div className="header-actions">
          <Link to="/workouts/new" className="btn btn-primary">+ Тренировка</Link>
          <button className="btn btn-ghost" onClick={logout}>Выйти</button>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}