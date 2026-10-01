const STORAGE_KEY = "expense-tracker:transactions";

const form = document.getElementById("form");
const listEl = document.getElementById("list");
const filterEl = document.getElementById("filter");
const breakdownEl = document.getElementById("breakdown");

let transactions = load();

document.getElementById("date").valueAsDate = new Date();

// Fill the filter dropdown from the category select
[...document.getElementById("category").options].forEach((opt) => {
  filterEl.add(new Option(opt.value, opt.value));
});

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function money(n) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function render() {
  const income = sum(transactions.filter((t) => t.type === "income"));
  const spent = sum(transactions.filter((t) => t.type === "expense"));
  document.getElementById("income").textContent = money(income);
  document.getElementById("expense").textContent = money(spent);
  const balanceEl = document.getElementById("balance");
  balanceEl.textContent = money(income - spent);
  balanceEl.className = "balance " + (income - spent < 0 ? "neg" : "");

  renderBreakdown(spent);
  renderList();
}

function sum(items) {
  return items.reduce((total, t) => total + t.amount, 0);
}

function renderBreakdown(spent) {
  const totals = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => (totals[t.category] = (totals[t.category] || 0) + t.amount));

  const rows = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  breakdownEl.innerHTML = rows.length
    ? ""
    : '<p class="empty">Add an expense to see where your money goes.</p>';

  rows.forEach(([category, amount]) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <div class="bar-label"><span></span><span>${money(amount)}</span></div>
      <div class="bar"><span style="width:${(amount / spent) * 100}%"></span></div>`;
    row.querySelector(".bar-label span").textContent = category;
    breakdownEl.appendChild(row);
  });
}

function renderList() {
  const filter = filterEl.value;
  const shown = transactions
    .filter((t) => filter === "all" || t.category === filter)
    .sort((a, b) => b.date.localeCompare(a.date));

  listEl.innerHTML = shown.length ? "" : '<li class="empty">No transactions yet.</li>';

  shown.forEach((t) => {
    const li = document.createElement("li");
    const sign = t.type === "income" ? "+" : "-";
    li.innerHTML = `
      <div class="info"><strong></strong><small></small></div>
      <span class="${t.type === "income" ? "pos" : "neg"}">${sign}${money(t.amount)}</span>
      <button type="button" aria-label="Delete transaction">Delete</button>`;
    li.querySelector("strong").textContent = t.title;
    li.querySelector("small").textContent = `${t.category}, ${t.date}`;
    li.querySelector("button").addEventListener("click", () => {
      transactions = transactions.filter((x) => x.id !== t.id);
      save();
      render();
    });
    listEl.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  transactions.push({
    id: Date.now(),
    title: document.getElementById("title").value.trim(),
    amount: parseFloat(document.getElementById("amount").value),
    type: document.getElementById("type").value,
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
  });
  save();
  render();
  form.reset();
  document.getElementById("date").valueAsDate = new Date();
});

filterEl.addEventListener("change", renderList);

render();
