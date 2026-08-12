# Module 11 - Activity 1 - Never Show The User NaN

[![Made with Claude](https://img.shields.io/badge/Made_with-Claude-D97757?logo=anthropic&logoColor=white)](https://tjakoen.github.io/notes/ten-times-zero)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

Your Module 9 calculator works, as long as everyone types a sensible number.
Nobody does. Leave the quantity box empty and it quietly says the total is 0.
Type "three" and it says `NaN`.

This is the same calculator, made honest: it refuses bad input on purpose, tells
the user what to fix, and **never** puts `NaN` in front of them.

The HTML is given. You edit [`src/script.js`](src/script.js).

## What to do

1. **`'use strict'` on the very first line** of `script.js`. Comments above it
   are fine; code is not. It has to be the first statement or it does nothing at
   all.

2. **Write a reader that refuses bad input.** A function that takes the raw text
   from a box, **returns a number**, and uses `throw new Error('...')` for:
   - an empty box,
   - text that is not a number,
   - a negative number.

   Write each message for a human. "Enter a quantity" beats "invalid input".

3. **Wrap the calculation** in `try`, and `catch (error)`.

4. **On success:** `#total` shows the number, and `#error` is cleared to `''`.

5. **On failure:** `#total` shows `--` (anything with no number in it), and
   `#error` shows `error.message`.

6. **Also `console.error(error)`** inside the catch. Two audiences, two messages:
   the user gets one short sentence, you keep the whole error with its stack.

7. **Recalculate** on every `'input'` event on both boxes.

8. **Fill in `student.json`** with your details (keep it identical to your other
   activities; the `classCode` must match your repo name).

```json
{
  "classCode": "1234",
  "fullName": "Juan Dela Cruz",
  "studentNumber": "2026-12345",
  "studentEmail": "juan.delacruz@hau.edu.ph",
  "personalEmail": "juan@example.com",
  "githubAccount": "juandelacruz"
}
```

> **`Number('')` is `0`, not an error.** Check for the empty string yourself,
> before you convert. This is the trap that makes an empty box look like a free
> order.

> **Never return 0 instead of throwing.** `0` is a real quantity. A silent
> fallback hides the mistake and shows the user a confident, wrong total. An
> error says "this cannot be answered", which is a different statement.

## Reference

The module reference is in the course content: **Module 11 - Debugging and Error
Handling** (`Debugging-and-Errors-Reference.md`) - strict mode, `throw`,
`try / catch`, and catching well.

## Running the tests

```bash
npm install
npm test
```

The autograder is **15 checks** (roughly 1 point each):

- the page is valid HTML5
- `#price`, `#qty`, `#total`, and an `#error` that starts empty
- an external `script.js` is linked, and no JavaScript sits in the HTML
- `'use strict'` is the very first line
- bad input is refused with `throw new Error(...)`
- it is handled with `try` and `catch`
- `error.message` reaches the page instead of being swallowed
- 180 and 3 gives 540
- `#error` is empty while the input is good
- an empty quantity, "abc", a negative quantity and an empty price each produce
  a message, and **no `NaN`, `undefined` or `Infinity` anywhere on the page**
- a good value after a bad one clears the message and shows the total again
- `student.json` is completely filled in

Those bad-input checks scan the **whole page**, not just `#total`. If `NaN` lands
anywhere visible, they fail.

## Traps

- **An empty `catch` block.** It hides the only clue you had.
- **`alert(error.message)`.** It blocks the entire page for one sentence.
- **Forgetting to clear `#error` on success.** A warning that never goes away is
  worse than no warning.
- **Forgetting to blank `#total` on failure.** A stale total next to a fresh
  error message is the most confusing state of all.

## Set up your repo

1. **Create from the template** - *Use this template -> Create a new repository*.
2. **Owner = the `HAU-6INTROWEB` course org.**
3. **Name it** `m11a1-<classcode>-yourname`. The `<classcode>` must match
   `student.json`.
4. **Make it Private.**

```bash
git clone https://github.com/HAU-6INTROWEB/m11a1-<classcode>-yourname.git
cd m11a1-<classcode>-yourname
```

## Confirm your submission

When your tests pass locally, **commit and push**:

```bash
git add -A
git commit -m "Bad input refused instead of showing NaN"
git push
```

Pushing triggers the **Autograde** workflow. Open the **Actions** tab, then the
latest **Autograde** run, and confirm the green check and the "15 / 15 tests
passed" summary.

## Work in a Codespace (recommended)

A **Codespace** is a complete dev environment that runs in the cloud, so you do
not have to install anything on your own laptop. This repo is already configured:
open a Codespace and everything you need is ready.

**Open one:** click the green **Code** button -> **Codespaces** tab -> **Create
codespace on main**. The first launch takes a minute; after that it is instant.

**Use it in VS Code (recommended).** Install the **GitHub Codespaces** extension
in VS Code, or from the running Codespace click the menu -> **Open in VS Code
Desktop**. Same environment, your own editor.

### Make your free hours last (please read)
Your GitHub Education account includes a generous but limited monthly Codespaces
allowance. Three habits keep you from wasting it:

1. **Set your idle timeout to 10 minutes.** Go to
   **github.com/settings/codespaces -> Default idle timeout -> 10 minutes ->
   Save.** This makes a Codespace auto-stop after 10 idle minutes.
2. **Stop it when you finish - do not just close the tab.** Stop it at
   **github.com/codespaces -> ... -> Stop codespace**, or run *Codespaces: Stop
   Current Codespace* from the Command Palette.
3. **Delete the Codespace once you have submitted.** After your final push:
   **github.com/codespaces -> ... -> Delete.** You can recreate it later from the
   green **Code** button.

---
📚 **These materials were authored by [tjakoen](https://github.com/tjakoen), built with Claude.** I use AI in the open, and I expect you to use it to learn the material, not to skip the learning. [How I actually work with AI ->](https://tjakoen.github.io/notes/ten-times-zero)
