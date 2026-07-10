# 2D Section Property Calculator (SecCalc)

A premium, interactive CAD web application designed for civil, structural, and mechanical engineers to calculate, visualize, and analyze the geometric and structural properties of any 2D cross-section.

---

## Features

### 1. Shape Presets & Parametric Customization
Instantly generate standard structural shapes using default dimensions or configure custom parametric settings:
* **Rectangle**: Width ($b$) and Height ($h$).
* **Box Section (Hollow Rect)**: Outer Width ($B$), Outer Height ($H$), Inner Width ($b$), and Inner Height ($h$).
* **I-Beam**: Overall Height ($H$), Web Width ($t_w$), Top Flange Width ($b_{ft}$), Top Flange Thickness ($t_{ft}$), Bottom Flange Width ($b_{fb}$), and Bottom Flange Thickness ($t_{fb}$). Supports asymmetric flanges.
* **T-Beam**: Flange Width ($b_f$), Flange Thickness ($t_f$), Web Height ($h_w$), and Web Width ($t_w$).
* **Circular Tube**: Outer Radius ($R$) and Inner Radius ($r$).
* **L-Angle**: Vertical Leg Height ($H$), Vertical Leg Thickness ($t_v$), Horizontal Leg Width ($B$), and Horizontal Leg Thickness ($t_h$).

### 2. Manual Coordinate Drafting
Create completely custom, complex geometries:
* Enter exact decimal coordinate offsets $(X, Y)$ using the manual inputs sidebar.
* Supports the creation of an outer perimeter and multiple independent, nested subtractive internal holes.
* Validates shapes in real-time (preventing intersecting holes, self-crossings, and out-of-boundary shapes).

### 3. Real-Time Structural Solvers
* **Geometric Properties**: Area ($A$), Centroid coordinates $(\bar{x}, \bar{y})$, and Product of Inertia ($I_{xy}$).
* **Reference Inertia ($I_x, I_y$)**: Calculated directly about the reference coordinate axes ($x=0$, $y=0$ aligned at the top-most fiber of the shape).
* **Principal Properties**: Maximum ($I_1$) and Minimum ($I_2$) Principal Moments of Inertia, along with the Principal Rotation Angle ($\theta_p$).
* **Neutral Axes (ENA & PNA)**:
  * **Elastic Neutral Axis (ENA)**: Derives the zero-stress axis equation for horizontal bending.
  * **Plastic Neutral Axis (PNA)**: Rotates coordinates and uses a bisection search coupled with Sutherland-Hodgman polygon clipping to find the line splitting the net section area in half.
* **Cross-Section Core (Kern)**: Solves half-plane boundary constraints $(u_i / r_v^2) e_u + (v_i / r_u^2) e_v + 1 \ge 0$ for all boundary vertices in centroidal principal coordinates to map the elastic Kern area.

### 4. Interactive CAD Viewport
* **Navigation**: Drag to pan (Right-Click, Middle-Click, or Shift+Left-Click) and scroll wheel (or toolbar `+` / `-` buttons) to zoom.
* **Fit Shape**: Clicking **Fit Shape** automatically zooms and centers the active cross-section with clean margins.
* **Layer Toggles**: Individually show/hide gridlines, snap-to-grid, centroid axes, principal axes, ENA/PNA lines, and the Kern polygon.

---

## Technical Architecture

* **Frontend**: Vanilla HTML5, CSS3, and JavaScript (ES6+).
* **Visuals**: Canvas API with premium glassmorphism dark-theme dashboard overlays.
* **Calculations**: Double-precision floating-point polygon solvers based on Green's Theorem for area integrals.

---

## How to Run Locally

Since this is a static client-side web application, you do not need to install complex databases or backends.

1. Clone or download this project directory.
2. Run a simple local HTTP server (to ensure correct ES module loading if needed):
   ```bash
   # Using Python 3
   python -m http.server 8080
   
   # Using Node.js / npm
   npx http-server -p 8080
   ```
3. Open your browser and navigate to `http://localhost:8080`.

---

## How to Deploy to the Public

Because the application is static, hosting it publicly is free and takes under 5 minutes:

### Option A: Netlify (Easiest)
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop the project folder directly into the web browser upload box.
3. Your site is instantly live at a custom URL.

### Option B: GitHub Pages
1. Push this folder to a GitHub repository.
2. Navigate to repository **Settings** > **Pages**.
3. Under **Branch**, select `main` and click **Save**.
