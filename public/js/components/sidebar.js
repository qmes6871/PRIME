// Top Navigation Bar Component (Insure Elevate Style)
const Sidebar = {
  // Lucide SVG icons
  icons: {
    dashboard: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
    customers: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    consultation: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
    messages: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
    alimtalk: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    infopage: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
    coverage: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
    settings: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
    admin: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.354a4 4 0 1 1 0 5.292M15 21H3v-1a6 6 0 0 1 12 0v1zm0 0h6v-1a6 6 0 0 0-9-5.197M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/></svg>',
    logout: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',
    menu: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
    close: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
  },

  defaultMenuItems: [
    { id: 'dashboard', icon: 'dashboard', label: '대시보드' },
    { id: 'customers', icon: 'customers', label: '고객목록' },
    { id: 'consultation', icon: 'consultation', label: '제안서 작성' },
    { id: 'messages', icon: 'messages', label: '상담 알림톡' },
    { id: 'infopage', icon: 'infopage', label: '보험 정보' },
    { id: 'settings', icon: 'settings', label: '설정' }
  ],

  getMenuItems() {
    const stored = localStorage.getItem('prime_menu_settings');
    if (!stored) return this.defaultMenuItems;

    try {
      const { menu_order, menu_labels } = JSON.parse(stored);
      let items = [...this.defaultMenuItems];

      if (menu_labels && typeof menu_labels === 'object') {
        items = items.map(item => ({
          ...item,
          label: menu_labels[item.id] || item.label
        }));
      }

      if (menu_order && Array.isArray(menu_order) && menu_order.length > 0) {
        const ordered = [];
        menu_order.forEach(id => {
          const item = items.find(i => i.id === id);
          if (item) ordered.push(item);
        });
        items.forEach(item => {
          if (!ordered.find(o => o.id === item.id)) ordered.push(item);
        });
        items = ordered;
      }

      return this._appendAdminMenu(items);
    } catch (e) {
      return this._appendAdminMenu(this.defaultMenuItems);
    }
  },

  _appendAdminMenu(items) {
    const agent = API.getAgent();
    if (agent?.is_admin && !items.find(i => i.id === 'admin')) {
      return [...items, { id: 'admin', icon: 'admin', label: '관리자' }];
    }
    return items;
  },

  saveMenuSettings(menuOrder, menuLabels) {
    localStorage.setItem('prime_menu_settings', JSON.stringify({
      menu_order: menuOrder,
      menu_labels: menuLabels
    }));
  },

  render(currentPage) {
    const agent = API.getAgent();
    const agentName = agent ? agent.name : '';
    const agentPosition = agent ? agent.position : '';
    const initial = agentName ? agentName.charAt(0) : 'P';
    const menuItems = this.getMenuItems();

    return `
      <nav class="top-nav">
        <div class="top-nav-inner">
          <div class="top-nav-logo" onclick="App.navigate('dashboard')">PRIME<span>ASSET</span></div>
          <a href="/prime/229/" target="_blank" class="nav-link-229">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            299 업적판
          </a>

          <div class="top-nav-menu">
            ${menuItems.map(item => `
              <a class="nav-item ${currentPage === item.id ? 'active' : ''}"
                 onclick="App.navigate('${item.id}'); Sidebar.close();">
                <span class="nav-item-icon">${this.icons[item.icon] || this.icons[item.id] || ''}</span>
                <span class="nav-label">${Utils.escapeHtml(item.label)}</span>
              </a>
            `).join('')}
          </div>

          <div class="top-nav-right">
            <div class="top-nav-user">
              <div class="top-nav-avatar">${initial}</div>
              <div>
                <div class="top-nav-user-name">${Utils.escapeHtml(agentName)}</div>
                <div class="top-nav-user-role">${Utils.escapeHtml(agentPosition)}</div>
              </div>
            </div>
            <button class="top-nav-logout" onclick="App.logout()" title="로그아웃">
              ${this.icons.logout} 로그아웃
            </button>
            <button class="mobile-menu-btn" onclick="Sidebar.toggle()">
              ${this.icons.menu}
            </button>
          </div>
        </div>
      </nav>

      <!-- Mobile drawer -->
      <div class="mobile-nav-overlay" id="mobile-nav-overlay" onclick="Sidebar.close()"></div>
      <div class="mobile-nav-drawer" id="mobile-nav-drawer">
        <div class="mobile-nav-header">
          <div style="font-size:18px;font-weight:800;color:var(--foreground);">PRIME<span style="color:var(--primary)">ASSET</span></div>
          <button onclick="Sidebar.close()" style="background:var(--muted);border:none;border-radius:8px;padding:6px;cursor:pointer;display:flex;align-items:center;color:var(--muted-foreground);">${this.icons.close}</button>
        </div>
        <div class="mobile-nav-items">
          ${menuItems.map(item => `
            <a class="nav-item ${currentPage === item.id ? 'active' : ''}"
               onclick="App.navigate('${item.id}'); Sidebar.close();">
              <span class="nav-item-icon">${this.icons[item.icon] || this.icons[item.id] || ''}</span>
              ${Utils.escapeHtml(item.label)}
            </a>
          `).join('')}
        </div>
        <div class="mobile-nav-footer">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <div class="top-nav-avatar">${initial}</div>
            <div>
              <div style="font-size:13px;font-weight:600;color:var(--foreground);">${Utils.escapeHtml(agentName)}</div>
              <div style="font-size:11px;color:var(--muted-foreground);">${Utils.escapeHtml(agentPosition)}</div>
            </div>
          </div>
          <button class="btn btn-secondary" style="width:100%;justify-content:center;" onclick="App.logout()">
            ${this.icons.logout} 로그아웃
          </button>
        </div>
      </div>
    `;
  },

  toggle() {
    document.getElementById('mobile-nav-overlay')?.classList.toggle('open');
    document.getElementById('mobile-nav-drawer')?.classList.toggle('open');
  },

  close() {
    document.getElementById('mobile-nav-overlay')?.classList.remove('open');
    document.getElementById('mobile-nav-drawer')?.classList.remove('open');
  }
};
