import api from './api';

export const loginUser = (email, password) =>
  api.get(`/usuarios?email=${email}&password=${password}`);

export const registerUser = (usuario) =>
  api.post('/usuarios', { ...usuario, rol: 'cliente' });
