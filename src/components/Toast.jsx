import { useEffect } from 'react';

export default function Toast({ mensaje, visible, tipo = 'success' }) {
  if (!visible) return null;
  return (
    <div className={`toast-msg ${tipo === 'error' ? 'toast-error' : ''}`}>
      {mensaje}
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = [
    { visible: false, mensaje: '', tipo: 'success' },
    null,
  ];
  return { toast, setToast };
}
