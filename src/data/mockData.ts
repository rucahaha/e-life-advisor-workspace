import type { Appointment, ConsultationCase, MockState, Product, ServiceRecord } from '../types/domain'
import { taipeiDay } from '../utils/format'

const stamp = (dayOffset: number, time: string) => `${taipeiDay(dayOffset)}T${time}:00+08:00`

const cases = (): ConsultationCase[] => [
  {
    id: 'case-001', caseCode: 'EL-001', personaType: '毛孩家庭', status: 'requested', source: 'customer_netlify',
    createdAt: stamp(-1, '10:15'), updatedAt: stamp(-1, '10:15'), assignedStaffId: 'staff-demo', attachedProductIds: [],
    needs: { petTypes: ['貓'], petCount: 2, aloneHours: '6–8 小時', painPoints: ['毛髮與空氣品質', '安全與意外'], budgetRange: 'NT$3,000–8,000', existingDevices: ['空氣清淨機（型號待確認）'], housingType: '電梯大樓／約 18 坪', extraNotes: '希望先了解不重複購買的改善方式。' },
    checklist: [
      { id: 'ck-001-1', text: '確認既有空氣清淨機的型號、濾網狀況與擺放位置', completed: false },
      { id: 'ck-001-2', text: '確認主要活動空間與可放置設備的坪數', completed: false },
      { id: 'ck-001-3', text: '詢問是否需要外出時遠端查看居家狀態', completed: false },
    ],
  },
  {
    id: 'case-002', caseCode: 'EL-002', personaType: '毛孩家庭', status: 'preparing', source: 'manual_demo',
    createdAt: stamp(-3, '14:20'), updatedAt: stamp(0, '08:40'), assignedStaffId: 'staff-demo', attachedProductIds: ['prod-04'],
    needs: { petTypes: ['狗'], petCount: 1, aloneHours: '4–6 小時', painPoints: ['地板毛髮清潔', '希望減少每日清掃時間'], budgetRange: 'NT$10,000–18,000', existingDevices: ['傳統吸塵器'], housingType: '公寓／木地板與磁磚混合', extraNotes: '想比較掃拖機器人的避障與集塵需求。' },
    checklist: [
      { id: 'ck-002-1', text: '確認地毯高度與門檻落差', completed: true },
      { id: 'ck-002-2', text: '確認是否能接受集塵座所需的擺放空間', completed: false },
    ],
  },
  {
    id: 'case-003', caseCode: 'EL-003', personaType: '新居家庭', status: 'confirmed', source: 'customer_netlify',
    createdAt: stamp(-2, '09:30'), updatedAt: stamp(-1, '16:10'), assignedStaffId: 'staff-demo', attachedProductIds: [],
    needs: { petTypes: [], aloneHours: '尚未決定', painPoints: ['預算未定', '想先了解智慧生活方案'], budgetRange: '尚未決定', existingDevices: ['無'], housingType: '新成屋／預計 22 坪', extraNotes: '重視入門容易、後續可擴充。' },
    checklist: [{ id: 'ck-003-1', text: '確認家庭成員與優先生活情境', completed: false }],
  },
  {
    id: 'case-004', caseCode: 'EL-004', personaType: '毛孩家庭', status: 'served', source: 'manual_demo',
    createdAt: stamp(-7, '11:10'), updatedAt: stamp(-1, '15:20'), assignedStaffId: 'staff-demo', attachedProductIds: ['prod-01', 'prod-07'],
    needs: { petTypes: ['狗'], petCount: 2, aloneHours: '2–4 小時', painPoints: ['需要操作教學', '夜間居家查看'], budgetRange: 'NT$5,000–12,000', existingDevices: ['空氣清淨機'], housingType: '透天一樓', extraNotes: '希望能用家人手機一起查看，需安排操作教學。' },
    checklist: [{ id: 'ck-004-1', text: '確認共同帳號與通知設定方式', completed: true }],
  },
  {
    id: 'case-005', caseCode: 'EL-005', personaType: '毛孩家庭', status: 'prepared', source: 'import',
    createdAt: stamp(-4, '13:45'), updatedAt: stamp(0, '09:10'), assignedStaffId: 'staff-demo', attachedProductIds: ['prod-02', 'prod-06'],
    needs: { petTypes: ['貓'], petCount: 1, aloneHours: '8–10 小時', painPoints: ['外出期間的安全提醒', '空氣悶味'], budgetRange: 'NT$8,000–15,000', existingDevices: ['循環扇'], housingType: '套房／約 10 坪', extraNotes: '有窗邊日照，需先確認攝影機安裝位置。' },
    checklist: [{ id: 'ck-005-1', text: '已確認插座與 Wi‑Fi 覆蓋範圍', completed: true }],
  },
  {
    id: 'case-006', caseCode: 'EL-006', personaType: '長者家庭', status: 'reschedule_requested', source: 'customer_netlify',
    createdAt: stamp(-2, '17:00'), updatedAt: stamp(0, '10:20'), assignedStaffId: 'staff-demo', attachedProductIds: [],
    needs: { petTypes: [], aloneHours: '不適用', painPoints: ['希望簡化照明操作', '夜間安全'], budgetRange: 'NT$3,000–6,000', existingDevices: ['一般壁面開關'], housingType: '公寓／家人協助設定', extraNotes: '原時段無法到店，等待確認新的下午時段。' },
    checklist: [{ id: 'ck-006-1', text: '確認需要保留哪些既有開關習慣', completed: false }],
  },
  {
    id: 'case-007', caseCode: 'EL-007', personaType: '毛孩家庭', status: 'cancelled', source: 'manual_demo',
    createdAt: stamp(-6, '10:00'), updatedAt: stamp(-5, '11:00'), attachedProductIds: [],
    needs: { petTypes: ['狗'], petCount: 1, aloneHours: '6–8 小時', painPoints: ['異味'], budgetRange: 'NT$5,000 以下', existingDevices: ['除濕機'], housingType: '公寓', extraNotes: '顧客表示暫緩規劃。' },
    checklist: [],
  },
  {
    id: 'case-008', caseCode: 'EL-008', personaType: '新婚／新居家庭', status: 'unreachable', source: 'import',
    createdAt: stamp(-5, '15:30'), updatedAt: stamp(-1, '18:00'), attachedProductIds: [],
    needs: { petTypes: [], aloneHours: '尚未決定', painPoints: ['想整合清潔與照明'], budgetRange: 'NT$15,000–25,000', existingDevices: ['掃地機器人（規格未知）'], housingType: '新成屋／約 25 坪', extraNotes: '尚未取得可確認的聯繫回覆。' },
    checklist: [{ id: 'ck-008-1', text: '取得既有掃地機器人型號與保固狀況', completed: false }],
  },
]

