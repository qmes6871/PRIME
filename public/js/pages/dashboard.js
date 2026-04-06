// Dashboard Page
const DashboardPage = {
  _dashData: null,

  async render() {
    try {
      const data = await API.getDashboard();
      this._dashData = data;
      const { summary, alerts, recentCustomers } = data;
      const sc = summary.statusCounts;

      // 생일/상령일 미리보기 (최대 3명)
      const bdPreview = alerts.birthdays.slice(0, 3);
      const anPreview = alerts.anniversaries.slice(0, 3);

      return `
        <div class="page-header">
          <div>
            <h1 class="page-title">대시보드</h1>
            <p class="page-subtitle">${new Date().toLocaleDateString('ko-KR', {year:'numeric',month:'long',day:'numeric',weekday:'long'})}</p>
          </div>
        </div>

        <!-- 상단 요약 카드 4개: 생일 / 상령일 / 전체고객 / 진행중 -->
        <div class="summary-cards">
          <div class="summary-card yellow" style="cursor:pointer;" onclick="DashboardPage.showAlertModal('birthday')">
            <div class="summary-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg>
            </div>
            <div class="summary-card-label">생일 알림</div>
            <div class="summary-card-value">${alerts.birthdays.length}<span style="font-size:14px;font-weight:500;color:var(--muted-foreground);margin-left:2px;">명</span></div>
            <div class="summary-card-sub">${bdPreview.map(c => c.name).join(', ') || '30일 이내 없음'}</div>
          </div>
          <div class="summary-card red" style="cursor:pointer;" onclick="DashboardPage.showAlertModal('anniversary')">
            <div class="summary-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
            </div>
            <div class="summary-card-label">상령일 알림</div>
            <div class="summary-card-value">${alerts.anniversaries.length}<span style="font-size:14px;font-weight:500;color:var(--muted-foreground);margin-left:2px;">명</span></div>
            <div class="summary-card-sub">${anPreview.map(c => c.name).join(', ') || '30일 이내 없음'}</div>
          </div>
          <div class="summary-card blue" style="cursor:pointer;" onclick="App.navigate('customers')">
            <div class="summary-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="summary-card-label">전체 고객</div>
            <div class="summary-card-value">${summary.totalCustomers}</div>
            <div class="summary-card-sub">상담전 ${sc['상담전'] || 0} · 상담중 ${sc['상담중'] || 0} · 완료 ${sc['상담완료'] || 0}</div>
          </div>
          <div class="summary-card green">
            <div class="summary-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
            </div>
            <div class="summary-card-label">진행중 상담</div>
            <div class="summary-card-value">${sc['상담중'] || 0}</div>
            <div class="summary-card-sub">전체 ${summary.totalCustomers}명</div>
          </div>
        </div>

        <!-- 최근 고객 + 사이드바 -->
        <div class="dashboard-grid">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">최근 고객</h3>
              <div style="display:flex;gap:8px;">
                <button class="btn btn-secondary btn-sm" onclick="App.navigate('customers')">전체 보기</button>
                <button class="btn btn-primary btn-sm" onclick="DashboardPage.showAddCustomer()">+ 고객 등록</button>
              </div>
            </div>
            <div id="dash-recent-list">
              ${this._renderRecentList(recentCustomers)}
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:16px;">
            <!-- 상담 현황 -->
            <div class="card" style="padding:18px;">
              <h4 style="font-size:14px;font-weight:700;color:var(--gray-800);margin-bottom:14px;">상담 현황</h4>
              ${[
                { label: '상담 전', count: sc['상담전'] || 0, color: '#f59e0b', bg: '#fef3c7' },
                { label: '상담 중', count: sc['상담중'] || 0, color: '#f97316', bg: '#ffedd5' },
                { label: '상담 완료', count: sc['상담완료'] || 0, color: '#22c55e', bg: '#dcfce7' }
              ].map(s => `
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                  <div style="width:8px;height:8px;border-radius:50%;background:${s.color};flex-shrink:0;"></div>
                  <span style="flex:1;font-size:13px;color:var(--gray-600);">${s.label}</span>
                  <div style="background:${s.bg};color:${s.color};padding:2px 10px;border-radius:12px;font-size:12px;font-weight:700;">${s.count}명</div>
                </div>
              `).join('')}
            </div>

            <!-- 빠른 제안서 생성 -->
            <div style="background:linear-gradient(135deg,#4f46e5,#6366f1);border-radius:14px;padding:22px 20px;color:white;cursor:pointer;" onclick="DashboardPage.quickProposal()">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <div style="width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;">
                  <svg width="16" height="16" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <span style="font-size:15px;font-weight:700;">빠른 제안서 생성</span>
              </div>
              <p style="font-size:12px;color:rgba(255,255,255,0.8);line-height:1.5;margin-bottom:14px;">고객 정보 입력 후 실시간으로 프라임형 제안서를 만드세요.</p>
              <div style="background:rgba(255,255,255,0.95);color:#4f46e5;text-align:center;padding:10px;border-radius:10px;font-size:13px;font-weight:700;">지금 시작하기</div>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      showToast(err.message, 'error');
      return '<div class="empty-state"><div class="empty-state-text">데이터를 불러오는 중 오류가 발생했습니다.</div></div>';
    }
  },

  // 컴팩트 최근 고객 리스트 (바로가기 포함)
  _renderRecentList(customers) {
    if (!customers || customers.length === 0) {
      return '<div class="empty-state" style="padding:20px;"><div class="empty-state-text">등록된 고객이 없습니다</div></div>';
    }
    return customers.map(c => `
      <div class="dashboard-recent-item">
        <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#4338ca;flex-shrink:0;">${Utils.escapeHtml((c.name||'?')[0])}</div>
        <div class="dashboard-recent-item-info">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <strong style="font-size:13px;cursor:pointer;color:var(--blue);" onclick="DashboardPage.showCustomerDetail(${c.id})">${Utils.escapeHtml(c.name)}</strong>
            <span class="status-badge ${Utils.getStatusClass(c.status)}" style="font-size:10px;padding:1px 6px;cursor:pointer;" onclick="DashboardPage.cycleStatus(${c.id}, '${c.status}')">${c.status}</span>
          </div>
          <div style="font-size:11px;color:var(--gray-400);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${Utils.formatPhone(c.phone)} ${c.birth_date ? '· ' + Utils.formatDate(c.birth_date) : ''}${c.address ? ' · ' + (c.address.split('|')[0].match(/^.*?[시군구]/)?.[0] || '') : ''}${c.consult_date ? ' · <span style="color:#6366f1;">' + Utils.escapeHtml(c.consult_date) + '</span>' : ''}</div>
        </div>
        <div class="dashboard-recent-item-actions">
          <button class="btn btn-sm" style="padding:4px 8px;font-size:11px;border-radius:6px;background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;" onclick="DashboardPage.openProposal(${c.id})" title="제안서">제안서</button>
          <button class="btn btn-sm" style="padding:4px 8px;font-size:11px;border-radius:6px;background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0;" onclick="App.navigate('alimtalk', {customerId: ${c.id}})" title="알림톡">알림톡</button>
        </div>
      </div>
    `).join('');
  },

  // 생일/상령일 알림 모달
  showAlertModal(type) {
    if (!this._dashData) return;
    const alerts = this._dashData.alerts;
    const list = type === 'birthday' ? alerts.birthdays : alerts.anniversaries;
    const title = type === 'birthday' ? '생일 알림 (30일 이내)' : '상령일 알림 (30일 이내)';
    const dateField = type === 'birthday' ? 'birth_date' : 'policy_anniversary';
    const dateLabel = type === 'birthday' ? '생일' : '상령일';

    if (list.length === 0) {
      Modal.show(title, '<div class="empty-state" style="padding:20px;"><div class="empty-state-text">30일 이내 해당 고객이 없습니다</div></div>', '<button class="btn btn-secondary" onclick="Modal.close()">닫기</button>');
      return;
    }

    const html = `
      <table class="data-table">
        <thead><tr><th>이름</th><th>연락처</th><th>${dateLabel}</th></tr></thead>
        <tbody>
          ${list.map(c => `
            <tr>
              <td><strong>${Utils.escapeHtml(c.name)}</strong></td>
              <td>${Utils.formatPhone(c.phone)}</td>
              <td>${Utils.formatDate(c[dateField])}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    Modal.show(title, html, '<button class="btn btn-secondary" onclick="Modal.close()">닫기</button>');
  },

  // ==================== 고객목록 페이지 (별도) ====================
  async renderCustomerListPage() {
    try {
      const data = await API.getCustomers({ limit: 200 });
      this._allCustomers = data.customers;

      return `
        <div class="page-header">
          <div class="page-header-row">
            <div>
              <h1 class="page-title">고객목록</h1>
              <p class="page-subtitle">전체 고객을 관리합니다</p>
            </div>
            <button class="btn btn-primary" onclick="DashboardPage.showAddCustomer('customers')">+ 신규 고객 등록</button>
          </div>
        </div>
        <div class="card">
          <div class="search-bar">
            <input type="text" class="search-input" placeholder="이름 또는 연락처로 검색..." id="customer-search" oninput="DashboardPage.searchCustomers(this.value)">
            <select class="form-input" style="width:auto;" id="status-filter" onchange="DashboardPage.filterByStatus(this.value)">
              <option value="">전체 상태</option>
              <option value="상담전">상담전</option>
              <option value="상담중">상담중</option>
              <option value="상담완료">상담완료</option>
            </select>
          </div>
          <div id="customer-table-container">
            ${this.renderCustomerTable(data.customers)}
          </div>
        </div>
      `;
    } catch (err) {
      showToast(err.message, 'error');
      return '<div class="empty-state"><div class="empty-state-text">데이터를 불러오는 중 오류가 발생했습니다.</div></div>';
    }
  },

  renderCustomerTable(customers) {
    if (!customers || customers.length === 0) {
      return '<div class="empty-state"><div class="empty-state-icon">👥</div><div class="empty-state-text">등록된 고객이 없습니다</div></div>';
    }

    // Desktop: table view
    const tableView = `
      <div class="table-responsive customer-table-desktop">
      <table class="data-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>연락처</th>
            <th>생년월일</th>
            <th>지역</th>
            <th>상태</th>
            <th>상담내용</th>
            <th>등록일</th>
            <th>최근수정일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          ${customers.map(c => `
            <tr>
              <td><strong style="cursor:pointer;color:var(--blue)" onclick="DashboardPage.showCustomerDetail(${c.id})">${Utils.escapeHtml(c.name)}</strong></td>
              <td>${Utils.formatPhone(c.phone)}</td>
              <td>${Utils.formatDate(c.birth_date)}</td>
              <td style="font-size:12px;color:var(--gray-500);">${c.address ? (c.address.split('|')[0].match(/^.*?[시군구]/)?.[0] || '') : ''}</td>
              <td>
                <span class="status-badge ${Utils.getStatusClass(c.status)}" style="cursor:pointer;" onclick="DashboardPage.cycleStatus(${c.id}, '${c.status}')">${c.status}</span>
              </td>
              <td style="font-size:12px;color:var(--gray-600);max-width:150px;">${c.consult_date ? Utils.escapeHtml(c.consult_date) + ' ' : ''}<span style="opacity:0.35;font-size:13px;cursor:pointer;" onclick="DashboardPage.inlineEditMemo(this.parentElement, ${c.id}, 'consult_date')" title="클릭하여 수정">\u270E</span></td>
              <td>${Utils.formatDate(c.createdAt)}</td>
              <td>${Utils.formatDate(c.updatedAt)}</td>
              <td>
                <div style="display:flex;gap:4px;flex-wrap:wrap;">
                  <button class="btn btn-sm" style="background:#eff6ff;color:#4338ca;border:1px solid #c7d2fe;" onclick="DashboardPage.openProposal(${c.id})">제안서</button>
                  <button class="btn btn-secondary btn-sm" onclick="DashboardPage.editCustomer(${c.id})">수정</button>
                  <button class="btn btn-sm" style="background:#fef2f2;color:#dc2626;border:1px solid #fecaca;" onclick="DashboardPage.deleteCustomer(${c.id}, '${Utils.escapeHtml(c.name)}')">삭제</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      </div>
    `;

    // Mobile: card view
    const cardView = `
      <div class="customer-card-mobile">
        ${customers.map(c => {
          const region = c.address ? (c.address.split('|')[0].match(/^.*?[시군구]/)?.[0] || '') : '';
          return `
          <div class="customer-card-item" onclick="DashboardPage.showCustomerDetail(${c.id})">
            <div class="customer-card-top">
              <div class="customer-card-avatar">${Utils.escapeHtml((c.name || '?')[0])}</div>
              <div class="customer-card-info">
                <div class="customer-card-name">${Utils.escapeHtml(c.name)}</div>
                <div class="customer-card-phone">${Utils.formatPhone(c.phone)}</div>
              </div>
              <span class="status-badge ${Utils.getStatusClass(c.status)}" style="cursor:pointer;align-self:flex-start;" onclick="event.stopPropagation(); DashboardPage.cycleStatus(${c.id}, '${c.status}')">${c.status}</span>
            </div>
            <div class="customer-card-meta">
              ${c.birth_date ? `<span>${Utils.formatDate(c.birth_date)}</span>` : ''}
              ${region ? `<span>${region}</span>` : ''}
              ${c.consult_date ? `<span style="color:var(--primary);font-weight:600;">${Utils.escapeHtml(c.consult_date)}</span>` : ''}
            </div>
            <div class="customer-card-actions" onclick="event.stopPropagation();">
              <button class="btn btn-sm" style="flex:1;background:#eff6ff;color:#4338ca;border:1px solid #c7d2fe;justify-content:center;" onclick="DashboardPage.openProposal(${c.id})">제안서</button>
              <button class="btn btn-secondary btn-sm" style="flex:1;justify-content:center;" onclick="DashboardPage.editCustomer(${c.id})">수정</button>
              <button class="btn btn-sm" style="flex:1;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;justify-content:center;" onclick="DashboardPage.deleteCustomer(${c.id}, '${Utils.escapeHtml(c.name)}')">삭제</button>
            </div>
          </div>
        `}).join('')}
      </div>
    `;

    return tableView + cardView;
  },

  async searchCustomers(query) {
    clearTimeout(this._searchTimer);
    this._searchTimer = setTimeout(async () => {
      try {
        const status = document.getElementById('status-filter')?.value;
        const params = {};
        if (query) params.search = query;
        if (status) params.status = status;
        const data = await API.getCustomers(params);
        document.getElementById('customer-table-container').innerHTML = this.renderCustomerTable(data.customers);
      } catch (err) {
        showToast(err.message, 'error');
      }
    }, 300);
  },

  async filterByStatus(status) {
    const search = document.getElementById('customer-search')?.value;
    const params = {};
    if (search) params.search = search;
    if (status) params.status = status;
    try {
      const data = await API.getCustomers(params);
      document.getElementById('customer-table-container').innerHTML = this.renderCustomerTable(data.customers);
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  quickProposal() {
    App.navigate('consultation');
  },

  _quickCustomers: [],

  _filterQuickList(query) {
    const q = (query || '').toLowerCase();
    const filtered = this._quickCustomers.filter(c =>
      (c.name || '').toLowerCase().includes(q) || (c.phone || '').includes(q)
    );
    const el = document.getElementById('qp-customer-list');
    if (!el) return;
    if (filtered.length === 0) {
      el.innerHTML = '<div style="padding:16px;text-align:center;color:var(--gray-400);font-size:13px;">검색 결과가 없습니다</div>';
      return;
    }
    el.innerHTML = filtered.map(c => `
      <div onclick="DashboardPage._quickCreateConsultation(${c.id})" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background=''">
        <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#4338ca;flex-shrink:0;">${Utils.escapeHtml((c.name || '-')[0])}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;font-weight:600;color:var(--gray-800);">${Utils.escapeHtml(c.name)}</div>
          <div style="font-size:11px;color:var(--gray-400);">${Utils.formatPhone(c.phone)}${c.birth_date ? ' · ' + Utils.formatDate(c.birth_date) : ''}</div>
        </div>
      </div>
    `).join('');
  },

  async _quickCreateConsultation(customerId) {
    try {
      Modal.close();
      showToast('제안서를 생성하는 중...', 'info');
      const { consultation } = await API.createConsultation({
        customer_id: parseInt(customerId),
        title: '새 상담'
      });
      App.navigate('consultation', { consultationId: consultation.id });
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  showAddCustomer(returnPage) {
    this._returnPage = returnPage || 'dashboard';
    Modal.show('고객 등록', `
      <form id="add-customer-form">
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">이름 *</label>
            <input type="text" class="form-input" name="name" required>
          </div>
          <div class="form-group">
            <label class="form-label">연락처</label>
            <input type="tel" class="form-input" name="phone" placeholder="010-0000-0000" oninput="Utils.formatPhoneInput(this)">
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">생년월일</label>
            <input type="text" class="form-input" name="birth_date" placeholder="19900101" maxlength="10" oninput="Utils.formatBirthInput(this); DashboardPage.autoCalcAnniversary('add')">
          </div>
          <div class="form-group">
            <label class="form-label">성별</label>
            <select class="form-input" name="gender">
              <option value="">선택</option>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">이메일</label>
          <input type="email" class="form-input" name="email">
        </div>
        <div class="form-group">
          <label class="form-label">주소</label>
          <div style="display:flex;gap:6px;">
            <input type="text" class="form-input" name="address" id="add-address" placeholder="주소 검색 버튼을 클릭하세요" style="flex:1;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="Utils.searchAddress(function(addr){document.getElementById('add-address').value=addr;})" style="white-space:nowrap;height:38px;">주소 검색</button>
          </div>
          <input type="text" class="form-input" name="address_detail" placeholder="상세주소 입력" style="margin-top:6px;">
        </div>
        <div class="form-group">
          <label class="form-label">상령일 <span style="font-size:11px;color:var(--gray-400);">(자동계산)</span></label>
          <input type="text" class="form-input" name="policy_anniversary" placeholder="생년월일 입력시 자동계산" readonly style="background:var(--gray-50);">
        </div>
        <div class="form-group">
          <label class="form-label">상태</label>
          <select class="form-input" name="status">
            <option value="상담전">상담전</option>
            <option value="상담중">상담중</option>
            <option value="상담완료">상담완료</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">상담 내용</label>
          <textarea class="form-input" name="consult_date" rows="3" style="resize:vertical;" placeholder="상담 내용"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">메모</label>
          <textarea class="form-input" name="memo" rows="5" style="resize:vertical;"></textarea>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()">취소</button>
      <button class="btn btn-primary" onclick="DashboardPage.saveCustomer()">등록</button>
    `);
  },

  async saveCustomer() {
    const form = document.getElementById('add-customer-form');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((v, k) => { if (v) data[k] = v; });

    if (data.address_detail) {
      data.address = (data.address || '') + '|' + data.address_detail;
    }
    delete data.address_detail;

    if (!data.name) {
      showToast('이름을 입력하세요.', 'error');
      return;
    }

    try {
      await API.createCustomer(data);
      Modal.close();
      showToast('고객이 등록되었습니다.', 'success');
      App.navigate(this._returnPage || 'dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async editCustomer(id) {
    try {
      const { customer } = await API.getCustomer(id);
      const birthVal = customer.birth_date ? customer.birth_date.replace(/-/g, '').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : '';
      Modal.show('고객 수정', `
        <form id="edit-customer-form">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">이름 *</label>
              <input type="text" class="form-input" name="name" value="${Utils.escapeHtml(customer.name || '')}" required>
            </div>
            <div class="form-group">
              <label class="form-label">연락처</label>
              <input type="tel" class="form-input" name="phone" value="${Utils.formatPhone(customer.phone || '')}" oninput="Utils.formatPhoneInput(this)">
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">생년월일</label>
              <input type="text" class="form-input" name="birth_date" value="${birthVal}" placeholder="19900101" maxlength="10" oninput="Utils.formatBirthInput(this); DashboardPage.autoCalcAnniversary('edit')">
            </div>
            <div class="form-group">
              <label class="form-label">성별</label>
              <select class="form-input" name="gender">
                <option value="">선택</option>
                <option value="M" ${customer.gender==='M'?'selected':''}>남성</option>
                <option value="F" ${customer.gender==='F'?'selected':''}>여성</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">이메일</label>
            <input type="email" class="form-input" name="email" value="${Utils.escapeHtml(customer.email || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">주소</label>
            <div style="display:flex;gap:6px;">
              <input type="text" class="form-input" name="address" id="edit-address" value="${Utils.escapeHtml((customer.address || '').split('|')[0])}" placeholder="주소 검색" style="flex:1;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="Utils.searchAddress(function(addr){document.getElementById('edit-address').value=addr;})" style="white-space:nowrap;height:38px;">주소 검색</button>
            </div>
            <input type="text" class="form-input" name="address_detail" value="${Utils.escapeHtml((customer.address || '').split('|')[1] || '')}" placeholder="상세주소 입력" style="margin-top:6px;">
          </div>
          <div class="form-group">
            <label class="form-label">상령일 <span style="font-size:11px;color:var(--gray-400);">(자동계산)</span></label>
            <input type="text" class="form-input" name="policy_anniversary" value="${customer.policy_anniversary || ''}" readonly style="background:var(--gray-50);">
          </div>
          <div class="form-group">
            <label class="form-label">상태</label>
            <select class="form-input" name="status">
              <option value="상담전" ${customer.status==='상담전'?'selected':''}>상담전</option>
              <option value="상담중" ${customer.status==='상담중'?'selected':''}>상담중</option>
              <option value="상담완료" ${customer.status==='상담완료'?'selected':''}>상담완료</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">상담 내용</label>
            <textarea class="form-input" name="consult_date" rows="3" style="resize:vertical;">${Utils.escapeHtml(customer.consult_date || '')}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">메모</label>
            <textarea class="form-input" name="memo" rows="5" style="resize:vertical;">${Utils.escapeHtml(customer.memo || '')}</textarea>
          </div>
        </form>
      `, `
        <button class="btn btn-secondary" onclick="Modal.close()">취소</button>
        <button class="btn btn-primary" onclick="DashboardPage.updateCustomer(${id})">저장</button>
      `);
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async updateCustomer(id) {
    if (!confirm('저장하시겠습니까?')) return;

    const form = document.getElementById('edit-customer-form');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((v, k) => { data[k] = v || null; });

    if (data.address_detail) {
      data.address = (data.address || '') + '|' + data.address_detail;
    }
    delete data.address_detail;

    try {
      await API.updateCustomer(id, data);
      Modal.close();
      showToast('고객 정보가 수정되었습니다.', 'success');
      // 현재 페이지에 맞춰 리로드
      App.navigate(App.currentPage);
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async changeStatus(id, status) {
    try {
      await API.updateCustomerStatus(id, status);
      showToast('상태가 변경되었습니다.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async cycleStatus(id, currentStatus) {
    const order = ['상담전', '상담중', '상담완료'];
    const nextIdx = (order.indexOf(currentStatus) + 1) % order.length;
    const nextStatus = order[nextIdx];
    try {
      await API.updateCustomerStatus(id, nextStatus);
      showToast(`상태: ${nextStatus}`, 'success');
      // DOM만 업데이트 (페이지 전체 리렌더링 방지)
      const container = document.getElementById('customer-table-container');
      if (container) {
        const search = document.getElementById('customer-search')?.value || '';
        const status = document.getElementById('status-filter')?.value || '';
        const params = {};
        if (search) params.search = search;
        if (status) params.status = status;
        const data = await API.getCustomers(params);
        container.innerHTML = this.renderCustomerTable(data.customers);
      } else {
        // 대시보드 최근 고객 리스트
        const dashList = document.getElementById('dash-recent-list');
        if (dashList) {
          const data = await API.getDashboard();
          dashList.innerHTML = this._renderRecentList(data.recentCustomers);
        }
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async openProposal(customerId) {
    try {
      const data = await API.getConsultations({ customer_id: customerId });
      const consultations = data.consultations || [];
      if (consultations.length > 0) {
        // 기존 제안서가 있으면 가장 최근 것으로 이동
        App.navigate('consultation', { consultationId: consultations[0].id });
      } else {
        // 없으면 새로 생성 후 에디터로
        const { consultation } = await API.createConsultation({
          customer_id: customerId,
          title: '새 상담'
        });
        App.navigate('consultation', { consultationId: consultation.id });
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  deleteCustomer(id, name) {
    const pw = prompt(`"${name}" 고객을 삭제하려면 비밀번호(0119)를 입력하세요.`);
    if (pw === null) return;
    if (pw !== '0119') {
      showToast('비밀번호가 일치하지 않습니다.', 'error');
      return;
    }
    Modal.confirm(`"${name}" 고객을 정말 삭제하시겠습니까?`, async () => {
      try {
        await API.deleteCustomer(id);
        showToast('삭제되었습니다.', 'success');
        App.navigate(App.currentPage);
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  },

  inlineEditMemo(td, customerId, field) {
    if (td.querySelector('textarea')) return;
    const currentValue = td.textContent.replace(/[\u270E]/g, '').trim();
    const textarea = document.createElement('textarea');
    textarea.className = 'form-input';
    textarea.value = currentValue;
    textarea.rows = 2;
    textarea.style.cssText = 'font-size:12px;width:100%;resize:vertical;';
    td.innerHTML = '';
    td.appendChild(textarea);
    textarea.focus();

    const save = async () => {
      const newValue = textarea.value.trim();
      const pencil = ' <span style="opacity:0.35;font-size:13px;">\u270E</span>';
      try {
        await API.updateCustomer(customerId, { [field]: newValue });
        td.innerHTML = (newValue ? Utils.escapeHtml(newValue) + ' ' : '') + pencil;
      } catch (err) {
        showToast(err.message, 'error');
        td.innerHTML = (currentValue ? Utils.escapeHtml(currentValue) + ' ' : '') + pencil;
      }
    };

    textarea.addEventListener('blur', save);
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        textarea.blur();
      }
      if (e.key === 'Escape') {
        const pencil = ' <span style="opacity:0.35;font-size:13px;">\u270E</span>';
        td.innerHTML = (currentValue ? Utils.escapeHtml(currentValue) + ' ' : '') + pencil;
      }
    });
  },

  autoCalcAnniversary(formPrefix) {
    const form = document.getElementById(formPrefix === 'add' ? 'add-customer-form' : 'edit-customer-form');
    if (!form) return;
    const birthInput = form.querySelector('[name="birth_date"]');
    const annivInput = form.querySelector('[name="policy_anniversary"]');
    if (birthInput && annivInput && birthInput.value.length === 10) {
      annivInput.value = Utils.calculatePolicyAnniversary(birthInput.value);
    }
  },

  async showCustomerDetail(id) {
    try {
      const [{ customer }, { consents }] = await Promise.all([
        API.getCustomer(id),
        API.getDesignConsents(id)
      ]);
      const hasCompleted = consents && consents.some(c => c.status === '완료' && !c.expired);
      const hasSent = consents && consents.length > 0;
      Modal.show(`${customer.name} 고객 정보`, `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
          <div style="padding:10px;background:var(--gray-50);border-radius:8px;">
            <div style="font-size:11px;color:var(--gray-400);margin-bottom:2px;">연락처</div>
            <div style="font-size:13px;font-weight:600;color:var(--gray-800);">${Utils.formatPhone(customer.phone)}</div>
          </div>
          <div style="padding:10px;background:var(--gray-50);border-radius:8px;">
            <div style="font-size:11px;color:var(--gray-400);margin-bottom:2px;">생년월일</div>
            <div style="font-size:13px;font-weight:600;color:var(--gray-800);">${Utils.formatDate(customer.birth_date)}</div>
          </div>
          <div style="padding:10px;background:var(--gray-50);border-radius:8px;">
            <div style="font-size:11px;color:var(--gray-400);margin-bottom:2px;">성별</div>
            <div style="font-size:13px;font-weight:600;color:var(--gray-800);">${customer.gender === 'M' ? '남' : customer.gender === 'F' ? '여' : '-'}</div>
          </div>
          <div style="padding:10px;background:var(--gray-50);border-radius:8px;">
            <div style="font-size:11px;color:var(--gray-400);margin-bottom:2px;">상태</div>
            <div><span class="status-badge ${Utils.getStatusClass(customer.status)}">${customer.status}</span></div>
          </div>
          <div style="padding:10px;background:var(--gray-50);border-radius:8px;">
            <div style="font-size:11px;color:var(--gray-400);margin-bottom:2px;">이메일</div>
            <div style="font-size:13px;font-weight:600;color:var(--gray-800);">${Utils.escapeHtml(customer.email || '-')}</div>
          </div>
          <div style="padding:10px;background:var(--gray-50);border-radius:8px;">
            <div style="font-size:11px;color:var(--gray-400);margin-bottom:2px;">주소</div>
            <div style="font-size:13px;font-weight:600;color:var(--gray-800);">${Utils.escapeHtml((customer.address || '-').replace('|', ' '))}</div>
          </div>
        </div>
        ${customer.memo ? `
          <div style="margin-bottom:14px;padding:12px;background:linear-gradient(135deg,#fffbeb,#fef3c7);border:1px solid #fde68a;border-radius:8px;">
            <div style="font-size:11px;font-weight:700;color:#d97706;margin-bottom:4px;">메모</div>
            <div style="font-size:12px;color:var(--gray-700);white-space:pre-wrap;">${Utils.escapeHtml(customer.memo)}</div>
          </div>
        ` : ''}
        ${customer.Consultations && customer.Consultations.length > 0 ? `
          <h4 style="margin-bottom:6px;font-size:13px;color:var(--gray-700);">상담 이력</h4>
          <table class="data-table">
            <thead><tr><th>제목</th><th>상태</th><th>날짜</th></tr></thead>
            <tbody>
              ${customer.Consultations.map(c => `
                <tr>
                  <td>${Utils.escapeHtml(c.title || '(제목없음)')}</td>
                  <td><span class="status-badge ${Utils.getStatusClass(c.status)}">${c.status}</span></td>
                  <td>${Utils.formatDate(c.created_at)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}
      `, `
        <div style="display:flex;gap:8px;flex-wrap:wrap;width:100%;justify-content:flex-end;">
          <button class="btn btn-secondary" onclick="Modal.close()">닫기</button>
          ${hasCompleted ? `<button class="btn btn-primary" onclick="DashboardPage.showDesignConsentResponse(${id})">설계 동의 답변</button>` : ''}
          <button class="btn btn-primary" style="background:#10b981;" onclick="DashboardPage.confirmSendDesignConsent(${id}, '${Utils.escapeHtml(customer.name)}', '${Utils.escapeHtml(customer.phone || '')}')">${hasSent ? '설계 동의 알림 재전송' : '설계 동의 알림 전송'}</button>
          <button class="btn btn-primary" onclick="Modal.close(); App.navigate('consultation', {customerId: ${id}})">제안서 작성</button>
        </div>
      `);
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  confirmSendDesignConsent(customerId, customerName, customerPhone) {
    Modal.close();
    Modal.show('설계 동의 알림 전송', `
      <p style="font-size:14px;color:var(--gray-600);text-align:center;padding:12px 0 16px;">
        <strong>${customerName}</strong> 고객님에게<br>설계 동의 알림을 전송합니다.
      </p>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <button class="btn btn-primary" style="width:100%;padding:12px;" onclick="DashboardPage.sendDesignConsent(${customerId}, 'link')">
          링크 복사하기
        </button>
        <div style="display:flex;align-items:center;gap:4px;color:var(--gray-400);font-size:12px;">
          <div style="flex:1;height:1px;background:var(--gray-200);"></div>
          <span>또는</span>
          <div style="flex:1;height:1px;background:var(--gray-200);"></div>
        </div>
        <div>
          <label style="font-size:12px;color:var(--gray-500);margin-bottom:4px;display:block;">수신 번호</label>
          <div style="display:flex;gap:8px;">
            <input type="tel" id="consent-sms-phone" value="${DashboardPage.formatPhoneInput(customerPhone)}" placeholder="010-0000-0000" oninput="this.value=DashboardPage.formatPhoneInput(this.value)" maxlength="13" style="flex:1;padding:10px 12px;border:1px solid var(--gray-300);border-radius:8px;font-size:14px;outline:none;">
            <button class="btn btn-primary" style="white-space:nowrap;padding:10px 16px;" onclick="DashboardPage.sendDesignConsent(${customerId}, 'sms')">
              링크 전송
            </button>
          </div>
        </div>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close(); DashboardPage.showCustomerDetail(${customerId})">취소</button>
    `);
  },

  async sendDesignConsent(customerId, method) {
    try {
      if (method === 'sms') {
        const phone = document.getElementById('consent-sms-phone')?.value?.trim();
        if (!phone) {
          showToast('수신 번호를 입력해 주세요.', 'error');
          return;
        }
        const { link, sms_sent, sms_error } = await API.createDesignConsent(customerId, { send_sms: true, phone });
        Modal.close();
        if (sms_sent) {
          Modal.show('문자 발송 완료', `
            <div style="text-align:center;padding:20px 0;">
              <div style="font-size:40px;margin-bottom:12px;">&#10003;</div>
              <p style="font-size:14px;color:var(--gray-700);">설계 동의 링크가<br><strong>${phone}</strong>으로 발송되었습니다.</p>
            </div>
          `, `<button class="btn btn-primary" onclick="Modal.close()">확인</button>`);
        } else {
          Modal.show('발송 실패', `
            <div style="text-align:center;padding:20px 0;">
              <p style="font-size:14px;color:#dc2626;margin-bottom:12px;">${Utils.escapeHtml(sms_error || '문자 발송에 실패했습니다.')}</p>
              <p style="font-size:13px;color:var(--gray-600);margin-bottom:12px;">아래 링크를 직접 전달해 주세요.</p>
              <div style="background:var(--gray-50);border:1px solid var(--gray-200);border-radius:8px;padding:12px;word-break:break-all;">
                <input type="text" id="consent-link-input" value="${link}" readonly style="width:100%;border:none;background:transparent;font-size:13px;color:var(--gray-700);outline:none;">
              </div>
            </div>
          `, `
            <button class="btn btn-secondary" onclick="Modal.close()">닫기</button>
            <button class="btn btn-primary" onclick="DashboardPage.copyConsentLink()">링크 복사</button>
          `);
        }
      } else {
        const { link } = await API.createDesignConsent(customerId);
        Modal.close();
        Modal.show('설계 동의 링크 생성 완료', `
          <p style="font-size:13px;color:var(--gray-600);margin-bottom:12px;">아래 링크를 고객님에게 전달해 주세요.</p>
          <div style="background:var(--gray-50);border:1px solid var(--gray-200);border-radius:8px;padding:12px;word-break:break-all;">
            <input type="text" id="consent-link-input" value="${link}" readonly style="width:100%;border:none;background:transparent;font-size:13px;color:var(--gray-700);outline:none;">
          </div>
        `, `
          <button class="btn btn-secondary" onclick="Modal.close()">닫기</button>
          <button class="btn btn-primary" onclick="DashboardPage.copyConsentLink()">링크 복사</button>
        `);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  formatPhoneInput(value) {
    const nums = value.replace(/[^0-9]/g, '').substring(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return nums.substring(0, 3) + '-' + nums.substring(3);
    return nums.substring(0, 3) + '-' + nums.substring(3, 7) + '-' + nums.substring(7);
  },

  copyConsentLink() {
    const input = document.getElementById('consent-link-input');
    if (input) {
      navigator.clipboard.writeText(input.value).then(() => {
        showToast('링크가 복사되었습니다.', 'success');
      }).catch(() => {
        input.select();
        document.execCommand('copy');
        showToast('링크가 복사되었습니다.', 'success');
      });
    }
  },

  async showDesignConsentResponse(customerId) {
    try {
      const { consents } = await API.getDesignConsents(customerId);
      Modal.close();

      if (!consents || consents.length === 0) {
        Modal.show('설계 동의 답변', `
          <div style="text-align:center;padding:30px;color:var(--gray-400);">
            아직 설계 동의 요청 내역이 없습니다.
          </div>
        `, `<button class="btn btn-secondary" onclick="Modal.close(); DashboardPage.showCustomerDetail(${customerId})">돌아가기</button>`);
        return;
      }

      const content = consents.map(c => {
        const isExpired = c.expired;
        const statusLabel = isExpired ? '만료' : c.status;
        const statusBg = isExpired ? '#fee2e2' : (c.status === '완료' ? '#dcfce7' : '#fef3c7');
        const statusColor = isExpired ? '#dc2626' : (c.status === '완료' ? '#16a34a' : '#d97706');
        const cardBg = isExpired ? '#fef2f2' : (c.status === '완료' ? '#f0fdf4' : 'var(--gray-50)');

        return `
        <div style="border:1px solid var(--gray-200);border-radius:10px;padding:14px;margin-bottom:10px;background:${cardBg};">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span style="font-size:12px;color:var(--gray-400);">${Utils.formatDate(c.created_at)}</span>
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:12px;font-weight:600;padding:2px 8px;border-radius:4px;background:${statusBg};color:${statusColor};">${statusLabel}</span>
              <button onclick="DashboardPage.deleteDesignConsent(${c.id}, ${customerId})" style="font-size:10px;padding:2px 6px;border:1px solid #fca5a5;border-radius:4px;background:#fff;cursor:pointer;color:#dc2626;">삭제</button>
            </div>
          </div>
          ${isExpired ? `
            <div style="font-size:12px;color:#dc2626;">개인정보 보유기간(1개월)이 만료되어 데이터가 삭제되었습니다.</div>
            <div style="margin-top:4px;font-size:11px;color:var(--gray-400);">만료일: ${Utils.formatDate(c.expires_at)}</div>
          ` : c.status === '완료' ? `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div style="padding:8px;background:white;border-radius:6px;border:1px solid var(--gray-100);grid-column:span 2;">
                <div style="font-size:10px;color:var(--gray-400);margin-bottom:2px;">주민등록번호</div>
                <div style="display:flex;align-items:center;gap:6px;">
                  <span id="ssn-display-${c.id}" style="font-size:12px;color:var(--gray-700);">${Utils.escapeHtml(c.resident_number_front || '')}-*******</span>
                  <button onclick="DashboardPage.toggleSSNMask(${c.id}, '${Utils.escapeHtml(c.resident_number_front)}', '${Utils.escapeHtml(c.resident_number_back)}')" id="ssn-btn-${c.id}" style="font-size:10px;padding:2px 6px;border:1px solid var(--gray-300);border-radius:4px;background:white;cursor:pointer;color:var(--gray-500);">마스킹 해제</button>
                </div>
              </div>
              <div style="padding:8px;background:white;border-radius:6px;border:1px solid var(--gray-100);grid-column:span 2;">
                <div style="font-size:10px;color:var(--gray-400);margin-bottom:2px;">주소</div>
                <div style="font-size:12px;color:var(--gray-700);">${Utils.escapeHtml(c.address || '-')}</div>
              </div>
              <div style="padding:8px;background:white;border-radius:6px;border:1px solid var(--gray-100);">
                <div style="font-size:10px;color:var(--gray-400);margin-bottom:2px;">직업</div>
                <div style="font-size:12px;color:var(--gray-700);">${Utils.escapeHtml(c.occupation || '-')}</div>
              </div>
              <div style="padding:8px;background:white;border-radius:6px;border:1px solid var(--gray-100);">
                <div style="font-size:10px;color:var(--gray-400);margin-bottom:2px;">병력</div>
                <div style="font-size:12px;color:var(--gray-700);">${Utils.escapeHtml(c.military_service || '-')}</div>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:6px;">
              <span style="font-size:11px;color:var(--gray-400);">제출일: ${c.submitted_at ? Utils.formatDate(c.submitted_at) : '-'}</span>
              <span style="font-size:11px;color:#f59e0b;">만료일: ${c.expires_at ? Utils.formatDate(c.expires_at) : '-'}</span>
            </div>
          ` : `
            <div style="font-size:12px;color:var(--gray-400);">고객 응답 대기중...</div>
          `}
        </div>`;
      }).join('');

      Modal.show('설계 동의 답변', content, `
        <button class="btn btn-secondary" onclick="Modal.close(); DashboardPage.showCustomerDetail(${customerId})">돌아가기</button>
      `);
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async deleteDesignConsent(consentId, customerId) {
    Modal.close();
    Modal.confirm('이 설계 동의 답변을 삭제하시겠습니까?', async () => {
      try {
        await API.deleteDesignConsent(consentId);
        showToast('삭제되었습니다.', 'success');
        DashboardPage.showDesignConsentResponse(customerId);
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  },

  toggleSSNMask(id, front, back) {
    const display = document.getElementById(`ssn-display-${id}`);
    const btn = document.getElementById(`ssn-btn-${id}`);
    if (!display || !btn) return;
    const isMasked = display.textContent.includes('*******');
    if (isMasked) {
      display.textContent = `${front}-${back}`;
      btn.textContent = '마스킹';
    } else {
      display.textContent = `${front}-*******`;
      btn.textContent = '마스킹 해제';
    }
  }
};
