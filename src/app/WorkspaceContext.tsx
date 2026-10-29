import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { LocalStorageRepository } from '../services/repository'
import type { AppMode, CaseStatus, ChecklistItem, MockState, ServiceRecord } from '../types/domain'

const repository = new LocalStorageRepository()

interface WorkspaceContextValue {
  state: MockState
  mode: AppMode
  activeCaseId?: string
  toast?: string
  setActiveCaseId: (caseId?: string) => void
  setMode: (mode: AppMode) => void
  updateStatus: (caseId: string, status: CaseStatus, message: string) => boolean
  requestReschedule: (caseId: string, preferredDate: string, reason: string) => boolean
  saveChecklist: (caseId: string, checklist: ChecklistItem[]) => void
  attachProducts: (caseId: string, productIds: string[]) => void
  savePreparationNote: (caseId: string, note: string) => void
  saveRecord: (record: ServiceRecord) => void
  resetDemo: () => void
  dismissToast: () => void
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MockState>(() => repository.getState())
  const [activeCaseId, setActiveCaseId] = useState<string>()
  const [mode, setModeState] = useState<AppMode>('mock')
  const [toast, setToast] = useState<string>()
  const sync = useCallback((next: MockState, message: string) => {
    setState(next)
    setToast(message)
  }, [])

  const updateStatus = useCallback((caseId: string, status: CaseStatus, message: string) => {
    try {
      sync(repository.updateStatus(caseId, status, message), message)
      return true
    } catch (error) {
      setToast(error instanceof Error ? error.message : '狀態更新失敗')
      return false
    }
  }, [sync])

  const value = useMemo<WorkspaceContextValue>(() => ({
    state, mode, activeCaseId, toast,
    setActiveCaseId,
    setMode: (nextMode) => {
      if (nextMode === 'connected') {
        setModeState('mock')
        setToast('尚未設定受權限控管的後端與憑證，已維持 Mock 示範模式。')
      } else {
        setModeState('mock')
        setToast('已切換為 Mock 示範模式。')
      }
    },
    updateStatus,
    requestReschedule: (caseId, preferredDate, reason) => {
      try {
        sync(repository.requestReschedule(caseId, preferredDate, reason), '已記錄改期建議，尚待顧客同意。')
        return true
      } catch (error) {
        setToast(error instanceof Error ? error.message : '改期設定失敗')
        return false
      }
    },
    saveChecklist: (caseId, checklist) => sync(repository.updateChecklist(caseId, checklist), '已儲存待確認清單。'),
    attachProducts: (caseId, productIds) => sync(repository.attachProducts(caseId, productIds), '已將示範商品加入案件準備清單。'),
    savePreparationNote: (caseId, note) => sync(repository.savePreparationNote(caseId, note), '已儲存顧問準備內容。'),
    saveRecord: (record) => sync(repository.saveRecord(record), '已儲存服務紀錄，時間軸已更新。'),
    resetDemo: () => {
      sync(repository.reset(), '示範資料已重設，可重新走一次流程。')
      setActiveCaseId(undefined)
    },
    dismissToast: () => setToast(undefined),
  }), [activeCaseId, mode, state, sync, toast, updateStatus])

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) throw new Error('useWorkspace 必須在 WorkspaceProvider 內使用')
  return context
}
