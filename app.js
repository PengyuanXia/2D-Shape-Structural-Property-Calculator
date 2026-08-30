/**
 * SecCalc - 2D Shape Structural Property Calculator Math Engine and Controller
 */

// --- APPLICATION STATE ---
const state = {
  outerBoundary: [], // Array of {x, y}
  outerClosed: false,
  holes: [], // Array of Array of {x, y}
  activeHole: [], // Array of {x, y} for currently drawn hole
  drawingMode: 'OUTER', // 'OUTER', 'HOLE'
  bendingAngle: 0, // In degrees (0 - 360)
  
  // Visual Toggles
  showCentroid: true,
  showPrincipal: true,
  showENA: false,
  showPNA: false,
  showKern: false,
  gridSnap: true,
  reverseX: false,
  reverseY: true,
  drawNodeActive: false,
  
  // Canvas View State
  zoom: 2.0, // Pixels per unit
  panX: 0,
  panY: 0,
  isPanning: false,
  dragStartX: 0,
  dragStartY: 0,
  
  // Themes
  theme: 'dark',
  lang: 'en',
  welcomeDismissed: false
};

// --- CONSTANTS ---
const SNAP_GRID_SIZE = 1; // snap distance in grid units
const POINT_RADIUS_PX = 6;
const CLOSE_PX_LIMIT = 12; // click close to first vertex to close loop

