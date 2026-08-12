import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { JSDOM } from 'jsdom'

const path = (rel) => fileURLToPath(new URL(rel, import.meta.url))
const read = (rel) => readFileSync(path(rel), 'utf8')

const html = read('../src/index.html')
const scriptSource = (() => {
  try { return read('../src/script.js') } catch { return '' }
})()

const staticDoc = new JSDOM(html).window.document

// Regex checks below run against the code with comments stripped. The starter
// ships worked examples in its comments, so scanning the raw source would hand
// out points to a student who edited nothing.
const codeOnly = (src) => src
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1')
const code = codeOnly(scriptSource)


async function freshPage () {
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: pathToFileURL(path('../src/index.html')).href,
  })
  await new Promise((resolve) => {
    if (dom.window.document.readyState === 'complete') return resolve()
    dom.window.addEventListener('load', resolve)
    setTimeout(resolve, 3000)
  })
  const doc = dom.window.document

  const type = (sel, value) => {
    const el = doc.querySelector(sel)
    if (!el) throw new Error(`no element matches ${sel}`)
    el.value = String(value)
    el.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
    el.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
    el.dispatchEvent(new dom.window.Event('keyup', { bubbles: true }))
  }
  const order = (price, qty) => { type('#price', price); type('#qty', qty) }
  const textOf = (sel) => (doc.querySelector(sel)?.textContent ?? '').trim()
  const bodyText = () => (doc.body.textContent ?? '')
  return { doc, type, order, textOf, bodyText }
}

const numbersIn = (text) =>
  (String(text).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)

const shows = (text, expected) =>
  numbersIn(text).some((n) => Math.abs(n - expected) < 0.005)

let page
beforeEach(async () => { page = await freshPage() })

// ---- Foundation ----
describe('Foundation - a valid HTML5 page', () => {
  it('has a doctype, <html lang>, a <head> with <title> + charset, and a <body>', () => {
    expect(staticDoc.doctype?.name?.toLowerCase(), 'Start the file with <!DOCTYPE html>').toBe('html')
    expect(staticDoc.documentElement.getAttribute('lang'), 'Set a language, e.g. <html lang="en">').toBeTruthy()
    expect(staticDoc.querySelector('head title'), 'Add a <title> inside <head>').not.toBeNull()
    expect(staticDoc.title.trim(), 'Put some text inside <title>').toBeTruthy()
    expect(staticDoc.querySelector('meta[charset]'), 'Add <meta charset="utf-8"> inside <head>').not.toBeNull()
    expect(staticDoc.body, 'Wrap your page content in a <body>').not.toBeNull()
  })
})

// ---- The page ----
describe('The order form', () => {
  it('has #price, #qty, #total and an empty #error', () => {
    expect(staticDoc.querySelector('#price'), 'Add an input with id="price"').not.toBeNull()
    expect(staticDoc.querySelector('#qty'), 'Add an input with id="qty"').not.toBeNull()
    expect(staticDoc.querySelector('#total'), 'Add an element with id="total"').not.toBeNull()
    const err = staticDoc.querySelector('#error')
    expect(err, 'Add an element with id="error" for the message').not.toBeNull()
    expect(err.textContent.trim(),
      'Leave #error with no text in the HTML. Your code fills it in only when something is wrong').toBe('')
  })

  it('links an external script.js and keeps no JavaScript in the HTML', () => {
    const linked = [...staticDoc.querySelectorAll('script[src]')]
    expect(linked.some((s) => /script\.js$/i.test(s.getAttribute('src').trim())),
      'Link your JavaScript with <script src="script.js" defer></script>').toBe(true)
    const inline = [...staticDoc.querySelectorAll('script:not([src])')].map((s) => s.textContent.trim()).filter(Boolean)
    expect(inline.length, 'Move your code out of the HTML and into src/script.js').toBe(0)
  })
})

// ---- The technique ----
describe('Error handling, done on purpose', () => {
  it('runs in strict mode', () => {
    const firstCode = code
      .split('\n')
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith('//') && !l.startsWith('/*') && !l.startsWith('*'))
    expect(/^['"]use strict['"];?$/.test(firstCode ?? ''),
      "Put 'use strict' on the very first line of script.js").toBe(true)
  })

  it('refuses bad input with throw new Error', () => {
    expect(/throw\s+new\s+Error\s*\(/.test(code),
      'Refuse bad input with throw new Error("...") rather than quietly returning 0').toBe(true)
  })

  it('handles the failure with try and catch', () => {
    expect(/\btry\s*\{/.test(code), 'Wrap the calculation in a try block').toBe(true)
    expect(/\bcatch\s*\(/.test(code), 'Catch the error and show its message to the user').toBe(true)
  })

  it('shows the thrown message rather than swallowing it', () => {
    expect(/\.message\b/.test(code),
      'Put error.message on the page. An empty catch block hides the only clue you had').toBe(true)
  })
})

// ---- Behaviour: the happy path ----
describe('Good input', () => {
  it('multiplies price by quantity: 180 x 3 is 540', () => {
    page.order(180, 3)
    expect(shows(page.textOf('#total'), 540),
      `Expected #total to show 540, it shows "${page.textOf('#total')}"`).toBe(true)
  })

  it('leaves #error empty while the input is good', () => {
    page.order(180, 3)
    expect(page.textOf('#error'),
      `#error should be empty for valid input, it shows "${page.textOf('#error')}"`).toBe('')
  })
})

// ---- Behaviour: the unhappy paths ----
describe('Bad input', () => {
  const bad = [
    ['an empty quantity', 180, ''],
    ['a quantity that is not a number', 180, 'abc'],
    ['a negative quantity', 180, -5],
    ['an empty price', '', 3],
  ]

  for (const [label, price, qty] of bad) {
    it(`explains ${label} instead of calculating`, () => {
      page.order(price, qty)
      expect(page.textOf('#error').length,
        `With ${label}, #error should carry a message telling the user what to fix`).toBeGreaterThan(0)
      expect(/nan|undefined|infinity/i.test(page.bodyText()),
        `With ${label} the page shows "${page.textOf('#total')}". A user should never be shown NaN, undefined or Infinity`).toBe(false)
    })
  }

  it('recovers: a good value after a bad one clears the message', () => {
    page.order(180, 'abc')
    expect(page.textOf('#error').length, 'Bad input should produce a message first').toBeGreaterThan(0)
    page.order(180, 3)
    expect(page.textOf('#error'),
      'Once the input is valid again, clear #error. Otherwise the warning never goes away').toBe('')
    expect(shows(page.textOf('#total'), 540),
      `After recovering, #total should show 540, it shows "${page.textOf('#total')}"`).toBe(true)
  })
})

// ---- Identity ----
describe('Student info (student.json)', () => {
  const info = JSON.parse(read('../student.json'))
  it('student.json is completely filled in', () => {
    for (const field of ['classCode', 'fullName', 'studentNumber', 'studentEmail', 'personalEmail', 'githubAccount']) {
      expect(info[field], `Set ${field} in student.json`).toBeTruthy()
    }
  })
})
