// Insurance Info Page - Blog/Link style
const InfoPagePage = {
  _links: [],
  _viewMode: 'card', // 'card' or 'list'

  async render() {
    try {
      const data = await API.getInfoLinks();
      this._links = data.links || [];

      return `
        <div class="page-header">
          <div class="page-header-row">
            <div>
              <h1 class="page-title" style="display:flex;align-items:center;gap:10px;">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:linear-gradient(135deg,#3b82f6,#6366f1);border-radius:10px;">
                  <svg width="18" height="18" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                </span>
                보험 정보
              </h1>
              <p class="page-subtitle">고객에게 공유할 보험 정보와 블로그 링크를 관리합니다</p>
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
              <div style="display:flex;background:var(--gray-100);border-radius:10px;padding:3px;">
                <button onclick="InfoPagePage.setViewMode('card')" style="padding:6px 12px;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:all 0.2s;background:${this._viewMode === 'card' ? 'white' : 'transparent'};color:${this._viewMode === 'card' ? 'var(--gray-800)' : 'var(--gray-400)'};box-shadow:${this._viewMode === 'card' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align:middle;"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                </button>
                <button onclick="InfoPagePage.setViewMode('list')" style="padding:6px 12px;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:all 0.2s;background:${this._viewMode === 'list' ? 'white' : 'transparent'};color:${this._viewMode === 'list' ? 'var(--gray-800)' : 'var(--gray-400)'};box-shadow:${this._viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align:middle;"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
              </div>
              <button class="btn btn-primary" onclick="InfoPagePage.showAddLink()">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                글 추가
              </button>
            </div>
          </div>
        </div>

        <div id="info-links-container">
          ${this._renderLinks()}
        </div>
      `;
    } catch (err) {
      showToast(err.message, 'error');
      return '<div class="empty-state"><div class="empty-state-text">데이터를 불러오는 중 오류가 발생했습니다.</div></div>';
    }
  },

  setViewMode(mode) {
    this._viewMode = mode;
    App.navigate('infopage');
  },

  _renderLinks() {
    if (this._links.length === 0) {
      return `
        <div class="card" style="text-align:center;padding:40px;">
          <div style="font-size:14px;color:var(--gray-500);margin-bottom:12px;">등록된 보험 정보가 없습니다</div>
          <button class="btn btn-primary btn-sm" onclick="InfoPagePage.showAddLink()">첫 글 추가하기</button>
        </div>
      `;
    }

    if (this._viewMode === 'list') return this._renderListView();
    return this._renderCardView();
  },

  _renderCardView() {
    return `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
        ${this._links.map(link => `
          <div style="border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;background:white;box-shadow:0 2px 8px rgba(0,0,0,0.04);transition:all 0.2s;display:flex;flex-direction:column;" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'" onmouseout="this.style.transform='';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'">
            ${link.imageUrl ? `
              <div style="width:100%;padding-top:56%;position:relative;overflow:hidden;background:#f1f5f9;">
                <img src="${Utils.escapeHtml(link.imageUrl)}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;">
              </div>
            ` : `
              <div style="width:100%;padding-top:56%;position:relative;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);">
                <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:32px;">${Utils.escapeHtml(link.icon || '🔗')}</span>
              </div>
            `}
            <div style="padding:14px 16px;flex:1;display:flex;flex-direction:column;">
              <div style="font-size:15px;font-weight:700;color:#1e293b;line-height:1.4;margin-bottom:6px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${Utils.escapeHtml(link.title || '(제목없음)')}</div>
              ${link.description ? `<div style="font-size:12px;color:#64748b;margin-bottom:10px;line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${Utils.escapeHtml(link.description)}</div>` : ''}
              <div style="margin-top:auto;display:flex;align-items:center;justify-content:space-between;">
                ${link.url ? `<a href="${Utils.escapeHtml(link.url)}" target="_blank" style="font-size:12px;color:#3b82f6;text-decoration:none;display:flex;align-items:center;gap:4px;font-weight:500;" onclick="event.stopPropagation();">
                  <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  링크 열기
                </a>` : '<span></span>'}
                <div style="display:flex;gap:4px;">
                  <button class="btn btn-sm" style="padding:4px 8px;font-size:11px;background:#f8fafc;color:#64748b;border:1px solid #e2e8f0;border-radius:6px;" onclick="InfoPagePage.editLink(${link.id})">수정</button>
                  <button class="btn btn-sm" style="padding:4px 8px;font-size:11px;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;border-radius:6px;" onclick="InfoPagePage.deleteLink(${link.id})">삭제</button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  _renderListView() {
    return `
      <div style="background:white;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="padding:16px 20px;background:#f8fafc;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;gap:8px;">
          <svg width="16" height="16" fill="none" stroke="#3b82f6" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          <span style="font-size:14px;font-weight:700;color:#1e293b;">전체 ${this._links.length}건</span>
        </div>
        ${this._links.map((link, i) => `
          <div style="display:flex;align-items:center;gap:14px;padding:12px 20px;${i < this._links.length - 1 ? 'border-bottom:1px solid #f1f5f9;' : ''}transition:background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background=''">
            ${link.imageUrl ? `
              <div style="width:56px;height:56px;border-radius:10px;overflow:hidden;flex-shrink:0;background:#f1f5f9;">
                <img src="${Utils.escapeHtml(link.imageUrl)}" style="width:100%;height:100%;object-fit:cover;">
              </div>
            ` : `
              <div style="width:56px;height:56px;border-radius:10px;flex-shrink:0;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;">
                <span style="font-size:22px;">${Utils.escapeHtml(link.icon || '🔗')}</span>
              </div>
            `}
            <div style="flex:1;min-width:0;">
              <div style="font-size:14px;font-weight:700;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${Utils.escapeHtml(link.title || '(제목없음)')}</div>
              ${link.description ? `<div style="font-size:12px;color:#94a3b8;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${Utils.escapeHtml(link.description)}</div>` : ''}
            </div>
            <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
              ${link.url ? `<a href="${Utils.escapeHtml(link.url)}" target="_blank" style="padding:5px 10px;border-radius:8px;background:#eff6ff;color:#3b82f6;font-size:11px;font-weight:600;text-decoration:none;white-space:nowrap;" onclick="event.stopPropagation();">열기</a>` : ''}
              <button class="btn btn-sm" style="padding:5px 10px;font-size:11px;background:#f8fafc;color:#64748b;border:1px solid #e2e8f0;border-radius:8px;" onclick="InfoPagePage.editLink(${link.id})">수정</button>
              <button class="btn btn-sm" style="padding:5px 10px;font-size:11px;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;border-radius:8px;" onclick="InfoPagePage.deleteLink(${link.id})">삭제</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  _renderImageUpload(existingUrl) {
    const hasImage = !!existingUrl;
    return `
      <div class="form-group">
        <label class="form-label">대표 이미지</label>
        <div id="info-image-preview" style="margin-bottom:8px;${hasImage ? '' : 'display:none;'}">
          <div style="position:relative;width:100%;height:160px;border-radius:10px;overflow:hidden;border:1px solid #e2e8f0;">
            <img id="info-image-img" src="${hasImage ? Utils.escapeHtml(existingUrl) : ''}" style="width:100%;height:100%;object-fit:cover;">
            <button type="button" onclick="InfoPagePage.removeImage()" style="position:absolute;top:6px;right:6px;width:24px;height:24px;border-radius:50%;background:rgba(0,0,0,0.6);color:white;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
        <input type="hidden" name="imageUrl" id="info-image-url" value="${hasImage ? Utils.escapeHtml(existingUrl) : ''}">
        <button type="button" class="btn btn-secondary btn-sm" style="border-radius:8px;" onclick="document.getElementById('info-image-input').click()">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          이미지 ${hasImage ? '변경' : '업로드'}
        </button>
        <input type="file" id="info-image-input" accept="image/*" style="display:none;" onchange="InfoPagePage.handleImageUpload(this)">
      </div>
    `;
  },

  async handleImageUpload(input) {
    const file = input.files[0];
    if (!file) return;
    try {
      const result = await API.uploadPolicyImage(file);
      document.getElementById('info-image-url').value = result.url;
      const preview = document.getElementById('info-image-preview');
      const img = document.getElementById('info-image-img');
      img.src = result.url;
      preview.style.display = '';
    } catch (e) {
      showToast('이미지 업로드 실패: ' + e.message, 'error');
    }
    input.value = '';
  },

  removeImage() {
    document.getElementById('info-image-url').value = '';
    document.getElementById('info-image-preview').style.display = 'none';
  },

  showAddLink() {
    Modal.show('보험 정보 추가', `
      <form id="add-info-form">
        <div class="form-group">
          <label class="form-label">제목 *</label>
          <input type="text" class="form-input" name="title" placeholder="보험 정보 제목" required style="border-radius:10px;">
        </div>
        <div class="form-group">
          <label class="form-label">설명</label>
          <textarea class="form-input" name="description" rows="3" placeholder="간단한 설명" style="border-radius:10px;"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">링크 URL</label>
          <input type="url" class="form-input" name="url" placeholder="https://blog.naver.com/..." style="border-radius:10px;">
        </div>
        ${this._renderImageUpload('')}
      </form>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()">취소</button>
      <button class="btn btn-primary" onclick="InfoPagePage.saveLink()">등록</button>
    `);
  },

  async saveLink() {
    const form = document.getElementById('add-info-form');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((v, k) => { if (v) data[k] = v; });

    if (!data.title) {
      showToast('제목을 입력하세요.', 'error');
      return;
    }

    try {
      await API.createInfoLink(data);
      Modal.close();
      showToast('등록되었습니다.', 'success');
      App.navigate('infopage');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async editLink(id) {
    const link = this._links.find(l => l.id === id);
    if (!link) return;

    Modal.show('보험 정보 수정', `
      <form id="edit-info-form">
        <div class="form-group">
          <label class="form-label">제목 *</label>
          <input type="text" class="form-input" name="title" value="${Utils.escapeHtml(link.title || '')}" required style="border-radius:10px;">
        </div>
        <div class="form-group">
          <label class="form-label">설명</label>
          <textarea class="form-input" name="description" rows="3" style="border-radius:10px;">${Utils.escapeHtml(link.description || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">링크 URL</label>
          <input type="url" class="form-input" name="url" value="${Utils.escapeHtml(link.url || '')}" style="border-radius:10px;">
        </div>
        ${this._renderImageUpload(link.imageUrl || '')}
      </form>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()">취소</button>
      <button class="btn btn-primary" onclick="InfoPagePage.updateLink(${id})">저장</button>
    `);
  },

  async updateLink(id) {
    const form = document.getElementById('edit-info-form');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((v, k) => { data[k] = v || null; });

    try {
      await API.updateInfoLink(id, data);
      Modal.close();
      showToast('수정되었습니다.', 'success');
      App.navigate('infopage');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  deleteLink(id) {
    Modal.confirm('이 글을 삭제하시겠습니까?', async () => {
      try {
        await API.deleteInfoLink(id);
        showToast('삭제되었습니다.', 'success');
        App.navigate('infopage');
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }
};
