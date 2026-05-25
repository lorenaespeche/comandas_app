// arquivo de rotas da aplicação usando React Router v6, a versão mais recente do React Router
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import RestrictedRoute from "./RestrictedRoute";

// Lazy Loading para otimização (code-splitting)
const Dashboard = lazy(() => import("../pages/Dashboard"));
const FuncionarioList = lazy(() => import("../pages/FuncionarioList"));
const FuncionarioForm = lazy(() => import("../pages/FuncionarioForm"));
const ClienteList = lazy(() => import("../pages/ClienteList"));
const ClienteForm = lazy(() => import("../pages/ClienteForm"));
const ProdutoList = lazy(() => import("../pages/ProdutoList"));
const ProdutoListPublic = lazy(() => import("../pages/ProdutoListPublic"));
const ProdutoForm = lazy(() => import("../pages/ProdutoForm"));
const LoginForm = lazy(() => import("../components/forms/LoginForm"));
const NotFound = lazy(() => import("../pages/NotFound"));

const Loading = () => <div>Carregando...</div>;

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rotas públicas - sem necessidade de autenticação */}
        <Route path="/produtos/publica" element={<ProdutoListPublic />} />

        {/* Rotas restritas - somente se não estiver logado */}
        <Route path="/login" element={<RestrictedRoute><LoginForm /></RestrictedRoute>} />

        {/* Rotas protegidas - somente se estiver logado */}
        <Route path="/home" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/produtos" element={<PrivateRoute><ProdutoList /></PrivateRoute>} />
        <Route path="/produto" element={<PrivateRoute><ProdutoForm /></PrivateRoute>} />
        {/* Rota para editar ou visualizar com opr {view ou edit} e id dinâmico */}
        <Route path="/produto/:opr/:id" element={<PrivateRoute><ProdutoForm /></PrivateRoute>} />

        <Route path="/funcionarios" element={<PrivateRoute><FuncionarioList /></PrivateRoute>} />
        <Route path="/funcionario" element={<PrivateRoute><FuncionarioForm /></PrivateRoute>} />
        <Route path="/clientes" element={<PrivateRoute><ClienteList /></PrivateRoute>} />
        <Route path="/cliente" element={<PrivateRoute><ClienteForm /></PrivateRoute>} />

        {/* Rota para páginas não encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;