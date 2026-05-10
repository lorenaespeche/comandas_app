import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("loginRealizado") === "true";
  });

  const navigate = useNavigate();

  const login = (cpf, senha) => {
    if (cpf === "123" && senha === "abcBolinhas") {
      setIsAuthenticated(true);
      sessionStorage.setItem("loginRealizado", "true");
      navigate("/home");
    } else {
      alert("Usuário ou senha inválidos!");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("loginRealizado");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);