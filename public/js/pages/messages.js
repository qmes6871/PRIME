// Messages Page - Smart Insurance Consultation & Customer Message System
const MessagesPage = {
  templates: [],
  customers: [],
  companies: [],
  _selectedCustomerId: null,
  _manualName: '',
  _manualPhone: '',
  _selectedType: '',
  _insuranceCategory: '생명',
  _selectedCompanyId: '',
  _productName: '',
  _premium: '',
  _callCenter: '',
  _claimDocs: [],
  _generalDocs: [],
  _showGeneralDocs: false,
  _currentTab: 'info',
  // 상담 알림톡 전용 상태
  _consultMethod: '전화상담',
  _consultDate: '',
  _meetRegion: '',
  _meetDetail: '',
  _infoType: '기본구성안내',

  // 보험 자료 링크
  _infoLinks: {
    '기본구성안내': '📌 [기본 구성 가이드]\n- 내게 맞는 완벽한 기본 보험 세팅법\n- 실손의료비 100% 활용하는 꿀팁',
    '종합보험안내': '📌 [종합보험 가이드]\n- 종합보험 가입하는 요령, 이것만 아세요!\n- 내 나이에 맞는 납입기간은 어떻게 설정할까?',
    '암보험안내': '📌 [암보험 가이드]\n- 암보험, 면책기간과 감액기간의 진실\n- 표적항암치료비 특약, 과연 필수일까?',
    '운전자보험안내': '📌 [운전자보험 가이드]\n- 운전자보험 필수 특약 3가지 완벽 정리\n- 자동차보험과 운전자보험의 결정적 차이',
    '연금보험안내': '📌 [연금보험 가이드]\n- 든든한 노후를 위한 연금보험 기초\n- 숨어있는 비과세 혜택 완벽하게 챙기기'
  },

  // 탭 카테고리
  _tabCategories: [
    { key: 'info', label: '안내 항목' },
    { key: 'alimtalk', label: '상담 알림톡' },
    { key: 'special', label: '특별알림' }
  ],

  // 탭별 기본 하위 항목
  _defaultTabItems: {
    info: [
      { value: '담당자변경', label: '보험담당자 변경안내', icon: '👤', color: '#6366f1' },
      { value: '해지', label: '해지안내', icon: '📋', color: '#dc2626' },
      { value: '실효해지', label: '실효된보험 해지안내', icon: '⚠️', color: '#f59e0b' },
      { value: '청구서류', label: '보험금 청구서류 안내', icon: '🏥', color: '#059669' },
      { value: '자동이체해지', label: '자동이체 해지안내', icon: '💳', color: '#8b5cf6' }
    ],
    alimtalk: [
      { value: 'intro', label: '자기소개 및 인사', desc: '첫인상을 결정하는 전문가 인사', icon: '👋', color: '#6366f1' },
      { value: 'schedule', label: '상담 진행일정 안내', desc: '상담 방식·일시·장소 확정 안내', icon: '📅', color: '#059669' },
      { value: 'info_doc', label: '보험 자료 안내', desc: '맞춤형 보험 정보 사전 안내', icon: '📚', color: '#d97706' },
      { value: 'finish', label: '상담종료 인사와 소개', desc: '감사 인사 및 소개 요청', icon: '🎁', color: '#db2777' }
    ],
    special: [
      { value: 'first_greeting', label: '첫 인사 메시지', desc: '신규 고객에게 보내는 첫 인사', icon: '💌', color: '#6366f1' },
      { value: 'reservation_confirm', label: '상담 예약 확인', desc: '상담 일정 확인 및 리마인드', icon: '📆', color: '#059669' },
      { value: 'followup', label: '상담 후 팔로업', desc: '상담 이후 만족도 확인 및 후속 안내', icon: '🔄', color: '#d97706' }
    ]
  },
  _tabItems: { info: [], alimtalk: [], special: [] },

  _categoryToTab: { '메시지안내': 'info', '알림톡': 'alimtalk', '특별알림': 'special' },
  _tabColors: ['#6366f1', '#059669', '#d97706', '#db2777', '#8b5cf6', '#dc2626', '#0891b2', '#ea580c'],

  _buildTabItemsFromTemplates() {
    // 기본 항목 복사
    this._tabItems = {};
    for (const key in this._defaultTabItems) {
      this._tabItems[key] = [...this._defaultTabItems[key]];
    }
    // DB 템플릿 중 기본 항목에 없는 것 추가
    this.templates.forEach(t => {
      const tabKey = this._categoryToTab[t.category];
      if (!tabKey) return;
      const exists = this._tabItems[tabKey].some(item => item.value === t.type);
      if (!exists) {
        const colorIdx = this._tabItems[tabKey].length % this._tabColors.length;
        this._tabItems[tabKey].push({
          value: t.type,
          label: t.title || t.type,
          desc: '',
          icon: '📝',
          color: this._tabColors[colorIdx]
        });
      }
    });
  },

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
      const [templatesData, alimtalkTemplatesData, specialTemplatesData, customersData, companiesData] = await Promise.all([
        API.getTemplates({ category: '메시지안내' }),
        API.getTemplates({ category: '알림톡' }),
        API.getTemplates({ category: '특별알림' }),
        API.getCustomers({ limit: 200 }),
        API.getInsuranceCompanies()
      ]);
      this.templates = [...templatesData.templates, ...alimtalkTemplatesData.templates, ...specialTemplatesData.templates];
      this.customers = customersData.customers;
      this.companies = companiesData.companies;

      // 템플릿 기반으로 탭 항목 동적 구성
      this._buildTabItemsFromTemplates();

      // 고객 자동 선택
      if (params.customerId) {
        this._selectedCustomerId = parseInt(params.customerId);
      }

      // 초기값이 없으면 현재 탭의 첫번째 항목 선택
      const currentItems = this._tabItems[this._currentTab] || [];
      if (!this._selectedType && currentItems.length > 0) {
        this._selectedType = currentItems[0].value;
      }

      return `
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:start;">
          <div>
            <h1 class="page-title" style="display:flex;align-items:center;gap:10px;">
              <span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:10px;">
                <svg width="18" height="18" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
              </span>
              상담 알림톡
            </h1>
            <p class="page-subtitle">고객 정보와 안내 유형을 선택하면 메시지가 자동으로 생성됩니다</p>
          </div>
          <button class="btn btn-secondary" style="border-radius:10px;display:flex;align-items:center;gap:6px;padding:8px 16px;border:1px solid var(--gray-200);" onclick="MessagesPage.showLogs()">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            발송 이력
          </button>
        </div>

        <!-- Main Content: 2-column layout -->
        <div style="display:grid;grid-template-columns:40% 60%;gap:28px;">
          <!-- LEFT: 고객선택 + 탭 + 인라인 폼 -->
          <div style="display:flex;flex-direction:column;gap:0;">
            ${this._renderCustomerCard()}
            ${this._renderTabSection()}
          </div>

          <!-- RIGHT: 메시지 미리보기 (1줄부터 고정) -->
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

  // ==================== Claim Docs Inline ====================
  _renderClaimDocsInline() {
    return `
      <div style="padding:14px 16px;background:#eef2ff;border:2px solid #6366f1;border-top:none;border-radius:0 0 14px 14px;" onclick="event.stopPropagation()">
        <div style="font-size:12px;font-weight:600;color:#059669;margin-bottom:10px;">🏥 보험금 청구 필요 서류 선택</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          ${this._claimDocList.map(doc => `
            <label style="display:flex;align-items:center;gap:6px;padding:5px 8px;border-radius:8px;cursor:pointer;font-size:11px;background:white;border:1px solid ${this._claimDocs.includes(doc) ? '#86efac' : '#e5e7eb'};color:${this._claimDocs.includes(doc) ? '#166534' : 'var(--gray-600)'};font-weight:${this._claimDocs.includes(doc) ? '600' : '400'};">
              <input type="checkbox" ${this._claimDocs.includes(doc) ? 'checked' : ''} onchange="MessagesPage.toggleClaimDoc('${doc}')" style="accent-color:#059669;width:13px;height:13px;">
              ${doc}
            </label>
          `).join('')}
        </div>
      </div>
    `;
  },

  // ==================== 고객 선택 카드 (탭 위) ====================
  _renderCustomerCard() {
    const selectedCustomer = this.customers.find(c => c.id === this._selectedCustomerId);
    return `
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:16px;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:linear-gradient(135deg,#dbeafe,#c7d2fe);border-radius:10px;">
            <svg width="16" height="16" fill="none" stroke="#4338ca" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </span>
          <h3 style="font-size:16px;font-weight:700;color:var(--gray-800);margin:0;">고객 정보</h3>
        </div>

        <!-- 기존 고객 검색 -->
        <div class="form-group" style="position:relative;margin-bottom:10px;">
          <label style="font-size:11px;font-weight:600;color:#4338ca;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;">
            등록된 고객 검색
            ${this._selectedCustomerId ? `<span onclick="MessagesPage.clearCustomer()" style="font-size:10px;color:var(--gray-400);cursor:pointer;font-weight:400;">초기화</span>` : ''}
          </label>
          <input type="text" class="form-input" id="msg-customer-search" placeholder="이름 또는 연락처로 검색..."
            value="${selectedCustomer ? Utils.escapeHtml(selectedCustomer.name) + ' (' + Utils.formatPhone(selectedCustomer.phone) + ')' : ''}"
            onfocus="MessagesPage.openCustomerDropdown()"
            oninput="MessagesPage.filterCustomerDropdown(this.value)"
            autocomplete="off"
            style="border-radius:10px;font-size:13px;${this._selectedCustomerId ? 'background:#eef2ff;border-color:#c7d2fe;' : ''}">
          <input type="hidden" id="msg-customer" value="${this._selectedCustomerId || ''}">
          <div id="msg-customer-dropdown" style="display:none;position:absolute;top:100%;left:0;right:0;z-index:100;background:white;border:1px solid var(--gray-200);border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.1);max-height:200px;overflow-y:auto;margin-top:4px;">
            ${this.customers.map(c => `
              <div onclick="MessagesPage.selectCustomer(${c.id})" style="display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background=''">
                <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;color:#4338ca;flex-shrink:0;">${Utils.escapeHtml((c.name || '-')[0])}</div>
                <div>
                  <div style="font-size:12px;font-weight:600;color:var(--gray-800);">${Utils.escapeHtml(c.name)}</div>
                  <div style="font-size:10px;color:var(--gray-400);">${Utils.formatPhone(c.phone)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 직접 입력 -->
        ${!this._selectedCustomerId ? `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div class="form-group" style="margin-bottom:0;">
              <label style="font-size:11px;color:var(--gray-500);margin-bottom:4px;display:block;">이름 직접 입력</label>
              <input type="text" class="form-input" id="msg-manual-name" value="${Utils.escapeHtml(this._manualName)}" oninput="MessagesPage.onManualNameChange(this.value)" placeholder="홍길동" style="border-radius:10px;font-size:13px;">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label style="font-size:11px;color:var(--gray-500);margin-bottom:4px;display:block;">연락처 직접 입력</label>
              <input type="text" class="form-input" id="msg-manual-phone" value="${Utils.escapeHtml(this._manualPhone)}" oninput="MessagesPage.onManualPhoneChange(this.value)" placeholder="010-0000-0000" style="border-radius:10px;font-size:13px;">
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  // ==================== 선택 항목 인라인 폼 ====================
  _renderItemInlineForm(itemValue) {
    const isAlimtalk = this._currentTab === 'alimtalk';

    let formContent = '';

    if (isAlimtalk) {
      formContent = this._renderAlimtalkInlineFields(itemValue);
    } else if (this._currentTab === 'special') {
      formContent = '';
    } else {
      formContent = this._renderInfoInlineFields(itemValue);
    }

    if (!formContent) return '';

    return `
      <div style="padding:16px;background:#eef2ff;border:2px solid #6366f1;border-top:none;border-radius:0 0 14px 14px;" onclick="event.stopPropagation()">
        ${formContent}
      </div>
    `;
  },

  _renderCustomerSearchCompact(selectedCustomer) {
    const isManual = !this._selectedCustomerId && (this._manualName || this._manualPhone);
    const showManual = isManual || (!this._selectedCustomerId && !selectedCustomer);
    return `
      <div style="margin-bottom:12px;">
        <!-- 기존 고객 검색 -->
        <div class="form-group" style="position:relative;margin-bottom:8px;">
          <label style="font-size:11px;font-weight:600;color:#4338ca;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;">
            고객 성함
            ${this._selectedCustomerId ? `<span onclick="MessagesPage.clearCustomer()" style="font-size:10px;color:var(--gray-400);cursor:pointer;font-weight:400;">초기화</span>` : ''}
          </label>
          <input type="text" class="form-input" id="msg-customer-search" placeholder="등록된 고객 검색 또는 아래에 직접 입력"
            value="${selectedCustomer ? Utils.escapeHtml(selectedCustomer.name) + ' (' + Utils.formatPhone(selectedCustomer.phone) + ')' : ''}"
            onfocus="MessagesPage.openCustomerDropdown()"
            oninput="MessagesPage.filterCustomerDropdown(this.value)"
            autocomplete="off"
            style="border-radius:8px;font-size:13px;padding:10px 12px;${this._selectedCustomerId ? 'background:#eef2ff;border-color:#c7d2fe;' : ''}">
          <input type="hidden" id="msg-customer" value="${this._selectedCustomerId || ''}">
          <div id="msg-customer-dropdown" style="display:none;position:absolute;top:100%;left:0;right:0;z-index:100;background:white;border:1px solid var(--gray-200);border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.1);max-height:200px;overflow-y:auto;margin-top:4px;">
            ${this.customers.map(c => `
              <div onclick="MessagesPage.selectCustomer(${c.id})" style="display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background=''">
                <div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;color:#4338ca;flex-shrink:0;">${Utils.escapeHtml((c.name || '-')[0])}</div>
                <div>
                  <div style="font-size:12px;font-weight:600;color:var(--gray-800);">${Utils.escapeHtml(c.name)}</div>
                  <div style="font-size:10px;color:var(--gray-400);">${Utils.formatPhone(c.phone)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <!-- 직접 입력 -->
        ${!this._selectedCustomerId ? `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div>
              <label style="font-size:10px;color:var(--gray-500);display:block;margin-bottom:4px;">이름 직접 입력</label>
              <input type="text" class="form-input" id="msg-manual-name" value="${Utils.escapeHtml(this._manualName)}" oninput="MessagesPage.onManualNameChange(this.value)" placeholder="홍길동" style="border-radius:8px;font-size:12px;padding:8px;">
            </div>
            <div>
              <label style="font-size:10px;color:var(--gray-500);display:block;margin-bottom:4px;">연락처 직접 입력</label>
              <input type="text" class="form-input" id="msg-manual-phone" value="${Utils.escapeHtml(this._manualPhone)}" oninput="MessagesPage.onManualPhoneChange(this.value)" placeholder="010-0000-0000" style="border-radius:8px;font-size:12px;padding:8px;">
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  clearCustomer() {
    this._selectedCustomerId = null;
    this._reRenderAll();
  },

  onManualNameChange(value) {
    this._manualName = value;
    this.generatePreview();
  },

  onManualPhoneChange(value) {
    this._manualPhone = value;
  },

  _renderInfoInlineFields(itemValue) {
    const filteredCompanies = this.companies.filter(c => c.type === this._insuranceCategory);

    return `
      <!-- 보험사 정보 -->
      ${itemValue !== '청구서류' ? `
      <div style="padding:12px;background:white;border-radius:10px;border:1px solid #e0e7ff;margin-bottom:10px;">
        <div style="font-size:11px;font-weight:600;color:#4338ca;margin-bottom:10px;">보험사 정보</div>
        <div style="display:flex;gap:10px;margin-bottom:10px;">
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-size:12px;color:var(--gray-700);">
            <input type="radio" name="ins-category" value="생명" ${this._insuranceCategory === '생명' ? 'checked' : ''} onchange="MessagesPage.onCategoryChange('생명')" style="accent-color:#4338ca;">
            생명보험사
          </label>
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-size:12px;color:var(--gray-700);">
            <input type="radio" name="ins-category" value="손해" ${this._insuranceCategory === '손해' ? 'checked' : ''} onchange="MessagesPage.onCategoryChange('손해')" style="accent-color:#4338ca;">
            손해보험사
          </label>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div>
            <label style="font-size:10px;color:var(--gray-500);display:block;margin-bottom:4px;">보험사</label>
            <select class="form-input" id="msg-company" onchange="MessagesPage.onCompanyChange(this.value)" style="border-radius:8px;font-size:12px;padding:8px;">
              <option value="">선택</option>
              ${filteredCompanies.map(c => `<option value="${c.id}" ${this._selectedCompanyId == c.id ? 'selected' : ''}>${Utils.escapeHtml(c.name)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:10px;color:var(--gray-500);display:block;margin-bottom:4px;">상품명</label>
            <input type="text" class="form-input" id="msg-product" value="${Utils.escapeHtml(this._productName)}" oninput="MessagesPage.onFieldChange()" placeholder="예: 퍼펙트통합보험" style="border-radius:8px;font-size:12px;padding:8px;">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">
          <div>
            <label style="font-size:10px;color:var(--gray-500);display:block;margin-bottom:4px;">월 보험료</label>
            <input type="text" class="form-input" id="msg-premium" value="${this._premium}" oninput="Utils.formatMoneyInput(this); MessagesPage.onFieldChange()" placeholder="예: 50,000" style="border-radius:8px;font-size:12px;padding:8px;">
          </div>
          <div>
            <label style="font-size:10px;color:var(--gray-500);display:block;margin-bottom:4px;">콜센터 (자동)</label>
            <input type="text" class="form-input" id="msg-callcenter" value="${Utils.escapeHtml(this._callCenter)}" readonly style="border-radius:8px;font-size:12px;padding:8px;background:var(--gray-50);color:var(--gray-500);">
          </div>
        </div>
      </div>
      ` : ''}

      <!-- 청구서류 선택 -->
      ${itemValue === '청구서류' ? `
        <div style="margin-bottom:10px;">
          <div style="font-size:11px;font-weight:600;color:#059669;margin-bottom:8px;">🏥 보험금 청구 필요 서류 선택</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;">
            ${this._claimDocList.map(doc => `
              <label style="display:flex;align-items:center;gap:5px;padding:5px 8px;border-radius:7px;cursor:pointer;font-size:11px;background:white;border:1px solid ${this._claimDocs.includes(doc) ? '#86efac' : '#e5e7eb'};color:${this._claimDocs.includes(doc) ? '#166534' : 'var(--gray-600)'};font-weight:${this._claimDocs.includes(doc) ? '600' : '400'};">
                <input type="checkbox" ${this._claimDocs.includes(doc) ? 'checked' : ''} onchange="MessagesPage.toggleClaimDoc('${doc}')" style="accent-color:#059669;width:12px;height:12px;">
                ${doc}
              </label>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- 팩스/일반 서류 안내 -->
      ${itemValue !== '청구서류' ? `
        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;color:var(--gray-700);">
          <input type="checkbox" ${this._showGeneralDocs ? 'checked' : ''} onchange="MessagesPage.toggleGeneralDocsSection()" style="accent-color:#4338ca;width:14px;height:14px;">
          팩스/일반 서류 안내 포함하기
        </label>
        ${this._showGeneralDocs ? `
          <div style="margin-top:8px;padding:10px;background:white;border-radius:8px;border:1px solid #e2e8f0;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;">
              ${this._generalDocList.map(doc => `
                <label style="display:flex;align-items:center;gap:5px;padding:5px 8px;border-radius:7px;cursor:pointer;font-size:11px;background:white;border:1px solid ${this._generalDocs.includes(doc) ? '#93c5fd' : '#e5e7eb'};color:${this._generalDocs.includes(doc) ? '#1e40af' : 'var(--gray-600)'};font-weight:${this._generalDocs.includes(doc) ? '600' : '400'};">
                  <input type="checkbox" ${this._generalDocs.includes(doc) ? 'checked' : ''} onchange="MessagesPage.toggleGeneralDoc('${doc}')" style="accent-color:#3b82f6;width:12px;height:12px;">
                  ${doc}
                </label>
              `).join('')}
            </div>
          </div>
        ` : ''}
      ` : ''}
    `;
  },

  _renderAlimtalkInlineFields(itemValue) {
    const regions = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산'];
    const infoTypes = [
      { value: '기본구성안내', label: '기본구성 안내' },
      { value: '종합보험안내', label: '종합보험 안내' },
      { value: '암보험안내', label: '암보험 안내' },
      { value: '운전자보험안내', label: '운전자보험 안내' },
      { value: '연금보험안내', label: '연금보험 안내' }
    ];

    let extra = '';

    if (itemValue === 'schedule') {
      extra = `
        <div style="padding:12px;background:white;border-radius:10px;border:1px solid #bbf7d0;">
          <div style="font-size:11px;font-weight:600;color:#059669;margin-bottom:10px;">📅 상담 일정 설정</div>
          <div style="margin-bottom:10px;">
            <label style="font-size:10px;color:var(--gray-500);display:block;margin-bottom:4px;">상담 방법</label>
            <div style="display:flex;gap:6px;">
              ${['대면상담', '전화상담', '카톡상담'].map(m => `
                <label style="flex:1;display:flex;align-items:center;justify-content:center;gap:4px;padding:8px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:${this._consultMethod === m ? '600' : '400'};border:1.5px solid ${this._consultMethod === m ? '#059669' : '#e5e7eb'};background:${this._consultMethod === m ? '#ecfdf5' : 'white'};color:${this._consultMethod === m ? '#059669' : 'var(--gray-600)'};transition:all 0.2s;">
                  <input type="radio" name="consult-method" value="${m}" ${this._consultMethod === m ? 'checked' : ''} onchange="MessagesPage.onConsultMethodChange('${m}')" style="display:none;">
                  ${m === '대면상담' ? '🤝' : m === '전화상담' ? '📞' : '💬'} ${m}
                </label>
              `).join('')}
            </div>
          </div>
          <div style="margin-bottom:${this._consultMethod === '대면상담' ? '10px' : '0'};">
            <label style="font-size:10px;color:var(--gray-500);display:block;margin-bottom:4px;">예정 일시</label>
            <input type="text" class="form-input" id="msg-consult-date" value="${Utils.escapeHtml(this._consultDate)}" oninput="MessagesPage.onConsultDateChange(this.value)" placeholder="예: 25년 3월 25일 오후 2시" style="border-radius:8px;font-size:12px;padding:8px;">
          </div>
          ${this._consultMethod === '대면상담' ? `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div>
                <label style="font-size:10px;color:var(--gray-500);display:block;margin-bottom:4px;">지역</label>
                <select class="form-input" id="msg-meet-region" onchange="MessagesPage.onMeetRegionChange(this.value)" style="border-radius:8px;font-size:12px;padding:8px;">
                  <option value="">선택</option>
                  ${regions.map(r => `<option value="${r}" ${this._meetRegion === r ? 'selected' : ''}>${r}</option>`).join('')}
                </select>
              </div>
              <div>
                <label style="font-size:10px;color:var(--gray-500);display:block;margin-bottom:4px;">세부 장소</label>
                <input type="text" class="form-input" id="msg-meet-detail" value="${Utils.escapeHtml(this._meetDetail)}" oninput="MessagesPage.onMeetDetailChange(this.value)" placeholder="예: 강남역 스타벅스" style="border-radius:8px;font-size:12px;padding:8px;">
              </div>
            </div>
          ` : ''}
        </div>
      `;
    } else if (itemValue === 'info_doc') {
      extra = `
        <div style="padding:12px;background:white;border-radius:10px;border:1px solid #fde68a;">
          <div style="font-size:11px;font-weight:600;color:#d97706;margin-bottom:8px;">📚 보험 자료 종류</div>
          <div style="display:flex;flex-direction:column;gap:4px;">
            ${infoTypes.map(t => `
              <label style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:${this._infoType === t.value ? '600' : '400'};border:1.5px solid ${this._infoType === t.value ? '#d97706' : '#e5e7eb'};background:${this._infoType === t.value ? '#fef3c7' : 'white'};color:${this._infoType === t.value ? '#92400e' : 'var(--gray-600)'};transition:all 0.2s;">
                <input type="radio" name="info-type" value="${t.value}" ${this._infoType === t.value ? 'checked' : ''} onchange="MessagesPage.onInfoTypeChange('${t.value}')" style="accent-color:#d97706;width:14px;height:14px;">
                ${t.label}
              </label>
            `).join('')}
          </div>
        </div>
      `;
    }

    return extra;
  },

  // ==================== Tab Section ====================
  _renderTabSection() {
    const items = this._tabItems[this._currentTab] || [];
    return `
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:16px;margin-bottom:24px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:10px;">
            <svg width="16" height="16" fill="none" stroke="#d97706" stroke-width="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          </span>
          <h3 style="font-size:18px;font-weight:700;color:var(--gray-800);margin:0;">알림 유형 선택</h3>
        </div>

        <!-- 탭 버튼 -->
        <div style="display:flex;background:var(--gray-100);border-radius:12px;padding:4px;margin-bottom:20px;">
          ${this._tabCategories.map(tab => {
            const isActive = this._currentTab === tab.key;
            return `
              <button onclick="MessagesPage.switchTab('${tab.key}')"
                style="flex:1;padding:10px 16px;border-radius:10px;border:none;cursor:pointer;font-size:14px;font-weight:${isActive ? '700' : '500'};
                  background:${isActive ? 'white' : 'transparent'};
                  color:${isActive ? 'var(--gray-800)' : 'var(--gray-500)'};
                  box-shadow:${isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};
                  transition:all 0.2s;">
                ${tab.label}
              </button>
            `;
          }).join('')}
        </div>

        <!-- 탭 하위 항목 카드 -->
        <div id="msg-tab-items" style="display:flex;flex-direction:column;gap:10px;">
          ${items.length > 0 ? items.map((item, idx) => {
            const isSelected = this._selectedType === item.value;
            const hasInline = isSelected && this._currentTab !== 'special';
            return `
              <div>
                <div onclick="MessagesPage.selectTabItem('${item.value}')"
                  style="display:flex;align-items:center;gap:14px;padding:16px 20px;border-radius:${hasInline ? '14px 14px 0 0' : '14px'};cursor:pointer;transition:all 0.2s;
                    border:2px solid ${isSelected ? '#6366f1' : 'var(--gray-200)'};
                    background:${isSelected ? '#eef2ff' : 'white'};
                    box-shadow:${isSelected ? '0 2px 8px rgba(99,102,241,0.15)' : 'none'};
                    ${hasInline ? 'border-bottom:1px solid #c7d2fe;' : ''}">
                  <span style="font-size:22px;">${item.icon}</span>
                  <div style="flex:1;">
                    <div style="font-size:15px;font-weight:${isSelected ? '700' : '500'};color:${isSelected ? '#4338ca' : 'var(--gray-700)'};">${item.label}</div>
                    ${item.desc ? `<div style="font-size:12px;color:${isSelected ? '#6366f1' : 'var(--gray-400)'};margin-top:3px;">${item.desc}</div>` : ''}
                  </div>
                  ${isSelected ? '<svg width="20" height="20" fill="none" stroke="#6366f1" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>' : ''}
                </div>
                ${hasInline ? this._renderItemInlineForm(item.value) : ''}
              </div>
            `;
          }).join('') : `
            <div style="text-align:center;padding:30px 20px;color:var(--gray-400);font-size:14px;">
              준비 중입니다
            </div>
          `}
        </div>
      </div>
    `;
  },

  switchTab(tabKey) {
    this._currentTab = tabKey;
    const items = this._tabItems[tabKey] || [];
    // 탭 전환 시 해당 탭의 첫번째 항목 자동 선택
    if (items.length > 0) {
      this._selectedType = items[0].value;
    }
    this._claimDocs = [];
    this._generalDocs = [];
    this._showGeneralDocs = false;
    // 전체 재렌더링
    this._reRenderAll();
  },

  selectTabItem(value) {
    this._selectedType = value;
    this._claimDocs = [];
    this._generalDocs = [];
    this._showGeneralDocs = false;
    this._refreshTabItems();
  },

  async _reRenderAll() {
    const container = document.querySelector('main.main-content');
    if (container) {
      container.innerHTML = await this.render();
      if (this.onRendered) this.onRendered();
    }
  },


  // ==================== (unused - kept for reference) ====================
  _UNUSED_renderInfoForm() {
    const selectedCustomer = this.customers.find(c => c.id === this._selectedCustomerId);
    const filteredCompanies = this.companies.filter(c => c.type === this._insuranceCategory);

    return `
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
        <div class="card-header" style="margin-bottom:16px;">
          <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#dbeafe,#c7d2fe);border-radius:8px;">
              <svg width="14" height="14" fill="none" stroke="#4338ca" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </span>
            고객 정보 및 안내 설정
          </h3>
        </div>

        ${this._renderCustomerSearch(selectedCustomer)}

        <!-- 보험사 선택 영역 -->
        <div style="margin-top:16px;padding:16px;background:linear-gradient(135deg,#f8fafc,#eef2ff);border-radius:12px;border:1px solid #e0e7ff;">
          <div style="font-size:12px;font-weight:600;color:#4338ca;margin-bottom:12px;">보험사 정보</div>

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
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:11px;">보험사</label>
              <select class="form-input" id="msg-company" onchange="MessagesPage.onCompanyChange(this.value)" style="border-radius:8px;font-size:13px;">
                <option value="">선택</option>
                ${filteredCompanies.map(c => `<option value="${c.id}" ${this._selectedCompanyId == c.id ? 'selected' : ''}>${Utils.escapeHtml(c.name)}</option>`).join('')}
              </select>
            </div>

            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:11px;">보험 종류 (상품명)</label>
              <input type="text" class="form-input" id="msg-product" value="${Utils.escapeHtml(this._productName)}" oninput="MessagesPage.onFieldChange()" placeholder="예: 무배당 퍼펙트통합보험" style="border-radius:8px;font-size:13px;">
            </div>
          </div>

          <div class="grid-2" style="gap:10px;margin-top:10px;">
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:11px;">월 보험료 (원)</label>
              <input type="text" class="form-input" id="msg-premium" value="${this._premium}" oninput="Utils.formatMoneyInput(this); MessagesPage.onFieldChange()" placeholder="예: 50,000" style="border-radius:8px;font-size:13px;">
            </div>

            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:11px;">콜센터 번호 (자동입력)</label>
              <input type="text" class="form-input" id="msg-callcenter" value="${Utils.escapeHtml(this._callCenter)}" readonly style="border-radius:8px;font-size:13px;background:var(--gray-50);color:var(--gray-500);">
            </div>
          </div>
        </div>

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
    `;
  },

  // ==================== 공통 고객 검색 영역 ====================
  _renderCustomerSearch(selectedCustomer) {
    return `
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
    `;
  },

  // ==================== 상담 알림톡 탭 폼 ====================
  _renderAlimtalkForm() {
    const selectedCustomer = this.customers.find(c => c.id === this._selectedCustomerId);
    const type = this._selectedType;
    const regions = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산'];
    const infoTypes = [
      { value: '기본구성안내', label: '기본구성 안내' },
      { value: '종합보험안내', label: '종합보험 안내' },
      { value: '암보험안내', label: '암보험 안내' },
      { value: '운전자보험안내', label: '운전자보험 안내' },
      { value: '연금보험안내', label: '연금보험 안내' }
    ];

    return `
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
        <div class="card-header" style="margin-bottom:16px;">
          <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#dbeafe,#c7d2fe);border-radius:8px;">
              <svg width="14" height="14" fill="none" stroke="#4338ca" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </span>
            상담 정보 설정
          </h3>
        </div>

        ${this._renderCustomerSearch(selectedCustomer)}

        <!-- 상담 진행일정 안내: 상담 방식/일시/장소 -->
        ${type === 'schedule' ? `
          <div style="margin-top:16px;padding:16px;background:linear-gradient(135deg,#f0fdf4,#ecfdf5);border-radius:12px;border:1px solid #bbf7d0;">
            <div style="font-size:12px;font-weight:600;color:#059669;margin-bottom:12px;">📅 상담 일정 설정</div>

            <div class="form-group" style="margin-bottom:10px;">
              <label class="form-label" style="font-size:11px;">상담 방법</label>
              <div style="display:flex;gap:8px;">
                ${['대면상담', '전화상담', '카톡상담'].map(m => `
                  <label style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:${this._consultMethod === m ? '600' : '400'};border:1.5px solid ${this._consultMethod === m ? '#059669' : '#e5e7eb'};background:${this._consultMethod === m ? '#ecfdf5' : 'white'};color:${this._consultMethod === m ? '#059669' : 'var(--gray-600)'};transition:all 0.2s;">
                    <input type="radio" name="consult-method" value="${m}" ${this._consultMethod === m ? 'checked' : ''} onchange="MessagesPage.onConsultMethodChange('${m}')" style="display:none;">
                    ${m === '대면상담' ? '🤝' : m === '전화상담' ? '📞' : '💬'} ${m}
                  </label>
                `).join('')}
              </div>
            </div>

            <div class="form-group" style="margin-bottom:${this._consultMethod === '대면상담' ? '10px' : '0'};">
              <label class="form-label" style="font-size:11px;">상담 예정 일시</label>
              <input type="text" class="form-input" id="msg-consult-date" value="${Utils.escapeHtml(this._consultDate)}" oninput="MessagesPage.onConsultDateChange(this.value)" placeholder="예: 25년 3월 25일 오후 2시" style="border-radius:8px;font-size:13px;">
            </div>

            ${this._consultMethod === '대면상담' ? `
              <div class="grid-2" style="gap:10px;">
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label" style="font-size:11px;">대면 장소 (지역)</label>
                  <select class="form-input" id="msg-meet-region" onchange="MessagesPage.onMeetRegionChange(this.value)" style="border-radius:8px;font-size:13px;">
                    <option value="">지역 선택</option>
                    ${regions.map(r => `<option value="${r}" ${this._meetRegion === r ? 'selected' : ''}>${r}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label" style="font-size:11px;">세부 장소</label>
                  <input type="text" class="form-input" id="msg-meet-detail" value="${Utils.escapeHtml(this._meetDetail)}" oninput="MessagesPage.onMeetDetailChange(this.value)" placeholder="예: 강남역 스타벅스" style="border-radius:8px;font-size:13px;">
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- 보험 자료 안내: 보험 종류 선택 -->
        ${type === 'info_doc' ? `
          <div style="margin-top:16px;padding:16px;background:linear-gradient(135deg,#fffbeb,#fef3c7);border-radius:12px;border:1px solid #fde68a;">
            <div style="font-size:12px;font-weight:600;color:#d97706;margin-bottom:12px;">📚 보험 자료 종류 선택</div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              ${infoTypes.map(t => `
                <label style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:${this._infoType === t.value ? '600' : '400'};border:1.5px solid ${this._infoType === t.value ? '#d97706' : '#e5e7eb'};background:${this._infoType === t.value ? '#fef3c7' : 'white'};color:${this._infoType === t.value ? '#92400e' : 'var(--gray-600)'};transition:all 0.2s;">
                  <input type="radio" name="info-type" value="${t.value}" ${this._infoType === t.value ? 'checked' : ''} onchange="MessagesPage.onInfoTypeChange('${t.value}')" style="accent-color:#d97706;width:16px;height:16px;">
                  ${t.label}
                </label>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  // ==================== Preview Panel ====================
  _renderPreviewPanel() {
    const agent = API.getAgent();
    const agentName = agent?.name || '설계사';
    const initial = (agentName[0] || 'P').toUpperCase();

    return `
      <div style="background:white;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,0.06);overflow:hidden;">
        <!-- Header: 알림톡 미리보기 -->
        <div style="padding:16px 20px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--gray-100);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.89 5.29 4.68 6.68L5.5 21l4.2-2.1c.74.13 1.5.1 2.3.1 5.52 0 10-3.58 10-8s-4.48-8-10-8z" fill="#FAE100"/></svg>
          <span style="font-size:16px;font-weight:700;color:var(--gray-800);">알림톡 미리보기</span>
          <span id="msg-char-count" style="margin-left:auto;font-size:11px;color:var(--gray-400);">0자</span>
        </div>

        <!-- 카카오톡 채팅 영역 -->
        <div style="background:#B2C7D9;padding:20px 16px;min-height:300px;">
          <!-- 프로필 + 말풍선 -->
          <div style="display:flex;align-items:flex-start;gap:10px;">
            <!-- 프로필 아바타 -->
            <div style="width:40px;height:40px;border-radius:14px;background:#FAE100;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;color:#3C1E1E;flex-shrink:0;">
              ${Utils.escapeHtml(initial)}
            </div>
            <div style="flex:1;min-width:0;">
              <!-- 이름 -->
              <div style="margin-bottom:4px;">
                <span style="font-size:13px;font-weight:600;color:#333;">${Utils.escapeHtml(agentName)} 설계사</span>
                <span style="font-size:11px;color:#666;margin-left:6px;">카카오톡 알림톡</span>
              </div>
              <!-- 말풍선 -->
              <div id="msg-bubble" style="background:white;border-radius:0 12px 12px 12px;padding:14px 16px;font-size:13px;line-height:1.8;color:#333;white-space:pre-wrap;word-break:break-word;box-shadow:0 1px 2px rgba(0,0,0,0.06);max-height:400px;overflow-y:auto;">
                <div style="text-align:center;padding:40px 0;color:#999;">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="margin:0 auto 8px;display:block;"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="#ccc" stroke-width="1.5"/></svg>
                  정보를 입력하고<br>알림톡 자동 생성을 눌러주세요
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 편집 가능 텍스트 영역 -->
        <div style="padding:16px;">
          <textarea class="form-input" id="msg-content" rows="8" oninput="MessagesPage._updateCharCount();MessagesPage._syncBubble()" placeholder="생성된 메시지가 여기에 표시됩니다. 직접 수정도 가능합니다." style="border-radius:12px;font-size:13px;line-height:1.8;font-family:'Pretendard Variable',sans-serif;border:1px solid var(--gray-200);resize:vertical;background:#f8fafc;"></textarea>
        </div>

        <!-- Action Buttons -->
        <div style="padding:0 16px 16px;display:flex;gap:10px;">
          <button class="btn" onclick="MessagesPage.sendMessage()" id="msg-send-btn"
            style="flex:1;padding:12px;border-radius:12px;font-size:14px;font-weight:600;background:#FAE100;color:#3C1E1E;border:none;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            카카오톡 전송
          </button>
          <button class="btn" onclick="MessagesPage.copyMessage()" id="msg-copy-btn"
            style="flex:1;padding:12px;border-radius:12px;font-size:14px;font-weight:600;background:white;color:var(--gray-700);border:1.5px solid var(--gray-200);display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            텍스트 복사
          </button>
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
    this._manualName = '';
    this._manualPhone = '';
    this._reRenderAll();
  },

  onCustomerChange(value) {
    this._selectedCustomerId = value ? parseInt(value) : null;
    this.generatePreview();
  },

  _refreshTabItems() {
    const tabContainer = document.getElementById('msg-tab-items');
    if (!tabContainer) return;
    const items = this._tabItems[this._currentTab] || [];
    tabContainer.innerHTML = items.map((item) => {
      const isSelected = this._selectedType === item.value;
      const hasInline = isSelected;
      return `
        <div>
          <div onclick="MessagesPage.selectTabItem('${item.value}')"
            style="display:flex;align-items:center;gap:14px;padding:16px 20px;border-radius:${hasInline ? '14px 14px 0 0' : '14px'};cursor:pointer;transition:all 0.2s;
              border:2px solid ${isSelected ? '#6366f1' : 'var(--gray-200)'};
              background:${isSelected ? '#eef2ff' : 'white'};
              box-shadow:${isSelected ? '0 2px 8px rgba(99,102,241,0.15)' : 'none'};
              ${hasInline ? 'border-bottom:1px solid #c7d2fe;' : ''}">
            <span style="font-size:22px;">${item.icon}</span>
            <div style="flex:1;">
              <div style="font-size:15px;font-weight:${isSelected ? '700' : '500'};color:${isSelected ? '#4338ca' : 'var(--gray-700)'};">${item.label}</div>
              ${item.desc ? `<div style="font-size:12px;color:${isSelected ? '#6366f1' : 'var(--gray-400)'};margin-top:3px;">${item.desc}</div>` : ''}
            </div>
            ${isSelected ? '<svg width="20" height="20" fill="none" stroke="#6366f1" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>' : ''}
          </div>
          ${hasInline ? this._renderItemInlineForm(item.value) : ''}
        </div>
      `;
    }).join('');
    this.generatePreview();
  },

  onTypeChange(value) {
    this._selectedType = value;
    this._claimDocs = [];
    this._generalDocs = [];
    this._showGeneralDocs = false;
    this._refreshTabItems();
  },

  onCategoryChange(category) {
    this._insuranceCategory = category;
    this._selectedCompanyId = '';
    this._callCenter = '';
    this._refreshTabItems();
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
    this._refreshTabItems();
  },

  toggleGeneralDoc(doc) {
    const idx = this._generalDocs.indexOf(doc);
    if (idx >= 0) this._generalDocs.splice(idx, 1);
    else this._generalDocs.push(doc);
    this.generatePreview();
  },

  // ==================== 상담 알림톡 이벤트 핸들러 ====================
  onConsultMethodChange(method) {
    this._consultMethod = method;
    this._refreshTabItems();
  },

  onConsultDateChange(value) {
    this._consultDate = value;
    this.generatePreview();
  },

  onMeetRegionChange(value) {
    this._meetRegion = value;
    this.generatePreview();
  },

  onMeetDetailChange(value) {
    this._meetDetail = value;
    this.generatePreview();
  },

  onInfoTypeChange(value) {
    this._infoType = value;
    this.generatePreview();
  },

  _formatConsultDate(dateStr) {
    if (!dateStr) return '[일정 미정]';
    return dateStr;
  },

  // ==================== Message Generation ====================
  generatePreview() {
    const agent = API.getAgent();
    const customer = this.customers.find(c => c.id === this._selectedCustomerId);
    const company = this.companies.find(c => c.id === parseInt(this._selectedCompanyId));
    const customerName = customer?.name || this._manualName || '고객';
    const agentName = agent?.name || '설계사';
    const agentPhone = agent?.phone ? Utils.formatPhone(agent.phone) : '';
    const companyName = company?.name || '';
    const productName = this._productName;
    const premium = this._premium;
    const callCenter = this._callCenter ? Utils.formatPhone(this._callCenter) : '';

    // 템플릿에서 content 가져오기 (설정에서 수정 가능)
    const template = this.templates.find(t => t.type === this._selectedType);

    let message = '';

    if (template) {
      // 상담 알림톡 전용 변수
      const consultMethod = this._consultMethod || '전화상담';
      const consultDate = this._formatConsultDate(this._consultDate);
      let consultPlace = '';
      if (consultMethod === '대면상담') {
        consultPlace = `\n■ 대면 장소 : [${this._meetRegion || '지역 미정'}] ${this._meetDetail || '[세부장소 미정]'}`;
      }
      const selectedInfo = this._infoType || '기본구성안내';
      const infoLabel = selectedInfo.replace('안내', '');
      const infoLinks = this._infoLinks[selectedInfo] || '';

      const vars = {
        '고객명': customerName,
        '설계사명': agentName,
        '설계사연락처': agentPhone,
        '보험사명': companyName || '(보험사명)',
        '보험사전화': callCenter || '(콜센터)',
        '상품명': productName || '(상품명)',
        '보험료': premium || '(보험료)',
        '상담방식': consultMethod,
        '상담일시': consultDate,
        '상담장소': consultPlace,
        '보험자료종류': infoLabel,
        '보험자료링크': infoLinks,
      };

      message = Utils.replaceTemplateVars(template.content, vars);

      // 청구서류/일반서류 추가
      if (this._selectedType === '청구서류' && this._claimDocs.length > 0) {
        const closingIdx = message.lastIndexOf('\n\n진행하시면서');
        const docsText = '\n\n[📌 필수 준비 서류 안내 (보험금 청구용)]\n' + this._claimDocs.map(d => '- ' + d).join('\n');
        if (closingIdx >= 0) {
          message = message.substring(0, closingIdx) + docsText + message.substring(closingIdx);
        } else {
          message += docsText;
        }
      }
      if (this._showGeneralDocs && this._generalDocs.length > 0) {
        const closingIdx = message.lastIndexOf('\n\n진행하시면서');
        const docsText = '\n\n[📌 추가 준비 서류 안내]\n' + this._generalDocs.map(d => '- ' + d).join('\n') + '\n- (콜센터 상담원 안내에 따라 팩스로 전송해 주시면 됩니다.)';
        if (closingIdx >= 0) {
          message = message.substring(0, closingIdx) + docsText + message.substring(closingIdx);
        } else {
          message += docsText;
        }
      }
    } else {
      // 템플릿이 없으면 기본 생성
      message = this._buildDefaultMessage(customerName, agentName, agentPhone, companyName, productName, premium, callCenter);
    }

    const contentEl = document.getElementById('msg-content');
    if (contentEl) {
      contentEl.value = message;
      this._updateCharCount();
      this._syncBubble();
    }
  },

  _buildDefaultMessage(customerName, agentName, agentPhone, companyName, productName, premium, callCenter) {
    const intro = `안녕하세요. 16년차 보험전문가 ${agentName} 본부장입니다.\n\n`;
    const insuranceBlock = `▪ 보험사 : ${companyName || '(보험사명)'}\n▪ 상품명 : ${productName || '(상품명)'}\n▪ 보험료 : ${premium || '(보험료)'}원\n📞 콜센터 : ${callCenter || '(콜센터)'}`;
    const closing = `\n\n진행하시면서 궁금한 점이 있으시거나, 제가 도와드릴 부분이 있다면 언제든지 편하게 답장 남겨주세요. 감사합니다.`;

    // 일반서류 블록
    let generalDocsBlock = '';
    if (this._showGeneralDocs && this._generalDocs.length > 0) {
      generalDocsBlock = `\n\n[📌 추가 준비 서류 안내]\n`;
      this._generalDocs.forEach(doc => { generalDocsBlock += `- ${doc}\n`; });
      generalDocsBlock += `- (콜센터 상담원 안내에 따라 팩스로 전송해 주시면 됩니다.)`;
    }

    switch (this._selectedType) {
      // ===== 안내 항목 =====
      case '담당자변경':
        return `${intro}${customerName} 고객님, 새롭게 고객님의 담당자가 되었습니다. 앞으로 꼼꼼한 관리 약속드립니다.\n추가로 안전하게 담당자 변경 확인 및 점검을 진행할 수 있는 방법을 안내드립니다.\n\n[변경 대상 보험 정보]\n${insuranceBlock}${generalDocsBlock}${closing}`;

      case '해지':
        return `${intro}${customerName} 고객님의 요청에 따른 해지 안내입니다.\n추가로 원활하게 해지 처리를 하고 환급금을 수령할 수 있는 방법을 안내드립니다. 아래 보험사에 연락하시어 진행해 주시기 바랍니다.\n\n[해지해야 할 보험 정보]\n${insuranceBlock}${generalDocsBlock}${closing}`;

      case '실효해지':
        return `${intro}${customerName} 고객님, 현재 실효 상태인 보험의 최종 해지 및 해약환급금 수령을 위한 안내입니다.\n추가로 실효된 보험을 안전하게 해지할 수 있는 방법을 안내드립니다.\n\n[실효된 보험 정보]\n${insuranceBlock}${generalDocsBlock}${closing}`;

      case '자동이체해지':
        return `${intro}${customerName} 고객님, 보험 자동이체 해지 관련 안내입니다.\n추가로 간편하게 자동이체를 해지할 수 있는 방법을 안내드립니다.\n💡 안내: 자동이체 해지는 두 달 동안 납입이 되지 않아도, 정상적으로 보험 혜택을 받을 수 있습니다.\n\n${insuranceBlock}${generalDocsBlock}${closing}`;

      case '청구서류': {
        let msg = `${intro}${customerName} 고객님, 요청하신 보험금 청구를 위한 안내입니다.\n추가로 빠르고 정확하게 보험금을 청구할 수 있는 방법을 안내드립니다.\n`;
        if (this._claimDocs.length > 0) {
          msg += `\n[📌 필수 준비 서류 안내 (보험금 청구용)]\n`;
          this._claimDocs.forEach(doc => { msg += `- ${doc}\n`; });
        }
        if (this._showGeneralDocs && this._generalDocs.length > 0) {
          msg += `\n[📌 추가 준비 서류 안내]\n`;
          this._generalDocs.forEach(doc => { msg += `- ${doc}\n`; });
          msg += `- (콜센터 상담원 안내에 따라 팩스로 전송해 주시면 됩니다.)\n`;
        }
        msg += closing;
        return msg;
      }

      // ===== 상담 알림톡 =====
      case 'intro':
        return `[전문가 소개 및 인사]\n안녕하세요! 매달 33개 생명/손해보험사의 상품을 꼼꼼하게 비교 분석하는 방송팀 소속이자, 16년 차 보험 전문가 프라임에셋 ${agentName} 본부장입니다.\n\n${customerName} 고객님, 저를 믿고 문의해 주셔서 진심으로 감사합니다. 단순한 가입을 넘어, 고객님의 라이프스타일과 상황에 맞는 가장 객관적이고 최적화된 맞춤형 플랜을 안내해 드리겠습니다.`;

      case 'schedule': {
        const method = this._consultMethod;
        const dateStr = this._formatConsultDate(this._consultDate);
        let placeStr = '';
        if (method === '대면상담') {
          const region = this._meetRegion || '[지역 미정]';
          const detail = this._meetDetail || '[세부장소 미정]';
          placeStr = `\n■ 대면 장소 : [${region}] ${detail}`;
        }
        return `[상담 일정 안내]\n프라임에셋 ${agentName} 본부장입니다.\n${customerName} 고객님의 맞춤형 보험 상담 일정이 확정되었습니다.\n\n■ 상담 방식 : ${method}\n■ 예정 일시 : ${dateStr}${placeStr}\n\n편안하고 유익한 상담을 위해 꼼꼼히 분석하여 준비하고 있겠습니다. 일정 변경이 필요하시면 언제든 편하게 말씀해 주세요!`;
      }

      case 'info_doc': {
        const selectedInfo = this._infoType;
        const infoLabel = selectedInfo.replace('안내', '');
        const links = this._infoLinks[selectedInfo] || '';
        return `[맞춤형 보험 정보 안내]\n${customerName} 고객님, 안녕하세요! 프라임에셋 ${agentName} 본부장입니다.\n\n상담에 앞서, 고객님께서 궁금해하실 [${infoLabel}]에 대한 핵심 정보를 미리 준비했습니다. 아래 내용을 가볍게 확인해 보시면 앞으로의 상담에 큰 도움이 됩니다!\n\n${links}\n\n꼼꼼히 살펴보시고 궁금한 점은 상담 때 모두 속 시원히 해결해 드리겠습니다.😊`;
      }

      case 'finish':
        return `https://litt.ly/withprime100\n\n저는 16년차 보험설계사이자\n50명의 전문 설계사를 총괄하는\n프라임에셋 ${agentName} 본부장입니다.\n\n매년 1분기에는 고객분들의\n고객정보(주소변경, 직업변경, 검진)를\n꼼꼼하게 체크하여 변경을 도와드리고\n중요한 보험 이슈를 안내해드리고 있습니다\n\n보장분석 프로그램과 노션을 활용한\n전문 온라인 상담에 만족하셨다면\n많은 분들이 손해보지 않으시도록\n소개도 부탁드려요 :)\n\n상담에 친절하게 응해주셔서 감사드리고\n[보험금청구] 상황 발생시\n언제든 편하게 전화나 톡으로\n문의주세요😊`;

      // ===== 특별알림 =====
      case 'first_greeting':
        return `${intro}${customerName} 고객님, 반갑습니다 😊\n프라임에셋 소속 보험전문가 ${agentName}입니다.\n\n고객님의 소중한 보험을 함께 관리해 드리게 되었습니다.\n현재 가입하신 보험에 대한 점검부터 새로운 보장 설계까지,\n궁금하신 사항이 있으시면 언제든 편하게 연락 주세요.\n\n항상 고객님 입장에서 최선의 방법을 찾아드리겠습니다.\n감사합니다 🙏`;

      case 'reservation_confirm':
        return `${intro}${customerName} 고객님, 상담 예약이 확인되었습니다 ✅\n\n아래 일정으로 상담이 예정되어 있습니다.\n혹시 일정 변경이 필요하시면 미리 말씀해 주세요.\n\n준비된 상담으로 고객님께 꼭 맞는 보장을 안내드리겠습니다.\n당일 뵙겠습니다! 😊`;

      case 'followup':
        return `${intro}${customerName} 고객님, 지난 상담은 만족스러우셨나요? 😊\n\n상담 후 추가로 궁금하신 점이나\n더 알아보고 싶은 내용이 있으시면 편하게 말씀해 주세요.\n\n고객님께 가장 적합한 보장을 찾아드리는 것이 제 역할입니다.\n언제든 연락 주시면 성심껏 도와드리겠습니다.\n\n감사합니다 🙏`;

      default: {
        let msg = `${intro}${customerName} 고객님을 위한 맞춤형 안내입니다.`;
        msg += closing;
        return msg;
      }
    }
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

  _syncBubble() {
    const contentEl = document.getElementById('msg-content');
    const bubble = document.getElementById('msg-bubble');
    if (bubble && contentEl) {
      const text = contentEl.value.trim();
      if (text) {
        bubble.textContent = text;
      } else {
        bubble.innerHTML = `
          <div style="text-align:center;padding:40px 0;color:#999;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="margin:0 auto 8px;display:block;"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="#ccc" stroke-width="1.5"/></svg>
            정보를 입력하고<br>알림톡 자동 생성을 눌러주세요
          </div>`;
      }
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
