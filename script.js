const form = document.getElementById('expense-form');
const list = document.getElementById('list');
const totalDisplay = document.getElementById('total');
const clearBtn = document.getElementById('clear-btn');
const exportBtn = document.getElementById('export-btn');
const toggleThemeBtn = document.getElementById('toggle-theme');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Initialize app
updateList();
updateTotal();

// Load theme from local storage
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  toggleThemeBtn.textContent = '☀️';
} else {
  toggleThemeBtn.textContent = '🌙';
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  if (!amount || !category || !date) return;

  const expense = { amount, category, date };
  expenses.push(expense);
  saveExpenses();

  updateList();
  updateTotal();

  form.reset();
});

function updateList() {
  list.innerHTML = '';
  expenses.forEach((expense, index) => {
    const item = document.createElement('li');
    item.textContent = `${expense.date} - ${expense.category}: $${expense.amount}`;
    // Add a delete button for each expense
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.addEventListener('click', () => {
      expenses.splice(index, 1);
      saveExpenses();
      updateList();
      updateTotal();
    });
    item.appendChild(deleteBtn);
    list.appendChild(item);
  });
}

function updateTotal() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalDisplay.textContent = total.toFixed(2);
}

function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

clearBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all expenses?')) {
    expenses = [];
    saveExpenses();
    updateList();
    updateTotal();
  }
});

exportBtn.addEventListener('click', () => {
  if (expenses.length === 0) {
    alert('No expenses to export!');
    return;
  }

  let csvContent = 'Date,Category,Amount\n';
  expenses.forEach(expense => {
    csvContent += `${expense.date},${expense.category},${expense.amount}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'expenses.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const darkModeOn = document.body.classList.contains('dark-mode');
  toggleThemeBtn.textContent = darkModeOn ? '☀️' : '🌙';
  localStorage.setItem('theme', darkModeOn ? 'dark' : 'light');
});
