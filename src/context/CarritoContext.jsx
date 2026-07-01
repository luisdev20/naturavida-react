import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  getCarritoByUser,
  addItemCarrito,
  updateItemCarrito,
  deleteItemCarrito,
} from '../services/carritoService';
import { useAuth } from './AuthContext';

const CarritoContext = createContext(null);

function getGuestId() {
  const stored = localStorage.getItem('natura_guest_id');
  if (stored) return parseInt(stored, 10);
  const newId = -Math.floor(Math.random() * 1000000) - 1;
  localStorage.setItem('natura_guest_id', newId.toString());
  return newId;
}

function normalizar(items) {
  return items.map((i) => ({
    ...i,
    id: i.id !== undefined ? +i.id : undefined,
    usuarioId: +i.usuarioId,
    productoId: +i.productoId,
  }));
}

export function CarritoProvider({ children }) {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);

  const getCartUserId = useCallback(() => {
    return currentUser?.id ? +currentUser.id : getGuestId();
  }, [currentUser]);

  const cargarCarrito = useCallback(async (userId) => {
    const uid = userId ?? (currentUser?.id ? +currentUser.id : getGuestId());
    try {
      const res = await getCarritoByUser(uid);
      setItems(normalizar(res.data));
    } catch {
      setItems([]);
    }
  }, [currentUser]);

  const totalItems = useMemo(() => items.reduce((acc, i) => acc + i.cantidad, 0), [items]);
  const totalPrecio = useMemo(() => items.reduce((acc, i) => acc + i.precio * i.cantidad, 0), [items]);

  const agregarItem = useCallback(async (producto, cantidad = 1) => {
    const usuarioId = getCartUserId();
    const productoId = +producto.id;
    const existente = items.find((i) => i.productoId === productoId && i.usuarioId === usuarioId);

    if (existente && existente.id) {
      const actualizado = { ...existente, cantidad: existente.cantidad + cantidad };
      await updateItemCarrito(existente.id, actualizado);
    } else {
      const nuevo = {
        usuarioId,
        productoId,
        nombre: producto.nombre,
        imagen: producto.imagen,
        precio: producto.precio,
        detalle: producto.detalle,
        cantidad,
      };
      await addItemCarrito(nuevo);
    }
    await cargarCarrito(usuarioId);
  }, [items, getCartUserId, cargarCarrito]);

  const actualizarCantidad = useCallback(async (item, cantidad) => {
    await updateItemCarrito(item.id, { ...item, cantidad });
    await cargarCarrito(getCartUserId());
  }, [getCartUserId, cargarCarrito]);

  const quitarItem = useCallback(async (id) => {
    await deleteItemCarrito(id);
    await cargarCarrito(getCartUserId());
  }, [getCartUserId, cargarCarrito]);

  const limpiarCarrito = useCallback(() => {
    const usuarioId = getCartUserId();
    const userItems = items.filter((i) => i.usuarioId === usuarioId);
    userItems.forEach((item) => {
      if (item.id) deleteItemCarrito(item.id).catch(() => {});
    });
    setItems([]);
  }, [items, getCartUserId]);

  const sincronizarCarrito = useCallback(async (userId) => {
    const guestIdStr = localStorage.getItem('natura_guest_id');
    if (!guestIdStr) {
      await cargarCarrito(userId);
      return;
    }
    const guestId = parseInt(guestIdStr, 10);
    try {
      const guestRes = await getCarritoByUser(guestId);
      const guestItems = normalizar(guestRes.data);
      if (guestItems.length === 0) {
        localStorage.removeItem('natura_guest_id');
        await cargarCarrito(userId);
        return;
      }
      const userRes = await getCarritoByUser(userId);
      const userItems = normalizar(userRes.data);
      const promises = [];
      guestItems.forEach((guestItem) => {
        const userItem = userItems.find((ui) => ui.productoId === guestItem.productoId);
        if (userItem && userItem.id) {
          promises.push(updateItemCarrito(userItem.id, { ...userItem, cantidad: userItem.cantidad + guestItem.cantidad }));
          promises.push(deleteItemCarrito(guestItem.id));
        } else {
          promises.push(updateItemCarrito(guestItem.id, { ...guestItem, usuarioId: userId }));
        }
      });
      await Promise.all(promises);
      localStorage.removeItem('natura_guest_id');
      await cargarCarrito(userId);
    } catch {
      await cargarCarrito(userId);
    }
  }, [cargarCarrito]);

  return (
    <CarritoContext.Provider value={{
      items, totalItems, totalPrecio,
      cargarCarrito, agregarItem, actualizarCantidad,
      quitarItem, limpiarCarrito, sincronizarCarrito, getCartUserId,
    }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error('useCarrito must be used within CarritoProvider');
  return ctx;
}
