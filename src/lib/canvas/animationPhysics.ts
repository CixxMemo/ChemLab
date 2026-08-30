import { easeInOutCubic, easeOutCubic, easeOutBack, lerp } from './easing';
import { ElementData, ReactionScenario } from '../../types/chemistry';
import { drawNucleus, drawBohrShells, drawIonBadge, drawBondLine } from './atomRenderer';

export interface SceneState {
  progress: number; // 0 to 1
  rotation: number; // continuously incrementing angle for electron orbits
  flashProgress: number; // for bond flash
  scenario: ReactionScenario | null;
  elementsMap: Record<string, ElementData>;
  selectedElements: ElementData[];
}

export function renderScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: SceneState
) {
  // Clear canvas with Slate-950 background
  ctx.fillStyle = '#0B0F17';
  ctx.fillRect(0, 0, width, height);

  // Draw subtle grid pattern (Muted Scientific grid)
  drawScientificGrid(ctx, width, height);

  const { scenario, progress, rotation, selectedElements, elementsMap } = state;

  if (selectedElements.length === 0) {
    drawIdleMessage(ctx, width, height);
    return;
  }

  const cx = width / 2;
  const cy = height / 2;

  if (selectedElements.length === 1 && !scenario) {
    renderSingleElementScene(ctx, cx, cy, rotation, selectedElements[0], width, height);
    return;
  }

  if (!scenario) {
    renderGenericPairScenario(ctx, cx, cy, progress, rotation, selectedElements);
    return;
  }

  switch (scenario.id) {
    case 'nacl':
      renderNaClScenario(ctx, cx, cy, progress, rotation, elementsMap);
      break;
    case 'h2o':
      renderH2OScenario(ctx, cx, cy, progress, rotation, elementsMap);
      break;
    case 'o2':
      renderO2Scenario(ctx, cx, cy, progress, rotation, elementsMap);
      break;
    case 'ch4':
      renderCH4Scenario(ctx, cx, cy, progress, rotation, elementsMap);
      break;
    case 'inert_gas':
      renderInertScenario(ctx, cx, cy, progress, rotation, selectedElements, elementsMap);
      break;
    default:
      renderGenericPairScenario(ctx, cx, cy, progress, rotation, selectedElements);
      break;
  }
}

function drawScientificGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.strokeStyle = '#151C28';
  ctx.lineWidth = 1;

  const gridSize = 40;
  ctx.beginPath();
  for (let x = 0; x <= width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y <= height; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  // Subtle coordinate ticks
  ctx.fillStyle = '#263345';
  for (let x = 0; x <= width; x += gridSize * 2) {
    for (let y = 0; y <= height; y += gridSize * 2) {
      ctx.fillRect(x - 1, y - 1, 3, 3);
    }
  }
  ctx.restore();
}

function drawIdleMessage(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#64748B';
  ctx.font = '600 16px "Inter", sans-serif';
  ctx.fillText('Sol tablodan bir element seçin veya hazır senaryoyu başlatın', width / 2, height / 2 - 15);

  ctx.fillStyle = '#475569';
  ctx.font = '13px "JetBrains Mono", monospace';
  ctx.fillText('Örn: Na + Cl (İyonik), H + O (Polar Kovalent), O + O (Apolar), C + H (Metan)', width / 2, height / 2 + 18);

  ctx.restore();
}

/**
 * Single Element Bohr Inspector Scene
 */
function renderSingleElementScene(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rotation: number,
  element: ElementData,
  _width: number,
  height: number
) {
  const shells = element.shells || [element.atomicNumber];
  const numShells = shells.length;

  let baseRadius = 46;
  let stepRadius = 26;
  if (numShells === 3) {
    baseRadius = 40;
    stepRadius = 22;
  } else if (numShells === 4) {
    baseRadius = 36;
    stepRadius = 18;
  } else if (numShells >= 5) {
    baseRadius = 32;
    stepRadius = 15;
  }

  // Draw Bohr Orbit shells with revolving electrons
  drawBohrShells(ctx, cx, cy, shells, baseRadius, stepRadius, rotation);

  // Draw Nucleus
  drawNucleus(ctx, cx, cy, element, 28);

  const maxRadius = baseRadius + (numShells - 1) * stepRadius;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Bottom information label
  const bottomY = Math.min(height - 24, cy + maxRadius + 26);
  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText(
    `Katman Dağılımı: [${shells.join(', ')}] • Toplam: ${element.atomicNumber} e⁻`,
    cx,
    bottomY
  );

  const promptY = Math.min(height - 8, bottomY + 18);
  ctx.font = '500 11px "Inter", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText('Kimyasal bağ simülasyonu için 2. bir element seçin', cx, promptY);

  // If noble gas, show stable badge
  if (element.category === 'noble') {
    drawIonBadge(ctx, cx, cy - maxRadius - 25, 'Asal Soygaz (Kararlı Oktet/Dublet)', 'anion');
  }

  ctx.restore();
}

