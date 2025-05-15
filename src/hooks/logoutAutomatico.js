import { toast } from 'react-hot-toast';

export const logoutAutomatico = () => {
  localStorage.removeItem('token');
  toast.error('Sessione scaduta, effettua nuovamente il login.');
  setTimeout(() => {
    window.location.href = '/login';
  }, 1000);
};