// --- DOM ELEMENTS ---
const canvas = document.getElementById('viewport-canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('canvas-viewport-container');
const cursorDisplay = document.getElementById('cursor-pos');

// Controls
const btnThemeToggle = document.getElementById('btn-theme-toggle');
const btnDrawOuter = document.getElementById('tool-draw-outer');
const btnDrawHole = document.getElementById('tool-draw-hole');
const btnClearCurrent = document.getElementById('btn-clear-current');
const btnResetAll = document.getElementById('btn-reset-all');
const btnUndo = document.getElementById('btn-undo');
const toggleGridSnap = document.getElementById('toggle-grid-snap');
const btnZoomIn = document.getElementById('btn-zoom-in');
const btnZoomOut = document.getElementById('btn-zoom-out');
const btnFitZoom = document.getElementById('btn-fit-zoom');

// Toggles
const chkCentroid = document.getElementById('toggle-centroid');
const chkPrincipal = document.getElementById('toggle-principal');
const chkEna = document.getElementById('toggle-ena');
const chkPna = document.getElementById('toggle-pna');
const chkKern = document.getElementById('toggle-kern');
const toggleReverseX = document.getElementById('toggle-reverse-x');
const toggleReverseY = document.getElementById('toggle-reverse-y');

// Accordions
const outerCoordsList = document.getElementById('list-outer-coords');
const outerCountDisplay = document.getElementById('count-outer');
const holesContainer = document.getElementById('holes-container');
const holesCountDisplay = document.getElementById('count-holes');

// Results
const valArea = document.getElementById('val-area');
const valCentroid = document.getElementById('val-centroid');
const valIx = document.getElementById('val-ix');
const valIy = document.getElementById('val-iy');
const valIxy = document.getElementById('val-ixy');
const valTheta = document.getElementById('val-theta');
const valI1 = document.getElementById('val-i1');
const valI2 = document.getElementById('val-i2');
const valEnaPos = document.getElementById('val-ena-pos');
const valPnaPos = document.getElementById('val-pna-pos');



// Manual Input elements
const inputManualX = document.getElementById('input-manual-x');
const inputManualY = document.getElementById('input-manual-y');
const btnManualAdd = document.getElementById('btn-add-manual');
const btnManualClose = document.getElementById('btn-close-loop');

// Preset Settings Modal elements
const presetModal = document.getElementById('preset-modal');
const presetModalTitle = document.getElementById('preset-modal-title');
const btnClosePresetModal = document.getElementById('btn-close-preset-modal');
const btnPresetDefault = document.getElementById('btn-preset-default');
const presetCustomForm = document.getElementById('preset-custom-form');
const presetFieldsContainer = document.getElementById('preset-fields-container');

let currentSelectedShape = null;

const shapeConfigurations = {
  rect: {
    titleKey: 'preset.rect.title',
    fields: [
      { id: 'rect-w', labelKey: 'field.width', type: 'number', default: 100 },
      { id: 'rect-h', labelKey: 'field.height', type: 'number', default: 80 }
    ],
    generateDefault: () => {
      return {
        outer: [
          { x: -50, y: -40 },
          { x: 50, y: -40 },
          { x: 50, y: 40 },
          { x: -50, y: 40 }
        ],
        holes: []
      };
    },
    generateCustom: (values) => {
      const w = values['rect-w'];
      const h = values['rect-h'];
      if (w <= 0 || h <= 0) {
        alert(t('alert.dimPositive'));
        return null;
      }
      return {
        outer: [
          { x: -w/2, y: -h/2 },
          { x: w/2, y: -h/2 },
          { x: w/2, y: h/2 },
          { x: -w/2, y: h/2 }
        ],
        holes: []
      };
    }
  },
  'hollow-rect': {
    titleKey: 'preset.hollowRect.title',
    fields: [
      { id: 'box-W', labelKey: 'field.outerWidth', type: 'number', default: 120 },
      { id: 'box-H', labelKey: 'field.outerHeight', type: 'number', default: 100 },
      { id: 'box-w', labelKey: 'field.innerWidth', type: 'number', default: 80 },
      { id: 'box-h', labelKey: 'field.innerHeight', type: 'number', default: 60 }
    ],
    generateDefault: () => {
      return {
        outer: [
          { x: -60, y: -50 },
          { x: 60, y: -50 },
          { x: 60, y: 50 },
          { x: -60, y: 50 }
        ],
        holes: [[
          { x: -40, y: -30 },
          { x: -40, y: 30 },
          { x: 40, y: 30 },
          { x: 40, y: -30 }
        ]]
      };
    },
    generateCustom: (values) => {
      const W = values['box-W'];
      const H = values['box-H'];
      const w = values['box-w'];
      const h = values['box-h'];
      
      if (W <= 0 || H <= 0 || w <= 0 || h <= 0) {
        alert(t('alert.dimPositive'));
        return null;
      }
      if (w >= W || h >= H) {
        alert(t('alert.innerSmaller'));
        return null;
      }
      
      return {
        outer: [
          { x: -W/2, y: -H/2 },
          { x: W/2, y: -H/2 },
          { x: W/2, y: H/2 },
          { x: -W/2, y: H/2 }
        ],
        holes: [[
          { x: -w/2, y: -h/2 },
          { x: -w/2, y: h/2 },
          { x: w/2, y: h/2 },
          { x: w/2, y: -h/2 }
        ]]
      };
    }
  },
  'i-beam': {
    titleKey: 'preset.iBeam.title',
    fields: [
      { id: 'ib-H', labelKey: 'field.overallHeight', type: 'number', default: 120 },
      { id: 'ib-tw', labelKey: 'field.webWidth', type: 'number', default: 20 },
      { id: 'ib-bft', labelKey: 'field.topFlangeWidth', type: 'number', default: 100 },
      { id: 'ib-tft', labelKey: 'field.topFlangeThickness', type: 'number', default: 15 },
      { id: 'ib-bfb', labelKey: 'field.botFlangeWidth', type: 'number', default: 100 },
      { id: 'ib-tfb', labelKey: 'field.botFlangeThickness', type: 'number', default: 15 }
    ],
    generateDefault: () => {
      return {
        outer: [
          { x: -50, y: -60 },
          { x: 50, y: -60 },
          { x: 50, y: -45 },
          { x: 10, y: -45 },
          { x: 10, y: 45 },
          { x: 50, y: 45 },
          { x: 50, y: 60 },
          { x: -50, y: 60 },
          { x: -50, y: 45 },
          { x: -10, y: 45 },
          { x: -10, y: -45 },
          { x: -50, y: -45 }
        ],
        holes: []
      };
    },
    generateCustom: (values) => {
      const H = values['ib-H'];
      const tw = values['ib-tw'];
      const bft = values['ib-bft'];
      const tft = values['ib-tft'];
      const bfb = values['ib-bfb'];
      const tfb = values['ib-tfb'];
      
      if (H <= 0 || tw <= 0 || bft <= 0 || tft <= 0 || bfb <= 0 || tfb <= 0) {
        alert(t('alert.dimPositive'));
        return null;
      }
      const hw = H - tft - tfb;
      if (hw <= 0) {
        alert(t('alert.flangeExceed'));
        return null;
      }
      if (tw >= bft || tw >= bfb) {
        alert(t('alert.webSmallerFlanges'));
        return null;
      }
      
      return {
        outer: [
          { x: -bft/2, y: -H/2 },
          { x: bft/2, y: -H/2 },
          { x: bft/2, y: -H/2 + tft },
          { x: tw/2, y: -H/2 + tft },
          { x: tw/2, y: H/2 - tfb },
          { x: bfb/2, y: H/2 - tfb },
          { x: bfb/2, y: H/2 },
          { x: -bfb/2, y: H/2 },
          { x: -bfb/2, y: H/2 - tfb },
          { x: -tw/2, y: H/2 - tfb },
          { x: -tw/2, y: -H/2 + tft },
          { x: -bft/2, y: -H/2 + tft }
        ],
        holes: []
      };
    }
  },
  't-beam': {
    titleKey: 'preset.tBeam.title',
    fields: [
      { id: 'tb-bf', labelKey: 'field.flangeWidth', type: 'number', default: 100 },
      { id: 'tb-tf', labelKey: 'field.flangeThickness', type: 'number', default: 15 },
      { id: 'tb-hw', labelKey: 'field.webHeight', type: 'number', default: 90 },
      { id: 'tb-tw', labelKey: 'field.webWidth', type: 'number', default: 20 }
    ],
    generateDefault: () => {
      return {
        outer: [
          { x: -10, y: 60 },
          { x: 10, y: 60 },
          { x: 10, y: -30 },
          { x: 50, y: -30 },
          { x: 50, y: -45 },
          { x: -50, y: -45 },
          { x: -50, y: -30 },
          { x: -10, y: -30 }
        ],
        holes: []
      };
    },
    generateCustom: (values) => {
      const bf = values['tb-bf'];
      const tf = values['tb-tf'];
      const hw = values['tb-hw'];
      const tw = values['tb-tw'];
      
      if (bf <= 0 || tf <= 0 || hw <= 0 || tw <= 0) {
        alert(t('alert.dimPositive'));
        return null;
      }
      if (tw >= bf) {
        alert(t('alert.webSmallerFlange'));
        return null;
      }
      
      const H = tf + hw;
      
      return {
        outer: [
          { x: -tw/2, y: H/2 },
          { x: tw/2, y: H/2 },
          { x: tw/2, y: -H/2 + tf },
          { x: bf/2, y: -H/2 + tf },
          { x: bf/2, y: -H/2 },
          { x: -bf/2, y: -H/2 },
          { x: -bf/2, y: -H/2 + tf },
          { x: -tw/2, y: -H/2 + tf }
        ],
        holes: []
      };
    }
  },
  circular: {
    titleKey: 'preset.circular.title',
    fields: [
      { id: 'circ-R', labelKey: 'field.outerRadius', type: 'number', default: 60 },
      { id: 'circ-r', labelKey: 'field.innerRadius', type: 'number', default: 40 }
    ],
    generateDefault: () => {
      const outer = [];
      const hole = [];
      const R = 60, r = 40, segments = 24;
      for (let i = 0; i < segments; i++) {
        const angle = (i * 2 * Math.PI) / segments;
        const ox = Math.round(R * Math.cos(angle) / 5) * 5;
        const oy = Math.round(R * Math.sin(angle) / 5) * 5;
        if (!outer.some(p => p.x === ox && p.y === oy)) outer.push({ x: ox, y: oy });
        const ix = Math.round(r * Math.cos(angle) / 5) * 5;
        const iy = Math.round(r * Math.sin(angle) / 5) * 5;
        if (!hole.some(p => p.x === ix && p.y === iy)) hole.push({ x: ix, y: iy });
      }
      return { outer, holes: [hole] };
    },
    generateCustom: (values) => {
      const R = values['circ-R'];
      const r = values['circ-r'];
      if (R <= 0 || r <= 0) {
        alert(t('alert.radiiPositive'));
        return null;
      }
      if (r >= R) {
        alert(t('alert.innerRadiusSmaller'));
        return null;
      }
      const outer = [];
      const hole = [];
      const segments = 24;
      for (let i = 0; i < segments; i++) {
        const angle = (i * 2 * Math.PI) / segments;
        const ox = Math.round(R * Math.cos(angle) / 5) * 5;
        const oy = Math.round(R * Math.sin(angle) / 5) * 5;
        if (!outer.some(p => p.x === ox && p.y === oy)) outer.push({ x: ox, y: oy });
        const ix = Math.round(r * Math.cos(angle) / 5) * 5;
        const iy = Math.round(r * Math.sin(angle) / 5) * 5;
        if (!hole.some(p => p.x === ix && p.y === iy)) hole.push({ x: ix, y: iy });
      }
      return { outer, holes: [hole] };
    }
  },
  'l-angle': {
    titleKey: 'preset.lAngle.title',
    fields: [
      { id: 'la-H', labelKey: 'field.vertLegHeight', type: 'number', default: 80 },
      { id: 'la-tv', labelKey: 'field.vertLegThick', type: 'number', default: 20 },
      { id: 'la-B', labelKey: 'field.horizLegWidth', type: 'number', default: 80 },
      { id: 'la-th', labelKey: 'field.horizLegThick', type: 'number', default: 20 }
    ],
    generateDefault: () => {
      return {
        outer: [
          { x: -40, y: 40 },
          { x: 40, y: 40 },
          { x: 40, y: 20 },
          { x: -20, y: 20 },
          { x: -20, y: -40 },
          { x: -40, y: -40 }
        ],
        holes: []
      };
    },
    generateCustom: (values) => {
      const H = values['la-H'];
      const tv = values['la-tv'];
      const B = values['la-B'];
      const th = values['la-th'];
      
      if (H <= 0 || tv <= 0 || B <= 0 || th <= 0) {
        alert(t('alert.dimPositive'));
        return null;
      }
      if (tv >= B || th >= H) {
        alert(t('alert.legThickSmaller'));
        return null;
      }
      
      return {
        outer: [
          { x: -B/2, y: H/2 },
          { x: B/2, y: H/2 },
          { x: B/2, y: H/2 - th },
          { x: -B/2 + tv, y: H/2 - th },
          { x: -B/2 + tv, y: -H/2 },
          { x: -B/2, y: -H/2 }
        ],
        holes: []
      };
    }
  }
};

// --- MATHEMATICAL UTILITIES ---

/**
 * Reverses a polygon's vertices if they are oriented clockwise to ensure counter-clockwise (CCW) winding.
 */
function makeCCW(polygon) {
  if (polygon.length < 3) return polygon;
  let areaSum = 0;
  for (let i = 0; i < polygon.length; i++) {
    const p1 = polygon[i];
    const p2 = polygon[(i + 1) % polygon.length];
    areaSum += p1.x * p2.y - p2.x * p1.y;
  }
  if (areaSum < 0) {
    return [...polygon].reverse();
  }
  return polygon;
}

/**
 * Shifts all coordinates of the shape vertically so that the maximum Y coordinate is exactly 0.
 * This aligns the top fiber of the cross-section with the global X-axis.
 */
function shiftShapeToTop() {
  if (state.outerBoundary.length === 0) return;
  let minY = Infinity;
  state.outerBoundary.forEach(v => {
    if (v.y < minY) minY = v.y;
  });

  if (Math.abs(minY) > 1e-6) {
    state.outerBoundary = state.outerBoundary.map(v => ({ x: v.x, y: v.y - minY }));
    state.holes = state.holes.map(hole => hole.map(v => ({ x: v.x, y: v.y - minY })));
    if (state.activeHole.length > 0) {
      state.activeHole = state.activeHole.map(v => ({ x: v.x, y: v.y - minY }));
    }
  }
}

/**
 * Sets the viewport zoom and pan offsets so that the visible axes span exactly from -20 to 20.
 */
function setInitialViewport() {
  const span = 40; // Total range is 40 units (-20 to 20)
  const zoomX = canvas.width / span;
  const zoomY = canvas.height / span;
  state.zoom = Math.min(zoomX, zoomY);
  state.panX = 0;
  state.panY = 0;
}

/**
 * Calculate geometric area properties of a single CCW polygon.
 * Returns: { area, centroidX, centroidY, Ix_orig, Iy_orig, Ixy_orig }
 */
function calculatePolygonBaseProperties(poly) {
  const n = poly.length;
  if (n < 3) {
    return { area: 0, cx: 0, cy: 0, ix: 0, iy: 0, ixy: 0 };
  }

  let area = 0;
  let cx = 0;
  let cy = 0;
  let ix = 0;
  let iy = 0;
  let ixy = 0;

  for (let i = 0; i < n; i++) {
    const p1 = poly[i];
    const p2 = poly[(i + 1) % n];

    // Cross product factor
    const factor = p1.x * p2.y - p2.x * p1.y;

    area += factor;
    cx += (p1.x + p2.x) * factor;
    cy += (p1.y + p2.y) * factor;

    // Moments about origin
    ix += (p1.y * p1.y + p1.y * p2.y + p2.y * p2.y) * factor;
    iy += (p1.x * p1.x + p1.x * p2.x + p2.x * p2.x) * factor;
    ixy += (p1.x * p2.y + 2 * p1.x * p1.y + 2 * p2.x * p2.y + p2.x * p1.y) * factor;
  }

  area = area / 2;
  // If the area is extremely close to 0, return zero state
  if (Math.abs(area) < 1e-6) {
    return { area: 0, cx: 0, cy: 0, ix: 0, iy: 0, ixy: 0 };
  }

  cx = cx / (6 * area);
  cy = cy / (6 * area);
  ix = ix / 12;
  iy = iy / 12;
  ixy = ixy / 24;

  return {
    area: Math.abs(area),
    cx,
    cy,
    ix: Math.abs(ix),
    iy: Math.abs(iy),
    ixy: ixy // can be positive or negative
  };
}

/**
 * Calculates composite shape properties (outer minus holes)
 */
function calculateCompositeProperties() {
  if (state.outerBoundary.length < 3 || !state.outerClosed) {
    return null;
  }

  // Force CCW on outer
  const outer = makeCCW(state.outerBoundary);
  const outerProps = calculatePolygonBaseProperties(outer);
  if (outerProps.area === 0) return null;

  let netArea = outerProps.area;
  let sumAx = outerProps.area * outerProps.cx;
  let sumAy = outerProps.area * outerProps.cy;

  // Origin moments
  let netIx_orig = outerProps.ix;
  let netIy_orig = outerProps.iy;
  let netIxy_orig = outerProps.ixy;

  // Subtract holes
  const processedHoles = [];
  for (const hole of state.holes) {
    if (hole.length >= 3) {
      const holeCCW = makeCCW(hole);
      const holeProps = calculatePolygonBaseProperties(holeCCW);
      if (holeProps.area > 0) {
        netArea -= holeProps.area;
        sumAx -= holeProps.area * holeProps.cx;
        sumAy -= holeProps.area * holeProps.cy;
        netIx_orig -= holeProps.ix;
        netIy_orig -= holeProps.iy;
        netIxy_orig -= holeProps.ixy;
        processedHoles.push(holeCCW);
      }
    }
  }

  // Handle pathological case where holes exceed outer boundary
  if (netArea <= 1e-4) {
    return {
      area: 0, cx: 0, cy: 0, ix: 0, iy: 0, ixy: 0,
      theta_p: 0, i1: 0, i2: 0, rx: 0, ry: 0,
      outer, holes: processedHoles
    };
  }

  // Composite Centroid
  const cx = sumAx / netArea;
  const cy = sumAy / netArea;

  // Centroidal properties (using Parallel Axis Theorem: I_centroidal = I_origin - A * d^2)
  const ix_c = netIx_orig - netArea * cy * cy;
  const iy_c = netIy_orig - netArea * cx * cx;
  const ixy_c = netIxy_orig - netArea * cx * cy;

  // Principal properties (must be calculated using centroidal moments)
  const theta_p_rad = 0.5 * Math.atan2(-2 * ixy_c, ix_c - iy_c);
  const theta_p_deg = (theta_p_rad * 180) / Math.PI;

  const R = Math.sqrt(Math.pow((ix_c - iy_c) / 2, 2) + ixy_c * ixy_c);
  const avgI = (ix_c + iy_c) / 2;
  const i1 = avgI + R;
  const i2 = avgI - R;

  // Radii of gyration (referenced to centroidal axes)
  const rx = Math.sqrt(Math.max(0, ix_c / netArea));
  const ry = Math.sqrt(Math.max(0, iy_c / netArea));

  return {
    area: netArea,
    cx,
    cy,
    ix: netIx_orig, // Moment of inertia about the reference coordinate X-axis (y = 0 at the top fiber)
    iy: netIy_orig, // Moment of inertia about the reference coordinate Y-axis (x = 0)
    ixy: netIxy_orig,
    ix_c,
    iy_c,
    ixy_c,
    theta_p: theta_p_deg,
    theta_p_rad,
    i1,
    i2,
    rx,
    ry,
    outer,
    holes: processedHoles
  };
}

// --- POLYGON CLIPPING (Sutherland-Hodgman) ---

/**
 * Clips a polygon to the half-plane below y_val.
 */
function clipPolygonBelow(polygon, y_val) {
  const result = [];
  const n = polygon.length;
  if (n === 0) return result;

  for (let i = 0; i < n; i++) {
    const curr = polygon[i];
    const next = polygon[(i + 1) % n];

    const currInside = curr.y <= y_val;
    const nextInside = next.y <= y_val;

    if (currInside) {
      result.push({ x: curr.x, y: curr.y });
    }

    if (currInside !== nextInside) {
      const dy = next.y - curr.y;
      if (Math.abs(dy) > 1e-9) {
        const t = (y_val - curr.y) / dy;
        result.push({
          x: curr.x + t * (next.x - curr.x),
          y: y_val
        });
      }
    }
  }
  return result;
}

/**
 * Clips a polygon by a general linear half-plane Ax + By + C >= 0.
 */
function clipPolygonHalfPlane(polygon, A, B, C) {
  const result = [];
  const n = polygon.length;
  if (n === 0) return result;

  const isInside = (pt) => (A * pt.x + B * pt.y + C) >= -1e-9;

  for (let i = 0; i < n; i++) {
    const curr = polygon[i];
    const next = polygon[(i + 1) % n];

    const currInside = isInside(curr);
    const nextInside = isInside(next);

    if (currInside) {
      result.push({ x: curr.x, y: curr.y });
    }

    if (currInside !== nextInside) {
      const dx = next.x - curr.x;
      const dy = next.y - curr.y;
      const denom = A * dx + B * dy;
      if (Math.abs(denom) > 1e-9) {
        const t = -(A * curr.x + B * curr.y + C) / denom;
        result.push({
          x: curr.x + t * dx,
          y: curr.y + t * dy
        });
      }
    }
  }
  return result;
}

// --- PLASTIC NEUTRAL AXIS (PNA) ENGINE ---

/**
 * Calculates the PNA coordinate and endpoints.
 * Rotates the shape by -theta, finds the cut plane dividing area in half, and projects it back.
 */
function calculatePNA(composite, bendingAngleDeg) {
  if (!composite || composite.area === 0) return null;

  const theta = (bendingAngleDeg * Math.PI) / 180;
  const cosT = Math.cos(-theta);
  const sinT = Math.sin(-theta);

  // Rotate a point by -theta
  const rotatePt = (pt) => ({
    x: pt.x * cosT - pt.y * sinT,
    y: pt.x * sinT + pt.y * cosT
  });

  // Rotate back by +theta
  const rotateBackPt = (pt) => {
    const cosPlus = Math.cos(theta);
    const sinPlus = Math.sin(theta);
    return {
      x: pt.x * cosPlus - pt.y * sinPlus,
      y: pt.x * sinPlus + pt.y * cosPlus
    };
  };

  // 1. Rotate outer boundary and holes
  const rotatedOuter = composite.outer.map(rotatePt);
  const rotatedHoles = composite.holes.map(hole => hole.map(rotatePt));

  // 2. Find bounding box in y'
  let minY = Infinity;
  let maxY = -Infinity;
  for (const pt of rotatedOuter) {
    if (pt.y < minY) minY = pt.y;
    if (pt.y > maxY) maxY = pt.y;
  }

  // 3. Perform bisection search on y' split value
  let low = minY;
  let high = maxY;
  let mid = 0;
  const targetArea = composite.area / 2;
  
  // Helper to calculate clipped net area below horizontal cut y' = y_val
  const getClippedArea = (y_val) => {
    const clippedOuter = clipPolygonBelow(rotatedOuter, y_val);
    let area = calculatePolygonBaseProperties(clippedOuter).area;
    for (const rHole of rotatedHoles) {
      const clippedHole = clipPolygonBelow(rHole, y_val);
      area -= calculatePolygonBaseProperties(clippedHole).area;
    }
    return area;
  };

  for (let iter = 0; iter < 40; iter++) {
    mid = (low + high) / 2;
    const currentArea = getClippedArea(mid);
    if (currentArea < targetArea) {
      low = mid;
    } else {
      high = mid;
    }
  }

  // The cut line in rotated coordinate space is y' = mid.
  // In rotated space, the PNA line segment spans from x' = minX' to x' = maxX' at height y' = mid.
  let minX = -10000;
  let maxX = 10000;

  const ptLeftRotated = { x: minX, y: mid };
  const ptRightRotated = { x: maxX, y: mid };

  const ptLeft = rotateBackPt(ptLeftRotated);
  const ptRight = rotateBackPt(ptRightRotated);

  return { ptLeft, ptRight };
}

// --- KERN (CORE) ENGINE ---

/**
 * Calculates the cross section core (Kern) boundary polygon.
 */
function calculateKern(composite) {
  if (!composite || composite.area === 0) return [];

  // Squared radii of gyration in principal coordinate system
  const ru2 = composite.i1 / composite.area; // radius of gyration wrt axis 1 (u) squared
  const rv2 = composite.i2 / composite.area; // radius of gyration wrt axis 2 (v) squared

  if (ru2 <= 1e-4 || rv2 <= 1e-4) return [];

  // Project all boundary vertices (outer and holes) into centroidal principal coordinates
  const principalVertices = [];
  const cosT = Math.cos(composite.theta_p_rad);
  const sinT = Math.sin(composite.theta_p_rad);

  const toPrincipal = (pt) => {
    const dx = pt.x - composite.cx;
    const dy = pt.y - composite.cy;
    return {
      u: dx * cosT + dy * sinT,
      v: -dx * sinT + dy * cosT
    };
  };

  // Add outer boundary points
  composite.outer.forEach(pt => principalVertices.push(toPrincipal(pt)));
  // Add hole points (holes also define boundary extreme stresses!)
  composite.holes.forEach(hole => {
    hole.forEach(pt => principalVertices.push(toPrincipal(pt)));
  });

  // Calculate maximum dimension for the starting bounding box in (eu, ev) space
  let maxDim = 0;
  principalVertices.forEach(v => {
    maxDim = Math.max(maxDim, Math.abs(v.u), Math.abs(v.v));
  });

  const L = (maxDim > 0 ? maxDim * 4 : 500) + 50;
  
  // Starting convex polygon (large bounding box in eu, ev space)
  let kernPolygon = [
    { x: -L, y: -L },
    { x: L, y: -L },
    { x: L, y: L },
    { x: -L, y: L }
  ];

  // Clip the bounding box by the half-plane constraint of each vertex:
  // (v.u / rv2) * eu + (v.v / ru2) * ev + 1 >= 0
  for (const v of principalVertices) {
    const A = v.u / rv2; // Coeff for eu (x in the clipper)
    const B = v.v / ru2; // Coeff for ev (y in the clipper)
    const C = 1;

    if (Math.abs(A) < 1e-9 && Math.abs(B) < 1e-9) continue;

    kernPolygon = clipPolygonHalfPlane(kernPolygon, A, B, C);
    if (kernPolygon.length < 3) break;
  }

  // Transform the resulting Kern vertices back to global coordinate space (x, y)
  // eu -> e_x, ev -> e_y
  return kernPolygon.map(kp => {
    const ex = kp.x * cosT - kp.y * sinT;
    const ey = kp.x * sinT + kp.y * cosT;
    return {
      x: ex + composite.cx,
      y: ey + composite.cy
    };
  });
}

// --- GEOMETRIC VALIDATION UTILITIES ---

/**
 * Checks if a point is strictly inside a polygon using ray casting.
 */
function isPointInPolygon(pt, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect = ((yi > pt.y) !== (yj > pt.y))
        && (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Bounding segment projection helper.
 */
function onSegment(p, q, r) {
  return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
         q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
}

/**
 * Segment collinear orientation.
 */
function orientation(p, q, r) {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (Math.abs(val) < 1e-9) return 0;
  return (val > 0) ? 1 : 2;
}

/**
 * Evaluates segment intersection (p1-q1 and p2-q2).
 */
function doSegmentsIntersect(p1, q1, p2, q2) {
  const o1 = orientation(p1, q1, p2);
  const o2 = orientation(p1, q1, q2);
  const o3 = orientation(p2, q2, p1);
  const o4 = orientation(p2, q2, q1);

  if (o1 !== o2 && o3 !== o4) return true;

  if (o1 === 0 && onSegment(p1, p2, q1)) return true;
  if (o2 === 0 && onSegment(p1, q2, q1)) return true;
  if (o3 === 0 && onSegment(p2, p1, q2)) return true;
  if (o4 === 0 && onSegment(p2, q1, q2)) return true;

  return false;
}

/**
 * Validates a potential new hole against boundaries.
 */
function validateNewHole(holeVertices, outer, existingHoles) {
  if (outer.length < 3) return { valid: false, reason: "No outer shape drawn." };
  
  // 1. Check if all hole vertices are inside outer
  for (const pt of holeVertices) {
    if (!isPointInPolygon(pt, outer)) {
      return { valid: false, reason: "Hole vertices must be inside the outer boundary." };
    }
  }

  // 2. Check if any outer vertex is inside the hole (prevents inversion crossing)
  for (const pt of outer) {
    if (isPointInPolygon(pt, holeVertices)) {
      return { valid: false, reason: "Hole cannot enclose the outer boundary." };
    }
  }

  // 3. Check segment intersections
  for (let i = 0; i < holeVertices.length; i++) {
    const p1 = holeVertices[i];
    const q1 = holeVertices[(i + 1) % holeVertices.length];

    // Check with outer boundary segments
    for (let j = 0; j < outer.length; j++) {
      const p2 = outer[j];
      const q2 = outer[(j + 1) % outer.length];
      if (doSegmentsIntersect(p1, q1, p2, q2)) {
        return { valid: false, reason: "Hole boundary crosses the outer boundary." };
      }
    }

    // Check with existing holes
    for (const otherHole of existingHoles) {
      for (let j = 0; j < otherHole.length; j++) {
        const p2 = otherHole[j];
        const q2 = otherHole[(j + 1) % otherHole.length];
        if (doSegmentsIntersect(p1, q1, p2, q2)) {
          return { valid: false, reason: "Hole boundary intersects with another hole." };
        }
      }

      // Check containing overlaps
      if (isPointInPolygon(otherHole[0], holeVertices) || isPointInPolygon(holeVertices[0], otherHole)) {
        return { valid: false, reason: "Holes cannot overlap or contain each other." };
      }
    }
  }
  return { valid: true };
}

// --- CANVAS COORDINATE TRANSFORMS ---

function gridToCanvas(x, y) {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const multX = state.reverseX ? -1 : 1;
  const multY = state.reverseY ? -1 : 1;
  return {
    x: cx + state.panX + x * state.zoom * multX,
    y: cy + state.panY + y * state.zoom * multY
  };
}

function canvasToGrid(cx, cy) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const multX = state.reverseX ? -1 : 1;
  const multY = state.reverseY ? -1 : 1;
  return {
    x: ((cx - centerX - state.panX) / state.zoom) * multX,
    y: ((cy - centerY - state.panY) / state.zoom) * multY
  };
}

// --- RENDER SYSTEM ---

function resizeCanvas() {
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  draw();
}

/**
 * Main draw pipeline.
 */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set colors based on current theme
  const isDark = state.theme === 'dark';
  const colorGridLine = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
  const colorGridAxis = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)';
  const colorText = isDark ? '#94a3b8' : '#475569';

  // 1. Draw grid background
  const originCanvas = gridToCanvas(0, 0);

  // Grid step size (dynamically scale step size depending on zoom)
  let step = 10;
  if (state.zoom < 0.5) step = 100;
  else if (state.zoom < 1.5) step = 50;
  else if (state.zoom > 10.0) step = 5;

  const gridX1 = canvasToGrid(0, 0).x;
  const gridX2 = canvasToGrid(canvas.width, 0).x;
  const minX = Math.min(gridX1, gridX2);
  const maxX = Math.max(gridX1, gridX2);
  const leftGrid = Math.floor(minX / step) * step;
  const rightGrid = Math.ceil(maxX / step) * step;

  const gridY1 = canvasToGrid(0, 0).y;
  const gridY2 = canvasToGrid(0, canvas.height).y;
  const minY = Math.min(gridY1, gridY2);
  const maxY = Math.max(gridY1, gridY2);
  const bottomGrid = Math.floor(minY / step) * step;
  const topGrid = Math.ceil(maxY / step) * step;

  ctx.lineWidth = 1;
  
  // Draw vertical gridlines
  for (let x = leftGrid; x <= rightGrid; x += step) {
    const cPt = gridToCanvas(x, 0);
    ctx.strokeStyle = Math.abs(x) < 1e-5 ? colorGridAxis : colorGridLine;
    ctx.beginPath();
    ctx.moveTo(cPt.x, 0);
    ctx.lineTo(cPt.x, canvas.height);
    ctx.stroke();

    // Text labels for major steps
    if (Math.abs(x) > 1e-5 && x % (step * 2) === 0) {
      ctx.fillStyle = colorText;
      ctx.font = '9px Space Grotesk';
      ctx.fillText(x.toFixed(0), cPt.x + 4, originCanvas.y - 4);
    }
  }

  // Draw horizontal gridlines
  for (let y = bottomGrid; y <= topGrid; y += step) {
    const cPt = gridToCanvas(0, y);
    ctx.strokeStyle = Math.abs(y) < 1e-5 ? colorGridAxis : colorGridLine;
    ctx.beginPath();
    ctx.moveTo(0, cPt.y);
    ctx.lineTo(canvas.width, cPt.y);
    ctx.stroke();

    if (Math.abs(y) > 1e-5 && y % (step * 2) === 0) {
      ctx.fillStyle = colorText;
      ctx.font = '9px Space Grotesk';
      ctx.fillText(y.toFixed(0), originCanvas.x + 4, cPt.y - 4);
    }
  }

  // Draw origin text label
  ctx.fillStyle = colorText;
  ctx.font = 'bold 9px Space Grotesk';
  ctx.fillText("0,0", originCanvas.x + 4, originCanvas.y - 4);



  // 2. Draw active shape loops
  const composite = calculateCompositeProperties();

  // Draw completed outer shape and holes
  if (state.outerBoundary.length > 0) {
    ctx.beginPath();
    
    // Draw outer boundary path
    const outerStart = gridToCanvas(state.outerBoundary[0].x, state.outerBoundary[0].y);
    ctx.moveTo(outerStart.x, outerStart.y);
    for (let i = 1; i < state.outerBoundary.length; i++) {
      const pt = gridToCanvas(state.outerBoundary[i].x, state.outerBoundary[i].y);
      ctx.lineTo(pt.x, pt.y);
    }
    if (state.outerClosed) {
      ctx.closePath();
    }

    // Even-odd fill rule handles punching holes cleanly on rendering
    if (state.outerClosed) {
      for (const hole of state.holes) {
        if (hole.length > 0) {
          const hStart = gridToCanvas(hole[0].x, hole[0].y);
          ctx.moveTo(hStart.x, hStart.y);
          for (let j = 1; j < hole.length; j++) {
            const pt = gridToCanvas(hole[j].x, hole[j].y);
            ctx.lineTo(pt.x, pt.y);
          }
          ctx.closePath();
        }
      }
    }

    // Render filled body
    if (state.outerClosed) {
      ctx.fillStyle = isDark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.08)';
      ctx.fill('evenodd');

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      // Draw open outer boundary outline
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // Draw outer boundary vertices
    state.outerBoundary.forEach((v, index) => {
      const cPt = gridToCanvas(v.x, v.y);
      ctx.beginPath();
      ctx.arc(cPt.x, cPt.y, POINT_RADIUS_PX, 0, Math.PI * 2);
      ctx.fillStyle = (index === 0 && !state.outerClosed) ? '#ef4444' : '#06b6d4';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw completed holes boundaries
    state.holes.forEach(hole => {
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const hStart = gridToCanvas(hole[0].x, hole[0].y);
      ctx.moveTo(hStart.x, hStart.y);
      for (let i = 1; i < hole.length; i++) {
        const pt = gridToCanvas(hole[i].x, hole[i].y);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.stroke();

      hole.forEach(v => {
        const cPt = gridToCanvas(v.x, v.y);
        ctx.beginPath();
        ctx.arc(cPt.x, cPt.y, POINT_RADIUS_PX - 1, 0, Math.PI * 2);
        ctx.fillStyle = '#eab308';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    });
  }

  // Draw currently drawing active hole (incomplete loop)
  if (state.drawingMode === 'HOLE' && state.activeHole.length > 0) {
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const ahStart = gridToCanvas(state.activeHole[0].x, state.activeHole[0].y);
    ctx.moveTo(ahStart.x, ahStart.y);
    for (let i = 1; i < state.activeHole.length; i++) {
      const pt = gridToCanvas(state.activeHole[i].x, state.activeHole[i].y);
      ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    state.activeHole.forEach((v, index) => {
      const cPt = gridToCanvas(v.x, v.y);
      ctx.beginPath();
      ctx.arc(cPt.x, cPt.y, POINT_RADIUS_PX - 1, 0, Math.PI * 2);
      ctx.fillStyle = index === 0 ? '#ef4444' : '#eab308';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  // Skip visual enhancements if composite shape isn't finalized
  if (!composite) {
    updateResults(null);
    return;
  }
  updateResults(composite);

  // 3. Draw Core / Kern Overlay
  if (state.showKern) {
    const kernVertices = calculateKern(composite);
    if (kernVertices.length >= 3) {
      ctx.beginPath();
      const kStart = gridToCanvas(kernVertices[0].x, kernVertices[0].y);
      ctx.moveTo(kStart.x, kStart.y);
      for (let i = 1; i < kernVertices.length; i++) {
        const pt = gridToCanvas(kernVertices[i].x, kernVertices[i].y);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.fillStyle = isDark ? 'rgba(234, 179, 8, 0.15)' : 'rgba(234, 179, 8, 0.12)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // 4. Draw Centroid (C)
  const cPt = gridToCanvas(composite.cx, composite.cy);
  if (state.showCentroid) {
    ctx.beginPath();
    ctx.arc(cPt.x, cPt.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981'; // Emerald
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Centroid crosshairs
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cPt.x - 20, cPt.y); ctx.lineTo(cPt.x + 20, cPt.y);
    ctx.moveTo(cPt.x, cPt.y - 20); ctx.lineTo(cPt.x, cPt.y + 20);
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px Space Grotesk';
    ctx.fillText('C', cPt.x + 10, cPt.y - 10);
  }

  // 5. Draw Principal Coordinate System Axes
  if (state.showPrincipal) {
    const axisLen = 120; // length in screen pixels
    const rad = composite.theta_p_rad;

    // Axis 1: direction of max moment
    const cosT = Math.cos(rad);
    const sinT = Math.sin(rad);

    ctx.lineWidth = 2;

    // Principal Axis 1 (u) - Blue/Purple
    ctx.strokeStyle = '#6366f1';
    ctx.beginPath();
    ctx.moveTo(cPt.x - axisLen * cosT, cPt.y + axisLen * sinT);
    ctx.lineTo(cPt.x + axisLen * cosT, cPt.y - axisLen * sinT);
    ctx.stroke();
    
    // Principal Axis 2 (v) - Cyan/Teal
    ctx.strokeStyle = '#06b6d4';
    ctx.beginPath();
    ctx.moveTo(cPt.x + axisLen * sinT, cPt.y + axisLen * cosT);
    ctx.lineTo(cPt.x - axisLen * sinT, cPt.y - axisLen * cosT);
    ctx.stroke();

    // Axis tags
    ctx.fillStyle = '#6366f1';
    ctx.font = '10px Space Grotesk';
    ctx.fillText('1', cPt.x + (axisLen + 10) * cosT - 3, cPt.y - (axisLen + 10) * sinT + 3);

    ctx.fillStyle = '#06b6d4';
    ctx.fillText('2', cPt.x - (axisLen + 10) * sinT - 3, cPt.y - (axisLen + 10) * cosT + 3);
  }

  // 6. Draw Elastic Neutral Axis (ENA)
  if (state.showENA) {
    const angleRad = (state.bendingAngle * Math.PI) / 180;
    
    // In bending mechanics, ENA orientation wrt principal axes is:
    // tan(alpha) = (I1 / I2) * tan(theta_bending_wrt_principal)
    // Let's compute the angle of the applied moment vector relative to the principal Axis 1
    const bendingWrtPrincipal = angleRad - composite.theta_p_rad;

    let enaAngleGlobal = 0;
    if (Math.abs(composite.i2) > 1e-6) {
      const alpha = Math.atan2(composite.i1 * Math.sin(bendingWrtPrincipal), composite.i2 * Math.cos(bendingWrtPrincipal));
      // ENA angle in global system is principal axis orientation + alpha
      enaAngleGlobal = composite.theta_p_rad + alpha;
    } else {
      enaAngleGlobal = angleRad;
    }

    const cosENA = Math.cos(enaAngleGlobal);
    const sinENA = Math.sin(enaAngleGlobal);
    
    const lineHalfLen = Math.max(canvas.width, canvas.height);

    ctx.strokeStyle = '#ef4444'; // Bright Red
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cPt.x - lineHalfLen * cosENA, cPt.y + lineHalfLen * sinENA);
    ctx.lineTo(cPt.x + lineHalfLen * cosENA, cPt.y - lineHalfLen * sinENA);
    ctx.stroke();

    // Label ENA
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 12px Space Grotesk';
    ctx.fillText('ENA', cPt.x + 80 * cosENA + 6, cPt.y - 80 * sinENA - 6);
  }

  // 7. Draw Plastic Neutral Axis (PNA)
  if (state.showPNA) {
    const pnaLine = calculatePNA(composite, state.bendingAngle);
    if (pnaLine) {
      const ptLeftC = gridToCanvas(pnaLine.ptLeft.x, pnaLine.ptLeft.y);
      const ptRightC = gridToCanvas(pnaLine.ptRight.x, pnaLine.ptRight.y);

      ctx.strokeStyle = '#3b82f6'; // Bright Blue
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(ptLeftC.x, ptLeftC.y);
      ctx.lineTo(ptRightC.x, ptRightC.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label PNA
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 12px Space Grotesk';
      // Find midpoint or slightly offset label
      const midX = (ptLeftC.x + ptRightC.x) / 2;
      const midY = (ptLeftC.y + ptRightC.y) / 2;
      
      // Compute perpendicular offset to place PNA label
      const dx = ptRightC.x - ptLeftC.x;
      const dy = ptRightC.y - ptLeftC.y;
      const len = Math.sqrt(dx*dx + dy*dy);
      const px = -dy / len;
      const py = dx / len;

      ctx.fillText('PNA', midX + px * 15 - 10, midY + py * 15 + 3);
    }
  }
}

// Helper for displaying line equations
function getLineEquationString(angleRad, point) {
  let theta = angleRad;
  while (theta > Math.PI / 2) theta -= Math.PI;
  while (theta < -Math.PI / 2) theta += Math.PI;
  
  if (Math.abs(Math.abs(theta) - Math.PI / 2) < 1e-3) {
    return `x = ${point.x.toFixed(1)}`;
  } else {
    const m = Math.tan(theta);
    const c = point.y - m * point.x;
    const sign = c >= 0 ? '+' : '-';
    return `y = ${m.toFixed(2)}x ${sign} ${Math.abs(c).toFixed(1)}`;
  }
}

// --- UPDATE CALCULATED VALUES ON SCREEN ---

function updateResults(props) {
  if (!props) {
    valArea.textContent = '0.00';
    valCentroid.textContent = '0.00, 0.00';
    valIx.textContent = '0.00';
    valIy.textContent = '0.00';
    valIxy.textContent = '0.00';
    valTheta.textContent = '0.0°';
    valI1.textContent = '0.00';
    valI2.textContent = '0.00';
    if (valEnaPos) valEnaPos.textContent = 'y = 0.00x + 0.00';
    if (valPnaPos) valPnaPos.textContent = 'y = 0.00x + 0.00';
    
    return;
  }

  valArea.textContent = props.area.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  valCentroid.textContent = `${props.cx.toFixed(1)}, ${props.cy.toFixed(1)}`;
  valIx.textContent = props.ix.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 });
  valIy.textContent = props.iy.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 });
  valIxy.textContent = props.ixy.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 });
  valTheta.textContent = `${props.theta_p.toFixed(1)}°`;
  valI1.textContent = props.i1.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 });
  valI2.textContent = props.i2.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 });

  // Calculate ENA global angle
  const angleRad = (state.bendingAngle * Math.PI) / 180;
  const bendingWrtPrincipal = angleRad - props.theta_p_rad;
  let enaAngleGlobal = 0;
  if (Math.abs(props.i2) > 1e-6) {
    const alpha = Math.atan2(props.i1 * Math.sin(bendingWrtPrincipal), props.i2 * Math.cos(bendingWrtPrincipal));
    enaAngleGlobal = props.theta_p_rad + alpha;
  } else {
    enaAngleGlobal = angleRad;
  }

  const enaEquation = getLineEquationString(enaAngleGlobal, { x: props.cx, y: props.cy });
  let enaAngleDeg = (enaAngleGlobal * 180 / Math.PI) % 180;
  if (enaAngleDeg < 0) enaAngleDeg += 180;
  if (valEnaPos) {
    valEnaPos.textContent = `${enaEquation} (${enaAngleDeg.toFixed(0)}°)`;
  }

  // Calculate PNA line equation
  const pnaLine = calculatePNA(props, state.bendingAngle);
  let pnaEquation = 'y = 0.00x + 0.00';
  let pnaAngleDeg = state.bendingAngle % 180;
  if (pnaAngleDeg < 0) pnaAngleDeg += 180;

  if (pnaLine) {
    const pnaAngleRad = (state.bendingAngle * Math.PI) / 180;
    pnaEquation = getLineEquationString(pnaAngleRad, pnaLine.ptLeft);
    if (valPnaPos) {
      valPnaPos.textContent = `${pnaEquation} (${pnaAngleDeg.toFixed(0)}°)`;
    }
  } else if (valPnaPos) {
    valPnaPos.textContent = 'y = 0.00x + 0.00';
  }


}

// --- ACCORDION LIST BUILDERS ---

function updateCoordsLists() {
  // Clear lists
  outerCoordsList.innerHTML = '';
  outerCountDisplay.textContent = `${state.outerBoundary.length} ${t('coords.pts')}`;
  
  if (state.outerBoundary.length === 0) {
    outerCoordsList.innerHTML = `<li class="empty-list-msg">${t('coords.emptyOuter')}</li>`;
  } else {
    state.outerBoundary.forEach((v, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="coord-text">Pt ${index + 1}: (${v.x.toFixed(0)}, ${v.y.toFixed(0)})</span>
        <button class="btn-delete-pt" data-type="outer" data-index="${index}" title="${t('tip.deletePoint')}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      `;
      outerCoordsList.appendChild(li);
    });
  }

  // Clear holes
  holesContainer.innerHTML = '';
  holesCountDisplay.textContent = `${state.holes.length} ${t('coords.holesUnit')}`;
  
  if (state.holes.length === 0 && state.activeHole.length === 0) {
    holesContainer.innerHTML = `<div class="empty-list-msg">${t('coords.emptyHoles')}</div>`;
  } else {
    // Render completed holes lists
    state.holes.forEach((hole, hIdx) => {
      const sec = document.createElement('div');
      sec.className = 'hole-section';
      
      const header = document.createElement('div');
      header.className = 'hole-section-header';
      header.innerHTML = `
        <span>Hole ${hIdx + 1} (${hole.length} ${t('coords.pts')})</span>
        <button class="btn-delete-pt" data-type="hole" data-index="${hIdx}" title="${t('tip.deleteHole')}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      `;
      sec.appendChild(header);

      const ul = document.createElement('ul');
      ul.className = 'coords-list';
      hole.forEach((v, ptIdx) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="coord-text">Pt ${ptIdx + 1}: (${v.x.toFixed(0)}, ${v.y.toFixed(0)})</span>`;
        ul.appendChild(li);
      });
      sec.appendChild(ul);
      holesContainer.appendChild(sec);
    });

    // Render active hole in-progress
    if (state.activeHole.length > 0) {
      const sec = document.createElement('div');
      sec.className = 'hole-section';
      sec.innerHTML = `<div class="hole-section-header" style="color: #ef4444;">${t('coords.holeDrawing')} ${state.activeHole.length} ${t('coords.pts')})</div>`;
      
      const ul = document.createElement('ul');
      ul.className = 'coords-list';
      state.activeHole.forEach((v, ptIdx) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="coord-text">Pt ${ptIdx + 1}: (${v.x.toFixed(0)}, ${v.y.toFixed(0)})</span>`;
        ul.appendChild(li);
      });
      sec.appendChild(ul);
      holesContainer.appendChild(sec);
    }
  }

  // Keep manual loop closing button in sync
  updateCloseLoopButtonState();
}

/**
 * Updates the disabled state and display text of the manual loop closer button.
 */
function updateCloseLoopButtonState() {
  if (!btnManualClose) return;
  if (state.drawingMode === 'OUTER') {
    btnManualClose.disabled = state.outerClosed || state.outerBoundary.length < 3;
    btnManualClose.textContent = t('tools.closeOuterLoop');
  } else {
    btnManualClose.disabled = state.activeHole.length < 3;
    btnManualClose.textContent = t('tools.closeActiveHole');
  }
}

function setupCanvasEvents() {
  let hasDragged = false;
  let startX = 0;
  let startY = 0;

  // Track pointer movements for coordinates display
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let gridPt = canvasToGrid(mx, my);

    if (state.gridSnap) {
      gridPt.x = Math.round(gridPt.x / SNAP_GRID_SIZE) * SNAP_GRID_SIZE;
      gridPt.y = Math.round(gridPt.y / SNAP_GRID_SIZE) * SNAP_GRID_SIZE;
    }

    cursorDisplay.textContent = `X: ${gridPt.x.toFixed(1)}, Y: ${gridPt.y.toFixed(1)}`;

    if (state.isPanning) {
      if (Math.hypot(e.clientX - startX, e.clientY - startY) > 5) {
        hasDragged = true;
      }
      const dx = e.clientX - state.dragStartX;
      const dy = e.clientY - state.dragStartY;
      state.panX += dx;
      state.panY += dy;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      draw();
    }
  });

  canvas.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
    hasDragged = false;

    // Middle-click (1), Right-click (2), Shift+Left-click (0 + Shift), or standard Left-click (0) to pan
    if (e.button === 1 || e.button === 2 || (e.button === 0 && e.shiftKey)) {
      state.isPanning = true;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      e.preventDefault();
    } else if (e.button === 0) {
      // Allow regular left click drag to pan the grid, but if they click without dragging, it places a point!
      state.isPanning = true;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
    }
  });

  window.addEventListener('mouseup', (e) => {
    if (state.isPanning) {
      state.isPanning = false;
      // If it was a clean left click (button 0, no shift key) on the canvas, and we did not drag, and draw node is active
      if (!hasDragged && e.button === 0 && !e.shiftKey && e.target === canvas && state.drawNodeActive) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        let gridPt = canvasToGrid(mx, my);

        if (state.gridSnap) {
          gridPt.x = Math.round(gridPt.x / SNAP_GRID_SIZE) * SNAP_GRID_SIZE;
          gridPt.y = Math.round(gridPt.y / SNAP_GRID_SIZE) * SNAP_GRID_SIZE;
        }

        handleDrawingPlacement(gridPt);
      }
    }
  });

  // Block context menu so right-click pan works cleanly
  canvas.addEventListener('contextmenu', e => e.preventDefault());

  // Scroll wheel handles zoom centering around cursor
  canvas.addEventListener('wheel', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    // Grid coordinate under cursor before zoom
    const gridPtBefore = canvasToGrid(mx, my);

    // Zoom multiplier
    const factor = e.deltaY < 0 ? 1.15 : 0.85;
    state.zoom = Math.max(0.2, Math.min(50.0, state.zoom * factor));

    // Shift pan offset to preserve cursor grid position after zoom
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const multX = state.reverseX ? -1 : 1;
    const multY = state.reverseY ? -1 : 1;
    state.panX = mx - cx - gridPtBefore.x * state.zoom * multX;
    state.panY = my - cy - gridPtBefore.y * state.zoom * multY;

    draw();
    e.preventDefault();
  }, { passive: false });

  // Touch Event Handling for Mobile / Phone users
  let touchStartX = 0;
  let touchStartY = 0;
  let touchHasDragged = false;
  let touchInitialDist = 0;
  let touchInitialZoom = 1;

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      touchHasDragged = false;
      state.isPanning = true;
      state.dragStartX = t.clientX;
      state.dragStartY = t.clientY;
    } else if (e.touches.length === 2) {
      state.isPanning = false;
      touchHasDragged = true;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      touchInitialDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      touchInitialZoom = state.zoom;
    }
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && state.isPanning) {
      const t = e.touches[0];
      if (Math.hypot(t.clientX - touchStartX, t.clientY - touchStartY) > 5) {
        touchHasDragged = true;
      }
      const dx = t.clientX - state.dragStartX;
      const dy = t.clientY - state.dragStartY;
      state.panX += dx;
      state.panY += dy;
      state.dragStartX = t.clientX;
      state.dragStartY = t.clientY;

      const rect = canvas.getBoundingClientRect();
      const mx = t.clientX - rect.left;
      const my = t.clientY - rect.top;
      let gridPt = canvasToGrid(mx, my);
      if (state.gridSnap) {
        gridPt.x = Math.round(gridPt.x / SNAP_GRID_SIZE) * SNAP_GRID_SIZE;
        gridPt.y = Math.round(gridPt.y / SNAP_GRID_SIZE) * SNAP_GRID_SIZE;
      }
      cursorDisplay.textContent = `X: ${gridPt.x.toFixed(1)}, Y: ${gridPt.y.toFixed(1)}`;

      draw();
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      if (touchInitialDist > 0) {
        const factor = dist / touchInitialDist;
        state.zoom = Math.max(0.2, Math.min(50.0, touchInitialZoom * factor));
        draw();
      }
    }
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    if (state.isPanning) {
      state.isPanning = false;
      if (!touchHasDragged && state.drawNodeActive && e.changedTouches.length === 1) {
        const t = e.changedTouches[0];
        const rect = canvas.getBoundingClientRect();
        const mx = t.clientX - rect.left;
        const my = t.clientY - rect.top;
        let gridPt = canvasToGrid(mx, my);

        if (state.gridSnap) {
          gridPt.x = Math.round(gridPt.x / SNAP_GRID_SIZE) * SNAP_GRID_SIZE;
          gridPt.y = Math.round(gridPt.y / SNAP_GRID_SIZE) * SNAP_GRID_SIZE;
        }

        handleDrawingPlacement(gridPt);
      }
    }
  });
}

