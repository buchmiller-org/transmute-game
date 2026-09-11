/**
 * Economy — Manages the player's Elemental Dust wallet and expansion costs.
 */

export class Economy {
  constructor() {
    this.dust = 0;
    this.expansionsBought = 0;
    this.listeners = [];
  }

  /**
   * Add dust to the wallet.
   * @param {number} amount 
   */
  addDust(amount) {
    this.dust += amount;
    this.notify();
  }

  /**
   * Attempt to spend dust.
   * @param {number} amount 
   * @returns {boolean} True if successful, false if insufficient funds.
   */
  spendDust(amount) {
    if (this.dust >= amount) {
      this.dust -= amount;
      this.notify();
      return true;
    }
    return false;
  }

  /**
   * Get the cost of unlocking a cobwebbed tile.
   */
  getCobwebCost() {
    return 30;
  }

  /**
   * Calculate the cost of the next grid expansion tile.
   * Formula: floor(50 × 1.4^n) where n = expansions already bought.
   */
  getExpansionCost() {
    return Math.floor(50 * Math.pow(1.4, this.expansionsBought));
  }

  /**
   * Attempt to buy a grid expansion.
   * @returns {boolean} True if successful.
   */
  buyExpansion() {
    const cost = this.getExpansionCost();
    if (this.spendDust(cost)) {
      this.expansionsBought++;
      this.notify(); // Re-notify so listeners can update displayed costs
      return true;
    }
    return false;
  }

  /**
   * Subscribe to wallet changes.
   * @param {function} cb Callback receives (dust, economyInstance)
   */
  onUpdate(cb) {
    this.listeners.push(cb);
    cb(this.dust, this); // initial call
  }

  notify() {
    for (const cb of this.listeners) {
      cb(this.dust, this);
    }
  }
}
