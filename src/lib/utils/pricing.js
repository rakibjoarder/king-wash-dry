/**
 * Calculate additional costs for laundry services
 * @param {Object} prefs - Laundry preferences object
 * @param {number} weight - Weight in pounds
 * @returns {number} - Total additional cost
 */
export function calculateAdditionalCosts(prefs, weight) {
  let cost = 0;
  
  // Hypoallergenic detergent costs extra
  if (prefs.detergent === 'hypoallergenic') {
    cost += 0.25 * weight; // $0.25 per pound
  }
  
  // Additional services
  if (prefs.additionalServices.babyCare) cost += 0.2 * weight;
  if (prefs.additionalServices.bleach) cost += 0.2 * weight;
  if (prefs.additionalServices.darkProtect) cost += 0.2 * weight;
  if (prefs.additionalServices.fabricSoftener) cost += 0.2 * weight;
  if (prefs.additionalServices.scentBooster) cost += 0.2 * weight;
  
  // Hanging service is per item (estimated at $0.35 each)
  if (prefs.additionalServices.hangingService) {
    // Estimate number of items based on weight
    const estimatedItems = Math.ceil(weight / 0.5); // Rough estimate
    cost += estimatedItems * 0.35;
  }
  
  return cost;
}

/**
 * Get a detailed breakdown of additional service costs
 * @param {Object} prefs - Laundry preferences object
 * @param {number} weight - Weight in pounds
 * @returns {Array} - Array of service cost objects
 */
export function getAdditionalServicesCostBreakdown(prefs, weight) {
  const breakdown = [];
  
  if (prefs.detergent === 'hypoallergenic') {
    breakdown.push({
      name: 'Hypoallergenic Detergent',
      cost: 0.25 * weight
    });
  }
  
  if (prefs.additionalServices.babyCare) {
    breakdown.push({
      name: 'Baby Care',
      cost: 0.2 * weight
    });
  }
  
  if (prefs.additionalServices.bleach) {
    breakdown.push({
      name: 'Bleach',
      cost: 0.2 * weight
    });
  }
  
  if (prefs.additionalServices.darkProtect) {
    breakdown.push({
      name: 'Dark Protect',
      cost: 0.2 * weight
    });
  }
  
  if (prefs.additionalServices.fabricSoftener) {
    breakdown.push({
      name: 'Fabric Softener',
      cost: 0.2 * weight
    });
  }
  
  if (prefs.additionalServices.scentBooster) {
    breakdown.push({
      name: 'Scent Booster',
      cost: 0.2 * weight
    });
  }
  
  if (prefs.additionalServices.hangingService) {
    const estimatedItems = Math.ceil(weight / 0.5);
    breakdown.push({
      name: 'Hanging Service',
      cost: estimatedItems * 0.35
    });
  }
  
  return breakdown;
} 