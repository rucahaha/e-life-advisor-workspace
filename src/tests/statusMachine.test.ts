import { describe, expect, it } from 'vitest'
import { canTransition } from '../services/statusMachine'

describe('appointment status machine', () => {
  it('only confirms an unconfirmed request', () => {
    expect(canTransition('requested', 'confirmed')).toBe(true)
    expect(canTransition('prepared', 'confirmed')).toBe(false)
  })

  it('keeps reschedule as a request, not a confirmed booking', () => {
    expect(canTransition('requested', 'reschedule_requested')).toBe(true)
    expect(canTransition('reschedule_requested', 'confirmed')).toBe(true)
  })
})