/**
 * Places vertices on drawing paths and evaluates loop closures.
 */
function handleDrawingPlacement(pt) {
  if (state.drawingMode === 'OUTER') {
    if (state.outerClosed) return;

    // Check click on first point to close loop
    if (state.outerBoundary.length >= 3) {
      const firstC = gridToCanvas(state.outerBoundary[0].x, state.outerBoundary[0].y);
      const clickedC = gridToCanvas(pt.x, pt.y);
      const dist = Math.hypot(firstC.x - clickedC.x, firstC.y - clickedC.y);

      if (dist < CLOSE_PX_LIMIT) {
        state.outerClosed = true;
        shiftShapeToTop();
        
        btnDrawHole.disabled = false;
        state.drawingMode = 'HOLE';
        btnDrawHole.classList.add('active');
        btnDrawOuter.classList.remove('active');
        
        updateCoordsLists();
        btnFitZoom.click();
        return;
      }
    }

    // Add unique point
    const duplicate = state.outerBoundary.some(v => v.x === pt.x && v.y === pt.y);
    if (!duplicate) {
      state.outerBoundary.push(pt);
      updateCoordsLists();
      draw();
    }
  } else if (state.drawingMode === 'HOLE') {
    if (!state.outerClosed) return;

    if (state.activeHole.length >= 3) {
      const firstC = gridToCanvas(state.activeHole[0].x, state.activeHole[0].y);
      const clickedC = gridToCanvas(pt.x, pt.y);
      const dist = Math.hypot(firstC.x - clickedC.x, firstC.y - clickedC.y);

      if (dist < CLOSE_PX_LIMIT) {
        // Validate hole layout
        const validation = validateNewHole(state.activeHole, state.outerBoundary, state.holes);
        if (validation.valid) {
          state.holes.push([...state.activeHole]);
          state.activeHole = [];
        } else {
          alert(`${t('alert.invalidHole')} ${validation.reason}`);
          state.activeHole = [];
        }
        updateCoordsLists();
        draw();
        return;
      }
    }

    const duplicate = state.activeHole.some(v => v.x === pt.x && v.y === pt.y);
    if (!duplicate) {
      state.activeHole.push(pt);
      updateCoordsLists();
      draw();
    }
  }
}

