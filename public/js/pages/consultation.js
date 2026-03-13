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

  async render(params = {}) {
    try {
      const [companiesData, customersData, checkItemsData] = await Promise.all([
        API.getInsuranceCompanies(),
        API.getCustomers({ limit: 200 }),
        API.getCheckItems()
      ]);
      this.companies = companiesData.companies;
      this.customers = customersData.customers;
      this.checkItems = checkItemsData.items;

      if (params.consultationId) {
        return await this.renderEditor(params.consultationId);
      }

      return await this.renderList(params);
    } catch (err) {
      showToast(err.message, 'error');
      return '<div class="empty-state"><div class="empty-state-text">데이터를 불러오는 중 오류가 발생했습니다.</div></div>';
    }
  },

  async renderList(params = {}) {
    const data = await API.getConsultations();
    const consultations = data.consultations;

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

      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);">
        ${consultations.length > 0 ? `
          <table class="data-table">
            <thead>
              <tr>
                <th>고객</th>
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
                      <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#4338ca;">${Utils.escapeHtml((c.Customer?.name || '-')[0])}</div>
                      <strong style="color:var(--gray-800);">${Utils.escapeHtml(c.Customer?.name || '-')}</strong>
                    </div>
                  </td>
                  <td style="color:var(--blue);font-weight:500;">
                    ${Utils.escapeHtml(c.title || '(제목없음)')}
                  </td>
                  <td>${c.insurers?.map(i => `<span class="chip" style="background:linear-gradient(135deg,#eff6ff,#e0e7ff);color:#4338ca;border:1px solid #c7d2fe;">${Utils.escapeHtml(i.InsuranceCompany?.name || '')}</span>`).join(' ') || '<span style="color:var(--gray-400);">-</span>'}</td>
                  <td><span class="status-badge ${c.status==='작성중'?'ing':c.status==='발송완료'?'done':'before'}">${c.status || '작성중'}</span></td>
                  <td style="color:var(--gray-500);font-size:13px;">${Utils.formatDate(c.updated_at)}</td>
                  <td style="text-align:right;" onclick="event.stopPropagation();">
                    <button class="btn btn-secondary btn-sm" style="border-radius:6px;" onclick="App.navigate('consultation', {consultationId:${c.id}})">편집</button>
                    <button class="btn btn-sm" style="background:#fef2f2;color:#dc2626;border:1px solid #fecaca;border-radius:6px;" onclick="ConsultationPage.deleteConsultation(${c.id})">삭제</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `
          <div class="empty-state">
            <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#eff6ff,#e0e7ff);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
              <svg width="36" height="36" fill="none" stroke="#6366f1" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <div class="empty-state-text" style="font-size:16px;color:var(--gray-600);font-weight:500;">아직 상담이 없습니다</div>
            <p style="color:var(--gray-400);font-size:13px;margin-bottom:20px;">첫 번째 맞춤 보험 상담을 시작해보세요</p>
            <button class="btn btn-primary" style="background:linear-gradient(135deg,#3b82f6,#6366f1);border:none;" onclick="ConsultationPage.showNewConsultation()">첫 상담 시작하기</button>
          </div>
        `}
      </div>
    `;
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

    this._formData = {
      birthdate: savedData.birthdate || '',
      gender: savedData.gender || '',
      job: savedData.job || '',
      address: savedData.address || '',
      tags: savedData.tags || { children: false, driving: false, pet: false, homeowner: false },
      showLinks: savedData.showLinks || false,
      referenceLinks: savedData.referenceLinks || [],
      healthChecks: savedData.healthChecks || { checkup: false, hospital3m: false, recheck1y: false, surgery5y: false },
      healthDetails: savedData.healthDetails || { checkup: '', hospital3m: '', recheck1y: '', surgery5y: '' },
      totalPremium: savedData.totalPremium || '',
      premiumEval: savedData.premiumEval || '',
      expertComment: savedData.expertComment || '',
      existingPolicies: savedData.existingPolicies || [],
      urgentItem: savedData.urgentItem || '',
      proposalReason: savedData.proposalReason || '',
      recommendedPlans: savedData.recommendedPlans || [],
      coverageAnalysis: savedData.coverageAnalysis || {}
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
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
            목록으로
          </button>
          <h1 class="page-title" style="font-size:22px;">${Utils.escapeHtml(consultation.title || '상담 편집')}</h1>
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
            <div class="form-group">
              <label class="form-label">제목</label>
              <input type="text" class="form-input" id="c-title" value="${Utils.escapeHtml(consultation.title || '')}" oninput="ConsultationPage.autoSave()" style="border-radius:10px;">
            </div>
            <div class="form-group">
              <label class="form-label">고객 선택</label>
              <select class="form-input" id="c-customer" style="border-radius:10px;" disabled>
                <option value="">${Utils.escapeHtml(customerName)}</option>
              </select>
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">생년월일</label>
                <input type="date" class="form-input" id="c-birthdate" value="${this._formData.birthdate}" oninput="ConsultationPage.autoSave()" style="border-radius:10px;">
              </div>
              <div class="form-group">
                <label class="form-label">성별</label>
                <select class="form-input" id="c-gender" style="border-radius:10px;" onchange="ConsultationPage.autoSave()">
                  <option value="">선택</option>
                  <option value="남성" ${this._formData.gender === '남성' ? 'selected' : ''}>남성</option>
                  <option value="여성" ${this._formData.gender === '여성' ? 'selected' : ''}>여성</option>
                </select>
              </div>
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">직업</label>
                <select class="form-input" id="c-job" style="border-radius:10px;" onchange="ConsultationPage.autoSave()">
                  <option value="">선택</option>
                  ${['사무직','현장직','자영업','주부','학생','전문직'].map(j => `<option value="${j}" ${this._formData.job === j ? 'selected' : ''}>${j}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">주소</label>
                <input type="text" class="form-input" id="c-address" value="${Utils.escapeHtml(this._formData.address)}" oninput="ConsultationPage.autoSave()" placeholder="시/도 구/군" style="border-radius:10px;">
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

          <!-- Section 4: 병력 체크 (최근 5년) -->
          <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
            <div class="card-header" style="margin-bottom:16px;">
              <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#fce7f3,#fbcfe8);border-radius:8px;">
                  <svg width="14" height="14" fill="none" stroke="#db2777" stroke-width="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                </span>
                병력 체크 <span style="font-size:12px;color:var(--gray-400);font-weight:400;margin-left:4px;">(최근 5년)</span>
              </h3>
            </div>
            <div id="health-checks-container" style="display:flex;flex-direction:column;gap:12px;">
              ${this._renderHealthCheckItem('checkup', '최근 건강검진 내역')}
              ${this._renderHealthCheckItem('hospital3m', '3개월 이내 병원 방문')}
              ${this._renderHealthCheckItem('recheck1y', '1년 이내 추가검사/재검사')}
              ${this._renderHealthCheckItem('surgery5y', '5년 이내 입원/수술/중대질환')}
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
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">총 월 납입 보험료</label>
                <div style="position:relative;">
                  <input type="number" class="form-input" id="c-total-premium" value="${this._formData.totalPremium}" oninput="ConsultationPage.autoSave()" placeholder="0" style="border-radius:10px;padding-right:30px;">
                  <span style="position:absolute;right:12px;top:50%;transform:translateY(-50%);color:var(--gray-400);font-size:13px;">원</span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">소득/연령 대비 평가</label>
                <div style="display:flex;gap:6px;">
                  ${['적정','과다','부족'].map(v => `
                    <button type="button" class="btn btn-sm" id="eval-btn-${v}"
                      style="flex:1;border-radius:8px;justify-content:center;${this._formData.premiumEval === v ? (v==='적정'?'background:#dcfce7;color:#16a34a;border:1px solid #86efac;':'') + (v==='과다'?'background:#fef2f2;color:#dc2626;border:1px solid #fecaca;':'') + (v==='부족'?'background:#fffbeb;color:#d97706;border:1px solid #fde68a;':'') : 'background:white;color:var(--gray-500);border:1px solid var(--gray-300);'}"
                      onclick="ConsultationPage.setEval('${v}')">${v}</button>
                  `).join('')}
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">전문가 코멘트</label>
              <textarea class="form-input" id="c-expert-comment" rows="3" oninput="ConsultationPage.autoSave()" placeholder="기존 보험에 대한 전문가 분석을 입력하세요..." style="border-radius:10px;">${Utils.escapeHtml(this._formData.expertComment)}</textarea>
            </div>
            <div style="border-top:1px solid var(--gray-100);padding-top:16px;margin-top:8px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <label class="form-label" style="margin-bottom:0;font-size:14px;">기존 보험 증권</label>
                <button class="btn btn-secondary btn-sm" style="border-radius:8px;border:1px dashed var(--gray-300);color:var(--gray-500);" onclick="ConsultationPage.addExistingPolicy()">
                  <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                  증권 추가
                </button>
              </div>
              <div id="existing-policies-list">
                ${this._existingPolicies.map((p, i) => this._renderExistingPolicy(i, p)).join('')}
              </div>
            </div>
          </div>

          <!-- Section 5.5: 보장분석 -->
          <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
            <div class="card-header" style="margin-bottom:16px;">
              <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#dbeafe,#bfdbfe);border-radius:8px;">
                  <svg width="14" height="14" fill="none" stroke="#2563eb" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </span>
                보장분석 <span style="font-size:12px;color:var(--gray-400);font-weight:400;margin-left:4px;">(9개 항목)</span>
              </h3>
            </div>
            <div id="coverage-analysis-container" style="display:flex;flex-direction:column;gap:8px;">
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
  _renderHealthCheckItem(key, label) {
    const checked = this._formData.healthChecks && this._formData.healthChecks[key];
    const detail = this._formData.healthDetails && this._formData.healthDetails[key] || '';
    return `
      <div style="padding:12px 16px;border-radius:10px;border:1px solid ${checked ? '#fecaca' : 'var(--gray-200)'};background:${checked ? '#fef2f2' : 'white'};transition:all 0.2s;">
        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
          <input type="checkbox" ${checked ? 'checked' : ''} onchange="ConsultationPage.toggleHealthCheck('${key}')" style="accent-color:#ef4444;width:16px;height:16px;">
          <span style="font-size:14px;font-weight:500;color:${checked ? '#dc2626' : 'var(--gray-700)'};">${label}</span>
        </label>
        ${checked ? `
          <textarea class="form-input" id="health-detail-${key}" rows="2" oninput="ConsultationPage.autoSave()" placeholder="상세 내용을 입력하세요..."
            style="margin-top:10px;border-radius:8px;font-size:13px;background:white;border-color:#fecaca;">${Utils.escapeHtml(detail)}</textarea>
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
      <div style="border:1px solid ${isOpen ? cat.border : 'var(--gray-200)'};border-radius:12px;overflow:hidden;transition:all 0.2s;${isOpen ? 'box-shadow:0 2px 8px rgba(0,0,0,0.06);' : ''}">
        <div onclick="ConsultationPage.toggleCoverageSection('${cat.key}')"
          style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;cursor:pointer;background:${isOpen ? cat.bg : 'white'};transition:all 0.2s;">
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
      return `
        <div style="display:flex;align-items:center;gap:8px;">
          <label style="font-size:12px;color:var(--gray-600);font-weight:500;min-width:120px;flex-shrink:0;">${field.label}</label>
          <div style="position:relative;flex:1;">
            <input type="number" class="form-input" id="${inputId}" value="${value}" oninput="ConsultationPage.updateCoverageField('${catKey}','${field.key}',this.value)" placeholder="0" style="border-radius:8px;font-size:13px;padding-right:${field.unit === '억원' ? '40px' : '36px'};">
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
          <input type="date" class="form-input" id="${inputId}" value="${value}" oninput="ConsultationPage.updateCoverageField('${catKey}','${field.key}',this.value)" style="border-radius:8px;font-size:13px;flex:1;">
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

  // ==================== Existing Policy Renderer ====================
  _renderExistingPolicy(index, policy) {
    return `
      <div style="background:var(--gray-50);border:1px solid var(--gray-200);border-radius:12px;padding:16px;margin-bottom:10px;position:relative;" data-policy-index="${index}">
        <button class="btn btn-sm" style="position:absolute;top:8px;right:8px;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;border-radius:6px;padding:2px 6px;" onclick="ConsultationPage.removeExistingPolicy(${index})">
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
        <div class="form-group" style="margin-bottom:8px;">
          <label class="form-label" style="font-size:12px;">월보험료</label>
          <input type="number" class="form-input" value="${policy.premium || ''}" oninput="ConsultationPage.updateExistingPolicy(${index},'premium',this.value)" placeholder="0" style="border-radius:8px;font-size:13px;">
        </div>
        <div class="form-group" style="margin-bottom:8px;">
          <label class="form-label" style="font-size:12px;">보장내용</label>
          <textarea class="form-input" rows="2" oninput="ConsultationPage.updateExistingPolicy(${index},'coverage',this.value)" placeholder="보장내용" style="border-radius:8px;font-size:13px;min-height:50px;">${Utils.escapeHtml(policy.coverage || '')}</textarea>
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label" style="font-size:12px;">전문가 의견</label>
          <textarea class="form-input" rows="2" oninput="ConsultationPage.updateExistingPolicy(${index},'opinion',this.value)" placeholder="이 보험에 대한 의견" style="border-radius:8px;font-size:13px;min-height:50px;">${Utils.escapeHtml(policy.opinion || '')}</textarea>
        </div>
      </div>
    `;
  },

  // ==================== Recommended Plan Renderer ====================
  _renderRecommendedPlan(index, plan) {
    return `
      <div style="background:linear-gradient(135deg,#fffbeb,#fef3c7);border:1px solid #fde68a;border-radius:12px;padding:16px;margin-bottom:10px;position:relative;" data-plan-index="${index}">
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
        <div class="form-group" style="margin-bottom:8px;">
          <label class="form-label" style="font-size:12px;">월보험료</label>
          <input type="number" class="form-input" value="${plan.premium || ''}" oninput="ConsultationPage.updateRecommendedPlan(${index},'premium',this.value)" placeholder="0" style="border-radius:8px;font-size:13px;background:white;">
        </div>
        <div class="form-group" style="margin-bottom:8px;">
          <label class="form-label" style="font-size:12px;">보장내용</label>
          <textarea class="form-input" rows="2" oninput="ConsultationPage.updateRecommendedPlan(${index},'coverage',this.value)" placeholder="보장내용" style="border-radius:8px;font-size:13px;min-height:50px;background:white;">${Utils.escapeHtml(plan.coverage || '')}</textarea>
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label" style="font-size:12px;">추천 포인트</label>
          <textarea class="form-input" rows="2" oninput="ConsultationPage.updateRecommendedPlan(${index},'highlight',this.value)" placeholder="이 상품을 추천하는 핵심 이유" style="border-radius:8px;font-size:13px;min-height:50px;background:white;">${Utils.escapeHtml(plan.highlight || '')}</textarea>
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
    if (fd.healthChecks?.hospital3m) healthItems.push({ label: '병원 방문 (3개월)', detail: fd.healthDetails?.hospital3m });
    if (fd.healthChecks?.recheck1y) healthItems.push({ label: '추가검사 (1년)', detail: fd.healthDetails?.recheck1y });
    if (fd.healthChecks?.surgery5y) healthItems.push({ label: '입원/수술 (5년)', detail: fd.healthDetails?.surgery5y });

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
        <div style="height:700px;overflow-y:auto;background:#f8fafc;">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#0f172a,#312e81);padding:48px 20px 24px;text-align:center;">
            <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#818cf8);margin:0 auto 12px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(99,102,241,0.4);">
              <span style="font-size:24px;font-weight:700;color:white;">${Utils.escapeHtml(agentName[0] || 'P')}</span>
            </div>
            <div style="display:inline-block;padding:3px 12px;border-radius:20px;background:rgba(99,102,241,0.3);border:1px solid rgba(129,140,248,0.4);margin-bottom:8px;">
              <span style="font-size:10px;font-weight:700;color:#a5b4fc;letter-spacing:1.5px;">EXPERT</span>
            </div>
            <div style="color:white;font-size:17px;font-weight:700;">${Utils.escapeHtml(agentName)}</div>
            <div style="color:#a5b4fc;font-size:12px;margin-top:2px;">${Utils.escapeHtml(agentPosition)} | PRIME ASSET</div>
          </div>

          <!-- Content -->
          <div style="padding:20px 16px;">
            <!-- Customer Info Card -->
            <div style="background:white;border-radius:14px;padding:16px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:#4338ca;">${Utils.escapeHtml(customerName[0] || 'C')}</div>
                <div>
                  <div style="font-size:15px;font-weight:700;color:#1e293b;">${Utils.escapeHtml(customerName)}님</div>
                  <div style="font-size:11px;color:#94a3b8;">${infoItems.join(' / ') || '고객 정보'}</div>
                </div>
              </div>
              ${tagLabels.length > 0 ? `
                <div style="display:flex;flex-wrap:wrap;gap:6px;">
                  ${tagLabels.map(t => `<span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500;color:${t.color};background:${t.bg};">${t.label}</span>`).join('')}
                </div>
              ` : ''}
              ${fd.address ? `<div style="font-size:11px;color:#94a3b8;margin-top:8px;">📍 ${Utils.escapeHtml(fd.address)}</div>` : ''}
            </div>

            <!-- Health Check -->
            ${healthItems.length > 0 ? `
              <div style="background:white;border-radius:14px;padding:16px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
                <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
                  <span style="color:#ef4444;">&#9829;</span> 건강 체크
                </div>
                ${healthItems.map(h => `
                  <div style="padding:8px 0;border-bottom:1px solid #f1f5f9;">
                    <div style="font-size:12px;font-weight:600;color:#dc2626;">${Utils.escapeHtml(h.label)}</div>
                    ${h.detail ? `<div style="font-size:11px;color:#64748b;margin-top:3px;">${Utils.escapeHtml(h.detail)}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Current Insurance Analysis -->
            ${(fd.totalPremium || fd.expertComment || this._existingPolicies.length > 0) ? `
              <div style="background:white;border-radius:14px;padding:16px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
                <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
                  <span style="color:#16a34a;">&#9679;</span> 기존 보험 분석
                </div>
                ${fd.totalPremium ? `
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:#f0fdf4;border-radius:10px;margin-bottom:10px;">
                    <span style="font-size:12px;color:#64748b;">총 월 납입</span>
                    <span style="font-size:16px;font-weight:700;color:#16a34a;">${Number(fd.totalPremium).toLocaleString()}원</span>
                  </div>
                ` : ''}
                ${fd.premiumEval ? `
                  <div style="text-align:center;margin-bottom:10px;">
                    <span style="display:inline-block;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:600;${fd.premiumEval === '적정' ? 'background:#dcfce7;color:#16a34a;' : fd.premiumEval === '과다' ? 'background:#fef2f2;color:#dc2626;' : 'background:#fffbeb;color:#d97706;'}">${fd.premiumEval}</span>
                  </div>
                ` : ''}
                ${fd.expertComment ? `<div style="font-size:12px;color:#475569;line-height:1.6;padding:10px;background:#f8fafc;border-radius:8px;margin-bottom:10px;">${Utils.escapeHtml(fd.expertComment)}</div>` : ''}
                ${this._existingPolicies.filter(p => p.company || p.productName).map(p => `
                  <div style="border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin-bottom:8px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <div>
                        <div style="font-size:12px;font-weight:600;color:#1e293b;">${Utils.escapeHtml(p.company || '')}</div>
                        <div style="font-size:11px;color:#94a3b8;">${Utils.escapeHtml(p.productName || '')}</div>
                      </div>
                      ${p.premium ? `<div style="font-size:13px;font-weight:700;color:#1e293b;">${Number(p.premium).toLocaleString()}원</div>` : ''}
                    </div>
                    ${p.coverage ? `<div style="font-size:11px;color:#64748b;margin-top:6px;padding-top:6px;border-top:1px solid #f1f5f9;">${Utils.escapeHtml(p.coverage)}</div>` : ''}
                    ${p.opinion ? `<div style="font-size:11px;color:#6366f1;margin-top:4px;font-style:italic;">"${Utils.escapeHtml(p.opinion)}"</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Coverage Analysis -->
            ${this._renderMobilePreviewCoverage(fd)}

            <!-- Expert Recommendation -->
            ${(fd.urgentItem || fd.proposalReason || this._recommendedPlans.length > 0) ? `
              <div style="background:white;border-radius:14px;padding:16px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,0.06);border:1px solid #fde68a;">
                <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
                  <span style="color:#d97706;">&#9733;</span> 전문가 추천
                </div>
                ${fd.urgentItem ? `
                  <div style="padding:10px 14px;background:#fef2f2;border-radius:10px;margin-bottom:10px;border-left:3px solid #ef4444;">
                    <div style="font-size:10px;font-weight:700;color:#dc2626;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">시급 보완 필요</div>
                    <div style="font-size:12px;color:#1e293b;font-weight:500;">${Utils.escapeHtml(fd.urgentItem)}</div>
                  </div>
                ` : ''}
                ${fd.proposalReason ? `<div style="font-size:12px;color:#475569;line-height:1.6;padding:10px;background:#fffbeb;border-radius:8px;margin-bottom:10px;">${Utils.escapeHtml(fd.proposalReason)}</div>` : ''}
                ${this._recommendedPlans.filter(p => p.company || p.productName).map(p => `
                  <div style="border:1px solid #fde68a;border-radius:10px;padding:12px;margin-bottom:8px;background:linear-gradient(135deg,#fffbeb,#fef9c3);">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <div>
                        <div style="font-size:12px;font-weight:600;color:#1e293b;">${Utils.escapeHtml(p.company || '')}</div>
                        <div style="font-size:11px;color:#92400e;">${Utils.escapeHtml(p.productName || '')}</div>
                      </div>
                      ${p.premium ? `<div style="font-size:13px;font-weight:700;color:#d97706;">${Number(p.premium).toLocaleString()}원<span style="font-size:10px;color:#94a3b8;">/월</span></div>` : ''}
                    </div>
                    ${p.coverage ? `<div style="font-size:11px;color:#64748b;margin-top:6px;padding-top:6px;border-top:1px solid #fde68a;">${Utils.escapeHtml(p.coverage)}</div>` : ''}
                    ${p.highlight ? `<div style="font-size:11px;color:#059669;margin-top:6px;padding:6px 10px;background:#ecfdf5;border-radius:6px;">&#10003; ${Utils.escapeHtml(p.highlight)}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Reference Links -->
            ${(fd.showLinks && this._referenceLinks.filter(l => l.title || l.url).length > 0) ? `
              <div style="background:white;border-radius:14px;padding:16px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
                <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:10px;">&#128279; 참고 자료</div>
                ${this._referenceLinks.filter(l => l.title || l.url).map(l => `
                  <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #f1f5f9;">
                    <span style="color:#6366f1;">&#8599;</span>
                    <div>
                      <div style="font-size:12px;font-weight:500;color:#4338ca;">${Utils.escapeHtml(l.title || l.url || '')}</div>
                      ${l.url && l.title ? `<div style="font-size:10px;color:#94a3b8;word-break:break-all;">${Utils.escapeHtml(l.url)}</div>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- CTA Buttons -->
            <div style="display:flex;flex-direction:column;gap:10px;margin-top:20px;">
              <button style="width:100%;padding:14px;border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;background:linear-gradient(135deg,#facc15,#eab308);color:#1e293b;box-shadow:0 2px 8px rgba(234,179,8,0.3);">
                &#128172; 카카오톡 상담
              </button>
              <button style="width:100%;padding:14px;border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;background:linear-gradient(135deg,#6366f1,#4f46e5);color:white;box-shadow:0 2px 8px rgba(99,102,241,0.3);">
                &#128222; 전화 상담
              </button>
            </div>

            <!-- Footer -->
            <div style="text-align:center;padding:20px 0 8px;font-size:10px;color:#94a3b8;">
              PRIME ASSET | ${Utils.escapeHtml(agentName)}<br>
              ${new Date().toLocaleDateString('ko-KR')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ==================== Coverage Analysis Mobile Preview ====================
  _renderMobilePreviewCoverage(fd) {
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
      <div style="background:white;border-radius:14px;padding:16px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
        <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:12px;display:flex;align-items:center;gap:6px;">
          <span style="color:#2563eb;">&#128737;</span> 보장분석 현황
        </div>
    `;

    filledCats.forEach(cat => {
      const data = ca[cat.key];
      const filledFields = cat.fields.filter(f => data[f.key] !== undefined && data[f.key] !== '' && data[f.key] !== null);

      html += `
        <div style="border:1px solid ${cat.border};border-radius:10px;padding:10px 12px;margin-bottom:8px;background:${cat.bg};">
          <div style="font-size:12px;font-weight:700;color:${cat.color};margin-bottom:6px;display:flex;align-items:center;gap:6px;">
            <span style="font-size:14px;">${cat.icon}</span> ${cat.title}
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:4px 12px;">
            ${filledFields.map(f => {
              const v = data[f.key];
              const unit = f.unit || '';
              const display = f.type === 'amount' ? Number(v).toLocaleString() + unit : Utils.escapeHtml(v);
              return `<div style="font-size:10px;color:#475569;"><span style="color:#94a3b8;">${f.label}:</span> <strong>${display}</strong></div>`;
            }).join('')}
          </div>
        </div>
      `;
    });

    html += '</div>';
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

  toggleHealthCheck(key) {
    if (!this._formData.healthChecks) this._formData.healthChecks = {};
    // Collect any existing health detail text before toggling
    ['checkup', 'hospital3m', 'recheck1y', 'surgery5y'].forEach(k => {
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
      container.innerHTML =
        this._renderHealthCheckItem('checkup', '최근 건강검진 내역') +
        this._renderHealthCheckItem('hospital3m', '3개월 이내 병원 방문') +
        this._renderHealthCheckItem('recheck1y', '1년 이내 추가검사/재검사') +
        this._renderHealthCheckItem('surgery5y', '5년 이내 입원/수술/중대질환');
    }
    this.autoSave();
    this._refreshPreview();
  },

  setEval(value) {
    this._formData.premiumEval = value;
    // Update button styles
    ['적정','과다','부족'].forEach(v => {
      const btn = document.getElementById('eval-btn-' + v);
      if (btn) {
        if (v === value) {
          if (v === '적정') btn.style.cssText = 'flex:1;border-radius:8px;justify-content:center;background:#dcfce7;color:#16a34a;border:1px solid #86efac;';
          else if (v === '과다') btn.style.cssText = 'flex:1;border-radius:8px;justify-content:center;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;';
          else btn.style.cssText = 'flex:1;border-radius:8px;justify-content:center;background:#fffbeb;color:#d97706;border:1px solid #fde68a;';
        } else {
          btn.style.cssText = 'flex:1;border-radius:8px;justify-content:center;background:white;color:var(--gray-500);border:1px solid var(--gray-300);';
        }
      }
    });
    this.autoSave();
  },

  addExistingPolicy() {
    this._existingPolicies.push({ company: '', productName: '', premium: '', coverage: '', opinion: '' });
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
      wrapper.innerHTML = this._renderMobilePreview();
    }
  },

  _refreshEditor() {
    // No-op: avoid full page reload which loses unsaved state
  },

  // ==================== Collect Form Data ====================
  _collectFormData() {
    const titleEl = document.getElementById('c-title');
    const birthdateEl = document.getElementById('c-birthdate');
    const genderEl = document.getElementById('c-gender');
    const jobEl = document.getElementById('c-job');
    const addressEl = document.getElementById('c-address');
    const totalPremiumEl = document.getElementById('c-total-premium');
    const expertCommentEl = document.getElementById('c-expert-comment');
    const urgentEl = document.getElementById('c-urgent');
    const proposalReasonEl = document.getElementById('c-proposal-reason');

    // Collect health details from textareas
    const healthDetails = { ...this._formData.healthDetails };
    ['checkup', 'hospital3m', 'recheck1y', 'surgery5y'].forEach(key => {
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
      totalPremium: totalPremiumEl ? totalPremiumEl.value : this._formData.totalPremium,
      expertComment: expertCommentEl ? expertCommentEl.value : this._formData.expertComment,
      urgentItem: urgentEl ? urgentEl.value : this._formData.urgentItem,
      proposalReason: proposalReasonEl ? proposalReasonEl.value : this._formData.proposalReason,
      healthDetails,
      referenceLinks: this._referenceLinks,
      existingPolicies: this._existingPolicies,
      recommendedPlans: this._recommendedPlans,
      coverageAnalysis: this._formData.coverageAnalysis || {}
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
          title: document.getElementById('c-title')?.value || this.currentConsultation.title,
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

  showNewConsultation(customerId) {
    Modal.show('새 상담', `
      <form id="new-consultation-form">
        <div class="form-group">
          <label class="form-label">고객 선택 *</label>
          <select class="form-input" name="customer_id" required style="border-radius:10px;">
            <option value="">고객을 선택하세요</option>
            ${this.customers.map(c => `
              <option value="${c.id}" ${customerId == c.id ? 'selected' : ''}>${c.name} (${Utils.formatPhone(c.phone)})</option>
            `).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">제목</label>
          <input type="text" class="form-input" name="title" placeholder="상담 제목" style="border-radius:10px;">
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()" style="border-radius:8px;">취소</button>
      <button class="btn btn-primary" onclick="ConsultationPage.createConsultation()" style="border-radius:8px;background:linear-gradient(135deg,#3b82f6,#6366f1);border:none;">생성</button>
    `);
  },

  async createConsultation() {
    const form = document.getElementById('new-consultation-form');
    const formData = new FormData(form);
    const customerId = formData.get('customer_id');
    const title = formData.get('title');

    if (!customerId) {
      showToast('고객을 선택하세요.', 'error');
      return;
    }

    try {
      const { consultation } = await API.createConsultation({
        customer_id: parseInt(customerId),
        title: title || '새 상담'
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
