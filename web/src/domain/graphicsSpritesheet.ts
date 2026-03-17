export interface AtlasFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  pivotX: number;
  pivotY: number;
}

export const graphicsSpritesheetSize = {
  width: 1024,
  height: 1024,
} as const;

export const graphicsSpritesheetHref = "/assets/graphics-spritesheet.webp";

// The dial body keeps the same visible crop, but lives deeper inside the spritesheet so the
// source file has breathing room for repainting. Moving parts are grouped into a denser right-side
// cluster so the sheet is easier to scan and later repaint.
export const graphicsSpritesheetFrames = {
  arrow1: { x: 780, y: 670, width: 61, height: 253, pivotX: 29.2, pivotY: 154.3 },
  arrow2: { x: 848, y: 670, width: 55, height: 264, pivotX: 26.25, pivotY: 159.6 },
  arrow3: { x: 910, y: 670, width: 41, height: 256, pivotX: 20.35, pivotY: 178.1 },
  arrow4: { x: 958, y: 670, width: 50, height: 286, pivotX: 24.5, pivotY: 179.4 },
  device: { x: 20, y: 20, width: 549, height: 593, pivotX: 274.5, pivotY: 313.15 },
  glare: { x: 640, y: 20, width: 328, height: 328, pivotX: 164.45, pivotY: 165.4 },
  wheelIdle: { x: 640, y: 360, width: 211, height: 115, pivotX: 107.65, pivotY: 98 },
  wheelActive: { x: 640, y: 475, width: 211, height: 115, pivotX: 107.65, pivotY: 98 },
} satisfies Record<string, AtlasFrame>;