const products: Product[] = [
  { id: 'prod-01', brand: '森淨', model: 'AirCare 360 Demo', category: '空氣品質', features: ['HEPA 等級濾網', '異味感測', '睡眠模式'], specs: { 適用空間: '8–12 坪', 濾網提醒: '有', 噪音: '24–52 dB' }, priceTwd: 6980, warrantyNote: '示範：主機 2 年；耗材依說明', inventoryNote: '示範資料，未查證庫存', sourceType: 'demo', lastVerifiedAt: '2026-10-29' },
  { id: 'prod-02', brand: '森淨', model: 'AirCare Compact Demo', category: '空氣品質', features: ['小坪數設計', '濾網提醒', '簡易旋鈕'], specs: { 適用空間: '4–8 坪', 濾網提醒: '有', 噪音: '22–48 dB' }, priceTwd: 3980, warrantyNote: '示範：主機 1 年', inventoryNote: '示範資料，未查證庫存', sourceType: 'demo', lastVerifiedAt: '2026-10-29' },
  { id: 'prod-03', brand: '清新生活', model: 'Breathe Pro Demo', category: '空氣品質', features: ['PM2.5 感測', '定時', '兒童鎖'], specs: { 適用空間: '12–16 坪', 濾網提醒: '有', 噪音: '26–55 dB' }, priceTwd: 9880, warrantyNote: '示範：保固細節需向正式通路確認', inventoryNote: '尚未提供', sourceType: 'demo', lastVerifiedAt: '2026-10-29' },
  { id: 'prod-04', brand: '輕淨', model: 'MopBot S8 Demo', category: '地板清潔', features: ['掃拖整合', '地毯辨識', '雷達避障'], specs: { 集塵: '無', 續航: '150 分鐘', 越障: '2 cm' }, priceTwd: 12800, warrantyNote: '示範：主機 2 年', inventoryNote: '示範資料，未查證庫存', sourceType: 'demo', lastVerifiedAt: '2026-10-29' },
  { id: 'prod-05', brand: '輕淨', model: 'MopBot Station Demo', category: '地板清潔', features: ['自動集塵', '熱風烘乾', '多樓層地圖'], specs: { 集塵: '自動集塵座', 續航: '180 分鐘', 越障: '2 cm' }, priceTwd: 18900, warrantyNote: '示範：耗材更換週期需確認', inventoryNote: '尚未提供', sourceType: 'demo', lastVerifiedAt: '2026-10-29' },
  { id: 'prod-06', brand: '安心看', model: 'HomeView Mini Demo', category: '居家監控', features: ['1080p 影像', '雙向通話', '隱私遮蔽'], specs: { 夜視: '有', 儲存: '記憶卡／雲端選用', 網路: '2.4 GHz Wi‑Fi' }, priceTwd: 2290, warrantyNote: '示範：主機 1 年', inventoryNote: '示範資料，未查證庫存', sourceType: 'demo', lastVerifiedAt: '2026-10-29' },
  { id: 'prod-07', brand: '安心看', model: 'HomeView Pan Demo', category: '居家監控', features: ['水平旋轉', '動態偵測', '雙向通話'], specs: { 夜視: '有', 儲存: '記憶卡／雲端選用', 網路: '2.4 GHz Wi‑Fi' }, priceTwd: 3690, warrantyNote: '示範：雲端方案非必要，需確認條款', inventoryNote: '尚未提供', sourceType: 'demo', lastVerifiedAt: '2026-10-29' },
  { id: 'prod-08', brand: '光居', model: 'WarmLight Starter Demo', category: '智慧照明', features: ['可調色溫', '情境排程', '保留手動開關'], specs: { 協定: 'Wi‑Fi', 控制: 'App／實體開關', 色溫: '2700–6500K' }, priceTwd: 1680, warrantyNote: '示範：安裝相容性需確認', inventoryNote: '示範資料，未查證庫存', sourceType: 'demo', lastVerifiedAt: '2026-10-29' },
  { id: 'prod-09', brand: '生活連線', model: 'HomeHub Lite Demo', category: '智慧生活', features: ['情境自動化', '多裝置提醒', '家庭成員權限'], specs: { 網路: '2.4 GHz Wi‑Fi', 控制: 'App', 擴充: '支援示範裝置' }, priceTwd: 4580, warrantyNote: '示範：相容性清單需正式確認', inventoryNote: '未查證', sourceType: 'demo', lastVerifiedAt: '2026-10-29' },
]

