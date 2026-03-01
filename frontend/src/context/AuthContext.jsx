import { createContext, useContext, useEffect, useState } from 'react';
import { setToken } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => JSON.parse(localStorage.getItem('nseAuth') || 'null'));

  useEffect(() => {
    setToken(auth?.token);
    if (auth) localStorage.setItem('nseAuth', JSON.stringify(auth));
    else localStorage.removeItem('nseAuth');
  }, [auth]);

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
