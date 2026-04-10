// Calendar Page
const CalendarPage = {
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,
  events: [],
  todos: [],
  selectedDate: null,
  dragItem: null,
  dragType: null,
  customers: [],

  colorMap: {
    blue: { bg: '#EFF6FF', border: '#3B82F6', text: '#1D4ED8', dot: '#3B82F6' },
    green: { bg: '#F0FDF4', border: '#22C55E', text: '#15803D', dot: '#22C55E' },
    red: { bg: '#FEF2F2', border: '#EF4444', text: '#DC2626', dot: '#EF4444' },
    orange: { bg: '#FFF7ED', border: '#F97316', text: '#C2410C', dot: '#F97316' },
    purple: { bg: '#F5F3FF', border: '#8B5CF6', text: '#6D28D9', dot: '#8B5CF6' },
    pink: { bg: '#FDF2F8', border: '#EC4899', text: '#BE185D', dot: '#EC4899' }
  },

  categoryColors: {
    '상담': 'blue',
    '미팅': 'green',
    '서류': 'orange',
    '기타': 'purple'
  },

  async render() {
    await this.loadData();
    return this.buildHTML();
  },

  async loadData() {
    try {
      const [evtRes, todoRes, custRes] = await Promise.all([
        API.getCalendarEvents({ year: this.currentYear, month: this.currentMonth }),
        API.getCalendarTodos({ year: this.currentYear, month: this.currentMonth }),
        API.getCustomers({ limit: 500 })
      ]);
      this.events = evtRes.events || [];
      this.todos = todoRes.todos || [];
      this.customers = custRes.customers || [];
    } catch (err) {
      console.error('Calendar data load error:', err);
      this.events = [];
      this.todos = [];
      this.customers = [];
    }
  },

  buildHTML() {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const year = this.currentYear;
    const month = this.currentMonth;

    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const prevDays = new Date(year, month - 1, 0).getDate();

    const monthNames = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

    let calendarCells = '';

    // Previous month filler
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevDays - i;
      calendarCells += `<div class="cal-cell cal-cell-other""><div class="cal-date-num">${d}</div></div>`;
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const isToday = dateStr === todayStr;
      const isSelected = dateStr === this.selectedDate;
      const dayEvents = this.events.filter(e => e.start_date === dateStr);
      const dayTodos = this.todos.filter(t => t.due_date === dateStr);
      const hasItems = dayEvents.length > 0 || dayTodos.length > 0;

      let dotsHTML = '';
      if (dayEvents.length > 0 || dayTodos.length > 0) {
        const dots = [];
        dayEvents.slice(0, 3).forEach(e => {
          const c = this.colorMap[e.color] || this.colorMap.blue;
          dots.push(`<span class="cal-dot" style="background:${c.dot}"></span>`);
        });
        dayTodos.filter(t => !t.is_completed).slice(0, 2).forEach(() => {
          dots.push(`<span class="cal-dot" style="background:#F97316"></span>`);
        });
        dotsHTML = `<div class="cal-dots">${dots.slice(0, 4).join('')}</div>`;
      }

      let itemsPreview = '';
      if (dayEvents.length > 0 || dayTodos.length > 0) {
        const previews = [];
        dayEvents.slice(0, 2).forEach(e => {
          const c = this.colorMap[e.color] || this.colorMap.blue;
          const time = e.start_time ? e.start_time.substring(0,5) : '';
          previews.push(`<div class="cal-item-preview" style="background:${c.bg};color:${c.text};border-left:3px solid ${c.border}"
            draggable="true" ondragstart="CalendarPage.onDragStart(event,'event',${e.id})"
            onclick="event.stopPropagation();CalendarPage.showEventDetail(${e.id})">${time ? '<span class="cal-item-time">'+time+'</span>' : ''}${Utils.escapeHtml(e.title)}</div>`);
        });
        dayTodos.filter(t => !t.is_completed).slice(0, 2).forEach(t => {
          previews.push(`<div class="cal-item-preview cal-todo-preview"
            draggable="true" ondragstart="CalendarPage.onDragStart(event,'todo',${t.id})"
            onclick="event.stopPropagation();CalendarPage.toggleTodo(${t.id})"><span class="cal-todo-check"></span>${Utils.escapeHtml(t.title)}</div>`);
        });
        const moreCount = (dayEvents.length + dayTodos.length) - previews.length;
        if (moreCount > 0) {
          previews.push(`<div class="cal-item-more">+${moreCount}개 더보기</div>`);
        }
        itemsPreview = `<div class="cal-items-container">${previews.join('')}</div>`;
      }

      calendarCells += `
        <div class="cal-cell${isToday ? ' cal-today' : ''}${isSelected ? ' cal-selected' : ''}"
             data-date="${dateStr}"
             onclick="CalendarPage.selectDate('${dateStr}')"
             ondragover="event.preventDefault();this.classList.add('cal-dragover')"
             ondragleave="this.classList.remove('cal-dragover')"
             ondrop="CalendarPage.onDrop(event,'${dateStr}');this.classList.remove('cal-dragover')">
          <div class="cal-date-num${isToday ? ' cal-date-today' : ''}">${d}</div>
          ${dotsHTML}
          ${itemsPreview}
        </div>`;
    }

    // Next month filler
    const totalCells = firstDay + daysInMonth;
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remaining; i++) {
      calendarCells += `<div class="cal-cell cal-cell-other"><div class="cal-date-num">${i}</div></div>`;
    }

    // Selected date panel
    const panelHTML = this.selectedDate ? this.buildDatePanel(this.selectedDate) : '';

    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">캘린더</h1>
          <p class="page-subtitle">일정 관리 & 할 일</p>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-primary" onclick="CalendarPage.showEventModal()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            일정 추가
          </button>
        </div>
      </div>

      <div class="cal-layout">
        <div class="cal-main">
          <div class="card">
            <div class="cal-header">
              <button class="cal-nav-btn" onclick="CalendarPage.prevMonth()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <div class="cal-title">
                <span class="cal-year">${year}년</span>
                <span class="cal-month">${monthNames[month-1]}</span>
              </div>
              <button class="cal-nav-btn" onclick="CalendarPage.nextMonth()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button class="cal-nav-btn cal-today-btn" onclick="CalendarPage.goToday()">오늘</button>
            </div>
            <div class="cal-weekdays">
              <div class="cal-weekday sun">일</div>
              <div class="cal-weekday">월</div>
              <div class="cal-weekday">화</div>
              <div class="cal-weekday">수</div>
              <div class="cal-weekday">목</div>
              <div class="cal-weekday">금</div>
              <div class="cal-weekday sat">토</div>
            </div>
            <div class="cal-grid">
              ${calendarCells}
            </div>
          </div>
        </div>
        <div class="cal-sidebar" id="cal-sidebar">
          ${panelHTML || this.buildTodayPanel()}
        </div>
      </div>
    `;
  },

  buildTodayPanel() {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    return this.buildDatePanel(todayStr);
  },

  buildDatePanel(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const dayNames = ['일','월','화','수','목','금','토'];
    const dateLabel = `${d.getMonth()+1}월 ${d.getDate()}일 (${dayNames[d.getDay()]})`;
    const dayEvents = this.events.filter(e => e.start_date === dateStr);
    const dayTodos = this.todos.filter(t => t.due_date === dateStr);

    let eventsHTML = '';
    if (dayEvents.length > 0) {
      eventsHTML = dayEvents.map(e => {
        const c = this.colorMap[e.color] || this.colorMap.blue;
        const custName = e.Customer ? e.Customer.name : '';
        return `
          <div class="cal-panel-event" style="border-left:3px solid ${c.border};background:${c.bg}" onclick="CalendarPage.showEventDetail(${e.id})">
            <div class="cal-panel-event-top">
              <span class="cal-panel-event-cat" style="color:${c.text}">${e.category}</span>
              ${e.start_time ? `<span class="cal-panel-event-time">${e.start_time}${e.end_time ? ' ~ '+e.end_time : ''}</span>` : ''}
            </div>
            <div class="cal-panel-event-title">${Utils.escapeHtml(e.title)}</div>
            ${custName ? `<div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px;">
              <div class="cal-panel-event-customer">${Utils.escapeHtml(custName)}</div>
              <div style="display:flex;gap:4px;">
                <button class="btn btn-sm" style="padding:5px 12px;font-size:12px;font-weight:600;background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;border-radius:6px;" onclick="event.stopPropagation();App.navigate('consultation',{customerId:${e.customer_id}})">제안서</button>
                <button class="btn btn-sm" style="padding:5px 12px;font-size:12px;font-weight:600;background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0;border-radius:6px;" onclick="event.stopPropagation();CalendarPage.sendAlimtalkTo(${e.customer_id})">알림톡</button>
              </div>
            </div>` : ''}
          </div>`;
      }).join('');
    } else {
      eventsHTML = '<div class="cal-panel-empty">등록된 일정이 없습니다</div>';
    }

    let todosHTML = dayTodos.map(t => {
      const priorityIcon = t.priority === 'high' ? '!' : t.priority === 'low' ? '' : '';
      return `
        <div class="cal-panel-todo ${t.is_completed ? 'completed' : ''}">
          <label class="cal-todo-label">
            <input type="checkbox" ${t.is_completed ? 'checked' : ''} onchange="CalendarPage.toggleTodo(${t.id})">
            <span class="cal-todo-checkbox"></span>
            <span class="cal-todo-text">${Utils.escapeHtml(t.title)}</span>
            ${priorityIcon ? `<span class="cal-todo-priority ${t.priority}">${priorityIcon}</span>` : ''}
          </label>
          <button class="cal-todo-del" onclick="CalendarPage.deleteTodo(${t.id})" title="삭제">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>`;
    }).join('');

    return `
      <div class="card cal-date-panel">
        <div class="cal-panel-header">
          <h3 class="cal-panel-date">${dateLabel}</h3>
        </div>

        <div class="cal-panel-section">
          <div class="cal-panel-section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            일정 <span class="cal-panel-count">${dayEvents.length}</span>
          </div>
          ${eventsHTML}
        </div>

        <div class="cal-panel-section">
          <div class="cal-panel-section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            할 일 <span class="cal-panel-count">${dayTodos.length}</span>
          </div>
          ${todosHTML}
          <div class="cal-quick-todo">
            <input type="text" class="cal-quick-input" id="cal-quick-todo-input"
              placeholder="할 일 추가..."
              onkeydown="if(event.key==='Enter'){event.preventDefault();CalendarPage.quickAddTodo('${dateStr}')}">
            <select class="cal-quick-priority" id="cal-quick-todo-priority">
              <option value="medium">보통</option>
              <option value="high">높음</option>
              <option value="low">낮음</option>
            </select>
            <button class="btn btn-primary btn-sm" style="padding:6px 10px;white-space:nowrap;" onclick="CalendarPage.quickAddTodo('${dateStr}')">추가</button>
          </div>
        </div>

        <div class="cal-panel-actions">
          <button class="btn btn-primary btn-sm" onclick="CalendarPage.showEventModal('${dateStr}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            일정 추가
          </button>
        </div>
      </div>
    `;
  },

  // =========== NAVIGATION ===========

  async prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 1) { this.currentMonth = 12; this.currentYear--; }
    this.selectedDate = null;
    await this.refresh();
  },

  async nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 12) { this.currentMonth = 1; this.currentYear++; }
    this.selectedDate = null;
    await this.refresh();
  },

  async goToday() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth() + 1;
    this.selectedDate = `${this.currentYear}-${String(this.currentMonth).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    await this.refresh();
  },

  selectDate(dateStr) {
    // 이미 선택된 날짜를 다시 클릭하면 리렌더 방지 (입력 포커스 유지)
    if (this.selectedDate === dateStr) return;
    this.selectedDate = dateStr;
    const sidebar = document.getElementById('cal-sidebar');
    if (sidebar) {
      sidebar.innerHTML = this.buildDatePanel(dateStr);
    }
    // Update cell selection visually
    document.querySelectorAll('.cal-cell').forEach(c => c.classList.remove('cal-selected'));
    const cell = document.querySelector(`.cal-cell[data-date="${dateStr}"]`);
    if (cell) cell.classList.add('cal-selected');
  },

  async refresh() {
    await this.loadData();
    const main = document.querySelector('.main-content');
    if (main) main.innerHTML = this.buildHTML();
  },

  // =========== DRAG & DROP ===========

  onDragStart(e, type, id) {
    this.dragType = type;
    this.dragItem = id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${type}:${id}`);
  },

  async onDrop(e, dateStr) {
    e.preventDefault();
    if (!this.dragItem) return;
    try {
      if (this.dragType === 'event') {
        await API.moveCalendarEvent(this.dragItem, { start_date: dateStr, end_date: dateStr });
      } else if (this.dragType === 'todo') {
        await API.moveCalendarTodo(this.dragItem, { due_date: dateStr });
      }
      showToast('이동되었습니다.', 'success');
      await this.refresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
    this.dragItem = null;
    this.dragType = null;
  },

  // =========== EVENT CRUD ===========

  showEventModal(dateStr, eventData) {
    const isEdit = !!eventData;
    const d = dateStr || this.selectedDate || new Date().toISOString().split('T')[0];

    const customerOptions = this.customers.map(c =>
      `<option value="${c.id}" ${eventData && eventData.customer_id === c.id ? 'selected' : ''}>${Utils.escapeHtml(c.name)}${c.phone ? ' ('+c.phone+')' : ''}</option>`
    ).join('');

    const colors = Object.entries(this.colorMap).map(([key, val]) =>
      `<label class="cal-color-opt"><input type="radio" name="evt-color" value="${key}" ${(eventData?.color || 'blue') === key ? 'checked' : ''}><span class="cal-color-swatch" style="background:${val.dot}"></span></label>`
    ).join('');

    const body = `
        <div class="form-group">
          <label class="form-label">제목 *</label>
          <input type="text" class="form-input" id="evt-title" value="${Utils.escapeHtml(eventData?.title || '')}" placeholder="일정 제목">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group">
            <label class="form-label">카테고리</label>
            <select class="form-input" id="evt-category">
              ${['상담','미팅','서류','기타'].map(c => `<option value="${c}" ${eventData?.category === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">고객 연결</label>
            <select class="form-input" id="evt-customer">
              <option value="">선택 안함</option>
              ${customerOptions}
            </select>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group">
            <label class="form-label">시작일 *</label>
            <input type="date" class="form-input" id="evt-start-date" value="${eventData?.start_date || d}">
          </div>
          <div class="form-group">
            <label class="form-label">시작 시간</label>
            <input type="time" class="form-input" id="evt-start-time" value="${eventData?.start_time || ''}">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group">
            <label class="form-label">종료일</label>
            <input type="date" class="form-input" id="evt-end-date" value="${eventData?.end_date || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">종료 시간</label>
            <input type="time" class="form-input" id="evt-end-time" value="${eventData?.end_time || ''}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">메모</label>
          <textarea class="form-input" id="evt-desc" rows="2" placeholder="메모 (선택)">${eventData?.description || ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">색상</label>
          <div class="cal-color-picker">${colors}</div>
        </div>
        <div class="form-group">
          <label class="form-label" style="display:flex;align-items:center;gap:8px;">
            <input type="checkbox" id="evt-recurring" ${eventData?.is_recurring ? 'checked' : ''} onchange="document.getElementById('evt-recurrence-opts').style.display=this.checked?'grid':'none'">
            반복 일정
          </label>
          <div id="evt-recurrence-opts" style="display:${eventData?.is_recurring ? 'grid' : 'none'};grid-template-columns:1fr 1fr;gap:12px;margin-top:8px;">
            <select class="form-input" id="evt-recurrence-type">
              ${['daily','weekly','monthly','yearly'].map(t => `<option value="${t}" ${eventData?.recurrence_type === t ? 'selected' : ''}>${{daily:'매일',weekly:'매주',monthly:'매월',yearly:'매년'}[t]}</option>`).join('')}
            </select>
            <input type="date" class="form-input" id="evt-recurrence-end" value="${eventData?.recurrence_end || ''}" placeholder="종료일">
          </div>
        </div>
    `;

    const footer = `
        ${isEdit ? `<button class="btn btn-danger" onclick="CalendarPage.deleteEvent(${eventData.id})">삭제</button>` : ''}
        <div style="display:flex;gap:8px;margin-left:auto;">
          <button class="btn btn-secondary" onclick="Modal.close()">취소</button>
          <button class="btn btn-primary" onclick="CalendarPage.saveEvent(${eventData?.id || 'null'})">${isEdit ? '수정' : '추가'}</button>
        </div>
    `;

    Modal.show(isEdit ? '일정 수정' : '일정 추가', body, footer);
  },

  async saveEvent(id) {
    const title = document.getElementById('evt-title').value.trim();
    if (!title) { showToast('제목을 입력하세요.', 'error'); return; }

    const color = document.querySelector('input[name="evt-color"]:checked')?.value || 'blue';
    const isRecurring = document.getElementById('evt-recurring').checked;

    const data = {
      title,
      category: document.getElementById('evt-category').value,
      customer_id: document.getElementById('evt-customer').value || null,
      start_date: document.getElementById('evt-start-date').value,
      start_time: document.getElementById('evt-start-time').value || null,
      end_date: document.getElementById('evt-end-date').value || null,
      end_time: document.getElementById('evt-end-time').value || null,
      description: document.getElementById('evt-desc').value,
      color,
      is_recurring: isRecurring,
      recurrence_type: isRecurring ? document.getElementById('evt-recurrence-type').value : null,
      recurrence_end: isRecurring ? document.getElementById('evt-recurrence-end').value || null : null
    };

    try {
      if (id) {
        await API.updateCalendarEvent(id, data);
        showToast('일정이 수정되었습니다.', 'success');
      } else {
        await API.createCalendarEvent(data);
        showToast('일정이 추가되었습니다.', 'success');
      }
      Modal.close();
      await this.refresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  showEventDetail(id) {
    const event = this.events.find(e => e.id === id);
    if (!event) return;
    this.showEventModal(event.start_date, event);
  },

  async deleteEvent(id) {
    if (!confirm('이 일정을 삭제하시겠습니까?')) return;
    try {
      await API.deleteCalendarEvent(id);
      showToast('삭제되었습니다.', 'success');
      Modal.close();
      await this.refresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  // =========== TODO CRUD ===========

  _addingTodo: false,
  async quickAddTodo(dateStr) {
    if (this._addingTodo) return;
    const input = document.getElementById('cal-quick-todo-input');
    const priority = document.getElementById('cal-quick-todo-priority');
    const title = input.value.trim();
    if (!title) return;

    this._addingTodo = true;
    try {
      await API.createCalendarTodo({ title, due_date: dateStr, priority: priority.value });
      showToast('할 일이 추가되었습니다.', 'success');
      await this._reloadAndRefresh(dateStr);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      this._addingTodo = false;
    }
  },

  async toggleTodo(id) {
    try {
      await API.toggleCalendarTodo(id);
      await this._reloadAndRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async deleteTodo(id) {
    try {
      await API.deleteCalendarTodo(id);
      showToast('삭제되었습니다.', 'success');
      await this._reloadAndRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async _reloadAndRefresh(keepDate) {
    const date = keepDate || this.selectedDate;
    const [evtRes, todoRes] = await Promise.all([
      API.getCalendarEvents({ year: this.currentYear, month: this.currentMonth }),
      API.getCalendarTodos({ year: this.currentYear, month: this.currentMonth })
    ]);
    this.events = evtRes.events || [];
    this.todos = todoRes.todos || [];
    this.selectedDate = date;
    const main = document.querySelector('.main-content');
    if (main) main.innerHTML = this.buildHTML();
    // 입력창 포커스 복원
    setTimeout(() => {
      const input = document.getElementById('cal-quick-todo-input');
      if (input) input.focus();
    }, 50);
  },

  // =========== ALIMTALK INTEGRATION ===========

  sendAlimtalkTo(customerId) {
    App.navigate('messages', { customerId, templateType: '일정' });
  },

  // =========== PROPOSAL LINK ===========

  goToConsultation(customerId) {
    App.navigate('consultation', { customerId });
  }
};
