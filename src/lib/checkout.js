/**
 * Card checkout used to run through a hosted payments function.
 * This standalone build has no payment processor configured, so card
 * charges are not created. Crypto donation addresses still work.
 */
export async function createCardCheckout({ amount } = {}) {
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) {
    return { ok: false, error: 'Enter a valid amount' };
  }

  return {
    ok: false,
    error: 'Card checkout is not configured in this build. Donate with crypto instead.',
  };
}
