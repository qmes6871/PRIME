// Alimtalk Page - Premium 상담진행 알림톡 System
const AlimtalkPage = {
  templates: [],
  customers: [],
  currentStep: 0,
  currentTemplate: null,

  // 4 steps with rich metadata
  _steps: [
    { key: 'intro',    type: '인사', title: '자기소개 및 인사',        icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z', emoji: '👋', color: '#6366f1', bg: '#e0e7ff', border: '#c7d2fe', desc: '첫인상을 결정하는 전문가 인사' },
    { key: 'schedule', type: '일정', title: '상담 진행일정 안내',      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', emoji: '📅', color: '#059669', bg: '#d1fae5', border: '#a7f3d0', desc: '상담 방식·일시·장소 확정 안내' },
    { key: 'info',     type: '자료', title: '보험 자료 안내',          icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', emoji: '📚', color: '#d97706', bg: '#fef3c7', border: '#fde68a', desc: '맞춤형 보험 정보 사전 안내' },
    { key: 'finish',   type: '종료', title: '상담종료 인사와 소개',    icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7', emoji: '🎁', color: '#db2777', bg: '#fce7f3', border: '#fbcfe8', desc: '감사 인사 및 소개 요청' }
  ],

  // Dynamic form config per step
  _stepFields: {
    schedule: {
      sections: [
        { title: '상담 방식', fields: [
          { key: 'consultMethod', label: '상담 방법', type: 'iconSelect', options: [
            { value: '대면상담', label: '대면상담', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', emoji: '🤝' },
            { value: '전화상담', label: '전화상담', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', emoji: '📞' },
            { value: '카톡상담', label: '카톡상담', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', emoji: '💬' }
          ]}
        ]},
        { title: '일정 정보', fields: [
          { key: 'consultDate', label: '상담 예정일', type: 'date' },
          { key: 'consultTime', label: '상담 예정시간', type: 'time' }
        ]},
        { title: '장소 정보', condition: 'consultMethod=대면상담', fields: [
          { key: 'meetRegion', label: '지역', type: 'select', options: ['서울','경기','인천','강원','충청','전라','경상','제주'] },
          { key: 'meetDetail', label: '세부장소', type: 'text', placeholder: '예: 강남역 1번출구 스타벅스' }
        ]}
      ]
    },
    info: {
      sections: [
        { title: '자료 유형', fields: [
          { key: 'infoType', label: '보험 종류', type: 'iconSelect', options: [
            { value: '기본구성안내', label: '기본구성', emoji: '📋' },
            { value: '종합보험안내', label: '종합보험', emoji: '🛡️' },
            { value: '암보험안내', label: '암보험', emoji: '🎗️' },
            { value: '운전자보험안내', label: '운전자보험', emoji: '🚗' },
            { value: '연금보험안내', label: '연금보험', emoji: '💰' }
          ]}
        ]}
      ]
    }
  },

  // Dynamic field values
  _fieldValues: {},

  async render() {
    try {
      const [templatesData, customersData] = await Promise.all([
        API.getTemplates({ category: '알림톡' }),
        API.getCustomers({ limit: 200 })
      ]);
      this.templates = templatesData.templates;
      this.customers = customersData.customers;

      return `
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:start;">
          <div>
            <h1 class="page-title" style="display:flex;align-items:center;gap:10px;">
              <span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:linear-gradient(135deg,#facc15,#eab308);border-radius:10px;">
                <svg width="18" height="18" fill="none" stroke="#1e293b" stroke-width="2" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              </span>
              상담진행 알림톡
            </h1>
            <p class="page-subtitle">고객의 마음을 여는 첫걸음, 단계별 맞춤 메시지로 시작하세요</p>
          </div>
          <button class="btn btn-secondary" style="border-radius:10px;display:flex;align-items:center;gap:6px;padding:8px 16px;border:1px solid var(--gray-200);" onclick="AlimtalkPage.showLogs()">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            발송 이력
          </button>
        </div>

        <!-- Step Selection: Visual Progress Cards -->
        <div style="display:flex;gap:12px;margin-bottom:28px;position:relative;" id="alim-step-cards">
          ${this._steps.map((step, i) => this._renderStepCard(step, i)).join('')}
        </div>

        <!-- Main Content: Form + Preview -->
        <div class="consultation-layout" style="grid-template-columns:1fr 420px;gap:28px;">
          <!-- LEFT: Form Area -->
          <div style="display:flex;flex-direction:column;gap:0;" id="alim-form-area">
            ${this._renderFormArea()}
          </div>

          <!-- RIGHT: KakaoTalk Preview -->
          <div style="position:sticky;top:24px;align-self:start;">
            <div id="alim-preview-wrapper">
              ${this._renderKakaoPreview()}
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
    this._loadTemplate();
  },

  // ==================== Step Card Renderer ====================
  _renderStepCard(step, index) {
    const isCurrent = index === this.currentStep;
    const isPast = index < this.currentStep;
    return `
      <div onclick="AlimtalkPage.goToStep(${index})" id="alim-step-${index}"
        style="flex:1;padding:16px;border-radius:16px;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden;
          border:2px solid ${isCurrent ? step.color : isPast ? step.color + '60' : 'transparent'};
          background:${isCurrent ? step.bg : isPast ? step.bg + '80' : 'white'};
          box-shadow:${isCurrent ? `0 4px 20px ${step.color}20` : '0 1px 3px rgba(0,0,0,0.06)'};
          transform:${isCurrent ? 'translateY(-2px)' : 'none'};">
        ${isPast ? `<div style="position:absolute;top:8px;right:8px;width:20px;height:20px;border-radius:50%;background:${step.color};display:flex;align-items:center;justify-content:center;"><svg width="10" height="10" fill="none" stroke="white" stroke-width="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></div>` : ''}
        <!-- Step number connector -->
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
          <div style="width:28px;height:28px;border-radius:50%;background:${isCurrent || isPast ? step.color : 'var(--gray-200)'};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:white;">
            ${index + 1}
          </div>
          <span style="font-size:20px;">${step.emoji}</span>
        </div>
        <div style="font-size:14px;font-weight:700;color:${isCurrent ? step.color : isPast ? step.color : 'var(--gray-700)'};">${step.title}</div>
        <div style="font-size:11px;color:${isCurrent ? step.color + 'bb' : 'var(--gray-400)'};margin-top:4px;">${step.desc}</div>
      </div>
      ${index < this._steps.length - 1 ? `
        <div style="display:flex;align-items:center;flex-shrink:0;margin:0 -6px;">
          <svg width="16" height="16" fill="none" stroke="${isPast ? step.color : '#cbd5e1'}" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
        </div>
      ` : ''}
    `;
  },

  // ==================== Form Area ====================
  _renderFormArea() {
    const step = this._steps[this.currentStep];
    const template = this.currentTemplate;
    const meta = this._stepFields[step.key];

    return `
      <!-- Step Info Header -->
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;border-left:4px solid ${step.color};">
        <div style="display:flex;justify-content:space-between;align-items:start;">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
              <span style="font-size:24px;">${step.emoji}</span>
              <div>
                <div style="font-size:11px;font-weight:700;color:${step.color};text-transform:uppercase;letter-spacing:1px;">STEP ${this.currentStep + 1}</div>
                <h3 style="font-size:18px;font-weight:700;color:var(--gray-800);">${step.title}</h3>
              </div>
            </div>
            <p style="font-size:13px;color:var(--gray-400);margin-top:4px;">${step.desc}</p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="AlimtalkPage.editCurrentTemplate()" style="border-radius:8px;border:1px solid var(--gray-200);color:var(--gray-500);display:flex;align-items:center;gap:4px;">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            템플릿 수정
          </button>
        </div>
      </div>

      <!-- Customer Selection -->
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
        <div class="card-header" style="margin-bottom:16px;">
          <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#dbeafe,#c7d2fe);border-radius:8px;">
              <svg width="14" height="14" fill="none" stroke="#4338ca" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </span>
            수신 고객
          </h3>
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <select class="form-input" id="alim-customer" onchange="AlimtalkPage.updatePreview()" style="border-radius:10px;">
            <option value="">고객을 선택하세요</option>
            ${this.customers.map(c => `
              <option value="${c.id}" data-name="${Utils.escapeHtml(c.name)}" data-phone="${c.phone || ''}">${c.name} (${Utils.formatPhone(c.phone)})</option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- Dynamic Fields for this Step -->
      ${meta ? this._renderDynamicSections(meta, step) : ''}

      <!-- Extra Template Variables -->
      <div id="alim-extra-fields-wrapper"></div>

      <!-- Message Content -->
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
        <div class="card-header" style="margin-bottom:16px;">
          <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:8px;">
              <svg width="14" height="14" fill="none" stroke="#d97706" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </span>
            메시지 내용
          </h3>
          <span id="alim-char-count" style="font-size:11px;color:var(--gray-400);">0자</span>
        </div>
        <textarea class="form-input" id="alim-content" rows="12" oninput="AlimtalkPage.onContentInput()" style="border-radius:10px;font-size:13px;line-height:1.9;font-family:'Pretendard Variable',sans-serif;"></textarea>
        ${template ? `
          <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:4px;">
            ${(template.variables || []).map(v => `<span style="display:inline-block;padding:2px 8px;border-radius:4px;background:${step.color}10;color:${step.color};font-size:10px;font-weight:500;">{{${Utils.escapeHtml(v)}}}</span>`).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Action Buttons -->
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;background:linear-gradient(135deg,#f8fafc,#f1f5f9);">
        <div style="display:flex;gap:10px;margin-bottom:${this.currentStep < this._steps.length - 1 ? '12px' : '0'};">
          <button class="btn" onclick="AlimtalkPage.copyMessage()" id="alim-copy-btn"
            style="flex:1;padding:14px;border-radius:12px;font-size:14px;font-weight:600;background:white;color:var(--gray-700);border:1.5px solid var(--gray-200);display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
            클립보드 복사
          </button>
          <button class="btn" onclick="AlimtalkPage.sendAlimtalk()" id="alim-send-btn"
            style="flex:1;padding:14px;border-radius:12px;font-size:14px;font-weight:600;background:linear-gradient(135deg,#facc15,#eab308);color:#1e293b;border:none;box-shadow:0 4px 14px rgba(234,179,8,0.3);display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            카카오톡 발송
          </button>
        </div>
        ${this.currentStep < this._steps.length - 1 ? `
          <button class="btn" onclick="AlimtalkPage.goToStep(${this.currentStep + 1})"
            style="width:100%;padding:12px;border-radius:10px;font-size:13px;font-weight:600;background:${step.color}10;color:${step.color};border:1.5px solid ${step.color}30;display:flex;align-items:center;justify-content:center;gap:6px;transition:all 0.2s;">
            다음 단계: ${this._steps[this.currentStep + 1].emoji} ${this._steps[this.currentStep + 1].title}
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
          </button>
        ` : ''}
      </div>
    `;
  },

  // ==================== Dynamic Section Renderer ====================
  _renderDynamicSections(meta, step) {
    return meta.sections.map(section => {
      // Check condition
      if (section.condition) {
        const [fieldKey, expectedVal] = section.condition.split('=');
        if (this._fieldValues[fieldKey] !== expectedVal) return '';
      }

      return `
        <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
          <div class="card-header" style="margin-bottom:16px;">
            <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
              <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:${step.bg};border-radius:8px;">
                <svg width="14" height="14" fill="none" stroke="${step.color}" stroke-width="2" viewBox="0 0 24 24"><path d="${step.icon}"/></svg>
              </span>
              ${section.title}
            </h3>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${section.fields.map(f => this._renderDynamicField(f, step)).join('')}
          </div>
        </div>
      `;
    }).join('');
  },

  _renderDynamicField(field, step) {
    const val = this._fieldValues[field.key] || '';

    if (field.type === 'iconSelect') {
      return `
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label" style="font-size:12px;margin-bottom:8px;">${field.label}</label>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${field.options.map(opt => {
              const isSelected = val === opt.value;
              return `
                <div onclick="AlimtalkPage.setFieldValue('${field.key}','${opt.value}')"
                  style="flex:1;min-width:80px;padding:12px 8px;border-radius:12px;cursor:pointer;text-align:center;transition:all 0.2s;
                    border:2px solid ${isSelected ? step.color : 'var(--gray-200)'};
                    background:${isSelected ? step.bg : 'white'};
                    box-shadow:${isSelected ? `0 2px 8px ${step.color}20` : 'none'};">
                  <div style="font-size:20px;margin-bottom:4px;">${opt.emoji}</div>
                  <div style="font-size:12px;font-weight:${isSelected ? '700' : '500'};color:${isSelected ? step.color : 'var(--gray-600)'};">${opt.label}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else if (field.type === 'select') {
      return `
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label" style="font-size:12px;">${field.label}</label>
          <select class="form-input" id="alim-field-${field.key}" onchange="AlimtalkPage.setFieldValue('${field.key}',this.value)" style="border-radius:10px;">
            <option value="">선택</option>
            ${field.options.map(o => `<option value="${o}" ${val === o ? 'selected' : ''}>${o}</option>`).join('')}
          </select>
        </div>
      `;
    } else if (field.type === 'date') {
      return `
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label" style="font-size:12px;">${field.label}</label>
          <input type="date" class="form-input" id="alim-field-${field.key}" value="${val}" oninput="AlimtalkPage.setFieldValue('${field.key}',this.value)" style="border-radius:10px;">
        </div>
      `;
    } else if (field.type === 'time') {
      return `
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label" style="font-size:12px;">${field.label}</label>
          <input type="time" class="form-input" id="alim-field-${field.key}" value="${val}" oninput="AlimtalkPage.setFieldValue('${field.key}',this.value)" style="border-radius:10px;">
        </div>
      `;
    } else {
      return `
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label" style="font-size:12px;">${field.label}</label>
          <input type="text" class="form-input" id="alim-field-${field.key}" value="${Utils.escapeHtml(val)}" oninput="AlimtalkPage.setFieldValue('${field.key}',this.value)" placeholder="${field.placeholder || ''}" style="border-radius:10px;">
        </div>
      `;
    }
  },

  // ==================== KakaoTalk-Style Phone Preview ====================
  _renderKakaoPreview() {
    const agent = API.getAgent();
    const agentName = agent?.name || '설계사';
    const step = this._steps[this.currentStep];
    const content = document.getElementById('alim-content')?.value || '';
    const customerEl = document.getElementById('alim-customer');
    const customerName = customerEl?.selectedOptions[0]?.dataset.name || '';

    return `
      <div style="width:375px;margin:0 auto;border:14px solid #1e293b;border-radius:40px;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.25);position:relative;background:#B2C7D9;">
        <!-- Notch -->
        <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:150px;height:28px;background:#1e293b;border-radius:0 0 20px 20px;z-index:10;">
          <div style="width:60px;height:4px;background:#374151;border-radius:2px;margin:16px auto 0;"></div>
        </div>

        <!-- Scrollable Content -->
        <div style="height:700px;overflow-y:auto;background:#B2C7D9;">
          <!-- KakaoTalk Header -->
          <div style="background:#B2C7D9;padding:44px 16px 12px;display:flex;align-items:center;gap:10px;">
            <svg width="20" height="20" fill="none" stroke="#1e293b" stroke-width="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
            <div style="flex:1;text-align:center;">
              <div style="font-size:15px;font-weight:700;color:#1e293b;">${Utils.escapeHtml(customerName || '고객')}</div>
            </div>
            <svg width="20" height="20" fill="none" stroke="#1e293b" stroke-width="2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>

          <!-- Date Divider -->
          <div style="text-align:center;padding:10px 0;">
            <span style="display:inline-block;padding:4px 14px;border-radius:20px;background:rgba(0,0,0,0.1);font-size:11px;color:#4a5568;">
              ${new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </span>
          </div>

          <!-- Chat Area -->
          <div style="padding:8px 16px 20px;">
            ${content ? `
              <!-- Agent Message -->
              <div style="display:flex;gap:8px;margin-bottom:16px;">
                <!-- Profile -->
                <div style="flex-shrink:0;">
                  <div style="width:36px;height:36px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#818cf8);display:flex;align-items:center;justify-content:center;">
                    <span style="font-size:14px;font-weight:700;color:white;">${Utils.escapeHtml(agentName[0] || 'P')}</span>
                  </div>
                </div>
                <div style="flex:1;min-width:0;">
                  <div style="font-size:11px;font-weight:600;color:#4a5568;margin-bottom:4px;">${Utils.escapeHtml(agentName)}</div>
                  <div style="display:flex;align-items:flex-end;gap:4px;">
                    <!-- Message Bubble -->
                    <div style="background:#FFFFFF;border-radius:0 16px 16px 16px;padding:12px 14px;max-width:260px;box-shadow:0 1px 2px rgba(0,0,0,0.06);">
                      ${step.key !== 'finish' ? `
                        <div style="display:inline-block;padding:3px 10px;border-radius:6px;background:${step.color}15;color:${step.color};font-size:10px;font-weight:700;margin-bottom:8px;letter-spacing:0.5px;">
                          ${step.emoji} ${step.title}
                        </div>
                      ` : ''}
                      <div style="font-size:13px;line-height:1.8;color:#1e293b;white-space:pre-wrap;word-break:keep-all;">${Utils.escapeHtml(content)}</div>
                    </div>
                    <!-- Time -->
                    <div style="font-size:10px;color:#8096a7;flex-shrink:0;padding-bottom:2px;">
                      ${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>

              ${customerName ? `
              <!-- Read Receipt -->
              <div style="text-align:right;margin-bottom:16px;">
                <div style="display:inline-flex;align-items:flex-end;gap:4px;">
                  <div style="font-size:10px;color:#8096a7;padding-bottom:2px;">
                    ${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style="background:#FEE500;border-radius:16px 0 16px 16px;padding:10px 14px;max-width:200px;">
                    <div style="font-size:13px;color:#1e293b;">감사합니다! 확인했어요 😊</div>
                  </div>
                </div>
              </div>
              ` : ''}
            ` : `
              <div style="text-align:center;padding:60px 20px;">
                <div style="width:56px;height:56px;border-radius:18px;background:rgba(255,255,255,0.6);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
                  <span style="font-size:28px;">${step.emoji}</span>
                </div>
                <div style="font-size:13px;color:#5a7085;line-height:1.6;">고객을 선택하면<br>카카오톡 미리보기가<br>표시됩니다</div>
              </div>
            `}
          </div>

          <!-- KakaoTalk Input Bar -->
          <div style="position:sticky;bottom:0;background:#F6F6F6;padding:8px 12px;display:flex;align-items:center;gap:8px;border-top:1px solid #e0e0e0;">
            <div style="width:28px;height:28px;border-radius:50%;background:#e0e0e0;display:flex;align-items:center;justify-content:center;">
              <svg width="14" height="14" fill="none" stroke="#999" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
            </div>
            <div style="flex:1;padding:8px 14px;border-radius:20px;background:white;border:1px solid #e0e0e0;font-size:12px;color:#999;">메시지 입력</div>
            <div style="width:28px;height:28px;border-radius:50%;background:#FEE500;display:flex;align-items:center;justify-content:center;">
              <svg width="14" height="14" fill="#1e293b" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ==================== Interactions ====================

  goToStep(step) {
    this.currentStep = step;
    this._fieldValues = {};
    this.currentTemplate = null;
    App.navigate('alimtalk');
  },

  setFieldValue(key, value) {
    this._fieldValues[key] = value;
    // Re-render form area to handle conditional sections
    const formArea = document.getElementById('alim-form-area');
    if (formArea) {
      formArea.innerHTML = this._renderFormArea();
      // Restore content
      this._loadTemplate();
    }
  },

  _loadTemplate() {
    const stepType = this._steps[this.currentStep].type;
    const template = this.templates.find(t => t.type === stepType);
    if (!template) return;

    this.currentTemplate = template;
    const contentEl = document.getElementById('alim-content');
    if (contentEl) {
      contentEl.value = template.content;
    }

    this._renderExtraFields();
    this.updatePreview();
  },

  _renderExtraFields() {
    const container = document.getElementById('alim-extra-fields-wrapper');
    if (!container || !this.currentTemplate) return;

    const vars = this.currentTemplate.variables || [];
    const skipVars = ['고객명', '설계사명', '설계사연락처'];
    const extraVars = vars.filter(v => !skipVars.includes(v));

    // Also skip vars that are covered by dynamic fields
    const dynamicFieldKeys = [];
    const meta = this._stepFields[this._steps[this.currentStep].key];
    if (meta) {
      meta.sections.forEach(s => s.fields.forEach(f => dynamicFieldKeys.push(f.key)));
    }
    const filteredVars = extraVars.filter(v => !dynamicFieldKeys.some(k => v.toLowerCase().includes(k.toLowerCase())));

    if (filteredVars.length === 0) {
      container.innerHTML = '';
      return;
    }

    const step = this._steps[this.currentStep];
    container.innerHTML = `
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
        <div class="card-header" style="margin-bottom:16px;">
          <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#f3f4f6,#e5e7eb);border-radius:8px;">
              <svg width="14" height="14" fill="none" stroke="#6b7280" stroke-width="2" viewBox="0 0 24 24"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
            </span>
            추가 정보
          </h3>
        </div>
        ${filteredVars.map(v => `
          <div class="form-group">
            <label class="form-label" style="font-size:12px;">${Utils.escapeHtml(v)}</label>
            <input type="text" class="form-input" id="alim-var-${v}" placeholder="${Utils.escapeHtml(v)}을(를) 입력하세요" oninput="AlimtalkPage.updatePreview()" style="border-radius:10px;">
          </div>
        `).join('')}
      </div>
    `;
  },

  onContentInput() {
    this._updateCharCount();
    const content = document.getElementById('alim-content')?.value || '';
    const previewWrapper = document.getElementById('alim-preview-wrapper');
    if (previewWrapper) {
      previewWrapper.innerHTML = this._renderKakaoPreview();
    }
  },

  _updateCharCount() {
    const contentEl = document.getElementById('alim-content');
    const countEl = document.getElementById('alim-char-count');
    if (contentEl && countEl) {
      const len = contentEl.value.length;
      const color = len > 1000 ? '#dc2626' : len > 0 ? '#10b981' : '#94a3b8';
      countEl.innerHTML = `<span style="color:${color};font-weight:600;">${len}자</span>`;
    }
  },

  updatePreview() {
    if (!this.currentTemplate) return;

    const agent = API.getAgent();
    const customerEl = document.getElementById('alim-customer');
    const selectedCustomer = customerEl?.selectedOptions[0];

    const vars = {
      '고객명': selectedCustomer?.dataset.name || '(고객명)',
      '설계사명': agent?.name || '(설계사명)',
      '설계사연락처': agent?.phone || '(연락처)'
    };

    (this.currentTemplate.variables || []).forEach(v => {
      if (!vars[v]) {
        const el = document.getElementById(`alim-var-${v}`);
        vars[v] = el?.value || `(${v})`;
      }
    });

    const content = Utils.replaceTemplateVars(this.currentTemplate.content, vars);
    const contentEl = document.getElementById('alim-content');
    if (contentEl) {
      contentEl.value = content;
      this._updateCharCount();
    }

    const previewWrapper = document.getElementById('alim-preview-wrapper');
    if (previewWrapper) {
      previewWrapper.innerHTML = this._renderKakaoPreview();
    }
  },

  async copyMessage() {
    const content = document.getElementById('alim-content').value;
    if (!content) {
      showToast('메시지 내용이 없습니다.', 'error');
      return;
    }

    try {
      await Utils.copyToClipboard(content);

      const btn = document.getElementById('alim-copy-btn');
      if (btn) {
        btn.innerHTML = '<svg width="16" height="16" fill="none" stroke="#10b981" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg> 복사 완료!';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#10b981';
        btn.style.background = '#ecfdf5';
        setTimeout(() => {
          if (btn) {
            btn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg> 클립보드 복사';
            btn.style.borderColor = '';
            btn.style.color = '';
            btn.style.background = '';
          }
        }, 2000);
      }

      showToast('카카오톡에 바로 붙여넣기 하세요!', 'success');

      const customerEl = document.getElementById('alim-customer');
      if (customerEl?.value) {
        await API.sendMessage({
          customer_id: parseInt(customerEl.value),
          template_id: this.currentTemplate?.id,
          type: '클립보드',
          content,
          recipient_name: customerEl.selectedOptions[0]?.dataset.name,
          recipient_phone: customerEl.selectedOptions[0]?.dataset.phone
        });
      }
    } catch (err) {
      showToast('복사에 실패했습니다.', 'error');
    }
  },

  async sendAlimtalk() {
    const content = document.getElementById('alim-content').value;
    const customerEl = document.getElementById('alim-customer');

    if (!content) {
      showToast('메시지 내용이 없습니다.', 'error');
      return;
    }
    if (!customerEl?.value) {
      showToast('고객을 선택해주세요.', 'error');
      return;
    }

    try {
      await API.sendMessage({
        customer_id: parseInt(customerEl.value),
        template_id: this.currentTemplate?.id,
        type: '카카오알림톡',
        content,
        recipient_name: customerEl.selectedOptions[0]?.dataset.name,
        recipient_phone: customerEl.selectedOptions[0]?.dataset.phone
      });

      const btn = document.getElementById('alim-send-btn');
      if (btn) {
        btn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg> 발송 완료!';
        btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
        btn.style.color = 'white';
        setTimeout(() => {
          if (btn) {
            btn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg> 카카오톡 발송';
            btn.style.background = 'linear-gradient(135deg,#facc15,#eab308)';
            btn.style.color = '#1e293b';
          }
        }, 2000);
      }

      showToast('발송 기록이 저장되었습니다!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  editCurrentTemplate() {
    if (!this.currentTemplate) return;
    const t = this.currentTemplate;
    const step = this._steps[this.currentStep];

    Modal.show('템플릿 수정', `
      <form id="edit-alim-template-form">
        <div style="padding:12px 16px;background:${step.color}10;border-radius:10px;border-left:3px solid ${step.color};margin-bottom:16px;">
          <div style="font-size:11px;font-weight:700;color:${step.color};text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">${step.emoji} STEP ${this.currentStep + 1}: ${step.title}</div>
          <div style="font-size:12px;color:var(--gray-500);">
            변수: ${(t.variables || []).map(v => `<code style="padding:1px 6px;background:var(--gray-100);border-radius:3px;font-size:11px;">{{${Utils.escapeHtml(v)}}}</code>`).join(' ')}
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">제목</label>
          <input type="text" class="form-input" name="title" value="${Utils.escapeHtml(t.title)}" style="border-radius:10px;">
        </div>
        <div class="form-group">
          <label class="form-label">내용</label>
          <textarea class="form-input" name="content" rows="14" style="border-radius:10px;font-size:13px;line-height:1.8;">${Utils.escapeHtml(t.content)}</textarea>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()" style="border-radius:8px;">취소</button>
      <button class="btn btn-primary" onclick="AlimtalkPage.saveTemplate()" style="border-radius:8px;background:linear-gradient(135deg,#facc15,#eab308);color:#1e293b;border:none;">저장</button>
    `);
  },

  async saveTemplate() {
    const form = document.getElementById('edit-alim-template-form');
    const formData = new FormData(form);

    try {
      await API.updateTemplate(this.currentTemplate.id, {
        title: formData.get('title'),
        content: formData.get('content')
      });
      Modal.close();
      showToast('템플릿이 저장되었습니다.', 'success');
      App.navigate('alimtalk');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async showLogs() {
    try {
      const data = await API.getMessageLogs({ limit: 20 });
      const logs = data.logs || [];

      const stepMeta = {};
      this._steps.forEach(s => { stepMeta[s.type] = s; });

      let logsHtml = '';
      if (logs.length > 0) {
        logsHtml = `
          <div style="max-height:500px;overflow-y:auto;">
            ${logs.map((l, i) => {
              const sm = stepMeta[l.Template?.type] || { emoji: '📨', color: '#6b7280', title: l.type || '발송' };
              return `
                <div style="display:flex;gap:12px;padding:14px 0;${i < logs.length - 1 ? 'border-bottom:1px solid var(--gray-100);' : ''}">
                  <div style="width:40px;height:40px;border-radius:12px;background:${sm.color}15;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;">
                    ${sm.emoji}
                  </div>
                  <div style="flex:1;min-width:0;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <div style="font-size:14px;font-weight:600;color:var(--gray-800);">${Utils.escapeHtml(l.recipient_name || l.Customer?.name || '-')}</div>
                      <span style="padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;${l.status === '성공' ? 'background:#dcfce7;color:#16a34a;' : l.type === '카카오알림톡' ? 'background:#FEE500;color:#1e293b;' : 'background:var(--gray-100);color:var(--gray-500);'}">${l.type === '카카오알림톡' ? '카카오톡' : l.status || '발송'}</span>
                    </div>
                    <div style="font-size:12px;color:var(--gray-400);margin-top:2px;">
                      ${sm.title} · ${Utils.formatDateTime(l.sent_at || l.created_at)}
                    </div>
                    <div style="font-size:11px;color:var(--gray-500);margin-top:6px;background:var(--gray-50);padding:8px 10px;border-radius:8px;line-height:1.5;max-height:60px;overflow:hidden;">
                      ${Utils.escapeHtml((l.content || '').substring(0, 120))}${(l.content || '').length > 120 ? '...' : ''}
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
            <div style="font-size:36px;margin-bottom:12px;">📭</div>
            <div style="font-size:14px;color:var(--gray-500);font-weight:500;">발송 이력이 없습니다</div>
            <div style="font-size:12px;color:var(--gray-400);margin-top:4px;">알림톡을 발송하면 이력이 기록됩니다</div>
          </div>
        `;
      }

      Modal.show(`
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#FEE500,#eab308);display:flex;align-items:center;justify-content:center;">
            <svg width="14" height="14" fill="none" stroke="#1e293b" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
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
