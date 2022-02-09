'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-22T09:48:16.867Z',
    '2019-11-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-01-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-05-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90, -400, 890],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-09-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-03-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-05-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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

const displayMovements = function (acc, sort = false) {
  // clear all in containerMovments
  containerMovements.innerHTML = '';
  // sorting movements , create a copy of array to not mutate original arr
  const sortMov = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  // Dynamic set the each movment element to container
  sortMov.forEach(function (value, i) {
    const type = value > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year} `;

    const html = `
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${value.toFixed(2)}€</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// CALCULATE AND DISPLAY BALANCE
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${account.balance.toFixed(2)} €`;
};

// DISPLAY SUMMARY
const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  const withdrawal = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(withdrawal).toFixed(2)}€`;
  // interest is 1.2% of deposited amount and intrest is  more then 1Euro
  const interest = account.movements
    .map(mov => (mov * account.interestRate) / 100)
    .filter(mov => mov > 0)
    .filter(intrest => intrest >= 1)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

// CREATE USER LOGIN BASED ON FIRST LETTERS OF FULL NAME
const createUsernames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
// UPDATE UI

const updateUi = function (acc) {
  // Display Movements
  displayMovements(acc);
  //Display Balance
  calcDisplayBalance(acc);
  //Display Summary
  calcDisplaySummary(acc);
};

createUsernames(accounts); // STW

// EVENT HANDLER FOR LOG IN
let currentAccount;
//FAKE LOGIN
currentAccount = account1;
updateUi(currentAccount);
containerApp.style.opacity = 1;
// /////////////////////////////////////////////

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //Prevent form from submittnig and reloading page

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //  Clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    //Clear focus on pin input
    inputLoginPin.blur();
    // Display UI and Welcome Message
    labelWelcome.textContent = `Welcome back , ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    //Create current Date
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = now.getHours();
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year} , ${hour}:${min}`;
    // Update UI
    updateUi(currentAccount);
  }
});

// TRANSFER MONEY BETWEEN USERS

btnTransfer.addEventListener('click', function (e) {
  //Prevent form from submittnig and reloading page
  e.preventDefault();
  // Amount to transfer
  const amount = Number(inputTransferAmount.value);
  // Transfer to
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // Check if the amount is a positive value ,check if reciverAcc acc exist, and if current user have enough money to make transfer ,also we don't want to transfer money to currentAccount  .
  // Clear Input fields
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  if (
    amount > 0 &&
    reciverAcc &&
    currentAccount.balance >= amount &&
    reciverAcc.username !== currentAccount.username
  ) {
    // Add negative movement to currentAccount
    currentAccount.movements.push(-amount);

    // Add positive movement to the reciverAcc
    reciverAcc.movements.push(amount);
    //Add Transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    reciverAcc.movementsDates.push(new Date().toISOString());
    //Update UI
    updateUi(currentAccount);
  }
});
// REQUEST LOAN
btnLoan.addEventListener('click', function (e) {
  //Prevent form from submittnig and reloading page
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  //clear input field
  inputLoanAmount.value = '';
  // Conditions of Loan : Loan is granted if any deposit is > then 10% of request
  if (
    amount > 0 &&
    currentAccount.movements.some(mov => mov >= (amount * 10) / 100)
  ) {
    //Add Positive movement
    currentAccount.movements.push(amount);

    //Add Loan Date
    currentAccount.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUi(currentAccount);
  }
});

// CLOSE ACCOUNT
btnClose.addEventListener('click', function (e) {
  //Prevent form from submittnig and reloading page
  e.preventDefault();

  const confirmUser = inputCloseUsername.value;
  const confirmPin = Number(inputClosePin.value);
  // Clear input Value
  inputCloseUsername.value = '';
  inputClosePin.value = '';

  if (
    currentAccount.username === confirmUser &&
    confirmPin === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );
    //Delete Current Account
    accounts.splice(index, 1);
    // Hide UI
    containerApp.style.opacity = 0;
    //Change Welcome Message
    labelWelcome.textContent = 'Log in to get Started';
  }
});
// SORT MOVEMENTS
let sorted = false;
btnSort.addEventListener('click', function () {
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//base 10  0 to 9
//binary base 2 - 0 1
// console.log(Number('23'));
// console.log(+'23'); // plus sign converts string to number

// //parsing
// console.log(Number.parseInt('30px', 10)); //base 10

// console.log(Number.parseFloat('2.5rem'));

// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20x'));

// //best method if value is a number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(Math.max(5, 18, 22, 3, 49));
// console.log(Math.min(5, 18, 22, 3, 49));
// console.log(Math.PI * Number.parseFloat('10px') ** 2);
// console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;

// console.log(randomInt(10, 20));

// //rounding integers

// console.log(Math.trunc(23.3));
// console.log(Math.round(23.5));
// console.log(Math.ceil(23.5));
// console.log(Math.floor(23.5));
// //rounding decimals
// console.log((2.7).toFixed(0));
// console.log(5 % 2);
// console.log(6 % 2);

// const isEven = n => n % 2 === 0;
// console.log(isEven(2));
// console.log(isEven(22));
// console.log(isEven(15));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//     if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   });
// });
//NUMERIC SEPARATOR
// const diameter = 287_460_000_000;
// console.log(diameter);

// const priceCents = 345_99;
// console.log(priceCents);
// const transferFee = 15_00;
// const PI = 3.1415;
//BIG INT
// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(23534263547584863454376578657854232434326476n);
// console.log(BigInt(23534263547584863454376578657854232434326476));

// //operations

// console.log(10000n + 10000n);

//Create a date
// const now = new Date();
// console.log(now);
// console.log(new Date('December 24 , 2015'));
// console.log(new Date(account1.movementsDates[0]));
//working with dates

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth()); //months are 0 based
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.toISOString());
// console.log(future.getTime()); //time stamp

// console.log(Date.now());
