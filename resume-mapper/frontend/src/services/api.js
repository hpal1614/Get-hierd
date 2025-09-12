import axios from 'axios';

export const api = {
  uploadResume: async (file) => {
    const form = new FormData();
    form.append('file', file);
    const res = await axios.post('/api/resume/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  refine: async (prompt, currentResume) => {
    const res = await axios.post('/api/chat/refine', { prompt, currentResume });
    return res.data;
  },
  tokenStatus: async () => {
    const res = await axios.get('/api/tokens/status');
    return res.data;
  },
};


