// Consultation Page - Premium Insurance Consultation System
const ConsultationPage = {
  currentConsultation: null,
  companies: [],
  customers: [],
  checkItems: [],
  _formData: {},
  _existingPolicies: [],
  _recommendedPlans: [],
  _referenceLinks: [],
  _coverageOpenSections: {},

  // Health check items definition
  _healthItems: [
    { key: 'checkup', title: '건강검진', question: '최근 건강검진을 받은 적 있나요?', placeholder: '검진 날짜와 진단 내용, 치료 내용을 적어주세요.' },
    { key: 'recent3m', title: '📅 최근 3개월 이내', question: '진찰·검사 후 해당 항목이 있나요?', placeholder: '해당 내용을 상세히 적어주세요.',
      tooltip: '<b>해당 항목:</b> 질병확정진단 / 질병의심소견 / 치료 / 입원 / 수술(제왕절개 포함) / 투약<br><br><b>⚠️ 투약:</b> 처방전만 받고 약국에서 실제 약을 사지 않으셨어도 포함됩니다.<br><b>⚠️ 질병의심소견:</b> 의사로부터 진단서나 소견서를 발급받은 경우를 말합니다.<br><br>약물(혈압강하제, 신경안정제, 수면제, 각성제, 진통제 등)을 상시 복용하시거나 마약을 사용하신 적이 있는 경우도 포함됩니다.' },
    { key: 'recheck1y', title: '📅 최근 1년 이내', question: '병원 진찰이나 검사 후 추가검사(재검사)를 받으신 적이 있나요?', placeholder: '검사 날짜, 검사 항목, 결과를 적어주세요.' },
    { key: 'general5y', title: '📅 최근 5년 이내 (일반)', question: '아래 항목에 해당한 적이 있나요?', placeholder: '시기, 질환명, 치료 내용, 기간을 적어주세요.',
      tooltip: '<b>해당 항목:</b> 입원 / 수술(제왕절개 포함) / 계속하여 7일 이상 통원치료 / 계속하여 30일 이상 투약<br><br><b>⚠️ "계속하여"란?</b> 같은 원인(질병/상해)으로 치료를 시작해서 끝날 때까지 실제로 병원에 간 날짜나 약을 처방받은 총 일수를 모두 합산한 기준입니다.' },
    { key: 'disease11', title: '🩺 최근 5년 이내 (11대 질병)', question: '11대 주요 질병으로 진단·치료·입원·수술·투약 받은 적이 있나요?', placeholder: '해당 질병명, 진단 시기, 치료 내용을 적어주세요.',
      tooltip: '<b>11대 질병:</b> 암 / 백혈병 / 고혈압 / 협심증 / 심근경색 / 심장판막증 / 간경화증 / 뇌졸중(뇌출혈·뇌경색) / 당뇨병 / 에이즈 및 HIV 보균<br><br><i>※ 치질 등 직장 또는 항문 관련 질환은 실손의료비 가입 시에만 고지하시면 됩니다.</i>' }
  ],

  // Coverage Analysis 9 categories definition
  _coverageCategories: [
    { key: 'silson', title: '실손의료비', icon: '🏥', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe',
      fields: [
        { key: 'insurer', label: '보험사', type: 'insurer' },
        { key: 'startDate', label: '가입일자', type: 'date' },
        { key: 'generation', label: '세대', type: 'select', options: ['1세대','2세대','3세대','4세대','5세대'] },
        { key: 'selfBurden', label: '자기부담금', type: 'select', options: ['10%','20%','30%'] },
        { key: 'renewalCycle', label: '갱신주기', type: 'select', options: ['1년','3년','5년','15년'] }
      ]},
    { key: 'dailyLiability', title: '일상생활배상', icon: '🛡️', color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe',
      fields: [
        { key: 'insurer', label: '보험사', type: 'insurer' },
        { key: 'startDate', label: '가입일자', type: 'date' },
        { key: 'selfBurden', label: '자기부담금', type: 'text', placeholder: '예: 없음' },
        { key: 'limit', label: '보장한도', type: 'amount', unit: '억원' }
      ]},
    { key: 'death', title: '사망보장', icon: '⚱️', color: '#dc2626', bg: '#fef2f2', border: '#fecaca',
      fields: [
        { key: 'diseaseDeath', label: '질병사망', type: 'amount', unit: '만원' },
        { key: 'accidentDeath', label: '상해사망', type: 'amount', unit: '만원' }
      ]},
    { key: 'disability', title: '후유장해', icon: '🦽', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa',
      fields: [
        { key: 'diseaseDisability', label: '질병후유장해', type: 'amount', unit: '만원' },
        { key: 'accidentDisability', label: '상해후유장해', type: 'amount', unit: '만원' }
      ]},
    { key: 'cancer', title: '암보장', icon: '🎗️', color: '#db2777', bg: '#fdf2f8', border: '#fbcfe8',
      fields: [
        { key: 'generalCancer', label: '일반암 진단비', type: 'amount', unit: '만원' },
        { key: 'similarCancer', label: '유사암 진단비', type: 'amount', unit: '만원' },
        { key: 'integratedCancer', label: '통합암 진단비', type: 'amount', unit: '만원' },
        { key: 'antiRadiation', label: '항암방사선 치료비', type: 'amount', unit: '만원' },
        { key: 'antiDrug', label: '항암약물 치료비', type: 'amount', unit: '만원' },
        { key: 'targetAntiCancer', label: '표적항암 치료비', type: 'amount', unit: '만원' },
        { key: 'davinciRobot', label: '다빈치로봇 수술비', type: 'amount', unit: '만원' },
        { key: 'immuneAntiDrug', label: '면역항암약물 치료비', type: 'amount', unit: '만원' },
        { key: 'protonAntiCancer', label: '항암양성자 치료비', type: 'amount', unit: '만원' },
        { key: 'hormoneTherapy', label: '호르몬 치료비', type: 'amount', unit: '만원' },
        { key: 'heavyIonTherapy', label: '중입자 치료비', type: 'amount', unit: '만원' }
      ]},
    { key: 'brain', title: '뇌혈관질환', icon: '🧠', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe',
      fields: [
        { key: 'diagnosis', label: '뇌혈관질환 진단비', type: 'amount', unit: '만원' },
        { key: 'stroke', label: '뇌졸중 진단비', type: 'amount', unit: '만원' },
        { key: 'cerebralHemorrhage', label: '뇌출혈 진단비', type: 'amount', unit: '만원' },
        { key: 'specialExpense', label: '산정특례 진단비', type: 'amount', unit: '만원' },
        { key: 'thrombolysis', label: '혈전용해 치료비', type: 'amount', unit: '만원' }
      ]},
    { key: 'heart', title: '심혈관질환', icon: '❤️', color: '#e11d48', bg: '#fff1f2', border: '#fecdd3',
      fields: [
        { key: 'diagnosis', label: '심혈관질환 진단비', type: 'amount', unit: '만원' },
        { key: 'ischemic', label: '허혈성심장질환 진단비', type: 'amount', unit: '만원' },
        { key: 'acuteMyocardial', label: '급성심근경색 진단비', type: 'amount', unit: '만원' },
        { key: 'specialExpense', label: '산정특례 진단비', type: 'amount', unit: '만원' },
        { key: 'thrombolysis', label: '혈전용해 치료비', type: 'amount', unit: '만원' }
      ]},
    { key: 'surgery', title: '수술비보장', icon: '🏥', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc',
      fields: [
        { key: 'diseaseSurgery', label: '질병수술비', type: 'amount', unit: '만원' },
        { key: 'accidentSurgery', label: '상해수술비', type: 'amount', unit: '만원' },
        { key: 'diseaseTypeSurgery', label: '질병종수술비 (1~5종)', type: 'amount', unit: '만원' },
        { key: 'accidentTypeSurgery', label: '상해종수술비 (1~5종)', type: 'amount', unit: '만원' },
        { key: 'majorDiseaseSurgery', label: 'N대질병 수술비', type: 'amount', unit: '만원' }
      ]},
    { key: 'driver', title: '운전자보험', icon: '🚗', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0',
      fields: [
        { key: 'trafficAccident', label: '교통사고처리 지원금', type: 'amount', unit: '만원' },
        { key: 'lawyerFee', label: '변호사 선임비용', type: 'amount', unit: '만원' },
        { key: 'fine', label: '벌금', type: 'amount', unit: '만원' },
        { key: 'autoInjury', label: '자동차부상 치료비', type: 'amount', unit: '만원' }
      ]}
  ],

  _settings: null,

  async render(params = {}) {
    try {
      const [companiesData, customersData, checkItemsData, settingsData] = await Promise.all([
        API.getInsuranceCompanies(),
        API.getCustomers({ limit: 200 }),
        API.getCheckItems(),
        API.getSettings()
      ]);
      this.companies = companiesData.companies;
      this.customers = customersData.customers;
      this.checkItems = checkItemsData.items;
      this._settings = settingsData.settings;

      if (params.consultationId) {
        return await this.renderEditor(params.consultationId);
      }

      return await this._renderNewPage(params.customerId);
    } catch (err) {
      showToast(err.message, 'error');
      return '<div class="empty-state"><div class="empty-state-text">데이터를 불러오는 중 오류가 발생했습니다.</div></div>';
    }
  },

  async renderList(params = {}) {
    const data = await API.getConsultations();
    const consultations = data.consultations;
    this._allConsultations = consultations;

    return `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:start;">
        <div>
          <h1 class="page-title" style="display:flex;align-items:center;gap:10px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:linear-gradient(135deg,#3b82f6,#6366f1);border-radius:10px;">
              <svg width="18" height="18" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </span>
            온라인 보험상담
          </h1>
          <p class="page-subtitle">전문가 맞춤 제안서를 작성하고 고객에게 공유하세요</p>
        </div>
        <button class="btn btn-primary" style="background:linear-gradient(135deg,#3b82f6,#6366f1);border:none;box-shadow:0 4px 14px rgba(59,130,246,0.35);padding:10px 20px;" onclick="ConsultationPage.showNewConsultation(${params.customerId || 'null'})">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
          새 상담
        </button>
      </div>

      <!-- 검색 & 필터 -->
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;margin-bottom:16px;">
        <div class="search-bar">
          <input type="text" class="search-input" placeholder="고객명 또는 제목으로 검색..." id="consultation-search" oninput="ConsultationPage.filterList()" style="border-radius:10px;">
          <select class="form-input" style="width:auto;border-radius:10px;" id="consultation-status-filter" onchange="ConsultationPage.filterList()">
            <option value="">전체 상태</option>
            <option value="작성중">작성중</option>
            <option value="발송완료">발송완료</option>
          </select>
        </div>
      </div>

      <div id="consultation-list-container">
        ${this._renderConsultationCards(consultations)}
      </div>
    `;
  },

  _allConsultations: [],

  _renderConsultationCards(consultations) {
    if (!consultations || consultations.length === 0) {
      return `
        <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
          <div class="empty-state">
            <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#eff6ff,#e0e7ff);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
              <svg width="36" height="36" fill="none" stroke="#6366f1" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <div class="empty-state-text" style="font-size:16px;color:var(--gray-600);font-weight:500;">아직 상담이 없습니다</div>
            <p style="color:var(--gray-400);font-size:13px;margin-bottom:20px;">첫 번째 맞춤 보험 상담을 시작해보세요</p>
            <button class="btn btn-primary" style="background:linear-gradient(135deg,#3b82f6,#6366f1);border:none;" onclick="ConsultationPage.showNewConsultation()">첫 상담 시작하기</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
        <table class="data-table">
          <thead>
            <tr>
              <th>고객</th>
              <th>연락처</th>
              <th>제목</th>
              <th>보험사</th>
              <th>상태</th>
              <th>수정일</th>
              <th style="text-align:right;">관리</th>
            </tr>
          </thead>
          <tbody>
            ${consultations.map(c => `
              <tr style="cursor:pointer;" onclick="App.navigate('consultation', {consultationId:${c.id}})">
                <td>
                  <div style="display:flex;align-items:center;gap:10px;">
                    <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:#4338ca;">${Utils.escapeHtml((c.Customer?.name || '-')[0])}</div>
                    <div>
                      <strong style="color:var(--gray-800);font-size:14px;">${Utils.escapeHtml(c.Customer?.name || '-')}</strong>
                      ${c.Customer?.birth_date ? `<div style="font-size:11px;color:var(--gray-400);">${Utils.formatDate(c.Customer.birth_date)}</div>` : ''}
                    </div>
                  </div>
                </td>
                <td style="font-size:13px;color:var(--gray-600);">${Utils.formatPhone(c.Customer?.phone)}</td>
                <td style="color:var(--blue);font-weight:500;">
                  ${Utils.escapeHtml(c.title || '(제목없음)')}
                </td>
                <td>${c.insurers?.map(i => `<span class="chip" style="background:linear-gradient(135deg,#eff6ff,#e0e7ff);color:#4338ca;border:1px solid #c7d2fe;">${Utils.escapeHtml(i.InsuranceCompany?.name || '')}</span>`).join(' ') || '<span style="color:var(--gray-400);">-</span>'}</td>
                <td><span class="status-badge ${c.status==='작성중'?'ing':c.status==='발송완료'?'done':'before'}">${c.status || '작성중'}</span></td>
                <td style="color:var(--gray-500);font-size:13px;">${Utils.formatDate(c.updated_at)}</td>
                <td style="text-align:right;" onclick="event.stopPropagation();">
                  <div style="display:flex;gap:3px;justify-content:flex-end;flex-wrap:wrap;">
                    <button class="btn btn-sm" style="padding:3px 7px;font-size:10px;border-radius:4px;background:#eff6ff;color:#3b82f6;border:1px solid #bfdbfe;" onclick="App.navigate('alimtalk', {customerId: ${c.Customer?.id || 0}})">알림톡</button>
                    <button class="btn btn-sm" style="padding:3px 7px;font-size:10px;border-radius:4px;background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0;" onclick="App.navigate('messages', {customerId: ${c.Customer?.id || 0}})">메시지</button>
                    <button class="btn btn-secondary btn-sm" style="border-radius:4px;padding:3px 7px;font-size:10px;" onclick="App.navigate('consultation', {consultationId:${c.id}})">편집</button>
                    <button class="btn btn-sm" style="padding:3px 7px;font-size:10px;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;border-radius:4px;" onclick="ConsultationPage.deleteConsultation(${c.id})">삭제</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  filterList() {
    const search = (document.getElementById('consultation-search')?.value || '').toLowerCase();
    const status = document.getElementById('consultation-status-filter')?.value || '';
    const filtered = this._allConsultations.filter(c => {
      if (search) {
        const name = (c.Customer?.name || '').toLowerCase();
        const title = (c.title || '').toLowerCase();
        const phone = (c.Customer?.phone || '');
        if (!name.includes(search) && !title.includes(search) && !phone.includes(search)) return false;
      }
      if (status && c.status !== status) return false;
      return true;
    });
    const container = document.getElementById('consultation-list-container');
    if (container) container.innerHTML = this._renderConsultationCards(filtered);
  },

  async renderEditor(consultationId) {
    const { consultation } = await API.getConsultation(consultationId);
    this.currentConsultation = consultation;
    const agent = API.getAgent();

    // Restore form data from proposal_html (stored as JSON)
    let savedData = {};
    try {
      if (consultation.proposal_html) {
        savedData = JSON.parse(consultation.proposal_html);
      }
    } catch (e) {
      savedData = {};
    }

    // 고객 정보 자동 주입 (제안서에 아직 입력되지 않은 경우)
    const cust = consultation.Customer || {};
    const custBirth = cust.birth_date ? cust.birth_date.replace(/-/g, '').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : '';
    const custGender = cust.gender === 'M' ? '남성' : cust.gender === 'F' ? '여성' : '';
    const custAddr = (cust.address || '').split('|');

    this._formData = {
      birthdate: savedData.birthdate || custBirth,
      gender: savedData.gender || custGender,
      job: savedData.job || '',
      address: savedData.address || custAddr[0] || '',
      addressDetail: savedData.addressDetail || custAddr[1] || '',
      tags: savedData.tags || { children: false, driving: false, pet: false, homeowner: false },
      chronicDiseases: savedData.chronicDiseases || { hypertension: false, hyperlipidemia: false, diabetes: false },
      showLinks: savedData.showLinks || false,
      referenceLinks: savedData.referenceLinks || [],
      healthChecks: savedData.healthChecks || { checkup: false, recent3m: false, recheck1y: false, general5y: false, disease11: false },
      healthDetails: savedData.healthDetails || { checkup: '', recent3m: '', recheck1y: '', general5y: '', disease11: '' },
      totalPremium: savedData.totalPremium || '',
      premiumEval: savedData.premiumEval || '',
      expertComment: savedData.expertComment || '',
      existingPolicies: savedData.existingPolicies || [],
      urgentItem: savedData.urgentItem || '',
      proposalReason: savedData.proposalReason || '',
      recommendedPlans: savedData.recommendedPlans || [],
      coverageAnalysis: savedData.coverageAnalysis || {},
      sectionImages: savedData.sectionImages || []
    };
    this._existingPolicies = this._formData.existingPolicies;
    this._recommendedPlans = this._formData.recommendedPlans;
    this._referenceLinks = this._formData.referenceLinks;

    const checklist = consultation.checklist || {};
    const customerName = consultation.Customer?.name || '';

    return `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <button class="btn btn-secondary btn-sm" onclick="App.navigate('consultation')" style="margin-bottom:8px;border-radius:6px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
            새 제안서
          </button>
          <h1 class="page-title" style="font-size:22px;">${Utils.escapeHtml(customerName)}님 제안서</h1>
          <p class="page-subtitle">${Utils.escapeHtml(customerName)}님 맞춤 보험 상담</p>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <span class="autosave-indicator" id="autosave-status" style="padding:4px 12px;border-radius:20px;background:var(--gray-100);font-size:12px;">
            <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--gray-400);margin-right:4px;"></span>
            자동저장 대기
          </span>
          <button class="btn btn-success" style="border-radius:8px;box-shadow:0 2px 8px rgba(16,185,129,0.3);" onclick="ConsultationPage.shareConsultation(${consultationId})">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            공유링크
          </button>
        </div>
      </div>

      <div class="consultation-layout" style="grid-template-columns:1fr 420px;gap:28px;">
        <!-- LEFT: Form Area -->
        <div style="display:flex;flex-direction:column;gap:0;">

          <!-- Section 1: 고객 기본 정보 -->
          <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
            <div class="card-header" style="margin-bottom:20px;">
              <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#dbeafe,#c7d2fe);border-radius:8px;">
                  <svg width="14" height="14" fill="none" stroke="#4338ca" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </span>
                고객 기본 정보
              </h3>
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">고객명</label>
                <input type="text" class="form-input" value="${Utils.escapeHtml(customerName)}" style="border-radius:10px;" disabled>
              </div>
              <div class="form-group">
                <label class="form-label">생년월일</label>
                <input type="text" class="form-input" id="c-birthdate" value="${Utils.escapeHtml(this._formData.birthdate)}" oninput="Utils.formatBirthInput(this); ConsultationPage.updateAnniversaryDisplay(); ConsultationPage.autoSave()" placeholder="19900101" maxlength="10" style="border-radius:10px;">
                <div id="c-anniversary-display" style="margin-top:4px;font-size:12px;color:#d97706;font-weight:600;${this._formData.birthdate ? '' : 'display:none;'}">
                  ${this._formData.birthdate ? '<i class="fas fa-calendar-check" style="margin-right:4px;"></i>상령일: ' + Utils.calculatePolicyAnniversary(this._formData.birthdate).replace(/(\d{4})-(\d{2})-(\d{2})/, (m,y,mo,d) => y+'년 '+parseInt(mo)+'월 '+parseInt(d)+'일') : ''}
                </div>
              </div>
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">성별</label>
                <select class="form-input" id="c-gender" style="border-radius:10px;" onchange="ConsultationPage.autoSave()">
                  <option value="">선택</option>
                  <option value="남성" ${this._formData.gender === '남성' ? 'selected' : ''}>남성</option>
                  <option value="여성" ${this._formData.gender === '여성' ? 'selected' : ''}>여성</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">직업</label>
                <select class="form-input" id="c-job" style="border-radius:10px;" onchange="ConsultationPage.autoSave()">
                  <option value="">선택</option>
                  ${['사무직','현장직','자영업','주부','학생','전문직','기타'].map(j => `<option value="${j}" ${this._formData.job === j ? 'selected' : ''}>${j}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">주소</label>
                <div style="display:flex;gap:6px;">
                  <input type="text" class="form-input" id="c-address" value="${Utils.escapeHtml(this._formData.address)}" placeholder="주소 검색" style="border-radius:10px;flex:1;background:var(--gray-50);" readonly>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="Utils.searchAddress(function(addr){document.getElementById('c-address').value=addr;ConsultationPage.autoSave();})" style="white-space:nowrap;height:38px;border-radius:10px;">검색</button>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">상세주소</label>
                <input type="text" class="form-input" id="c-address-detail" value="${Utils.escapeHtml(this._formData.addressDetail)}" oninput="ConsultationPage.autoSave()" placeholder="동/호수 등" style="border-radius:10px;">
              </div>
            </div>
          </div>

          <!-- Section 2: 라이프스타일 태그 -->
          <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
            <div class="card-header" style="margin-bottom:16px;">
              <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:8px;">
                  <svg width="14" height="14" fill="none" stroke="#d97706" stroke-width="2" viewBox="0 0 24 24"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                </span>
                라이프스타일 태그
              </h3>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:10px;">
              ${this._renderTagCheckbox('children', '자녀 있음', '#f97316', '#fff7ed', '#fed7aa')}
              ${this._renderTagCheckbox('driving', '운전 함', '#3b82f6', '#eff6ff', '#bfdbfe')}
              ${this._renderTagCheckbox('pet', '반려견', '#d97706', '#fffbeb', '#fde68a')}
              ${this._renderTagCheckbox('homeowner', '자가 보유', '#059669', '#ecfdf5', '#a7f3d0')}
            </div>
          </div>

          <!-- Section 3: 참고 링크 첨부 -->
          <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
            <div class="card-header" style="margin-bottom:16px;">
              <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);border-radius:8px;">
                  <svg width="14" height="14" fill="none" stroke="#4338ca" stroke-width="2" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                </span>
                참고 링크 첨부
              </h3>
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;color:var(--gray-500);">
                <input type="checkbox" id="c-show-links" ${this._formData.showLinks ? 'checked' : ''} onchange="ConsultationPage.toggleLinks()" style="accent-color:#6366f1;">
                사용
              </label>
            </div>
            <div id="links-container" style="${this._formData.showLinks ? '' : 'display:none;'}">
              <div id="links-list">
                ${this._referenceLinks.map((link, i) => this._renderLinkRow(i, link)).join('')}
              </div>
              <button class="btn btn-secondary btn-sm" style="border-radius:8px;border:1px dashed var(--gray-300);color:var(--gray-500);margin-top:8px;" onclick="ConsultationPage.addLink()">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                링크 추가
              </button>
            </div>
          </div>

          <!-- Section 4: 병력 체크 -->
          <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
            <div class="card-header" style="margin-bottom:16px;">
              <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#fce7f3,#fbcfe8);border-radius:8px;">
                  <svg width="14" height="14" fill="none" stroke="#db2777" stroke-width="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                </span>
                병력 체크
              </h3>
            </div>
            <div id="health-checks-container" style="display:flex;flex-direction:column;gap:10px;">
              ${this._healthItems.map(h => this._renderHealthCheckItem(h.key, h.title, h.question, h.placeholder, h.tooltip)).join('')}
            </div>

            <!-- 3대 주요 만성질환 -->
            <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--gray-100);">
              <div style="font-size:13px;font-weight:600;color:var(--gray-700);margin-bottom:10px;">🩺 3대 주요 만성질환 <span style="font-size:11px;color:var(--gray-400);font-weight:400;">(보유 시 체크)</span></div>
              <div style="display:flex;flex-wrap:wrap;gap:8px;">
                ${this._renderChronicToggle('hypertension', '고혈압', '#dc2626', '#fef2f2', '#fecaca')}
                ${this._renderChronicToggle('hyperlipidemia', '고지혈증', '#7c3aed', '#f5f3ff', '#ddd6fe')}
                ${this._renderChronicToggle('diabetes', '당뇨', '#d97706', '#fffbeb', '#fde68a')}
              </div>
            </div>
          </div>

          <!-- Section 5: 기존 보험 분석 -->
          <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
            <div class="card-header" style="margin-bottom:20px;">
              <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#dcfce7,#bbf7d0);border-radius:8px;">
                  <svg width="14" height="14" fill="none" stroke="#16a34a" stroke-width="2" viewBox="0 0 24 24"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                </span>
                기존 보험 분석
              </h3>
            </div>
            <!-- 총 월납입 + 평가 (눈에 띄게) -->
            <div style="padding:16px;border-radius:12px;background:linear-gradient(135deg,#f0fdf4,#ecfdf5);border:1px solid #86efac;margin-bottom:16px;">
              <div class="grid-2" style="gap:12px;">
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label" style="color:#166534;font-weight:700;">총 월 납입 보험료</label>
                  <div style="position:relative;">
                    <input type="text" class="form-input" id="c-total-premium" value="${this._formData.totalPremium ? Number(this._formData.totalPremium).toLocaleString() : ''}" oninput="Utils.formatMoneyInput(this); ConsultationPage.autoSave()" placeholder="0" style="border-radius:10px;padding-right:30px;font-size:16px;font-weight:700;">
                    <span style="position:absolute;right:12px;top:50%;transform:translateY(-50%);color:var(--gray-400);font-size:13px;">원</span>
                  </div>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label" style="color:#166534;font-weight:700;">소득/연령 대비 평가</label>
                  <div style="display:flex;gap:0;border-radius:8px;overflow:hidden;border:1px solid var(--gray-300);">
                    ${['부족','적정','과다'].map(v => {
                      const sel = this._formData.premiumEval === v;
                      const styles = { '부족': sel ? 'background:#fef3c7;color:#92400e;font-weight:700;border-color:#fde68a;' : '', '적정': sel ? 'background:#dcfce7;color:#16a34a;font-weight:700;border-color:#86efac;' : '', '과다': sel ? 'background:#fef2f2;color:#dc2626;font-weight:700;border-color:#fecaca;' : '' };
                      return `<button type="button" class="btn btn-sm" id="eval-btn-${v}"
                        style="flex:1;border-radius:0;justify-content:center;font-size:13px;padding:10px;border:none;border-right:1px solid var(--gray-200);${sel ? styles[v] : 'background:white;color:var(--gray-500);'}"
                        onclick="ConsultationPage.setEval('${v}')">${v}</button>`;
                    }).join('')}
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">전문가 코멘트</label>
              <textarea class="form-input" id="c-expert-comment" rows="3" oninput="ConsultationPage.autoSave()" placeholder="기존 보험에 대한 전문가 분석을 입력하세요..." style="border-radius:10px;">${Utils.escapeHtml(this._formData.expertComment)}</textarea>
            </div>
            <!-- 상품별 보험 평가 상세 -->
            <div style="border-top:1px solid var(--border);padding-top:16px;margin-top:8px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <label class="form-label" style="margin-bottom:0;font-size:14px;">상품별 보험 평가</label>
                <button class="btn btn-secondary btn-sm" style="border-radius:8px;border:1px dashed var(--border);color:var(--muted-foreground);" onclick="ConsultationPage.addExistingPolicy()">
                  <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                  증권 추가
                </button>
              </div>
              <div id="existing-policies-list">
                ${this._existingPolicies.map((p, i) => this._renderExistingPolicy(i, p)).join('')}
              </div>
            </div>
          </div>

          <!-- Section 5.5: 보장분석 (기존보험분석과 연속) -->
          <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;border-top:3px solid #3b82f6;">
            <div class="card-header" style="margin-bottom:16px;">
              <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#dbeafe,#bfdbfe);border-radius:8px;">
                  <svg width="14" height="14" fill="none" stroke="#2563eb" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </span>
                전체 주요보장 한눈에 보기 <span style="font-size:12px;color:var(--gray-400);font-weight:400;margin-left:4px;">(9개 항목)</span>
              </h3>
            </div>
            <div id="coverage-analysis-container" style="display:flex;flex-direction:column;gap:2px;">
              ${this._coverageCategories.map(cat => this._renderCoverageCategory(cat)).join('')}
            </div>
          </div>

          <!-- Section 6: 전문가 추천 플랜 -->
          <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
            <div class="card-header" style="margin-bottom:20px;">
              <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:8px;">
                  <svg width="14" height="14" fill="none" stroke="#d97706" stroke-width="2" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                </span>
                전문가 추천 플랜
              </h3>
            </div>
            <div class="form-group">
              <label class="form-label">가장 시급한 보완 내역</label>
              <input type="text" class="form-input" id="c-urgent" value="${Utils.escapeHtml(this._formData.urgentItem)}" oninput="ConsultationPage.autoSave()" placeholder="예: 실손보험 미가입, 암보험 보장 부족 등" style="border-radius:10px;">
            </div>
            <div class="form-group">
              <label class="form-label">제안 사유</label>
              <textarea class="form-input" id="c-proposal-reason" rows="3" oninput="ConsultationPage.autoSave()" placeholder="왜 이 플랜을 추천하는지 설명해주세요..." style="border-radius:10px;">${Utils.escapeHtml(this._formData.proposalReason)}</textarea>
            </div>
            <div style="border-top:1px solid var(--gray-100);padding-top:16px;margin-top:8px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <label class="form-label" style="margin-bottom:0;font-size:14px;">추천 상품</label>
                <button class="btn btn-sm" style="background:linear-gradient(135deg,#fef3c7,#fde68a);color:#92400e;border:1px solid #fde68a;border-radius:8px;" onclick="ConsultationPage.addRecommendedPlan()">
                  <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                  상품 추가
                </button>
              </div>
              <div id="recommended-plans-list">
                ${this._recommendedPlans.map((p, i) => this._renderRecommendedPlan(i, p)).join('')}
              </div>
            </div>
          </div>

          <!-- Section 7: 진행 메모 -->
          <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
            <div class="card-header" style="margin-bottom:16px;">
              <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#f3f4f6,#e5e7eb);border-radius:8px;">
                  <svg width="14" height="14" fill="none" stroke="#6b7280" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </span>
                진행 메모
              </h3>
            </div>
            <textarea class="form-input" id="c-memo" rows="4" oninput="ConsultationPage.autoSave()" placeholder="진행 상황이나 특이사항을 메모하세요..." style="border-radius:10px;">${Utils.escapeHtml(consultation.progress_memo || '')}</textarea>
          </div>

          ${consultation.share_token ? `
          <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;background:linear-gradient(135deg,#f0fdf4,#ecfdf5);">
            <div class="card-header">
              <h3 class="card-title" style="display:flex;align-items:center;gap:8px;color:#16a34a;">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                공유 링크
              </h3>
            </div>
            <div class="alert-box alert-success">
              <strong>공유 URL:</strong> <a href="/prime/proposal.html?token=${consultation.share_token}" target="_blank" style="word-break:break-all;">${location.origin}/prime/proposal.html?token=${consultation.share_token}</a>
              <br><small>만료: ${Utils.formatDate(consultation.share_expires_at)}</small>
            </div>
            <button class="btn btn-secondary btn-sm" style="border-radius:8px;" onclick="Utils.copyToClipboard('${location.origin}/prime/proposal.html?token=${consultation.share_token}').then(() => showToast('복사되었습니다','success'))">링크 복사</button>
          </div>
          ` : ''}
        </div>

        <!-- RIGHT: Mobile Preview -->
        <div style="position:sticky;top:24px;align-self:start;">
          <div id="mobile-preview-wrapper">
            ${this._renderMobilePreview()}
          </div>
        </div>
      </div>
    `;
  },

  // ==================== Chronic Disease Toggle ====================
  _renderChronicToggle(key, label, color, bgColor, borderColor) {
    const checked = this._formData.chronicDiseases && this._formData.chronicDiseases[key];
    return `
      <label style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:20px;cursor:pointer;transition:all 0.2s;border:1.5px solid ${checked ? borderColor : '#e5e7eb'};background:${checked ? bgColor : 'white'};">
        <input type="checkbox" ${checked ? 'checked' : ''} onchange="ConsultationPage.toggleChronic('${key}')" style="accent-color:${color};width:14px;height:14px;">
        <span style="font-size:12px;font-weight:600;color:${checked ? color : '#6b7280'};">${label}</span>
      </label>
    `;
  },

  toggleChronic(key) {
    if (!this._formData.chronicDiseases) this._formData.chronicDiseases = {};
    this._formData.chronicDiseases[key] = !this._formData.chronicDiseases[key];
    this.autoSave();
    this._refreshPreview();
  },

  // ==================== Tag Checkbox Renderer ====================
  _renderTagCheckbox(key, label, color, bgColor, borderColor) {
    const checked = this._formData.tags && this._formData.tags[key];
    return `
      <label style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:10px;cursor:pointer;transition:all 0.2s;border:1.5px solid ${checked ? borderColor : '#e5e7eb'};background:${checked ? bgColor : 'white'};">
        <input type="checkbox" ${checked ? 'checked' : ''} onchange="ConsultationPage.toggleTag('${key}')" style="accent-color:${color};width:16px;height:16px;">
        <span style="font-size:13px;font-weight:500;color:${checked ? color : '#6b7280'};">${label}</span>
      </label>
    `;
  },

  // ==================== Health Check Item Renderer ====================
  _renderHealthCheckItem(key, title, question, placeholder, tooltip) {
    const checked = this._formData.healthChecks && this._formData.healthChecks[key];
    const detail = this._formData.healthDetails && this._formData.healthDetails[key] || '';
    const tipId = 'health-tip-' + key;
    return `
      <div style="padding:14px 16px;border-radius:12px;border:1.5px solid ${checked ? '#fca5a5' : 'var(--gray-200)'};background:${checked ? '#fef2f2' : '#fafafa'};transition:all 0.2s;box-shadow:${checked ? '0 2px 8px rgba(239,68,68,0.08)' : '0 1px 2px rgba(0,0,0,0.03)'};">
        <label style="display:flex;align-items:center;gap:12px;cursor:pointer;">
          <div style="width:20px;height:20px;border-radius:6px;border:2px solid ${checked ? '#ef4444' : '#cbd5e1'};background:${checked ? '#ef4444' : 'white'};display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s;">
            ${checked ? '<svg width="12" height="12" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>' : ''}
          </div>
          <input type="checkbox" ${checked ? 'checked' : ''} onchange="ConsultationPage.toggleHealthCheck('${key}')" style="display:none;">
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:13px;font-weight:700;color:${checked ? '#dc2626' : 'var(--gray-700)'};">${title}</span>
              ${tooltip ? `<span onclick="event.preventDefault();event.stopPropagation();ConsultationPage.toggleHealthTip('${tipId}')" style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:${checked ? '#fecaca' : '#e2e8f0'};color:${checked ? '#dc2626' : '#64748b'};font-size:11px;font-weight:700;cursor:pointer;flex-shrink:0;" title="체크 포인트">?</span>` : ''}
            </div>
            <div style="font-size:11px;color:${checked ? '#b91c1c' : 'var(--gray-400)'};margin-top:2px;line-height:1.4;">${question || ''}</div>
          </div>
        </label>
        ${tooltip ? `<div id="${tipId}" style="display:none;margin-top:10px;padding:12px 14px;border-radius:10px;background:white;border:1px solid #e2e8f0;font-size:12px;color:#475569;line-height:1.7;">${tooltip}</div>` : ''}
        ${checked ? `
          <textarea class="form-input" id="health-detail-${key}" rows="2" oninput="ConsultationPage.autoSave()" placeholder="${placeholder || '상세 내용을 입력하세요...'}"
            style="margin-top:10px;border-radius:10px;font-size:13px;background:white;border-color:#fca5a5;">${Utils.escapeHtml(detail)}</textarea>
        ` : ''}
      </div>
    `;
  },

  // ==================== Coverage Category Accordion Renderer ====================
  _renderCoverageCategory(cat) {
    const isOpen = this._coverageOpenSections[cat.key] || false;
    const data = (this._formData.coverageAnalysis && this._formData.coverageAnalysis[cat.key]) || {};
    const filledCount = cat.fields.filter(f => {
      const v = data[f.key];
      return v !== undefined && v !== '' && v !== null;
    }).length;

    return `
      <div style="border:1px solid ${isOpen ? cat.border : 'var(--gray-200)'};border-radius:10px;overflow:hidden;transition:all 0.2s;${isOpen ? 'box-shadow:0 2px 8px rgba(0,0,0,0.06);' : ''}">
        <div onclick="ConsultationPage.toggleCoverageSection('${cat.key}')"
          style="display:flex;align-items:center;justify-content:space-between;padding:8px 14px;cursor:pointer;background:${isOpen ? cat.bg : 'white'};transition:all 0.2s;">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:18px;">${cat.icon}</span>
            <span style="font-size:14px;font-weight:600;color:${isOpen ? cat.color : 'var(--gray-700)'};">${cat.title}</span>
            ${filledCount > 0 ? `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;border-radius:10px;background:${cat.color};color:white;font-size:10px;font-weight:700;padding:0 6px;">${filledCount}</span>` : ''}
          </div>
          <svg width="16" height="16" fill="none" stroke="${isOpen ? cat.color : '#9ca3af'}" stroke-width="2" viewBox="0 0 24 24" style="transition:transform 0.2s;${isOpen ? 'transform:rotate(180deg);' : ''}"><path d="M19 9l-7 7-7-7"/></svg>
        </div>
        ${isOpen ? `
          <div style="padding:16px;background:white;border-top:1px solid ${cat.border};">
            <div style="display:flex;flex-direction:column;gap:10px;">
              ${cat.fields.map(f => this._renderCoverageField(cat.key, f, data[f.key] || '')).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  _renderCoverageField(catKey, field, value) {
    const inputId = `ca-${catKey}-${field.key}`;
    if (field.type === 'amount') {
      const numVal = Number(value);
      const displayVal = value && !isNaN(numVal) ? numVal.toLocaleString() : '';
      return `
        <div style="display:flex;align-items:center;gap:8px;">
          <label style="font-size:12px;color:var(--gray-600);font-weight:500;min-width:120px;flex-shrink:0;">${field.label}</label>
          <div style="position:relative;flex:1;">
            <input type="text" class="form-input" id="${inputId}" value="${displayVal}" oninput="Utils.formatMoneyInput(this); ConsultationPage.updateCoverageField('${catKey}','${field.key}',Utils.getMoneyValue(this))" placeholder="0" style="border-radius:8px;font-size:13px;padding-right:${field.unit === '억원' ? '40px' : '36px'};">
            <span style="position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:12px;color:var(--gray-400);">${field.unit}</span>
          </div>
        </div>
      `;
    } else if (field.type === 'select') {
      return `
        <div style="display:flex;align-items:center;gap:8px;">
          <label style="font-size:12px;color:var(--gray-600);font-weight:500;min-width:120px;flex-shrink:0;">${field.label}</label>
          <select class="form-input" id="${inputId}" onchange="ConsultationPage.updateCoverageField('${catKey}','${field.key}',this.value)" style="border-radius:8px;font-size:13px;flex:1;">
            <option value="">선택</option>
            ${field.options.map(o => `<option value="${o}" ${value === o ? 'selected' : ''}>${o}</option>`).join('')}
          </select>
        </div>
      `;
    } else if (field.type === 'date') {
      return `
        <div style="display:flex;align-items:center;gap:8px;">
          <label style="font-size:12px;color:var(--gray-600);font-weight:500;min-width:120px;flex-shrink:0;">${field.label}</label>
          <input type="text" class="form-input" id="${inputId}" value="${value}" oninput="Utils.formatBirthInput(this); ConsultationPage.updateCoverageField('${catKey}','${field.key}',this.value)" placeholder="20240101" maxlength="10" style="border-radius:8px;font-size:13px;flex:1;">
        </div>
      `;
    } else if (field.type === 'insurer') {
      return `
        <div style="display:flex;align-items:center;gap:8px;">
          <label style="font-size:12px;color:var(--gray-600);font-weight:500;min-width:120px;flex-shrink:0;">${field.label}</label>
          <select class="form-input" id="${inputId}" onchange="ConsultationPage.updateCoverageField('${catKey}','${field.key}',this.value)" style="border-radius:8px;font-size:13px;flex:1;">
            <option value="">선택</option>
            <optgroup label="생명보험">
              ${this.companies.filter(c => c.type === '생명').map(c => `<option value="${c.name}" ${value === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
            </optgroup>
            <optgroup label="손해보험">
              ${this.companies.filter(c => c.type === '손해').map(c => `<option value="${c.name}" ${value === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
            </optgroup>
          </select>
        </div>
      `;
    } else {
      return `
        <div style="display:flex;align-items:center;gap:8px;">
          <label style="font-size:12px;color:var(--gray-600);font-weight:500;min-width:120px;flex-shrink:0;">${field.label}</label>
          <input type="text" class="form-input" id="${inputId}" value="${Utils.escapeHtml(value)}" oninput="ConsultationPage.updateCoverageField('${catKey}','${field.key}',this.value)" placeholder="${field.placeholder || ''}" style="border-radius:8px;font-size:13px;flex:1;">
        </div>
      `;
    }
  },

  toggleCoverageSection(catKey) {
    this._coverageOpenSections[catKey] = !this._coverageOpenSections[catKey];
    // Collect current coverage field values before re-render
    this._collectCoverageFields();
    const container = document.getElementById('coverage-analysis-container');
    if (container) {
      container.innerHTML = this._coverageCategories.map(cat => this._renderCoverageCategory(cat)).join('');
    }
  },

  updateCoverageField(catKey, fieldKey, value) {
    if (!this._formData.coverageAnalysis) this._formData.coverageAnalysis = {};
    if (!this._formData.coverageAnalysis[catKey]) this._formData.coverageAnalysis[catKey] = {};
    this._formData.coverageAnalysis[catKey][fieldKey] = value;
    this.autoSave();
  },

  _collectCoverageFields() {
    if (!this._formData.coverageAnalysis) this._formData.coverageAnalysis = {};
    this._coverageCategories.forEach(cat => {
      if (!this._coverageOpenSections[cat.key]) return;
      if (!this._formData.coverageAnalysis[cat.key]) this._formData.coverageAnalysis[cat.key] = {};
      cat.fields.forEach(f => {
        const el = document.getElementById(`ca-${cat.key}-${f.key}`);
        if (el) this._formData.coverageAnalysis[cat.key][f.key] = el.value;
      });
    });
  },

  // ==================== Link Row Renderer ====================
  _renderLinkRow(index, link) {
    return `
      <div class="grid-2" style="gap:8px;margin-bottom:8px;align-items:end;" data-link-index="${index}">
        <div class="form-group" style="margin-bottom:0;">
          ${index === 0 ? '<label class="form-label" style="font-size:12px;">링크 제목</label>' : ''}
          <input type="text" class="form-input" value="${Utils.escapeHtml(link.title || '')}" oninput="ConsultationPage.updateLink(${index},'title',this.value)" placeholder="제목" style="border-radius:8px;font-size:13px;">
        </div>
        <div style="display:flex;gap:6px;">
          <div class="form-group" style="margin-bottom:0;flex:1;">
            ${index === 0 ? '<label class="form-label" style="font-size:12px;">URL</label>' : ''}
            <input type="url" class="form-input" value="${Utils.escapeHtml(link.url || '')}" oninput="ConsultationPage.updateLink(${index},'url',this.value)" placeholder="https://" style="border-radius:8px;font-size:13px;">
          </div>
          <button class="btn btn-sm" style="background:#fef2f2;color:#dc2626;border:1px solid #fecaca;border-radius:6px;align-self:${index === 0 ? 'end' : 'center'};height:38px;" onclick="ConsultationPage.removeLink(${index})">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
    `;
  },

  // ==================== Coverage checkbox items ====================
  _coverageCheckItems: ['실손의료비','일상생활배상','사망보장','후유장해','암보장','뇌혈관질환','심혈관질환','수술비보장','운전자보험'],

  // ==================== Existing Policy Renderer ====================
  _renderExistingPolicy(index, policy) {
    const images = policy.images || [];
    const coverageChecks = policy.coverageChecks || [];
    return `
      <div style="background:var(--muted);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:10px;position:relative;" data-policy-index="${index}">
        <button class="btn btn-sm" style="position:absolute;top:8px;right:8px;background:var(--red-light);color:var(--red);border:1px solid #fecaca;border-radius:6px;padding:2px 6px;" onclick="ConsultationPage.removeExistingPolicy(${index})">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div class="grid-2" style="gap:10px;">
          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-size:12px;">보험사</label>
            <select class="form-input" style="border-radius:8px;font-size:13px;" onchange="ConsultationPage.updateExistingPolicy(${index},'company',this.value)">
              <option value="">선택</option>
              <optgroup label="생명보험">
                ${this.companies.filter(c => c.type === '생명').map(c => `<option value="${c.name}" ${policy.company === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
              </optgroup>
              <optgroup label="손해보험">
                ${this.companies.filter(c => c.type === '손해').map(c => `<option value="${c.name}" ${policy.company === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
              </optgroup>
            </select>
          </div>
          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-size:12px;">상품명</label>
            <input type="text" class="form-input" value="${Utils.escapeHtml(policy.productName || '')}" oninput="ConsultationPage.updateExistingPolicy(${index},'productName',this.value)" placeholder="상품명" style="border-radius:8px;font-size:13px;">
          </div>
        </div>
        <div class="grid-3" style="gap:10px;display:grid;grid-template-columns:1fr 1fr 1fr;">
          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-size:12px;">월보험료</label>
            <input type="text" class="form-input" value="${policy.premium ? Number(policy.premium).toLocaleString() : ''}" oninput="Utils.formatMoneyInput(this); ConsultationPage.updateExistingPolicy(${index},'premium',Utils.getMoneyValue(this))" placeholder="0" style="border-radius:8px;font-size:13px;">
          </div>
          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-size:12px;">납입기간</label>
            <select class="form-input" style="border-radius:8px;font-size:13px;" onchange="ConsultationPage.updateExistingPolicy(${index},'paymentPeriodEval',this.value)">
              <option value="">선택</option>
              <option value="적당함" ${policy.paymentPeriodEval==='적당함'?'selected':''}>적당함</option>
              <option value="너무 김" ${policy.paymentPeriodEval==='너무 김'?'selected':''}>너무 김</option>
              <option value="갱신형" ${policy.paymentPeriodEval==='갱신형'?'selected':''}>갱신형</option>
              <option value="비갱신형" ${policy.paymentPeriodEval==='비갱신형'?'selected':''}>비갱신형</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-size:12px;">보장내용</label>
            <select class="form-input" style="border-radius:8px;font-size:13px;" onchange="ConsultationPage.updateExistingPolicy(${index},'coverageEval',this.value)">
              <option value="">선택</option>
              <option value="충분" ${policy.coverageEval==='충분'?'selected':''}>충분</option>
              <option value="부족" ${policy.coverageEval==='부족'?'selected':''}>부족</option>
              <option value="과함" ${policy.coverageEval==='과함'?'selected':''}>과함</option>
            </select>
          </div>
        </div>
        <div class="form-group" style="margin-bottom:8px;">
          <label class="form-label" style="font-size:12px;">보장 항목</label>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            ${this._coverageCheckItems.map(item => {
              const isChecked = coverageChecks.includes(item);
              return `<label style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:16px;cursor:pointer;font-size:11px;border:1px solid ${isChecked ? '#93c5fd' : '#e5e7eb'};background:${isChecked ? '#eff6ff' : 'white'};color:${isChecked ? '#2563eb' : '#6b7280'};transition:all 0.15s;">
                <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="ConsultationPage.togglePolicyCoverage(${index},'${item}')" style="display:none;">
                ${item}
              </label>`;
            }).join('')}
          </div>
        </div>
        <div class="form-group" style="margin-bottom:8px;">
          <label class="form-label" style="font-size:12px;">전문가 의견</label>
          <textarea class="form-input" rows="2" oninput="ConsultationPage.updateExistingPolicy(${index},'opinion',this.value)" placeholder="이 보험에 대한 의견" style="border-radius:8px;font-size:13px;min-height:50px;">${Utils.escapeHtml(policy.opinion || '')}</textarea>
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label" style="font-size:12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:-1px;margin-right:4px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            파일 첨부
          </label>
          <div id="policy-images-${index}" style="display:flex;flex-direction:column;gap:8px;margin-bottom:8px;">
            ${images.map((img, imgIdx) => `
              <div style="display:flex;gap:8px;align-items:start;padding:8px;border:1px solid var(--gray-200);border-radius:10px;background:var(--gray-50);">
                <div style="position:relative;width:64px;height:64px;border-radius:8px;overflow:hidden;border:1px solid var(--border);flex-shrink:0;">
                  ${img.url.endsWith('.pdf')
                    ? `<a href="${Utils.escapeHtml(img.url)}" target="_blank" style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#eff6ff;text-decoration:none;">
                        <svg width="20" height="20" fill="none" stroke="#3b82f6" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <span style="font-size:8px;color:#3b82f6;font-weight:600;margin-top:1px;">PDF</span>
                      </a>`
                    : `<img src="${Utils.escapeHtml(img.url)}" style="width:100%;height:100%;object-fit:cover;cursor:pointer;" onclick="ConsultationPage.previewPolicyImage('${Utils.escapeHtml(img.url)}')">`}
                </div>
                <div style="flex:1;min-width:0;">
                  <input type="text" class="form-input" value="${Utils.escapeHtml(img.comment || '')}" oninput="ConsultationPage.updatePolicyImageComment(${index},${imgIdx},this.value)" placeholder="코멘트 입력..." style="border-radius:6px;font-size:12px;padding:6px 8px;margin-bottom:4px;">
                  <div style="font-size:10px;color:var(--gray-400);">${Utils.escapeHtml(img.filename || (img.url.endsWith('.pdf') ? 'PDF 파일' : '이미지'))}</div>
                </div>
                <button onclick="ConsultationPage.removePolicyImage(${index},${imgIdx})" style="background:none;color:var(--gray-400);border:none;font-size:16px;cursor:pointer;padding:4px;line-height:1;" title="삭제">&times;</button>
              </div>
            `).join('')}
          </div>
          <label style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border:1px dashed var(--border);border-radius:10px;cursor:pointer;font-size:12px;color:var(--muted-foreground);transition:all 0.15s;" onmouseover="this.style.borderColor='var(--primary)';this.style.color='var(--primary)';this.style.background='var(--primary-light)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--muted-foreground)';this.style.background='transparent'">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            파일 추가
            <input type="file" accept="image/*,.pdf" multiple style="display:none;" onchange="ConsultationPage.handlePolicyImageUpload(${index}, this.files)">
          </label>
        </div>
      </div>
    `;
  },

  // ==================== Recommended Plan Renderer ====================
  _renderRecommendedPlan(index, plan) {
    const coverageChecks = plan.coverageChecks || [];
    const images = plan.images || [];
    return `
      <div style="background:linear-gradient(135deg,#fffbeb,#fef3c7);border:1px solid #fde68a;border-radius:12px;padding:14px;margin-bottom:10px;position:relative;" data-plan-index="${index}">
        <button class="btn btn-sm" style="position:absolute;top:8px;right:8px;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;border-radius:6px;padding:2px 6px;" onclick="ConsultationPage.removeRecommendedPlan(${index})">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div class="grid-2" style="gap:10px;">
          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-size:12px;">보험사</label>
            <select class="form-input" style="border-radius:8px;font-size:13px;" onchange="ConsultationPage.updateRecommendedPlan(${index},'company',this.value)">
              <option value="">선택</option>
              <optgroup label="생명보험">
                ${this.companies.filter(c => c.type === '생명').map(c => `<option value="${c.name}" ${plan.company === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
              </optgroup>
              <optgroup label="손해보험">
                ${this.companies.filter(c => c.type === '손해').map(c => `<option value="${c.name}" ${plan.company === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
              </optgroup>
            </select>
          </div>
          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-size:12px;">상품명</label>
            <input type="text" class="form-input" value="${Utils.escapeHtml(plan.productName || '')}" oninput="ConsultationPage.updateRecommendedPlan(${index},'productName',this.value)" placeholder="상품명" style="border-radius:8px;font-size:13px;">
          </div>
        </div>
        <div class="grid-3" style="gap:10px;display:grid;grid-template-columns:1fr 1fr 1fr;">
          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-size:12px;">월보험료</label>
            <input type="text" class="form-input" value="${plan.premium ? Number(plan.premium).toLocaleString() : ''}" oninput="Utils.formatMoneyInput(this); ConsultationPage.updateRecommendedPlan(${index},'premium',Utils.getMoneyValue(this))" placeholder="0" style="border-radius:8px;font-size:13px;background:white;">
          </div>
          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-size:12px;">납입기간</label>
            <select class="form-input" style="border-radius:8px;font-size:13px;background:white;" onchange="ConsultationPage.updateRecommendedPlan(${index},'paymentPeriodEval',this.value)">
              <option value="">선택</option>
              <option value="10년납" ${plan.paymentPeriodEval==='10년납'?'selected':''}>10년납</option>
              <option value="20년납" ${plan.paymentPeriodEval==='20년납'?'selected':''}>20년납</option>
              <option value="30년납" ${plan.paymentPeriodEval==='30년납'?'selected':''}>30년납</option>
              <option value="20년갱신" ${plan.paymentPeriodEval==='20년갱신'?'selected':''}>20년갱신</option>
              <option value="30년갱신" ${plan.paymentPeriodEval==='30년갱신'?'selected':''}>30년갱신</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-size:12px;">보험만기</label>
            <select class="form-input" style="border-radius:8px;font-size:13px;background:white;" onchange="ConsultationPage.updateRecommendedPlan(${index},'maturityAge',this.value)">
              <option value="">선택</option>
              <option value="80세만기" ${plan.maturityAge==='80세만기'?'selected':''}>80세만기</option>
              <option value="90세만기" ${plan.maturityAge==='90세만기'?'selected':''}>90세만기</option>
              <option value="100세만기" ${plan.maturityAge==='100세만기'?'selected':''}>100세만기</option>
              <option value="20년만기" ${plan.maturityAge==='20년만기'?'selected':''}>20년만기</option>
              <option value="30년만기" ${plan.maturityAge==='30년만기'?'selected':''}>30년만기</option>
            </select>
          </div>
        </div>
        <div class="form-group" style="margin-bottom:8px;">
          <label class="form-label" style="font-size:12px;">보장 항목</label>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            ${this._coverageCheckItems.map(item => {
              const isChecked = coverageChecks.includes(item);
              return `<label style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:16px;cursor:pointer;font-size:11px;border:1px solid ${isChecked ? '#fbbf24' : '#e5e7eb'};background:${isChecked ? '#fef3c7' : 'white'};color:${isChecked ? '#92400e' : '#6b7280'};transition:all 0.15s;">
                <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="ConsultationPage.toggleRecommendedCoverage(${index},'${item}')" style="display:none;">
                ${item}
              </label>`;
            }).join('')}
          </div>
        </div>
        <div class="form-group" style="margin-bottom:8px;">
          <label class="form-label" style="font-size:12px;">추천 포인트</label>
          <textarea class="form-input" rows="2" oninput="ConsultationPage.updateRecommendedPlan(${index},'highlight',this.value)" placeholder="이 상품을 추천하는 핵심 이유" style="border-radius:8px;font-size:13px;min-height:50px;background:white;">${Utils.escapeHtml(plan.highlight || '')}</textarea>
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label" style="font-size:12px;">파일 첨부</label>
          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:8px;">
            ${images.map((img, imgIdx) => `
              <div style="display:flex;gap:8px;align-items:start;padding:8px;border:1px solid var(--gray-200);border-radius:10px;background:var(--gray-50);">
                <div style="position:relative;width:64px;height:64px;border-radius:8px;overflow:hidden;border:1px solid var(--border);flex-shrink:0;">
                  ${img.url.endsWith('.pdf')
                    ? `<a href="${Utils.escapeHtml(img.url)}" target="_blank" style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#eff6ff;text-decoration:none;">
                        <svg width="20" height="20" fill="none" stroke="#3b82f6" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <span style="font-size:8px;color:#3b82f6;font-weight:600;margin-top:1px;">PDF</span>
                      </a>`
                    : `<img src="${Utils.escapeHtml(img.url)}" style="width:100%;height:100%;object-fit:cover;cursor:pointer;" onclick="ConsultationPage.previewPolicyImage('${Utils.escapeHtml(img.url)}')">`}
                </div>
                <div style="flex:1;min-width:0;">
                  <input type="text" class="form-input" value="${Utils.escapeHtml(img.comment || '')}" oninput="ConsultationPage.updateRecommendedImageComment(${index},${imgIdx},this.value)" placeholder="코멘트 입력..." style="border-radius:6px;font-size:12px;padding:6px 8px;margin-bottom:4px;">
                  <div style="font-size:10px;color:var(--gray-400);">${Utils.escapeHtml(img.filename || (img.url.endsWith('.pdf') ? 'PDF 파일' : '이미지'))}</div>
                </div>
                <button onclick="ConsultationPage.removeRecommendedImage(${index},${imgIdx})" style="background:none;color:var(--gray-400);border:none;font-size:16px;cursor:pointer;padding:4px;line-height:1;" title="삭제">&times;</button>
              </div>
            `).join('')}
          </div>
          <label style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border:1px dashed var(--border);border-radius:8px;cursor:pointer;font-size:11px;color:var(--muted-foreground);" onmouseover="this.style.borderColor='#d97706';this.style.color='#d97706'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--muted-foreground)'">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            파일 추가
            <input type="file" accept="image/*,.pdf" multiple style="display:none;" onchange="ConsultationPage.handleRecommendedImageUpload(${index}, this.files)">
          </label>
        </div>
      </div>
    `;
  },

  // ==================== Mobile Preview ====================
  _renderMobilePreview() {
    const agent = API.getAgent();
    const agentName = agent?.name || '전문가';
    const agentPosition = agent?.position || '보험설계사';
    const customerName = this.currentConsultation?.Customer?.name || '고객';
    const fd = this._formData;

    // Build active tags
    const tagLabels = [];
    if (fd.tags?.children) tagLabels.push({ label: '자녀 있음', color: '#f97316', bg: '#fff7ed' });
    if (fd.tags?.driving) tagLabels.push({ label: '운전', color: '#3b82f6', bg: '#eff6ff' });
    if (fd.tags?.pet) tagLabels.push({ label: '반려견', color: '#d97706', bg: '#fffbeb' });
    if (fd.tags?.homeowner) tagLabels.push({ label: '자가 보유', color: '#059669', bg: '#ecfdf5' });

    // Health checks
    const healthItems = [];
    if (fd.healthChecks?.checkup) healthItems.push({ label: '건강검진', detail: fd.healthDetails?.checkup });
    if (fd.healthChecks?.recent3m) healthItems.push({ label: '최근 3개월 이내', detail: fd.healthDetails?.recent3m });
    if (fd.healthChecks?.recheck1y) healthItems.push({ label: '최근 1년 이내 추가검사', detail: fd.healthDetails?.recheck1y });
    if (fd.healthChecks?.general5y) healthItems.push({ label: '최근 5년 이내 (일반)', detail: fd.healthDetails?.general5y });
    if (fd.healthChecks?.disease11) healthItems.push({ label: '최근 5년 이내 (11대 질병)', detail: fd.healthDetails?.disease11 });

    // Customer info line
    const infoItems = [];
    if (fd.gender) infoItems.push(fd.gender);
    if (fd.birthdate) {
      const age = new Date().getFullYear() - new Date(fd.birthdate).getFullYear();
      infoItems.push(age + '세');
    }
    if (fd.job) infoItems.push(fd.job);

    return `
      <div style="width:375px;margin:0 auto;border:14px solid #1e293b;border-radius:40px;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.25);position:relative;background:#f8fafc;">
        <!-- Notch -->
        <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:150px;height:28px;background:#1e293b;border-radius:0 0 20px 20px;z-index:10;">
          <div style="width:60px;height:4px;background:#374151;border-radius:2px;margin:16px auto 0;"></div>
        </div>

        <!-- Scrollable Content -->
        <div data-preview-scroll style="height:700px;overflow-y:auto;background:#f8fafc;">
          <!-- Header (고정 프로필 영역) -->
          ${agent?.profile_image && (this._settings?.proposal_layout || 'photo') === 'photo' ? `
          <div style="background:linear-gradient(135deg,#0f172a,#312e81);text-align:center;position:relative;overflow:hidden;">
            <img src="${agent.profile_image}" style="position:absolute;top:20px;left:50%;transform:translateX(-50%);width:200px;height:auto;object-fit:contain;z-index:0;mask-image:linear-gradient(180deg,rgba(0,0,0,1) 40%,rgba(0,0,0,0) 100%);-webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,1) 40%,rgba(0,0,0,0) 100%);">
            <div style="position:relative;z-index:2;padding:180px 20px 20px;background:linear-gradient(180deg,transparent 0%,rgba(15,23,42,0.6) 50%,rgba(15,23,42,0.95) 100%);">
              <div style="color:white;font-size:20px;font-weight:700;">${Utils.escapeHtml(agentName)}</div>
              <div style="color:#a5b4fc;font-size:14px;margin-top:2px;">${Utils.escapeHtml(agentPosition)} | PRIMEASSET</div>
              <div style="display:flex;gap:8px;margin-top:16px;justify-content:center;">
                <button style="flex:1;max-width:100px;padding:8px 4px;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;background:rgba(255,255,255,0.15);color:white;display:flex;flex-direction:column;align-items:center;gap:4px;backdrop-filter:blur(4px);">
                  <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  온라인명함
                </button>
                <button style="flex:1;max-width:100px;padding:8px 4px;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;background:rgba(255,255,255,0.15);color:white;display:flex;flex-direction:column;align-items:center;gap:4px;backdrop-filter:blur(4px);">
                  <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  전화
                </button>
                <button style="flex:1;max-width:100px;padding:8px 4px;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;background:rgba(250,204,21,0.9);color:#1e293b;display:flex;flex-direction:column;align-items:center;gap:4px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1e293b"><path d="M12 3C6.5 3 2 6.58 2 11c0 2.83 1.82 5.3 4.55 6.7-.22.98-.82 3.1-.94 3.58-.14.57.21.56.45.41.19-.12 2.83-1.92 3.97-2.7.62.09 1.27.14 1.97.14 5.5 0 10-3.58 10-8S17.5 3 12 3z"/></svg>
                  카카오톡
                </button>
              </div>
            </div>
          </div>
          ` : `
          <div style="background:linear-gradient(135deg,#0f172a,#312e81);padding:48px 20px 20px;text-align:center;">
            ${agent?.profile_image
              ? `<img src="${agent.profile_image}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;margin:0 auto 12px;display:block;box-shadow:0 4px 16px rgba(99,102,241,0.4);border:3px solid rgba(255,255,255,0.2);background:linear-gradient(135deg,#6366f1,#818cf8);">`
              : `<div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#818cf8);margin:0 auto 12px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(99,102,241,0.4);">
                <span style="font-size:30px;font-weight:700;color:white;">${Utils.escapeHtml(agentName[0] || 'P')}</span>
              </div>`}
            <div style="color:white;font-size:20px;font-weight:700;">${Utils.escapeHtml(agentName)}</div>
            <div style="color:#a5b4fc;font-size:14px;margin-top:2px;">${Utils.escapeHtml(agentPosition)} | PRIMEASSET</div>
            <div style="display:flex;gap:8px;margin-top:16px;justify-content:center;">
              <button style="flex:1;max-width:100px;padding:8px 4px;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;background:rgba(255,255,255,0.15);color:white;display:flex;flex-direction:column;align-items:center;gap:4px;backdrop-filter:blur(4px);">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                온라인명함
              </button>
              <button style="flex:1;max-width:100px;padding:8px 4px;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;background:rgba(255,255,255,0.15);color:white;display:flex;flex-direction:column;align-items:center;gap:4px;backdrop-filter:blur(4px);">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                전화
              </button>
              <button style="flex:1;max-width:100px;padding:8px 4px;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;background:rgba(250,204,21,0.9);color:#1e293b;display:flex;flex-direction:column;align-items:center;gap:4px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1e293b"><path d="M12 3C6.5 3 2 6.58 2 11c0 2.83 1.82 5.3 4.55 6.7-.22.98-.82 3.1-.94 3.58-.14.57.21.56.45.41.19-.12 2.83-1.92 3.97-2.7.62.09 1.27.14 1.97.14 5.5 0 10-3.58 10-8S17.5 3 12 3z"/></svg>
                카카오톡
              </button>
            </div>
          </div>
          `}

          <!-- Content -->
          <div style="padding:0 16px 24px;margin-top:-6px;position:relative;z-index:10;display:flex;flex-direction:column;gap:16px;">

            <!-- Customer Info Card -->
            <div style="background:white;border-radius:20px;padding:20px;box-shadow:0 8px 30px rgba(0,0,0,0.04);border:1px solid rgba(241,245,249,0.5);">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
                <h3 style="font-size:19px;font-weight:800;color:#1e293b;line-height:1.4;margin:0;">
                  <span style="color:#4f46e5;background:#eef2ff;padding:1px 6px;border-radius:4px;">${Utils.escapeHtml(customerName)}</span>고객님을 위한<br>맞춤 컨설팅 리포트
                </h3>
                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;margin-top:2px;">
                  ${fd.job ? `<span style="background:#f1f5f9;color:#475569;padding:4px 10px;border-radius:8px;font-size:13px;font-weight:700;">${Utils.escapeHtml(fd.job)}</span>` : ''}
                  ${infoItems.length > 0 ? `<span style="background:#f1f5f9;color:#475569;padding:4px 10px;border-radius:8px;font-size:13px;font-weight:700;">${infoItems.filter(i => i !== fd.job).join(' / ')}</span>` : ''}
                </div>
              </div>
              ${fd.address ? `<div style="font-size:14px;color:#64748b;background:#f8fafc;padding:8px 12px;border-radius:8px;margin-bottom:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">&#128205; ${Utils.escapeHtml(fd.address)}${fd.addressDetail ? ' ' + Utils.escapeHtml(fd.addressDetail) : ''}</div>` : ''}
              ${tagLabels.length > 0 ? `
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;">
                  ${tagLabels.map(t => `<span style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;color:${t.color};background:${t.bg};">${t.label}</span>`).join('')}
                </div>
              ` : ''}
              ${fd.birthdate ? (() => {
                const anniv = Utils.calculatePolicyAnniversary(fd.birthdate);
                if (!anniv) return '';
                const [y, m, d] = anniv.split('-');
                return '<div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:12px;margin-top:6px;"><span style="font-size:15px;">&#128197;</span><div><div style="font-size:12px;color:#92400e;font-weight:700;">보험 상령일</div><div style="font-size:15px;color:#78350f;font-weight:800;">' + y + '년 ' + parseInt(m) + '월 ' + parseInt(d) + '일</div></div></div>';
              })() : ''}
            </div>

            <!-- Reference Links (bookmark style) -->
            ${(fd.showLinks && this._referenceLinks.filter(l => l.title || l.url).length > 0) ? `
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${this._referenceLinks.filter(l => l.title || l.url).map(l => `
                  <div style="display:flex;height:64px;background:white;border:1px solid #f1f5f9;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.02);">
                    <div style="flex:1;padding:10px 14px;display:flex;flex-direction:column;justify-content:center;">
                      <div style="font-size:14px;font-weight:700;color:#1e293b;line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${Utils.escapeHtml(l.title || l.url || '')}</div>
                      ${l.url ? '<div style="font-size:12px;color:#94a3b8;margin-top:3px;display:flex;align-items:center;">&#128279; ' + Utils.escapeHtml(l.url.replace(/^https?:\/\//, '').substring(0, 30)) + '...</div>' : ''}
                    </div>
                    <div style="width:64px;height:64px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                      <svg width="20" height="20" fill="none" stroke="#94a3b8" stroke-width="1.5" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Health Check -->
            ${healthItems.length > 0 || fd.chronicDiseases?.hypertension || fd.chronicDiseases?.hyperlipidemia || fd.chronicDiseases?.diabetes ? `
              <div style="background:white;border-radius:20px;padding:20px;box-shadow:0 8px 30px rgba(0,0,0,0.04);border:1px solid rgba(241,245,249,0.5);">
                <div style="font-size:16px;font-weight:700;color:#1e293b;margin-bottom:12px;display:flex;align-items:center;">
                  <div style="width:28px;height:28px;border-radius:50%;background:#fef2f2;display:flex;align-items:center;justify-content:center;margin-right:8px;"><span style="color:#ef4444;font-size:15px;">&#9829;</span></div>
                  건강 체크리스트
                </div>
                <div style="background:#f8fafc;padding:14px;border-radius:12px;border:1px solid #f1f5f9;">
                  ${healthItems.map(h => `
                    <div style="padding:6px 0;${healthItems.indexOf(h) < healthItems.length - 1 ? 'border-bottom:1px solid #e2e8f0;' : ''}">
                      <div style="font-size:14px;font-weight:600;color:#dc2626;">${Utils.escapeHtml(h.label)}</div>
                      ${h.detail ? `<div style="font-size:13px;color:#64748b;margin-top:2px;line-height:1.5;">${Utils.escapeHtml(h.detail)}</div>` : ''}
                    </div>
                  `).join('')}
                  ${fd.chronicDiseases?.hypertension || fd.chronicDiseases?.hyperlipidemia || fd.chronicDiseases?.diabetes ? `
                    <div style="${healthItems.length > 0 ? 'padding-top:8px;margin-top:4px;border-top:1px solid #e2e8f0;' : ''}">
                      <div style="font-size:13px;color:#64748b;margin-bottom:6px;font-weight:600;">3대 만성질환</div>
                      <div style="display:flex;gap:6px;flex-wrap:wrap;">
                        ${fd.chronicDiseases.hypertension ? '<span style="display:inline-block;padding:3px 10px;border-radius:12px;font-size:13px;font-weight:600;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;">고혈압</span>' : ''}
                        ${fd.chronicDiseases.hyperlipidemia ? '<span style="display:inline-block;padding:3px 10px;border-radius:12px;font-size:13px;font-weight:600;background:#f5f3ff;color:#7c3aed;border:1px solid #ddd6fe;">고지혈증</span>' : ''}
                        ${fd.chronicDiseases.diabetes ? '<span style="display:inline-block;padding:3px 10px;border-radius:12px;font-size:13px;font-weight:600;background:#fffbeb;color:#d97706;border:1px solid #fde68a;">당뇨</span>' : ''}
                      </div>
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}

            <!-- Current Insurance Analysis -->
            ${(fd.totalPremium || fd.expertComment || this._existingPolicies.length > 0) ? `
              <div style="background:white;border-radius:20px;padding:20px;box-shadow:0 8px 30px rgba(0,0,0,0.04);border:1px solid rgba(241,245,249,0.5);">
                <div style="font-size:16px;font-weight:700;color:#1e293b;margin-bottom:12px;display:flex;align-items:center;">
                  <div style="width:28px;height:28px;border-radius:50%;background:#fffbeb;display:flex;align-items:center;justify-content:center;margin-right:8px;"><span style="color:#f59e0b;font-size:15px;">&#9679;</span></div>
                  현재 보험 점검
                </div>
                ${fd.totalPremium ? `
                  <div style="background:linear-gradient(135deg,#1e293b,#334155);padding:16px;border-radius:14px;margin-bottom:12px;color:white;box-shadow:inset 0 1px 0 rgba(255,255,255,0.1);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
                      <span style="font-size:14px;font-weight:500;opacity:0.9;">현재 월 납입료</span>
                      <span style="font-size:20px;font-weight:800;">${Number(fd.totalPremium).toLocaleString()}원</span>
                    </div>
                    ${fd.premiumEval ? `<div style="text-align:right;font-size:14px;font-weight:700;color:${fd.premiumEval === '부족' ? '#fbbf24' : fd.premiumEval === '적정' ? '#4ade80' : '#f87171'};margin-top:4px;">소득 대비 ${fd.premiumEval}</div>` : ''}
                  </div>
                ` : ''}
                ${fd.expertComment ? `<div style="font-size:14px;color:#475569;line-height:1.6;padding:12px 14px;background:#f8fafc;border-radius:12px;border:1px solid #f1f5f9;margin-bottom:12px;">${Utils.escapeHtml(fd.expertComment)}</div>` : ''}
                ${this._renderMobilePreviewCoverageInline(fd)}
                ${this._existingPolicies.filter(p => p.company || p.productName).map(p => `
                  <div style="border:1px solid #e2e8f0;border-radius:14px;padding:14px;margin-bottom:8px;background:white;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <div>
                        <div style="font-size:14px;font-weight:700;color:#1e293b;">${Utils.escapeHtml(p.company || '')}</div>
                        <div style="font-size:13px;color:#94a3b8;margin-top:1px;">${Utils.escapeHtml(p.productName || '')}</div>
                      </div>
                      ${p.premium ? `<div style="font-size:16px;font-weight:800;color:#1e293b;">${Number(p.premium).toLocaleString()}원</div>` : ''}
                    </div>
                    ${p.paymentPeriodEval || p.coverageEval ? `
                      <div style="display:flex;gap:6px;margin-top:8px;padding-top:8px;border-top:1px solid #f1f5f9;">
                        ${p.paymentPeriodEval ? `<span style="font-size:12px;padding:3px 8px;border-radius:8px;font-weight:600;background:#f1f5f9;color:#475569;">납입 ${p.paymentPeriodEval}</span>` : ''}
                        ${p.coverageEval ? `<span style="font-size:12px;padding:3px 8px;border-radius:8px;font-weight:600;background:${p.coverageEval === '부족' ? '#fef2f2' : p.coverageEval === '충분' ? '#ecfdf5' : '#fffbeb'};color:${p.coverageEval === '부족' ? '#dc2626' : p.coverageEval === '충분' ? '#16a34a' : '#d97706'};">보장 ${p.coverageEval}</span>` : ''}
                      </div>
                    ` : ''}
                    ${p.coverageChecks && p.coverageChecks.length > 0 ? `
                      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px;">
                        ${p.coverageChecks.map(c => `<span style="font-size:11px;padding:2px 6px;border-radius:8px;background:#eff6ff;color:#3b82f6;border:1px solid #bfdbfe;">${Utils.escapeHtml(c)}</span>`).join('')}
                      </div>
                    ` : ''}
                    ${p.opinion ? `<div style="font-size:13px;color:#6366f1;margin-top:8px;padding:8px 10px;background:#eef2ff;border-radius:8px;">${Utils.escapeHtml(p.opinion)}</div>` : ''}
                    ${p.images && p.images.length > 0 ? `
                      <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px;">
                        ${this._renderImageSlider(p.images, 'ep-slider-' + this._existingPolicies.indexOf(p))}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : `${this._renderMobilePreviewCoverageInline(fd) ? `
              <div style="background:white;border-radius:20px;padding:20px;box-shadow:0 8px 30px rgba(0,0,0,0.04);border:1px solid rgba(241,245,249,0.5);">
                <div style="font-size:16px;font-weight:700;color:#1e293b;margin-bottom:12px;display:flex;align-items:center;">
                  <div style="width:28px;height:28px;border-radius:50%;background:#fffbeb;display:flex;align-items:center;justify-content:center;margin-right:8px;"><span style="color:#f59e0b;font-size:15px;">&#9679;</span></div>
                  현재 보험 점검
                </div>
                ${this._renderMobilePreviewCoverageInline(fd)}
              </div>
            ` : ''}`}

            <!-- Expert Recommendation -->
            ${(fd.urgentItem || fd.proposalReason || this._recommendedPlans.length > 0) ? `
              <div style="background:linear-gradient(135deg,#1e3a8a,#312e81);padding:3px;border-radius:22px;box-shadow:0 8px 30px rgba(0,0,0,0.04);">
                <div style="background:white;padding:18px;border-radius:20px;">
                  <div style="font-size:16px;font-weight:700;color:#1e293b;margin-bottom:12px;display:flex;align-items:center;">
                    <div style="width:28px;height:28px;border-radius:50%;background:#eef2ff;display:flex;align-items:center;justify-content:center;margin-right:8px;"><span style="color:#4f46e5;font-size:15px;">&#9733;</span></div>
                    전문가의 제안
                  </div>
                  ${fd.urgentItem ? `
                    <div style="background:#eef2ff;border:1px solid #c7d2fe;padding:12px 14px;border-radius:12px;margin-bottom:12px;">
                      <div style="font-size:12px;font-weight:800;color:#6366f1;margin-bottom:4px;">필수 보완 타겟</div>
                      <div style="font-size:15px;color:#1e293b;font-weight:600;">${Utils.escapeHtml(fd.urgentItem)}</div>
                    </div>
                  ` : ''}
                  ${fd.proposalReason ? `<div style="font-size:14px;color:#475569;line-height:1.6;padding:12px 14px;background:#f8fafc;border-radius:12px;margin-bottom:12px;">${Utils.escapeHtml(fd.proposalReason)}</div>` : ''}
                  ${this._recommendedPlans.filter(p => p.company || p.productName).map(p => `
                    <div style="border:1px solid #e0e7ff;border-radius:14px;padding:14px;margin-bottom:8px;background:linear-gradient(135deg,#fafafe,#eef2ff);">
                      <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div>
                          <div style="font-size:14px;font-weight:700;color:#1e293b;">${Utils.escapeHtml(p.company || '')}</div>
                          <div style="font-size:13px;color:#6366f1;margin-top:1px;">${Utils.escapeHtml(p.productName || '')}</div>
                        </div>
                        ${p.premium ? `<div style="font-size:16px;font-weight:800;color:#4f46e5;">${Number(p.premium).toLocaleString()}원<span style="font-size:12px;color:#94a3b8;font-weight:400;">/월</span></div>` : ''}
                      </div>
                      ${p.paymentPeriodEval || p.maturityAge || p.coverageEval ? `
                        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;padding-top:8px;border-top:1px solid #e0e7ff;">
                          ${p.paymentPeriodEval ? `<span style="font-size:12px;padding:3px 8px;border-radius:8px;font-weight:600;background:#eef2ff;color:#4338ca;">${p.paymentPeriodEval}</span>` : ''}
                          ${p.maturityAge ? `<span style="font-size:12px;padding:3px 8px;border-radius:8px;font-weight:600;background:#f0fdf4;color:#16a34a;">${p.maturityAge}</span>` : ''}
                          ${p.coverageEval ? `<span style="font-size:12px;padding:3px 8px;border-radius:8px;font-weight:600;background:${p.coverageEval === '부족' ? '#fef2f2' : p.coverageEval === '충분' ? '#ecfdf5' : '#fffbeb'};color:${p.coverageEval === '부족' ? '#dc2626' : p.coverageEval === '충분' ? '#16a34a' : '#d97706'};">보장 ${p.coverageEval}</span>` : ''}
                        </div>
                      ` : ''}
                      ${p.coverageChecks && p.coverageChecks.length > 0 ? `
                        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px;">
                          ${p.coverageChecks.map(c => `<span style="font-size:11px;padding:2px 6px;border-radius:8px;background:#ecfdf5;color:#059669;border:1px solid #a7f3d0;">${Utils.escapeHtml(c)}</span>`).join('')}
                        </div>
                      ` : ''}
                      ${p.highlight ? `<div style="font-size:13px;color:#059669;margin-top:8px;padding:8px 10px;background:#ecfdf5;border-radius:8px;">&#10003; ${Utils.escapeHtml(p.highlight)}</div>` : ''}
                      ${p.opinion ? `<div style="font-size:13px;color:#6366f1;margin-top:8px;padding:8px 10px;background:#eef2ff;border-radius:8px;">${Utils.escapeHtml(p.opinion)}</div>` : ''}
                      ${p.images && p.images.length > 0 ? `
                        <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px;">
                          ${this._renderImageSlider(p.images, 'rp-slider-' + this._recommendedPlans.indexOf(p))}
                        </div>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- CTA Buttons -->
            <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px;">
              <button style="width:100%;padding:16px;border:none;border-radius:16px;font-size:16px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#facc15,#eab308);color:#1e293b;box-shadow:0 4px 14px rgba(234,179,8,0.3);">
                &#128172; 카카오톡 상담
              </button>
              <button style="width:100%;padding:16px;border:none;border-radius:16px;font-size:16px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#0f172a,#1e293b);color:white;box-shadow:0 4px 14px rgba(15,23,42,0.3);">
                &#128222; 전화 상담
              </button>
              <button style="width:100%;padding:14px;border:1.5px solid #e2e8f0;border-radius:16px;font-size:15px;font-weight:600;cursor:pointer;background:white;color:#1e293b;box-shadow:0 1px 3px rgba(0,0,0,0.04);display:flex;align-items:center;justify-content:center;gap:6px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#facc15"><path d="M12 3C6.5 3 2 6.58 2 11c0 2.83 1.82 5.3 4.55 6.7-.22.98-.82 3.1-.94 3.58-.14.57.21.56.45.41.19-.12 2.83-1.92 3.97-2.7.62.09 1.27.14 1.97.14 5.5 0 10-3.58 10-8S17.5 3 12 3z"/></svg>
                카카오채널 추가하기
              </button>
            </div>

            <!-- Footer -->
            <div style="text-align:center;padding:12px 0 4px;font-size:12px;color:#94a3b8;">
              PRIMEASSET | ${Utils.escapeHtml(agentName)}<br>
              ${new Date().toLocaleDateString('ko-KR')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ==================== Coverage Analysis Mobile Preview ====================
  _renderImageSlider(images, sliderId) {
    const imgItems = images.filter(img => !img.url.endsWith('.pdf'));
    const pdfItems = images.filter(img => img.url.endsWith('.pdf'));

    let html = '';

    // PDF는 그대로 링크로 표시
    pdfItems.forEach(img => {
      html += `
        <div>
          <a href="${Utils.escapeHtml(img.url)}" target="_blank" style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:#eff6ff;border-radius:8px;border:1px solid #bfdbfe;text-decoration:none;">
            <svg width="20" height="20" fill="none" stroke="#3b82f6" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span style="font-size:13px;color:#3b82f6;font-weight:600;">첨부된 PDF파일 열기</span>
          </a>
          ${img.comment ? `<div style="font-size:13px;color:#64748b;margin-top:4px;padding:4px 8px;background:#f8fafc;border-radius:6px;">${Utils.escapeHtml(img.comment)}</div>` : ''}
        </div>
      `;
    });

    // 이미지 1장이면 그냥 표시
    if (imgItems.length === 1) {
      const img = imgItems[0];
      html += `
        <div>
          <img src="${Utils.escapeHtml(img.url)}" style="width:100%;border-radius:8px;border:1px solid #e2e8f0;">
          ${img.comment ? `<div style="font-size:13px;color:#64748b;margin-top:4px;padding:4px 8px;background:#f8fafc;border-radius:6px;">${Utils.escapeHtml(img.comment)}</div>` : ''}
        </div>
      `;
    }

    // 이미지 2장 이상이면 슬라이드
    if (imgItems.length >= 2) {
      const id = sliderId || ('slider-' + Math.random().toString(36).substr(2, 6));
      html += `
        <div style="position:relative;overflow:hidden;border-radius:8px;border:1px solid #e2e8f0;">
          <div id="${id}" style="display:flex;transition:transform 0.3s ease;width:${imgItems.length * 100}%;">
            ${imgItems.map(img => `
              <div style="width:${100 / imgItems.length}%;flex-shrink:0;">
                <img src="${Utils.escapeHtml(img.url)}" style="width:100%;display:block;">
                ${img.comment ? `<div style="font-size:13px;color:#64748b;padding:6px 8px;background:#f8fafc;">${Utils.escapeHtml(img.comment)}</div>` : ''}
              </div>
            `).join('')}
          </div>
          <button onclick="ConsultationPage.slideImage('${id}',-1,${imgItems.length})" style="position:absolute;left:4px;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,0.5);color:white;border:none;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;">‹</button>
          <button onclick="ConsultationPage.slideImage('${id}',1,${imgItems.length})" style="position:absolute;right:4px;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,0.5);color:white;border:none;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;">›</button>
          <div style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:4px;" id="${id}-dots">
            ${imgItems.map((_, i) => `<div style="width:6px;height:6px;border-radius:50%;background:${i === 0 ? 'white' : 'rgba(255,255,255,0.5)'};"></div>`).join('')}
          </div>
        </div>
      `;
    }

    return html;
  },

  _sliderPositions: {},

  slideImage(id, dir, total) {
    if (!this._sliderPositions[id]) this._sliderPositions[id] = 0;
    let pos = this._sliderPositions[id] + dir;
    if (pos < 0) pos = total - 1;
    if (pos >= total) pos = 0;
    this._sliderPositions[id] = pos;

    const el = document.getElementById(id);
    if (el) el.style.transform = `translateX(-${pos * (100 / total)}%)`;

    const dots = document.getElementById(id + '-dots');
    if (dots) {
      Array.from(dots.children).forEach((dot, i) => {
        dot.style.background = i === pos ? 'white' : 'rgba(255,255,255,0.5)';
      });
    }
  },

  _renderMobilePreviewCoverageInline(fd) {
    const ca = fd.coverageAnalysis;
    if (!ca) return '';

    const cats = this._coverageCategories;
    const filledCats = cats.filter(cat => {
      const data = ca[cat.key];
      if (!data) return false;
      return cat.fields.some(f => data[f.key] !== undefined && data[f.key] !== '' && data[f.key] !== null);
    });

    if (filledCats.length === 0) return '';

    let html = `
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid #e2e8f0;">
        <div style="font-size:14px;font-weight:700;color:#2563eb;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
          <span style="font-size:15px;">🛡️</span> 전체 주요보장 한눈에 보기
        </div>
    `;

    filledCats.forEach(cat => {
      const data = ca[cat.key];
      const filledFields = cat.fields.filter(f => data[f.key] !== undefined && data[f.key] !== '' && data[f.key] !== null);

      html += `
        <div style="border:1px solid ${cat.border};border-radius:10px;padding:10px 12px;margin-bottom:8px;background:${cat.bg};">
          <div style="font-size:14px;font-weight:700;color:${cat.color};margin-bottom:6px;display:flex;align-items:center;gap:6px;">
            <span style="font-size:16px;">${cat.icon}</span> ${cat.title}
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:4px 12px;">
            ${filledFields.map(f => {
              const v = data[f.key];
              const unit = f.unit || '';
              const numVal = Number(v);
              const display = f.type === 'amount' ? (isNaN(numVal) ? '0' : numVal.toLocaleString()) + unit : Utils.escapeHtml(v);
              return `<div style="font-size:12px;color:#475569;"><span style="color:#94a3b8;">${f.label}:</span> <strong>${display}</strong></div>`;
            }).join('')}
          </div>
        </div>
      `;
    });

    html += '</div><div style="border-top:1px solid #e2e8f0;margin-top:12px;margin-bottom:14px;"></div>';
    return html;
  },

  // ==================== Form Interaction Methods ====================

  toggleTag(key) {
    if (!this._formData.tags) this._formData.tags = {};
    this._formData.tags[key] = !this._formData.tags[key];
    this.autoSave();
    this._refreshPreview();
  },

  toggleLinks() {
    this._formData.showLinks = document.getElementById('c-show-links').checked;
    const container = document.getElementById('links-container');
    container.style.display = this._formData.showLinks ? '' : 'none';
    this.autoSave();
    this._refreshPreview();
  },

  addLink() {
    this._referenceLinks.push({ title: '', url: '' });
    const list = document.getElementById('links-list');
    list.innerHTML = this._referenceLinks.map((l, i) => this._renderLinkRow(i, l)).join('');
  },

  updateLink(index, field, value) {
    this._referenceLinks[index][field] = value;
    this.autoSave();
  },

  removeLink(index) {
    this._referenceLinks.splice(index, 1);
    const list = document.getElementById('links-list');
    list.innerHTML = this._referenceLinks.map((l, i) => this._renderLinkRow(i, l)).join('');
    this.autoSave();
  },

  toggleHealthTip(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
  },

  toggleHealthCheck(key) {
    if (!this._formData.healthChecks) this._formData.healthChecks = {};
    // Collect any existing health detail text before toggling
    ['checkup', 'recent3m', 'recheck1y', 'general5y', 'disease11'].forEach(k => {
      const el = document.getElementById('health-detail-' + k);
      if (el) {
        if (!this._formData.healthDetails) this._formData.healthDetails = {};
        this._formData.healthDetails[k] = el.value;
      }
    });
    this._formData.healthChecks[key] = !this._formData.healthChecks[key];
    // Re-render only the health checks container
    const container = document.getElementById('health-checks-container');
    if (container) {
      container.innerHTML = this._healthItems.map(h => this._renderHealthCheckItem(h.key, h.title, h.question, h.placeholder, h.tooltip)).join('');
    }
    this.autoSave();
    this._refreshPreview();
  },

  togglePolicyCoverage(policyIndex, item) {
    const policy = this._existingPolicies[policyIndex];
    if (!policy) return;
    if (!policy.coverageChecks) policy.coverageChecks = [];
    const idx = policy.coverageChecks.indexOf(item);
    if (idx >= 0) policy.coverageChecks.splice(idx, 1);
    else policy.coverageChecks.push(item);
    // Re-render the policy card
    const list = document.getElementById('existing-policies-list');
    if (list) list.innerHTML = this._existingPolicies.map((p, i) => this._renderExistingPolicy(i, p)).join('');
    this.autoSave();
    this._refreshPreview();
  },

  toggleRecommendedCoverage(planIndex, item) {
    const plan = this._recommendedPlans[planIndex];
    if (!plan) return;
    if (!plan.coverageChecks) plan.coverageChecks = [];
    const idx = plan.coverageChecks.indexOf(item);
    if (idx >= 0) plan.coverageChecks.splice(idx, 1);
    else plan.coverageChecks.push(item);
    // Re-render the plan card
    const list = document.getElementById('recommended-plans-list');
    if (list) list.innerHTML = this._recommendedPlans.map((p, i) => this._renderRecommendedPlan(i, p)).join('');
    this.autoSave();
    this._refreshPreview();
  },

  setEval(value) {
    this._formData.premiumEval = value;
    // Update button styles inline (부족→적정→과다 순서)
    ['부족','적정','과다'].forEach(v => {
      const btn = document.getElementById('eval-btn-' + v);
      if (btn) {
        if (v === value) {
          if (v === '적정') btn.style.cssText = 'flex:1;border-radius:0;justify-content:center;font-size:13px;padding:10px;border:none;border-right:1px solid var(--gray-200);background:#dcfce7;color:#16a34a;font-weight:700;';
          else if (v === '과다') btn.style.cssText = 'flex:1;border-radius:0;justify-content:center;font-size:13px;padding:10px;border:none;border-right:1px solid var(--gray-200);background:#fef2f2;color:#dc2626;font-weight:700;';
          else btn.style.cssText = 'flex:1;border-radius:0;justify-content:center;font-size:13px;padding:10px;border:none;border-right:1px solid var(--gray-200);background:#fef3c7;color:#92400e;font-weight:700;';
        } else {
          btn.style.cssText = 'flex:1;border-radius:0;justify-content:center;font-size:13px;padding:10px;border:none;border-right:1px solid var(--gray-200);background:white;color:var(--gray-500);';
        }
      }
    });
    this.autoSave();
  },

  async handleSectionImageUpload(files) {
    if (!files || files.length === 0) return;
    if (!this._formData.sectionImages) this._formData.sectionImages = [];

    for (const file of files) {
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        showToast('이미지 또는 PDF 파일만 업로드 가능합니다.', 'error');
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        showToast('파일 크기는 10MB 이하여야 합니다.', 'error');
        continue;
      }
      try {
        const result = await API.uploadPolicyImage(file);
        this._formData.sectionImages.push({ url: result.url, filename: result.filename });
        showToast('이미지가 업로드되었습니다.', 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
    this._refreshSectionImages();
    this.autoSave();
  },

  async removeSectionImage(imageIndex) {
    if (!this._formData.sectionImages) return;
    const img = this._formData.sectionImages[imageIndex];
    if (img && img.filename) {
      try { await API.deletePolicyImage(img.filename); } catch(e) { /* ignore */ }
    }
    this._formData.sectionImages.splice(imageIndex, 1);
    this._refreshSectionImages();
    this.autoSave();
  },

  _refreshSectionImages() {
    const container = document.getElementById('section-policy-images');
    const emptyEl = document.getElementById('section-image-empty');
    const images = this._formData.sectionImages || [];

    if (container) {
      container.innerHTML = images.map((img, idx) => `
        <div style="position:relative;width:100px;height:100px;border-radius:10px;overflow:hidden;border:1px solid var(--border);background:var(--muted);">
          <img src="${Utils.escapeHtml(img.url)}" style="width:100%;height:100%;object-fit:cover;cursor:pointer;" onclick="ConsultationPage.previewPolicyImage('${Utils.escapeHtml(img.url)}')" alt="증권이미지">
          <button onclick="ConsultationPage.removeSectionImage(${idx})" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.6);color:white;border:none;border-radius:50%;width:22px;height:22px;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;">&times;</button>
        </div>
      `).join('');
    }

    if (emptyEl) {
      emptyEl.style.display = images.length > 0 ? 'none' : 'block';
    }
  },

  async handlePolicyImageUpload(index, files) {
    if (!files || files.length === 0) return;
    const policy = this._existingPolicies[index];
    if (!policy.images) policy.images = [];

    for (const file of files) {
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        showToast('이미지 또는 PDF 파일만 업로드 가능합니다.', 'error');
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        showToast('파일 크기는 10MB 이하여야 합니다.', 'error');
        continue;
      }
      try {
        const result = await API.uploadPolicyImage(file);
        policy.images.push({ url: result.url, filename: result.filename });
      } catch (err) {
        showToast(err.message, 'error');
      }
    }

    const list = document.getElementById('existing-policies-list');
    list.innerHTML = this._existingPolicies.map((p, i) => this._renderExistingPolicy(i, p)).join('');
    this.autoSave();
  },

  updatePolicyImageComment(policyIndex, imageIndex, value) {
    const policy = this._existingPolicies[policyIndex];
    if (!policy?.images?.[imageIndex]) return;
    policy.images[imageIndex].comment = value;
    this.autoSave();
    this._refreshPreview();
  },

  async removePolicyImage(policyIndex, imageIndex) {
    const policy = this._existingPolicies[policyIndex];
    if (!policy.images) return;
    const img = policy.images[imageIndex];
    if (img && img.filename) {
      try { await API.deletePolicyImage(img.filename); } catch(e) { /* ignore */ }
    }
    policy.images.splice(imageIndex, 1);
    const list = document.getElementById('existing-policies-list');
    list.innerHTML = this._existingPolicies.map((p, i) => this._renderExistingPolicy(i, p)).join('');
    this.autoSave();
  },

  async handleRecommendedImageUpload(index, files) {
    const plan = this._recommendedPlans[index];
    if (!plan) return;
    if (!plan.images) plan.images = [];
    for (const file of files) {
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        showToast('이미지 또는 PDF 파일만 업로드 가능합니다.', 'error');
        continue;
      }
      if (file.size > 10 * 1024 * 1024) { showToast('10MB 이하만 가능합니다.', 'error'); continue; }
      try {
        const result = await API.uploadPolicyImage(file);
        plan.images.push({ url: result.url, filename: result.filename });
      } catch (err) { showToast(err.message, 'error'); }
    }
    const list = document.getElementById('recommended-plans-list');
    if (list) list.innerHTML = this._recommendedPlans.map((p, i) => this._renderRecommendedPlan(i, p)).join('');
    this.autoSave();
  },

  updateRecommendedImageComment(planIndex, imageIndex, value) {
    const plan = this._recommendedPlans[planIndex];
    if (!plan?.images?.[imageIndex]) return;
    plan.images[imageIndex].comment = value;
    this.autoSave();
    this._refreshPreview();
  },

  async removeRecommendedImage(planIndex, imageIndex) {
    const plan = this._recommendedPlans[planIndex];
    if (!plan || !plan.images) return;
    const img = plan.images[imageIndex];
    if (img && img.filename) {
      try { await API.deletePolicyImage(img.filename); } catch(e) { /* ignore */ }
    }
    plan.images.splice(imageIndex, 1);
    const list = document.getElementById('recommended-plans-list');
    if (list) list.innerHTML = this._recommendedPlans.map((p, i) => this._renderRecommendedPlan(i, p)).join('');
    this.autoSave();
  },

  previewPolicyImage(url) {
    Modal.show('증권 이미지', `
      <div style="text-align:center;">
        <img src="${Utils.escapeHtml(url)}" style="max-width:100%;max-height:70vh;border-radius:8px;" alt="증권이미지">
      </div>
    `, `<button class="btn btn-secondary" onclick="Modal.close()">닫기</button>`);
  },

  addExistingPolicy() {
    this._existingPolicies.push({ company: '', productName: '', premium: '', coverage: '', opinion: '', images: [] });
    const list = document.getElementById('existing-policies-list');
    list.innerHTML = this._existingPolicies.map((p, i) => this._renderExistingPolicy(i, p)).join('');
  },

  updateExistingPolicy(index, field, value) {
    this._existingPolicies[index][field] = value;
    this.autoSave();
  },

  removeExistingPolicy(index) {
    this._existingPolicies.splice(index, 1);
    const list = document.getElementById('existing-policies-list');
    list.innerHTML = this._existingPolicies.map((p, i) => this._renderExistingPolicy(i, p)).join('');
    this.autoSave();
  },

  addRecommendedPlan() {
    this._recommendedPlans.push({ company: '', productName: '', premium: '', coverage: '', highlight: '' });
    const list = document.getElementById('recommended-plans-list');
    list.innerHTML = this._recommendedPlans.map((p, i) => this._renderRecommendedPlan(i, p)).join('');
  },

  updateRecommendedPlan(index, field, value) {
    this._recommendedPlans[index][field] = value;
    this.autoSave();
  },

  removeRecommendedPlan(index) {
    this._recommendedPlans.splice(index, 1);
    const list = document.getElementById('recommended-plans-list');
    list.innerHTML = this._recommendedPlans.map((p, i) => this._renderRecommendedPlan(i, p)).join('');
    this.autoSave();
  },

  _refreshPreview() {
    const wrapper = document.getElementById('mobile-preview-wrapper');
    if (wrapper) {
      // 스크롤 위치 보존
      const scrollEl = wrapper.querySelector('[data-preview-scroll]');
      const scrollTop = scrollEl ? scrollEl.scrollTop : 0;
      wrapper.innerHTML = this._renderMobilePreview();
      const newScrollEl = wrapper.querySelector('[data-preview-scroll]');
      if (newScrollEl && scrollTop > 0) {
        newScrollEl.scrollTop = scrollTop;
      }
    }
  },

  _refreshEditor() {
    // No-op: avoid full page reload which loses unsaved state
  },

  // 생년월일 입력 시 상령일 자동 표시
  updateAnniversaryDisplay() {
    const birthInput = document.getElementById('c-birthdate');
    const display = document.getElementById('c-anniversary-display');
    if (!birthInput || !display) return;
    const val = birthInput.value;
    if (val && val.length === 10) {
      const anniv = Utils.calculatePolicyAnniversary(val);
      if (anniv) {
        const [y, m, d] = anniv.split('-');
        display.innerHTML = '<i class="fas fa-calendar-check" style="margin-right:4px;"></i>상령일: ' + y + '년 ' + parseInt(m) + '월 ' + parseInt(d) + '일';
        display.style.display = '';
      } else {
        display.style.display = 'none';
      }
    } else {
      display.style.display = 'none';
    }
  },

  // ==================== Collect Form Data ====================
  _collectFormData() {
    const birthdateEl = document.getElementById('c-birthdate');
    const genderEl = document.getElementById('c-gender');
    const jobEl = document.getElementById('c-job');
    const addressEl = document.getElementById('c-address');
    const addressDetailEl = document.getElementById('c-address-detail');
    const totalPremiumEl = document.getElementById('c-total-premium');
    const expertCommentEl = document.getElementById('c-expert-comment');
    const urgentEl = document.getElementById('c-urgent');
    const proposalReasonEl = document.getElementById('c-proposal-reason');

    // Collect health details from textareas
    const healthDetails = { ...this._formData.healthDetails };
    ['checkup', 'hospital1y', 'recheck1y', 'surgery5y', 'history6y'].forEach(key => {
      const el = document.getElementById('health-detail-' + key);
      if (el) healthDetails[key] = el.value;
    });

    // Collect coverage analysis fields from open sections
    this._collectCoverageFields();

    this._formData = {
      ...this._formData,
      birthdate: birthdateEl ? birthdateEl.value : this._formData.birthdate,
      gender: genderEl ? genderEl.value : this._formData.gender,
      job: jobEl ? jobEl.value : this._formData.job,
      address: addressEl ? addressEl.value : this._formData.address,
      addressDetail: addressDetailEl ? addressDetailEl.value : this._formData.addressDetail,
      totalPremium: totalPremiumEl ? Utils.getMoneyValue(totalPremiumEl) : this._formData.totalPremium,
      expertComment: expertCommentEl ? expertCommentEl.value : this._formData.expertComment,
      urgentItem: urgentEl ? urgentEl.value : this._formData.urgentItem,
      proposalReason: proposalReasonEl ? proposalReasonEl.value : this._formData.proposalReason,
      healthDetails,
      referenceLinks: this._referenceLinks,
      existingPolicies: this._existingPolicies,
      recommendedPlans: this._recommendedPlans,
      coverageAnalysis: this._formData.coverageAnalysis || {},
      sectionImages: this._formData.sectionImages || []
    };

    return this._formData;
  },

  // ==================== Auto Save ====================
  _autoSaveTimer: null,
  autoSave() {
    clearTimeout(this._autoSaveTimer);
    const statusEl = document.getElementById('autosave-status');
    if (statusEl) {
      statusEl.innerHTML = '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#f59e0b;margin-right:4px;animation:pulse 1s infinite;"></span> 저장 중...';
      statusEl.style.background = '#fffbeb';
      statusEl.style.color = '#d97706';
    }

    this._autoSaveTimer = setTimeout(async () => {
      try {
        const id = this.currentConsultation.id;
        const formData = this._collectFormData();
        const proposalJson = JSON.stringify(formData);

        await API.updateConsultation(id, {
          proposal_html: proposalJson,
          progress_memo: document.getElementById('c-memo')?.value || '',
          checklist: this.currentConsultation.checklist || {}
        });

        const st = document.getElementById('autosave-status');
        if (st) {
          st.innerHTML = '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#10b981;margin-right:4px;"></span> 저장됨';
          st.style.background = '#ecfdf5';
          st.style.color = '#059669';
        }

        // Update preview
        this._refreshPreview();
      } catch (err) {
        const st = document.getElementById('autosave-status');
        if (st) {
          st.innerHTML = '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#ef4444;margin-right:4px;"></span> 저장 실패';
          st.style.background = '#fef2f2';
          st.style.color = '#dc2626';
        }
        console.error('Autosave error:', err);
      }
    }, 500);
  },

  // ==================== Unchanged Core Methods ====================

  // ==================== New Consultation Page (inline in editor) ====================
  async _renderNewPage(customerId) {
    this._newConsultationCustomerId = customerId || null;

    // 고객이 이미 지정되어 있으면 바로 상담 생성 후 에디터로
    if (customerId) {
      try {
        const { consultation } = await API.createConsultation({
          customer_id: parseInt(customerId),
          title: '새 상담'
        });
        return await this.renderEditor(consultation.id);
      } catch (err) {
        showToast(err.message, 'error');
      }
    }

    // 에디터 레이아웃 안에 고객 선택 UI 포함
    return `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h1 class="page-title" style="font-size:22px;">새 제안서 작성</h1>
          <p class="page-subtitle">고객을 선택하여 맞춤 제안서를 작성하세요</p>
        </div>
      </div>

      <div class="consultation-layout" style="grid-template-columns:1fr 420px;gap:28px;">
        <!-- LEFT: Form Area -->
        <div style="display:flex;flex-direction:column;gap:0;">

          <!-- Section 1: 고객 선택 -->
          <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
            <div class="card-header" style="margin-bottom:16px;">
              <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#dbeafe,#c7d2fe);border-radius:8px;">
                  <svg width="14" height="14" fill="none" stroke="#4338ca" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </span>
                고객 선택
              </h3>
            </div>
            <div id="nc-selected-customer" style="margin-bottom:8px;display:none;"></div>
            <div id="nc-search-area">
              <div style="position:relative;margin-bottom:6px;">
                <input type="text" class="form-input" id="nc-customer-search" placeholder="이름 또는 연락처로 검색..." oninput="ConsultationPage.filterNewCustomerList(this.value)" style="border-radius:10px;padding-left:36px;font-size:13px;" autofocus>
                <svg width="14" height="14" fill="none" stroke="var(--gray-400)" stroke-width="2" viewBox="0 0 24 24" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              </div>
              <div id="nc-customer-list" style="max-height:320px;overflow-y:auto;border:1px solid var(--gray-200);border-radius:10px;padding:4px;">
                ${this._renderNewCustomerList('')}
              </div>
            </div>
            <div style="margin-top:14px;">
              <button type="button" class="btn btn-primary" id="nc-start-btn" onclick="ConsultationPage.createAndOpenEditor()" style="width:100%;background:linear-gradient(135deg,#4f46e5,#6366f1);border:none;border-radius:10px;padding:14px;font-size:15px;font-weight:700;box-shadow:0 4px 14px rgba(79,70,229,0.3);">
                제안서 작성 시작
              </button>
            </div>
          </div>

          <!-- 나머지 섹션들 (비활성) -->
          <div style="opacity:0.4;pointer-events:none;">
            <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
              <div class="card-header"><h3 class="card-title" style="display:flex;align-items:center;gap:8px;"><span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#dbeafe,#c7d2fe);border-radius:8px;"><svg width="14" height="14" fill="none" stroke="#4338ca" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></span>고객 기본 정보</h3></div>
              <div class="grid-2">
                <div class="form-group"><label class="form-label">생년월일</label><input type="text" class="form-input" disabled placeholder="19900101" style="border-radius:10px;"></div>
                <div class="form-group"><label class="form-label">성별</label><select class="form-input" disabled style="border-radius:10px;"><option>선택</option></select></div>
              </div>
            </div>
            <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
              <div class="card-header"><h3 class="card-title" style="display:flex;align-items:center;gap:8px;"><span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#fce7f3,#fbcfe8);border-radius:8px;"><svg width="14" height="14" fill="none" stroke="#db2777" stroke-width="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg></span>병력 체크</h3></div>
            </div>
            <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
              <div class="card-header"><h3 class="card-title" style="display:flex;align-items:center;gap:8px;"><span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#dcfce7,#bbf7d0);border-radius:8px;"><svg width="14" height="14" fill="none" stroke="#16a34a" stroke-width="2" viewBox="0 0 24 24"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg></span>기존 보험 분석</h3></div>
            </div>
          </div>

        </div>

        <!-- RIGHT: Preview placeholder -->
        <div style="position:sticky;top:24px;align-self:start;">
          <div style="background:#f8fafc;border-radius:14px;border:2px dashed #e2e8f0;padding:40px 20px;text-align:center;">
            <div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
              <svg width="28" height="28" fill="none" stroke="#6366f1" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            </div>
            <div style="font-size:14px;font-weight:600;color:var(--gray-500);margin-bottom:4px;">미리보기</div>
            <div style="font-size:12px;color:var(--gray-400);">고객을 선택하면 제안서 미리보기가 표시됩니다</div>
          </div>
        </div>
      </div>
    `;
  },

  async createAndOpenEditor() {
    const customerId = this._newConsultationCustomerId;
    if (!customerId) {
      showToast('고객을 선택하세요.', 'error');
      return;
    }
    try {
      const btn = document.getElementById('nc-start-btn');
      if (btn) { btn.disabled = true; btn.textContent = '생성 중...'; }
      const { consultation } = await API.createConsultation({
        customer_id: parseInt(customerId),
        title: '새 상담'
      });
      App.navigate('consultation', { consultationId: consultation.id });
    } catch (err) {
      showToast(err.message, 'error');
      const btn = document.getElementById('nc-start-btn');
      if (btn) { btn.disabled = false; btn.textContent = '제안서 작성 시작'; }
    }
  },

  _newConsultationCustomerId: null,

  showNewConsultation(customerId) {
    this._newConsultationCustomerId = customerId || null;
    const preselected = customerId ? this.customers.find(c => c.id == customerId) : null;

    Modal.show('새 상담', `
      <form id="new-consultation-form">
        <div class="form-group">
          <label class="form-label">고객 선택 *</label>
          <!-- 선택된 고객 표시 -->
          <div id="nc-selected-customer" style="margin-bottom:8px;${preselected ? '' : 'display:none;'}">
            ${preselected ? `
              <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;background:#eff6ff;border:1.5px solid #93c5fd;">
                <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:#4338ca;">${Utils.escapeHtml(preselected.name[0])}</div>
                <div style="flex:1;">
                  <div style="font-size:14px;font-weight:600;color:var(--gray-800);">${Utils.escapeHtml(preselected.name)}</div>
                  <div style="font-size:12px;color:var(--gray-400);">${Utils.formatPhone(preselected.phone)}</div>
                </div>
                <span onclick="ConsultationPage.clearNewCustomer()" style="cursor:pointer;color:var(--gray-400);font-size:18px;padding:4px;">×</span>
              </div>
            ` : ''}
          </div>
          <!-- 검색 입력 -->
          <div id="nc-search-area" style="${preselected ? 'display:none;' : ''}">
            <div style="position:relative;margin-bottom:6px;">
              <input type="text" class="form-input" id="nc-customer-search" placeholder="이름 또는 연락처로 검색..." oninput="ConsultationPage.filterNewCustomerList(this.value)" style="border-radius:10px;padding-left:36px;font-size:13px;">
              <svg width="14" height="14" fill="none" stroke="var(--gray-400)" stroke-width="2" viewBox="0 0 24 24" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
            <div id="nc-customer-list" style="max-height:220px;overflow-y:auto;border:1px solid var(--gray-200);border-radius:10px;padding:4px;">
              ${this._renderNewCustomerList('')}
            </div>
          </div>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()" style="border-radius:8px;">취소</button>
      <button class="btn btn-primary" onclick="ConsultationPage.createConsultation()" style="border-radius:8px;background:linear-gradient(135deg,#3b82f6,#6366f1);border:none;">생성</button>
    `);
  },

  _renderNewCustomerList(search) {
    const query = (search || '').toLowerCase();
    const filtered = this.customers.filter(c => {
      if (!query) return true;
      return (c.name || '').toLowerCase().includes(query) || (c.phone || '').includes(query);
    });

    if (filtered.length === 0) {
      return '<div style="padding:16px;text-align:center;color:var(--gray-400);font-size:13px;">검색 결과가 없습니다</div>';
    }

    return filtered.map(c => `
      <div onclick="ConsultationPage.selectNewCustomer(${c.id})" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background=''">
        <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#4338ca;flex-shrink:0;">${Utils.escapeHtml((c.name || '-')[0])}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;font-weight:600;color:var(--gray-800);">${Utils.escapeHtml(c.name)}</div>
          <div style="font-size:11px;color:var(--gray-400);">${Utils.formatPhone(c.phone)}${c.birth_date ? ' · ' + Utils.formatDate(c.birth_date) : ''}</div>
        </div>
      </div>
    `).join('');
  },

  filterNewCustomerList(value) {
    const list = document.getElementById('nc-customer-list');
    if (list) list.innerHTML = this._renderNewCustomerList(value);
  },

  selectNewCustomer(id) {
    const c = this.customers.find(cu => cu.id === id);
    if (!c) return;
    this._newConsultationCustomerId = id;

    const selectedEl = document.getElementById('nc-selected-customer');
    const searchArea = document.getElementById('nc-search-area');
    if (selectedEl) {
      selectedEl.style.display = '';
      selectedEl.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;background:#eff6ff;border:1.5px solid #93c5fd;">
          <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:#4338ca;">${Utils.escapeHtml(c.name[0])}</div>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:600;color:var(--gray-800);">${Utils.escapeHtml(c.name)}</div>
            <div style="font-size:12px;color:var(--gray-400);">${Utils.formatPhone(c.phone)}${c.birth_date ? ' · ' + Utils.formatDate(c.birth_date) : ''}</div>
          </div>
          <span onclick="ConsultationPage.clearNewCustomer()" style="cursor:pointer;color:var(--gray-400);font-size:18px;padding:4px;">×</span>
        </div>
      `;
    }
    if (searchArea) searchArea.style.display = 'none';
  },

  clearNewCustomer() {
    this._newConsultationCustomerId = null;
    const selectedEl = document.getElementById('nc-selected-customer');
    const searchArea = document.getElementById('nc-search-area');
    if (selectedEl) { selectedEl.style.display = 'none'; selectedEl.innerHTML = ''; }
    if (searchArea) { searchArea.style.display = ''; }
    const searchInput = document.getElementById('nc-customer-search');
    if (searchInput) { searchInput.value = ''; searchInput.focus(); }
    this.filterNewCustomerList('');
  },

  async createConsultation() {
    const customerId = this._newConsultationCustomerId;

    if (!customerId) {
      showToast('고객을 선택하세요.', 'error');
      return;
    }

    try {
      const { consultation } = await API.createConsultation({
        customer_id: parseInt(customerId),
        title: '새 상담'
      });
      Modal.close();
      App.navigate('consultation', { consultationId: consultation.id });
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async shareConsultation(id) {
    try {
      const result = await API.shareConsultation(id);
      showToast('공유링크가 생성되었습니다!', 'success');
      await Utils.copyToClipboard(location.origin + result.share_url);
      showToast('링크가 클립보드에 복사되었습니다.', 'info');
      App.navigate('consultation', { consultationId: id });
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  deleteConsultation(id) {
    Modal.confirm('이 상담을 삭제하시겠습니까?', async () => {
      try {
        await API.deleteConsultation(id);
        showToast('삭제되었습니다.', 'success');
        App.navigate('consultation');
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }
};
