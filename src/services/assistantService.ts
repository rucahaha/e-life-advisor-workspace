import type { AssistantPage, AssistantReply, ConsultationCase, Product } from '../types/domain'

const pageLead: Record<AssistantPage, string> = {
  dashboard: '我已依今天的示範案件整理優先順序。',
  appointments: '我會先以預約狀態與偏好時段協助排出準備順序。',
  customers: '我會把顧客原始問卷、AI 推論與待確認資訊清楚拆開。',
  products: '我只會使用目前示範商品欄位做比較，不會假稱即時庫存或正式規格。',
  records: '我可協助將店員筆記整理為草稿，但仍需要店員確認後才可保存。',
}

export const getAssistantReply = ({ page, question, currentCase, selectedProducts }: {
  page: AssistantPage
  question: string
  currentCase?: ConsultationCase
  selectedProducts?: Product[]
}): AssistantReply => {
  const label = currentCase ? `${currentCase.caseCode} 的` : '目前'
  const painPoints = currentCase?.needs.painPoints.join('、') || '案件狀態'
  const existing = currentCase?.needs.existingDevices.length ? `已知既有設備：${currentCase.needs.existingDevices.join('、')}。` : '既有設備資料尚不足。'
  const productLine = selectedProducts?.length
    ? `已選 ${selectedProducts.map((item) => item.model).join('、')}；可比較 ${selectedProducts[0].category === '地板清潔' ? '續航、越障與是否有集塵座' : '適用空間、相容性與使用限制'}。`
    : '尚未選擇商品，請先以類別、預算與必要功能縮小範圍。'

  if (question.includes('既有') || question.includes('確認')) {
    return { title: '建議先確認', body: `${pageLead[page]} ${label}首要困擾為「${painPoints}」。${existing} 建議先確認型號、適用空間、使用狀況與是否確實需要新增設備，再提出方案。`, source: '來源：示範案件問卷與規則式 AI 邏輯', limitations: 'AI 示範回應／需店員確認；不構成醫療、庫存或保固承諾。' }
  }
  if (question.includes('比較') || question.includes('商品')) {
    return { title: '比較方向', body: `${pageLead[page]} ${productLine} 對 ${label}案件，請同時確認預算、住宅條件及網路／插座限制。`, source: '來源：示範商品資料與案件欄位', limitations: '價格、庫存與保固均為示範或未查證資料，需另行確認。' }
  }
  if (question.includes('筆記') || question.includes('摘要')) {
    return { title: '服務摘要草稿', body: `${pageLead[page]} 建議摘要：顧客主要希望改善「${painPoints}」。下一步先補足資訊缺口，列出可比較的類別，再由店員確認採用方案與追蹤事項。`, source: '來源：示範案件問卷與規則式 AI 邏輯', limitations: 'AI 示範回應；儲存前請由店員修訂與確認。' }
  }
  return { title: '工作建議', body: `${pageLead[page]} 針對${label}，可先處理時間最接近且狀態為待確認／準備中的案件。若資料不足，請把問題加入待確認清單，而非自行假設。`, source: '來源：示範案件狀態與規則式 AI 邏輯', limitations: 'AI 示範回應／不會連接全國電子內部系統或外部模型。' }
}
