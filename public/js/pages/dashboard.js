// Dashboard Page
const DashboardPage = {
  async render() {
    try {
      const data = await API.getDashboard();
      const { summary, alerts, recentCustomers } = data;
      const sc = summary.statusCounts;

      return `
        <div class="page-header">
          <h1 class="page-title">대시보드</h1>
          <p class="page-subtitle">고객 현황과 알림을 한눈에 확인하세요</p>
        </div>

        <div class="summary-cards">
          <div class="summary-card blue">
            <div class="summary-card-label">전체 고객</div>
            <div class="summary-card-value">${summary.totalCustomers}</div>
            <div class="summary-card-sub">
              상담전 ${sc['상담전'] || 0} · 상담중 ${sc['상담중'] || 0} · 완료 ${sc['상담완료'] || 0}
            </div>
          </div>
          <div class="summary-card green">
            <div class="summary-card-label">진행중 상담</div>
            <div class="summary-card-value">${summary.activeConsultations}</div>
            <div class="summary-card-sub">전체 ${summary.totalConsultations}건</div>
          </div>
          <div class="summary-card yellow">
            <div class="summary-card-label">이번 달 메시지</div>
            <div class="summary-card-value">${summary.monthlyMessages}</div>
            <div class="summary-card-sub">발송 완료</div>
          </div>
          <div class="summary-card red">
            <div class="summary-card-label">신규 설문</div>
            <div class="summary-card-value">${summary.newSurveys}</div>
            <div class="summary-card-sub">확인 필요</div>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">🎂 생일 알림 (30일 이내)</h3>
            </div>
            ${alerts.birthdays.length > 0 ? `
              <table class="data-table">
                <thead>
                  <tr><th>이름</th><th>연락처</th><th>생일</th></tr>
                </thead>
                <tbody>
                  ${alerts.birthdays.map(c => `
                    <tr>
                      <td><strong>${Utils.escapeHtml(c.name)}</strong></td>
                      <td>${Utils.formatPhone(c.phone)}</td>
                      <td>${Utils.formatDate(c.birth_date)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<div class="empty-state"><div class="empty-state-text">30일 이내 생일인 고객이 없습니다</div></div>'}
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">📅 상령일 알림 (30일 이내)</h3>
            </div>
            ${alerts.anniversaries.length > 0 ? `
              <table class="data-table">
                <thead>
                  <tr><th>이름</th><th>연락처</th><th>상령일</th></tr>
                </thead>
                <tbody>
                  ${alerts.anniversaries.map(c => `
                    <tr>
                      <td><strong>${Utils.escapeHtml(c.name)}</strong></td>
                      <td>${Utils.formatPhone(c.phone)}</td>
                      <td>${Utils.formatDate(c.policy_anniversary)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<div class="empty-state"><div class="empty-state-text">30일 이내 상령일인 고객이 없습니다</div></div>'}
          </div>
        </div>

        <div class="card" style="margin-top:16px;">
          <div class="card-header">
            <h3 class="card-title">최근 고객</h3>
            <button class="btn btn-primary btn-sm" onclick="DashboardPage.showAddCustomer()">+ 고객 등록</button>
          </div>
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
            ${this.renderCustomerTable(recentCustomers)}
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
    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>연락처</th>
            <th>생년월일</th>
            <th>상태</th>
            <th>등록일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          ${customers.map(c => `
            <tr>
              <td><strong style="cursor:pointer;color:var(--blue)" onclick="DashboardPage.showCustomerDetail(${c.id})">${Utils.escapeHtml(c.name)}</strong></td>
              <td>${Utils.formatPhone(c.phone)}</td>
              <td>${Utils.formatDate(c.birth_date)}</td>
              <td>
                <select class="form-input" style="padding:4px 8px;font-size:12px;width:auto;" onchange="DashboardPage.changeStatus(${c.id}, this.value)">
                  <option value="상담전" ${c.status==='상담전'?'selected':''}>상담전</option>
                  <option value="상담중" ${c.status==='상담중'?'selected':''}>상담중</option>
                  <option value="상담완료" ${c.status==='상담완료'?'selected':''}>상담완료</option>
                </select>
              </td>
              <td>${Utils.formatDate(c.created_at)}</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="DashboardPage.editCustomer(${c.id})">수정</button>
                <button class="btn btn-danger btn-sm" onclick="DashboardPage.deleteCustomer(${c.id}, '${Utils.escapeHtml(c.name)}')">삭제</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
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

  showAddCustomer() {
    Modal.show('고객 등록', `
      <form id="add-customer-form">
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">이름 *</label>
            <input type="text" class="form-input" name="name" required>
          </div>
          <div class="form-group">
            <label class="form-label">연락처</label>
            <input type="tel" class="form-input" name="phone" placeholder="010-0000-0000">
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">생년월일</label>
            <input type="date" class="form-input" name="birth_date">
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
          <input type="text" class="form-input" name="address">
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">상령일</label>
            <input type="date" class="form-input" name="policy_anniversary">
          </div>
          <div class="form-group">
            <label class="form-label">상태</label>
            <select class="form-input" name="status">
              <option value="상담전">상담전</option>
              <option value="상담중">상담중</option>
              <option value="상담완료">상담완료</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">메모</label>
          <textarea class="form-input" name="memo" rows="3"></textarea>
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

    if (!data.name) {
      showToast('이름을 입력하세요.', 'error');
      return;
    }

    try {
      await API.createCustomer(data);
      Modal.close();
      showToast('고객이 등록되었습니다.', 'success');
      App.navigate('dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async editCustomer(id) {
    try {
      const { customer } = await API.getCustomer(id);
      Modal.show('고객 수정', `
        <form id="edit-customer-form">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">이름 *</label>
              <input type="text" class="form-input" name="name" value="${Utils.escapeHtml(customer.name || '')}" required>
            </div>
            <div class="form-group">
              <label class="form-label">연락처</label>
              <input type="tel" class="form-input" name="phone" value="${Utils.escapeHtml(customer.phone || '')}">
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">생년월일</label>
              <input type="date" class="form-input" name="birth_date" value="${customer.birth_date || ''}">
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
            <input type="text" class="form-input" name="address" value="${Utils.escapeHtml(customer.address || '')}">
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">상령일</label>
              <input type="date" class="form-input" name="policy_anniversary" value="${customer.policy_anniversary || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">상태</label>
              <select class="form-input" name="status">
                <option value="상담전" ${customer.status==='상담전'?'selected':''}>상담전</option>
                <option value="상담중" ${customer.status==='상담중'?'selected':''}>상담중</option>
                <option value="상담완료" ${customer.status==='상담완료'?'selected':''}>상담완료</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">메모</label>
            <textarea class="form-input" name="memo" rows="3">${Utils.escapeHtml(customer.memo || '')}</textarea>
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
    const form = document.getElementById('edit-customer-form');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((v, k) => { data[k] = v || null; });

    try {
      await API.updateCustomer(id, data);
      Modal.close();
      showToast('고객 정보가 수정되었습니다.', 'success');
      App.navigate('dashboard');
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

  deleteCustomer(id, name) {
    Modal.confirm(`"${name}" 고객을 삭제하시겠습니까?`, async () => {
      try {
        await API.deleteCustomer(id);
        showToast('삭제되었습니다.', 'success');
        App.navigate('dashboard');
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  },

  async showCustomerDetail(id) {
    try {
      const { customer } = await API.getCustomer(id);
      Modal.show(`${customer.name} 고객 정보`, `
        <div class="grid-2" style="margin-bottom:16px;">
          <div><strong>연락처:</strong> ${Utils.formatPhone(customer.phone)}</div>
          <div><strong>생년월일:</strong> ${Utils.formatDate(customer.birth_date)}</div>
          <div><strong>성별:</strong> ${customer.gender === 'M' ? '남' : customer.gender === 'F' ? '여' : '-'}</div>
          <div><strong>상태:</strong> <span class="status-badge ${Utils.getStatusClass(customer.status)}">${customer.status}</span></div>
          <div><strong>이메일:</strong> ${Utils.escapeHtml(customer.email || '-')}</div>
          <div><strong>주소:</strong> ${Utils.escapeHtml(customer.address || '-')}</div>
        </div>
        ${customer.memo ? `<div style="margin-bottom:16px;"><strong>메모:</strong><br>${Utils.escapeHtml(customer.memo)}</div>` : ''}
        ${customer.Consultations && customer.Consultations.length > 0 ? `
          <h4 style="margin-bottom:8px;">상담 이력</h4>
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
        <button class="btn btn-secondary" onclick="Modal.close()">닫기</button>
        <button class="btn btn-primary" onclick="Modal.close(); App.navigate('consultation', {customerId: ${id}})">상담 시작</button>
      `);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }
};
