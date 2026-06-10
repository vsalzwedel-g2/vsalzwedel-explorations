# Elevate Component Library

Static HTML templates for UE Elevate components. **For full documentation, see the [Elevate Lookbook](https://www.g2.test/elevate/lookbook).**

## Quick Reference

### Setup

Include Elevate CSS in your HTML:

```html
<link rel="stylesheet" href="../../shared/elevate-lite/tokens/elevate.css">
<link rel="stylesheet" href="../../shared/elevate-lite/components/elevate.css">
```

Wrap content in a container with the `elv` attribute:

```html
<div elv>
  <!-- All Elevate components go here -->
</div>
```

---

## Available Templates

Templates are organized by complexity:

### Simple Components (No JavaScript)
- [chip](./templates/simple/chip.html) — Tags, badges, filters
- avatar — User/product avatars *(coming soon)*
- status_badge — Status indicators *(coming soon)*
- spin_loader — Loading states *(coming soon)*
- link — Styled links *(coming soon)*

### Interactive Components (Optional JavaScript)
- tooltip *(coming soon)*
- accordion *(coming soon)*
- tabs *(coming soon)*

### Complex Components (Requires JavaScript)
- modal *(coming soon)*
- dropdown *(coming soon)*
- table *(coming soon)*

---

## Common Patterns

### Buttons

```html
<div elv>
  <button class="btn btn--primary btn--md">Primary</button>
  <button class="btn btn--secondary btn--md">Secondary</button>
  <button class="btn btn--tertiary btn--md">Tertiary</button>
</div>
```

**Sizes:** `btn--sm`, `btn--md`, `btn--lg`  
**Variants:** `btn--primary`, `btn--secondary`, `btn--tertiary`, `btn--brand`, `btn--inverted`

### Typography

```html
<div elv>
  <h1 class="elv-text-4xl elv-font-bold elv-text-default">Heading</h1>
  <p class="elv-text-base elv-text-subtle">Body text</p>
</div>
```

**Sizes:** `elv-text-xs`, `elv-text-sm`, `elv-text-base`, `elv-text-lg`, `elv-text-xl`, `elv-text-2xl`, `elv-text-3xl`, `elv-text-4xl`  
**Colors:** `elv-text-default`, `elv-text-subtle`, `elv-text-nonessential`, `elv-text-primary`, `elv-text-link`, `elv-text-success`, `elv-text-critical`

### Layout

```html
<div elv>
  <div class="elv-flex elv-gap-4 elv-items-center">
    <button class="btn btn--primary btn--sm">Action</button>
    <button class="btn btn--secondary btn--sm">Cancel</button>
  </div>
</div>
```

**Flexbox:** `elv-flex`, `elv-flex-col`, `elv-items-center`, `elv-justify-between`, `elv-gap-{n}`  
**Spacing:** `elv-p-{n}`, `elv-px-{n}`, `elv-py-{n}`, `elv-m-{n}`, `elv-mb-{n}`, etc.  
**Scale:** 0, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24, etc.

### Cards

```html
<div elv>
  <div class="elv-bg-neutral-0 elv-border elv-border-light elv-rounded-md elv-p-6 elv-shadow-1">
    <h3 class="elv-text-lg elv-font-semibold elv-text-default elv-mb-2">Card Title</h3>
    <p class="elv-text-sm elv-text-subtle">Card description</p>
  </div>
</div>
```

### Alerts

```html
<div elv>
  <div class="elv-bg-success-20 elv-border elv-border-success elv-rounded-sm elv-p-4">
    <p class="elv-text-sm elv-text-success elv-font-medium">Success message</p>
  </div>
</div>
```

**Variants:** `success-20`, `critical-20`, `info-20`, `warning-20`

---

## Token Reference

All design tokens are in `/shared/elevate-lite/tokens/elevate.css`. Use CSS custom properties:

- **Colors:** `var(--palette-purple-100)`, `var(--text-default)`, `var(--bg-primary)`
- **Spacing:** `var(--space-4)`, `var(--space-8)`
- **Typography:** `var(--text-base)`, `var(--font-semibold)`
- **Borders:** `var(--radius-md)`, `var(--border-width-1)`
- **Shadows:** `var(--shadow-1)`, `var(--shadow-2)`

---

## Need More?

- **Full component docs:** [Elevate Lookbook](https://www.g2.test/elevate/lookbook)
- **HTML templates:** [`/shared/elevate-lite/components/templates/`](./templates/)
- **Icon library:** [`/shared/elevate-lite/icons/README.md`](../icons/README.md)
- **Design tokens:** [`/shared/elevate-lite/tokens/elevate.css`](../tokens/elevate.css)

