import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import WorkoutList from '../pages/WorkoutList';
import WorkoutDetail from '../pages/WorkoutDetail';
import WorkoutForm from '../pages/WorkoutForm';
import Layout from '../components/Layout';

const Protected = () => {
  const isAuth = !!localStorage.getItem('access');
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <Protected />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: <WorkoutList /> },
          { path: 'workouts/new', element: <WorkoutForm /> },
          { path: 'workouts/:id', element: <WorkoutDetail /> },
          { path: 'workouts/:id/edit', element: <WorkoutForm /> },
        ],
      },
    ],
  },
]);