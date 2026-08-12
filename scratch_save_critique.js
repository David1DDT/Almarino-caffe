const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const bodyContent = `# Design Critique: Coffee Website (src/app/page.tsx)

### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Cart icon is unclickable (no drawer/modal); 3D Canvas lacks loading indicator |
| 2 | Match System / Real World | 4 | Excellent domain language (SCA score, altitude, brew temp, roast PBR textures) |
| 3 | User Control & Freedom | 2 | Good customizer state control, but disabled 3D pan/zoom and missing cart view/edit |
| 4 | Consistency & Standards | 2 | Prepared liquid lattes use bean bag weights (250g-1kg); brand name inconsistency |
| 5 | Error Prevention | 3 | Input max lengths and explicit button choices prevent form errors |
| 6 | Recognition Rather Than Recall | 4 | Real-time 3D bag mockup updates live; color-coded flavor badges |
| 7 | Flexibility & Efficiency | 3 | Quick roast switcher in Hero; clear category filters |
| 8 | Aesthetic & Minimalist Design | 3 | Stunning 3D and glassmorphism, but gradient-text overuse and bounce animation slop |
| 9 | Error Recovery | 2 | Simple form inputs, but missing WebGL fallback/error boundaries |
| 10 | Help & Documentation | 3 | Contextual flavor stats (acidity, body, sweetness, aroma) and brew temps |
| **Total** | | **28/40** | **Good** |

### Design Specificity Verdict

**LLM Assessment**: High visual tactility (roast-specific physical shaders, procedural steam, crease-deformed coffee bean geometry), but marred by brand identity disconnects ("BREW & BEAN" vs PRODUCT.md specification "My Daily Ritual"), e-commerce logic flaws (prepared liquid lattes sold by 250g-1kg bean bag weights), and missing in-café pickup/table ordering workflows.

**Deterministic Scan**: Found 4 rule violations in \`src/app/page.tsx\`:
- 3 instances of \`gradient-text\` (\`bg-clip-text text-transparent\` on H1 heading, header logo, and footer logo).
- 1 instance of \`bounce-easing\` (infinite \`animate-bounce\` loop on cart count badge).

### Overall Impression
A visually captivating specialty coffee showcase featuring responsive 3D WebGL visuals and refined dark/light glassmorphism. However, it is currently held back by critical e-commerce gaps (unresponsive cart drawer), product classification bugs (liquid drinks sold in 1kg bags), and minor accessibility/performance flaws.

### What's Working
1. **Sensory 3D Viewport**: R3F scene with procedural rising steam, roast-specific physical materials (matte cinnamon vs oily dark roast sheen), and deformed coffee bean geometry.
2. **Instant Tactile Customizer**: Live bag mockup updating dynamically with custom label text, roast profile, grind, and weight choices.
3. **Refined Design System**: Seamless dark/light theme toggle, glassmorphic containers, color-coded flavor note badges, and motion-aware scroll reveals.

### Priority Issues

- **[P0] Unresponsive Shopping Cart**: Cart button in navbar and "Add to Bag" actions increment counter, but clicking the cart icon does nothing (no slide-over drawer or checkout modal).
  - *Fix*: Build a sliding cart drawer component with item listing, quantity adjusters, subtotal, and checkout CTA.
  - *Suggested Command*: \`/impeccable shape cart drawer\` or \`/impeccable harden\`

- **[P1] Category Logic Mismatch (Liquid Drinks vs Roasted Beans)**: Prepared café drinks ("Vanilla Latte", "Nitro Draft Mocha") use bean bag weights (\`250g, 500g, 1kg\`), generating options like a "1kg Vanilla Latte".
  - *Fix*: Separate prepared beverages (volume in oz/ml, temperature, milk options) from whole/ground coffee bean bags (\`250g, 500g, 1kg\`).
  - *Suggested Command*: \`/impeccable clarify\` or \`/impeccable layout\`

- **[P1] Brand Identity Contradiction**: Navigation and footer hardcode "BREW & BEAN", violating the explicit brand specification "My Daily Ritual" in \`PRODUCT.md\`.
  - *Fix*: Update text and branding tokens across header, hero, and footer to "My Daily Ritual".
  - *Suggested Command*: \`/impeccable clarify\`

- **[P2] Accessibility & Motion Slop (a11y/slop)**: Cart button is an un-focusable \`<div>\` lacking ARIA attributes, customizer buttons lack \`aria-checked\`/\`radiogroup\`, and infinite \`animate-bounce\` on cart badge creates visual noise.
  - *Fix*: Convert cart container to a \`<button>\`, add ARIA roles, and replace infinite bounce with static badge or single-trigger micro-interaction.
  - *Suggested Command*: \`/impeccable audit\` or \`/impeccable polish\`

- **[P3] Performance Thrashing on Mouse Movement**: Pointer move handler in \`CoffeeScene.tsx\` invokes \`setMousePosition\` on every pixel move, triggering high-frequency React state re-renders.
  - *Fix*: Refactor mouse coordinates to use a \`useRef\` read inside \`useFrame\` instead of React state.
  - *Suggested Command*: \`/impeccable optimize\`

### Persona Red Flags

- **Casey (Distracted Mobile User - In-Café QR Ordering)**:
  - 🚩 *No Table / Pickup Workflow*: Casey scanning a café table QR code wants quick table ordering or pickup, but lands on desktop-focused roast subscriptions.
  - 🚩 *Unresponsive Cart*: Tapping the cart badge produces no feedback or cart drawer.
- **Jordan (Confused First-Timer)**:
  - 🚩 *Latte Bag Size Confusion*: Trying to order a Vanilla Latte presents bag weights (\`250g, 500g, 1kg\`), causing confusion over whether it is a liquid drink or roasted coffee beans.
  - 🚩 *Brand Mismatch*: Navbar displays "BREW & BEAN" while product context specifies "My Daily Ritual".
- **Alex (Power User / Specialty Coffee Aficionado)**:
  - 🚩 *Restricted Camera*: OrbitControls disables pan and zoom, preventing close inspection of 3D coffee bean textures.

### Minor Observations
- Hero \`selectedRoast\` state and Brew Lab \`selectedRoast\` state are unlinked.
- Low-contrast text on metadata tags (\`text-coffee-espresso/40\`).
- Page lacks a semantic \`<main>\` landmark wrapper.

### Questions to Consider
1. *Does a 3D roast visualizer elevate the ritual of buying coffee, or does it distract an in-café customer who just wants to order a morning espresso at Table 4?*
2. *If "My Daily Ritual" bridges physical café ordering with custom roast subscriptions, why does the interface treat liquid lattes and roasted bean bags as identical e-commerce objects?*
3. *How might we evolve the 3D scene from a static display into an interactive extraction simulator where grind and roast adjustments dynamically simulate crema color and body?*
`;

const tmpFile = path.join(__dirname, "tmp_critique.md");
fs.writeFileSync(tmpFile, bodyContent);

const meta = JSON.stringify({
  target: "src/app/page.tsx",
  total_score: 28,
  max_score: 40,
  na_heuristics: "",
  p0_count: 1,
  p1_count: 2
});

try {
  const targetPath = path.resolve(__dirname, "src/app/page.tsx");
  const scriptPath = "/Users/david/.gemini/skills/impeccable/scripts/critique-storage.mjs";
  const cmd = `IMPECCABLE_CRITIQUE_META='${meta}' node "${scriptPath}" write "${targetPath}" "${tmpFile}"`;
  const out = execSync(cmd, { env: { ...process.env, IMPECCABLE_CRITIQUE_META: meta } }).toString();
  console.log("SUCCESS_WRITE:", out.trim());
  const trendCmd = `node "${scriptPath}" trend "${targetPath}" 5`;
  const trendOut = execSync(trendCmd).toString();
  console.log("SUCCESS_TREND:", trendOut.trim());
} catch (e) {
  console.error("ERROR:", e.message);
}

if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
