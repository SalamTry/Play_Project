#!/usr/bin/env node
/**
 * Visual Check Script for Ralph Code Review
 *
 * Inspired by playwriter (https://github.com/remorses/playwriter)
 * Uses accessibility snapshots + Vimium-style labels for efficient AI context.
 *
 * Usage: node scripts/visual-check.js [--port 5173] [--output ./visual-report]
 */

import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const DEFAULT_PORT = 5173;
const DEFAULT_OUTPUT = './visual-report';

// Parse arguments
const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const outputIndex = args.indexOf('--output');
const PORT = portIndex !== -1 ? parseInt(args[portIndex + 1]) : DEFAULT_PORT;
const OUTPUT_DIR = outputIndex !== -1 ? args[outputIndex + 1] : DEFAULT_OUTPUT;

// Vimium-style label generator (a, b, c, ... aa, ab, ...)
function generateLabels(count) {
  const labels = [];
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < count; i++) {
    if (i < 26) {
      labels.push(chars[i]);
    } else {
      labels.push(chars[Math.floor(i / 26) - 1] + chars[i % 26]);
    }
  }
  return labels;
}

async function waitForServer(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return true;
    } catch {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return false;
}

async function startDevServer() {
  console.log('🚀 Starting dev server...');
  const server = spawn('npm', ['run', 'dev'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true
  });

  server.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Local:')) {
      console.log('✅ Dev server started');
    }
  });

  return server;
}

/**
 * Get accessibility snapshot (playwriter-style efficient format)
 */
async function getAccessibilitySnapshot(page) {
  try {
    const snapshot = await page.accessibility.snapshot();

    function formatNode(node, depth = 0) {
      if (!node) return [];
      const results = [];
      const indent = '  '.repeat(depth);

      let desc = `${indent}[${node.role}]`;
      if (node.name) desc += ` "${node.name}"`;
      if (node.value) desc += ` value="${node.value}"`;
      if (node.checked !== undefined) desc += ` checked=${node.checked}`;
      if (node.pressed !== undefined) desc += ` pressed=${node.pressed}`;
      if (node.expanded !== undefined) desc += ` expanded=${node.expanded}`;
      if (node.disabled) desc += ` (disabled)`;

      results.push(desc);

      if (node.children) {
        for (const child of node.children) {
          results.push(...formatNode(child, depth + 1));
        }
      }
      return results;
    }

    if (!snapshot) {
      return ['[Accessibility snapshot unavailable]'];
    }

    return formatNode(snapshot);
  } catch (error) {
    console.log('⚠️ Accessibility snapshot not available:', error.message);
    return ['[Accessibility snapshot unavailable - see screenshot for visual check]'];
  }
}

/**
 * Add Vimium-style labels to interactive elements (playwriter-style)
 * Returns labeled screenshot + element mapping for AI context
 */
async function addVimiumLabels(page) {
  const interactiveSelectors = [
    'a[href]',
    'button',
    'input',
    'select',
    'textarea',
    '[role="button"]',
    '[role="link"]',
    '[role="checkbox"]',
    '[role="radio"]',
    '[role="tab"]',
    '[onclick]',
    '[tabindex]:not([tabindex="-1"])'
  ];

  const elements = await page.$$(interactiveSelectors.join(', '));
  const labels = generateLabels(elements.length);
  const elementMap = [];

  // Inject label overlay styles
  await page.addStyleTag({
    content: `
      .vimium-label {
        position: absolute;
        z-index: 99999;
        background: #f59e0b;
        color: #000;
        font-family: monospace;
        font-size: 11px;
        font-weight: bold;
        padding: 1px 4px;
        border-radius: 2px;
        border: 1px solid #000;
        pointer-events: none;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      }
    `
  });

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const label = labels[i];

    try {
      const box = await element.boundingBox();
      if (!box || box.width === 0 || box.height === 0) continue;

      const info = await element.evaluate(el => ({
        tag: el.tagName.toLowerCase(),
        type: el.type || null,
        text: el.textContent?.trim().slice(0, 50) || null,
        placeholder: el.placeholder || null,
        ariaLabel: el.getAttribute('aria-label') || null,
        role: el.getAttribute('role') || null,
        href: el.href || null,
        id: el.id || null,
        className: el.className?.toString().slice(0, 50) || null
      }));

      elementMap.push({
        label,
        ...info,
        bounds: { x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width), h: Math.round(box.height) }
      });

      await page.evaluate(({ label, x, y }) => {
        const labelEl = document.createElement('div');
        labelEl.className = 'vimium-label';
        labelEl.textContent = label;
        labelEl.style.left = `${x}px`;
        labelEl.style.top = `${y}px`;
        document.body.appendChild(labelEl);
      }, { label, x: box.x, y: box.y });

    } catch (e) {
      // Element may have been removed, skip
    }
  }

  return elementMap;
}

