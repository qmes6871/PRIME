// Utility functions
const Utils = {
  formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  },

  formatDateTime(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return `${this.formatDate(dateStr)} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  },

  formatPhone(phone) {
    if (!phone) return '-';
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  },

  formatMoney(amount) {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  },

  formatMoneyShort(amount) {
    if (!amount) return '-';
    if (amount >= 100000000) return (amount / 100000000).toFixed(1) + '억';
    if (amount >= 10000) return (amount / 10000).toFixed(0) + '만';
    return new Intl.NumberFormat('ko-KR').format(amount);
  },

  getStatusClass(status) {
    switch(status) {
      case '상담전': return 'before';
      case '상담중': return 'ing';
      case '청약완료': return 'signed';
      case '상담완료': return 'done';
      case '신규': return 'new';
      default: return '';
    }
  },

  debounce(fn, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  calculateInsuranceAge(birthDate) {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    // 보험나이는 만나이 + 6개월 반올림
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
    return Math.round(months / 12);
  },

  replaceTemplateVars(template, vars) {
    let result = template;
    for (const [key, value] of Object.entries(vars)) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || '');
    }
    return result;
  },

  copyToClipboard(text) {
    const fallback = () => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return Promise.resolve();
    };
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text).catch(fallback);
    }
    return fallback();
  },

  // 전화번호 입력 시 자동으로 '-' 추가 (input 이벤트에 바인딩)
  formatPhoneInput(input) {
    let value = input.value.replace(/[^0-9]/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    if (value.length > 7) {
      value = value.replace(/(\d{3})(\d{4})(\d{0,4})/, '$1-$2-$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{0,4})/, '$1-$2');
    }
    input.value = value;
  },

  // 금액 입력 시 자동으로 쉼표 추가 (input 이벤트에 바인딩)
  formatMoneyInput(input) {
    let value = input.value.replace(/[^0-9]/g, '');
    if (value) {
      value = new Intl.NumberFormat('ko-KR').format(parseInt(value));
    }
    input.value = value;
  },

  // 금액 입력에서 순수 숫자값 추출
  getMoneyValue(input) {
    return parseInt((input.value || '0').replace(/[^0-9]/g, '')) || 0;
  },

  // 생년월일로 상령일 자동 계산 (생일 + 6개월 = 상령 월/일, 다가올 날짜 반환)
  calculatePolicyAnniversary(birthDateStr) {
    if (!birthDateStr) return '';
    const birth = new Date(birthDateStr);
    if (isNaN(birth.getTime())) return '';
    // 상령일 = 생일 월 + 6개월의 같은 일
    const annivMonth = birth.getMonth() + 6; // 0-indexed, may exceed 11
    const annivDay = birth.getDate();
    const today = new Date();
    today.setHours(0,0,0,0);
    // 올해 상령일
    let year = today.getFullYear();
    let anniv = new Date(year, annivMonth, annivDay);
    // 이미 지났으면 내년
    if (anniv < today) {
      year++;
      anniv = new Date(year, annivMonth, annivDay);
    }
    return `${anniv.getFullYear()}-${String(anniv.getMonth()+1).padStart(2,'0')}-${String(anniv.getDate()).padStart(2,'0')}`;
  },

  // 다음 주소검색 팝업
  searchAddress(callback) {
    new daum.Postcode({
      oncomplete: function(data) {
        const addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        callback(addr, data.zonecode);
      }
    }).open();
  },

  // 생년월일 텍스트 입력 시 자동 포맷 (YYYY-MM-DD)
  formatBirthInput(input) {
    let value = input.value.replace(/[^0-9]/g, '');
    if (value.length > 8) value = value.substring(0, 8);
    if (value.length > 6) {
      value = value.replace(/(\d{4})(\d{2})(\d{0,2})/, '$1-$2-$3');
    } else if (value.length > 4) {
      value = value.replace(/(\d{4})(\d{0,2})/, '$1-$2');
    }
    input.value = value;
  }
};