// --- DELETE VERTICES OR HOLES ---

document.body.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-delete-pt');
  if (!btn) return;

  const type = btn.getAttribute('data-type');
  const index = parseInt(btn.getAttribute('data-index'));

  if (type === 'outer') {
    // Delete outer boundary resets shape closure
    state.outerBoundary.splice(index, 1);
    state.outerClosed = false;
    btnDrawHole.disabled = true;
    btnDrawHole.classList.remove('active');
    btnDrawOuter.classList.add('active');
    state.drawingMode = 'OUTER';
  } else if (type === 'hole') {
    state.holes.splice(index, 1);
  }

  updateCoordsLists();
  draw();
});

// --- ACCORDION HEADER EXPANSION ---

document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    item.classList.toggle('expanded');
  });
});

// --- CONTROL PANEL TRIGGERS ---

// Tool select toggles
btnDrawOuter.addEventListener('click', () => {
  if (state.outerClosed) return; // cannot edit outer if closed in this tool draft
  state.drawingMode = 'OUTER';
  btnDrawOuter.classList.add('active');
  btnDrawHole.classList.remove('active');
});

btnDrawHole.addEventListener('click', () => {
  if (!state.outerClosed) return;
  state.drawingMode = 'HOLE';
  btnDrawHole.classList.add('active');
  btnDrawOuter.classList.remove('active');
});

