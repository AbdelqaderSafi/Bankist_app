'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/////////////////////////////////////////////////
const displayMovements = function (movement) {
  containerMovements.innerHTML = '';

  movement.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">
          ${i + 1} ${type}</div>
          <div class="movements__value">${mov}€</div>
          </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => mov + acc, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
// calcDisplayBalance(account1.movements);

const clacDisplaySummary = function (movements, intrest) {
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => mov + acc, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => mov + acc, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposite => (deposite * intrest) / 100)
    .reduce((acc, deposit) => acc + deposit, 0);
  labelSumInterest.textContent = `${interest}€`;
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
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  clacDisplaySummary(acc.movements, acc.interestRate);
};

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 1;
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
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
    // Update UI
    updateUI(currentAccount);
  }

  // displayMovements(receiverAcc.movements);
  // calcDisplayBalance(receiverAcc);
  // clacDisplaySummary(receiverAcc.movements, receiverAcc.interestRate);
  // // inputLoginPin.value = inputLoginUsername.value = '';
  // // inputLoginPin.blur();
});

/////////////////////////////////////////////

////////////////////////////////////////////////

// const eurToUsd = 1.1;
// const movementsUsd = movements.map(mov => Math.trunc(mov * eurToUsd));
// console.log(movements);
// console.log(movementsUsd);

///////////////////////////////////////////////

// console.log(accounts);
///////////////////////////////////////////////

// const deposit = movements.filter(mov => mov > 0);
// console.log(deposit);
////////////////////////////////////////////////

//  movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const globalBalane = movements.reduce(function (acc, mov, i, curentArr) {
//   return acc + mov;
// }, 0);
// console.log(globalBalane);
/////////////////////////////////////////////////
// const arr = [5, 2, 4, 1, 15, 8, 3];
// // const humanAge = [];
// const calcAverageHumanAge = function (ages) {
//   const humanAge = ages.map(dogAge =>
//     dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4
//   );
//   const adult = humanAge.filter(age => age > 18);
//   console.log(adult);
//   console.log(humanAge);
//   const avg = adult.reduce((acc, adu) => acc + adu) / adult.length;
//   console.log(avg);
// };
// calcAverageHumanAge(arr);
// console.log(arr);

//////// Maximum value by reduce
// const max = movements.reduce(
//   (acc, mov) => (mov > acc ? mov : acc),
//   movements[0]
// );
// console.log(max);

// const jessy = accounts.find(nam => nam.owner === 'Jessica Davis');
// console.log(jessy);