/**
 * 1. NaCl SCENARIO: Ionic Transfer
 */
function renderNaClScenario(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  rotation: number,
  elementsMap: Record<string, ElementData>
) {
  const na = elementsMap['11'] || { atomicNumber: 11, symbol: 'Na', nameTR: 'Sodyum', category: 'alkali', electronegativity: 0.93, shells: [2, 8, 1], valanceElectrons: 1 };
  const cl = elementsMap['17'] || { atomicNumber: 17, symbol: 'Cl', nameTR: 'Klor', category: 'halogen', electronegativity: 3.16, shells: [2, 8, 7], valanceElectrons: 7 };

  // Approach distance interpolation
  const initialDist = 280;
  const finalDist = 180;
  const dist = lerp(initialDist, finalDist, easeOutCubic(Math.min(1, t * 1.5)));

  const naX = cx - dist / 2;
  const clX = cx + dist / 2;
  const naY = cy;
  const clY = cy;

  // Electron transfer phase: between t=0.3 and t=0.75
  const transferT = Math.max(0, Math.min(1, (t - 0.3) / 0.45));
  const isTransferring = transferT > 0 && transferT < 1;
  const isTransferred = transferT >= 1;

  // Shells configuration
  // Na starts with [2,8,1]. As electron transfers, the 3rd shell fades and vanishes.
  const naShells = isTransferred ? [2, 8] : [2, 8, isTransferring ? 0 : 1];
  // Cl starts with [2,8,7]. When transferred, becomes [2,8,8].
  const clShells = isTransferred ? [2, 8, 8] : [2, 8, 7];

  // Draw Na shells and nucleus
  drawBohrShells(ctx, naX, naY, naShells, 38, 20, rotation);
  drawNucleus(ctx, naX, naY, na as ElementData, 24);

  // Draw Cl shells and nucleus
  drawBohrShells(ctx, clX, clY, clShells, 38, 20, -rotation * 0.8);
  drawNucleus(ctx, clX, clY, cl as ElementData, 24);

  // Traveling Electron (easeInOutCubic trajectory)
  if (isTransferring) {
    const easeT = easeInOutCubic(transferT);
    const naOuterR = 38 + 2 * 20;
    const clOuterR = 38 + 2 * 20;

    const startEx = naX + naOuterR;
    const startEy = naY;
    const endEx = clX - clOuterR;
    const endEy = clY;

    // Curved parabolic arc trajectory
    const arcHeight = -35 * Math.sin(easeT * Math.PI);
    const ex = lerp(startEx, endEx, easeT);
    const ey = lerp(startEy, endEy, easeT) + arcHeight;

    // Traveling electron dot with glow
    ctx.save();
    ctx.beginPath();
    ctx.arc(ex, ey, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#FDE047';
    ctx.shadowColor = '#FDE047';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();

    // Dotted trajectory preview line
    ctx.save();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(startEx, startEy);
    ctx.quadraticCurveTo((startEx + endEx) / 2, naY - 45, endEx, endEy);
    ctx.stroke();
    ctx.restore();
  }

  // Once transferred (t >= 0.75): Show Cation and Anion badges, draw ionic attraction line
  if (isTransferred) {
    drawIonBadge(ctx, naX, naY - 60, 'Na⁺ (+1)', 'cation');
    drawIonBadge(ctx, clX, clY - 60, 'Cl⁻ (-1)', 'anion');

    // 400ms flash effect on bond creation
    const flashT = Math.max(0, Math.min(1, (t - 0.75) / 0.25));
    drawBondLine(ctx, naX, naY, clX, clY, flashT, 'ionic');
  }
}

/**
 * 2. H2O SCENARIO: Polar Covalent Overlap
 */
function renderH2OScenario(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  rotation: number,
  elementsMap: Record<string, ElementData>
) {
  const o = elementsMap['8'] || { atomicNumber: 8, symbol: 'O', nameTR: 'Oksijen', category: 'nonmetal', electronegativity: 3.44, shells: [2, 6], valanceElectrons: 6 };
  const h = elementsMap['1'] || { atomicNumber: 1, symbol: 'H', nameTR: 'Hidrojen', category: 'nonmetal', electronegativity: 2.20, shells: [1], valanceElectrons: 1 };

  // Angle between bonds: ~104.5 degrees
  const angleRad = (104.5 / 2) * (Math.PI / 180);
  const initialDist = 200;
  const finalDist = 76;
  const dist = lerp(initialDist, finalDist, easeOutCubic(t));

  const oX = cx + 20;
  const oY = cy;

  const h1X = oX - Math.cos(angleRad) * dist;
  const h1Y = oY - Math.sin(angleRad) * dist;

  const h2X = oX - Math.cos(angleRad) * dist;
  const h2Y = oY + Math.sin(angleRad) * dist;

  // Draw Oxygen Bohr Model (central)
  drawBohrShells(ctx, oX, oY, [2, 6], 32, 22, rotation * 0.5);
  drawNucleus(ctx, oX, oY, o as ElementData, 25);

  // Draw Hydrogen 1 Bohr Model
  drawBohrShells(ctx, h1X, h1Y, [1], 24, 0, rotation);
  drawNucleus(ctx, h1X, h1Y, h as ElementData, 18);

  // Draw Hydrogen 2 Bohr Model
  drawBohrShells(ctx, h2X, h2Y, [1], 24, 0, -rotation);
  drawNucleus(ctx, h2X, h2Y, h as ElementData, 18);

  // When shells overlap (t > 0.6)
  if (t > 0.6) {
    const overlapT = (t - 0.6) / 0.4;
    drawBondLine(ctx, h1X, h1Y, oX, oY, overlapT, 'covalent');
    drawBondLine(ctx, h2X, h2Y, oX, oY, overlapT, 'covalent');

    // Partial charge badges (Polar covalent: δ- on Oxygen, δ+ on Hydrogens)
    drawIonBadge(ctx, oX + 45, oY, 'δ⁻ (O)', 'anion');
    drawIonBadge(ctx, h1X - 35, h1Y - 15, 'δ⁺ (H)', 'cation');
    drawIonBadge(ctx, h2X - 35, h2Y + 15, 'δ⁺ (H)', 'cation');
  }
}

/**
 * 3. O2 SCENARIO: Nonpolar Covalent Double Bond
 */
function renderO2Scenario(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  rotation: number,
  elementsMap: Record<string, ElementData>
) {
  const o = elementsMap['8'] || { atomicNumber: 8, symbol: 'O', nameTR: 'Oksijen', category: 'nonmetal', electronegativity: 3.44, shells: [2, 6], valanceElectrons: 6 };

  const initialDist = 240;
  const finalDist = 95;
  const dist = lerp(initialDist, finalDist, easeOutCubic(t));

  const o1X = cx - dist / 2;
  const o2X = cx + dist / 2;
  const oY = cy;

  // Draw shells and nuclei
  drawBohrShells(ctx, o1X, oY, [2, 6], 32, 22, rotation * 0.7);
  drawNucleus(ctx, o1X, oY, o as ElementData, 25);

  drawBohrShells(ctx, o2X, oY, [2, 6], 32, 22, -rotation * 0.7);
  drawNucleus(ctx, o2X, oY, o as ElementData, 25);

  // If connected, show double bond (4 shared electrons)
  if (t > 0.6) {
    const flashT = (t - 0.6) / 0.4;
    drawBondLine(ctx, o1X, oY, o2X, oY, flashT, 'double-covalent');

    // Symmetrical overlap indicator
    drawIonBadge(ctx, cx, cy - 65, 'O = O (Apolar İkili Bağ)', 'partial');
  }
}

/**
 * 4. CH4 SCENARIO: Methane with 4 Covalent Bonds
 */
function renderCH4Scenario(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  rotation: number,
  elementsMap: Record<string, ElementData>
) {
  const c = elementsMap['6'] || { atomicNumber: 6, symbol: 'C', nameTR: 'Karbon', category: 'nonmetal', electronegativity: 2.55, shells: [2, 4], valanceElectrons: 4 };
  const h = elementsMap['1'] || { atomicNumber: 1, symbol: 'H', nameTR: 'Hidrojen', category: 'nonmetal', electronegativity: 2.20, shells: [1], valanceElectrons: 1 };

  const initialDist = 180;
  const finalDist = 80;
  const dist = lerp(initialDist, finalDist, easeOutCubic(t));

  // Central Carbon
  drawBohrShells(ctx, cx, cy, [2, 4], 30, 22, rotation * 0.5);
  drawNucleus(ctx, cx, cy, c as ElementData, 24);

  // 4 Hydrogens in cross formation
  const positions = [
    { x: cx, y: cy - dist }, // Top
    { x: cx + dist, y: cy }, // Right
    { x: cx, y: cy + dist }, // Bottom
    { x: cx - dist, y: cy }, // Left
  ];

  positions.forEach((pos, idx) => {
    drawBohrShells(ctx, pos.x, pos.y, [1], 20, 0, rotation * (idx % 2 === 0 ? 1 : -1));
    drawNucleus(ctx, pos.x, pos.y, h as ElementData, 16);

    if (t > 0.6) {
      drawBondLine(ctx, cx, cy, pos.x, pos.y, (t - 0.6) / 0.4, 'covalent');
    }
  });

  if (t > 0.7) {
    drawIonBadge(ctx, cx, cy - 110, 'CH₄ (4 Apolar Tekli Kovalent Bağ)', 'partial');
  }
}

/**
 * 5. INERT SCENARIO: Noble Gas Repulsion Bounce
 */
function renderInertScenario(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  rotation: number,
  selectedElements: ElementData[],
  elementsMap: Record<string, ElementData>
) {
  const elemA = selectedElements[0] || elementsMap['2'] || { atomicNumber: 2, symbol: 'He', nameTR: 'Helyum', category: 'noble', electronegativity: null, shells: [2], valanceElectrons: 2 };
  const elemB = selectedElements[1] || elementsMap['10'] || { atomicNumber: 10, symbol: 'Ne', nameTR: 'Neon', category: 'noble', electronegativity: null, shells: [2, 8], valanceElectrons: 8 };

  // Repulsion bounce: approaches until t=0.4, then recoils outward with easeOutBack
  let dist: number;
  if (t < 0.4) {
    dist = lerp(260, 140, t / 0.4);
  } else {
    const bounceT = (t - 0.4) / 0.6;
    dist = lerp(140, 280, easeOutBack(bounceT));
  }

  const ax = cx - dist / 2;
  const bx = cx + dist / 2;

  drawBohrShells(ctx, ax, cy, elemA.shells, 34, 20, rotation);
  drawNucleus(ctx, ax, cy, elemA, 24);

  drawBohrShells(ctx, bx, cy, elemB.shells, 34, 20, -rotation);
  drawNucleus(ctx, bx, cy, elemB, 24);

  // Repulsion wave indicator
  if (t >= 0.35 && t <= 0.75) {
    ctx.save();
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, 25 + (t - 0.35) * 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  drawIonBadge(ctx, cx, cy - 70, 'Reaksiyon Yok (Kararlı Asal Yapı)', 'cation');
}

/**
 * Generic Pair scenario
 */
function renderGenericPairScenario(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  rotation: number,
  selectedElements: ElementData[]
) {
  const elemA = selectedElements[0];
  const elemB = selectedElements[1] || selectedElements[0];

  const dist = lerp(260, 160, easeOutCubic(t));
  const ax = cx - dist / 2;
  const bx = cx + dist / 2;

  drawBohrShells(ctx, ax, cy, elemA.shells, 34, 20, rotation);
  drawNucleus(ctx, ax, cy, elemA, 24);

  drawBohrShells(ctx, bx, cy, elemB.shells, 34, 20, -rotation);
  drawNucleus(ctx, bx, cy, elemB, 24);

  if (t > 0.7) {
    drawBondLine(ctx, ax, cy, bx, cy, (t - 0.7) / 0.3, 'covalent');
  }
}