// Clear current button
btnClearCurrent.addEventListener('click', () => {
  if (state.drawingMode === 'OUTER') {
    state.outerBoundary = [];
    state.outerClosed = false;
    btnDrawHole.disabled = true;
  } else {
    state.activeHole = [];
  }
  updateCoordsLists();
  draw();
});

// Reset all button
btnResetAll.addEventListener('click', () => {
  state.outerBoundary = [];
  state.outerClosed = false;
  state.holes = [];
  state.activeHole = [];
  state.drawingMode = 'OUTER';
  
  btnDrawHole.disabled = true;
  btnDrawHole.classList.remove('active');
  btnDrawOuter.classList.add('active');
  
  // Reset Zoom/Pan to span -20 to 20 range
  setInitialViewport();

  updateCoordsLists();
  draw();
});

// Fit Zoom action
btnFitZoom.addEventListener('click', () => {
  if (state.outerBoundary.length === 0) return;
  
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  state.outerBoundary.forEach(v => {
    if (v.x < minX) minX = v.x;
    if (v.x > maxX) maxX = v.x;
    if (v.y < minY) minY = v.y;
    if (v.y > maxY) maxY = v.y;
  });

  const W = maxX - minX;
  const H = maxY - minY;

  // Find optimal zoom (scaled down by 1.5 for additional zoom-out margin)
  const zoomX = (canvas.width - 120) / (W > 0 ? W : 10);
  const zoomY = (canvas.height - 120) / (H > 0 ? H : 10);
  state.zoom = Math.max(0.5, Math.min(25.0, Math.min(zoomX, zoomY))) / 1.5;

    // Center on composite bounding center
    const targetCX = (minX + maxX) / 2;
    const targetCY = (minY + maxY) / 2;
    
    const multX = state.reverseX ? -1 : 1;
    const multY = state.reverseY ? -1 : 1;
    state.panX = -targetCX * state.zoom * multX;
    state.panY = -targetCY * state.zoom * multY;

  draw();
});

