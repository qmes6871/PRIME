// Messages Page - Premium Customer Message System
const MessagesPage = {
  templates: [],
  customers: [],
  companies: [],
  selectedTemplate: null,
  selectedTemplateIndex: -1,

  // Template type icons & colors
  _templateMeta: {
    '담당자변경': { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: '#6366f1', bg: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)', desc: '새 담당자를 고객에게 안내합니다' },
    '해지': { icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: '#dc2626', bg: 'linear-gradient(135deg,#fee2e2,#fecaca)', desc: '보험 해지 절차를 안내합니다' },
    '실효해지': { icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: '#f59e0b', bg: 'linear-gradient(135deg,#fef3c7,#fde68a)', desc: '실효 상태 및 부활 방법을 안내합니다' },
    '청구서류': { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', color: '#059669', bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', desc: '보험금 청구 시 필요한 서류를 안내합니다' },
    '자동이체해지': { icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', color: '#8b5cf6', bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)', desc: '자동이체 변경/해지 절차를 안내합니다' }
  },

  async render() {
    try {
      const [templatesData, customersData, companiesData] = await Promise.all([
        API.getTemplates({ category: '메시지안내' }),
        API.getCustomers({ limit: 200 }),
        API.getInsuranceCompanies()
      ]);
      this.templates = templatesData.templates;
      this.customers = customersData.customers;
      this.companies = companiesData.companies;

      return `
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:start;">
          <div>
            <h1 class="page-title" style="display:flex;align-items:center;gap:10px;">
              <span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:10px;">
                <svg width="18" height="18" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
              </span>
              고객 메세지 안내
            </h1>
            <p class="page-subtitle">5종 맞춤 템플릿으로 고객에게 전문적인 안내 메시지를 발송하세요</p>
          </div>
          <button class="btn btn-secondary" style="border-radius:10px;display:flex;align-items:center;gap:6px;padding:8px 16px;border:1px solid var(--gray-200);" onclick="MessagesPage.showLogs()">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            발송 이력
          </button>
        </div>

        <!-- Template Selection Cards -->
        <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:4px;margin-bottom:24px;" id="msg-template-cards">
          ${this.templates.map((t, i) => this._renderTemplateCard(t, i)).join('')}
        </div>

        <!-- Main Content: Form + Preview -->
        <div class="consultation-layout" style="grid-template-columns:1fr 420px;gap:28px;">
          <!-- LEFT: Form Area -->
          <div style="display:flex;flex-direction:column;gap:0;" id="msg-form-area">
            ${this._renderFormArea()}
          </div>

          <!-- RIGHT: Phone Preview -->
          <div style="position:sticky;top:24px;align-self:start;">
            <div id="msg-preview-wrapper">
              ${this._renderPhonePreview()}
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
    if (this.templates.length > 0) {
      this.selectTemplate(0);
    }
  },

  // ==================== Template Card Renderer ====================
  _renderTemplateCard(template, index) {
    const meta = this._templateMeta[template.type] || { icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', color: '#6b7280', bg: 'linear-gradient(135deg,#f3f4f6,#e5e7eb)', desc: '' };
    const isSelected = index === this.selectedTemplateIndex;
    return `
      <div onclick="MessagesPage.selectTemplate(${index})" id="msg-tpl-card-${index}"
        style="min-width:160px;padding:16px;border-radius:14px;cursor:pointer;transition:all 0.25s;
          border:2px solid ${isSelected ? meta.color : 'transparent'};
          background:${isSelected ? meta.bg : 'white'};
          box-shadow:${isSelected ? `0 4px 16px ${meta.color}25` : '0 1px 3px rgba(0,0,0,0.06)'};
          transform:${isSelected ? 'translateY(-2px)' : 'none'};">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <div style="width:32px;height:32px;border-radius:10px;background:${meta.bg};display:flex;align-items:center;justify-content:center;">
            <svg width="16" height="16" fill="none" stroke="${meta.color}" stroke-width="2" viewBox="0 0 24 24"><path d="${meta.icon}"/></svg>
          </div>
        </div>
        <div style="font-size:14px;font-weight:700;color:${isSelected ? meta.color : 'var(--gray-800)'};margin-bottom:2px;">${Utils.escapeHtml(template.type)}</div>
        <div style="font-size:11px;color:${isSelected ? meta.color + 'cc' : 'var(--gray-400)'};">${meta.desc}</div>
      </div>
    `;
  },

  // ==================== Form Area Renderer ====================
  _renderFormArea() {
    if (!this.selectedTemplate) {
      return `
        <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;text-align:center;padding:60px 20px;">
          <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
            <svg width="28" height="28" fill="none" stroke="#6366f1" stroke-width="1.5" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
          </div>
          <div style="font-size:16px;font-weight:600;color:var(--gray-600);margin-bottom:4px;">메시지 템플릿을 선택하세요</div>
          <div style="font-size:13px;color:var(--gray-400);">위의 템플릿 카드를 클릭하면 작성 폼이 표시됩니다</div>
        </div>
      `;
    }

    const t = this.selectedTemplate;
    const meta = this._templateMeta[t.type] || { color: '#6b7280', bg: 'linear-gradient(135deg,#f3f4f6,#e5e7eb)' };
    const vars = t.variables || [];
    const skipVars = ['고객명', '설계사명', '설계사연락처', '보험사명', '보험사전화'];
    const extraVars = vars.filter(v => !skipVars.includes(v));

    return `
      <!-- Selected Template Info -->
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;border-left:4px solid ${meta.color};">
        <div style="display:flex;justify-content:space-between;align-items:start;">
          <div>
            <div style="font-size:11px;font-weight:700;color:${meta.color};text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">
              ${Utils.escapeHtml(t.type)} 안내
            </div>
            <h3 style="font-size:18px;font-weight:700;color:var(--gray-800);margin-bottom:4px;">${Utils.escapeHtml(t.title)}</h3>
            <div style="font-size:12px;color:var(--gray-400);">
              사용 변수: ${vars.map(v => `<span style="display:inline-block;padding:2px 8px;border-radius:4px;background:${meta.color}10;color:${meta.color};font-size:11px;font-weight:500;margin:2px 2px;">{{${Utils.escapeHtml(v)}}}</span>`).join(' ')}
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="MessagesPage.editTemplate()" style="border-radius:8px;border:1px solid var(--gray-200);color:var(--gray-500);display:flex;align-items:center;gap:4px;">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            수정
          </button>
        </div>
      </div>

      <!-- Form Inputs -->
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
        <div class="card-header" style="margin-bottom:16px;">
          <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#dbeafe,#c7d2fe);border-radius:8px;">
              <svg width="14" height="14" fill="none" stroke="#4338ca" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </span>
            수신자 정보
          </h3>
        </div>

        <div class="grid-2" style="gap:12px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:12px;display:flex;align-items:center;gap:4px;">
              <svg width="12" height="12" fill="none" stroke="var(--gray-400)" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              고객 선택
            </label>
            <select class="form-input" id="msg-customer" onchange="MessagesPage.updatePreview()" style="border-radius:10px;">
              <option value="">고객을 선택하세요</option>
              ${this.customers.map(c => `
                <option value="${c.id}" data-name="${Utils.escapeHtml(c.name)}" data-phone="${c.phone || ''}">${c.name} (${Utils.formatPhone(c.phone)})</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:12px;display:flex;align-items:center;gap:4px;">
              <svg width="12" height="12" fill="none" stroke="var(--gray-400)" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              보험사 선택
            </label>
            <select class="form-input" id="msg-company" onchange="MessagesPage.updatePreview()" style="border-radius:10px;">
              <option value="">보험사를 선택하세요</option>
              <optgroup label="생명보험">
                ${this.companies.filter(c => c.type === '생명').map(c => `
                  <option value="${c.id}" data-name="${c.name}" data-phone="${c.phone || ''}">${c.name}</option>
                `).join('')}
              </optgroup>
              <optgroup label="손해보험">
                ${this.companies.filter(c => c.type === '손해').map(c => `
                  <option value="${c.id}" data-name="${c.name}" data-phone="${c.phone || ''}">${c.name}</option>
                `).join('')}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      ${extraVars.length > 0 ? `
        <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
          <div class="card-header" style="margin-bottom:16px;">
            <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
              <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:8px;">
                <svg width="14" height="14" fill="none" stroke="#d97706" stroke-width="2" viewBox="0 0 24 24"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
              </span>
              추가 정보
            </h3>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${extraVars.map(v => `
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:12px;">${Utils.escapeHtml(v)}</label>
                <input type="text" class="form-input" id="msg-var-${v}" placeholder="${Utils.escapeHtml(v)}을(를) 입력하세요" oninput="MessagesPage.updatePreview()" style="border-radius:10px;">
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Message Content -->
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;">
        <div class="card-header" style="margin-bottom:16px;">
          <h3 class="card-title" style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:linear-gradient(135deg,#dcfce7,#bbf7d0);border-radius:8px;">
              <svg width="14" height="14" fill="none" stroke="#16a34a" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </span>
            메시지 내용
          </h3>
          <div style="display:flex;align-items:center;gap:6px;">
            <span id="msg-char-count" style="font-size:11px;color:var(--gray-400);">0자</span>
          </div>
        </div>
        <textarea class="form-input" id="msg-content" rows="14" oninput="MessagesPage.onContentInput()" style="border-radius:10px;font-size:13px;line-height:1.8;font-family:'Pretendard Variable',sans-serif;"></textarea>
      </div>

      <!-- Action Buttons -->
      <div class="card" style="border:none;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:14px;background:linear-gradient(135deg,#f8fafc,#f1f5f9);">
        <div style="display:flex;gap:10px;">
          <button class="btn" onclick="MessagesPage.copyMessage()" id="msg-copy-btn"
            style="flex:1;padding:14px;border-radius:12px;font-size:14px;font-weight:600;background:white;color:var(--gray-700);border:1.5px solid var(--gray-200);display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
            클립보드 복사
          </button>
          <button class="btn" onclick="MessagesPage.sendMessage()" id="msg-send-btn"
            style="flex:1;padding:14px;border-radius:12px;font-size:14px;font-weight:600;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;border:none;box-shadow:0 4px 14px rgba(99,102,241,0.3);display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            발송 기록 저장
          </button>
        </div>
      </div>
    `;
  },

  // ==================== Phone Frame Preview ====================
  _renderPhonePreview() {
    const agent = API.getAgent();
    const agentName = agent?.name || '설계사';
    const t = this.selectedTemplate;
    const content = document.getElementById('msg-content')?.value || '';
    const meta = t ? (this._templateMeta[t.type] || { color: '#6b7280' }) : { color: '#6366f1' };

    return `
      <div style="width:375px;margin:0 auto;border:14px solid #1e293b;border-radius:40px;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.25);position:relative;background:#f8fafc;">
        <!-- Notch -->
        <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:150px;height:28px;background:#1e293b;border-radius:0 0 20px 20px;z-index:10;">
          <div style="width:60px;height:4px;background:#374151;border-radius:2px;margin:16px auto 0;"></div>
        </div>

        <!-- Scrollable Content -->
        <div style="height:700px;overflow-y:auto;background:#f8fafc;">
          <!-- Chat Header -->
          <div style="background:linear-gradient(135deg,#0f172a,#312e81);padding:44px 20px 20px;text-align:center;">
            <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#818cf8);margin:0 auto 10px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(99,102,241,0.4);">
              <span style="font-size:18px;font-weight:700;color:white;">${Utils.escapeHtml(agentName[0] || 'P')}</span>
            </div>
            <div style="color:white;font-size:15px;font-weight:700;">${Utils.escapeHtml(agentName)}</div>
            <div style="color:#a5b4fc;font-size:11px;margin-top:2px;">PRIME ASSET</div>
          </div>

          <!-- Message Content -->
          <div style="padding:20px 16px;">
            ${t ? `
              <!-- Template Badge -->
              <div style="text-align:center;margin-bottom:16px;">
                <span style="display:inline-block;padding:4px 14px;border-radius:20px;background:${meta.color}15;color:${meta.color};font-size:11px;font-weight:600;border:1px solid ${meta.color}30;">
                  ${Utils.escapeHtml(t.type)} 안내
                </span>
              </div>
            ` : ''}

            ${content ? `
              <!-- Message Bubble -->
              <div style="background:white;border-radius:16px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,0.06);position:relative;">
                <!-- Bubble tail -->
                <div style="position:absolute;top:-6px;left:24px;width:12px;height:12px;background:white;transform:rotate(45deg);box-shadow:-1px -1px 2px rgba(0,0,0,0.04);"></div>
                <div style="font-size:13px;line-height:1.9;color:#334155;white-space:pre-wrap;word-break:keep-all;">${Utils.escapeHtml(content)}</div>
              </div>

              <!-- Timestamp -->
              <div style="text-align:right;margin-top:6px;font-size:10px;color:#94a3b8;">
                ${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            ` : `
              <div style="text-align:center;padding:40px 20px;">
                <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
                  <svg width="24" height="24" fill="none" stroke="#6366f1" stroke-width="1.5" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                </div>
                <div style="font-size:13px;color:#94a3b8;">템플릿을 선택하고<br>고객 정보를 입력하면<br>미리보기가 표시됩니다</div>
              </div>
            `}

            ${(content && t) ? `
              <!-- Quick Actions in Preview -->
              <div style="display:flex;flex-direction:column;gap:8px;margin-top:20px;">
                <div style="padding:12px 16px;background:white;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04);display:flex;align-items:center;gap:10px;">
                  <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#facc15,#eab308);display:flex;align-items:center;justify-content:center;">
                    <svg width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  </div>
                  <div>
                    <div style="font-size:12px;font-weight:600;color:#1e293b;">카카오톡으로 전송</div>
                    <div style="font-size:10px;color:#94a3b8;">복사된 메시지를 카카오톡으로 보내세요</div>
                  </div>
                </div>
                <div style="padding:12px 16px;background:white;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04);display:flex;align-items:center;gap:10px;">
                  <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#3b82f6,#6366f1);display:flex;align-items:center;justify-content:center;">
                    <svg width="14" height="14" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                  <div>
                    <div style="font-size:12px;font-weight:600;color:#1e293b;">문자 메시지 전송</div>
                    <div style="font-size:10px;color:#94a3b8;">SMS/LMS로 직접 전송하세요</div>
                  </div>
                </div>
              </div>
            ` : ''}

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

  // ==================== Interactions ====================

  selectTemplate(index) {
    this.selectedTemplateIndex = index;
    this.selectedTemplate = this.templates[index];

    // Update template cards
    const cardsContainer = document.getElementById('msg-template-cards');
    if (cardsContainer) {
      cardsContainer.innerHTML = this.templates.map((t, i) => this._renderTemplateCard(t, i)).join('');
    }

    // Re-render form area
    const formArea = document.getElementById('msg-form-area');
    if (formArea) {
      formArea.innerHTML = this._renderFormArea();
    }

    // Set content
    const contentEl = document.getElementById('msg-content');
    if (contentEl && this.selectedTemplate) {
      contentEl.value = this.selectedTemplate.content;
      this._updateCharCount();
    }

    this.updatePreview();
  },

  onContentInput() {
    this._updateCharCount();
    this.updatePreview();
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

  updatePreview() {
    if (!this.selectedTemplate) return;

    const agent = API.getAgent();
    const customerEl = document.getElementById('msg-customer');
    const companyEl = document.getElementById('msg-company');
    const selectedCustomer = customerEl?.selectedOptions[0];
    const selectedCompany = companyEl?.selectedOptions[0];

    const vars = {
      '고객명': selectedCustomer?.dataset.name || '(고객명)',
      '설계사명': agent?.name || '(설계사명)',
      '설계사연락처': agent?.phone || '(연락처)',
      '보험사명': selectedCompany?.dataset.name || '(보험사명)',
      '보험사전화': selectedCompany?.dataset.phone || '(보험사전화)'
    };

    // Extra variables
    (this.selectedTemplate.variables || []).forEach(v => {
      if (!vars[v]) {
        const el = document.getElementById(`msg-var-${v}`);
        vars[v] = el?.value || `(${v})`;
      }
    });

    const content = Utils.replaceTemplateVars(this.selectedTemplate.content, vars);
    const contentEl = document.getElementById('msg-content');
    if (contentEl) {
      contentEl.value = content;
      this._updateCharCount();
    }

    const previewWrapper = document.getElementById('msg-preview-wrapper');
    if (previewWrapper) {
      previewWrapper.innerHTML = this._renderPhonePreview();
    }
  },

  async copyMessage() {
    const content = document.getElementById('msg-content').value;
    if (!content) {
      showToast('메시지 내용이 없습니다.', 'error');
      return;
    }

    try {
      await Utils.copyToClipboard(content);

      // Button animation
      const btn = document.getElementById('msg-copy-btn');
      if (btn) {
        btn.innerHTML = `
          <svg width="16" height="16" fill="none" stroke="#10b981" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
          복사 완료!
        `;
        btn.style.borderColor = '#10b981';
        btn.style.color = '#10b981';
        btn.style.background = '#ecfdf5';
        setTimeout(() => {
          if (btn) {
            btn.innerHTML = `
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
              클립보드 복사
            `;
            btn.style.borderColor = '';
            btn.style.color = '';
            btn.style.background = '';
          }
        }, 2000);
      }

      showToast('메시지가 클립보드에 복사되었습니다!', 'success');

      // Log the copy action
      const customerEl = document.getElementById('msg-customer');
      if (customerEl?.value) {
        await API.sendMessage({
          customer_id: parseInt(customerEl.value),
          template_id: this.selectedTemplate?.id,
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

  async sendMessage() {
    const content = document.getElementById('msg-content').value;
    const customerEl = document.getElementById('msg-customer');

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
        template_id: this.selectedTemplate?.id,
        type: '클립보드',
        content,
        recipient_name: customerEl.selectedOptions[0]?.dataset.name,
        recipient_phone: customerEl.selectedOptions[0]?.dataset.phone
      });

      // Button animation
      const btn = document.getElementById('msg-send-btn');
      if (btn) {
        btn.innerHTML = `
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
          저장 완료!
        `;
        btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
        setTimeout(() => {
          if (btn) {
            btn.innerHTML = `
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              발송 기록 저장
            `;
            btn.style.background = 'linear-gradient(135deg,#6366f1,#8b5cf6)';
          }
        }, 2000);
      }

      showToast('발송 기록이 저장되었습니다!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  editTemplate() {
    if (!this.selectedTemplate) return;
    const t = this.selectedTemplate;
    const meta = this._templateMeta[t.type] || { color: '#6b7280' };

    Modal.show('템플릿 수정', `
      <form id="edit-template-form">
        <div style="padding:12px 16px;background:${meta.color}10;border-radius:10px;border-left:3px solid ${meta.color};margin-bottom:16px;">
          <div style="font-size:11px;font-weight:700;color:${meta.color};text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">${Utils.escapeHtml(t.type)}</div>
          <div style="font-size:12px;color:var(--gray-500);">
            사용 변수: ${(t.variables || []).map(v => `<code style="padding:1px 6px;background:var(--gray-100);border-radius:3px;font-size:11px;">{{${Utils.escapeHtml(v)}}}</code>`).join(' ')}
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">제목</label>
          <input type="text" class="form-input" name="title" value="${Utils.escapeHtml(t.title)}" style="border-radius:10px;">
        </div>
        <div class="form-group">
          <label class="form-label">내용</label>
          <textarea class="form-input" name="content" rows="15" style="border-radius:10px;font-size:13px;line-height:1.8;">${Utils.escapeHtml(t.content)}</textarea>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()" style="border-radius:8px;">취소</button>
      <button class="btn btn-primary" onclick="MessagesPage.saveTemplate()" style="border-radius:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;">저장</button>
    `);
  },

  async saveTemplate() {
    const form = document.getElementById('edit-template-form');
    const formData = new FormData(form);

    try {
      await API.updateTemplate(this.selectedTemplate.id, {
        title: formData.get('title'),
        content: formData.get('content')
      });
      Modal.close();
      showToast('템플릿이 저장되었습니다.', 'success');
      App.navigate('messages');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async showLogs() {
    try {
      const data = await API.getMessageLogs();
      const logs = data.logs || [];

      let logsHtml = '';
      if (logs.length > 0) {
        logsHtml = `
          <div style="max-height:500px;overflow-y:auto;">
            ${logs.map((l, i) => {
              const tMeta = this._templateMeta[l.Template?.type] || { color: '#6b7280', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' };
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
            <div style="font-size:12px;color:var(--gray-400);margin-top:4px;">메시지를 발송하면 이력이 기록됩니다</div>
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
