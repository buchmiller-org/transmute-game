/**
 * Economy — Manages the player's Elemental Dust wallet and expansion costs.
 */

export class Economy {
  constructor() {
    this.dust = 0;
    this.crowns = 0;
    this.expansionsBought = 0;
    this.cartSlotsBought = 0;
    this.vaultExpansionsBought = 0;
    this.vaultStackLevel = 1;
    this.discoveredFloraT4 = false;
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

  unlockFloraT4() {
    if (!this.discoveredFloraT4) {
      this.discoveredFloraT4 = true;
      this.notify();
    }
  }

  getCartExpansionCost() {
    const costs = [200, 750, 2000];
    if (this.cartSlotsBought < costs.length) {
      return costs[this.cartSlotsBought];
    }
    return null; // Max level reached
  }

  buyCartExpansion() {
    const cost = this.getCartExpansionCost();
    if (cost !== null && this.spendDust(cost)) {
      this.cartSlotsBought++;
      this.notify();
      return true;
    }
    return false;
  }

  getCartSlots() {
    return 2 + this.cartSlotsBought;
  }

  addCrowns(amount) {
    this.crowns += amount;
    this.notify();
  }

  getVaultSlots() {
    // Starts at 6, expands by 2 each purchase
    return 6 + (this.vaultExpansionsBought * 2);
  }

  getVaultExpansionCost() {
    const costs = [200, 350, 550, 800, 1200, 1800, 2800, 4200, 6500];
    if (this.vaultExpansionsBought < costs.length) {
      return costs[this.vaultExpansionsBought];
    }
    return null; // Max expansions reached
  }

  buyVaultExpansion() {
    const cost = this.getVaultExpansionCost();
    if (cost !== null && this.spendDust(cost)) {
      this.vaultExpansionsBought++;
      this.notify();
      return true;
    }
    return false;
  }

  getVaultStackLimit() {
    return this.vaultStackLevel === 1 ? 3 : 5; // Level 1: 3, Level 2: 5
  }

  getVaultStackUpgradeCost() {
    return this.vaultStackLevel === 1 ? 500 : null; // Only one upgrade right now
  }

  buyVaultStackUpgrade() {
    const cost = this.getVaultStackUpgradeCost();
    if (cost !== null && this.spendDust(cost)) {
      this.vaultStackLevel++;
      this.notify();
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