/**
 * Zooms the view in or out relative to the center of the canvas viewport,
 * adjusting the panning offset to keep the center coordinate fixed.
 */
function zoomRelativeToCenter(factor) {
  const oldZoom = state.zoom;
  state.zoom = Math.max(0.1, Math.min(100.0, state.zoom * factor));
  const ratio = state.zoom / oldZoom;
  state.panX *= ratio;
  state.panY *= ratio;
  draw();
}

if (btnZoomIn) {
  btnZoomIn.addEventListener('click', () => {
    zoomRelativeToCenter(1.2);
  });
}

if (btnZoomOut) {
  btnZoomOut.addEventListener('click', () => {
    zoomRelativeToCenter(1 / 1.2);
  });
}



// Snap grid toggles
toggleGridSnap.addEventListener('change', (e) => {
  state.gridSnap = e.target.checked;
});

// Visual toggles checkboxes
chkCentroid.addEventListener('change', e => { state.showCentroid = e.target.checked; draw(); });
chkPrincipal.addEventListener('change', e => { state.showPrincipal = e.target.checked; draw(); });
chkEna.addEventListener('change', e => { state.showENA = e.target.checked; draw(); });
chkPna.addEventListener('change', e => { state.showPNA = e.target.checked; draw(); });
chkKern.addEventListener('change', e => { state.showKern = e.target.checked; draw(); });

