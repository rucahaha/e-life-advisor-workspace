import type { CaseStatus } from '../types/domain'

const transitions: Record<CaseStatus, CaseStatus[]> = {
  requested: ['confirmed', 'reschedule_requested', 'cancelled', 'unreachable'],
  confirmed: ['preparing', 'reschedule_requested', 'cancelled', 'unreachable'],
  preparing: ['prepared', 'cancelled'],
  prepared: ['served', 'cancelled'],
  served: ['closed'],
  closed: [],
  cancelled: [],
  reschedule_requested: ['confirmed', 'cancelled', 'unreachable'],
  unreachable: ['requested', 'cancelled'],
}

export const canTransition = (from: CaseStatus, to: CaseStatus) => transitions[from].includes(to)

export const assertTransition = (from: CaseStatus, to: CaseStatus) => {
  if (!canTransition(from, to)) throw new Error(`不允許從 ${from} 轉為 ${to}`)
}
