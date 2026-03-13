// Modal Component
const Modal = {
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
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) Modal.close();
    });
    document.body.appendChild(overlay);
  },

  close() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.remove();
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