/**
 * Capture page state (playwriter-style)
 */
async function capturePageState(page, name, outputDir) {
  const state = {
    name,
    url: page.url(),
    title: await page.title(),
    viewport: page.viewportSize(),
    timestamp: new Date().toISOString()
  };

  // 1. Accessibility snapshot (lightweight, efficient for AI)
  console.log(`   📋 Capturing accessibility tree...`);
  state.accessibilityTree = await getAccessibilitySnapshot(page);

  // 2. Add Vimium labels and get element map
  console.log(`   🏷️  Adding Vimium-style labels...`);
  state.elements = await addVimiumLabels(page);

  // 3. Screenshot with labels
  console.log(`   📸 Capturing labeled screenshot...`);
  const screenshotPath = path.join(outputDir, `${name}-labeled.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  state.screenshotPath = screenshotPath;

  // 4. Save accessibility tree as text
  const a11yPath = path.join(outputDir, `${name}-a11y.txt`);
  await writeFile(a11yPath, state.accessibilityTree.join('\n'));
  state.a11yPath = a11yPath;

  // 5. Save element map
  const elementsPath = path.join(outputDir, `${name}-elements.json`);
  await writeFile(elementsPath, JSON.stringify(state.elements, null, 2));
  state.elementsPath = elementsPath;

  return state;
}

/**
 * Generate AI-optimized summary (playwriter-style)
 */
function generateAISummary(states) {
  let summary = `# Visual Check Report (Playwriter-style)

**Generated:** ${new Date().toISOString()}
**Approach:** Accessibility snapshots + Vimium labels (efficient AI context)

---

`;

  for (const state of states) {
    summary += `## ${state.name}

**URL:** ${state.url}
**Title:** ${state.title}

### Interactive Elements (${state.elements.length} found)

| Label | Element | Description |
|-------|---------|-------------|
`;

    for (const el of state.elements.slice(0, 30)) {
      const desc = el.ariaLabel || el.text || el.placeholder || el.href || '-';
      summary += `| \`${el.label}\` | ${el.tag}${el.type ? `[${el.type}]` : ''} | ${String(desc).slice(0, 40)} |\n`;
    }

    if (state.elements.length > 30) {
      summary += `| ... | ... | (${state.elements.length - 30} more elements) |\n`;
    }

    summary += `
### Accessibility Tree (top 40 nodes)

\`\`\`
${state.accessibilityTree.slice(0, 40).join('\n')}
${state.accessibilityTree.length > 40 ? `\n... (${state.accessibilityTree.length - 40} more nodes)` : ''}
\`\`\`

### Files
- Labeled Screenshot: \`${state.screenshotPath}\`
- Accessibility Tree: \`${state.a11yPath}\`
- Element Map: \`${state.elementsPath}\`

---

`;
  }

  summary += `## Review Checklist

Use this information to verify:

1. **Accessibility**
   - [ ] All interactive elements have labels (check element table)
   - [ ] Proper roles in accessibility tree
   - [ ] Logical tab order (check element sequence)

2. **Visual Structure**
   - [ ] Elements are properly positioned (check bounds in element map)
   - [ ] No overlapping interactive elements
   - [ ] Consistent spacing

3. **Functionality**
   - [ ] Expected elements are present
   - [ ] Form inputs have proper types
   - [ ] Links have valid hrefs

## How to Use Element Labels

The Vimium-style labels (a, b, c...) map to interactive elements.
Reference them in your review: "Element [f] is missing aria-label"
`;

  return summary;
}

