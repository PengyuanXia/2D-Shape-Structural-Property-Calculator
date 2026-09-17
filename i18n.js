/**
 * i18n.js — Internationalization System for SecCalc
 * Supports: English (en) and Polish (pl)
 */

// Current language state
let currentLang = 'en';

// --- TRANSLATION DICTIONARY ---
const translations = {
  en: {
    // Page title
    'page.title': 'SecCalc // 2D Section Property Calculator',
    'header.subtitle': '2D Shape Structural Property Calculator',
    'header.backToHub': '← Back to Hub',

    // Sidebar
    'sidebar.title': 'Controls & Presets',
    'sidebar.toggle': 'Controls',
    'sidebar.fold': 'Fold Controls',
    'sidebar.unfold': 'Unfold Controls',
    'sidebar.foldPanel': 'Fold',

    // Preset Templates
    'presets.title': 'Preset Templates',
    'preset.rect': 'Rectangle',
    'preset.hollowRect': 'Box Section',
    'preset.iBeam': 'I-Beam',
    'preset.tBeam': 'T-Beam',
    'preset.circular': 'Circular Tube',
    'preset.lAngle': 'L-Angle',

    // Drawing Tools
    'tools.title': 'Drawing Tools',
    'tool.outerShape': 'Outer Shape',
    'tool.addHole': 'Add Hole',
    'tools.manualLabel': 'Manually Add Coordinate:',
    'tools.add': 'Add',
    'tools.closeLoop': 'Close Current Loop',
    'tools.closeOuterLoop': 'Close Outer Loop',
    'tools.closeActiveHole': 'Close Active Hole',

    // Action buttons
    'action.clearActive': 'Cancel Active (Esc)',
    'action.clearCanvas': 'Clear Canvas',
    'action.clearAll': 'Clear Canvas',
    'action.undo': 'Undo (Ctrl+Z)',
    'tip.undo': 'Undo last step (Ctrl+Z)',
    'tip.clearCanvas': 'Clear entire canvas',
    'tip.cancelActive': 'Cancel active drawing (Esc)',

    // Visualizations
    'viz.title': 'Visualization Items',
    'viz.centroid': 'Centroid (C)',
    'viz.principalAxes': 'Principal Axes (1-2)',
    'viz.ena': 'Elastic Neutral Axis (ENA)',
    'viz.pna': 'Plastic Neutral Axis (PNA)',
    'viz.kern': 'Cross-Section Core (Kern)',

    // Shape Vertices
    'coords.title': 'Shape Vertices',
    'coords.outerBoundary': 'Outer Boundary',
    'coords.holes': 'Holes',
    'coords.emptyOuter': 'Click on the grid to add points',
    'coords.emptyHoles': 'No holes added yet',
    'coords.pts': 'pts',
    'coords.holesUnit': 'holes',
    'coords.holeDrawing': 'Hole (Drawing...',

    // Canvas toolbar
    'canvas.cursor': 'Cursor:',
    'canvas.snapToGrid': 'Snap to Grid',
    'canvas.fitShape': 'Fit Shape',
    'canvas.drawNode': 'Draw Node',
    'canvas.drawNodeHint': 'Enable "Draw Node" to place points',

    // HUD
    'hud.axisDirection': 'Axis Direction',
    'hud.reverseX': 'Reverse X (+ Left)',
    'hud.reverseY': 'Reverse Y (+ Up)',
    'hud.refAxes': 'Reference Axes',
    'hud.refAxesNote': 'Note: J<sub>x</sub> & J<sub>y</sub> are derived about the reference axes x=0, y=0 (aligned with top fiber).',
    'hud.refAxesNote.us': 'Note: I<sub>x</sub> & I<sub>y</sub> are derived about the reference axes x=0, y=0 (aligned with top fiber).',

    // Standard Toggle & Toasts
    'standard.eu': 'EU (J, W)',
    'standard.us': 'US (I, S)',
    'tip.standardToggle': 'Switch Standard (EU: J, W / US: I, S, Z)',
    'toast.standardEU': 'Switched to EU Standard (J, W)',
    'toast.standardUS': 'Switched to US / AISC Standard (I, S, Z)',

    // Result cards — labels & folding
    'results.title': 'Section Properties',
    'results.fold': 'Fold',
    'results.foldData': 'Fold Data',
    'results.unfoldData': 'Show Data',
    'tip.foldResults': 'Fold Section Data',
    'tip.unfoldResults': 'Show Section Data',
    'result.area.label': 'Area (A)',
    'result.centroid.label': 'Centroid (X, Y)',
    'result.ix.label': 'Moment of Inertia (J<sub>x</sub>)',
    'result.ix.label.us': 'Moment of Inertia (I<sub>x</sub>)',
    'result.iy.label': 'Moment of Inertia (J<sub>y</sub>)',
    'result.iy.label.us': 'Moment of Inertia (I<sub>y</sub>)',
    'result.ixy.label': 'Product of Inertia (J<sub>xy</sub>)',
    'result.ixy.label.us': 'Product of Inertia (I<sub>xy</sub>)',
    'result.theta.label': 'Principal Angle (θ<sub>p</sub>)',
    'result.i1.label': 'Max Principal Moment (J<sub>1</sub>)',
    'result.i1.label.us': 'Max Principal Moment (I<sub>1</sub>)',
    'result.i2.label': 'Min Principal Moment (J<sub>2</sub>)',
    'result.i2.label.us': 'Min Principal Moment (I<sub>2</sub>)',
    'result.wel.label': 'Elastic Section Modulus (W<sub>el</sub>)',
    'result.wel.label.us': 'Elastic Section Modulus (S<sub>el</sub>)',
    'result.wpl.label': 'Plastic Section Modulus (W<sub>pl</sub>)',
    'result.wpl.label.us': 'Plastic Section Modulus (Z<sub>pl</sub>)',

    // Result cards — descriptions
    'result.area.desc': 'Net area of the cross section',
    'result.centroid.desc': 'Center of mass coordinates',
    'result.ix.desc': 'Bending resistance about x-axis',
    'result.iy.desc': 'Bending resistance about y-axis',
    'result.ixy.desc': 'Indicates section asymmetry',
    'result.theta.desc': 'Rotation to principal axes',
    'result.i1.desc': 'Maximum bending stiffness',
    'result.i2.desc': 'Minimum bending stiffness',
    'result.wel.desc': 'Elastic bending resistance',
    'result.wpl.desc': 'Full plastic capacity',

    // Preset modal
    'modal.presetTitle': 'Preset Dimensions',
    'modal.useDefault': 'Use Default Dimensions',
    'modal.or': 'OR',
    'modal.customTitle': 'Configure Custom Dimensions',
    'modal.generate': 'Generate Custom Shape',

    // Preset configuration titles
    'preset.rect.title': 'Rectangle Settings',
    'preset.hollowRect.title': 'Box Section Settings',
    'preset.iBeam.title': 'I-Beam Settings',
    'preset.tBeam.title': 'T-Beam Settings',
    'preset.circular.title': 'Circular Tube Settings',
    'preset.lAngle.title': 'L-Angle Settings',

    // Preset field labels
    'field.width': 'Width (b)',
    'field.height': 'Height (h)',
    'field.outerWidth': 'Outer Width (B)',
    'field.outerHeight': 'Outer Height (H)',
    'field.innerWidth': 'Inner Width (b)',
    'field.innerHeight': 'Inner Height (h)',
    'field.overallHeight': 'Overall Height (H)',
    'field.webWidth': 'Web Width (tw)',
    'field.topFlangeWidth': 'Top Flange Width (bft)',
    'field.topFlangeThickness': 'Top Flange Thickness (tft)',
    'field.botFlangeWidth': 'Bottom Flange Width (bfb)',
    'field.botFlangeThickness': 'Bottom Flange Thickness (tfb)',
    'field.flangeWidth': 'Flange Width (bf)',
    'field.flangeThickness': 'Flange Thickness (tf)',
    'field.webHeight': 'Web Height (hw)',
    'field.outerRadius': 'Outer Radius (R)',
    'field.innerRadius': 'Inner Radius (r)',
    'field.vertLegHeight': 'Vertical Leg Height (H)',
    'field.vertLegThick': 'Vertical Leg Thickness (tv)',
    'field.horizLegWidth': 'Horizontal Leg Width (B)',
    'field.horizLegThick': 'Horizontal Leg Thickness (th)',

    // Alert / validation messages
    'alert.dimPositive': 'Dimensions must be positive values.',
    'alert.innerSmaller': 'Inner dimensions (b, h) must be strictly smaller than outer dimensions (B, H).',
    'alert.flangeExceed': 'Flange thicknesses combined cannot exceed overall height.',
    'alert.webSmallerFlanges': 'Web width must be smaller than flange widths.',
    'alert.webSmallerFlange': 'Web width must be smaller than flange width.',
    'alert.radiiPositive': 'Radii must be positive values.',
    'alert.innerRadiusSmaller': 'Inner radius must be strictly smaller than outer radius.',
    'alert.legThickSmaller': 'Leg thicknesses must be smaller than leg widths.',
    'alert.invalidCoords': 'Please enter valid numerical values for X and Y.',
    'alert.invalidHole': 'Invalid Hole Geometry:',

    // Tooltips
    'tip.toggleSidebar': 'Toggle Controls Panel',
    'tip.collapseSidebar': 'Fold Panel',
    'tip.foldSidebar': 'Fold Controls Panel',
    'tip.unfoldSidebar': 'Unfold Controls Panel',
    'tip.themeToggle': 'Toggle Light/Dark Mode',
    'tip.sponsor': 'Buy Me a Coffee (Ko-fi)',
    'tip.manual': 'User Manual',
    'tip.langToggle': 'Switch Language',
    'tip.addPoint': 'Add Point (Enter)',
    'tip.undo': 'Undo last step (Ctrl+Z)',
    'tip.zoomIn': 'Zoom In',
    'tip.zoomOut': 'Zoom Out',
    'tip.deletePoint': 'Delete Point',
    'tip.deleteHole': 'Delete Hole',
    'tip.dismiss': 'Dismiss Note',
    'tip.copyEmail': 'Copy email address',
    'tip.sendEmail': 'Send Email',
    'tip.close': 'Close',

    // Contact & Feedback
    'contact.btn': 'Contact',
    'contact.tooltip': 'Contact & Feedback',
    'contact.modalTitle': 'Contact & Feedback',
    'contact.authorSub': 'Doctoral Researcher • Warsaw University of Technology (PW)',
    'contact.emailTitle': 'University Email',
    'contact.githubTitle': 'GitHub Repository',
    'contact.githubSub': 'Bug reports & feature requests',
    'contact.kofiTitle': 'Buy Me a Coffee',
    'contact.kofiSub': 'Enjoying the ad-free experience? Tip a coffee to keep it running!',
    'header.missionNote': '100% Free & Ad-Free — Tip a coffee to keep it running!',
    'contact.copyBtn': '📋 Copy',
    'contact.copiedBtn': '✓ Copied!',
    'contact.sendBtn': '✉️ Send',
    'toast.emailCopied': '📋 Email copied to clipboard!',

    // Manual content
    'manual.title': 'User Manual',
    'manual.gettingStarted.title': 'Getting Started',
    'manual.gettingStarted.content': `
      <p><strong>SecCalc</strong> is a 2D cross-section property calculator for structural engineering. Draw or select a shape to instantly compute geometric and structural properties.</p>
      <h4>Quick Start</h4>
      <ol>
        <li>Choose a <strong>Preset Template</strong> (Rectangle, I-Beam, etc.) from the left panel, or</li>
        <li>Click directly on the <strong>canvas grid</strong> to draw a custom shape point-by-point.</li>
        <li>Close the shape by clicking near the first point, or press the <strong>Close Loop</strong> button.</li>
        <li>Calculated properties appear automatically in the results panel below the canvas.</li>
      </ol>
    `,
    'manual.drawing.title': 'Drawing Shapes',
    'manual.drawing.content': `
      <h4>Outer Boundary</h4>
      <p>Click on the canvas to place vertices. The shape will close when you click near the first point. You can also type exact coordinates in the manual input fields.</p>
      <h4>Adding Holes</h4>
      <p>After closing the outer boundary, switch to <strong>Add Hole</strong> mode. Draw a closed polygon inside the outer shape to subtract material (e.g., for hollow sections).</p>
      <h4>Presets</h4>
      <p>Use preset templates with default or custom dimensions. Click a preset button, then choose default values or enter your own measurements.</p>
    `,
    'manual.controls.title': 'Controls & Shortcuts',
    'manual.controls.content': `
      <table>
        <tr><td><kbd>Ctrl</kbd>+<kbd>Z</kbd></td><td>Undo last action</td></tr>
        <tr><td><kbd>Scroll Wheel</kbd></td><td>Zoom in / out</td></tr>
        <tr><td><kbd>Middle Click</kbd> + Drag</td><td>Pan the canvas</td></tr>
        <tr><td><kbd>Right Click</kbd> + Drag</td><td>Pan the canvas</td></tr>
        <tr><td><kbd>Enter</kbd></td><td>Add manually typed coordinate</td></tr>
      </table>
      <h4>Canvas Toolbar</h4>
      <p><strong>Snap to Grid</strong> — snaps clicked points to the nearest grid intersection. <strong>Fit Shape</strong> — auto-zooms to fit the entire shape in view. <strong>+/−</strong> buttons for manual zoom control.</p>
      <h4>Axis Controls</h4>
      <p>Toggle <strong>Reverse X</strong> or <strong>Reverse Y</strong> in the HUD overlay to change axis direction convention. Results are recalculated automatically.</p>
    `,
    'manual.results.title': 'Results Glossary',
    'manual.results.content': `
      <table>
        <tr><td><strong>Area (A)</strong></td><td>Net cross-sectional area (outer minus holes).</td></tr>
        <tr><td><strong>Centroid (X, Y)</strong></td><td>Coordinates of the geometric center of mass.</td></tr>
        <tr><td><strong>J<sub>x</sub>, J<sub>y</sub></strong></td><td>Second moments of area about centroidal axes — measure of bending resistance.</td></tr>
        <tr><td><strong>J<sub>xy</sub></strong></td><td>Product of inertia — indicates section asymmetry. Zero for symmetric shapes.</td></tr>
        <tr><td><strong>θ<sub>p</sub></strong></td><td>Principal angle — rotation from reference axes to principal axes.</td></tr>
        <tr><td><strong>J<sub>1</sub>, J<sub>2</sub></strong></td><td>Maximum and minimum principal moments of inertia.</td></tr>
        <tr><td><strong>W<sub>el</sub></strong></td><td>Elastic Section Modulus — measure of elastic bending resistance (Wel = J / z_max).</td></tr>
        <tr><td><strong>W<sub>pl</sub></strong></td><td>Plastic Section Modulus — measure of full plastic bending capacity (Wpl = S1 + S2).</td></tr>
        <tr><td><strong>Kern</strong></td><td>Cross-section core — region where load application produces no tension.</td></tr>
      </table>
    `,
    'manual.results.content.us': `
      <table>
        <tr><td><strong>Area (A)</strong></td><td>Net cross-sectional area (outer minus holes).</td></tr>
        <tr><td><strong>Centroid (X, Y)</strong></td><td>Coordinates of the geometric center of mass.</td></tr>
        <tr><td><strong>I<sub>x</sub>, I<sub>y</sub></strong></td><td>Moments of inertia about centroidal axes — measure of bending resistance.</td></tr>
        <tr><td><strong>I<sub>xy</sub></strong></td><td>Product of inertia — indicates section asymmetry. Zero for symmetric shapes.</td></tr>
        <tr><td><strong>θ<sub>p</sub></strong></td><td>Principal angle — rotation from reference axes to principal axes.</td></tr>
        <tr><td><strong>I<sub>1</sub>, I<sub>2</sub></strong></td><td>Maximum and minimum principal moments of inertia.</td></tr>
        <tr><td><strong>S<sub>el</sub></strong></td><td>Elastic Section Modulus — measure of elastic bending resistance (Sel = I / z_max).</td></tr>
        <tr><td><strong>Z<sub>pl</sub></strong></td><td>Plastic Section Modulus — measure of full plastic bending capacity (Zpl = S1 + S2).</td></tr>
        <tr><td><strong>Kern</strong></td><td>Cross-section core — region where load application produces no tension.</td></tr>
      </table>
    `,
    'manual.close': 'Close',
  },

  pl: {
    // Page title
    'page.title': 'SecCalc // Kalkulator właściwości przekroju 2D',
    'header.subtitle': 'Kalkulator właściwości przekroju 2D',
    'header.backToHub': '← Powrót do Hub',

    // Sidebar
    'sidebar.title': 'Sterowanie i szablony',
    'sidebar.toggle': 'Sterowanie',
    'sidebar.fold': 'Zwiń panel',
    'sidebar.unfold': 'Rozwiń panel',
    'sidebar.foldPanel': 'Zwiń',

    // Preset Templates
    'presets.title': 'Szablony przekrojów',
    'preset.rect': 'Prostokąt',
    'preset.hollowRect': 'Profil zamknięty',
    'preset.iBeam': 'Dwuteownik',
    'preset.tBeam': 'Teownik',
    'preset.circular': 'Rura okrągła',
    'preset.lAngle': 'Kątownik',

    // Drawing Tools
    'tools.title': 'Narzędzia rysowania',
    'tool.outerShape': 'Obrys zewnętrzny',
    'tool.addHole': 'Dodaj otwór',
    'tools.manualLabel': 'Wprowadź współrzędne ręcznie:',
    'tools.add': 'Dodaj',
    'tools.closeLoop': 'Zamknij kontur',
    'tools.closeOuterLoop': 'Zamknij obrys zewnętrzny',
    'tools.closeActiveHole': 'Zamknij otwór',

    // Action buttons
    'action.clearActive': 'Anuluj aktywny (Esc)',
    'action.clearCanvas': 'Wyczyść płótno',
    'action.clearAll': 'Wyczyść płótno',
    'action.undo': 'Cofnij (Ctrl+Z)',
    'tip.undo': 'Cofnij ostatni krok (Ctrl+Z)',
    'tip.clearCanvas': 'Wyczyść całe płótno',
    'tip.cancelActive': 'Anuluj aktywne rysowanie (Esc)',

    // Visualizations
    'viz.title': 'Elementy wizualizacji',
    'viz.centroid': 'Środek ciężkości (C)',
    'viz.principalAxes': 'Osie główne (1-2)',
    'viz.ena': 'Elastyczna oś obojętna (EOO)',
    'viz.pna': 'Plastyczna oś obojętna (POO)',
    'viz.kern': 'Rdzeń przekroju',

    // Shape Vertices
    'coords.title': 'Wierzchołki figury',
    'coords.outerBoundary': 'Obrys zewnętrzny',
    'coords.holes': 'Otwory',
    'coords.emptyOuter': 'Kliknij na siatkę, aby dodać punkty',
    'coords.emptyHoles': 'Brak otworów',
    'coords.pts': 'pkt',
    'coords.holesUnit': 'otw.',
    'coords.holeDrawing': 'Otwór (rysowanie...',

    // Canvas toolbar
    'canvas.cursor': 'Kursor:',
    'canvas.snapToGrid': 'Przyciągaj do siatki',
    'canvas.fitShape': 'Dopasuj widok',
    'canvas.drawNode': 'Rysuj węzeł',
    'canvas.drawNodeHint': 'Włącz „Rysuj węzeł", aby stawiać punkty',

    // HUD
    'hud.axisDirection': 'Kierunek osi',
    'hud.reverseX': 'Odwróć X (+ lewo)',
    'hud.reverseY': 'Odwróć Y (+ góra)',
    'hud.refAxes': 'Osie odniesienia',
    'hud.refAxesNote': 'Uwaga: J<sub>x</sub> i J<sub>y</sub> obliczone względem osi odniesienia x=0, y=0 (wyrównane z górnym włóknem).',
    'hud.refAxesNote.us': 'Uwaga: I<sub>x</sub> i I<sub>y</sub> obliczone względem osi odniesienia x=0, y=0 (wyrównane z górnym włóknem).',

    // Standard Toggle & Toasts
    'standard.eu': 'EU (J, W)',
    'standard.us': 'US (I, S)',
    'tip.standardToggle': 'Zmień system oznaczeń (EU: J, W / US: I, S, Z)',
    'toast.standardEU': 'Przełączono na normę EU (J, W)',
    'toast.standardUS': 'Przełączono na normę US / AISC (I, S, Z)',

    // Result cards — labels & folding
    'results.title': 'Właściwości przekroju',
    'results.fold': 'Zwiń',
    'results.foldData': 'Zwiń dane',
    'results.unfoldData': 'Pokaż dane',
    'tip.foldResults': 'Zwiń dane przekroju',
    'tip.unfoldResults': 'Pokaż dane przekroju',
    'result.area.label': 'Pole przekroju (A)',
    'result.centroid.label': 'Środek ciężkości (X, Y)',
    'result.ix.label': 'Moment bezwładności (J<sub>x</sub>)',
    'result.ix.label.us': 'Moment bezwładności (I<sub>x</sub>)',
    'result.iy.label': 'Moment bezwładności (J<sub>y</sub>)',
    'result.iy.label.us': 'Moment bezwładności (I<sub>y</sub>)',
    'result.ixy.label': 'Moment dewiacji (J<sub>xy</sub>)',
    'result.ixy.label.us': 'Moment dewiacji (I<sub>xy</sub>)',
    'result.theta.label': 'Kąt główny (θ<sub>p</sub>)',
    'result.i1.label': 'Maks. moment główny (J<sub>1</sub>)',
    'result.i1.label.us': 'Maks. moment główny (I<sub>1</sub>)',
    'result.i2.label': 'Min. moment główny (J<sub>2</sub>)',
    'result.i2.label.us': 'Min. moment główny (I<sub>2</sub>)',
    'result.wel.label': 'Sprężysty wskaźnik wytrzymałości (W<sub>el</sub>)',
    'result.wel.label.us': 'Sprężysty wskaźnik wytrzymałości (S<sub>el</sub>)',
    'result.wpl.label': 'Plastyczny wskaźnik wytrzymałości (W<sub>pl</sub>)',
    'result.wpl.label.us': 'Plastyczny wskaźnik wytrzymałości (Z<sub>pl</sub>)',

    // Result cards — descriptions
    'result.area.desc': 'Pole netto przekroju poprzecznego',
    'result.centroid.desc': 'Współrzędne środka ciężkości',
    'result.ix.desc': 'Odporność na zginanie wokół osi x',
    'result.iy.desc': 'Odporność na zginanie wokół osi y',
    'result.ixy.desc': 'Wskazuje asymetrię przekroju',
    'result.theta.desc': 'Obrót do osi głównych',
    'result.i1.desc': 'Maksymalna sztywność zginania',
    'result.i2.desc': 'Minimalna sztywność zginania',
    'result.wel.desc': 'Sprężysta odporność na zginanie',
    'result.wpl.desc': 'Plastyczna nośność przekroju',

    // Preset modal
    'modal.presetTitle': 'Wymiary szablonu',
    'modal.useDefault': 'Użyj wymiarów domyślnych',
    'modal.or': 'LUB',
    'modal.customTitle': 'Skonfiguruj wymiary niestandardowe',
    'modal.generate': 'Generuj przekrój niestandardowy',

    // Preset configuration titles
    'preset.rect.title': 'Ustawienia prostokąta',
    'preset.hollowRect.title': 'Ustawienia profilu zamkniętego',
    'preset.iBeam.title': 'Ustawienia dwuteownika',
    'preset.tBeam.title': 'Ustawienia teownika',
    'preset.circular.title': 'Ustawienia rury okrągłej',
    'preset.lAngle.title': 'Ustawienia kątownika',

    // Preset field labels
    'field.width': 'Szerokość (b)',
    'field.height': 'Wysokość (h)',
    'field.outerWidth': 'Szerokość zewn. (B)',
    'field.outerHeight': 'Wysokość zewn. (H)',
    'field.innerWidth': 'Szerokość wewn. (b)',
    'field.innerHeight': 'Wysokość wewn. (h)',
    'field.overallHeight': 'Całkowita wysokość (H)',
    'field.webWidth': 'Szerokość środnika (tw)',
    'field.topFlangeWidth': 'Szerokość półki górnej (bft)',
    'field.topFlangeThickness': 'Grubość półki górnej (tft)',
    'field.botFlangeWidth': 'Szerokość półki dolnej (bfb)',
    'field.botFlangeThickness': 'Grubość półki dolnej (tfb)',
    'field.flangeWidth': 'Szerokość półki (bf)',
    'field.flangeThickness': 'Grubość półki (tf)',
    'field.webHeight': 'Wysokość środnika (hw)',
    'field.outerRadius': 'Promień zewnętrzny (R)',
    'field.innerRadius': 'Promień wewnętrzny (r)',
    'field.vertLegHeight': 'Wysokość ramienia pionowego (H)',
    'field.vertLegThick': 'Grubość ramienia pionowego (tv)',
    'field.horizLegWidth': 'Szerokość ramienia poziomego (B)',
    'field.horizLegThick': 'Grubość ramienia poziomego (th)',

    // Alert / validation messages
    'alert.dimPositive': 'Wymiary muszą być wartościami dodatnimi.',
    'alert.innerSmaller': 'Wymiary wewnętrzne (b, h) muszą być mniejsze od wymiarów zewnętrznych (B, H).',
    'alert.flangeExceed': 'Sumaryczna grubość półek nie może przekraczać całkowitej wysokości.',
    'alert.webSmallerFlanges': 'Szerokość środnika musi być mniejsza od szerokości półek.',
    'alert.webSmallerFlange': 'Szerokość środnika musi być mniejsza od szerokości półki.',
    'alert.radiiPositive': 'Promienie muszą być wartościami dodatnimi.',
    'alert.innerRadiusSmaller': 'Promień wewnętrzny musi być mniejszy od promienia zewnętrznego.',
    'alert.legThickSmaller': 'Grubości ramion muszą być mniejsze od ich szerokości.',
    'alert.invalidCoords': 'Wprowadź poprawne wartości liczbowe dla X i Y.',
    'alert.invalidHole': 'Nieprawidłowa geometria otworu:',

    // Tooltips
    'tip.toggleSidebar': 'Pokaż/zwiń panel sterowania',
    'tip.collapseSidebar': 'Zwiń panel',
    'tip.foldSidebar': 'Zwiń panel sterowania',
    'tip.unfoldSidebar': 'Rozwiń panel sterowania',
    'tip.themeToggle': 'Przełącz tryb jasny/ciemny',
    'tip.sponsor': 'Postaw mi kawę (Ko-fi)',
    'tip.manual': 'Instrukcja obsługi',
    'tip.langToggle': 'Zmień język',
    'tip.addPoint': 'Dodaj punkt (Enter)',
    'tip.undo': 'Cofnij ostatni krok (Ctrl+Z)',
    'tip.zoomIn': 'Przybliż',
    'tip.zoomOut': 'Oddal',
    'tip.deletePoint': 'Usuń punkt',
    'tip.deleteHole': 'Usuń otwór',
    'tip.dismiss': 'Zamknij notatkę',
    'tip.copyEmail': 'Kopiuj adres e-mail',
    'tip.sendEmail': 'Wyślij e-mail',
    'tip.close': 'Zamknij',

    // Contact & Feedback
    'contact.btn': 'Kontakt',
    'contact.tooltip': 'Kontakt z autorem i opinie',
    'contact.modalTitle': 'Kontakt i Opinie',
    'contact.authorSub': 'Doktorant • Politechnika Warszawska (PW)',
    'contact.emailTitle': 'E-mail uczelniany',
    'contact.githubTitle': 'Repozytorium GitHub',
    'contact.githubSub': 'Zgłoszenia błędów i propozycje funkcji',
    'contact.kofiTitle': 'Postaw kawę',
    'contact.kofiSub': 'Cenisz brak reklam i otwarty dostęp? Postaw kawę i wesprzyj projekt!',
    'header.missionNote': '100% Darmowe i bez reklam — Wesprzyj rozwój projektu symboliczną kawą!',
    'contact.copyBtn': '📋 Kopiuj',
    'contact.copiedBtn': '✓ Skopiowano!',
    'contact.sendBtn': '✉️ Wyślij',
    'toast.emailCopied': '📋 Adres e-mail skopiowany do schowka!',

    // Manual content
    'manual.title': 'Instrukcja obsługi',
    'manual.gettingStarted.title': 'Rozpoczęcie pracy',
    'manual.gettingStarted.content': `
      <p><strong>SecCalc</strong> to kalkulator właściwości przekrojów 2D dla inżynierii konstrukcyjnej. Narysuj lub wybierz kształt, aby natychmiast obliczyć właściwości geometryczne i wytrzymałościowe.</p>
      <h4>Szybki start</h4>
      <ol>
        <li>Wybierz <strong>szablon przekroju</strong> (Prostokąt, Dwuteownik itp.) z panelu bocznego, lub</li>
        <li>Kliknij bezpośrednio na <strong>siatkę rysunkową</strong>, aby narysować własny kształt punkt po punkcie.</li>
        <li>Zamknij figurę klikając w pobliżu pierwszego punktu lub naciśnij przycisk <strong>Zamknij kontur</strong>.</li>
        <li>Wyniki obliczeń pojawią się automatycznie w panelu wyników poniżej.</li>
      </ol>
    `,
    'manual.drawing.title': 'Rysowanie kształtów',
    'manual.drawing.content': `
      <h4>Obrys zewnętrzny</h4>
      <p>Kliknij na siatkę, aby umieścić wierzchołki. Figura zamknie się po kliknięciu w pobliżu pierwszego punktu. Możesz też wpisać dokładne współrzędne w polu ręcznego wprowadzania.</p>
      <h4>Dodawanie otworów</h4>
      <p>Po zamknięciu obrysu zewnętrznego przełącz się na tryb <strong>Dodaj otwór</strong>. Narysuj zamknięty wielokąt wewnątrz kształtu, aby odjąć materiał (np. dla przekrojów zamkniętych).</p>
      <h4>Szablony</h4>
      <p>Użyj szablonów z domyślnymi lub niestandardowymi wymiarami. Kliknij przycisk szablonu, a następnie wybierz wartości domyślne lub wprowadź własne pomiary.</p>
    `,
    'manual.controls.title': 'Sterowanie i skróty',
    'manual.controls.content': `
      <table>
        <tr><td><kbd>Ctrl</kbd>+<kbd>Z</kbd></td><td>Cofnij ostatnią czynność</td></tr>
        <tr><td><kbd>Kółko myszy</kbd></td><td>Przybliż / Oddal</td></tr>
        <tr><td><kbd>Środkowy przycisk</kbd> + Przeciągnij</td><td>Przesuń widok</td></tr>
        <tr><td><kbd>Prawy przycisk</kbd> + Przeciągnij</td><td>Przesuń widok</td></tr>
        <tr><td><kbd>Enter</kbd></td><td>Dodaj wpisaną współrzędną</td></tr>
      </table>
      <h4>Pasek narzędzi</h4>
      <p><strong>Przyciągaj do siatki</strong> — przyciąga klikane punkty do najbliższego przecięcia siatki. <strong>Dopasuj widok</strong> — automatycznie dopasowuje widok do całego kształtu. Przyciski <strong>+/−</strong> do ręcznego sterowania przybliżeniem.</p>
      <h4>Sterowanie osiami</h4>
      <p>Przełączaj <strong>Odwróć X</strong> lub <strong>Odwróć Y</strong> w panelu HUD, aby zmienić konwencję kierunku osi. Wyniki przeliczają się automatycznie.</p>
    `,
    'manual.results.title': 'Słownik wyników',
    'manual.results.content': `
      <table>
        <tr><td><strong>Pole przekroju (A)</strong></td><td>Pole netto przekroju poprzecznego (obrys minus otwory).</td></tr>
        <tr><td><strong>Środek ciężkości (X, Y)</strong></td><td>Współrzędne geometrycznego środka masy.</td></tr>
        <tr><td><strong>J<sub>x</sub>, J<sub>y</sub></strong></td><td>Momenty bezwładności względem osi centralnych — miara odporności na zginanie.</td></tr>
        <tr><td><strong>J<sub>xy</sub></strong></td><td>Moment dewiacji — wskazuje asymetrię przekroju. Zerowy dla przekrojów symetrycznych.</td></tr>
        <tr><td><strong>θ<sub>p</sub></strong></td><td>Kąt główny — obrót od osi odniesienia do osi głównych bezwładności.</td></tr>
        <tr><td><strong>J<sub>1</sub>, J<sub>2</sub></strong></td><td>Maksymalny i minimalny główny moment bezwładności.</td></tr>
        <tr><td><strong>W<sub>el</sub></strong></td><td>Sprężysty wskaźnik wytrzymałości na zginanie (Wel = J / z_max).</td></tr>
        <tr><td><strong>W<sub>pl</sub></strong></td><td>Plastyczny wskaźnik wytrzymałości na zginanie (Wpl = S1 + S2).</td></tr>
        <tr><td><strong>Rdzeń</strong></td><td>Rdzeń przekroju — obszar, w którym przyłożenie obciążenia nie wywołuje rozciągania.</td></tr>
      </table>
    `,
    'manual.results.content.us': `
      <table>
        <tr><td><strong>Pole przekroju (A)</strong></td><td>Pole netto przekroju poprzecznego (obrys minus otwory).</td></tr>
        <tr><td><strong>Środek ciężkości (X, Y)</strong></td><td>Współrzędne geometrycznego środka masy.</td></tr>
        <tr><td><strong>I<sub>x</sub>, I<sub>y</sub></strong></td><td>Momenty bezwładności względem osi centralnych — miara odporności na zginanie.</td></tr>
        <tr><td><strong>I<sub>xy</sub></strong></td><td>Moment dewiacji — wskazuje asymetrię przekroju. Zerowy dla przekrojów symetrycznych.</td></tr>
        <tr><td><strong>θ<sub>p</sub></strong></td><td>Kąt główny — obrót od osi odniesienia do osi głównych bezwładności.</td></tr>
        <tr><td><strong>I<sub>1</sub>, I<sub>2</sub></strong></td><td>Maksymalny i minimalny główny moment bezwładności.</td></tr>
        <tr><td><strong>S<sub>el</sub></strong></td><td>Sprężysty wskaźnik wytrzymałości na zginanie (Sel = I / z_max).</td></tr>
        <tr><td><strong>Z<sub>pl</sub></strong></td><td>Plastyczny wskaźnik wytrzymałości na zginanie (Zpl = S1 + S2).</td></tr>
        <tr><td><strong>Rdzeń</strong></td><td>Rdzeń przekroju — obszar, w którym przyłożenie obciążenia nie wywołuje rozciągania.</td></tr>
      </table>
    `,
    'manual.close': 'Zamknij',
  }
};

