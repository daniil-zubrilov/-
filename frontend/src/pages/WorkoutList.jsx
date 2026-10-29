import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function WorkoutList() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/workouts/')
      .then((r) => setWorkouts(r.data))
      .catch(() => setError('Не удалось загрузить тренировки'));
  };

  useEffect(load, []);

  const remove = async (id) => {
    if (!confirm('Удалить тренировку?')) return;
    await api.delete(`/workouts/${id}/`);
    load();
  };

  // Функция экспорта в Excel
  const exportExcel = async () => {
    try {
      const response = await api.get('/export/', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'fitness_export.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Ошибка при скачивании файла');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Мои тренировки</h1>
        {workouts.length > 0 && (
          <button className="btn btn-ghost" onClick={exportExcel}>
            📥 Скачать Excel
          </button>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      {!workouts.length ? (
        <div className="empty">
          <p>Пока нет записей.</p>
          <Link to="/workouts/new" className="btn btn-primary">Создать первую тренировку</Link>
        </div>
      ) : (
        workouts.map((w) => (
          <div className="card" key={w.id}>
            <h4>
              <Link to={`/workouts/${w.id}`}>{w.title}</Link>
              <span className="badge">{w.exercises?.length || 0} упражн.</span>
            </h4>
            <div className="card-meta">📅 {w.date}</div>
            <div className="card-actions">
              <Link to={`/workouts/${w.id}`} className="btn">Открыть</Link>
              <Link to={`/workouts/${w.id}/edit`} className="btn">Редактировать</Link>
              <button className="btn btn-danger" onClick={() => remove(w.id)}>Удалить</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}