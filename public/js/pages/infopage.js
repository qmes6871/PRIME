// Insurance Info Page - Blog/Link style
const InfoPagePage = {
  _links: [],

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
            <button class="btn btn-primary" onclick="InfoPagePage.showAddLink()">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
              글 추가
            </button>
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

  _renderLinks() {
    if (this._links.length === 0) {
      return `
        <div class="card" style="text-align:center;padding:40px;">
          <div style="font-size:14px;color:var(--gray-500);margin-bottom:12px;">등록된 보험 정보가 없습니다</div>
          <button class="btn btn-primary btn-sm" onclick="InfoPagePage.showAddLink()">첫 글 추가하기</button>
        </div>
      `;
    }

    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;">
        ${this._links.map(link => `
          <div class="card" style="cursor:pointer;transition:all 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
              <div style="font-size:14px;font-weight:700;color:var(--gray-800);line-height:1.4;">${Utils.escapeHtml(link.title || '(제목없음)')}</div>
              <div style="display:flex;gap:4px;flex-shrink:0;">
                <button class="btn btn-sm" style="padding:2px 6px;font-size:11px;background:var(--gray-50);color:var(--gray-500);border:1px solid var(--gray-200);border-radius:4px;" onclick="InfoPagePage.editLink(${link.id})">수정</button>
                <button class="btn btn-sm" style="padding:2px 6px;font-size:11px;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;border-radius:4px;" onclick="InfoPagePage.deleteLink(${link.id})">삭제</button>
              </div>
            </div>
            ${link.description ? `<div style="font-size:12px;color:var(--gray-500);margin-bottom:8px;line-height:1.5;">${Utils.escapeHtml(link.description)}</div>` : ''}
            ${link.url ? `<a href="${Utils.escapeHtml(link.url)}" target="_blank" style="font-size:12px;color:var(--blue);text-decoration:none;display:flex;align-items:center;gap:4px;" onclick="event.stopPropagation();">
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              링크 열기
            </a>` : ''}
            <div style="font-size:10px;color:var(--gray-400);margin-top:6px;">${Utils.formatDate(link.created_at)}</div>
          </div>
        `).join('')}
      </div>
    `;
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
