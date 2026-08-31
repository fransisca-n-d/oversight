export function calculateProjectHealth(
  cpi: number,
  spi: number
) {
  if (cpi < 0.9 || spi < 0.9) {
    return "Critical";
  }

  if (cpi < 1 || spi < 1) {
    return "Watch";
  }

  return "Healthy";
}