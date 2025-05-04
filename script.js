'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2024-11-18T21:31:17.178Z',
    '2024-12-23T07:42:02.383Z',
    '2024-01-28T09:15:04.904Z',
    '2024-04-01T10:17:24.185Z',
    '2024-05-08T14:11:59.604Z',
    '2024-05-27T17:01:17.194Z',
    '2024-07-11T23:36:17.929Z',
    '2024-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Abdelqader Safi',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2024-11-01T13:15:33.035Z',
    '2024-11-30T09:48:16.867Z',
    '2024-12-25T06:04:23.907Z',
    '2024-01-25T14:18:46.235Z',
    '2024-02-05T16:33:06.386Z',
    '2024-04-10T14:43:26.374Z',
    '2024-06-25T18:49:59.371Z',
    '2024-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
/////////////////////////////////////////////////
/////////////////////////////////////////////////

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/////////////////////////////////////////////////

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const combinedMovAndDate = acc.movements.map((mov, i) => ({
    movement: mov,
    movDate: acc.movementsDates[i],
  }));

  if (sort) combinedMovAndDate.sort((a, b) => a.movement - b.movement);

  combinedMovAndDate.forEach(function (obj, i) {
    const { movement, movDate } = obj;

    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(movDate);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const day = `${date.getDate()}`.padStart(2, 0);

    const displayDate = `${day}/${month}/${year}`;

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">
          ${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${movement.toFixed(2)}€</div>
          </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => mov + acc, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};
// calcDisplayBalance(account1.movements);

const clacDisplaySummary = function (movements, intrest) {
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => mov + acc, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const outcomes = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => mov + acc, 0);
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}€`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposite => (deposite * intrest) / 100)
    .reduce((acc, deposit) => acc + deposit, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};
// clacDisplaySummary(account1.movements);

const addUser = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(element => element[0])
      .join('');
  });
};
addUser(accounts);

const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  clacDisplaySummary(acc.movements, acc.interestRate);
};

/// Implementing Login
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    /// current date
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const day = `${now.getDate()}`.padStart(2, 0);
    const hour = `${now.getHours()}`.padStart(2, 0);
    const minut = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minut}`;
    containerApp.style.opacity = 1;

    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

/// Implementing transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);

  inputTransferTo.value = inputTransferAmount.value = '';
  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);
    receiverAcc.movementsDates.push(new Date().toISOString());
    currentAccount.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
  }
});

/// Implementing request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

/// Implementing close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const index = accounts.findIndex(
    acc =>
      acc.username === inputCloseUsername.value &&
      acc.pin === +inputClosePin.value
  );
  if (accounts.indexOf(currentAccount) === index) {
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

/// Implementing sort
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
