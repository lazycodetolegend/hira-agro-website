import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [company, setCompany] = useState(null);
  const [activeCompanyId, setActiveCompanyId] = useState(localStorage.getItem('activeCompanyId') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
          if (res.data.user.companyId && typeof res.data.user.companyId === 'object') {
            setCompany(res.data.user.companyId);
          }
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (identifier, password) => {
    const res = await api.post('/auth/login', { email: identifier, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    
    if (userData.companyId && typeof userData.companyId === 'object') {
      setCompany(userData.companyId);
      localStorage.setItem('company', JSON.stringify(userData.companyId));
    }
    
    return userData;
  };

  const switchCompany = async (companyId) => {
    setActiveCompanyId(companyId);
    localStorage.setItem('activeCompanyId', companyId);
    
    if (companyId) {
      try {
        const res = await api.get(`/companies/${companyId}`);
        setCompany(res.data.company);
        localStorage.setItem('company', JSON.stringify(res.data.company));
      } catch (err) {
        console.error('Failed to fetch company:', err);
      }
    } else {
      setCompany(null);
      localStorage.removeItem('company');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('company');
    localStorage.removeItem('activeCompanyId');
    setToken(null);
    setUser(null);
    setCompany(null);
    setActiveCompanyId(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, company, activeCompanyId, loading, login, logout, switchCompany }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