if (toggleReverseX) {
  toggleReverseX.addEventListener('change', e => {
    state.reverseX = e.target.checked;
    draw();
  });
}
if (toggleReverseY) {
  toggleReverseY.addEventListener('change', e => {
    state.reverseY = e.target.checked;
    if (state.outerBoundary.length > 0) {
      btnFitZoom.click();
    } else {
      draw();
    }
  });
}

// Light/Dark Theme toggle trigger
btnThemeToggle.addEventListener('click', () => {
  const body = document.body;
  if (body.classList.contains('dark-theme')) {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    state.theme = 'light';
  } else {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    state.theme = 'dark';
  }
  draw();
});

// --- SHAPE PRESET TEMPLATES BUILDER ---

function loadPreset(outerPoints, holesList) {
  state.outerBoundary = [...outerPoints];
  state.holes = holesList ? holesList.map(h => [...h]) : [];
  state.activeHole = [];
  
  // Align top fiber of coordinates with x-axis (y=0)
  shiftShapeToTop();
  
  state.outerClosed = true;
  
  // Set draw mode to hole
  btnDrawHole.disabled = false;
  btnDrawHole.classList.add('active');
  btnDrawOuter.classList.remove('active');
  state.drawingMode = 'HOLE';

  // Open both accordions
  document.getElementById('header-outer-coords').parentElement.classList.add('expanded');
  document.getElementById('accordion-holes').classList.add('expanded');

  // Trigger fit view
  updateCoordsLists();
  btnFitZoom.click();
}

// --- SHAPE PRESETS CONFIGURATION MODAL CONTROLLER ---

const presetButtons = {
  'preset-rect': 'rect',
  'preset-hollow-rect': 'hollow-rect',
  'preset-i-beam': 'i-beam',
  'preset-t-beam': 't-beam',
  'preset-circular': 'circular',
  'preset-l-angle': 'l-angle'
};

Object.entries(presetButtons).forEach(([btnId, shapeKey]) => {
  const btn = document.getElementById(btnId);
  if (btn) {
    btn.addEventListener('click', () => {
      openPresetModal(shapeKey);
    });
  }
});

function openPresetModal(shapeKey) {
  currentSelectedShape = shapeKey;
  const config = shapeConfigurations[shapeKey];
  if (!config) return;

  presetModalTitle.textContent = t(config.titleKey);
  presetFieldsContainer.innerHTML = '';

  config.fields.forEach(field => {
    const row = document.createElement('div');
    row.className = 'form-row';
    row.innerHTML = `
      <label for="${field.id}">${t(field.labelKey)}</label>
      <input type="${field.type}" id="${field.id}" value="${field.default}" required>
    `;
    presetFieldsContainer.appendChild(row);
  });

  presetModal.style.display = 'flex';
}

function closePresetModal() {
  if (presetModal) {
    presetModal.style.display = 'none';
  }
  currentSelectedShape = null;
}

if (btnClosePresetModal) {
  btnClosePresetModal.addEventListener('click', closePresetModal);
}

if (presetModal) {
  presetModal.addEventListener('click', (e) => {
    if (e.target === presetModal) {
      closePresetModal();
    }
  });
}

if (btnPresetDefault) {
  btnPresetDefault.addEventListener('click', () => {
    if (!currentSelectedShape) return;
    const config = shapeConfigurations[currentSelectedShape];
    if (config) {
      const data = config.generateDefault();
      if (data) {
        loadPreset(data.outer, data.holes);
      }
    }
    closePresetModal();
  });
}

if (presetCustomForm) {
  presetCustomForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentSelectedShape) return;
    const config = shapeConfigurations[currentSelectedShape];
    if (config) {
      const values = {};
      config.fields.forEach(field => {
        const input = document.getElementById(field.id);
        values[field.id] = parseFloat(input.value);
      });

      const data = config.generateCustom(values);
      if (data) {
        loadPreset(data.outer, data.holes);
        closePresetModal();
      }
    }
  });
}

// --- INIT APP ---

function init() {
  window.addEventListener('resize', resizeCanvas);
  setupCanvasEvents();
  resizeCanvas();
  setInitialViewport();
  updateCoordsLists();
  draw();
}

// Fire initialization
init();

// Close Modal on Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePresetModal();
    closeManualModal();
    if (typeof closeContactModal === 'function') closeContactModal();
  }
});

// Manual coordinate inputs event listeners
if (btnManualAdd) {
  btnManualAdd.addEventListener('click', () => {
    const xVal = parseFloat(inputManualX.value);
    const yVal = parseFloat(inputManualY.value);
    
    if (isNaN(xVal) || isNaN(yVal)) {
      alert(t('alert.invalidCoords'));
      return;
    }
    
    const pt = { x: xVal, y: yVal };
    
    if (state.drawingMode === 'OUTER') {
      if (state.outerClosed) return;
      const duplicate = state.outerBoundary.some(v => v.x === pt.x && v.y === pt.y);
      if (!duplicate) {
        state.outerBoundary.push(pt);
        closeOverlay();
      }
    } else if (state.drawingMode === 'HOLE') {
      if (!state.outerClosed) return;
      const duplicate = state.activeHole.some(v => v.x === pt.x && v.y === pt.y);
      if (!duplicate) {
        state.activeHole.push(pt);
      }
    }
    
    inputManualX.value = '';
    inputManualY.value = '';
    inputManualX.focus();
    
    updateCoordsLists();
    draw();
  });
}

// Enter trigger on manual inputs
[inputManualX, inputManualY].forEach(input => {
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        btnManualAdd.click();
      }
    });
  }
});

// Close loop manually trigger
if (btnManualClose) {
  btnManualClose.addEventListener('click', () => {
    if (state.drawingMode === 'OUTER') {
      if (state.outerBoundary.length < 3 || state.outerClosed) return;
      state.outerClosed = true;
      shiftShapeToTop();
      
      btnDrawHole.disabled = false;
      state.drawingMode = 'HOLE';
      btnDrawHole.classList.add('active');
      btnDrawOuter.classList.remove('active');

      updateCoordsLists();
      btnFitZoom.click();
      return;
    } else if (state.drawingMode === 'HOLE') {
      if (state.activeHole.length < 3 || !state.outerClosed) return;
      
      const validation = validateNewHole(state.activeHole, state.outerBoundary, state.holes);
      if (validation.valid) {
        state.holes.push([...state.activeHole]);
        state.activeHole = [];
      } else {
        alert(`${t('alert.invalidHole')} ${validation.reason}`);
        state.activeHole = [];
      }
    }
    
    updateCoordsLists();
    draw();
  });
}

// Reference Axes Note Panel Close Handler
const refAxesNotePanel = document.getElementById('ref-axes-note-panel');
const btnCloseAxesNote = document.getElementById('btn-close-axes-note');

