import { CalendarCheck2, CalendarRange, ChevronRight, CircleOff, ListFilter, Search, SendHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useWorkspace } from '../app/WorkspaceContext'
import { ConfirmationDialog, EmptyState, SourceLabel, StatusBadge } from '../components/ui'
import { formatDate, taipeiDay } from '../utils/format'

type DialogAction = 'confirm' | 'reschedule' | 'cancel' | undefined

export function Appointments() {
  const { state, setActiveCaseId, updateStatus, requestReschedule } = useWorkspace()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState(params.get('status') || 'all')
  const [date, setDate] = useState(params.get('date') === 'today' ? taipeiDay() : '')
  const [selectedId, setSelectedId] = useState<string>()
  const [dialog, setDialog] = useState<DialogAction>()
  const [rescheduleDate, setRescheduleDate] = useState(taipeiDay(1))
  const [reason, setReason] = useState('顧客原偏好時段無法安排，提出新的示範時段。')
  const rows = useMemo(() => state.appointments.filter((appointment) => {
    const item = state.cases.find((candidate) => candidate.id === appointment.caseId)
    const text = [item?.caseCode, item?.needs.painPoints.join(' '), appointment.storeId].join(' ').toLowerCase()
    return (!query || text.includes(query.toLowerCase())) && (status === 'all' || appointment.status === status) && (!date || appointment.preferredDate === date)
  }).map((appointment) => ({ appointment, case: state.cases.find((item) => item.id === appointment.caseId)! })), [date, query, state, status])
  const selected = rows.find((row) => row.case.id === selectedId) ?? rows[0]
  useEffect(() => { if (selected) setActiveCaseId(selected.case.id) }, [selected, setActiveCaseId])
  const openDetails = (caseId: string) => { setSelectedId(caseId); setActiveCaseId(caseId) }
  const updateFilters = (nextStatus: string) => { setStatus(nextStatus); setParams(nextStatus === 'all' ? {} : { status: nextStatus }) }
  const perform = () => {
    if (!selected || !dialog) return
    if (dialog === 'confirm') updateStatus(selected.case.id, 'confirmed', `已確認 ${selected.case.caseCode} 的示範預約。`)
    if (dialog === 'reschedule') requestReschedule(selected.case.id, rescheduleDate, reason)
    if (dialog === 'cancel') updateStatus(selected.case.id, 'cancelled', `已取消案件：${reason || '未填原因'}`)
    setDialog(undefined)
  }
  const beginPreparation = () => { if (selected && updateStatus(selected.case.id, 'preparing', '已開始準備案件，請補齊需求與商品比較。')) navigate(`/advisor/customers?case=${selected.case.caseCode}`) }
  return <div className="page"><div className="page-heading"><div><span className="eyebrow">APPOINTMENT QUEUE</span><h1>預約管理</h1><p>接收、確認與安排事前準備。聯絡資料僅能由正式 Connected mode 的授權人員讀取。</p></div><SourceLabel source="customer_netlify" /></div><section className="filter-bar"><label><Search size={16} /><span className="sr-only">搜尋預約</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="案件編號、困擾、示範門市" /></label><label><ListFilter size={16} /><span className="sr-only">狀態篩選</span><select value={status} onChange={(event) => updateFilters(event.target.value)}><option value="all">所有狀態</option><option value="requested">待確認</option><option value="confirmed">已確認</option><option value="preparing">準備中</option><option value="prepared">準備完成</option><option value="reschedule_requested">待回覆改期</option><option value="served">已服務</option></select></label><label><CalendarRange size={16} /><span className="sr-only">日期篩選</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>{(query || status !== 'all' || date) && <button className="text-button" onClick={() => { setQuery(''); setStatus('all'); setDate(''); setParams({}) }}>清除篩選</button>}</section><div className="split-view"><section className="panel table-panel"><div className="panel__heading"><div><h2>預約清單</h2><p>{rows.length} 筆符合條件的示範案件</p></div><span className="view-label">列表／詳情</span></div>{rows.length ? <div className="data-table-wrap"><table><thead><tr><th>案件</th><th>申請／偏好時段</th><th>示範門市</th><th>主要困擾</th><th>狀態</th><th><span className="sr-only">操作</span></th></tr></thead><tbody>{rows.map(({ appointment, case: item }) => <tr className={selected?.case.id === item.id ? 'is-selected' : ''} key={appointment.id}><td><strong>{item.caseCode}</strong><small>{formatDate(item.createdAt)}</small></td><td>{appointment.preferredDate}<small>{appointment.preferredPeriod}</small></td><td>{appointment.storeId.replace('demo-', '示範 ')}</td><td>{item.needs.painPoints[0]}</td><td><StatusBadge status={appointment.status} /></td><td><button className="icon-button" onClick={() => openDetails(item.id)} aria-label={`查看 ${item.caseCode} 詳情`}><ChevronRight size={18} /></button></td></tr>)}</tbody></table></div> : <EmptyState title="沒有符合的預約" body="案件編號必須存在；請調整搜尋、狀態或日期篩選。" />}</section>{selected && <aside className="detail-panel"><div className="detail-panel__head"><div><span className="eyebrow">{selected.case.caseCode}</span><h2>預約摘要</h2></div><StatusBadge status={selected.appointment.status} /></div><dl className="detail-list"><div><dt>偏好時段</dt><dd>{selected.appointment.preferredDate}・{selected.appointment.preferredPeriod}</dd></div><div><dt>示範門市</dt><dd>{selected.appointment.storeId.replace('demo-', '示範 ')}</dd></div><div><dt>主要困擾</dt><dd>{selected.case.needs.painPoints.join('、')}</dd></div><div><dt>資料來源</dt><dd><SourceLabel source={selected.case.source} /></dd></div><div><dt>聯絡資料</dt><dd className="muted">Mock mode 不顯示，正式模式須授權。</dd></div></dl><div className="detail-actions">{selected.case.status === 'requested' && <button className="button" onClick={() => setDialog('confirm')}><CalendarCheck2 size={16} />確認預約</button>}{['requested', 'confirmed'].includes(selected.case.status) && <button className="button button--secondary" onClick={() => setDialog('reschedule')}><SendHorizontal size={16} />提出改期</button>}{selected.case.status === 'confirmed' && <button className="button" onClick={beginPreparation}>開始準備</button>}{selected.case.status === 'preparing' && <button className="button" onClick={() => updateStatus(selected.case.id, 'prepared', '已標記準備完成，等候諮詢。')}>標記準備完成</button>}{['requested', 'confirmed', 'preparing', 'prepared', 'reschedule_requested'].includes(selected.case.status) && <button className="button button--danger" onClick={() => setDialog('cancel')}><CircleOff size={16} />取消</button>}</div><button className="text-button" onClick={() => { setActiveCaseId(selected.case.id); navigate(`/advisor/customers?case=${selected.case.caseCode}`) }}>查看原始問卷與 AI 建議 <ChevronRight size={15} /></button></aside>}</div>{dialog && selected && <ConfirmationDialog title={dialog === 'confirm' ? '確認示範預約？' : dialog === 'reschedule' ? '提出改期建議' : '取消這筆示範預約？'} body={dialog === 'confirm' ? '狀態會從「待確認」變為「已確認」，並寫入操作歷程；不代表真實預約已成立。' : dialog === 'reschedule' ? '僅記錄店員提出的建議，不會假稱顧客已同意。' : '取消原因會保留在此瀏覽器的示範操作歷程。'} confirmLabel={dialog === 'confirm' ? '確認預約' : dialog === 'reschedule' ? '送出改期建議' : '確認取消'} onCancel={() => setDialog(undefined)} onConfirm={perform}>{dialog !== 'confirm' && <div className="dialog__fields">{dialog === 'reschedule' && <label>建議日期<input type="date" value={rescheduleDate} onChange={(event) => setRescheduleDate(event.target.value)} min={taipeiDay()} /></label>}<label>{dialog === 'cancel' ? '取消原因' : '改期原因'}<textarea value={reason} onChange={(event) => setReason(event.target.value)} required /></label></div>}</ConfirmationDialog>}</div>
}
