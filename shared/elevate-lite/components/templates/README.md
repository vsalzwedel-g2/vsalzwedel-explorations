# Component Templates

Static HTML templates for Elevate components.

## For Designers

1. **Browse components**: https://www.g2.test/elevate/lookbook
2. **Read specifications**: `/shared/elevate-lite/design-system/DESIGN.md` (full specs)
3. **Find the HTML template**: `/shared/elevate-lite/components/templates/[component-name].html`
4. **Copy the code snippet** from the template
5. **Paste into your exploration**

## Directory Structure

```
templates/
├── _template.html       ← Copy this to create new component templates
├── simple/              ← No JavaScript required
├── interactive/         ← Optional JavaScript
└── complex/             ← Requires JavaScript
```

## Creating a New Template

1. **Read `/shared/elevate-lite/design-system/DESIGN.md`** for exact component specs
2. Copy `_template.html` to appropriate folder
3. Build component using specs from DESIGN.md (colors, padding, states)
4. Add component examples showing all variants
5. Include copy-paste code snippets
6. Link to Lookbook for visual reference

**Sources:**
- **Specifications**: `/shared/elevate-lite/design-system/DESIGN.md` (exact colors, sizing, states)
- **Visual reference**: [Elevate Lookbook](https://www.g2.test/elevate/lookbook)

Keep templates simple. DESIGN.md has the authoritative specs.
