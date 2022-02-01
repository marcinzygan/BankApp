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

const displayMovements = function (movments) {
  // clear all in containerMovments
  containerMovements.innerHTML = '';
  // Dynamic set the each movment element to container
  movments.forEach(function (value, i) {
    const type = value > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${value}€</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
displayMovements(account1.movements);
// CALCULATE AND DISPLAY BALANCE
const calcDisplayBalance = function (movements) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance} €`;
};
calcDisplayBalance(account1.movements);

// DISPLAY SUMMARY
const calcDisplaySummary = function (movement) {
  console.log(movement);
  const incomes = movement
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${incomes}€`;
  const withdrawal = movement
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(withdrawal)}€`;
  // interest is 1.2% of deposited amount and intrest is  more then 1Euro
  const interest = movement
    .map(mov => (mov * 1.2) / 100)
    .filter(mov => mov > 0)
    .filter(intrest => intrest >= 1)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${interest}€`;
  console.log(interest);
};

calcDisplaySummary(account1.movements);

// CREATE USER LOGIN BASED ON FIRST LETTERS OF FULL NAME
const createUsernames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
    console.log(acc.username);
  });
};

createUsernames(accounts); // STW

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];

// // taking a slice of array without changing original
// // console.log(arr.slice(2));
// // console.log(arr);
// // console.log(arr.slice(-2));

// // cut out part of original array and return this part
// const cutOut = arr.splice(2);
// console.log(cutOut, 'This was cutted OUT');
// console.log(arr, 'THIS IS LEFTOVER OF ORIGINAL ARRAY');

// // adds item to index of array
// arr.splice(1, 0, '1');
// console.log(arr, '1 was added to index [1]');

// // REVERSE
// // Changes the original one
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);
// // CONCAT
// // dose not change original array
// const letters = arr.concat(arr2);
// console.log(letters);
// // JOIN
// console.log(letters.join('-'));

// const arr = [23, 64, 11];
// console.log(arr[0]);
// console.log(arr.at(0));
// // get last element of array
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));
// console.log('marcin'.at(-1));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movment] of movements.entries()) {
//   if (movment > 0) {
//     console.log(`Movment ${i + 1}  You Deposit ${movment}`);
//   } else {
//     console.log(`Movment ${i + 1}  You Withdraw ${Math.abs(movment)}`);
//   }
// }
// console.log('========= FOR EACH =========');
// // continiue and break not working in for each loop
// movements.forEach(function (movment, i, array) {
//   if (movment > 0) {
//     console.log(`Movment ${i + 1} You Deposit ${movment} ${array}`);
//   } else {
//     console.log(`Movment ${i + 1} You Withdraw ${Math.abs(movment)}`);
//   }
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'euro']);
// currenciesUnique.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// MAP METHOD

// const euroToUSD = 1.1;
// // const converted = movements.map(function (element) {
// //   return element * euroToUSD;
// // });
// // console.log(converted);

// const converted2 = [];
// for (const movement of movements) {
//   converted2.push(movement * euroToUSD);
// }
// console.log(converted2);

// const converted = movements.map(movement => movement * euroToUSD);
// console.log(converted);

// const movementsDescriptions = movements.map(
//   (movment, i) =>
//     `Movment ${i + 1} You ${movment > 0 ? 'Deposit' : 'Withdraw'} ${Math.abs(
//       movment
//     )}`
// );
// console.log(movementsDescriptions);

// const deposits = movements.filter(mov => mov > 0);
// console.log(deposits);

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

// const balance = movements.reduce(function (acc, element, i, arr) {
//   console.log(`Iteration number ${i + 1} balance :${acc}`);
//   return acc + element;
// }, 0);

// let balance = 0;
// for (const mov of movements) {
//   balance = balance + mov;
// }
// console.log(balance);

// const balance = movements.reduce((acc, element) => acc + element, 0);
// console.log(balance);

// // MAXIMUM VALUE

// const maximumVal = movements.reduce((acc, element) => {
//   if (acc > element) {
//     return acc;
//   } else {
//     return element;
//   }
// }, movements[0]);
// console.log(maximumVal);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀*/

// const calcAverageHumanAge = function (ages) {
//   console.log(ages);

//   const humanAges = ages.map(function (dogAge, i) {
//     if (dogAge <= 2) {
//       return dogAge * 2;
//     } else if (dogAge > 2) {
//       return 16 + dogAge * 4;
//     }
//   });
//   console.log(humanAges, 'Human Ages');

//   const dogsFilter = humanAges.filter(ages => ages >= 18);
//   console.log(dogsFilter, 'OlderDogs');
//   const dogsAvrage =
//     dogsFilter.reduce((acc, age) => acc + age, 0) / dogsFilter.length;
//   return dogsAvrage;
// };

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);

// CHAINING METHODS
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const euroTousd = 1.1;
// const TotalInUsd = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * euroTousd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(TotalInUsd);

// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = ages => {
//   console.log(ages);

//   const humanAges = ages
//     .map(dogAge => (dogAge <= 2 ? dogAge * 2 : 16 + dogAge * 4))
//     .filter(ages => ages >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

//   console.log(humanAges, 'Avrage Age');
// };

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2);
