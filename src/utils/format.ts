import type { CaseStatus } from '../types/domain'

export const statusMeta: Record<CaseStatus, { label: string; tone: string }> = {
  requested: { label: '待確認', tone: 'warning' },
  confirmed: { label: '已確認', tone: 'info' },
  preparing: { label: '準備中', tone: 'blue' },
  prepared: { label: '準備完成', tone: 'success' },
  served: { label: '已服務', tone: 'neutral' },
  closed: { label: '已結案', tone: 'neutral' },
  cancelled: { label: '已取消', tone: 'danger' },
  reschedule_requested: { label: '待回覆改期', tone: 'warning' },
  unreachable: { label: '聯繫未果', tone: 'danger' },
}

export const formatDate = (value: string, includeTime = false) => new Intl.DateTimeFormat('zh-TW', {
  timeZone: 'Asia/Taipei',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  ...(includeTime ? { hour: '2-digit', minute: '2-digit', hour12: false } : {}),
}).format(new Date(value))

export const formatMoney = (value?: number) => value === undefined
  ? '尚未提供'
  : new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(value)

export const taipeiDay = (offset = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' }).format(date)
}

export const dayLabel = (offset = 0) => offset === 0 ? '今天' : offset === 1 ? '明天' : '示範日期'
