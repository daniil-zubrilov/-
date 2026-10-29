import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../api/client';

const emptyExercise = () => ({ name: '', sets: [{ weight: '', reps: '' }] });

export default function WorkoutForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState([emptyExercise()]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/workouts/${id}/`).then((r) => {
      setTitle(r.data.title);
      setDate(r.data.date);
      setNotes(r.data.notes);
      setExercises(r.data.exercises.map((e) => ({
        name: e.name,
        sets: e.sets.map((s) => ({ weight: s.weight, reps: s.reps })),
      })));
    });
  }, [id, isEdit]);

  const updateExercise = (i, field, value) => {
    const copy = [...exercises];
    copy[i][field] = value;
    setExercises(copy);
  };

  const updateSet = (ei, si, field, value) => {
    const copy = [...exercises];
    copy[ei].sets[si][field] = value;
    setExercises(copy);
  };

  const addExercise = () => setExercises([...exercises, emptyExercise()]);
  const addSet = (i) => {
    const copy = [...exercises];
    copy[i].sets.push({ weight: '', reps: '' });
    setExercises(copy);
  };

  const removeSet = (ei, si) => {
    const copy = [...exercises];
    copy[ei].sets.splice(si, 1);
    setExercises(copy);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) return setError('Введите название тренировки');

    const payload = {
      title,
      date,
      notes,
      exercises: exercises.map((ex, i) => ({
        name: ex.name,
        order: i,
        sets: ex.sets.map((s, j) => ({
          weight: s.weight || 0,
          reps: s.reps || 0,
          order: j,
        })),
      })),
    };

    try {
      if (isEdit) await api.put(`/workouts/${id}/`, payload);
      else await api.post('/workouts/', payload);
      navigate('/');
    } catch {
      setError('Не удалось сохранить. Проверьте данные.');
    }
  };

  return (
    <div>
      <Link to="/" className="muted">← Назад</Link>
      <h1 className="page-title">{isEdit ? 'Редактировать тренировку' : 'Новая тренировка'}</h1>

      <form onSubmit={submit}>
        <div className="field">
          <input placeholder="Название (например, Грудь + трицепс)" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="field">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="field">
          <textarea placeholder="Заметки (самочувствие, веса, комментарии)" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <h3 style={{ marginTop: 24 }}>Упражнения</h3>
        {exercises.map((ex, ei) => (
          <div className="exercise-block" key={ei}>
            <input
              placeholder="Название упражнения (например, Жим лёжа)"
              value={ex.name}
              onChange={(e) => updateExercise(ei, 'name', e.target.value)}
              required
            />
            {ex.sets.map((s, si) => (
              <div className="set-row" key={si}>
                <input type="number" placeholder="Вес, кг" value={s.weight} onChange={(e) => updateSet(ei, si, 'weight', e.target.value)} />
                <input type="number" placeholder="Повторы" value={s.reps} onChange={(e) => updateSet(ei, si, 'reps', e.target.value)} />
                <button type="button" className="icon-btn btn-danger" onClick={() => removeSet(ei, si)} title="Удалить подход">✕</button>
              </div>
            ))}
            <button type="button" className="btn" style={{ marginTop: 8 }} onClick={() => addSet(ei)}>+ Подход</button>
          </div>
        ))}

        <div className="row mt">
          <button type="button" className="btn" onClick={addExercise}>+ Упражнение</button>
        </div>

        {error && <div className="error mt">{error}</div>}

        <div className="mt">
          <button type="submit" className="btn-primary">Сохранить</button>
        </div>
      </form>
    </div>
  );
}