if (btnCloseAxesNote && refAxesNotePanel) {
  btnCloseAxesNote.addEventListener('click', () => {
    refAxesNotePanel.style.opacity = 0;
    refAxesNotePanel.style.pointerEvents = 'none';
  });
}

// --- UNDO ENGINE ---

function undo() {
  if (state.drawingMode === 'HOLE') {
    if (state.activeHole.length > 0) {
      // 1. Remove last point of current hole in progress
      state.activeHole.pop();
    } else if (state.holes.length > 0) {
      // 2. Revert the last completed hole back to active drawing state
      state.activeHole = state.holes.pop();
    } else {
      // 3. Revert back to outer drawing mode
      state.outerClosed = false;
      state.drawingMode = 'OUTER';
      btnDrawHole.disabled = true;
      btnDrawHole.classList.remove('active');
      btnDrawOuter.classList.add('active');
    }
  } else if (state.drawingMode === 'OUTER') {
    if (state.outerClosed) {
      state.outerClosed = false;
    } else if (state.outerBoundary.length > 0) {
      // 4. Remove last point of outer boundary
      state.outerBoundary.pop();
    }
  }

  updateCoordsLists();
  draw();
}

if (btnUndo) {
  btnUndo.addEventListener('click', undo);
}

// Bind Ctrl+Z global shortcut
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') {
      return; // Let standard text undo work inside inputs
    }
    e.preventDefault();
    undo();
  }
});

// --- LANGUAGE TOGGLE ---
const btnLangToggle = document.getElementById('btn-lang-toggle');
if (btnLangToggle) {
  btnLangToggle.addEventListener('click', () => {
    state.lang = state.lang === 'en' ? 'pl' : 'en';
    currentLang = state.lang;
    applyLanguage(state.lang);
    // Re-render dynamic content that uses t() calls
    updateCoordsLists();
    updateCloseLoopButtonState();
    if (typeof updateSidebarButtonUI === 'function') updateSidebarButtonUI();
    if (typeof updateResultsButtonUI === 'function') updateResultsButtonUI();
  });
}

// --- CONTACT & FEEDBACK MODAL ---
const btnContact = document.getElementById('btn-contact');
const contactModal = document.getElementById('contact-modal');
const btnCloseContactModal = document.getElementById('btn-close-contact-modal');
const btnCloseContactBottom = document.getElementById('btn-close-contact-bottom');
const btnCopyEmail = document.getElementById('btn-copy-email');
const btnCopyEmailText = document.getElementById('btn-copy-email-text');
const toastNotification = document.getElementById('toast-notification');

let toastTimeout = null;
function showToast(message, duration = 3000) {
  if (!toastNotification) return;
  toastNotification.textContent = message;
  toastNotification.classList.add('show');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastNotification.classList.remove('show');
  }, duration);
}

function openContactModal() {
  if (contactModal) {
    applyLanguage(state.lang);
    contactModal.style.display = 'flex';
  }
}

function closeContactModal() {
  if (contactModal) {
    contactModal.style.display = 'none';
  }
}

function copyEmailToClipboard() {
  const email = 'pengyuan.xia.dokt@pw.edu.pl';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(() => {
      showToast(t('toast.emailCopied') || '📋 Email copied to clipboard!');
      if (btnCopyEmailText) {
        btnCopyEmailText.textContent = t('contact.copiedBtn') || '✓ Copied!';
        setTimeout(() => {
          if (btnCopyEmailText) btnCopyEmailText.textContent = t('contact.copyBtn') || '📋 Copy';
        }, 2200);
      }
    }).catch(() => {
      showToast(email);
    });
  } else {
    showToast(email);
  }
}

if (btnContact) btnContact.addEventListener('click', openContactModal);
if (btnCloseContactModal) btnCloseContactModal.addEventListener('click', closeContactModal);
if (btnCloseContactBottom) btnCloseContactBottom.addEventListener('click', closeContactModal);
if (btnCopyEmail) btnCopyEmail.addEventListener('click', copyEmailToClipboard);
if (contactModal) {
  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) closeContactModal();
  });
}

// --- MANUAL MODAL ---
const btnManual = document.getElementById('btn-manual');
const manualModal = document.getElementById('manual-modal');
const btnCloseManual = document.getElementById('btn-close-manual');
const btnCloseManualBottom = document.getElementById('btn-close-manual-bottom');

function openManualModal() {
  if (manualModal) {
    applyLanguage(state.lang); // ensure manual content is in current language
    manualModal.style.display = 'flex';
  }
}

function closeManualModal() {
  if (manualModal) {
    manualModal.style.display = 'none';
  }
}

if (btnManual) btnManual.addEventListener('click', openManualModal);
if (btnCloseManual) btnCloseManual.addEventListener('click', closeManualModal);
if (btnCloseManualBottom) btnCloseManualBottom.addEventListener('click', closeManualModal);
if (manualModal) {
  manualModal.addEventListener('click', (e) => {
    if (e.target === manualModal) closeManualModal();
  });
}

// --- DRAW NODE TOGGLE ---
const btnDrawNode = document.getElementById('btn-draw-node');
const drawNodeHint = document.getElementById('draw-node-hint');
if (btnDrawNode) {
  btnDrawNode.addEventListener('click', () => {
    state.drawNodeActive = !state.drawNodeActive;
    btnDrawNode.classList.toggle('active', state.drawNodeActive);
    if (drawNodeHint) drawNodeHint.classList.toggle('hidden', state.drawNodeActive);
  });
}

// --- SIDEBAR FOLD / UNFOLD LOGIC (MANUAL TOGGLE, NEVER AUTO-HIDE) ---
const mainGrid = document.querySelector('.app-main-grid');
const leftPanel = document.getElementById('left-panel');
const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
const btnHeaderSidebar = document.getElementById('btn-header-sidebar');
const btnCollapseSidebar = document.getElementById('btn-collapse-sidebar');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');

let isSidebarFolded = false;

function isMobile() {
  return window.innerWidth <= 768;
}

function updateSidebarButtonUI() {
  if (!btnToggleSidebar) return;
  btnToggleSidebar.classList.toggle('active', isSidebarFolded);
  const arrow = btnToggleSidebar.querySelector('.sidebar-toggle-arrow');
  const text = btnToggleSidebar.querySelector('.sidebar-toggle-text');
  if (arrow) arrow.textContent = isSidebarFolded ? '▶' : '◀';
  if (text) text.textContent = isSidebarFolded ? t('sidebar.unfold') : t('sidebar.fold');
  btnToggleSidebar.title = isSidebarFolded ? t('tip.unfoldSidebar') : t('tip.foldSidebar');
}

function foldSidebar() {
  isSidebarFolded = true;
  if (isMobile()) {
    if (leftPanel) leftPanel.classList.add('mobile-folded');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('hidden');
  } else {
    if (mainGrid) mainGrid.classList.add('sidebar-collapsed');
    animateCanvasResize();
  }
  updateSidebarButtonUI();
}

function unfoldSidebar() {
  isSidebarFolded = false;
  if (isMobile()) {
    if (leftPanel) leftPanel.classList.remove('mobile-folded');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('hidden');
  } else {
    if (mainGrid) mainGrid.classList.remove('sidebar-collapsed');
    animateCanvasResize();
  }
  updateSidebarButtonUI();
}

function toggleSidebar() {
  if (isSidebarFolded) {
    unfoldSidebar();
  } else {
    foldSidebar();
  }
}

function animateCanvasResize() {
  const startTime = performance.now();
  function loop() {
    resizeCanvas();
    if (performance.now() - startTime < 350) {
      requestAnimationFrame(loop);
    }
  }
  requestAnimationFrame(loop);
}

if (btnToggleSidebar) btnToggleSidebar.addEventListener('click', toggleSidebar);
if (btnHeaderSidebar) btnHeaderSidebar.addEventListener('click', toggleSidebar);
if (btnCollapseSidebar) btnCollapseSidebar.addEventListener('click', foldSidebar);
if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', foldSidebar);

// Responsive window listener
window.addEventListener('resize', () => {
  if (!isMobile()) {
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('hidden');
    if (leftPanel) leftPanel.classList.remove('mobile-folded');
    if (isSidebarFolded && mainGrid) {
      mainGrid.classList.add('sidebar-collapsed');
    }
  }
  resizeCanvas();
});

// ResizeObserver for automatic canvas resizing when container dimensions change
if (window.ResizeObserver && container) {
  const ro = new ResizeObserver(() => {
    resizeCanvas();
  });
  ro.observe(container);
}

// --- RESULTS DASHBOARD FOLD / UNFOLD LOGIC ---
const resultsDashboard = document.getElementById('results-dashboard');
const btnToggleResults = document.getElementById('btn-toggle-results');
const btnFoldResultsHeader = document.getElementById('btn-fold-results-header');

let isResultsFolded = false;

function updateResultsButtonUI() {
  if (!btnToggleResults) return;
  btnToggleResults.classList.toggle('active', isResultsFolded);
  const arrow = btnToggleResults.querySelector('.results-toggle-arrow');
  const text = btnToggleResults.querySelector('.results-toggle-text');
  if (arrow) arrow.textContent = isResultsFolded ? '▼' : '▲';
  if (text) text.textContent = isResultsFolded ? t('results.unfoldData') : t('results.foldData');
  btnToggleResults.title = isResultsFolded ? t('tip.unfoldResults') : t('tip.foldResults');
}

function foldResults() {
  isResultsFolded = true;
  if (resultsDashboard) resultsDashboard.classList.add('folded');
  updateResultsButtonUI();
  animateCanvasResize();
}

function unfoldResults() {
  isResultsFolded = false;
  if (resultsDashboard) resultsDashboard.classList.remove('folded');
  updateResultsButtonUI();
  animateCanvasResize();
}

function toggleResults() {
  if (isResultsFolded) {
    unfoldResults();
  } else {
    foldResults();
  }
}

if (btnToggleResults) btnToggleResults.addEventListener('click', toggleResults);
if (btnFoldResultsHeader) btnFoldResultsHeader.addEventListener('click', foldResults);

// --- INITIAL LANGUAGE APPLICATION ---
applyLanguage(state.lang);

