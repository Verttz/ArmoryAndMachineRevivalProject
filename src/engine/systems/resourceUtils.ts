import type { ResourceState } from '../../types';

/**
 * Utility functions for resource operations.
 * Handle clamping, adding, subtracting, and validation of resource values.
 */

/**
 * Clamp a resource value between 0 and its capacity.
 * @param current Current amount
 * @param cap Maximum capacity (-1 means unlimited)
 * @returns Clamped value
 */
export function clampResourceValue(current: number, cap: number): number {
  const min = 0;
  const max = cap === -1 ? Infinity : cap;
  return Math.max(min, Math.min(current, max));
}

/**
 * Add an amount to a resource and clamp the result.
 * @param resource The resource state to modify
 * @param amount The amount to add (can be negative)
 * @returns The new amount after addition and clamping
 */
export function addResource(resource: ResourceState, amount: number): number {
  const newAmount = resource.amount + amount;
  resource.amount = clampResourceValue(newAmount, resource.cap);
  return resource.amount;
}

/**
 * Subtract an amount from a resource and clamp the result.
 * Returns whether the operation was successful (had enough resources).
 * @param resource The resource state to modify
 * @param amount The amount to subtract
 * @returns { success: boolean, amountRemoved: number }
 */
export function subtractResource(
  resource: ResourceState,
  amount: number
): { success: boolean; amountRemoved: number } {
  if (amount < 0) {
    throw new Error('Cannot subtract a negative amount');
  }

  if (resource.amount >= amount) {
    resource.amount -= amount;
    return { success: true, amountRemoved: amount };
  }

  // Not enough resources - return what we could remove
  const amountRemoved = resource.amount;
  resource.amount = 0;
  return { success: false, amountRemoved };
}

/**
 * Set a resource to a specific amount directly (with clamping).
 * @param resource The resource state to modify
 * @param newAmount The new amount
 * @returns The actual amount set after clamping
 */
export function setResource(resource: ResourceState, newAmount: number): number {
  resource.amount = clampResourceValue(newAmount, resource.cap);
  return resource.amount;
}

/**
 * Check if a resource has enough of a given amount.
 * @param resource The resource state to check
 * @param requiredAmount The amount needed
 * @returns true if resource has at least requiredAmount
 */
export function hasEnoughResource(
  resource: ResourceState,
  requiredAmount: number
): boolean {
  return resource.amount >= requiredAmount;
}

/**
 * Get the effective per-tick change for a resource.
 * This combines the rate (per-tick change) with clamping considerations.
 * @param resource The resource state
 * @returns The per-tick change value
 */
export function getPerTickChange(resource: ResourceState): number {
  return resource.rate;
}

/**
 * Set the per-tick change rate for a resource.
 * @param resource The resource state to modify
 * @param rate The new per-tick change rate
 */
export function setPerTickChange(resource: ResourceState, rate: number): void {
  resource.rate = rate;
}

/**
 * Apply per-tick changes and clamp the result.
 * Called each game tick to advance resource amounts.
 * @param resource The resource state to update
 * @returns The amount after applying per-tick change
 */
export function applyPerTickChange(resource: ResourceState): number {
  const newAmount = resource.amount + resource.rate;
  resource.amount = clampResourceValue(newAmount, resource.cap);
  return resource.amount;
}
