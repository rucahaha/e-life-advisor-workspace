import { AlertCircle, CheckCircle2, Info, LoaderCircle, X } from 'lucide-react'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import type { CaseStatus, SourceType } from '../types/domain'
import { statusMeta } from '../utils/format'

export function StatusBadge({ status }: { status: CaseStatus }) {
  const meta = statusMeta[status]
  return <span className={`status status--${meta.tone}`}>{meta.label}</span>
}

export function SourceLabel({ source = 'demo' }: { source?: SourceType | 'customer_netlify' | 'manual_demo' | 'import' }) {
  const labels: Record<string, string> = { demo: '示範資料', public: '公開資料', authorized_internal: '已授權內部資料', customer_netlify: '跨站介接待串接', manual_demo: '示範建立', import: '示範匯入' }
  return <span className="source-label"><Info size={13} aria-hidden="true" />{labels[source]}</span>
}

export function MetricCard({ label, value, detail, icon, onClick }: { label: string; value: number; detail: string; icon: ReactNode; onClick?: () => void }) {
  const content = <><span className="metric-card__icon">{icon}</span><span className="metric-card__label">{label}</span><strong>{value}</strong><span className="metric-card__detail">{detail}</span></>
  return onClick ? <button type="button" className="metric-card metric-card--button" onClick={onClick}>{content}</button> : <div className="metric-card">{content}</div>
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return <section className="empty-state"><AlertCircle size={25} aria-hidden="true" /><h3>{title}</h3><p>{body}</p>{action}</section>
}

export function LoadingState({ label = '正在讀取示範資料…' }: { label?: string }) {
  return <div className="loading-state"><LoaderCircle className="spin" size={20} aria-hidden="true" />{label}</div>
}

export function ConfirmationDialog({ title, body, confirmLabel, onConfirm, onCancel, children }: { title: string; body: string; confirmLabel: string; onConfirm: () => void; onCancel: () => void; children?: ReactNode }) {
  return <div className="modal-backdrop" role="presentation"><section className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div className="dialog__header"><h2 id="dialog-title">{title}</h2><button className="icon-button" aria-label="關閉對話框" onClick={onCancel}><X size={18} /></button></div><p>{body}</p>{children}<div className="dialog__actions"><button className="button button--secondary" onClick={onCancel}>返回</button><button className="button" onClick={onConfirm}>{confirmLabel}</button></div></section></div>
}

export function Toast({ message, onDismiss }: { message?: string; onDismiss: () => void }) {
  useEffect(() => {
    if (!message) return undefined
    const timer = window.setTimeout(onDismiss, 4400)
    return () => window.clearTimeout(timer)
  }, [message, onDismiss])
  if (!message) return null
  return <div className="toast" role="status"><CheckCircle2 size={18} aria-hidden="true" />{message}<button aria-label="關閉提示" className="icon-button" onClick={onDismiss}><X size={16} /></button></div>
}
