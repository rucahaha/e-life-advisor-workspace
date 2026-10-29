import type { Appointment, AppointmentFilters, CaseActivity, CaseFilters, CaseStatus, ConsultationCase, MockState, Product, ProductFilters, ServiceRecord } from '../types/domain'
import { createInitialState } from '../data/mockData'
import { assertTransition } from './statusMachine'

const STORAGE_KEY = 'e-life-advisor:mock-state:v1'
const now = () => new Date().toISOString()
const id = (prefix: string) => `${prefix}-${crypto.randomUUID()}`

export interface WorkspaceRepository {
  getState(): MockState
  reset(): MockState
  listCases(filters?: CaseFilters): ConsultationCase[]
  getCase(idOrCode: string): ConsultationCase | undefined
  listAppointments(filters?: AppointmentFilters): Appointment[]
  listProducts(filters?: ProductFilters): Product[]
  updateStatus(caseId: string, status: CaseStatus, message: string): MockState
  requestReschedule(caseId: string, preferredDate: string, reason: string): MockState
  updateChecklist(caseId: string, checklist: ConsultationCase['checklist']): MockState
  attachProducts(caseId: string, productIds: string[]): MockState
  savePreparationNote(caseId: string, note: string): MockState
  saveRecord(record: ServiceRecord): MockState
  activitiesForCase(caseId: string): CaseActivity[]
}

const matchesCase = (item: ConsultationCase, filters?: CaseFilters) => {
  if (!filters) return true
  const query = filters.query?.trim().toLowerCase()
  const queryMatch = !query || [item.caseCode, item.personaType, ...item.needs.painPoints].join(' ').toLowerCase().includes(query)
  return queryMatch && (!filters.status || filters.status === 'all' || item.status === filters.status)
    && (!filters.persona || filters.persona === 'all' || item.personaType === filters.persona)
}

const matchesProduct = (item: Product, filters?: ProductFilters) => {
  if (!filters) return true
  const query = filters.query?.trim().toLowerCase()
  const queryMatch = !query || [item.brand, item.model, item.category, ...item.features].join(' ').toLowerCase().includes(query)
  const categoryMatch = !filters.category || filters.category === 'all' || item.category === filters.category
  const price = item.priceTwd ?? Infinity
  const budgetMatch = !filters.budget || filters.budget === 'all'
    || (filters.budget === 'under5000' && price < 5000)
    || (filters.budget === '5000to10000' && price >= 5000 && price <= 10000)
    || (filters.budget === 'over10000' && price > 10000)
  return queryMatch && categoryMatch && budgetMatch
}

export class LocalStorageRepository implements WorkspaceRepository {
  private state: MockState

  constructor() {
    this.state = this.read()
  }

