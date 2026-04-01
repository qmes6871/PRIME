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
        <div class="page-header page-header-flex">
          <div>
            <h1 class="page-title">보장 간편보기</h1>
            <p class="page-subtitle">고객별 보장현황을 관리하고 리포트를 생성하세요</p>
          </div>
        </div>

        <div class="card" style="margin-bottom:16px;border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
          <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
            <div class="form-group" style="flex:1;margin-bottom:0;position:relative;" id="coverage-customer-wrapper">
              <!-- 선택된 고객 표시 -->
              <div id="cov-selected-customer" style="display:none;">
                <div style="display:flex;align-items:center;gap:10px;padding:8px 14px;border-radius:10px;background:#eff6ff;border:1.5px solid #93c5fd;">
                  <div id="cov-selected-avatar" style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#4338ca;flex-shrink:0;"></div>
                  <div style="flex:1;">
                    <span id="cov-selected-name" style="font-size:14px;font-weight:600;color:var(--gray-800);"></span>
                    <span id="cov-selected-phone" style="font-size:12px;color:var(--gray-400);margin-left:8px;"></span>
                  </div>
                  <span onclick="CoveragePage.clearCustomerSelection()" style="cursor:pointer;color:var(--gray-400);font-size:18px;padding:4px;line-height:1;">×</span>
                </div>
              </div>
              <!-- 검색 입력 -->
              <div id="cov-search-area">
                <div style="position:relative;">
                  <input type="text" class="form-input" id="cov-customer-search" placeholder="이름 또는 연락처로 고객 검색..." oninput="CoveragePage.filterCustomerDropdown(this.value)" onfocus="CoveragePage.showDropdown()" onblur="CoveragePage.hideDropdown()" style="border-radius:10px;padding-left:36px;font-size:13px;">
                  <svg width="14" height="14" fill="none" stroke="var(--gray-400)" stroke-width="2" viewBox="0 0 24 24" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                </div>
                <div id="cov-customer-dropdown" style="display:none;position:absolute;left:0;right:0;top:100%;z-index:50;margin-top:4px;max-height:240px;overflow-y:auto;border:1px solid var(--gray-200);border-radius:10px;background:white;box-shadow:0 8px 24px rgba(0,0,0,0.12);padding:4px;">
                </div>
              </div>
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

        <!-- 보험정보방 섹션 -->
        <div style="margin-top:32px;">
          <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;overflow:hidden;">
            <div class="card-header" style="margin-bottom:16px;">
              <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#dbeafe,#bfdbfe);border-radius:8px;">
                  <svg width="14" height="14" fill="none" stroke="#2563eb" stroke-width="2" viewBox="0 0 24 24"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                </span>
                보험정보방
              </h3>
              <span style="font-size:12px;color:var(--gray-400);">보험 관련 유용한 정보를 한곳에서 확인하세요</span>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));gap:12px;" id="insurance-info-grid">
              ${this._renderInfoCards()}
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      showToast(err.message, 'error');
      return '<div class="empty-state"><div class="empty-state-text">데이터를 불러오는 중 오류가 발생했습니다.</div></div>';
    }
  },

  _dropdownOpen: false,

  showDropdown() {
    const dropdown = document.getElementById('cov-customer-dropdown');
    if (dropdown) {
      dropdown.style.display = '';
      this._dropdownOpen = true;
      this.filterCustomerDropdown(document.getElementById('cov-customer-search')?.value || '');
    }
  },

  hideDropdown() {
    setTimeout(() => {
      const dropdown = document.getElementById('cov-customer-dropdown');
      if (dropdown) { dropdown.style.display = 'none'; this._dropdownOpen = false; }
    }, 200);
  },

  filterCustomerDropdown(search) {
    const query = (search || '').toLowerCase();
    const filtered = this.customers.filter(c => {
      if (!query) return true;
      return (c.name || '').toLowerCase().includes(query) || (c.phone || '').includes(query);
    });

    const dropdown = document.getElementById('cov-customer-dropdown');
    if (!dropdown) return;
    dropdown.style.display = '';
    this._dropdownOpen = true;

    if (filtered.length === 0) {
      dropdown.innerHTML = '<div style="padding:16px;text-align:center;color:var(--gray-400);font-size:13px;">검색 결과가 없습니다</div>';
      return;
    }

    dropdown.innerHTML = filtered.map(c => `
      <div onmousedown="CoveragePage.selectCustomerFromDropdown(${c.id})" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background=''">
        <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#4338ca;flex-shrink:0;">${Utils.escapeHtml((c.name || '-')[0])}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;font-weight:600;color:var(--gray-800);">${Utils.escapeHtml(c.name)}</div>
          <div style="font-size:11px;color:var(--gray-400);">${Utils.formatPhone(c.phone)}${c.birth_date ? ' · ' + Utils.formatDate(c.birth_date) : ''}</div>
        </div>
      </div>
    `).join('');
  },

  selectCustomerFromDropdown(id) {
    const c = this.customers.find(cu => cu.id === id);
    if (!c) return;

    // Show selected state
    const selectedEl = document.getElementById('cov-selected-customer');
    const searchArea = document.getElementById('cov-search-area');
    if (selectedEl) {
      document.getElementById('cov-selected-avatar').textContent = c.name[0];
      document.getElementById('cov-selected-name').textContent = c.name;
      document.getElementById('cov-selected-phone').textContent = Utils.formatPhone(c.phone);
      selectedEl.style.display = '';
    }
    if (searchArea) searchArea.style.display = 'none';

    // Load coverages
    this.loadCoverages(id);
  },

  clearCustomerSelection() {
    const selectedEl = document.getElementById('cov-selected-customer');
    const searchArea = document.getElementById('cov-search-area');
    if (selectedEl) selectedEl.style.display = 'none';
    if (searchArea) searchArea.style.display = '';
    const searchInput = document.getElementById('cov-customer-search');
    if (searchInput) { searchInput.value = ''; searchInput.focus(); }

    // Reset coverages
    this.selectedCustomerId = null;
    document.getElementById('coverage-content').innerHTML = '<div class="empty-state"><div class="empty-state-icon">🛡️</div><div class="empty-state-text">고객을 선택하면 보장현황이 표시됩니다</div></div>';
    document.getElementById('btn-add-coverage').style.display = 'none';
    document.getElementById('btn-report').style.display = 'none';
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

  _renderInfoCards() {
    const infoCards = [
      { title: '실손의료비 보험', desc: '실손보험 세대별 차이점, 자기부담금 비교', icon: '🏥', color: '#3b82f6', bg: '#eff6ff' },
      { title: '암보험 가이드', desc: '일반암/유사암/고액암 진단비 구성 방법', icon: '🎗️', color: '#db2777', bg: '#fdf2f8' },
      { title: '뇌/심장질환 보장', desc: '뇌혈관·심혈관 질환 보장범위 비교', icon: '🧠', color: '#7c3aed', bg: '#f5f3ff' },
      { title: '사망보장 설계', desc: '질병사망/상해사망 적정 보장금액 산출', icon: '⚱️', color: '#dc2626', bg: '#fef2f2' },
      { title: '후유장해 보장', desc: '질병/상해 후유장해 등급별 보장 안내', icon: '🦽', color: '#ea580c', bg: '#fff7ed' },
      { title: '운전자보험', desc: '교통사고처리지원금, 벌금, 변호사비용', icon: '🚗', color: '#059669', bg: '#ecfdf5' },
      { title: '어린이보험', desc: '자녀 보장설계 핵심 체크포인트', icon: '👶', color: '#f59e0b', bg: '#fffbeb' },
      { title: '연금/저축보험', desc: '비과세·세액공제 연금보험 비교', icon: '💰', color: '#8b5cf6', bg: '#f5f3ff' },
      { title: '보험 청구 가이드', desc: '보험금 청구 절차와 필요 서류 안내', icon: '📋', color: '#0891b2', bg: '#ecfeff' }
    ];

    return infoCards.map(card => `
      <div style="padding:16px;border-radius:12px;border:1px solid var(--gray-200);background:white;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.borderColor='${card.color}40';this.style.boxShadow='0 2px 8px ${card.color}15'" onmouseout="this.style.borderColor='var(--gray-200)';this.style.boxShadow='none'">
        <div style="display:flex;align-items:start;gap:12px;">
          <div style="width:40px;height:40px;border-radius:10px;background:${card.bg};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">${card.icon}</div>
          <div>
            <div style="font-size:14px;font-weight:600;color:var(--gray-800);margin-bottom:4px;">${card.title}</div>
            <div style="font-size:12px;color:var(--gray-400);line-height:1.5;">${card.desc}</div>
          </div>
        </div>
      </div>
    `).join('');
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
