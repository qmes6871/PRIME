// Messages Page - Smart Insurance Consultation & Customer Message System
const MessagesPage = {
  templates: [],
  customers: [],
  companies: [],
  _selectedCustomerId: null,
  _selectedType: '',
  _insuranceCategory: '생명',
  _selectedCompanyId: '',
  _productName: '',
  _premium: '',
  _callCenter: '',
  _claimDocs: [],
  _generalDocs: [],
  _showGeneralDocs: false,

  // 청구서류 목록
  _claimDocList: [
    '진료비 영수증', '진료비 세부내역서', '진단서', '수술확인서',
    '입원확인서', '퇴원확인서', '초진차트', '검사결과기록지',
    '약제비 영수증', '의사 소견서', '처방전', '응급실 기록지'
  ],

  // 일반서류 목록
  _generalDocList: [
    '신분증 앞면 사본', '가족관계증명서', '주민등록등본', '인감증명서',
    '위임장', '통장 사본', '자동이체 신청서', '보험증권 원본',
    '해지환급금 청구서', '보험계약 변경 신청서'
  ],

  // 안내 유형 목록
  _typeOptions: [
    { value: '담당자변경', label: '보험담당자 변경안내', icon: '👤', color: '#6366f1' },
    { value: '해지', label: '해지안내', icon: '📋', color: '#dc2626' },
    { value: '실효해지', label: '실효된보험 해지안내', icon: '⚠️', color: '#f59e0b' },
    { value: '청구서류', label: '보험금 청구서류 안내', icon: '🏥', color: '#059669' },
    { value: '자동이체해지', label: '자동이체 해지안내', icon: '💳', color: '#8b5cf6' }
  ],

  async render(params = {}) {
    try {
      const [templatesData, customersData, companiesData] = await Promise.all([
        API.getTemplates({ category: '메시지안내' }),
        API.getCustomers({ limit: 200 }),
        API.getInsuranceCompanies()
      ]);
      this.templates = templatesData.templates;
      this.customers = customersData.customers;
      this.companies = companiesData.companies;

      // 고객 자동 선택
      if (params.customerId) {
        this._selectedCustomerId = parseInt(params.customerId);
      }

      // 초기값이 없으면 첫번째 유형 선택
      if (!this._selectedType && this.templates.length > 0) {
        this._selectedType = this.templates[0].type;
      }

      return `
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:start;">
          <div>
            <h1 class="page-title" style="display:flex;align-items:center;gap:10px;">
              <span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:10px;">
                <svg width="18" height="18" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
              </span>
              고객 메세지 안내
            </h1>
            <p class="page-subtitle">고객 정보와 안내 유형을 선택하면 메시지가 자동으로 생성됩니다</p>
          </div>
          <button class="btn btn-secondary" style="border-radius:10px;display:flex;align-items:center;gap:6px;padding:8px 16px;border:1px solid var(--gray-200);" onclick="MessagesPage.showLogs()">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            발송 이력
          </button>
        </div>

        <!-- Main Content: Form + Preview -->
        <div class="consultation-layout" style="grid-template-columns:1fr 420px;gap:28px;">
          <!-- LEFT: Form Area -->
          <div style="display:flex;flex-direction:column;gap:0;" id="msg-form-area">
            ${this._renderFormArea()}
          </div>

          <!-- RIGHT: 메시지 미리보기 -->
          <div style="position:sticky;top:24px;align-self:start;">
            <div id="msg-preview-wrapper">
              ${this._renderPreviewPanel()}
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      showToast(err.message, 'error');
      return '<div class="empty-state"><div class="empty-state-text">데이터를 불러오는 중 오류가 발생했습니다.</div></div>';
    }
  },

  onRendered() {
    this.generatePreview();
  },

  // ==================== Form Area ====================
  _renderFormArea() {
    const selectedCustomer = this.customers.find(c => c.id === this._selectedCustomerId);
    const filteredCompanies = this.companies.filter(c => c.type === this._insuranceCategory);
    const selectedCompany = this.companies.find(c => c.id === parseInt(this._selectedCompanyId));

    return `
      <!-- 고객 정보 & 안내 설정 -->
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
        <div class="card-header" style="margin-bottom:16px;">
          <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#dbeafe,#c7d2fe);border-radius:8px;">
              <svg width="14" height="14" fill="none" stroke="#4338ca" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </span>
            고객 정보 및 안내 설정
          </h3>
        </div>

        <div class="grid-2" style="gap:12px;">
          <!-- 고객 선택 (검색형) -->
          <div class="form-group" style="position:relative;">
            <label class="form-label" style="font-size:12px;">고객 성함</label>
            <input type="text" class="form-input" id="msg-customer-search" placeholder="이름 또는 연락처로 검색..."
              value="${selectedCustomer ? Utils.escapeHtml(selectedCustomer.name) + ' (' + Utils.formatPhone(selectedCustomer.phone) + ')' : ''}"
              onfocus="MessagesPage.openCustomerDropdown()"
              oninput="MessagesPage.filterCustomerDropdown(this.value)"
              autocomplete="off"
              style="border-radius:10px;">
            <input type="hidden" id="msg-customer" value="${this._selectedCustomerId || ''}">
            <div id="msg-customer-dropdown" style="display:none;position:absolute;top:100%;left:0;right:0;z-index:100;background:white;border:1px solid var(--gray-200);border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.1);max-height:240px;overflow-y:auto;margin-top:4px;">
              ${this.customers.map(c => `
                <div onclick="MessagesPage.selectCustomer(${c.id})" style="display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background=''">
                  <div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#4338ca;flex-shrink:0;">${Utils.escapeHtml((c.name || '-')[0])}</div>
                  <div>
                    <div style="font-size:13px;font-weight:600;color:var(--gray-800);">${Utils.escapeHtml(c.name)}</div>
                    <div style="font-size:11px;color:var(--gray-400);">${Utils.formatPhone(c.phone)}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 안내 항목 선택 -->
          <div class="form-group">
            <label class="form-label" style="font-size:12px;">안내 항목</label>
            <select class="form-input" id="msg-type" onchange="MessagesPage.onTypeChange(this.value)" style="border-radius:10px;">
              ${this._typeOptions.map(t => `<option value="${t.value}" ${this._selectedType === t.value ? 'selected' : ''}>${t.icon} ${t.label}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- 보험사 선택 영역 -->
        <div style="margin-top:16px;padding:16px;background:linear-gradient(135deg,#f8fafc,#eef2ff);border-radius:12px;border:1px solid #e0e7ff;">
          <div style="font-size:12px;font-weight:600;color:#4338ca;margin-bottom:12px;">보험사 정보</div>

          <!-- 생명/손해 라디오 -->
          <div style="display:flex;gap:12px;margin-bottom:12px;">
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px;color:var(--gray-700);">
              <input type="radio" name="ins-category" value="생명" ${this._insuranceCategory === '생명' ? 'checked' : ''} onchange="MessagesPage.onCategoryChange('생명')" style="accent-color:#4338ca;">
              생명보험사
            </label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px;color:var(--gray-700);">
              <input type="radio" name="ins-category" value="손해" ${this._insuranceCategory === '손해' ? 'checked' : ''} onchange="MessagesPage.onCategoryChange('손해')" style="accent-color:#4338ca;">
              손해보험사
            </label>
          </div>

          <div class="grid-2" style="gap:10px;">
            <!-- 보험사 드롭다운 -->
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:11px;">보험사</label>
              <select class="form-input" id="msg-company" onchange="MessagesPage.onCompanyChange(this.value)" style="border-radius:8px;font-size:13px;">
                <option value="">선택</option>
                ${filteredCompanies.map(c => `<option value="${c.id}" ${this._selectedCompanyId == c.id ? 'selected' : ''}>${Utils.escapeHtml(c.name)}</option>`).join('')}
              </select>
            </div>

            <!-- 보험 종류 -->
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:11px;">보험 종류 (상품명)</label>
              <input type="text" class="form-input" id="msg-product" value="${Utils.escapeHtml(this._productName)}" oninput="MessagesPage.onFieldChange()" placeholder="예: 무배당 퍼펙트통합보험" style="border-radius:8px;font-size:13px;">
            </div>
          </div>

          <div class="grid-2" style="gap:10px;margin-top:10px;">
            <!-- 월보험료 -->
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:11px;">월 보험료 (원)</label>
              <input type="text" class="form-input" id="msg-premium" value="${this._premium}" oninput="Utils.formatMoneyInput(this); MessagesPage.onFieldChange()" placeholder="예: 50,000" style="border-radius:8px;font-size:13px;">
            </div>

            <!-- 콜센터 번호 -->
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:11px;">콜센터 번호 (자동입력)</label>
              <input type="text" class="form-input" id="msg-callcenter" value="${Utils.escapeHtml(this._callCenter)}" readonly style="border-radius:8px;font-size:13px;background:var(--gray-50);color:var(--gray-500);">
            </div>
          </div>
        </div>

        <!-- 조건부: 청구서류 체크리스트 -->
        ${this._selectedType === '청구서류' ? `
          <div style="margin-top:16px;padding:16px;background:#ecfdf5;border-radius:12px;border:1px solid #a7f3d0;">
            <div style="font-size:12px;font-weight:600;color:#059669;margin-bottom:12px;">🏥 보험금 청구 필요 서류 선택</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              ${this._claimDocList.map(doc => `
                <label style="display:flex;align-items:center;gap:6px;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:12px;background:white;border:1px solid ${this._claimDocs.includes(doc) ? '#86efac' : '#e5e7eb'};color:${this._claimDocs.includes(doc) ? '#166534' : 'var(--gray-600)'};font-weight:${this._claimDocs.includes(doc) ? '600' : '400'};">
                  <input type="checkbox" ${this._claimDocs.includes(doc) ? 'checked' : ''} onchange="MessagesPage.toggleClaimDoc('${doc}')" style="accent-color:#059669;width:14px;height:14px;">
                  ${doc}
                </label>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 팩스/일반 서류 안내 -->
        ${this._selectedType !== '청구서류' ? `
          <div style="margin-top:16px;">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;color:var(--gray-700);">
              <input type="checkbox" ${this._showGeneralDocs ? 'checked' : ''} onchange="MessagesPage.toggleGeneralDocsSection()" style="accent-color:#4338ca;width:16px;height:16px;">
              팩스/일반 서류 안내 포함하기
            </label>
            ${this._showGeneralDocs ? `
              <div style="margin-top:10px;padding:16px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
                <div style="font-size:12px;font-weight:600;color:var(--gray-600);margin-bottom:10px;">📄 서류 목록 선택</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                  ${this._generalDocList.map(doc => `
                    <label style="display:flex;align-items:center;gap:6px;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:12px;background:white;border:1px solid ${this._generalDocs.includes(doc) ? '#93c5fd' : '#e5e7eb'};color:${this._generalDocs.includes(doc) ? '#1e40af' : 'var(--gray-600)'};font-weight:${this._generalDocs.includes(doc) ? '600' : '400'};">
                      <input type="checkbox" ${this._generalDocs.includes(doc) ? 'checked' : ''} onchange="MessagesPage.toggleGeneralDoc('${doc}')" style="accent-color:#3b82f6;width:14px;height:14px;">
                      ${doc}
                    </label>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>

      <!-- Action Buttons -->
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;background:linear-gradient(135deg,#f8fafc,#f1f5f9);">
        <div style="display:flex;gap:10px;">
          <button class="btn" onclick="MessagesPage.copyMessage()" id="msg-copy-btn"
            style="flex:1;padding:12px;border-radius:10px;font-size:13px;font-weight:600;background:white;color:var(--gray-700);border:1.5px solid var(--gray-200);display:flex;align-items:center;justify-content:center;gap:6px;">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
            메시지 텍스트 복사
          </button>
          <button class="btn" onclick="MessagesPage.sendMessage()" id="msg-send-btn"
            style="flex:1;padding:12px;border-radius:10px;font-size:13px;font-weight:600;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;border:none;box-shadow:0 4px 14px rgba(99,102,241,0.3);display:flex;align-items:center;justify-content:center;gap:6px;">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            발송 기록 저장
          </button>
        </div>
      </div>
    `;
  },

  // ==================== Preview Panel ====================
  _renderPreviewPanel() {
    const agent = API.getAgent();
    const agentName = agent?.name || '설계사';

    return `
      <div style="background:white;border-radius:14px;box-shadow:0 1px 3px rgba(0,0,0,0.06);overflow:hidden;">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#0f172a,#312e81);padding:16px 20px;display:flex;align-items:center;gap:12px;">
          <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#818cf8);display:flex;align-items:center;justify-content:center;">
            <span style="font-size:14px;font-weight:700;color:white;">${Utils.escapeHtml(agentName[0] || 'P')}</span>
          </div>
          <div>
            <div style="color:white;font-size:14px;font-weight:700;">${Utils.escapeHtml(agentName)}</div>
            <div style="color:#a5b4fc;font-size:11px;">PRIMEASSET · 고객 안내 메시지</div>
          </div>
        </div>

        <!-- Editable Content -->
        <div style="padding:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span style="font-size:12px;font-weight:600;color:var(--gray-500);">메시지 내용 <span style="font-size:11px;color:var(--gray-400);font-weight:400;">(직접 수정 가능)</span></span>
            <span id="msg-char-count" style="font-size:11px;color:var(--gray-400);">0자</span>
          </div>
          <textarea class="form-input" id="msg-content" rows="22" oninput="MessagesPage._updateCharCount()" placeholder="왼쪽에서 고객과 안내 유형을 선택하면 메시지가 자동 생성됩니다..." style="border-radius:10px;font-size:13px;line-height:1.8;font-family:'Pretendard Variable',sans-serif;border:1px solid var(--gray-200);resize:vertical;background:#f8fafc;"></textarea>
        </div>

        <!-- Footer -->
        <div style="padding:0 16px 12px;text-align:center;font-size:10px;color:var(--gray-400);">
          PRIMEASSET · ${Utils.escapeHtml(agentName)} · ${new Date().toLocaleDateString('ko-KR')}
        </div>
      </div>
    `;
  },

  // ==================== Event Handlers ====================
  openCustomerDropdown() {
    const dropdown = document.getElementById('msg-customer-dropdown');
    if (dropdown) {
      dropdown.style.display = '';
      this.filterCustomerDropdown(document.getElementById('msg-customer-search')?.value || '');
    }
    // 바깥 클릭 시 닫기
    setTimeout(() => {
      const handler = (e) => {
        const dropdown = document.getElementById('msg-customer-dropdown');
        const input = document.getElementById('msg-customer-search');
        if (dropdown && !dropdown.contains(e.target) && e.target !== input) {
          dropdown.style.display = 'none';
          document.removeEventListener('click', handler);
        }
      };
      document.addEventListener('click', handler);
    }, 0);
  },

  filterCustomerDropdown(query) {
    const q = (query || '').toLowerCase();
    const dropdown = document.getElementById('msg-customer-dropdown');
    if (!dropdown) return;
    const filtered = this.customers.filter(c => {
      if (!q) return true;
      return (c.name || '').toLowerCase().includes(q) || (c.phone || '').includes(q);
    });
    if (filtered.length === 0) {
      dropdown.innerHTML = '<div style="padding:14px;text-align:center;color:var(--gray-400);font-size:13px;">검색 결과가 없습니다</div>';
    } else {
      dropdown.innerHTML = filtered.map(c => `
        <div onclick="MessagesPage.selectCustomer(${c.id})" style="display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background=''">
          <div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#4338ca;flex-shrink:0;">${Utils.escapeHtml((c.name || '-')[0])}</div>
          <div>
            <div style="font-size:13px;font-weight:600;color:var(--gray-800);">${Utils.escapeHtml(c.name)}</div>
            <div style="font-size:11px;color:var(--gray-400);">${Utils.formatPhone(c.phone)}</div>
          </div>
        </div>
      `).join('');
    }
    dropdown.style.display = '';
  },

  selectCustomer(id) {
    this._selectedCustomerId = id;
    const customer = this.customers.find(c => c.id === id);
    const input = document.getElementById('msg-customer-search');
    const hidden = document.getElementById('msg-customer');
    if (input && customer) input.value = customer.name + ' (' + Utils.formatPhone(customer.phone) + ')';
    if (hidden) hidden.value = id;
    const dropdown = document.getElementById('msg-customer-dropdown');
    if (dropdown) dropdown.style.display = 'none';
    this.generatePreview();
  },

  onCustomerChange(value) {
    this._selectedCustomerId = value ? parseInt(value) : null;
    this.generatePreview();
  },

  onTypeChange(value) {
    this._selectedType = value;
    this._claimDocs = [];
    this._generalDocs = [];
    this._showGeneralDocs = false;
    // Re-render form to show/hide conditional sections
    const formArea = document.getElementById('msg-form-area');
    if (formArea) formArea.innerHTML = this._renderFormArea();
    this.generatePreview();
  },

  onCategoryChange(category) {
    this._insuranceCategory = category;
    this._selectedCompanyId = '';
    this._callCenter = '';
    // Re-render form for new company list
    const formArea = document.getElementById('msg-form-area');
    if (formArea) formArea.innerHTML = this._renderFormArea();
    this.generatePreview();
  },

  onCompanyChange(value) {
    this._selectedCompanyId = value;
    const company = this.companies.find(c => c.id === parseInt(value));
    this._callCenter = company?.phone || '';
    const callEl = document.getElementById('msg-callcenter');
    if (callEl) callEl.value = this._callCenter ? Utils.formatPhone(this._callCenter) : '';
    this.generatePreview();
  },

  onFieldChange() {
    this._productName = document.getElementById('msg-product')?.value || '';
    this._premium = document.getElementById('msg-premium')?.value || '';
    this.generatePreview();
  },

  toggleClaimDoc(doc) {
    const idx = this._claimDocs.indexOf(doc);
    if (idx >= 0) this._claimDocs.splice(idx, 1);
    else this._claimDocs.push(doc);
    this.generatePreview();
  },

  toggleGeneralDocsSection() {
    this._showGeneralDocs = !this._showGeneralDocs;
    if (!this._showGeneralDocs) this._generalDocs = [];
    const formArea = document.getElementById('msg-form-area');
    if (formArea) formArea.innerHTML = this._renderFormArea();
    this.generatePreview();
  },

  toggleGeneralDoc(doc) {
    const idx = this._generalDocs.indexOf(doc);
    if (idx >= 0) this._generalDocs.splice(idx, 1);
    else this._generalDocs.push(doc);
    this.generatePreview();
  },

  // ==================== Message Generation ====================
  generatePreview() {
    const agent = API.getAgent();
    const customer = this.customers.find(c => c.id === this._selectedCustomerId);
    const company = this.companies.find(c => c.id === parseInt(this._selectedCompanyId));
    const customerName = customer?.name || '고객';
    const agentName = agent?.name || '설계사';
    const agentPhone = agent?.phone ? Utils.formatPhone(agent.phone) : '';
    const companyName = company?.name || '';
    const productName = this._productName;
    const premium = this._premium;
    const callCenter = this._callCenter ? Utils.formatPhone(this._callCenter) : '';

    // 템플릿에서 content 가져오기
    const template = this.templates.find(t => t.type === this._selectedType);

    let message = '';

    if (template) {
      // 템플릿 변수 치환
      const vars = {
        '고객명': customerName,
        '설계사명': agentName,
        '설계사연락처': agentPhone,
        '보험사명': companyName || '(보험사명)',
        '보험사전화': callCenter || '(콜센터)',
        '상품명': productName || '(상품명)',
        '보험료': premium || '(보험료)',
      };

      message = Utils.replaceTemplateVars(template.content, vars);
    } else {
      // 템플릿이 없으면 기본 생성
      message = this._buildDefaultMessage(customerName, agentName, agentPhone, companyName, productName, premium, callCenter);
    }

    // 청구서류 추가
    if (this._selectedType === '청구서류' && this._claimDocs.length > 0) {
      message += '\n\n[📌 필수 준비 서류 안내 (보험금 청구용)]';
      this._claimDocs.forEach(doc => { message += '\n- ' + doc; });
    }

    // 일반서류 추가
    if (this._showGeneralDocs && this._generalDocs.length > 0) {
      message += '\n\n[📄 팩스/일반 서류 안내]';
      this._generalDocs.forEach(doc => { message += '\n- ' + doc; });
    }

    const contentEl = document.getElementById('msg-content');
    if (contentEl) {
      contentEl.value = message;
      this._updateCharCount();
    }
  },

  _buildDefaultMessage(customerName, agentName, agentPhone, companyName, productName, premium, callCenter) {
    let msg = `안녕하세요. ${customerName}님,\n보험전문가 ${agentName}입니다.\n`;

    switch (this._selectedType) {
      case '담당자변경':
        msg += `\n새롭게 고객님의 담당자가 되었습니다.\n기존 보험에 대해 궁금하신 점이나 보장 점검이 필요하시면 편하게 말씀해 주세요.\n`;
        break;
      case '해지':
        msg += `\n해지 안내입니다. 아래 보험사에 연락하셔서 해지 절차를 진행해 주세요.\n`;
        break;
      case '실효해지':
        msg += `\n실효 상태인 보험의 최종 해지 안내입니다.\n보험료 미납으로 실효된 보험에 대해 안내드립니다.\n`;
        break;
      case '청구서류':
        msg += `\n보험금 청구를 위한 안내입니다.\n아래 서류를 준비하셔서 제출해 주세요.\n`;
        break;
      case '자동이체해지':
        msg += `\n자동이체 해지 관련 안내입니다.\n아래 보험사 콜센터로 연락하시면 자동이체 변경/해지를 진행하실 수 있습니다.\n`;
        break;
    }

    if (this._selectedType !== '청구서류' && (companyName || productName || premium)) {
      msg += '\n';
      if (companyName) msg += `▪ 보험사: ${companyName}\n`;
      if (productName) msg += `▪ 상품명: ${productName}\n`;
      if (premium) msg += `▪ 보험료: ${premium}원\n`;
      if (callCenter) msg += `📞 콜센터: ${callCenter}\n`;
    }

    msg += `\n진행하시면서 궁금한 점이 있으시면 답장 남겨주세요.`;
    if (agentPhone) msg += `\n연락처: ${agentPhone}`;

    return msg;
  },

  _updateCharCount() {
    const contentEl = document.getElementById('msg-content');
    const countEl = document.getElementById('msg-char-count');
    if (contentEl && countEl) {
      const len = contentEl.value.length;
      const type = len > 2000 ? 'LMS' : len > 90 ? 'LMS' : 'SMS';
      const color = len > 2000 ? '#dc2626' : len > 90 ? '#f59e0b' : '#10b981';
      countEl.innerHTML = `<span style="color:${color};font-weight:600;">${len}자</span> <span style="padding:1px 6px;border-radius:3px;background:${color}15;color:${color};font-size:10px;font-weight:600;">${type}</span>`;
    }
  },

  // ==================== Actions ====================
  async copyMessage() {
    const content = document.getElementById('msg-content')?.value;
    if (!content) {
      showToast('메시지 내용이 없습니다.', 'error');
      return;
    }

    try {
      await Utils.copyToClipboard(content);

      const btn = document.getElementById('msg-copy-btn');
      if (btn) {
        btn.innerHTML = '<svg width="16" height="16" fill="none" stroke="#10b981" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg> 복사 완료!';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#10b981';
        btn.style.background = '#ecfdf5';
        setTimeout(() => {
          if (btn) {
            btn.innerHTML = '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg> 메시지 텍스트 복사';
            btn.style.borderColor = '';
            btn.style.color = '';
            btn.style.background = '';
          }
        }, 2000);
      }

      showToast('메시지가 클립보드에 복사되었습니다! 카카오톡에 붙여넣기 하세요.', 'success');

      // 발송 기록 저장
      if (this._selectedCustomerId) {
        const customer = this.customers.find(c => c.id === this._selectedCustomerId);
        const template = this.templates.find(t => t.type === this._selectedType);
        await API.sendMessage({
          customer_id: this._selectedCustomerId,
          template_id: template?.id,
          type: '클립보드',
          content,
          recipient_name: customer?.name,
          recipient_phone: customer?.phone
        });
      }
    } catch (err) {
      showToast('복사에 실패했습니다.', 'error');
    }
  },

  async sendMessage() {
    const content = document.getElementById('msg-content')?.value;
    if (!content) {
      showToast('메시지 내용이 없습니다.', 'error');
      return;
    }
    if (!this._selectedCustomerId) {
      showToast('고객을 선택해주세요.', 'error');
      return;
    }

    try {
      const customer = this.customers.find(c => c.id === this._selectedCustomerId);
      const template = this.templates.find(t => t.type === this._selectedType);

      await API.sendMessage({
        customer_id: this._selectedCustomerId,
        template_id: template?.id,
        type: '클립보드',
        content,
        recipient_name: customer?.name,
        recipient_phone: customer?.phone
      });

      const btn = document.getElementById('msg-send-btn');
      if (btn) {
        btn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg> 저장 완료!';
        btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
        setTimeout(() => {
          if (btn) {
            btn.innerHTML = '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg> 발송 기록 저장';
            btn.style.background = 'linear-gradient(135deg,#6366f1,#8b5cf6)';
          }
        }, 2000);
      }

      showToast('발송 기록이 저장되었습니다!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  // ==================== Logs ====================
  async showLogs() {
    try {
      const data = await API.getMessageLogs();
      const logs = data.logs || [];

      const _templateMeta = {
        '담당자변경': { color: '#6366f1', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
        '해지': { color: '#dc2626', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        '실효해지': { color: '#f59e0b', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        '청구서류': { color: '#059669', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        '자동이체해지': { color: '#8b5cf6', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' }
      };

      let logsHtml = '';
      if (logs.length > 0) {
        logsHtml = `
          <div style="max-height:500px;overflow-y:auto;">
            ${logs.map((l, i) => {
              const tMeta = _templateMeta[l.Template?.type] || { color: '#6b7280', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' };
              return `
                <div style="display:flex;gap:12px;padding:14px 0;${i < logs.length - 1 ? 'border-bottom:1px solid var(--gray-100);' : ''}">
                  <div style="width:36px;height:36px;border-radius:10px;background:${tMeta.color}15;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <svg width="16" height="16" fill="none" stroke="${tMeta.color}" stroke-width="2" viewBox="0 0 24 24"><path d="${tMeta.icon}"/></svg>
                  </div>
                  <div style="flex:1;min-width:0;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <div style="font-size:14px;font-weight:600;color:var(--gray-800);">${Utils.escapeHtml(l.recipient_name || l.Customer?.name || '-')}</div>
                      <span style="padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;${l.status === '성공' ? 'background:#dcfce7;color:#16a34a;' : 'background:#fef3c7;color:#d97706;'}">${l.status || '발송'}</span>
                    </div>
                    <div style="font-size:12px;color:var(--gray-400);margin-top:2px;">
                      ${l.Template?.type || l.type || '-'} · ${Utils.formatDateTime(l.sent_at || l.created_at)}
                    </div>
                    <div style="font-size:11px;color:var(--gray-500);margin-top:6px;background:var(--gray-50);padding:8px 10px;border-radius:8px;line-height:1.5;max-height:60px;overflow:hidden;text-overflow:ellipsis;">
                      ${Utils.escapeHtml((l.content || '').substring(0, 100))}${(l.content || '').length > 100 ? '...' : ''}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      } else {
        logsHtml = `
          <div style="text-align:center;padding:40px 20px;">
            <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#f3f4f6,#e5e7eb);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
              <svg width="24" height="24" fill="none" stroke="#9ca3af" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div style="font-size:14px;color:var(--gray-500);font-weight:500;">발송 이력이 없습니다</div>
          </div>
        `;
      }

      Modal.show(`
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;">
            <svg width="14" height="14" fill="none" stroke="#4338ca" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          발송 이력
          <span style="padding:2px 8px;border-radius:10px;background:var(--gray-100);font-size:12px;color:var(--gray-500);">${logs.length}건</span>
        </div>
      `, logsHtml, '<button class="btn btn-secondary" onclick="Modal.close()" style="border-radius:8px;">닫기</button>');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }
};
