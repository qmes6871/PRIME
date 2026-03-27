const AdminPage = {
  _agents: [],
  _currentTab: 'agents',

  async render() {
    const agent = API.getAgent();
    if (!agent?.is_admin) {
      return '<div class="empty-state"><div class="empty-state-text">관리자 권한이 필요합니다.</div></div>';
    }

    try {
      if (this._currentTab === 'agents') {
        const data = await API.getAgents();
        this._agents = data.agents || [];
      }

      return `
        <div class="page-header">
          <div class="page-header-row">
            <div>
              <h1 class="page-title" style="display:flex;align-items:center;gap:10px;">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:linear-gradient(135deg,#dc2626,#ef4444);border-radius:10px;">
                  <svg width="18" height="18" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                </span>
                관리자
              </h1>
              <p class="page-subtitle">설계사 계정과 성과관리를 관리합니다</p>
            </div>
            ${this._currentTab === 'agents' ? `
              <button class="btn btn-primary" onclick="AdminPage.showAddAgent()" style="background:linear-gradient(135deg,#dc2626,#ef4444);border:none;">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                설계사 추가
              </button>
            ` : ''}
          </div>
        </div>

        <!-- 탭 -->
        <div style="display:flex;background:var(--gray-100);border-radius:12px;padding:4px;margin-bottom:20px;">
          ${[
            { key: 'agents', label: '설계사 관리', icon: '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
            { key: 'performance', label: '299 성과관리', icon: '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>' }
          ].map(tab => `
            <button onclick="AdminPage.switchTab('${tab.key}')"
              style="flex:1;padding:10px 16px;border-radius:10px;border:none;cursor:pointer;font-size:14px;font-weight:${this._currentTab === tab.key ? '700' : '500'};
                background:${this._currentTab === tab.key ? 'white' : 'transparent'};
                color:${this._currentTab === tab.key ? 'var(--gray-800)' : 'var(--gray-500)'};
                box-shadow:${this._currentTab === tab.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};
                transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:6px;">
              ${tab.icon} ${tab.label}
            </button>
          `).join('')}
        </div>

        <div id="admin-tab-content">
          ${this._currentTab === 'agents' ? this._renderAgentsTab() : this._renderPerformanceTab()}
        </div>
      `;
    } catch (err) {
      showToast(err.message, 'error');
      return '<div class="empty-state"><div class="empty-state-text">데이터를 불러오는 중 오류가 발생했습니다.</div></div>';
    }
  },

  switchTab(tab) {
    this._currentTab = tab;
    App.navigate('admin');
  },

  _renderAgentsTab() {
    return `
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:16px;overflow:hidden;">
        <div style="padding:16px 20px;background:#f8fafc;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:14px;font-weight:700;color:#1e293b;">전체 설계사 ${this._agents.length}명</span>
        </div>
        ${this._agents.map(a => this._renderAgentRow(a)).join('')}
        ${this._agents.length === 0 ? '<div style="padding:40px;text-align:center;color:#94a3b8;">등록된 설계사가 없습니다.</div>' : ''}
      </div>
    `;
  },

  _renderPerformanceTab() {
    // prime 토큰을 229 쿠키에 설정 (같은 도메인이므로 가능)
    const primeToken = API.getToken();
    if (primeToken) {
      document.cookie = `auth_token=${primeToken}; path=/; max-age=86400; SameSite=Lax`;
    }

    return `
      <div style="display:flex;gap:12px;margin-bottom:16px;">
        <a href="/prime/229/" target="_blank" class="btn btn-secondary" style="border-radius:10px;display:flex;align-items:center;gap:6px;padding:8px 16px;">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          대시보드 새창
        </a>
        <a href="/prime/229/admin/index.php" target="_blank" class="btn btn-secondary" style="border-radius:10px;display:flex;align-items:center;gap:6px;padding:8px 16px;">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          어드민 새창
        </a>
      </div>
      <div style="border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.04);background:white;">
        <iframe src="/prime/229/admin/index.php" style="width:100%;height:calc(100vh - 280px);border:none;display:block;"></iframe>
      </div>
    `;
  },

  _renderAgentRow(a) {
    const statusColor = a.is_active ? '#10b981' : '#94a3b8';
    const statusText = a.is_active ? '활성' : '비활성';
    return `
      <div style="display:flex;align-items:center;gap:16px;padding:16px 20px;border-bottom:1px solid #f1f5f9;transition:background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background=''">
        <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          ${a.profile_image
            ? `<img src="${Utils.escapeHtml(a.profile_image)}" style="width:100%;height:100%;border-radius:12px;object-fit:cover;">`
            : `<span style="font-size:18px;font-weight:700;color:#4f46e5;">${Utils.escapeHtml((a.name || '?')[0])}</span>`}
        </div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:15px;font-weight:700;color:#1e293b;">${Utils.escapeHtml(a.name)}</span>
            <span style="font-size:11px;padding:2px 8px;border-radius:6px;background:#f1f5f9;color:#64748b;font-weight:600;">${Utils.escapeHtml(a.login_id)}</span>
            ${a.is_admin ? '<span style="font-size:10px;padding:2px 6px;border-radius:4px;background:#fef2f2;color:#dc2626;font-weight:700;">관리자</span>' : ''}
            <span style="font-size:10px;padding:2px 6px;border-radius:4px;background:${a.is_active ? '#ecfdf5' : '#f1f5f9'};color:${statusColor};font-weight:600;">${statusText}</span>
          </div>
          <div style="font-size:12px;color:#94a3b8;margin-top:3px;">
            ${[a.position, a.branch, a.phone ? Utils.formatPhone(a.phone) : ''].filter(Boolean).join(' | ')}
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0;">
          <button class="btn btn-sm" onclick="AdminPage.editAgent(${a.id})" style="padding:6px 12px;font-size:12px;background:#f8fafc;color:#475569;border:1px solid #e2e8f0;border-radius:8px;">수정</button>
          ${a.id !== API.getAgent()?.id ? `<button class="btn btn-sm" onclick="AdminPage.toggleAgent(${a.id}, ${!a.is_active})" style="padding:6px 12px;font-size:12px;background:${a.is_active ? '#fef2f2' : '#ecfdf5'};color:${a.is_active ? '#dc2626' : '#059669'};border:1px solid ${a.is_active ? '#fecaca' : '#a7f3d0'};border-radius:8px;">${a.is_active ? '비활성화' : '활성화'}</button>` : ''}
        </div>
      </div>
    `;
  },

  showAddAgent() {
    Modal.show('설계사 계정 추가', `
      <form id="add-agent-form">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group">
            <label class="form-label" style="font-size:12px;">로그인 아이디 *</label>
            <input type="text" class="form-input" name="login_id" placeholder="영문/숫자" required style="border-radius:10px;">
          </div>
          <div class="form-group">
            <label class="form-label" style="font-size:12px;">비밀번호 *</label>
            <input type="password" class="form-input" name="password" placeholder="6자 이상" required style="border-radius:10px;">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" style="font-size:12px;">이름 *</label>
          <input type="text" class="form-input" name="name" placeholder="설계사 이름" required style="border-radius:10px;">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group">
            <label class="form-label" style="font-size:12px;">연락처</label>
            <input type="text" class="form-input" name="phone" placeholder="01012345678" style="border-radius:10px;">
          </div>
          <div class="form-group">
            <label class="form-label" style="font-size:12px;">이메일</label>
            <input type="email" class="form-input" name="email" placeholder="email@example.com" style="border-radius:10px;">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group">
            <label class="form-label" style="font-size:12px;">직급</label>
            <input type="text" class="form-input" name="position" placeholder="설계사" value="설계사" style="border-radius:10px;">
          </div>
          <div class="form-group">
            <label class="form-label" style="font-size:12px;">지점</label>
            <input type="text" class="form-input" name="branch" placeholder="소속 지점" style="border-radius:10px;">
          </div>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()" style="border-radius:8px;">취소</button>
      <button class="btn btn-primary" onclick="AdminPage.saveAgent()" style="border-radius:8px;background:linear-gradient(135deg,#dc2626,#ef4444);border:none;">추가</button>
    `);
  },

  async saveAgent() {
    const form = document.getElementById('add-agent-form');
    const fd = new FormData(form);
    const data = {};
    fd.forEach((v, k) => { if (v) data[k] = v; });

    if (!data.login_id || !data.password || !data.name) {
      showToast('아이디, 비밀번호, 이름은 필수입니다.', 'error');
      return;
    }
    if (data.password.length < 6) {
      showToast('비밀번호는 6자 이상이어야 합니다.', 'error');
      return;
    }

    try {
      await API.createAgent(data);
      Modal.close();
      showToast('설계사가 추가되었습니다.', 'success');
      App.navigate('admin');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  editAgent(id) {
    const a = this._agents.find(x => x.id === id);
    if (!a) return;

    Modal.show('설계사 정보 수정', `
      <form id="edit-agent-form">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;padding:10px 14px;background:#f1f5f9;border-radius:10px;">
          <span style="font-size:12px;color:#64748b;">로그인 ID:</span>
          <span style="font-size:13px;font-weight:700;color:#1e293b;">${Utils.escapeHtml(a.login_id)}</span>
        </div>
        <div class="form-group">
          <label class="form-label" style="font-size:12px;">이름 *</label>
          <input type="text" class="form-input" name="name" value="${Utils.escapeHtml(a.name || '')}" required style="border-radius:10px;">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group">
            <label class="form-label" style="font-size:12px;">연락처</label>
            <input type="text" class="form-input" name="phone" value="${Utils.escapeHtml(a.phone || '')}" style="border-radius:10px;">
          </div>
          <div class="form-group">
            <label class="form-label" style="font-size:12px;">이메일</label>
            <input type="email" class="form-input" name="email" value="${Utils.escapeHtml(a.email || '')}" style="border-radius:10px;">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group">
            <label class="form-label" style="font-size:12px;">직급</label>
            <input type="text" class="form-input" name="position" value="${Utils.escapeHtml(a.position || '')}" style="border-radius:10px;">
          </div>
          <div class="form-group">
            <label class="form-label" style="font-size:12px;">지점</label>
            <input type="text" class="form-input" name="branch" value="${Utils.escapeHtml(a.branch || '')}" style="border-radius:10px;">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" style="font-size:12px;">비밀번호 변경 (비워두면 유지)</label>
          <input type="password" class="form-input" name="password" placeholder="새 비밀번호" style="border-radius:10px;">
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()" style="border-radius:8px;">취소</button>
      <button class="btn btn-primary" onclick="AdminPage.updateAgent(${id})" style="border-radius:8px;background:linear-gradient(135deg,#dc2626,#ef4444);border:none;">저장</button>
    `);
  },

  async updateAgent(id) {
    const form = document.getElementById('edit-agent-form');
    const fd = new FormData(form);
    const data = {};
    fd.forEach((v, k) => { if (v) data[k] = v; });

    if (!data.name) {
      showToast('이름은 필수입니다.', 'error');
      return;
    }
    if (data.password && data.password.length < 6) {
      showToast('비밀번호는 6자 이상이어야 합니다.', 'error');
      return;
    }
    if (!data.password) delete data.password;

    try {
      await API.updateAgent(id, data);
      Modal.close();
      showToast('수정되었습니다.', 'success');
      App.navigate('admin');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async toggleAgent(id, activate) {
    const action = activate ? '활성화' : '비활성화';
    Modal.confirm(`이 설계사를 ${action}하시겠습니까?`, async () => {
      try {
        await API.updateAgent(id, { is_active: activate });
        showToast(`${action}되었습니다.`, 'success');
        App.navigate('admin');
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }
};
