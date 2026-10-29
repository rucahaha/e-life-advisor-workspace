export type CaseStatus =
  | 'requested'
  | 'confirmed'
  | 'preparing'
  | 'prepared'
  | 'served'
  | 'closed'
  | 'cancelled'
  | 'reschedule_requested'
  | 'unreachable'

export type SourceType = 'demo' | 'public' | 'authorized_internal'
export type AppMode = 'mock' | 'connected'
export type CaseSource = 'customer_netlify' | 'manual_demo' | 'import'

export interface CustomerNeeds {
  petTypes: string[]
  petCount?: number
  aloneHours?: string
  painPoints: string[]
  budgetRange: string
  existingDevices: string[]
  housingType?: string
  extraNotes?: string
}

export interface ConsultationCase {
  id: string
  caseCode: string
  personaType: string
  needs: CustomerNeeds
  status: CaseStatus
  assignedStaffId?: string
  createdAt: string
  updatedAt: string
  source: CaseSource
  checklist: ChecklistItem[]
  attachedProductIds: string[]
  preparationNote?: string
}

export interface Appointment {
  id: string
  caseId: string
  storeId: string
  preferredDate: string
  preferredPeriod: string
  confirmedDateTime?: string
  status: CaseStatus
  contactReference?: string
  consentRecordedAt?: string
  rescheduleReason?: string
}

export interface Product {
  id: string
  brand: string
  model: string
  category: ProductCategory
  features: string[]
  specs: Record<string, string>
  priceTwd?: number
  warrantyNote?: string
  inventoryNote?: string
  sourceType: SourceType
  lastVerifiedAt?: string
}

export type ProductCategory = '空氣品質' | '地板清潔' | '居家監控' | '智慧照明' | '智慧生活'

export interface ServiceRecord {
  id: string
  caseId: string
  staffId?: string
  happenedAt: string
  summary: string
  recommendedProductIds: string[]
  outcome: string
  followUpItems: string[]
  aiDraft?: string
  staffConfirmed: boolean
}

export interface CaseActivity {
  id: string
  caseId: string
  kind: string
  message: string
  createdAt: string
  actorLabel: string
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface MockState {
  cases: ConsultationCase[]
  appointments: Appointment[]
  products: Product[]
  records: ServiceRecord[]
  activities: CaseActivity[]
}

export interface CaseFilters {
  query?: string
  status?: CaseStatus | 'all'
  persona?: string | 'all'
}

export interface AppointmentFilters {
  query?: string
  status?: CaseStatus | 'all'
  date?: string
}

export interface ProductFilters {
  query?: string
  category?: ProductCategory | 'all'
  budget?: 'all' | 'under5000' | '5000to10000' | 'over10000'
}

export type AssistantPage = 'dashboard' | 'appointments' | 'customers' | 'products' | 'records'

export interface AssistantReply {
  title: string
  body: string
  source: string
  limitations: string
}