  private read(): MockState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) as MockState : createInitialState()
    } catch {
      return createInitialState()
    }
  }

  private commit(state: MockState) {
    this.state = state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return state
  }

  getState = () => structuredClone(this.state)

  reset = () => this.commit(createInitialState())

  listCases = (filters?: CaseFilters) => this.state.cases.filter((item) => matchesCase(item, filters)).map((item) => structuredClone(item))

  getCase = (idOrCode: string) => {
    const item = this.state.cases.find((candidate) => candidate.id === idOrCode || candidate.caseCode === idOrCode)
    return item ? structuredClone(item) : undefined
  }

  listAppointments = (filters?: AppointmentFilters) => this.state.appointments.filter((item) => {
    const related = this.state.cases.find((candidate) => candidate.id === item.caseId)
    const query = filters?.query?.trim().toLowerCase()
    const queryMatch = !query || [related?.caseCode, related?.needs.painPoints.join(' '), item.storeId].join(' ').toLowerCase().includes(query)
    return queryMatch && (!filters?.status || filters.status === 'all' || item.status === filters.status)
      && (!filters?.date || item.preferredDate === filters.date)
  }).map((item) => structuredClone(item))

  listProducts = (filters?: ProductFilters) => this.state.products.filter((item) => matchesProduct(item, filters)).map((item) => structuredClone(item))

  updateStatus = (caseId: string, status: CaseStatus, message: string) => {
    const target = this.state.cases.find((item) => item.id === caseId)
    if (!target) throw new Error('找不到案件')
    assertTransition(target.status, status)
    const updatedAt = now()
    const next: MockState = {
      ...this.state,
      cases: this.state.cases.map((item) => item.id === caseId ? { ...item, status, updatedAt } : item),
      appointments: this.state.appointments.map((item) => item.caseId === caseId ? {
        ...item,
        status,
        ...(status === 'confirmed' ? { confirmedDateTime: `${item.preferredDate}T14:00:00+08:00` } : {}),
      } : item),
      activities: [{ id: id('activity'), caseId, kind: 'status', message, createdAt: updatedAt, actorLabel: '示範店員' }, ...this.state.activities],
    }
    return this.commit(next)
  }

  requestReschedule = (caseId: string, preferredDate: string, reason: string) => {
    const target = this.state.cases.find((item) => item.id === caseId)
    if (!target) throw new Error('找不到案件')
    assertTransition(target.status, 'reschedule_requested')
    const updatedAt = now()
    return this.commit({
      ...this.state,
      cases: this.state.cases.map((item) => item.id === caseId ? { ...item, status: 'reschedule_requested', updatedAt } : item),
      appointments: this.state.appointments.map((item) => item.caseId === caseId ? { ...item, status: 'reschedule_requested', preferredDate, rescheduleReason: reason } : item),
      activities: [{ id: id('activity'), caseId, kind: 'reschedule', message: `已提出改期至 ${preferredDate}：${reason}`, createdAt: updatedAt, actorLabel: '示範店員' }, ...this.state.activities],
    })
  }

  updateChecklist = (caseId: string, checklist: ConsultationCase['checklist']) => {
    const next = { ...this.state, cases: this.state.cases.map((item) => item.id === caseId ? { ...item, checklist, updatedAt: now() } : item) }
    return this.commit(next)
  }

  attachProducts = (caseId: string, productIds: string[]) => {
    const target = this.getCase(caseId)
    if (!target) throw new Error('找不到案件')
    const attachedProductIds = [...new Set([...target.attachedProductIds, ...productIds])]
    const next = {
      ...this.state,
      cases: this.state.cases.map((item) => item.id === caseId ? { ...item, attachedProductIds, updatedAt: now() } : item),
      activities: [{ id: id('activity'), caseId, kind: 'product', message: `已加入 ${productIds.length} 項示範商品至準備清單。`, createdAt: now(), actorLabel: '示範店員' }, ...this.state.activities],
    }
    return this.commit(next)
  }

  savePreparationNote = (caseId: string, note: string) => this.commit({
    ...this.state,
    cases: this.state.cases.map((item) => item.id === caseId ? { ...item, preparationNote: note, updatedAt: now() } : item),
  })

  saveRecord = (record: ServiceRecord) => {
    const exists = this.state.records.some((item) => item.id === record.id)
    const next = {
      ...this.state,
      records: exists ? this.state.records.map((item) => item.id === record.id ? record : item) : [record, ...this.state.records],
      activities: [{ id: id('activity'), caseId: record.caseId, kind: 'record', message: '已儲存一筆顧問服務紀錄。', createdAt: now(), actorLabel: '示範店員' }, ...this.state.activities],
    }
    return this.commit(next)
  }

  activitiesForCase = (caseId: string) => this.state.activities.filter((item) => item.caseId === caseId).map((item) => structuredClone(item))
}

/** Remote mode only declares the boundary. A real implementation must use an authenticated backend. */
export class RemoteRepository implements WorkspaceRepository {
  private unsupported(): never { throw new Error('尚未設定受權限控管的遠端資料服務，已維持示範資料模式。') }
  getState(): MockState { return this.unsupported() }
  reset(): MockState { return this.unsupported() }
  listCases(): ConsultationCase[] { return this.unsupported() }
  getCase(): ConsultationCase | undefined { return this.unsupported() }
  listAppointments(): Appointment[] { return this.unsupported() }
  listProducts(): Product[] { return this.unsupported() }
  updateStatus(): MockState { return this.unsupported() }
  requestReschedule(): MockState { return this.unsupported() }
  updateChecklist(): MockState { return this.unsupported() }
  attachProducts(): MockState { return this.unsupported() }
  savePreparationNote(): MockState { return this.unsupported() }
  saveRecord(): MockState { return this.unsupported() }
  activitiesForCase(): CaseActivity[] { return this.unsupported() }
}
