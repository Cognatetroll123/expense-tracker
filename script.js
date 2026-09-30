const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");

const transactionListEl =
    document.getElementById("transaction-list");

const transactionFormEl =
    document.getElementById("transaction-form");

const descriptionEl =
    document.getElementById("description");

const amountEl =
    document.getElementById("amount");


// Get transactions from localStorage
let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];


// Form submit
transactionFormEl.addEventListener("submit", addTransaction);


// Add Transaction
function addTransaction(e) {

    e.preventDefault();

    const description =
        descriptionEl.value.trim();

    const amount =
        parseFloat(amountEl.value);


    // Check input
    if (!description || isNaN(amount)) {
        return;
    }


    // Create transaction
    const transaction = {

        id: Date.now(),

        description: description,

        amount: amount
    };


    // Add transaction to array
    transactions.push(transaction);


    // Save to localStorage
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    // Update UI
    updateTransactionList();
    updateSummary();


    // Clear form
    transactionFormEl.reset();
}


// Display Transactions
function updateTransactionList() {

    // Clear old list
    transactionListEl.innerHTML = "";


    // Show newest transaction first
    const sortedTransactions =
        [...transactions].reverse();


    sortedTransactions.forEach((transaction) => {

        const transactionEl =
            createTransactionElement(transaction);

        transactionListEl.appendChild(transactionEl);

    });
}


// Create Transaction Element
function createTransactionElement(transaction) {

    const li = document.createElement("li");


    li.classList.add("transaction");


    // Income or expense class
    li.classList.add(
        transaction.amount >= 0
            ? "income"
            : "expense"
    );


    li.innerHTML = `

        <span>
            ${transaction.description}
        </span>

        <span>

            ${formatCurrency(transaction.amount)}

            <button
                class="delete-btn"
                onclick="removeTransaction(${transaction.id})"
            >
                x
            </button>

        </span>

    `;


    return li;
}


// Remove Transaction
function removeTransaction(id) {

    transactions =
        transactions.filter(
            (transaction) =>
                transaction.id !== id
        );


    // Save updated transactions
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    // Update UI
    updateTransactionList();
    updateSummary();
}


// Update Summary
function updateSummary() {

    // Calculate balance
    const balance =
        transactions.reduce(
            (total, transaction) =>
                total + transaction.amount,
            0
        );


    // Calculate income
    const income =
        transactions
            .filter(
                (transaction) =>
                    transaction.amount > 0
            )
            .reduce(
                (total, transaction) =>
                    total + transaction.amount,
                0
            );


    // Calculate expenses
    const expenses =
        transactions
            .filter(
                (transaction) =>
                    transaction.amount < 0
            )
            .reduce(
                (total, transaction) =>
                    total + Math.abs(transaction.amount),
                0
            );


    // Display values
    balanceEl.textContent =
        formatCurrency(balance);

    incomeAmountEl.textContent =
        formatCurrency(income);

    expenseAmountEl.textContent =
        formatCurrency(expenses);
}


// Format Currency
function formatCurrency(number) {

    return "Rs " + number.toLocaleString("en-IN", {

        minimumFractionDigits: 2,

        maximumFractionDigits: 2

    });
}


// Load data when page opens
updateTransactionList();
updateSummary();
