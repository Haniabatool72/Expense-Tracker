# Expense Tracker

A simple expense tracker built with plain HTML, CSS and JavaScript. No frameworks, no build step.

## Features

- Add income and expenses with a title, amount, category and date
- Live balance, total income and total spent
- Spending-by-category bars
- Filter the transaction list by category
- Data saved in your browser (localStorage), so it survives a refresh
- Responsive layout with automatic light and dark mode

## Run it

Open `index.html` in your browser. That's it.

## Publish on GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings > Pages**.
3. Under **Branch**, choose `main` and `/ (root)`, then save.
4. Your app will be live at `https://<your-username>.github.io/<repo-name>/`.

## Project structure

```
expense-tracker/
├── index.html   # page structure
├── style.css    # styles and light/dark theme
└── script.js    # app logic and storage
```

## Ideas to extend it

- Edit existing transactions
- Export and import data as CSV
- Monthly view with a chart
- Budget limits per category