// --- HELPER FUNCTIONS ---

// Current engineering standard state ('EU' or 'US')
let currentStandard = (typeof localStorage !== 'undefined' && localStorage.getItem('seccalc_standard')) || 'EU';

/**
 * Returns the active engineering standard ('EU' or 'US')
 */
function getStandard() {
  return currentStandard;
}

/**
 * Sets the active engineering standard ('EU' or 'US') and stores in localStorage
 */
function setStandard(std) {
  currentStandard = (std === 'US') ? 'US' : 'EU';
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('seccalc_standard', currentStandard);
    }
  } catch (e) {}
}

/**
 * Applies a given engineering standard and triggers full UI re-translation
 */
function applyStandard(std) {
  if (std) setStandard(std);
  applyLanguage(currentLang);
}

/**
 * Returns the translated string for a given key in the current language.
 * Checks for standard-specific overrides (e.g. '.us') when US standard is active.
 * Falls back to English, then returns the key itself if not found.
 */
function t(key) {
  if (currentStandard === 'US') {
    const usKey = key + '.us';
    if (translations[currentLang] && translations[currentLang][usKey] !== undefined) {
      return translations[currentLang][usKey];
    }
    if (translations.en && translations.en[usKey] !== undefined) {
      return translations.en[usKey];
    }
  }
  return (translations[currentLang] && translations[currentLang][key] !== undefined)
    ? translations[currentLang][key]
    : ((translations.en && translations.en[key] !== undefined) ? translations.en[key] : key);
}

