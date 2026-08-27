import api from '@/lib/api';
import type { ContactForm } from '@/types';

export const contactService = {
  send: async (form: ContactForm): Promise<{ message: string }> => {
    const { data } = await api.post('/contact', form);
    return data;
  },
};
