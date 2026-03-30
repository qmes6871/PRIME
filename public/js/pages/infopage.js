// Insurance Info Page - Blog/Link style
const InfoPagePage = {
  _links: [],
  _viewMode: 'card', // 'card' or 'list'
  _selectedCategory: null, // null = 전체

  _getCategories() {
    const cats = [];
    this._links.forEach(l => {
      if (l.category && !cats.includes(l.category)) cats.push(l.category);
    });
    return cats.sort();
  },

  _getFilteredLinks() {
    if (!this._selectedCategory) return this._links;
    return this._links.filter(l => l.category === this._selectedCategory);
  },

  async render() {
    try {
      const data = await API.getInfoLinks();
      this._links = data.links || [];

      const categories = this._getCategories();

      return `
        <div class="page-header">
          <div class="page-header-row" style="flex-wrap:wrap;">
            <div>
              <h1 class="page-title" style="display:flex;align-items:center;gap:10px;">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:linear-gradient(135deg,#3b82f6,#6366f1);border-radius:10px;">
                  <svg width="18" height="18" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                </span>
                보험 정보
              </h1>
              <p class="page-subtitle">고객에게 공유할 보험 정보와 블로그 링크를 관리합니다</p>
            </div>
            <div class="infopage-actions">
              <div class="infopage-view-toggle">
                <button onclick="InfoPagePage.setViewMode('card')" class="infopage-view-btn ${this._viewMode === 'card' ? 'active' : ''}">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align:middle;"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                </button>
                <button onclick="InfoPagePage.setViewMode('list')" class="infopage-view-btn ${this._viewMode === 'list' ? 'active' : ''}">
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

        ${categories.length > 0 ? `
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;align-items:center;" id="category-filter">
          <button onclick="InfoPagePage.filterCategory(null)" style="padding:6px 14px;border-radius:20px;border:1px solid ${!this._selectedCategory ? '#3b82f6' : '#e2e8f0'};background:${!this._selectedCategory ? '#3b82f6' : 'white'};color:${!this._selectedCategory ? 'white' : '#64748b'};font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;">
            전체
          </button>
          ${categories.map(cat => `
            <button onclick="InfoPagePage.filterCategory('${Utils.escapeHtml(cat)}')" style="padding:6px 14px;border-radius:20px;border:1px solid ${this._selectedCategory === cat ? '#3b82f6' : '#e2e8f0'};background:${this._selectedCategory === cat ? '#3b82f6' : 'white'};color:${this._selectedCategory === cat ? 'white' : '#64748b'};font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;">
              ${Utils.escapeHtml(cat)}
            </button>
          `).join('')}
          <button onclick="InfoPagePage.showCategoryManager()" style="padding:4px 8px;border-radius:20px;border:1px solid #e2e8f0;background:white;color:#94a3b8;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:3px;" title="카테고리 관리">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
            관리
          </button>
        </div>
        ` : ''}

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

  filterCategory(cat) {
    this._selectedCategory = cat;
    App.navigate('infopage');
  },

  _renderLinks() {
    const links = this._getFilteredLinks();
    if (links.length === 0) {
      return `
        <div class="card" style="text-align:center;padding:40px;">
          <div style="font-size:14px;color:var(--gray-500);margin-bottom:12px;">${this._selectedCategory ? '해당 카테고리에 등록된 글이 없습니다' : '등록된 보험 정보가 없습니다'}</div>
          <button class="btn btn-primary btn-sm" onclick="InfoPagePage.showAddLink()">첫 글 추가하기</button>
        </div>
      `;
    }

    if (this._viewMode === 'list') return this._renderListView(links);
    return this._renderCardView(links);
  },

  _renderCategoryBadge(category) {
    if (!category) return '';
    return `<span style="display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;background:#eef2ff;color:#6366f1;border:1px solid #c7d2fe;">${Utils.escapeHtml(category)}</span>`;
  },

  _renderCardView(links) {
    return `
      <div class="infopage-card-grid">
        ${links.map(link => `
          <div class="infopage-card">
            ${link.imageUrl ? `
              <div class="infopage-card-thumb">
                <img src="${Utils.escapeHtml(link.imageUrl)}" alt="">
              </div>
            ` : `
              <div class="infopage-card-thumb infopage-card-thumb-empty">
                <span>${Utils.escapeHtml(link.icon || '🔗')}</span>
              </div>
            `}
            <div class="infopage-card-body">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                ${this._renderCategoryBadge(link.category)}
              </div>
              <div class="infopage-card-title">${Utils.escapeHtml(link.title || '(제목없음)')}</div>
              ${link.description ? `<div class="infopage-card-desc">${Utils.escapeHtml(link.description)}</div>` : ''}
              <div class="infopage-card-footer">
                ${link.url ? `<a href="${Utils.escapeHtml(link.url)}" target="_blank" class="infopage-card-link" onclick="event.stopPropagation();">
                  <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  링크 열기
                </a>` : '<span></span>'}
                <div class="infopage-card-btns">
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

  _renderListView(links) {
    return `
      <div class="infopage-list">
        <div class="infopage-list-header">
          <svg width="16" height="16" fill="none" stroke="#3b82f6" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          <span style="font-size:14px;font-weight:700;color:#1e293b;">${this._selectedCategory ? Utils.escapeHtml(this._selectedCategory) + ' ' : '전체 '}${links.length}건</span>
        </div>
        ${links.map((link, i) => `
          <div class="infopage-list-item${i < links.length - 1 ? '' : ' last'}">
            ${link.imageUrl ? `
              <div class="infopage-list-thumb">
                <img src="${Utils.escapeHtml(link.imageUrl)}" alt="">
              </div>
            ` : `
              <div class="infopage-list-thumb infopage-list-thumb-empty">
                <span>${Utils.escapeHtml(link.icon || '🔗')}</span>
              </div>
            `}
            <div class="infopage-list-content">
              <div style="display:flex;align-items:center;gap:6px;">
                ${this._renderCategoryBadge(link.category)}
                <div class="infopage-list-title">${Utils.escapeHtml(link.title || '(제목없음)')}</div>
              </div>
              ${link.description ? `<div class="infopage-list-desc">${Utils.escapeHtml(link.description)}</div>` : ''}
            </div>
            <div class="infopage-list-actions">
              ${link.url ? `<a href="${Utils.escapeHtml(link.url)}" target="_blank" class="infopage-list-link" onclick="event.stopPropagation();">열기</a>` : ''}
              <button class="btn btn-sm" style="padding:5px 10px;font-size:11px;background:#f8fafc;color:#64748b;border:1px solid #e2e8f0;border-radius:8px;" onclick="InfoPagePage.editLink(${link.id})">수정</button>
              <button class="btn btn-sm" style="padding:5px 10px;font-size:11px;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;border-radius:8px;" onclick="InfoPagePage.deleteLink(${link.id})">삭제</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  _renderCategorySelect(selected) {
    const categories = this._getCategories();
    return `
      <div class="form-group">
        <label class="form-label">카테고리</label>
        <div style="display:flex;gap:6px;">
          <select class="form-input" name="category" id="info-category-select" style="border-radius:10px;flex:1;">
            <option value="">카테고리 없음</option>
            ${categories.map(cat => `<option value="${Utils.escapeHtml(cat)}" ${selected === cat ? 'selected' : ''}>${Utils.escapeHtml(cat)}</option>`).join('')}
          </select>
          <button type="button" class="btn btn-secondary btn-sm" style="border-radius:10px;white-space:nowrap;height:38px;" onclick="InfoPagePage.addNewCategory()">+ 새 카테고리</button>
        </div>
      </div>
    `;
  },

  addNewCategory() {
    const name = prompt('새 카테고리명을 입력하세요');
    if (!name || !name.trim()) return;
    const select = document.getElementById('info-category-select');
    // 이미 있는지 확인
    const exists = Array.from(select.options).some(o => o.value === name.trim());
    if (!exists) {
      const option = document.createElement('option');
      option.value = name.trim();
      option.textContent = name.trim();
      select.insertBefore(option, select.lastElementChild || null);
    }
    select.value = name.trim();
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
        ${this._renderCategorySelect('')}
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
        ${this._renderCategorySelect(link.category || '')}
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
    if (!confirm('저장하시겠습니까?')) return;

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

  showCategoryManager() {
    const categories = this._getCategories();
    Modal.show('카테고리 관리', `
      <div id="cat-manager-list" style="display:flex;flex-direction:column;gap:8px;">
        ${categories.map(cat => {
          const count = this._links.filter(l => l.category === cat).length;
          return `
          <div style="display:flex;align-items:center;gap:8px;padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;">
            <span style="font-size:13px;color:#64748b;min-width:24px;text-align:center;">${count}건</span>
            <span style="flex:1;font-size:14px;font-weight:600;color:#1e293b;">${Utils.escapeHtml(cat)}</span>
            <button class="btn btn-sm" style="padding:4px 10px;font-size:11px;background:white;color:#3b82f6;border:1px solid #bfdbfe;border-radius:6px;" onclick="InfoPagePage.renameCategory('${Utils.escapeHtml(cat)}')">이름변경</button>
            <button class="btn btn-sm" style="padding:4px 10px;font-size:11px;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;border-radius:6px;" onclick="InfoPagePage.deleteCategory('${Utils.escapeHtml(cat)}')">삭제</button>
          </div>`;
        }).join('')}
      </div>
      ${categories.length === 0 ? '<div style="text-align:center;padding:20px;color:var(--gray-400);font-size:13px;">등록된 카테고리가 없습니다</div>' : ''}
      <div style="margin-top:12px;font-size:12px;color:var(--gray-400);line-height:1.6;">
        * 이름변경: 해당 카테고리의 모든 글에 반영됩니다<br>
        * 삭제: 글은 유지되고 카테고리만 해제됩니다
      </div>
    `, `
      <button class="btn btn-secondary" onclick="Modal.close()">닫기</button>
    `);
  },

  async renameCategory(oldName) {
    const newName = prompt('새 카테고리명을 입력하세요', oldName);
    if (!newName || !newName.trim() || newName.trim() === oldName) return;

    const targetLinks = this._links.filter(l => l.category === oldName);
    try {
      for (const link of targetLinks) {
        await API.updateInfoLink(link.id, { category: newName.trim() });
      }
      showToast(`"${oldName}" → "${newName.trim()}" 변경 완료 (${targetLinks.length}건)`, 'success');
      Modal.close();
      if (this._selectedCategory === oldName) this._selectedCategory = newName.trim();
      App.navigate('infopage');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async deleteCategory(catName) {
    const count = this._links.filter(l => l.category === catName).length;
    if (!confirm(`"${catName}" 카테고리를 삭제하시겠습니까?\n${count}건의 글에서 카테고리가 해제됩니다.`)) return;

    const targetLinks = this._links.filter(l => l.category === catName);
    try {
      for (const link of targetLinks) {
        await API.updateInfoLink(link.id, { category: null });
      }
      showToast(`"${catName}" 카테고리 삭제 완료`, 'success');
      Modal.close();
      if (this._selectedCategory === catName) this._selectedCategory = null;
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