/**
 * Applies the current language to all elements with data-i18n attributes.
 * - data-i18n="key" → sets textContent (or innerHTML if value contains HTML tags)
 * - data-i18n-html="key" → sets innerHTML
 * - data-i18n-title="key" → sets title attribute
 * - data-i18n-placeholder="key" → sets placeholder attribute
 */
function applyLanguage(lang) {
  currentLang = lang || currentLang;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('seccalc_lang', currentLang);
    }
  } catch (e) {}

  // Update HTML lang attribute
  document.documentElement.lang = currentLang === 'pl' ? 'pl' : 'en';

  // Update page title
  document.title = t('page.title');

  // Translate all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    // Use innerHTML if the translation contains HTML markup (like <sub>)
    if (val.includes('<')) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });

  // Translate all elements with data-i18n-html (force innerHTML)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    el.innerHTML = t(key);
  });

  // Translate title attributes
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    el.title = t(key);
  });

  // Translate placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Update the language toggle button text
  const langBtn = document.getElementById('btn-lang-toggle');
  if (langBtn) {
    langBtn.textContent = currentLang.toUpperCase();
  }

  // Update the standard toggle button text
  const stdBtn = document.getElementById('btn-standard-toggle');
  if (stdBtn) {
    stdBtn.textContent = currentStandard === 'US' ? 'US (I, S)' : 'EU (J, W)';
  }
}
