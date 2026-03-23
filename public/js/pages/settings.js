// Settings Page - Premium Customization Center
const SettingsPage = {
  _currentTab: 'profile',
  _settings: null,
  _agent: null,
  _templates: [],
  _checkItems: [],
  _infoLinks: [],
  _menuItems: [],

  _tabs: [
    { id: 'profile',    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: '프로필', color: '#6366f1' },
    { id: 'menu',       icon: 'M4 6h16M4 12h16M4 18h7', label: '메뉴 커스터마이징', color: '#8b5cf6' },
    { id: 'templates',  icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', label: '메시지 템플릿', color: '#059669' },
    // { id: 'checkitems', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: '보장 점검항목', color: '#d97706' },
    { id: 'links',      icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', label: '보험정보 링크', color: '#3b82f6' },
    { id: 'system',     icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: '시스템 설정', color: '#64748b' },
    { id: 'password',   icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', label: '비밀번호 변경', color: '#dc2626' }
  ],

  async render() {
    try {
      const data = await API.getSettings();
      this._settings = data.settings;
      this._agent = data.agent;

      // Sync menu settings to localStorage
      if (this._settings.menu_order || this._settings.menu_labels) {
        Sidebar.saveMenuSettings(this._settings.menu_order, this._settings.menu_labels);
      }

      return `
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:start;">
          <div>
            <h1 class="page-title" style="display:flex;align-items:center;gap:10px;">
              <span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:linear-gradient(135deg,#64748b,#475569);border-radius:10px;">
                <svg width="18" height="18" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </span>
              설정
            </h1>
            <p class="page-subtitle">나만의 전산 시스템을 커스터마이징하세요</p>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;margin-bottom:24px;" id="settings-tab-nav">
          ${this._tabs.map(tab => `
            <div onclick="SettingsPage.showTab('${tab.id}')" id="stab-${tab.id}"
              style="display:flex;align-items:center;gap:6px;padding:10px 16px;border-radius:10px;cursor:pointer;transition:all 0.2s;white-space:nowrap;font-size:13px;font-weight:600;
                ${this._currentTab === tab.id
                  ? `background:${tab.color}10;color:${tab.color};border:1.5px solid ${tab.color}40;`
                  : 'background:white;color:var(--gray-500);border:1.5px solid transparent;box-shadow:0 1px 3px rgba(0,0,0,0.04);'}">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="${tab.icon}"/></svg>
              ${tab.label}
            </div>
          `).join('')}
        </div>

        <div id="settings-content">
          ${this._renderTabContent()}
        </div>
      `;
    } catch (err) {
      showToast(err.message, 'error');
      return '<div class="empty-state"><div class="empty-state-text">설정을 불러오는 중 오류가 발생했습니다.</div></div>';
    }
  },

  async showTab(tabId) {
    this._currentTab = tabId;
    // Update tab styles
    this._tabs.forEach(tab => {
      const el = document.getElementById('stab-' + tab.id);
      if (el) {
        if (tab.id === tabId) {
          el.style.background = tab.color + '10';
          el.style.color = tab.color;
          el.style.borderColor = tab.color + '40';
        } else {
          el.style.background = 'white';
          el.style.color = 'var(--gray-500)';
          el.style.borderColor = 'transparent';
        }
      }
    });

    // Load data if needed
    if (tabId === 'templates' && this._templates.length === 0) {
      const d = await API.getTemplates({});
      this._templates = d.templates;
    }
    if (tabId === 'checkitems' && this._checkItems.length === 0) {
      const d = await API.getCheckItems();
      this._checkItems = d.items;
    }
    if (tabId === 'links' && this._infoLinks.length === 0) {
      const d = await API.getInfoLinks();
      this._infoLinks = d.links;
    }
    if (tabId === 'menu') {
      this._menuItems = Sidebar.getMenuItems().map(m => ({ ...m }));
    }

    document.getElementById('settings-content').innerHTML = this._renderTabContent();
  },

  _renderTabContent() {
    switch (this._currentTab) {
      case 'profile': return this._renderProfile();
      case 'menu': return this._renderMenu();
      case 'templates': return this._renderTemplates();
      case 'checkitems': return this._renderCheckItems();
      case 'links': return this._renderLinks();
      case 'system': return this._renderSystem();
      case 'password': return this._renderPassword();
      default: return '';
    }
  },

  // ==================== 1. Profile ====================
  _renderProfile() {
    const a = this._agent || {};
    const s = this._settings || {};
    const positions = ['본부장', '지사장', '팀장', 'FC', '설계사'];
    const profileImg = a.profile_image
      ? `<img src="${a.profile_image}" style="width:56px;height:56px;border-radius:50%;object-fit:cover;flex-shrink:0;">`
      : `<div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#818cf8);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:white;flex-shrink:0;">${Utils.escapeHtml((a.name || 'P')[0])}</div>`;

    return `
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
        <div class="card-header" style="margin-bottom:20px;">
          <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);border-radius:8px;">
              <svg width="14" height="14" fill="none" stroke="#4338ca" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </span>
            프로필 정보
          </h3>
        </div>
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;padding:16px;background:linear-gradient(135deg,#f8fafc,#f1f5f9);border-radius:12px;">
          <div style="position:relative;cursor:pointer;" onclick="document.getElementById('profile-image-input').click()">
            ${profileImg}
            <div style="position:absolute;bottom:-2px;right:-2px;width:22px;height:22px;background:var(--blue);border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;">
              <svg width="10" height="10" fill="white" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </div>
            <input type="file" id="profile-image-input" accept="image/*" style="display:none;" onchange="SettingsPage.uploadProfileImage(this)">
          </div>
          <div>
            <div style="font-size:18px;font-weight:700;color:var(--gray-800);">${Utils.escapeHtml(a.name || '')}</div>
            <div style="font-size:13px;color:var(--gray-400);">${Utils.escapeHtml(a.position || '')} · ${Utils.escapeHtml(a.branch || '')}</div>
            <div style="font-size:11px;color:var(--blue);margin-top:2px;cursor:pointer;" onclick="document.getElementById('profile-image-input').click()">프로필 사진 변경</div>
          </div>
        </div>
        <form id="profile-form">
          <div class="grid-2" style="gap:14px;">
            <div class="form-group"><label class="form-label" style="font-size:12px;">이름</label><input type="text" class="form-input" name="name" value="${Utils.escapeHtml(a.name || '')}" style="border-radius:10px;"></div>
            <div class="form-group"><label class="form-label" style="font-size:12px;">연락처</label><input type="tel" class="form-input" name="phone" value="${Utils.formatPhone(a.phone || '')}" style="border-radius:10px;" oninput="Utils.formatPhoneInput(this)"></div>
          </div>
          <div class="grid-2" style="gap:14px;">
            <div class="form-group">
              <label class="form-label" style="font-size:12px;">이메일</label>
              <div style="display:flex;gap:6px;">
                <input type="text" class="form-input" id="email-id" value="${(a.email || '').split('@')[0] || ''}" placeholder="아이디" style="border-radius:10px;flex:1;">
                <span style="display:flex;align-items:center;color:var(--gray-400);">@</span>
                <select class="form-input" id="email-domain" style="border-radius:10px;flex:1;" onchange="if(this.value==='direct'){this.style.display='none';document.getElementById('email-domain-input').style.display='block';}">
                  <option value="naver.com" ${(a.email || '').includes('naver.com') ? 'selected' : ''}>naver.com</option>
                  <option value="gmail.com" ${(a.email || '').includes('gmail.com') ? 'selected' : ''}>gmail.com</option>
                  <option value="daum.net" ${(a.email || '').includes('daum.net') ? 'selected' : ''}>daum.net</option>
                  <option value="hanmail.net" ${(a.email || '').includes('hanmail.net') ? 'selected' : ''}>hanmail.net</option>
                  <option value="nate.com" ${(a.email || '').includes('nate.com') ? 'selected' : ''}>nate.com</option>
                  <option value="kakao.com" ${(a.email || '').includes('kakao.com') ? 'selected' : ''}>kakao.com</option>
                  <option value="direct">직접입력</option>
                </select>
                <input type="text" class="form-input" id="email-domain-input" placeholder="직접입력" style="border-radius:10px;flex:1;display:none;">
              </div>
              <input type="hidden" name="email" value="${Utils.escapeHtml(a.email || '')}">
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:12px;">직급</label>
              <select class="form-input" name="position" style="border-radius:10px;">
                ${positions.map(p => `<option value="${p}" ${a.position === p ? 'selected' : ''}>${p}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" style="font-size:12px;">소속</label>
            <input type="text" class="form-input" name="branch" value="${Utils.escapeHtml(a.branch || '프라임에셋')}" style="border-radius:10px;background:var(--gray-50);" readonly>
          </div>
          <div class="form-group">
            <label class="form-label" style="font-size:12px;">소개 문구</label>
            <input type="text" class="form-input" name="profile_intro" value="${Utils.escapeHtml(a.profile_intro || '')}" placeholder="예: 고객의 미래를 함께 설계합니다" style="border-radius:10px;" maxlength="200">
          </div>
          <button type="button" class="btn" onclick="SettingsPage.saveProfile()" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;border:none;border-radius:10px;padding:12px 24px;font-weight:600;box-shadow:0 4px 14px rgba(99,102,241,0.3);">저장</button>
        </form>
      </div>
    `;
  },

  async saveProfile() {
    const form = document.getElementById('profile-form');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((v, k) => { data[k] = v; });

    // 이메일 조합
    const emailId = document.getElementById('email-id')?.value?.trim();
    const emailDomainSelect = document.getElementById('email-domain');
    const emailDomainInput = document.getElementById('email-domain-input');
    if (emailId) {
      const domain = (emailDomainInput && emailDomainInput.style.display !== 'none')
        ? emailDomainInput.value.trim()
        : emailDomainSelect?.value;
      data.email = `${emailId}@${domain}`;
    }

    // 연락처에서 하이픈 제거하여 저장
    if (data.phone) {
      data.phone = data.phone.replace(/-/g, '');
    }

    try {
      const result = await API.updateProfile(data);
      const agent = API.getAgent();
      Object.assign(agent, result.agent);
      API.setAgent(agent);
      this._agent = { ...this._agent, ...result.agent };
      showToast('프로필이 저장되었습니다.', 'success');
    } catch (err) { showToast(err.message, 'error'); }
  },

  async uploadProfileImage(input) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('이미지 크기는 5MB 이하로 업로드해주세요.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const result = await API.post('/settings/profile-image', { image: e.target.result });
        this._agent.profile_image = result.profile_image;
        const agent = API.getAgent();
        agent.profile_image = result.profile_image;
        API.setAgent(agent);
        showToast('프로필 사진이 업로드되었습니다.', 'success');
        document.getElementById('settings-content').innerHTML = this._renderProfile();
      } catch (err) { showToast(err.message, 'error'); }
    };
    reader.readAsDataURL(file);
  },

  // ==================== 2. Menu Customization ====================
  _renderMenu() {
    if (!this._menuItems.length) {
      this._menuItems = Sidebar.getMenuItems().map(m => ({ ...m }));
    }
    const labels = (this._settings?.menu_labels) || {};

    return `
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
        <div class="card-header" style="margin-bottom:16px;">
          <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#ede9fe,#ddd6fe);border-radius:8px;">
              <svg width="14" height="14" fill="none" stroke="#7c3aed" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
            </span>
            메뉴 순서 & 명칭 변경
          </h3>
        </div>
        <p style="font-size:13px;color:var(--gray-400);margin-bottom:16px;">화살표로 메뉴 순서를 변경하고, 원하는 메뉴명을 직접 입력하세요.</p>

        <div id="menu-order-list" style="display:flex;flex-direction:column;gap:8px;">
          ${this._menuItems.map((item, i) => `
            <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--gray-50);border-radius:12px;border:1px solid var(--gray-200);transition:all 0.2s;" data-menu-id="${item.id}">
              <div style="display:flex;flex-direction:column;gap:2px;">
                <button onclick="SettingsPage.moveMenu(${i},-1)" style="background:none;border:none;cursor:pointer;padding:0;color:${i > 0 ? 'var(--gray-500)' : 'var(--gray-200)'};font-size:14px;line-height:1;" ${i === 0 ? 'disabled' : ''}>▲</button>
                <button onclick="SettingsPage.moveMenu(${i},1)" style="background:none;border:none;cursor:pointer;padding:0;color:${i < this._menuItems.length - 1 ? 'var(--gray-500)' : 'var(--gray-200)'};font-size:14px;line-height:1;" ${i === this._menuItems.length - 1 ? 'disabled' : ''}>▼</button>
              </div>
              <span style="font-size:20px;flex-shrink:0;">${item.icon}</span>
              <div style="flex:1;">
                <input type="text" class="form-input" id="menu-label-${item.id}" value="${Utils.escapeHtml(item.label)}" style="border-radius:8px;font-size:13px;padding:8px 12px;border:1px solid var(--gray-200);">
              </div>
              <span style="font-size:11px;color:var(--gray-300);font-family:monospace;min-width:70px;">${item.id}</span>
            </div>
          `).join('')}
        </div>

        <div style="display:flex;gap:10px;margin-top:20px;">
          <button class="btn" onclick="SettingsPage.saveMenuSettings()" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:white;border:none;border-radius:10px;padding:12px 24px;font-weight:600;box-shadow:0 4px 14px rgba(139,92,246,0.3);">순서 & 명칭 저장</button>
          <button class="btn" onclick="SettingsPage.resetMenu()" style="background:white;color:var(--gray-500);border:1.5px solid var(--gray-200);border-radius:10px;padding:12px 20px;">기본값 복원</button>
        </div>
      </div>
    `;
  },

  moveMenu(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= this._menuItems.length) return;
    const temp = this._menuItems[index];
    this._menuItems[index] = this._menuItems[newIndex];
    this._menuItems[newIndex] = temp;
    document.getElementById('settings-content').innerHTML = this._renderMenu();
  },

  async saveMenuSettings() {
    // Collect labels from inputs
    const menuLabels = {};
    const menuOrder = [];
    const defaults = Sidebar.defaultMenuItems;

    this._menuItems.forEach(item => {
      menuOrder.push(item.id);
      const input = document.getElementById('menu-label-' + item.id);
      const newLabel = input ? input.value.trim() : item.label;
      const defaultItem = defaults.find(d => d.id === item.id);
      if (defaultItem && newLabel !== defaultItem.label) {
        menuLabels[item.id] = newLabel;
      }
    });

    try {
      await API.updateSettings({ menu_order: menuOrder, menu_labels: menuLabels });
      Sidebar.saveMenuSettings(menuOrder, menuLabels);
      this._settings.menu_order = menuOrder;
      this._settings.menu_labels = menuLabels;
      showToast('메뉴 설정이 저장되었습니다. 사이드바에 반영됩니다.', 'success');
      // Refresh sidebar
      const sidebar = document.getElementById('sidebar');
      if (sidebar) {
        sidebar.outerHTML = Sidebar.render(this._currentTab === 'settings' ? 'settings' : 'settings').replace(/<button class="mobile-menu-btn".*?<\/button>/, '');
      }
    } catch (err) { showToast(err.message, 'error'); }
  },

  async resetMenu() {
    try {
      await API.updateSettings({ menu_order: null, menu_labels: null });
      localStorage.removeItem('prime_menu_settings');
      this._settings.menu_order = null;
      this._settings.menu_labels = null;
      this._menuItems = Sidebar.defaultMenuItems.map(m => ({ ...m }));
      showToast('기본값으로 복원되었습니다.', 'success');
      document.getElementById('settings-content').innerHTML = this._renderMenu();
      App.navigate('settings');
    } catch (err) { showToast(err.message, 'error'); }
  },

  // ==================== 3. Message Templates ====================
  _renderTemplates() {
    const msgTemplates = this._templates.filter(t => t.category === '메시지안내');
    const alimTemplates = this._templates.filter(t => t.category === '알림톡');
    const specialTemplates = this._templates.filter(t => t.category === '특별알림');

    return `
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
        <div class="card-header" style="margin-bottom:16px;">
          <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#d1fae5,#a7f3d0);border-radius:8px;">
              <svg width="14" height="14" fill="none" stroke="#059669" stroke-width="2" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            </span>
            메시지 템플릿 통합 관리
          </h3>
          <button class="btn btn-sm" onclick="SettingsPage.addTemplate()" style="background:linear-gradient(135deg,#059669,#10b981);color:white;border:none;border-radius:8px;padding:6px 14px;font-weight:600;">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
            새 템플릿
          </button>
        </div>

        <!-- 메시지안내 -->
        <div style="margin-bottom:20px;">
          <div style="font-size:12px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
            <span style="width:16px;height:2px;background:#6366f1;border-radius:1px;"></span>
            고객 메시지 안내 (${msgTemplates.length}종)
          </div>
          ${msgTemplates.map(t => this._renderTemplateRow(t, '#6366f1')).join('')}
          ${msgTemplates.length === 0 ? '<div style="padding:12px;text-align:center;color:var(--gray-400);font-size:13px;">등록된 템플릿이 없습니다</div>' : ''}
        </div>

        <!-- 알림톡 -->
        <div style="margin-bottom:20px;">
          <div style="font-size:12px;font-weight:700;color:#d97706;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
            <span style="width:16px;height:2px;background:#d97706;border-radius:1px;"></span>
            상담진행 알림톡 (${alimTemplates.length}종)
          </div>
          ${alimTemplates.map(t => this._renderTemplateRow(t, '#d97706')).join('')}
          ${alimTemplates.length === 0 ? '<div style="padding:12px;text-align:center;color:var(--gray-400);font-size:13px;">등록된 템플릿이 없습니다</div>' : ''}
        </div>

        <!-- 특별알림 -->
        <div>
          <div style="font-size:12px;font-weight:700;color:#db2777;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
            <span style="width:16px;height:2px;background:#db2777;border-radius:1px;"></span>
            특별알림 (${specialTemplates.length}종)
          </div>
          ${specialTemplates.map(t => this._renderTemplateRow(t, '#db2777')).join('')}
          ${specialTemplates.length === 0 ? '<div style="padding:12px;text-align:center;color:var(--gray-400);font-size:13px;">등록된 템플릿이 없습니다</div>' : ''}
        </div>
      </div>
    `;
  },

  _renderTemplateRow(t, color) {
    const preview = (t.content || '').substring(0, 60).replace(/\n/g, ' ');
    const vars = (t.variables || []);
    return `
      <div style="display:flex;align-items:center;gap:12px;padding:14px;border:1px solid var(--gray-100);border-radius:12px;margin-bottom:8px;transition:all 0.2s;cursor:pointer;" onclick="SettingsPage.editTemplate(${t.id})" onmouseover="this.style.borderColor='${color}40';this.style.background='${color}05'" onmouseout="this.style.borderColor='var(--gray-100)';this.style.background=''">
        <div style="width:40px;height:40px;border-radius:10px;background:${color}10;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <span style="font-size:11px;font-weight:700;color:${color};">${Utils.escapeHtml(t.type ? t.type[0] : '?')}</span>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:14px;font-weight:600;color:var(--gray-800);">${Utils.escapeHtml(t.title || t.type)}</span>
            <span style="padding:2px 6px;border-radius:4px;background:${color}10;color:${color};font-size:10px;font-weight:600;">${Utils.escapeHtml(t.type)}</span>
          </div>
          <div style="font-size:12px;color:var(--gray-400);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${Utils.escapeHtml(preview)}...</div>
          <div style="display:flex;gap:4px;margin-top:6px;flex-wrap:wrap;">
            ${vars.map(v => `<span style="padding:1px 6px;border-radius:3px;background:var(--gray-100);color:var(--gray-500);font-size:10px;">{{${Utils.escapeHtml(v)}}}</span>`).join('')}
          </div>
        </div>
        <div style="display:flex;gap:4px;flex-shrink:0;" onclick="event.stopPropagation();">
          <button class="btn btn-sm" onclick="SettingsPage.editTemplate(${t.id})" style="border-radius:6px;border:1px solid var(--gray-200);background:white;color:var(--gray-500);padding:4px 10px;font-size:11px;">수정</button>
          ${!t.is_default ? `<button class="btn btn-sm" onclick="SettingsPage.deleteTemplate(${t.id})" style="border-radius:6px;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;padding:4px 8px;font-size:11px;">삭제</button>` : ''}
        </div>
      </div>
    `;
  },

  addTemplate() {
    Modal.show('새 템플릿 추가', `
      <form id="add-template-form">
        <div class="grid-2" style="gap:12px;">
          <div class="form-group">
            <label class="form-label" style="font-size:12px;">카테고리</label>
            <select class="form-input" name="category" style="border-radius:10px;">
              <option value="메시지안내">안내 항목</option>
              <option value="알림톡">상담 알림톡</option>
              <option value="특별알림">특별알림</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" style="font-size:12px;">유형명</label>
            <input type="text" class="form-input" name="type" placeholder="예: 생일축하" style="border-radius:10px;">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" style="font-size:12px;">제목</label>
          <input type="text" class="form-input" name="title" placeholder="템플릿 제목" style="border-radius:10px;">
        </div>
        <div class="form-group">
          <label class="form-label" style="font-size:12px;">내용</label>
          <textarea class="form-input" name="content" rows="10" placeholder="메시지 내용을 입력하세요. {{고객명}} 같은 변수를 사용할 수 있습니다." style="border-radius:10px;font-size:13px;line-height:1.8;"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label" style="font-size:12px;">사용 변수 (쉼표 구분)</label>
          <input type="text" class="form-input" name="variables" placeholder="고객명, 설계사명, 설계사연락처" style="border-radius:10px;">
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()" style="border-radius:8px;">취소</button>
      <button class="btn btn-primary" onclick="SettingsPage.saveNewTemplate()" style="border-radius:8px;background:linear-gradient(135deg,#059669,#10b981);border:none;">추가</button>
    `);
  },

  async saveNewTemplate() {
    const form = document.getElementById('add-template-form');
    const fd = new FormData(form);
    const variables = (fd.get('variables') || '').split(',').map(v => v.trim()).filter(v => v);
    try {
      await API.createTemplate({
        category: fd.get('category'),
        type: fd.get('type'),
        title: fd.get('title'),
        content: fd.get('content'),
        variables
      });
      Modal.close();
      showToast('템플릿이 추가되었습니다.', 'success');
      const d = await API.getTemplates({});
      this._templates = d.templates;
      document.getElementById('settings-content').innerHTML = this._renderTemplates();
    } catch (err) { showToast(err.message, 'error'); }
  },

  editTemplate(id) {
    const t = this._templates.find(tpl => tpl.id === id);
    if (!t) return;
    Modal.show('템플릿 수정', `
      <form id="edit-template-form">
        <div style="padding:10px 14px;background:var(--gray-50);border-radius:10px;margin-bottom:16px;">
          <div style="font-size:11px;font-weight:700;color:var(--gray-400);text-transform:uppercase;letter-spacing:1px;">${Utils.escapeHtml(t.category)} · ${Utils.escapeHtml(t.type)}</div>
        </div>
        <div class="form-group">
          <label class="form-label" style="font-size:12px;">제목</label>
          <input type="text" class="form-input" name="title" value="${Utils.escapeHtml(t.title || '')}" style="border-radius:10px;">
        </div>
        <div class="form-group">
          <label class="form-label" style="font-size:12px;">내용</label>
          <textarea class="form-input" name="content" rows="12" style="border-radius:10px;font-size:13px;line-height:1.8;">${Utils.escapeHtml(t.content || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label" style="font-size:12px;">사용 변수 (쉼표 구분)</label>
          <input type="text" class="form-input" name="variables" value="${(t.variables || []).join(', ')}" style="border-radius:10px;">
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()" style="border-radius:8px;">취소</button>
      <button class="btn btn-primary" onclick="SettingsPage.updateTemplate(${id})" style="border-radius:8px;background:linear-gradient(135deg,#059669,#10b981);border:none;">저장</button>
    `);
  },

  async updateTemplate(id) {
    const form = document.getElementById('edit-template-form');
    const fd = new FormData(form);
    const variables = (fd.get('variables') || '').split(',').map(v => v.trim()).filter(v => v);
    try {
      await API.updateTemplate(id, { title: fd.get('title'), content: fd.get('content'), variables });
      Modal.close();
      showToast('템플릿이 수정되었습니다.', 'success');
      const d = await API.getTemplates({});
      this._templates = d.templates;
      document.getElementById('settings-content').innerHTML = this._renderTemplates();
    } catch (err) { showToast(err.message, 'error'); }
  },

  async deleteTemplate(id) {
    Modal.confirm('이 템플릿을 삭제하시겠습니까?', async () => {
      try {
        await API.deleteTemplate(id);
        showToast('삭제되었습니다.', 'success');
        const d = await API.getTemplates({});
        this._templates = d.templates;
        document.getElementById('settings-content').innerHTML = this._renderTemplates();
      } catch (err) { showToast(err.message, 'error'); }
    });
  },

  // ==================== 4. Check Items ====================
  _renderCheckItems() {
    const groups = {};
    this._checkItems.forEach(i => {
      if (!groups[i.category]) groups[i.category] = [];
      groups[i.category].push(i);
    });

    const categoryColors = {
      '진단': '#db2777', '수술': '#0891b2', '입원': '#7c3aed', '후유장해': '#ea580c',
      '실손': '#3b82f6', '사망': '#dc2626', '기타': '#64748b'
    };

    return `
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
        <div class="card-header" style="margin-bottom:16px;">
          <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:8px;">
              <svg width="14" height="14" fill="none" stroke="#d97706" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </span>
            보장 점검항목 관리
          </h3>
          <button class="btn btn-sm" onclick="SettingsPage.addCheckItem()" style="background:linear-gradient(135deg,#d97706,#f59e0b);color:white;border:none;border-radius:8px;padding:6px 14px;font-weight:600;">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
            항목 추가
          </button>
        </div>
        <p style="font-size:13px;color:var(--gray-400);margin-bottom:16px;">보장 분석 시 사용할 담보 항목을 카테고리별로 관리합니다. 설계사가 자유롭게 추가/수정/삭제할 수 있습니다.</p>

        ${Object.entries(groups).map(([category, items]) => {
          const color = categoryColors[category] || '#64748b';
          return `
            <div style="margin-bottom:16px;">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <span style="width:6px;height:6px;border-radius:50%;background:${color};"></span>
                <span style="font-size:13px;font-weight:700;color:${color};">${Utils.escapeHtml(category)}</span>
                <span style="font-size:11px;color:var(--gray-400);">(${items.length})</span>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;">
                ${items.map(item => `
                  <div style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:${color}08;border:1px solid ${color}20;border-radius:8px;font-size:13px;color:var(--gray-700);transition:all 0.2s;" onmouseover="this.style.borderColor='${color}50'" onmouseout="this.style.borderColor='${color}20'">
                    ${Utils.escapeHtml(item.item_name)}
                    <button onclick="SettingsPage.editCheckItem(${item.id},'${Utils.escapeHtml(item.category)}','${Utils.escapeHtml(item.item_name)}')" style="background:none;border:none;cursor:pointer;color:var(--gray-400);font-size:11px;padding:0;" title="수정">✏️</button>
                    <button onclick="SettingsPage.deleteCheckItem(${item.id})" style="background:none;border:none;cursor:pointer;color:#dc2626;font-size:11px;padding:0;" title="삭제">✕</button>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}

        ${Object.keys(groups).length === 0 ? '<div style="padding:20px;text-align:center;color:var(--gray-400);font-size:13px;">등록된 점검항목이 없습니다</div>' : ''}
      </div>
    `;
  },

  addCheckItem() {
    const existingCats = [...new Set(this._checkItems.map(i => i.category))];
    Modal.show('점검항목 추가', `
      <form id="add-checkitem-form">
        <div class="form-group">
          <label class="form-label" style="font-size:12px;">카테고리</label>
          <input type="text" class="form-input" name="category" placeholder="예: 진단, 수술, 입원" list="cat-list" style="border-radius:10px;">
          <datalist id="cat-list">${existingCats.map(c => `<option value="${Utils.escapeHtml(c)}">`).join('')}</datalist>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;">${existingCats.map(c => `<span onclick="document.querySelector('#add-checkitem-form [name=category]').value='${Utils.escapeHtml(c)}'" style="padding:2px 8px;border-radius:4px;background:var(--gray-100);color:var(--gray-500);font-size:11px;cursor:pointer;">${Utils.escapeHtml(c)}</span>`).join('')}</div>
        </div>
        <div class="form-group">
          <label class="form-label" style="font-size:12px;">항목명</label>
          <input type="text" class="form-input" name="item_name" placeholder="예: 암진단, 뇌졸중" style="border-radius:10px;">
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()" style="border-radius:8px;">취소</button>
      <button class="btn btn-primary" onclick="SettingsPage.saveCheckItem()" style="border-radius:8px;background:linear-gradient(135deg,#d97706,#f59e0b);border:none;">추가</button>
    `);
  },

  async saveCheckItem() {
    const form = document.getElementById('add-checkitem-form');
    const fd = new FormData(form);
    try {
      await API.createCheckItem({ category: fd.get('category'), item_name: fd.get('item_name') });
      Modal.close();
      showToast('항목이 추가되었습니다.', 'success');
      const d = await API.getCheckItems();
      this._checkItems = d.items;
      document.getElementById('settings-content').innerHTML = this._renderCheckItems();
    } catch (err) { showToast(err.message, 'error'); }
  },

  editCheckItem(id, category, itemName) {
    Modal.show('점검항목 수정', `
      <form id="edit-checkitem-form">
        <div class="form-group">
          <label class="form-label" style="font-size:12px;">카테고리</label>
          <input type="text" class="form-input" name="category" value="${Utils.escapeHtml(category)}" style="border-radius:10px;">
        </div>
        <div class="form-group">
          <label class="form-label" style="font-size:12px;">항목명</label>
          <input type="text" class="form-input" name="item_name" value="${Utils.escapeHtml(itemName)}" style="border-radius:10px;">
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()" style="border-radius:8px;">취소</button>
      <button class="btn btn-primary" onclick="SettingsPage.updateCheckItem(${id})" style="border-radius:8px;background:linear-gradient(135deg,#d97706,#f59e0b);border:none;">저장</button>
    `);
  },

  async updateCheckItem(id) {
    const form = document.getElementById('edit-checkitem-form');
    const fd = new FormData(form);
    try {
      await API.updateCheckItem(id, { category: fd.get('category'), item_name: fd.get('item_name') });
      Modal.close();
      showToast('항목이 수정되었습니다.', 'success');
      const d = await API.getCheckItems();
      this._checkItems = d.items;
      document.getElementById('settings-content').innerHTML = this._renderCheckItems();
    } catch (err) { showToast(err.message, 'error'); }
  },

  async deleteCheckItem(id) {
    Modal.confirm('이 항목을 삭제하시겠습니까?', async () => {
      try {
        await API.deleteCheckItem(id);
        showToast('삭제되었습니다.', 'success');
        const d = await API.getCheckItems();
        this._checkItems = d.items;
        document.getElementById('settings-content').innerHTML = this._renderCheckItems();
      } catch (err) { showToast(err.message, 'error'); }
    });
  },

  // ==================== 5. Info Links ====================
  _renderLinks() {
    return `
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
        <div class="card-header" style="margin-bottom:16px;">
          <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#dbeafe,#bfdbfe);border-radius:8px;">
              <svg width="14" height="14" fill="none" stroke="#2563eb" stroke-width="2" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
            </span>
            보험정보 링크 관리
          </h3>
          <button class="btn btn-sm" onclick="SettingsPage.addInfoLink()" style="background:linear-gradient(135deg,#3b82f6,#2563eb);color:white;border:none;border-radius:8px;padding:6px 14px;font-weight:600;">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
            링크 추가
          </button>
        </div>
        <p style="font-size:13px;color:var(--gray-400);margin-bottom:16px;">고객 상담 시 참고할 보험정보 바로가기 링크를 관리합니다.</p>

        ${this._infoLinks.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${this._infoLinks.map(link => `
              <div style="display:flex;align-items:center;gap:12px;padding:14px;border:1px solid var(--gray-100);border-radius:12px;transition:all 0.2s;" onmouseover="this.style.borderColor='#3b82f640'" onmouseout="this.style.borderColor='var(--gray-100)'">
                <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#eff6ff,#dbeafe);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">${link.icon || '🔗'}</div>
                <div style="flex:1;min-width:0;">
                  <div style="font-size:14px;font-weight:600;color:var(--gray-800);">${Utils.escapeHtml(link.title)}</div>
                  <div style="font-size:12px;color:#3b82f6;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${Utils.escapeHtml(link.url)}</div>
                  ${link.description ? `<div style="font-size:11px;color:var(--gray-400);margin-top:2px;">${Utils.escapeHtml(link.description)}</div>` : ''}
                </div>
                <div style="display:flex;gap:4px;flex-shrink:0;">
                  <button class="btn btn-sm" onclick='SettingsPage.editInfoLink(${JSON.stringify(link).replace(/'/g, "&apos;")})' style="border-radius:6px;border:1px solid var(--gray-200);background:white;color:var(--gray-500);padding:4px 10px;font-size:11px;">수정</button>
                  <button class="btn btn-sm" onclick="SettingsPage.deleteInfoLink(${link.id})" style="border-radius:6px;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;padding:4px 8px;font-size:11px;">삭제</button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="text-align:center;padding:30px;">
            <div style="font-size:32px;margin-bottom:8px;">🔗</div>
            <div style="font-size:14px;color:var(--gray-500);">등록된 퀵링크가 없습니다</div>
            <div style="font-size:12px;color:var(--gray-400);margin-top:4px;">자주 사용하는 보험정보 링크를 추가하세요</div>
          </div>
        `}
      </div>
    `;
  },

  addInfoLink() {
    Modal.show('퀵링크 추가', `
      <form id="add-link-form">
        <div class="form-group"><label class="form-label" style="font-size:12px;">제목</label><input type="text" class="form-input" name="title" placeholder="예: 보험료 계산기" style="border-radius:10px;"></div>
        <div class="form-group"><label class="form-label" style="font-size:12px;">URL</label><input type="url" class="form-input" name="url" placeholder="https://..." style="border-radius:10px;"></div>
        <div class="grid-2" style="gap:12px;">
          <div class="form-group"><label class="form-label" style="font-size:12px;">아이콘 (이모지)</label><input type="text" class="form-input" name="icon" value="🔗" maxlength="4" style="border-radius:10px;"></div>
          <div class="form-group"><label class="form-label" style="font-size:12px;">설명</label><input type="text" class="form-input" name="description" placeholder="간단한 설명" style="border-radius:10px;"></div>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()" style="border-radius:8px;">취소</button>
      <button class="btn btn-primary" onclick="SettingsPage.saveInfoLink()" style="border-radius:8px;background:linear-gradient(135deg,#3b82f6,#2563eb);border:none;">추가</button>
    `);
  },

  async saveInfoLink() {
    const form = document.getElementById('add-link-form');
    const fd = new FormData(form);
    const data = {};
    fd.forEach((v, k) => { if (v) data[k] = v; });
    try {
      await API.createInfoLink(data);
      Modal.close();
      showToast('퀵링크가 추가되었습니다.', 'success');
      const d = await API.getInfoLinks();
      this._infoLinks = d.links;
      document.getElementById('settings-content').innerHTML = this._renderLinks();
    } catch (err) { showToast(err.message, 'error'); }
  },

  editInfoLink(link) {
    Modal.show('퀵링크 수정', `
      <form id="edit-link-form">
        <div class="form-group"><label class="form-label" style="font-size:12px;">제목</label><input type="text" class="form-input" name="title" value="${Utils.escapeHtml(link.title)}" style="border-radius:10px;"></div>
        <div class="form-group"><label class="form-label" style="font-size:12px;">URL</label><input type="url" class="form-input" name="url" value="${Utils.escapeHtml(link.url)}" style="border-radius:10px;"></div>
        <div class="grid-2" style="gap:12px;">
          <div class="form-group"><label class="form-label" style="font-size:12px;">아이콘</label><input type="text" class="form-input" name="icon" value="${link.icon || '🔗'}" maxlength="4" style="border-radius:10px;"></div>
          <div class="form-group"><label class="form-label" style="font-size:12px;">설명</label><input type="text" class="form-input" name="description" value="${Utils.escapeHtml(link.description || '')}" style="border-radius:10px;"></div>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()" style="border-radius:8px;">취소</button>
      <button class="btn btn-primary" onclick="SettingsPage.updateInfoLink(${link.id})" style="border-radius:8px;background:linear-gradient(135deg,#3b82f6,#2563eb);border:none;">저장</button>
    `);
  },

  async updateInfoLink(id) {
    const form = document.getElementById('edit-link-form');
    const fd = new FormData(form);
    const data = {};
    fd.forEach((v, k) => { data[k] = v || null; });
    try {
      await API.updateInfoLink(id, data);
      Modal.close();
      showToast('수정되었습니다.', 'success');
      const d = await API.getInfoLinks();
      this._infoLinks = d.links;
      document.getElementById('settings-content').innerHTML = this._renderLinks();
    } catch (err) { showToast(err.message, 'error'); }
  },

  async deleteInfoLink(id) {
    Modal.confirm('이 퀵링크를 삭제하시겠습니까?', async () => {
      try {
        await API.deleteInfoLink(id);
        showToast('삭제되었습니다.', 'success');
        const d = await API.getInfoLinks();
        this._infoLinks = d.links;
        document.getElementById('settings-content').innerHTML = this._renderLinks();
      } catch (err) { showToast(err.message, 'error'); }
    });
  },

  // ==================== 6. System Settings ====================
  _renderSystem() {
    const s = this._settings || {};
    return `
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
        <div class="card-header" style="margin-bottom:20px;">
          <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#f3f4f6,#e5e7eb);border-radius:8px;">
              <svg width="14" height="14" fill="none" stroke="#64748b" stroke-width="2" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </span>
            시스템 설정
          </h3>
        </div>
        <form id="system-form">
          <input type="hidden" name="company_name" value="${Utils.escapeHtml(s.company_name || '')}">
          <input type="hidden" name="greeting_name" value="${Utils.escapeHtml(s.greeting_name || '')}">
          <input type="hidden" name="survey_intro" value="${Utils.escapeHtml(s.survey_intro || '')}">

          <div style="border-top:1px solid var(--gray-100);margin:20px 0;padding-top:20px;">
            <h4 style="display:flex;align-items:center;gap:8px;margin-bottom:16px;font-size:14px;color:var(--gray-700);">
              <span style="font-size:18px;">📋</span> 연락 정보 설정
            </h4>
            <div class="grid-2" style="gap:14px;">
              <div class="form-group"><label class="form-label" style="font-size:12px;">팩스번호</label><input type="text" class="form-input" name="fax_number" value="${Utils.escapeHtml(s.fax_number || '')}" placeholder="0504-137-1591" style="border-radius:10px;"></div>
              <div class="form-group"><label class="form-label" style="font-size:12px;">온라인 명함 링크</label><input type="url" class="form-input" name="online_reservation_url" value="${Utils.escapeHtml(s.online_reservation_url || '')}" placeholder="https://..." style="border-radius:10px;"></div>
            </div>
            <div class="form-group"><label class="form-label" style="font-size:12px;">카카오톡 상담 링크</label><input type="url" class="form-input" name="kakao_talk_url" value="${Utils.escapeHtml(s.kakao_talk_url || '')}" placeholder="https://pf.kakao.com/..." style="border-radius:10px;"></div>
          </div>

          <div style="border-top:1px solid var(--gray-100);margin:20px 0;padding-top:20px;">
            <h4 style="display:flex;align-items:center;gap:8px;margin-bottom:16px;font-size:14px;color:var(--gray-700);">
              <span style="font-size:18px;">📄</span> 제안서 레이아웃
            </h4>
            <input type="hidden" name="proposal_layout" id="proposal-layout-input" value="${s.proposal_layout || 'photo'}">
            <div style="display:flex;gap:12px;">
              <div onclick="SettingsPage.selectLayout('photo')" id="layout-card-photo" style="flex:1;cursor:pointer;border:2px solid ${(s.proposal_layout || 'photo') === 'photo' ? '#6366f1' : '#e2e8f0'};border-radius:12px;padding:14px;text-align:center;transition:all 0.2s;">
                <div style="width:100%;height:80px;background:linear-gradient(135deg,#0f172a,#312e81);border-radius:8px;margin-bottom:10px;display:flex;align-items:flex-end;justify-content:center;overflow:hidden;position:relative;">
                  <div style="width:40px;height:50px;background:linear-gradient(135deg,#6366f1,#818cf8);border-radius:6px 6px 0 0;opacity:0.6;"></div>
                  <div style="position:absolute;bottom:0;left:0;right:0;height:30px;background:linear-gradient(transparent,rgba(15,23,42,0.9));"></div>
                  <div style="position:absolute;bottom:6px;left:0;right:0;text-align:center;">
                    <div style="font-size:8px;color:white;font-weight:700;">이름</div>
                  </div>
                </div>
                <div style="font-size:12px;font-weight:600;color:${(s.proposal_layout || 'photo') === 'photo' ? '#6366f1' : '#64748b'};">배경 사진</div>
              </div>
              <div onclick="SettingsPage.selectLayout('circle')" id="layout-card-circle" style="flex:1;cursor:pointer;border:2px solid ${s.proposal_layout === 'circle' ? '#6366f1' : '#e2e8f0'};border-radius:12px;padding:14px;text-align:center;transition:all 0.2s;">
                <div style="width:100%;height:80px;background:linear-gradient(135deg,#0f172a,#312e81);border-radius:8px;margin-bottom:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;">
                  <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#818cf8);border:2px solid rgba(255,255,255,0.2);"></div>
                  <div style="font-size:8px;color:white;font-weight:700;">이름</div>
                </div>
                <div style="font-size:12px;font-weight:600;color:${s.proposal_layout === 'circle' ? '#6366f1' : '#64748b'};">동그라미 프로필</div>
              </div>
            </div>
          </div>

          <div style="border-top:1px solid var(--gray-100);margin:20px 0;padding-top:20px;">
            <h4 style="display:flex;align-items:center;gap:8px;margin-bottom:16px;font-size:14px;color:var(--gray-700);">
              <span style="font-size:18px;">💬</span> 카카오 알림톡 설정 (NHN Cloud)
            </h4>
            <div class="form-group"><label class="form-label" style="font-size:12px;">카카오 채널 ID</label><input type="text" class="form-input" name="kakao_channel_id" value="${Utils.escapeHtml(s.kakao_channel_id || '')}" placeholder="@채널ID" style="border-radius:10px;"></div>
            <div class="grid-2" style="gap:14px;">
              <div class="form-group"><label class="form-label" style="font-size:12px;">NHN App Key</label><input type="text" class="form-input" name="nhn_app_key" value="${Utils.escapeHtml(s.nhn_app_key || '')}" style="border-radius:10px;"></div>
              <div class="form-group"><label class="form-label" style="font-size:12px;">NHN Secret Key</label><input type="password" class="form-input" name="nhn_secret_key" value="${Utils.escapeHtml(s.nhn_secret_key || '')}" style="border-radius:10px;"></div>
            </div>
            <div class="form-group"><label class="form-label" style="font-size:12px;">NHN Sender Key</label><input type="text" class="form-input" name="nhn_sender_key" value="${Utils.escapeHtml(s.nhn_sender_key || '')}" style="border-radius:10px;"></div>
          </div>

          <button type="button" class="btn" onclick="SettingsPage.saveSystem()" style="background:linear-gradient(135deg,#64748b,#475569);color:white;border:none;border-radius:10px;padding:12px 24px;font-weight:600;">저장</button>
        </form>
      </div>
    `;
  },

  selectLayout(value) {
    document.getElementById('proposal-layout-input').value = value;
    const isPhoto = value === 'photo';
    document.getElementById('layout-card-photo').style.borderColor = isPhoto ? '#6366f1' : '#e2e8f0';
    document.getElementById('layout-card-circle').style.borderColor = !isPhoto ? '#6366f1' : '#e2e8f0';
    document.querySelector('#layout-card-photo > div:last-child').style.color = isPhoto ? '#6366f1' : '#64748b';
    document.querySelector('#layout-card-circle > div:last-child').style.color = !isPhoto ? '#6366f1' : '#64748b';
  },

  async saveSystem() {
    const form = document.getElementById('system-form');
    const fd = new FormData(form);
    const data = {};
    fd.forEach((v, k) => { data[k] = v || null; });
    try {
      await API.updateSettings(data);
      showToast('시스템 설정이 저장되었습니다.', 'success');
    } catch (err) { showToast(err.message, 'error'); }
  },

  // ==================== 7. Password ====================
  _renderPassword() {
    return `
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;max-width:500px;">
        <div class="card-header" style="margin-bottom:20px;">
          <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#fee2e2,#fecaca);border-radius:8px;">
              <svg width="14" height="14" fill="none" stroke="#dc2626" stroke-width="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </span>
            비밀번호 변경
          </h3>
        </div>
        <form id="password-form">
          <div class="form-group"><label class="form-label" style="font-size:12px;">현재 비밀번호</label><input type="password" class="form-input" name="current_password" required style="border-radius:10px;"></div>
          <div class="form-group"><label class="form-label" style="font-size:12px;">새 비밀번호</label><input type="password" class="form-input" name="new_password" required style="border-radius:10px;"></div>
          <div class="form-group"><label class="form-label" style="font-size:12px;">새 비밀번호 확인</label><input type="password" class="form-input" name="confirm_password" required style="border-radius:10px;"></div>
          <button type="button" class="btn" onclick="SettingsPage.changePassword()" style="background:linear-gradient(135deg,#dc2626,#ef4444);color:white;border:none;border-radius:10px;padding:12px 24px;font-weight:600;">변경</button>
        </form>
      </div>
    `;
  },

  async changePassword() {
    const form = document.getElementById('password-form');
    const fd = new FormData(form);
    const current = fd.get('current_password');
    const newPw = fd.get('new_password');
    const confirm = fd.get('confirm_password');
    if (newPw !== confirm) { showToast('새 비밀번호가 일치하지 않습니다.', 'error'); return; }
    try {
      await API.changePassword({ current_password: current, new_password: newPw });
      showToast('비밀번호가 변경되었습니다.', 'success');
      form.reset();
    } catch (err) { showToast(err.message, 'error'); }
  }
};
