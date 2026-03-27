// API Client
const API = {
  baseUrl: '/api/v1',

  getToken() {
    return localStorage.getItem('prime_token');
  },

  setToken(token) {
    localStorage.setItem('prime_token', token);
  },

  removeToken() {
    localStorage.removeItem('prime_token');
    localStorage.removeItem('prime_agent');
  },

  getAgent() {
    const data = localStorage.getItem('prime_agent');
    return data ? JSON.parse(data) : null;
  },

  setAgent(agent) {
    localStorage.setItem('prime_agent', JSON.stringify(agent));
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  async request(method, path, data = null) {
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const token = this.getToken();
    if (token) {
      opts.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      opts.body = JSON.stringify(data);
    }

    const res = await fetch(this.baseUrl + path, opts);

    if (res.status === 401) {
      this.removeToken();
      App.navigate('login');
      throw new Error('인증이 만료되었습니다.');
    }

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      throw new Error('서버 응답 오류 (status: ' + res.status + ')');
    }

    if (!res.ok) {
      throw new Error(json.error || '요청에 실패했습니다.');
    }

    return json;
  },

  get(path) { return this.request('GET', path); },
  post(path, data) { return this.request('POST', path, data); },
  put(path, data) { return this.request('PUT', path, data); },
  patch(path, data) { return this.request('PATCH', path, data); },
  delete(path) { return this.request('DELETE', path); },

  // Auth
  login(loginId, password) {
    return this.post('/auth/login', { login_id: loginId, password });
  },
  register(data) {
    return this.post('/auth/register', data);
  },

  // Dashboard
  getDashboard() { return this.get('/dashboard'); },

  // Customers
  getCustomers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get('/customers' + (query ? '?' + query : ''));
  },
  getCustomer(id) { return this.get(`/customers/${id}`); },
  createCustomer(data) { return this.post('/customers', data); },
  updateCustomer(id, data) { return this.put(`/customers/${id}`, data); },
  deleteCustomer(id) { return this.delete(`/customers/${id}`); },
  updateCustomerStatus(id, status) { return this.patch(`/customers/${id}/status`, { status }); },

  // Consultations
  getConsultations(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get('/consultations' + (query ? '?' + query : ''));
  },
  getConsultation(id) { return this.get(`/consultations/${id}`); },
  createConsultation(data) { return this.post('/consultations', data); },
  updateConsultation(id, data) { return this.put(`/consultations/${id}`, data); },
  deleteConsultation(id) { return this.delete(`/consultations/${id}`); },
  shareConsultation(id) { return this.post(`/consultations/${id}/share`); },
  getConsultationHistory(id) { return this.get(`/consultations/${id}/history`); },
  getConsultationHistoryDetail(id, historyId) { return this.get(`/consultations/${id}/history/${historyId}`); },
  createConsultationHistory(id, data) { return this.post(`/consultations/${id}/history`, data); },
  restoreConsultationHistory(id, historyId) { return this.post(`/consultations/${id}/history/${historyId}/restore`); },

  // Templates
  getTemplates(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get('/templates' + (query ? '?' + query : ''));
  },
  createTemplate(data) { return this.post('/templates', data); },
  updateTemplate(id, data) { return this.put(`/templates/${id}`, data); },
  resetTemplate(id) { return this.post(`/templates/${id}/reset`); },
  deleteTemplate(id) { return this.delete(`/templates/${id}`); },

  // Messages
  sendMessage(data) { return this.post('/messages/send', data); },
  getMessageLogs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get('/messages/logs' + (query ? '?' + query : ''));
  },

  // Coverages
  getCustomerCoverages(customerId) { return this.get(`/customers/${customerId}/coverages`); },
  createCoverage(customerId, data) { return this.post(`/customers/${customerId}/coverages`, data); },
  updateCoverage(customerId, id, data) { return this.put(`/customers/${customerId}/coverages/${id}`, data); },
  deleteCoverage(customerId, id) { return this.delete(`/customers/${customerId}/coverages/${id}`); },

  // Check Items
  getCheckItems() { return this.get('/check-items'); },
  createCheckItem(data) { return this.post('/check-items', data); },
  updateCheckItem(id, data) { return this.put(`/check-items/${id}`, data); },
  deleteCheckItem(id) { return this.delete(`/check-items/${id}`); },

  // Info Links
  getInfoLinks() { return this.get('/info-links'); },
  createInfoLink(data) { return this.post('/info-links', data); },
  updateInfoLink(id, data) { return this.put(`/info-links/${id}`, data); },
  deleteInfoLink(id) { return this.delete(`/info-links/${id}`); },

  // Insurance Companies
  getInsuranceCompanies(type) {
    return this.get('/insurance-companies' + (type ? '?type=' + type : ''));
  },

  // Surveys
  getSurveys(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get('/surveys' + (query ? '?' + query : ''));
  },
  updateSurveyStatus(id, data) { return this.patch(`/surveys/${id}/status`, data); },
  deleteSurvey(id) { return this.delete(`/surveys/${id}`); },

  // Settings
  getSettings() { return this.get('/settings'); },
  updateSettings(data) { return this.put('/settings', data); },
  updateProfile(data) { return this.put('/settings/profile', data); },
  changePassword(data) { return this.put('/settings/password', data); },

  // Uploads
  async uploadPolicyImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(this.baseUrl + '/uploads/policy-image', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
      body: formData
    });
    if (res.status === 401) {
      this.removeToken();
      App.navigate('login');
      throw new Error('인증이 만료되었습니다.');
    }
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      throw new Error('서버 응답 오류 (status: ' + res.status + ')');
    }
    if (!res.ok) throw new Error(json.error || '업로드에 실패했습니다.');
    return json;
  },
  deletePolicyImage(filename) { return this.delete(`/uploads/policy-image/${filename}`); },

  // Admin
  getAgents() { return this.get('/admin/agents'); },
  createAgent(data) { return this.post('/admin/agents', data); },
  updateAgent(id, data) { return this.put(`/admin/agents/${id}`, data); },
  deleteAgent(id) { return this.delete(`/admin/agents/${id}`); }
};
