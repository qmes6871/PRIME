// Mobile Preview Component
const MobilePreview = {
  render(content, title = '미리보기') {
    return `
      <div class="mobile-preview-frame">
        <div style="background:var(--navy);color:white;padding:12px 16px;font-size:14px;font-weight:600;">
          ${Utils.escapeHtml(title)}
        </div>
        <div class="mobile-preview-content">
          ${content}
        </div>
      </div>
    `;
  },

  renderProposal(consultation, insurers, agent) {
    const customerName = consultation.Customer?.name || '';
    const agentName = agent?.name || '';

    let html = `
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:18px;font-weight:700;color:var(--navy);margin-bottom:4px;">보험 상담 제안서</div>
        <div style="font-size:12px;color:var(--gray-400);">PRIME ASSET</div>
      </div>
      <div style="background:var(--blue-50);padding:12px;border-radius:8px;margin-bottom:16px;">
        <div style="font-size:13px;color:var(--gray-600);">
          <strong>${Utils.escapeHtml(customerName)}</strong>님을 위한 맞춤 제안서
        </div>
      </div>
    `;

    if (consultation.proposal_html) {
      html += `<div style="margin-bottom:16px;">${consultation.proposal_html}</div>`;
    }

    if (insurers && insurers.length > 0) {
      html += `<div style="font-size:14px;font-weight:600;margin-bottom:8px;">추천 보험사</div>`;
      insurers.forEach(ins => {
        html += `
          <div style="border:1px solid var(--gray-200);border-radius:8px;padding:12px;margin-bottom:8px;">
            <div style="font-weight:600;font-size:13px;">${Utils.escapeHtml(ins.InsuranceCompany?.name || '')}</div>
            ${ins.product_name ? `<div style="font-size:12px;color:var(--gray-500);margin-top:4px;">${Utils.escapeHtml(ins.product_name)}</div>` : ''}
            ${ins.premium ? `<div style="font-size:13px;color:var(--blue);font-weight:600;margin-top:4px;">월 ${Utils.formatMoney(ins.premium)}</div>` : ''}
          </div>
        `;
      });
    }

    html += `
      <div style="border-top:1px solid var(--gray-200);padding-top:12px;margin-top:16px;font-size:12px;color:var(--gray-400);text-align:center;">
        프라임에셋 ${Utils.escapeHtml(agentName)}<br>
        ${Utils.formatDate(new Date().toISOString())}
      </div>
    `;

    return this.render(html, '보험 상담 제안서');
  },

  renderMessage(content, title = '메시지 미리보기') {
    const formatted = Utils.escapeHtml(content).replace(/\n/g, '<br>');
    return this.render(`<div style="white-space:pre-wrap;font-size:14px;line-height:1.7;">${formatted}</div>`, title);
  }
};
