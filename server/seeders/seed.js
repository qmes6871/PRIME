const bcrypt = require('bcrypt');
const { Agent, InsuranceCompany, MessageTemplate, CoverageCheckItem, AgentSetting } = require('../models');

async function seedData() {
  try {
    // 1. 보험사 데이터 시드
    const companyCount = await InsuranceCompany.count();
    if (companyCount === 0) {
      console.log('Seeding insurance companies...');
      await InsuranceCompany.bulkCreate([
        // 생명보험사 (18개)
        { name: '삼성생명', type: '생명', phone: '1588-3114', sort_order: 1 },
        { name: '한화생명', type: '생명', phone: '1588-6363', sort_order: 2 },
        { name: '교보생명', type: '생명', phone: '1588-1001', sort_order: 3 },
        { name: '신한라이프', type: '생명', phone: '1588-5580', sort_order: 4 },
        { name: 'NH농협생명', type: '생명', phone: '1544-4000', sort_order: 5 },
        { name: 'KB생명', type: '생명', phone: '1588-9922', sort_order: 6 },
        { name: 'DGB생명', type: '생명', phone: '1588-4770', sort_order: 7 },
        { name: 'iM라이프', type: '생명', phone: '1588-4770', sort_order: 8 },
        { name: '미래에셋생명', type: '생명', phone: '1588-0220', sort_order: 9 },
        { name: '동양생명', type: '생명', phone: '1588-2323', sort_order: 10 },
        { name: 'ABL생명', type: '생명', phone: '1588-6500', sort_order: 11 },
        { name: '흥국생명', type: '생명', phone: '1588-2288', sort_order: 12 },
        { name: '처브라이프', type: '생명', phone: '1599-7200', sort_order: 13 },
        { name: 'DB생명', type: '생명', phone: '1588-3131', sort_order: 14 },
        { name: '하나생명', type: '생명', phone: '1544-5114', sort_order: 15 },
        { name: '푸본현대생명', type: '생명', phone: '1588-6363', sort_order: 16 },
        { name: 'KDB생명', type: '생명', phone: '1588-4040', sort_order: 17 },
        { name: '라이나생명', type: '생명', phone: '1588-0058', sort_order: 18 },
        // 손해보험사 (15개)
        { name: '삼성화재', type: '손해', phone: '1588-5114', sort_order: 1 },
        { name: 'DB손해보험', type: '손해', phone: '1588-0100', sort_order: 2 },
        { name: '현대해상', type: '손해', phone: '1588-5656', sort_order: 3 },
        { name: 'KB손해보험', type: '손해', phone: '1544-0114', sort_order: 4 },
        { name: '메리츠화재', type: '손해', phone: '1566-7711', sort_order: 5 },
        { name: '한화손해보험', type: '손해', phone: '1566-8000', sort_order: 6 },
        { name: 'NH농협손해보험', type: '손해', phone: '1644-9666', sort_order: 7 },
        { name: '롯데손해보험', type: '손해', phone: '1588-3344', sort_order: 8 },
        { name: 'MG손해보험', type: '손해', phone: '1588-5959', sort_order: 9 },
        { name: '흥국화재', type: '손해', phone: '1688-1688', sort_order: 10 },
        { name: 'AXA손해보험', type: '손해', phone: '1566-1566', sort_order: 11 },
        { name: 'AIG손해보험', type: '손해', phone: '1544-2792', sort_order: 12 },
        { name: '하나손해보험', type: '손해', phone: '1566-3000', sort_order: 13 },
        { name: 'BNP파리바카디프', type: '손해', phone: '1544-4455', sort_order: 14 },
        { name: '캐롯손해보험', type: '손해', phone: '1566-3626', sort_order: 15 }
      ]);
      console.log('Insurance companies seeded.');
    }

    // 2. 기본 관리자 계정 생성
    const agentCount = await Agent.count();
    if (agentCount === 0) {
      console.log('Creating default agent account...');
      const hashedPassword = await bcrypt.hash('prime1234', 10);
      const agent = await Agent.create({
        login_id: 'admin',
        password: hashedPassword,
        name: '김예준',
        phone: '010-0000-0000',
        position: '본부장',
        branch: '프라임에셋'
      });

      // 기본 설정 생성
      await AgentSetting.create({
        agent_id: agent.id,
        company_name: '프라임에셋',
        greeting_name: '김예준 본부장'
      });

      // 3. 기본 메시지 템플릿 시드
      console.log('Seeding default message templates...');
      await MessageTemplate.bulkCreate([
        // 메시지안내 5종
        {
          agent_id: agent.id,
          type: '담당자변경',
          title: '담당자 변경 안내',
          content: `안녕하세요, {{고객명}}님.

기존 담당 설계사의 변경으로 인해, 앞으로 {{고객명}}님의 보험 관련 업무는 제가 담당하게 되었습니다.

저는 프라임에셋 {{설계사명}}입니다.

{{고객명}}님의 소중한 보장이 잘 유지될 수 있도록 최선을 다하겠습니다.

궁금한 점이 있으시면 언제든 연락 주세요.
📞 {{설계사연락처}}

감사합니다.`,
          variables: ['고객명', '설계사명', '설계사연락처'],
          category: '메시지안내',
          sort_order: 1,
          is_default: true
        },
        {
          agent_id: agent.id,
          type: '해지',
          title: '해지 안내',
          content: `안녕하세요, {{고객명}}님.

{{보험사명}} {{상품명}} 해지 관련 안내드립니다.

해지 시 환급금: {{환급금}}
해지 신청 방법:
1. 고객센터 전화: {{보험사전화}}
2. 모바일 앱에서 직접 신청

해지 전 꼭 확인해주세요:
- 보장 공백이 생기지 않는지
- 재가입 시 보험료 인상 여부

궁금한 점은 언제든 연락 주세요.
📞 {{설계사연락처}}`,
          variables: ['고객명', '보험사명', '상품명', '환급금', '보험사전화', '설계사연락처'],
          category: '메시지안내',
          sort_order: 2,
          is_default: true
        },
        {
          agent_id: agent.id,
          type: '실효해지',
          title: '실효 해지 안내',
          content: `안녕하세요, {{고객명}}님.

{{보험사명}} {{상품명}}이 보험료 미납으로 인해 실효 상태입니다.

실효일: {{실효일}}
부활 가능 기간: 실효일로부터 3년 이내

부활 신청 시 필요사항:
- 밀린 보험료 납부
- 건강 고지 (경우에 따라 건강검진)

조속한 부활을 권해드립니다.
📞 {{설계사연락처}}`,
          variables: ['고객명', '보험사명', '상품명', '실효일', '설계사연락처'],
          category: '메시지안내',
          sort_order: 3,
          is_default: true
        },
        {
          agent_id: agent.id,
          type: '청구서류',
          title: '보험금 청구 서류 안내',
          content: `안녕하세요, {{고객명}}님.

보험금 청구에 필요한 서류를 안내드립니다.

【{{보험사명}} 보험금 청구 서류】

기본 서류:
{{서류목록}}

청구 방법:
1. {{보험사명}} 고객센터: {{보험사전화}}
2. {{보험사명}} 모바일 앱
3. 팩스 접수: {{팩스번호}}

서류 준비에 어려움이 있으시면 연락 주세요.
📞 {{설계사연락처}}`,
          variables: ['고객명', '보험사명', '서류목록', '보험사전화', '팩스번호', '설계사연락처'],
          category: '메시지안내',
          sort_order: 4,
          is_default: true
        },
        {
          agent_id: agent.id,
          type: '자동이체해지',
          title: '자동이체 해지 안내',
          content: `안녕하세요, {{고객명}}님.

{{보험사명}} {{상품명}}의 자동이체 변경/해지 안내입니다.

현재 이체 계좌: {{현재계좌}}
변경 방법:
1. {{보험사명}} 고객센터: {{보험사전화}}
2. {{보험사명}} 모바일 앱 > 계약관리 > 납입정보변경

※ 자동이체 해지 시 보험료 미납으로 실효될 수 있으니 주의해주세요.

궁금한 점은 연락 주세요.
📞 {{설계사연락처}}`,
          variables: ['고객명', '보험사명', '상품명', '현재계좌', '보험사전화', '설계사연락처'],
          category: '메시지안내',
          sort_order: 5,
          is_default: true
        },
        // 알림톡 4종
        {
          agent_id: agent.id,
          type: '인사',
          title: '인사 알림톡',
          content: `안녕하세요, {{고객명}}님! 😊

프라임에셋 {{설계사명}}입니다.
{{고객명}}님의 보험을 담당하게 되어 기쁩니다.

보험 관련 궁금한 점이 있으시면 편하게 연락 주세요!
📞 {{설계사연락처}}`,
          variables: ['고객명', '설계사명', '설계사연락처'],
          category: '알림톡',
          sort_order: 1,
          is_default: true
        },
        {
          agent_id: agent.id,
          type: '일정',
          title: '상담 일정 안내',
          content: `안녕하세요, {{고객명}}님.

프라임에셋 {{설계사명}}입니다.
상담 일정 안내드립니다.

📅 일시: {{상담일시}}
📍 장소: {{상담장소}}

변경이 필요하시면 미리 연락 주세요.
📞 {{설계사연락처}}`,
          variables: ['고객명', '설계사명', '상담일시', '상담장소', '설계사연락처'],
          category: '알림톡',
          sort_order: 2,
          is_default: true
        },
        {
          agent_id: agent.id,
          type: '자료',
          title: '상담 자료 전송',
          content: `안녕하세요, {{고객명}}님.

프라임에셋 {{설계사명}}입니다.
요청하신 보험 상담 자료를 보내드립니다.

📋 제안서 확인하기:
{{제안서링크}}

검토 후 궁금한 점이 있으시면 연락 주세요.
📞 {{설계사연락처}}`,
          variables: ['고객명', '설계사명', '제안서링크', '설계사연락처'],
          category: '알림톡',
          sort_order: 3,
          is_default: true
        },
        {
          agent_id: agent.id,
          type: '종료',
          title: '상담 완료 안내',
          content: `안녕하세요, {{고객명}}님.

프라임에셋 {{설계사명}}입니다.
보험 상담이 완료되었습니다.

{{상담요약}}

앞으로도 {{고객명}}님의 든든한 보험 파트너가 되겠습니다.

궁금한 점이 생기시면 언제든 연락 주세요!
📞 {{설계사연락처}}`,
          variables: ['고객명', '설계사명', '상담요약', '설계사연락처'],
          category: '알림톡',
          sort_order: 4,
          is_default: true
        }
      ]);
      console.log('Message templates seeded.');

      // 4. 기본 보장 점검 항목 시드
      console.log('Seeding coverage check items...');
      await CoverageCheckItem.bulkCreate([
        // 사망
        { agent_id: agent.id, category: '사망', item_name: '일반사망', sort_order: 1 },
        { agent_id: agent.id, category: '사망', item_name: '재해사망', sort_order: 2 },
        { agent_id: agent.id, category: '사망', item_name: '교통사고사망', sort_order: 3 },
        // 진단
        { agent_id: agent.id, category: '진단', item_name: '암진단', sort_order: 1 },
        { agent_id: agent.id, category: '진단', item_name: '뇌혈관질환진단', sort_order: 2 },
        { agent_id: agent.id, category: '진단', item_name: '허혈성심장질환진단', sort_order: 3 },
        { agent_id: agent.id, category: '진단', item_name: '유사암진단', sort_order: 4 },
        { agent_id: agent.id, category: '진단', item_name: '소액암진단', sort_order: 5 },
        // 수술
        { agent_id: agent.id, category: '수술', item_name: '질병수술', sort_order: 1 },
        { agent_id: agent.id, category: '수술', item_name: '재해수술', sort_order: 2 },
        { agent_id: agent.id, category: '수술', item_name: 'N대수술', sort_order: 3 },
        // 입원
        { agent_id: agent.id, category: '입원', item_name: '질병입원일당', sort_order: 1 },
        { agent_id: agent.id, category: '입원', item_name: '재해입원일당', sort_order: 2 },
        // 실손
        { agent_id: agent.id, category: '실손', item_name: '실손의료비(통원)', sort_order: 1 },
        { agent_id: agent.id, category: '실손', item_name: '실손의료비(입원)', sort_order: 2 },
        // 후유장해
        { agent_id: agent.id, category: '후유장해', item_name: '질병후유장해', sort_order: 1 },
        { agent_id: agent.id, category: '후유장해', item_name: '재해후유장해', sort_order: 2 },
        // 기타
        { agent_id: agent.id, category: '기타', item_name: '치아보존치료', sort_order: 1 },
        { agent_id: agent.id, category: '기타', item_name: '치아보철치료', sort_order: 2 },
        { agent_id: agent.id, category: '기타', item_name: '골절진단', sort_order: 3 },
        { agent_id: agent.id, category: '기타', item_name: '화상진단', sort_order: 4 },
        { agent_id: agent.id, category: '기타', item_name: '일상생활배상책임', sort_order: 5 }
      ]);
      console.log('Coverage check items seeded.');

      console.log('Default admin account: admin / prime1234');
    }

  } catch (err) {
    console.error('Seeding error:', err);
  }
}

module.exports = seedData;
