export function calculateCPI(
  earnedValue: number,
  actualCost: number
) {
  return earnedValue / actualCost;
}

export function calculateSPI(
  earnedValue: number,
  plannedValue: number
) {
  return earnedValue / plannedValue;
}

export function calculateEAC(
  bac: number,
  cpi: number
) {
  return bac / cpi;
}