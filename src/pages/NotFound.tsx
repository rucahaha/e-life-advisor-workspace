import { ArrowLeft, MapPinOff } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFound() {
  return <main className="not-found"><MapPinOff size={38} /><span className="eyebrow">404／示範路徑不存在</span><h1>找不到這個頁面</h1><p>GitHub Pages 使用 HashRouter；請從展示入口或店員工作台重新開始。</p><Link className="button" to="/"><ArrowLeft size={16} />返回展示入口</Link></main>
}
