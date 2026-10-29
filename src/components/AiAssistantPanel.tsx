import { Bot, ChevronLeft, Eraser, Send, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getAssistantReply } from '../services/assistantService'
import { useWorkspace } from '../app/WorkspaceContext'
import type { AssistantPage } from '../types/domain'

interface Message { role: 'assistant' | 'user'; text: string; source?: string; limitations?: string }

const pageForPath = (pathname: string): AssistantPage => {
  if (pathname.includes('appointments')) return 'appointments'
  if (pathname.includes('customers')) return 'customers'
  if (pathname.includes('products')) return 'products'
  if (pathname.includes('records')) return 'records'
  return 'dashboard'
}

const quickPrompts: Record<AssistantPage, string[]> = {
  dashboard: ['整理今日預約', '列出待準備案件'],
  appointments: ['摘要這筆預約', '列出服務前追問'],
  customers: ['我應先確認什麼？', '整理需求摘要'],
  products: ['比較已選商品', '既有設備先確認什麼？'],
  records: ['整理店員筆記', '列出後續事項'],
}

export function AiAssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()
  const { state, activeCaseId } = useWorkspace()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const page = pageForPath(pathname)
  const activeCase = state.cases.find((item) => item.id === activeCaseId)
  const attachedProducts = useMemo(() => state.products.filter((item) => activeCase?.attachedProductIds.includes(item.id)), [activeCase?.attachedProductIds, state.products])
  const submit = (question: string) => {
    const text = question.trim()
    if (!text || loading) return
    setMessages((current) => [...current, { role: 'user', text }])
    setInput('')
    setLoading(true)
    window.setTimeout(() => {
      const reply = getAssistantReply({ page, question: text, currentCase: activeCase, selectedProducts: attachedProducts })
      setMessages((current) => [...current, { role: 'assistant', text: reply.body, source: reply.source, limitations: reply.limitations }])
      setLoading(false)
    }, 340)
  }
  return <aside className={`ai-panel ${open ? 'ai-panel--open' : ''}`} aria-label="AI 顧問助手"><div className="ai-panel__header"><div><span className="eyebrow"><Sparkles size={13} />AI 示範回應</span><h2>AI 顧問助手</h2><p>{activeCase ? `目前案件：${activeCase.caseCode}` : '目前案件：未選擇'}</p></div><button className="icon-button" onClick={onClose} aria-label="收合 AI 助手"><ChevronLeft size={20} /></button></div><div className="ai-context">{activeCase ? <><strong>{activeCase.caseCode}</strong>｜{activeCase.needs.painPoints.join('、')}</> : '請從案件列表開啟一筆案件，讓建議帶入情境。'}</div><div className="prompt-chips">{quickPrompts[page].map((prompt) => <button key={prompt} type="button" onClick={() => submit(prompt)}>{prompt}</button>)}</div><div className="ai-messages" aria-live="polite">{messages.length === 0 && <div className="ai-welcome"><Bot size={24} /><p>我會依目前頁面與示範案件提供可驗證的準備方向，不會假稱已存取內部系統。</p></div>}{messages.map((message, index) => <article key={`${message.role}-${index}`} className={`message message--${message.role}`}><p>{message.text}</p>{message.source && <small>{message.source}</small>}{message.limitations && <small className="limitations">{message.limitations}</small>}</article>)}{loading && <div className="message message--assistant"><span className="typing">正在整理示範資料<span>.</span><span>.</span><span>.</span></span></div>}</div><div className="ai-panel__footer"><button className="text-button" onClick={() => setMessages([])} disabled={messages.length === 0}><Eraser size={14} />清除本案對話</button><form onSubmit={(event) => { event.preventDefault(); submit(input) }}><label className="sr-only" htmlFor="assistant-question">詢問 AI 示範助手</label><input id="assistant-question" value={input} onChange={(event) => setInput(event.target.value)} placeholder="例如：這案先問什麼？" /><button className="icon-button icon-button--brand" aria-label="送出問題"><Send size={16} /></button></form></div></aside>
}
