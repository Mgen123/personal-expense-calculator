// TypeScript interfaces
interface Expense {
    name: string;
    amount: number;
    category: string;
}

interface Income {
    amount: number;
    date: Date;
}

// Data storage
let incomes: Income[] = [];
let expenses: Expense[] = [];

// DOM Elements
const incomeInput = document.getElementById("incomeInput") as HTMLInputElement;
const expenseName = document.getElementById("expenseName") as HTMLInputElement;
const expenseAmount = document.getElementById("expenseAmount") as HTMLInputElement;
const expenseCategory = document.getElementById("expenseCategory") as HTMLSelectElement;

// Add Income
function addIncome(): void {
    const amount = parseFloat(incomeInput.value);
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid income amount");
        return;
    }

    incomes.push({ amount, date: new Date() });
    incomeInput.value = "";
    updateUI();
}

// Add Expense
function addExpense(): void {
    const name = expenseName.value.trim();
    const amount = parseFloat(expenseAmount.value);
    const category = expenseCategory.value;

    if (!name) {
        alert("Please enter an expense name");
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid expense amount");
        return;
    }

    expenses.push({ name, amount, category });
    expenseName.value = "";
    expenseAmount.value = "";
    updateUI();
}

// Calculate total income
function calculateTotalIncome(): number {
    return incomes.reduce((total, income) => total + income.amount, 0);
}

// Calculate total expenses
function calculateTotalExpenses(): number {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
}

// Calculate remaining balance
function calculateRemainingBalance(): number {
    return calculateTotalIncome() - calculateTotalExpenses();
}

// Get expenses by category
function getExpensesByCategory(): Map<string, number> {
    const categoryMap = new Map<string, number>();
    expenses.forEach((expense) => {
        const current = categoryMap.get(expense.category) || 0;
        categoryMap.set(expense.category, current + expense.amount);
    });
    return categoryMap;
}

// Update UI
function updateUI(): void {
    // Update summary
    const totalIncome = calculateTotalIncome();
    const totalExpenses = calculateTotalExpenses();
    const remainingBalance = calculateRemainingBalance();

    document.getElementById("totalIncome")!.textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById("totalExpenses")!.textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById("remainingBalance")!.textContent = `$${remainingBalance.toFixed(2)}`;

    // Update income list
    const incomeList = document.getElementById("incomeList")!;
    incomeList.innerHTML = "<h3>Income History</h3>";
    incomes.forEach((income, index) => {
        const div = document.createElement("div");
        div.className = "list-item";
        div.innerHTML = `
            <span>${income.date.toLocaleDateString()}</span>
            <span>$${income.amount.toFixed(2)}</span>
            <button onclick="removeIncome(${index})">❌</button>
        `;
        incomeList.appendChild(div);
    });

    // Update expense list
    const expenseList = document.getElementById("expenseList")!;
    expenseList.innerHTML = "<h3>Expense History</h3>";
    expenses.forEach((expense, index) => {
        const div = document.createElement("div");
        div.className = "list-item";
        div.innerHTML = `
            <span>${expense.name}</span>
            <span>${expense.category}</span>
            <span>$${expense.amount.toFixed(2)}</span>
            <button onclick="removeExpense(${index})">❌</button>
        `;
        expenseList.appendChild(div);
    });

    // Update category summary
    const categorySummary = document.getElementById("categorySummary")!;
    categorySummary.innerHTML = "<h3>Category Breakdown</h3>";
    const categoryMap = getExpensesByCategory();
    categoryMap.forEach((amount, category) => {
        const div = document.createElement("div");
        div.className = "category-item";
        div.innerHTML = `
            <span>${category}</span>
            <span>$${amount.toFixed(2)}</span>
        `;
        categorySummary.appendChild(div);
    });
}

// Remove functions
function removeIncome(index: number): void {
    incomes.splice(index, 1);
    updateUI();
}

function removeExpense(index: number): void {
    expenses.splice(index, 1);
    updateUI();
}

// Make functions globally accessible
(window as any).addIncome = addIncome;
(window as any).addExpense = addExpense;
(window as any).removeIncome = removeIncome;
(window as any).removeExpense = removeExpense;

// Initial UI update
updateUI();

console.log("Personal Expense Calculator loaded!");

// TODO: Add currency support
// The currency selector will update all displayed amounts
