# Calculator

A basic calculator with a button interface and keyboard support. Built for the **CodeAlpha Frontend Development Internship (Task 2)**.

## Features
- Addition, subtraction, multiplication and division
- Chained operations (`2 + 3 × 4`) evaluated left to right as they are entered
- Clear (AC), delete (DEL), percent and decimal input
- Real-time display with the pending operation shown above the result
- Division by zero is handled with an error message instead of `Infinity`
- Floating point rounding fix, so `0.1 + 0.2` shows `0.3`
- Keyboard support: digits, `+ - * /`, `Enter` or `=`, `Backspace`, `Esc`, `%`

## Built with
HTML5, CSS3 (Grid, custom properties), vanilla JavaScript (ES6). The calculation does not use `eval()`.

## Project structure
```
CodeAlpha_Calculator/
├── index.html
├── css/style.css
├── js/calculator.js
└── README.md
```

## Getting started
1. Clone the repository.
2. Open `index.html` in a browser. No build step or dependencies.

## What I learned
- Modelling calculator behaviour as state (`current`, `previous`, `operator`, `overwrite`)
- Separating the calculation logic (`compute`) from the display code (`render`)
- Why floating point arithmetic needs rounding, and why `eval()` should be avoided
- Sharing one set of functions between button clicks and keyboard events

## Possible improvements
- Calculation history panel
- Sign toggle (+/-) and square root keys
- Unit tests for the `compute` function

## Author
**Jim** · [GitHub](https://github.com/HopefulJim7) · [LinkedIn](https://linkedin.com/in/jim-hope-474430303)
