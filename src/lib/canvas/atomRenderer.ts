import { ElementData } from '../../types/chemistry';

export const CATEGORY_COLORS: Record<string, string> = {
  alkali: '#E06C75',
  alkaline: '#E5C07B',
  transition: '#4FA6E0',
  'post-transition': '#5E9CD4',
  metalloid: '#56B6C2',
  nonmetal: '#98C379',
  halogen: '#C678DD',
  noble: '#E06C9F',
  lanthanide: '#ABB2BF',
  actinide: '#ABB2BF',
};

export interface AtomRenderOptions {
  x: number;
  y: number;
  element: ElementData;
  scale?: number;
  shellRadiusBase?: number;
  valenceElectronsCount?: number;
  shellElectronCounts?: number[];
  rotationAngle?: number;
  ionBadge?: string; // e.g. "Na⁺", "Cl⁻", "δ⁺", "δ⁻"
  showShells?: boolean;
  highlightValence?: boolean;
  opacity?: number;
}

export function drawNucleus(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  element: ElementData,
  radius: number = 26,
  opacity: number = 1
) {
  ctx.save();
  ctx.globalAlpha = opacity;

  const color = CATEGORY_COLORS[element.category] || '#4FA6E0';

  // Nucleus background circle
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#151C28';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.stroke();

  // Element Symbol
  ctx.font = `bold ${Math.round(radius * 0.9)}px 'JetBrains Mono', monospace`;
  ctx.fillStyle = '#F8FAFC';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(element.symbol, x, y - 2);

  // Atomic Number (small subscript/superscript)
  ctx.font = `600 ${Math.round(radius * 0.42)}px 'JetBrains Mono', monospace`;
  ctx.fillStyle = '#94A3B8';
  ctx.fillText(element.atomicNumber.toString(), x, y + radius * 0.58);

  ctx.restore();
}

export function drawBohrShells(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  shells: number[],
  baseRadius: number = 42,
  stepRadius: number = 24,
  rotationAngle: number = 0,
  opacity: number = 1
) {
  ctx.save();
  ctx.globalAlpha = opacity;

  shells.forEach((electronCount, shellIndex) => {
    const r = baseRadius + shellIndex * stepRadius;

    // Draw shell orbit line (faint 1px solid stroke)
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#263345';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.stroke();

    // Draw electrons along this shell orbit
    const isOutermost = shellIndex === shells.length - 1;
    const shellOffset = (shellIndex % 2 === 1 ? Math.PI / electronCount : 0) + rotationAngle * (isOutermost ? 1 : 0.6);

    for (let i = 0; i < electronCount; i++) {
      const angle = shellOffset + (i * 2 * Math.PI) / electronCount;
      const ex = x + Math.cos(angle) * r;
      const ey = y + Math.sin(angle) * r;

      ctx.beginPath();
      ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = isOutermost ? '#FDE047' : '#94A3B8';
      ctx.fill();

      // Sharp electron border
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#0B0F17';
      ctx.stroke();
    }
  });

  ctx.restore();
}

export function drawIonBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  badgeText: string,
  type: 'cation' | 'anion' | 'partial' = 'cation'
) {
  ctx.save();

  const width = badgeText.length > 2 ? 38 : 30;
  const height = 24;
  const bx = x - width / 2;
  const by = y - height / 2;

  // Badge background container
  ctx.fillStyle = type === 'cation' ? '#E06C75' : type === 'anion' ? '#4FA6E0' : '#E5C07B';
  ctx.beginPath();
  ctx.roundRect(bx, by, width, height, 4);
  ctx.fill();

  ctx.strokeStyle = '#0B0F17';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Badge text
  ctx.fillStyle = '#0B0F17';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, x, y + 1);

  ctx.restore();
}

export function drawBondLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  flashProgress: number = 0, // 0 to 1 (max 400ms flash)
  bondType: 'ionic' | 'covalent' | 'double-covalent' = 'ionic'
) {
  ctx.save();

  if (bondType === 'double-covalent') {
    // 2 parallel lines
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len > 0) {
      const nx = -dy / len * 5;
      const ny = dx / len * 5;

      ctx.strokeStyle = '#34D399';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(x1 + nx, y1 + ny);
      ctx.lineTo(x2 + nx, y2 + ny);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x1 - nx, y1 - ny);
      ctx.lineTo(x2 - nx, y2 - ny);
      ctx.stroke();
    }
  } else {
    // Single bond line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = bondType === 'ionic' ? '#38BDF8' : '#34D399';

    // Controlled 400ms flash effect during bond formation
    if (flashProgress > 0 && flashProgress < 1) {
      ctx.shadowColor = bondType === 'ionic' ? '#38BDF8' : '#34D399';
      ctx.shadowBlur = 12 * (1 - flashProgress);
      ctx.lineWidth = 3;
    }

    ctx.stroke();
  }

  ctx.restore();
}
