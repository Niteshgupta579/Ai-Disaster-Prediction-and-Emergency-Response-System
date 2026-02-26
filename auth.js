import api from './api';

export const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  localStorage.setItem('token', data.token);
  return data;
};

export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  localStorage.setItem('token', data.token);
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};
