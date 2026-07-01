import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-primary text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-lg font-medium text-sm animate-fade-in ${styles[type]}`}>
      {message}
    </div>
  );
}