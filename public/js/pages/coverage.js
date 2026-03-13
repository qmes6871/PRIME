// Coverage Page
const CoveragePage = {
  customers: [],
  selectedCustomerId: null,
  coverages: [],
  checkItems: [],

  async render() {
    try {
      const [customersData, checkItemsData] = await Promise.all([
        API.getCustomers({ limit: 200 }),
        API.getCheckItems()
      ]);
      this.customers = customersData.customers;
      this.checkItems = checkItemsData.items;

      return `
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:start;">
          <div>
            <h1 class="page-title">보장 간편보기</h1>
            <p class="page-subtitle">고객별 보장현황을 관리하고 리포트를 생성하세요</p>
          </div>
        </div>

        <div class="card" style="margin-bottom:16px;">
          <div style="display:flex;gap:12px;align-items:center;">
            <div class="form-group" style="flex:1;margin-bottom:0;">
              <select class="form-input" id="coverage-customer" onchange="CoveragePage.loadCoverages(this.value)">
                <option value="">고객을 선택하세요</option>
                ${this.customers.map(c => `
                  <option value="${c.id}">${c.name} (${Utils.formatPhone(c.phone)})</option>
                `).join('')}
              </select>
            </div>
            <button class="btn btn-primary" onclick="CoveragePage.addCoverage()" id="btn-add-coverage" style="display:none;">+ 보장 추가</button>
            <button class="btn btn-success" onclick="CoveragePage.generateReport()" id="btn-report" style="display:none;">📊 리포트</button>
          </div>
        </div>

        <div id="coverage-content">
          <div class="empty-state">
            <div class="empty-state-icon">🛡️</div>
            <div class="empty-state-text">고객을 선택하면 보장현황이 표시됩니다</div>
          </div>
        </div>
      `;
    } catch (err) {
      showToast(err.message, 'error');
      return '<div class="empty-state"><div class="empty-state-text">데이터를 불러오는 중 오류가 발생했습니다.</div></div>';
    }
  },

  async loadCoverages(customerId) {
    if (!customerId) {
      document.getElementById('coverage-content').innerHTML = '<div class="empty-state"><div class="empty-state-icon">🛡️</div><div class="empty-state-text">고객을 선택하면 보장현황이 표시됩니다</div></div>';
      document.getElementById('btn-add-coverage').style.display = 'none';
      document.getElementById('btn-report').style.display = 'none';
      return;
    }

    this.selectedCustomerId = parseInt(customerId);
    document.getElementById('btn-add-coverage').style.display = '';
    document.getElementById('btn-report').style.display = '';

    try {
      const data = await API.getCustomerCoverages(customerId);
      this.coverages = data.coverages;

      if (this.coverages.length === 0) {
        document.getElementById('coverage-content').innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">📋</div>
            <div class="empty-state-text">${Utils.escapeHtml(data.customer.name)}님의 보장 정보가 없습니다</div>
            <button class="btn btn-primary" onclick="CoveragePage.addCoverage()">보장 추가하기</button>
          </div>
        `;
        return;
      }

      // Group by category
      const groups = {};
      this.coverages.forEach(c => {
        const cat = c.category || '기타';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(c);
      });

      let html = '';
      for (const [category, items] of Object.entries(groups)) {
        const totalPremium = items.reduce((s, i) => s + (i.premium || 0), 0);
        html += `
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">${Utils.escapeHtml(category)}</h3>
              <span style="font-size:13px;color:var(--gray-500);">월 보험료: ${Utils.formatMoney(totalPremium)}</span>
            </div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>보험사</th>
                  <th>상품명</th>
                  <th>보장항목</th>
                  <th>보장금액</th>
                  <th>보험료</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(c => `
                  <tr>
                    <td>${Utils.escapeHtml(c.insurance_company || '-')}</td>
                    <td>${Utils.escapeHtml(c.product_name || '-')}</td>
                    <td>${Utils.escapeHtml(c.coverage_name || '-')}</td>
                    <td style="font-weight:600;">${Utils.formatMoneyShort(c.coverage_amount)}</td>
                    <td>${Utils.formatMoney(c.premium)}</td>
                    <td><span class="status-badge ${c.status==='유지'?'done':c.status==='실효'?'before':'ing'}">${c.status}</span></td>
                    <td>
                      <button class="btn btn-secondary btn-sm" onclick="CoveragePage.editCoverage(${c.id})">수정</button>
                      <button class="btn btn-danger btn-sm" onclick="CoveragePage.deleteCoverage(${c.id})">삭제</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }

      // Summary
      const totalPremium = this.coverages.reduce((s, c) => s + (c.premium || 0), 0);
      const activeCount = this.coverages.filter(c => c.status === '유지').length;
      html = `
        <div class="summary-cards" style="margin-bottom:16px;">
          <div class="summary-card blue">
            <div class="summary-card-label">총 보장 건수</div>
            <div class="summary-card-value">${this.coverages.length}</div>
          </div>
          <div class="summary-card green">
            <div class="summary-card-label">유지 중</div>
            <div class="summary-card-value">${activeCount}</div>
          </div>
          <div class="summary-card yellow">
            <div class="summary-card-label">총 월 보험료</div>
            <div class="summary-card-value">${Utils.formatMoneyShort(totalPremium)}</div>
          </div>
        </div>
      ` + html;

      document.getElementById('coverage-content').innerHTML = html;
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  addCoverage() {
    if (!this.selectedCustomerId) {
      showToast('고객을 먼저 선택하세요.', 'error');
      return;
    }

    // Group check items by category for the form
    const categories = [...new Set(this.checkItems.map(i => i.category))];

    Modal.show('보장 추가', `
      <form id="add-coverage-form">
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">보험사</label>
            <input type="text" class="form-input" name="insurance_company" placeholder="보험사명">
          </div>
          <div class="form-group">
            <label class="form-label">상품명</label>
            <input type="text" class="form-input" name="product_name" placeholder="상품명">
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">카테고리</label>
            <select class="form-input" name="category">
              ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">보장항목명</label>
            <input type="text" class="form-input" name="coverage_name" placeholder="예: 암진단">
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">보장금액</label>
            <input type="number" class="form-input" name="coverage_amount" placeholder="원 단위">
          </div>
          <div class="form-group">
            <label class="form-label">월 보험료</label>
            <input type="number" class="form-input" name="premium" placeholder="원">
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">계약일</label>
            <input type="date" class="form-input" name="contract_date">
          </div>
          <div class="form-group">
            <label class="form-label">만기일</label>
            <input type="date" class="form-input" name="expiry_date">
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">납입기간</label>
            <input type="text" class="form-input" name="payment_period" placeholder="예: 20년납">
          </div>
          <div class="form-group">
            <label class="form-label">상태</label>
            <select class="form-input" name="status">
              <option value="유지">유지</option>
              <option value="실효">실효</option>
              <option value="해지">해지</option>
              <option value="만기">만기</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">메모</label>
          <textarea class="form-input" name="note" rows="2"></textarea>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()">취소</button>
      <button class="btn btn-primary" onclick="CoveragePage.saveCoverage()">추가</button>
    `);
  },

  async saveCoverage() {
    const form = document.getElementById('add-coverage-form');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((v, k) => { if (v) data[k] = v; });

    try {
      await API.createCoverage(this.selectedCustomerId, data);
      Modal.close();
      showToast('보장이 추가되었습니다.', 'success');
      this.loadCoverages(this.selectedCustomerId);
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async editCoverage(id) {
    const coverage = this.coverages.find(c => c.id === id);
    if (!coverage) return;

    const categories = [...new Set(this.checkItems.map(i => i.category))];

    Modal.show('보장 수정', `
      <form id="edit-coverage-form">
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">보험사</label>
            <input type="text" class="form-input" name="insurance_company" value="${Utils.escapeHtml(coverage.insurance_company || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">상품명</label>
            <input type="text" class="form-input" name="product_name" value="${Utils.escapeHtml(coverage.product_name || '')}">
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">카테고리</label>
            <select class="form-input" name="category">
              ${categories.map(c => `<option value="${c}" ${coverage.category === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">보장항목명</label>
            <input type="text" class="form-input" name="coverage_name" value="${Utils.escapeHtml(coverage.coverage_name || '')}">
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">보장금액</label>
            <input type="number" class="form-input" name="coverage_amount" value="${coverage.coverage_amount || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">월 보험료</label>
            <input type="number" class="form-input" name="premium" value="${coverage.premium || ''}">
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">계약일</label>
            <input type="date" class="form-input" name="contract_date" value="${coverage.contract_date || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">만기일</label>
            <input type="date" class="form-input" name="expiry_date" value="${coverage.expiry_date || ''}">
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">납입기간</label>
            <input type="text" class="form-input" name="payment_period" value="${Utils.escapeHtml(coverage.payment_period || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">상태</label>
            <select class="form-input" name="status">
              <option value="유지" ${coverage.status==='유지'?'selected':''}>유지</option>
              <option value="실효" ${coverage.status==='실효'?'selected':''}>실효</option>
              <option value="해지" ${coverage.status==='해지'?'selected':''}>해지</option>
              <option value="만기" ${coverage.status==='만기'?'selected':''}>만기</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">메모</label>
          <textarea class="form-input" name="note" rows="2">${Utils.escapeHtml(coverage.note || '')}</textarea>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()">취소</button>
      <button class="btn btn-primary" onclick="CoveragePage.updateCoverage(${id})">저장</button>
    `);
  },

  async updateCoverage(id) {
    const form = document.getElementById('edit-coverage-form');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((v, k) => { data[k] = v || null; });

    try {
      await API.updateCoverage(this.selectedCustomerId, id, data);
      Modal.close();
      showToast('보장이 수정되었습니다.', 'success');
      this.loadCoverages(this.selectedCustomerId);
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  deleteCoverage(id) {
    Modal.confirm('이 보장을 삭제하시겠습니까?', async () => {
      try {
        await API.deleteCoverage(this.selectedCustomerId, id);
        showToast('삭제되었습니다.', 'success');
        this.loadCoverages(this.selectedCustomerId);
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  },

  generateReport() {
    if (!this.coverages || this.coverages.length === 0) {
      showToast('보장 데이터가 없습니다.', 'error');
      return;
    }

    const customer = this.customers.find(c => c.id === this.selectedCustomerId);
    const groups = {};
    this.coverages.forEach(c => {
      const cat = c.category || '기타';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(c);
    });

    const totalPremium = this.coverages.reduce((s, c) => s + (c.premium || 0), 0);

    let reportHtml = `
      <div style="text-align:center;margin-bottom:20px;">
        <h2 style="color:var(--navy);margin-bottom:4px;">보장현황 리포트</h2>
        <p style="color:var(--gray-500);font-size:13px;">${Utils.escapeHtml(customer?.name || '')}님 · ${Utils.formatDate(new Date().toISOString())}</p>
      </div>
      <div style="background:var(--blue-50);padding:12px;border-radius:8px;margin-bottom:16px;text-align:center;">
        <div style="font-size:13px;color:var(--gray-500);">총 월 보험료</div>
        <div style="font-size:24px;font-weight:700;color:var(--navy);">${Utils.formatMoney(totalPremium)}</div>
      </div>
    `;

    for (const [category, items] of Object.entries(groups)) {
      reportHtml += `
        <div style="margin-bottom:16px;">
          <div style="font-weight:600;font-size:14px;margin-bottom:8px;color:var(--navy);">${Utils.escapeHtml(category)}</div>
          ${items.map(c => `
            <div style="border:1px solid var(--gray-200);border-radius:8px;padding:10px;margin-bottom:6px;font-size:13px;">
              <div style="display:flex;justify-content:space-between;">
                <span>${Utils.escapeHtml(c.coverage_name || c.product_name || '-')}</span>
                <span style="font-weight:600;color:var(--blue);">${Utils.formatMoneyShort(c.coverage_amount)}</span>
              </div>
              <div style="font-size:11px;color:var(--gray-400);margin-top:4px;">
                ${Utils.escapeHtml(c.insurance_company || '')} · ${Utils.formatMoney(c.premium)}/월
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    Modal.show('보장현황 리포트', `
      <div id="coverage-report">${reportHtml}</div>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()">닫기</button>
      <button class="btn btn-primary" onclick="window.print()">🖨️ 인쇄</button>
    `);
  }
};
