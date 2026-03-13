// Sidebar Component - Dynamic menu from settings
const Sidebar = {
  defaultMenuItems: [
    { id: 'dashboard', icon: '🏠', label: '홈 (대시보드)' },
    { id: 'consultation', icon: '📋', label: '온라인 보험상담' },
    { id: 'messages', icon: '💬', label: '고객 메세지 안내' },
    { id: 'alimtalk', icon: '📱', label: '상담진행 알림톡' },
    { id: 'coverage', icon: '🛡️', label: '보장 간편보기' },
    { id: 'settings', icon: '⚙️', label: '설정' }
  ],

  getMenuItems() {
    const stored = localStorage.getItem('prime_menu_settings');
    if (!stored) return this.defaultMenuItems;

    try {
      const { menu_order, menu_labels } = JSON.parse(stored);
      let items = [...this.defaultMenuItems];

      // Apply custom labels
      if (menu_labels && typeof menu_labels === 'object') {
        items = items.map(item => ({
          ...item,
          label: menu_labels[item.id] || item.label
        }));
      }

      // Apply custom order
      if (menu_order && Array.isArray(menu_order) && menu_order.length > 0) {
        const ordered = [];
        menu_order.forEach(id => {
          const item = items.find(i => i.id === id);
          if (item) ordered.push(item);
        });
        // Add any items not in order list
        items.forEach(item => {
          if (!ordered.find(o => o.id === item.id)) ordered.push(item);
        });
        items = ordered;
      }

      return items;
    } catch (e) {
      return this.defaultMenuItems;
    }
  },

  // Save menu settings to localStorage (called after settings API update)
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
      <button class="mobile-menu-btn" onclick="Sidebar.toggle()">☰</button>
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">PRIME <span>ASSET</span></div>
          <div class="sidebar-subtitle">보험상담 전산 시스템</div>
        </div>
        <nav class="sidebar-nav">
          ${menuItems.map(item => `
            <a class="nav-item ${currentPage === item.id ? 'active' : ''}"
               onclick="App.navigate('${item.id}'); Sidebar.close();">
              <span class="nav-item-icon">${item.icon}</span>
              ${Utils.escapeHtml(item.label)}
            </a>
          `).join('')}
        </nav>
        <div class="sidebar-footer">
          <div class="sidebar-user">
            <div class="sidebar-user-avatar">${initial}</div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">${Utils.escapeHtml(agentName)}</div>
              <div class="sidebar-user-role">${Utils.escapeHtml(agentPosition)}</div>
            </div>
            <button onclick="App.logout()" title="로그아웃" style="background:none;border:none;color:rgba(255,255,255,0.5);cursor:pointer;font-size:16px;">⬅</button>
          </div>
        </div>
      </aside>
    `;
  },

  toggle() {
    document.getElementById('sidebar')?.classList.toggle('open');
  },

  close() {
    document.getElementById('sidebar')?.classList.remove('open');
  }
};
