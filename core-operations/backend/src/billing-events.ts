// Stripe does not guarantee webhook order, so an older subscription event must never override a newer one.
export function isStaleBillingEvent(eventCreated: unknown, latestAppliedEventCreated: unknown) {
  return typeof eventCreated === 'number'
    && Number.isFinite(eventCreated)
    && typeof latestAppliedEventCreated === 'number'
    && Number.isFinite(latestAppliedEventCreated)
    && eventCreated < latestAppliedEventCreated
}
