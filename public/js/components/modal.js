// Modal Component
const Modal = {
  _escHandler: null,

  show(title, content, footer = '') {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close" onclick="Modal.close()">&times;</button>
        </div>
        <div class="modal-body">${content}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>
    `;
    // 모달 밖 클릭으로 닫기 비활성화 (X 버튼/ESC로만 닫기)
    document.body.appendChild(overlay);

    // ESC 키로 닫기
    this._escHandler = (e) => {
      if (e.key === 'Escape') Modal.close();
    };
    document.addEventListener('keydown', this._escHandler);
  },

  close() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.remove();
    if (this._escHandler) {
      document.removeEventListener('keydown', this._escHandler);
      this._escHandler = null;
    }
  },

  confirm(message, onConfirm) {
    this.show(
      '확인',
      `<p style="font-size:14px;color:var(--gray-600)">${message}</p>`,
      `<button class="btn btn-secondary" onclick="Modal.close()">취소</button>
       <button class="btn btn-primary" onclick="Modal.close(); (${onConfirm.toString()})()">확인</button>`
    );
  }
};

// Toast
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
