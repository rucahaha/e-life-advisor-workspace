import { Bell, Bot, CalendarDays, ClipboardList, House, LayoutDashboard, Menu, PackageSearch, RotateCcw, UsersRound, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useWorkspace } from '../app/WorkspaceContext'
import { AiAssistantPanel } from './AiAssistantPanel'
import { Toast } from './ui'

const navItems = [
  { to: '/advisor/dashboard', label: '工作總覽', icon: LayoutDashboard },
  { to: '/advisor/appointments', label: '預約管理', icon: CalendarDays },
  { to: '/advisor/customers', label: '顧客需求', icon: UsersRound },
  { to: '/advisor/products', label: '商品與知識', icon: PackageSearch },
  { to: '/advisor/records', label: '服務紀錄', icon: ClipboardList },
]

export function AppShell({ children }: { children: ReactNode }) {
  const { state, mode, setMode, resetDemo, toast, dismissToast } = useWorkspace()
  const [aiOpen, setAiOpen] = useState(true)
  const [navOpen, setNavOpen] = useState(false)
  const notificationCount = state.cases.filter((item) => item.status === 'requested' || item.status === 'reschedule_requested').length
  return <div className={`app-layout ${aiOpen ? 'app-layout--ai-open' : ''}`}><header className="topbar"><button className="icon-button mobile-menu" aria-label="開啟導覽選單" onClick={() => setNavOpen(true)}><Menu size={21} /></button><Link className="brand" to="/"><span className="brand__mark">E</span><span><strong>E-Life Advisor</strong><small>Workspace</small></span></Link><div className="topbar__search"> <PackageSearch size={17} /><span>以案件編號、困擾或商品搜尋</span></div><div className="topbar__actions"><button className="mode-switch" type="button" onClick={() => setMode(mode === 'mock' ? 'connected' : 'mock')} aria-label="查看資料模式"><span />{mode === 'mock' ? 'DEMO／Mock' : 'Connected'}</button><button className="notification-button" aria-label={`${notificationCount} 筆待處理通知`}><Bell size={19} />{notificationCount > 0 && <b>{notificationCount}</b>}</button><span className="staff-avatar" aria-label="示範店員 Lin">L</span></div></header><aside className={`sidebar ${navOpen ? 'sidebar--open' : ''}`} aria-label="主要導覽"><div className="sidebar__mobile-head"><strong>功能選單</strong><button className="icon-button" onClick={() => setNavOpen(false)} aria-label="關閉選單"><X size={20} /></button></div><nav>{navItems.map(({ to, label, icon: Icon }) => <NavLink to={to} key={to} className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`} onClick={() => setNavOpen(false)}><Icon size={19} /><span>{label}</span></NavLink>)}</nav><div className="sidebar__footer"><span className="source-label">學生競賽概念原型</span><button className="text-button" onClick={resetDemo}><RotateCcw size={15} />重設示範資料</button><Link className="text-button" to="/"><House size={15} />返回展示入口</Link><small>目前資料只儲存在此瀏覽器的 localStorage，不會與顧客端同步。</small></div></aside>{navOpen && <button className="scrim" aria-label="關閉導覽選單" onClick={() => setNavOpen(false)} />}<main className="workspace-main">{children}</main>{!aiOpen && <button className="ai-fab" onClick={() => setAiOpen(true)}><Bot size={19} />開啟 AI 助手</button>}<AiAssistantPanel open={aiOpen} onClose={() => setAiOpen(false)} /><Toast message={toast} onDismiss={dismissToast} /></div>
}
