// SPA Router & Main App
const App = {
  currentPage: 'dashboard',

  async init() {
    if (!API.isLoggedIn()) {
      this.renderLogin();
      return;
    }
    this.navigate('dashboard');
  },

  async navigate(page, params = {}) {
    if (page === 'login' || !API.isLoggedIn()) {
      this.renderLogin();
      return;
    }

    this.currentPage = page;
    const app = document.getElementById('app');

    // Show loading
    app.innerHTML = `
      ${Sidebar.render(page)}
      <main class="main-content">
        <div style="display:flex;align-items:center;justify-content:center;height:60vh;">
          <div class="loading-spinner"></div>
        </div>
      </main>
    `;

    try {
      let content = '';
      let pageObj = null;

      switch (page) {
        case 'dashboard':
          content = await DashboardPage.render();
          break;
        case 'consultation':
          content = await ConsultationPage.render(params);
          break;
        case 'messages':
          pageObj = MessagesPage;
          content = await MessagesPage.render();
          break;
        case 'alimtalk':
          pageObj = AlimtalkPage;
          content = await AlimtalkPage.render();
          break;
        case 'coverage':
          content = await CoveragePage.render();
          break;
        case 'settings':
          content = await SettingsPage.render();
          break;
        default:
          content = '<div class="empty-state"><div class="empty-state-text">페이지를 찾을 수 없습니다.</div></div>';
      }

      app.innerHTML = `
        ${Sidebar.render(page)}
        <main class="main-content">${content}</main>
      `;

      // Post-render hooks
      if (pageObj && pageObj.onRendered) {
        pageObj.onRendered();
      }
    } catch (err) {
      console.error('Page render error:', err);
      app.innerHTML = `
        ${Sidebar.render(page)}
        <main class="main-content">
          <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <div class="empty-state-text">${Utils.escapeHtml(err.message)}</div>
            <button class="btn btn-primary" onclick="App.navigate('${page}')">다시 시도</button>
          </div>
        </main>
      `;
    }
  },

  renderLogin() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="login-container">
        <div class="login-card">
          <div class="login-title">PRIME ASSET</div>
          <div class="login-subtitle">보험상담 전산 시스템</div>
          <form onsubmit="App.handleLogin(event)">
            <div class="form-group">
              <label class="form-label">아이디</label>
              <input type="text" class="form-input" id="login-id" placeholder="아이디를 입력하세요" required>
            </div>
            <div class="form-group">
              <label class="form-label">비밀번호</label>
              <input type="password" class="form-input" id="login-pw" placeholder="비밀번호를 입력하세요" required>
            </div>
            <button type="submit" class="btn btn-primary btn-lg" style="width:100%;justify-content:center;margin-top:8px;">로그인</button>
          </form>
          <div id="login-error" style="color:var(--red);font-size:13px;text-align:center;margin-top:12px;display:none;"></div>
          <div style="text-align:center;margin-top:16px;">
            <a href="javascript:App.showRegister()" style="font-size:13px;color:var(--blue);text-decoration:none;">회원가입</a>
          </div>
        </div>
      </div>
    `;
  },

  async handleLogin(e) {
    e.preventDefault();
    const loginId = document.getElementById('login-id').value;
    const password = document.getElementById('login-pw').value;
    const errorEl = document.getElementById('login-error');

    try {
      const result = await API.login(loginId, password);
      API.setToken(result.token);
      API.setAgent(result.agent);
      this.navigate('dashboard');
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.style.display = 'block';
    }
  },

  showRegister() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="login-container">
        <div class="login-card">
          <div class="login-title">회원가입</div>
          <div class="login-subtitle">설계사 계정을 생성합니다</div>
          <form onsubmit="App.handleRegister(event)">
            <div class="form-group">
              <label class="form-label">아이디 *</label>
              <input type="text" class="form-input" id="reg-login-id" required>
            </div>
            <div class="form-group">
              <label class="form-label">비밀번호 *</label>
              <input type="password" class="form-input" id="reg-pw" required>
            </div>
            <div class="form-group">
              <label class="form-label">이름 *</label>
              <input type="text" class="form-input" id="reg-name" required>
            </div>
            <div class="form-group">
              <label class="form-label">연락처</label>
              <input type="tel" class="form-input" id="reg-phone" placeholder="010-0000-0000">
            </div>
            <div class="form-group">
              <label class="form-label">직급</label>
              <input type="text" class="form-input" id="reg-position" value="설계사">
            </div>
            <button type="submit" class="btn btn-primary btn-lg" style="width:100%;justify-content:center;margin-top:8px;">가입하기</button>
          </form>
          <div id="reg-error" style="color:var(--red);font-size:13px;text-align:center;margin-top:12px;display:none;"></div>
          <div style="text-align:center;margin-top:16px;">
            <a href="javascript:App.renderLogin()" style="font-size:13px;color:var(--blue);text-decoration:none;">← 로그인으로 돌아가기</a>
          </div>
        </div>
      </div>
    `;
  },

  async handleRegister(e) {
    e.preventDefault();
    const errorEl = document.getElementById('reg-error');

    try {
      const result = await API.register({
        login_id: document.getElementById('reg-login-id').value,
        password: document.getElementById('reg-pw').value,
        name: document.getElementById('reg-name').value,
        phone: document.getElementById('reg-phone').value,
        position: document.getElementById('reg-position').value
      });
      API.setToken(result.token);
      API.setAgent(result.agent);
      showToast('가입이 완료되었습니다!', 'success');
      this.navigate('dashboard');
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.style.display = 'block';
    }
  },

  logout() {
    API.removeToken();
    this.renderLogin();
    showToast('로그아웃되었습니다.', 'info');
  }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => App.init());
