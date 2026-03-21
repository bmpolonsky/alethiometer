export const DIAL_GEOMETRY = {
  width: 549,
  height: 593,
  centerX: 275,
  centerY: 315,
  ringInnerRadius: 179,
  ringOuterRadius: 229,
  progressRadius: 156,
};

export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleDeg: number,
) {
  const radians = ((angleDeg - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(radians),
    y: centerY + radius * Math.sin(radians),
  };
}

export function describeRingSlice(
  centerX: number,
  centerY: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
) {
  const outerStart = polarToCartesian(centerX, centerY, outerRadius, startAngle);
  const outerEnd = polarToCartesian(centerX, centerY, outerRadius, endAngle);
  const innerStart = polarToCartesian(centerX, centerY, innerRadius, endAngle);
  const innerEnd = polarToCartesian(centerX, centerY, innerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerEnd.x} ${innerEnd.y}`,
    "Z",
  ].join(" ");
}

export function pointToSymbolIndex(x: number, y: number) {
  const dx = x - DIAL_GEOMETRY.centerX;
  const dy = y - DIAL_GEOMETRY.centerY;
  const radius = Math.hypot(dx, dy);

  if (
    radius < DIAL_GEOMETRY.ringInnerRadius - 40 ||
    radius > DIAL_GEOMETRY.ringOuterRadius + 50
  ) {
    return null;
  }

  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const normalized = (angle + 90 + 360) % 360;

  return Math.round(normalized / 10) % 36;
}
