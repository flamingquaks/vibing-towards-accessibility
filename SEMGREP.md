# Semgrep WCAG Compliance Guide

This repository uses Semgrep for automated WCAG 2.1 AA compliance checking and accessibility linting.

## Overview

Semgrep is a static analysis tool that helps identify accessibility issues in React/TypeScript code before they reach production. Our custom rule set focuses on WCAG 2.1 AA compliance.

## Configuration

The semgrep configuration is defined in `.semgrep.yml` and includes rules for:

### WCAG Compliance Rules

1. **Images must have alt text** (WCAG 1.1.1)
   - Ensures all `<img>` elements have alt attributes
   - Severity: ERROR

2. **ARIA attributes must not be empty** (WCAG 4.1.2)
   - Validates that aria-label, aria-labelledby, and aria-describedby are not empty
   - Severity: ERROR

3. **Buttons must have accessible content** (WCAG 4.1.2)
   - Ensures buttons have text content or ARIA labels
   - Severity: ERROR

4. **Links should have meaningful text** (WCAG 2.4.4)
   - Flags generic link text like "click here" or "read more"
   - Severity: WARNING

5. **Avoid positive tab index** (WCAG 2.4.3)
   - Warns against positive tabIndex values that break natural tab order
   - Severity: WARNING

6. **Form inputs should have labels** (WCAG 1.3.1, 3.3.2)
   - Ensures form inputs have accessible labels
   - Severity: WARNING

7. **Auto-playing media warning** (WCAG 1.4.2)
   - Flags auto-playing video/audio elements
   - Severity: WARNING

8. **Semantic HTML recommendation** (WCAG 1.3.1)
   - Suggests using semantic elements instead of divs with ARIA roles
   - Severity: INFO

9. **Heading hierarchy** (WCAG 1.3.1)
   - Warns about skipping heading levels (h4-h6)
   - Severity: INFO

10. **Color contrast considerations** (WCAG 1.4.3)
    - Flags potentially low-contrast color combinations
    - Severity: INFO

## Available Scripts

### `npm run lint:semgrep`
Runs semgrep with our custom WCAG compliance rules on the src/ directory.

### `npm run wcag`
Runs only ERROR-level WCAG compliance checks (blocking issues).

### `npm run lint:all`
Runs both ESLint and semgrep linting.

### `npm run security`
Runs semgrep security audit (requires internet connection).

## Usage Examples

### Check for WCAG compliance issues:
```bash
npm run wcag
```

### Run full accessibility linting:
```bash
npm run lint:semgrep
```

### Run all linting (ESLint + semgrep):
```bash
npm run lint:all
```

## CI/CD Integration

Semgrep is automatically run in our GitHub Actions workflows:

- **Unit Tests Workflow**: Runs WCAG compliance checks on every push/PR
- **PR Quality Check**: Runs full semgrep accessibility linting and reports results

## Interpreting Results

### Finding Format
```
Rule ID: wcag-img-alt-text
File: src/components/MyComponent.tsx
Line: 15
Message: Images must have alt text for accessibility (WCAG 1.1.1)
Severity: ERROR
```

### Severity Levels
- **ERROR**: Blocking accessibility issues that must be fixed
- **WARNING**: Important accessibility concerns that should be addressed
- **INFO**: Suggestions for improved accessibility practices

## Customizing Rules

To modify or add new rules, edit `.semgrep.yml`. Each rule includes:

- `id`: Unique identifier
- `pattern`: Code pattern to match
- `message`: Description of the issue
- `languages`: Supported languages (typescript, javascript)
- `severity`: ERROR, WARNING, or INFO
- `metadata`: WCAG guideline reference and category

## Best Practices

1. **Fix ERROR-level issues immediately** - These are blocking accessibility problems
2. **Address WARNING-level issues** - These improve accessibility significantly
3. **Consider INFO-level suggestions** - These enhance overall accessibility
4. **Run semgrep locally** before committing code
5. **Use the WCAG script** to catch only critical issues quickly

## Ignoring False Positives

If you need to ignore a specific finding, add it to `.semgrepignore` or use inline comments:

```typescript
// semgrep-ignore: wcag-img-alt-text
<img src="decorative.png" /> // Decorative image, alt not needed
```

## WCAG 2.1 AA Reference

Our rules are based on WCAG 2.1 AA guidelines:
- **1.1.1** Non-text Content
- **1.3.1** Info and Relationships  
- **1.4.2** Audio Control
- **1.4.3** Contrast (Minimum)
- **2.4.3** Focus Order
- **2.4.4** Link Purpose (In Context)
- **3.3.2** Labels or Instructions
- **4.1.2** Name, Role, Value

For complete WCAG guidelines, visit: https://www.w3.org/WAI/WCAG21/quickref/