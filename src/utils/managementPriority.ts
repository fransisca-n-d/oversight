export function calculateManagementPriority(
  cpi: number,
  spi: number,
  cpiTrend: string,
  spiTrend: string,
  forecastVariancePercent: number
) {
  let score = 0;

  if (cpi < 0.9) score += 2;
  else if (cpi < 1) score += 1;

  if (spi < 0.9) score += 2;
  else if (spi < 1) score += 1;

  if (cpiTrend === "Deteriorating") score += 2;
  if (spiTrend === "Deteriorating") score += 2;

  if (forecastVariancePercent >= 15) score += 2;
  else if (forecastVariancePercent >= 5) score += 1;

  if (score >= 5) return "High";
  if (score >= 2) return "Medium";

  return "Low";
}