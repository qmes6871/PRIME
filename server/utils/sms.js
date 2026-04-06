const https = require('https');

const NHN_APP_KEY = process.env.NHN_APP_KEY;
const NHN_SECRET_KEY = process.env.NHN_SECRET_KEY;
const NHN_SENDER_KEY = process.env.NHN_SENDER_KEY;

async function sendSMS(phone, message) {
  if (!NHN_APP_KEY || !NHN_SECRET_KEY) {
    throw new Error('SMS 발송 설정이 되어있지 않습니다. (NHN_APP_KEY, NHN_SECRET_KEY 필요)');
  }

  const data = JSON.stringify({
    body: message,
    sendNo: NHN_SENDER_KEY,
    recipientList: [{ recipientNo: phone.replace(/[^0-9]/g, '') }]
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api-sms.cloud.toast.com',
      path: `/sms/v3.0/appKeys/${NHN_APP_KEY}/sender/sms`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Secret-Key': NHN_SECRET_KEY
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          if (result.header && result.header.isSuccessful) {
            resolve(result);
          } else {
            reject(new Error(result.header?.resultMessage || 'SMS 발송 실패'));
          }
        } catch (e) {
          reject(new Error('SMS 응답 파싱 실패'));
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

module.exports = { sendSMS };