async function runVisualChecks() {
  const baseUrl = `http://localhost:${PORT}`;
  let server = null;
  let browser = null;

  try {
    // Create output directory
    if (!existsSync(OUTPUT_DIR)) {
      await mkdir(OUTPUT_DIR, { recursive: true });
    }

    // Check if server is already running
    const serverRunning = await waitForServer(baseUrl, 3);
    if (!serverRunning) {
      server = await startDevServer();
      const started = await waitForServer(baseUrl, 30);
      if (!started) {
        throw new Error('Failed to start dev server');
      }
    } else {
      console.log('✅ Dev server already running');
    }

    // Launch browser
    console.log('🌐 Launching browser...');
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 }
    });

    const states = [];

    // ─────────────────────────────────────
    // Capture States
    // ─────────────────────────────────────

    // 1. Initial load
    console.log('\n📋 State 1: Initial load');
    const page1 = await context.newPage();
    await page1.goto(baseUrl);
    await page1.waitForLoadState('networkidle');
    states.push(await capturePageState(page1, '01-initial', OUTPUT_DIR));
    await page1.close();

    // 2. Dark mode (if available)
    console.log('\n📋 State 2: Dark mode');
    const page2 = await context.newPage();
    await page2.goto(baseUrl);
    await page2.waitForLoadState('networkidle');
    const themeToggle = await page2.$('[aria-label*="theme"], [aria-label*="dark"], [aria-label*="mode"], button:has(svg)');
    if (themeToggle) {
      await themeToggle.click();
      await page2.waitForTimeout(500);
      states.push(await capturePageState(page2, '02-dark-mode', OUTPUT_DIR));
    } else {
      console.log('   ⚠️ No theme toggle found, skipping dark mode check');
    }
    await page2.close();

    // 3. With interaction (add a todo if possible)
    console.log('\n📋 State 3: After interaction');
    const page3 = await context.newPage();
    await page3.goto(baseUrl);
    await page3.waitForLoadState('networkidle');
    const todoInput = await page3.$('input[type="text"], input[placeholder*="todo"], input[placeholder*="add"], input[placeholder*="task"]');
    if (todoInput) {
      await todoInput.fill('Visual check test item');
      await todoInput.press('Enter');
      await page3.waitForTimeout(500);
      states.push(await capturePageState(page3, '03-with-data', OUTPUT_DIR));
    } else {
      console.log('   ⚠️ No input field found, skipping interaction check');
    }
    await page3.close();

    // ─────────────────────────────────────
    // Generate Report
    // ─────────────────────────────────────

    const summary = generateAISummary(states);
    const summaryPath = path.join(OUTPUT_DIR, 'summary.md');
    await writeFile(summaryPath, summary);

    const reportPath = path.join(OUTPUT_DIR, 'report.json');
    await writeFile(reportPath, JSON.stringify(states, null, 2));

    console.log('\n═══════════════════════════════════════');
    console.log('✅ VISUAL_CHECK_COMPLETE');
    console.log(`📁 Summary: ${summaryPath}`);
    console.log(`📊 States captured: ${states.length}`);
    console.log(`🏷️  Elements mapped: ${states.reduce((sum, s) => sum + s.elements.length, 0)}`);
    console.log('═══════════════════════════════════════');

  } catch (error) {
    console.error('❌ Visual check failed:', error.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    if (server) {
      try {
        process.kill(-server.pid, 'SIGTERM');
      } catch (e) {
        // Server may have already stopped
      }
    }
  }
}

runVisualChecks();
