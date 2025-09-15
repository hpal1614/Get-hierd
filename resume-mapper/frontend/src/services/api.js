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
  uploadAlterations: async (file, currentResume) => {
    const form = new FormData();
    form.append('file', file);
    form.append('currentResume', JSON.stringify(currentResume || {}));
    const res = await axios.post('/api/resume/alterations', form, {
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
  overlayUpdate: async (file, updatedJson) => {
    const form = new FormData();
    form.append('file', file);
    form.append('updatedJson', JSON.stringify(updatedJson));
    const res = await axios.post('/api/resume/overlay-update', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob', // Important for binary data
    });
    return res.data;
  },
  generateResume: async (updatedJson) => {
    const res = await axios.post('/api/resume/generate', { updatedJson }, {
      responseType: 'blob', // Important for binary data
    });
    return res.data;
  },

  // Job-based resume adaptation
  adaptResumeToJob: async (jobDescription) => {
    const res = await axios.post('/api/resume/adapt-to-job', { jobDescription });
    return res.data;
  },

  generateJobAdaptedResume: async (jobDescription) => {
    const res = await axios.post('/api/resume/generate-job-resume', { jobDescription }, {
      responseType: 'blob', // Important for binary data
    });
    return res.data;
  },
};


