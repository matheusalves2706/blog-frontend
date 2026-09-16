import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Admin } from '../pages/Admin';
import { CreatePost } from '../pages/CreatePost';
import { EditPost } from '../pages/EditPost';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { NotFound } from '../pages/NotFound';
import { PostDetail } from '../pages/PostDetail';

/** Mapa de rotas da aplicação. */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/posts/novo"
        element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        }
      />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route
        path="/posts/:id/editar"
        element={
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
