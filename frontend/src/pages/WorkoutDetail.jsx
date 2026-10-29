import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';

export default function WorkoutDetail() {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    api.get(`/workouts/${id}/`).then((r) => setWorkout(r.data));
  }, [id]);

  if (!workout) return <p className="muted">Загрузка...</p>;

  return (
    <div>
      <Link to="/" className="muted">← Назад</Link>
      <h1 className="page-title">{workout.title}</h1>
      <p className="card-meta">📅 {workout.date}</p>
      {workout.notes && <p className="muted">{workout.notes}</p>}

      {workout.exercises.map((ex) => (
        <div className="card" key={ex.id}>
          <h4>{ex.name}</h4>
          <ul style={{ paddingLeft: 20, margin: '8px 0 0' }}>
            {ex.sets.map((s) => (
              <li key={s.id}>
                <strong>{s.weight} кг</strong> × {s.reps} повторов
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}