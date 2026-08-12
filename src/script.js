// Module 11, Activity 1 - Never show the user NaN
//
// Your Module 9 calculator works, as long as everyone types a sensible number.
// Nobody does. This is the same calculator, made honest.
//
// 1. 'use strict' goes on the VERY FIRST LINE of this file. Comments above it
//    are fine; code is not. It must be the first statement or it does nothing.
//
// 2. Write a function that takes the raw text from a box and RETURNS a number,
//    and that refuses bad input with throw new Error('...'):
//      - an empty box
//      - text that is not a number
//      - a negative number
//    Write each message for a human. "Enter a quantity" beats "invalid input".
//
// 3. Wrap the calculation in try, and catch (error).
//
// 4. On success: #total shows the number, and #error is cleared to ''.
//
// 5. On failure: #total shows '--' (anything with no number in it), and #error
//    shows error.message.
//
// 6. Also console.error(error) inside the catch. Two audiences, two messages:
//    the user gets one short sentence, you keep the whole error.
//
// 7. Recalculate on every 'input' event on both boxes.
//
// The autograder scans the WHOLE PAGE for NaN, undefined and Infinity. If any
// of them can reach the user, you have not finished.
//
// Concepts to look up if you are stuck: strict mode, throw, the Error object,
// try...catch, error.message.
//
// One trap worth knowing before you start: Number('') is 0, not an error. Check
// for the empty string yourself, before you convert.