const appointments = (): Appointment[] => [
  { id: 'appt-001', caseId: 'case-001', storeId: 'demo-zhongshan', preferredDate: taipeiDay(0), preferredPeriod: '下午 14:00–16:00', status: 'requested', consentRecordedAt: stamp(-1, '10:15') },
  { id: 'appt-002', caseId: 'case-002', storeId: 'demo-zhongshan', preferredDate: taipeiDay(0), preferredPeriod: '上午 10:30–11:30', confirmedDateTime: stamp(0, '10:30'), status: 'preparing' },
  { id: 'appt-003', caseId: 'case-003', storeId: 'demo-banqiao', preferredDate: taipeiDay(1), preferredPeriod: '晚上 18:00–20:00', confirmedDateTime: stamp(1, '18:30'), status: 'confirmed' },
  { id: 'appt-004', caseId: 'case-004', storeId: 'demo-zhongshan', preferredDate: taipeiDay(-1), preferredPeriod: '下午 15:00–16:00', confirmedDateTime: stamp(-1, '15:00'), status: 'served' },
  { id: 'appt-005', caseId: 'case-005', storeId: 'demo-taoyuan', preferredDate: taipeiDay(0), preferredPeriod: '晚上 19:00–20:00', confirmedDateTime: stamp(0, '19:00'), status: 'prepared' },
  { id: 'appt-006', caseId: 'case-006', storeId: 'demo-banqiao', preferredDate: taipeiDay(0), preferredPeriod: '上午 09:00–10:00', status: 'reschedule_requested', rescheduleReason: '顧客原定時段無法到店，已提出改為下午。' },
  { id: 'appt-007', caseId: 'case-007', storeId: 'demo-taoyuan', preferredDate: taipeiDay(-5), preferredPeriod: '下午 13:00–14:00', status: 'cancelled' },
  { id: 'appt-008', caseId: 'case-008', storeId: 'demo-banqiao', preferredDate: taipeiDay(2), preferredPeriod: '下午 15:00–16:00', status: 'unreachable' },
]

const records = (): ServiceRecord[] => [
  { id: 'record-004', caseId: 'case-004', staffId: 'staff-demo', happenedAt: stamp(-1, '15:20'), summary: '完成居家查看與通知設定操作教學，示範家人共同使用方式。', recommendedProductIds: ['prod-01', 'prod-07'], outcome: '顧客理解基本操作，約定一週後確認使用狀況。', followUpItems: ['一週後確認夜間通知是否過於頻繁'], staffConfirmed: true },
]

export const createInitialState = (): MockState => ({
  cases: cases(),
  appointments: appointments(),
  products: structuredClone(products),
  records: records(),
  activities: [
    { id: 'act-001', caseId: 'case-001', kind: 'application', message: '示範預約申請已建立，等待店員確認。', createdAt: stamp(-1, '10:15'), actorLabel: '示範顧客端' },
    { id: 'act-002', caseId: 'case-002', kind: 'status', message: '案件已開始準備商品比較。', createdAt: stamp(0, '08:40'), actorLabel: '示範店員' },
    { id: 'act-003', caseId: 'case-004', kind: 'record', message: '已新增顧問服務紀錄與後續追蹤事項。', createdAt: stamp(-1, '15:20'), actorLabel: '示範店員' },
  ],
})
