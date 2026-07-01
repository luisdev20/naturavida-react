import api from './api';

export const getCarritoByUser = (usuarioId) =>
  api.get(`/carrito?usuarioId=${usuarioId}`);

export const addItemCarrito = (item) =>
  api.post('/carrito', item);

export const updateItemCarrito = (id, item) =>
  api.put(`/carrito/${id}`, item);

export const deleteItemCarrito = (id) =>
  api.delete(`/carrito/${id}`);

export const getCarritoAll = () =>
  api.get('/carrito');

export const getUsuarios = () =>
  api.get('/usuarios');
