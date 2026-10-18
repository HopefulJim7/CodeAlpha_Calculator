const OPERATOR_SYMBOLS = { "+": "+", "-": "\u2212", "*": "\u00d7", "/": "\u00f7" };
const MAX_DIGITS = 15;

const valueEl = document.getElementById("value");
const historyEl = document.getElementById("history");
const keypad = document.getElementById("keypad");

const state = {
  current: "0",     // number being typed, kept as a string so "0." and "1.50" are preserved
  previous: null,   // first operand once an operator is chosen
  operator: null,
  overwrite: false, // true when the next digit should start a new number
  error: false
};

function compute(a, b, operator) {
  let result;
  switch (operator) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/":
      if (b === 0) return null;
      result = a / b;
      break;
  }
  // toPrecision trims floating point noise such as 0.1 + 0.2 = 0.30000000000000004
  return parseFloat(result.toPrecision(12));
}

function render() {
  valueEl.textContent = state.current;
  historyEl.textContent = state.operator ? `${state.previous} ${OPERATOR_SYMBOLS[state.operator]}` : "";
}

function clearAll() {
  state.current = "0";
  state.previous = null;
  state.operator = null;
  state.overwrite = false;
  state.error = false;
  render();
}

function showError(message) {
  clearAll();
  state.current = message;
  state.error = true;
  render();
}

function appendDigit(digit) {
  if (state.error) clearAll();
  if (state.overwrite) {
    state.current = digit;
    state.overwrite = false;
  } else if (state.current.replace(/[-.]/g, "").length < MAX_DIGITS) {
    state.current = state.current === "0" ? digit : state.current + digit;
  }
  render();
}

function appendDecimal() {
  if (state.error) clearAll();
  if (state.overwrite) {
    state.current = "0.";
    state.overwrite = false;
  } else if (!state.current.includes(".")) {
    state.current += ".";
  }
  render();
}

function chooseOperator(operator) {
  if (state.error) return;
  if (state.operator && !state.overwrite) {
    // an operator was already pending, so finish that calculation first (2 + 3 + ...)
    const result = compute(state.previous, parseFloat(state.current), state.operator);
    if (result === null) return showError("Cannot divide by 0");
    state.previous = result;
    state.current = String(result);
  } else if (!state.operator) {
    state.previous = parseFloat(state.current);
  }
  state.operator = operator;
  state.overwrite = true;
  render();
}

function calculate() {
  if (state.error || !state.operator || state.overwrite) return;
  const result = compute(state.previous, parseFloat(state.current), state.operator);
  if (result === null) return showError("Cannot divide by 0");
  state.current = String(result);
  state.previous = null;
  state.operator = null;
  state.overwrite = true;
  render();
}

function deleteLast() {
  if (state.error || state.overwrite) return;
  state.current = state.current.length > 1 ? state.current.slice(0, -1) : "0";
  render();
}

function toPercent() {
  if (state.error) return;
  state.current = String(parseFloat((parseFloat(state.current) / 100).toPrecision(12)));
  render();
}

keypad.addEventListener("click", e => {
  const key = e.target.closest("button");
  if (!key) return;

  if (key.dataset.digit) appendDigit(key.dataset.digit);
  else if (key.dataset.operator) chooseOperator(key.dataset.operator);
  else if (key.dataset.action === "decimal") appendDecimal();
  else if (key.dataset.action === "equals") calculate();
  else if (key.dataset.action === "clear") clearAll();
  else if (key.dataset.action === "delete") deleteLast();
  else if (key.dataset.action === "percent") toPercent();
});

document.addEventListener("keydown", e => {
  if (e.key >= "0" && e.key <= "9") appendDigit(e.key);
  else if (["+", "-", "*", "/"].includes(e.key)) {
    e.preventDefault(); // "/" would otherwise open quick find in Firefox
    chooseOperator(e.key);
  }
  else if (e.key === ".") appendDecimal();
  else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault(); // stop Enter from re-clicking a focused button
    calculate();
  }
  else if (e.key === "Backspace") deleteLast();
  else if (e.key === "Escape") clearAll();
  else if (e.key === "%") toPercent();
});

render();
