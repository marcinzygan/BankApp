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
  movements: [430, 1000, 700, 50, 90, -400, 890],
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

const displayMovements = function (movments, sort = false) {
  // clear all in containerMovments
  containerMovements.innerHTML = '';
  // sorting movements , create a copy of array to not mutate original arr
  const sortMov = sort ? movments.slice().sort((a, b) => a - b) : movments;
  // Dynamic set the each movment element to container
  sortMov.forEach(function (value, i) {
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

// CALCULATE AND DISPLAY BALANCE
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${account.balance} €`;
};

// DISPLAY SUMMARY
const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${incomes}€`;
  const withdrawal = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(withdrawal)}€`;
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

const updateUi = function (currentAccount) {
  // Display Movements
  displayMovements(currentAccount.movements);
  //Display Balance
  calcDisplayBalance(currentAccount);
  //Display Summary
  calcDisplaySummary(currentAccount);
};

createUsernames(accounts); // STW

// EVENT HANDLER FOR LOG IN
let currentAccount;

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
    //Update UI
    updateUi(currentAccount);
    // Add positive movement to the reciverAcc
    reciverAcc.movements.push(amount);
  }
});
// REQUEST LOAN
btnLoan.addEventListener('click', function (e) {
  //Prevent form from submittnig and reloading page
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  //clear input field
  inputLoanAmount.value = '';
  // Conditions of Loan : Loan is granted if any deposit is > then 10% of request
  if (
    amount > 0 &&
    currentAccount.movements.some(mov => mov >= (amount * 10) / 100)
  ) {
    //Add Positive movement
    currentAccount.movements.push(amount);
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
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

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

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const withdrawal = movements.find(mov => mov < 0);
// console.log(withdrawal);
// console.log(accounts);

// // const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// // console.log(account);

// // for of loop method
// for (const account of accounts) {
//   if (account.owner === 'Jessica Davis') {
//     console.log(account);
//   }
// }
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // equality
// console.log(movements.includes(-130));

// // SOME METHOD
// //condition
// const anyDeposits = movements.some(mov => mov > 5000);
// console.log(anyDeposits);

// // EVERY METHOD

// console.log(movements.every(mov => mov > 0));
// const arr = [1, 2, 3, [4, 5, 6], 7, 8];
// console.log(arr.flat());
// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// const accMovements = accounts.map(acc => acc.movements);
// console.log(accMovements);
// const allMovements = accMovements.flat();
// console.log(allMovements);

// const addAllMovements = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(addAllMovements);
// //with chaining
// // const overalBalance = accounts
// //   .map(acc => acc.movements)
// //   .flat()
// //   .reduce((acc, mov) => acc + mov, 0);
// // console.log(overalBalance);

// //flatmap only 1 lvl deep

// const overalBalance = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

//sort , mutates original array not working for numbers only strings
// const owners = ['jonas', 'zack', 'adam', 'marta'];
// console.log(owners.sort());
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);
// console.log(movements.sort());

//ASCENDING
//1 return < 0 A,B //keep order
// - 1 RETURN > 0 B,A  //switch order
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
// movements.sort((a, b) => a - b);
// console.log(movements);
// //DESCENDING
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
// console.log(movements);

// EMPTY ARRAYS + FILL
// const arr = [1, 2, 3, 4, 5, 6];
// const x = new Array(7);
// console.log(x);
// // x.fill(1);
// x.fill(1, 3);
// console.log(x);
// arr.fill(23, 4, 6);
// console.log(arr);
// //ARRAY.FROM
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);
// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);
// const rRoll = Array.from({ length: 100 }, () =>
//   Math.floor(Math.random() * 101)
// );
// console.log(rRoll);

// labelBalance.addEventListener('click', function () {
//   const allMov = Array.from(document.querySelectorAll('.movements__value'));
//   console.log(allMov.map(el => Number(el.textContent.replace('€', ''))));
// });
//ARRAY PRACTICE
//1
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
console.log(bankDepositSum);

// 2
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000)
//   .reduce((acc, mov, i) => i, 0);
// console.log(numDeposits1000);

// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;
// console.log(numDeposits1000);

// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
// console.log(numDeposits1000);

// //3

// const sums = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sum, cur) => {
//       if (cur > 0) sum.deposits = sum.deposits + cur;
//       else if (cur < 0) sum.withdrawal = sum.withdrawal + cur;
//       return sum;
//     },
//     { deposits: 0, withdrawal: 0 }
//   );

// console.log(sums);
// //4
// //this is a nice title -> This is a Nice Title

// const convertTitle = function (title) {
//   const exeptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLocaleLowerCase()
//     .split(' ')
//     .map(word =>
//       exeptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
//     )
//     .join(' ');
//   return titleCase[0].toUpperCase() + titleCase.slice(1);
// };
// console.log(convertTitle('this is a nice title'));
// console.log(convertTitle('this is a LONG title'));
// console.log(convertTitle('and this is a LONG and BOring title'));

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//1
dogs.forEach(function (dog) {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
});

//2
const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  `Sarah ${
    sarahDog.curFood > sarahDog.recommendedFood
      ? 'dog is eating too much '
      : 'dog is eating too litlle'
  }`
);

//3
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);
//4
console.log(`${ownersEatTooMuch.join(' and ')} dogs eating too much `);
console.log(`${ownersEatTooLittle.join(' and ')} dogs eating too little `);

console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

//current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.
//5
console.log(
  dogs.some(
    dog =>
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
  )
);
//6
const dogsOkay = dogs.some(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);
//7
const dogEatingok = dogs.filter(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);
console.log(dogEatingok);
//8
const shallowDogs = dogs.slice();

// shallowDogs.sort((a, b) => {
//   if (a.recommendedFood > b.recommendedFood) return 1;
//   if (a.recommendedFood < b.recommendedFood) return -1;
// });
console.log(shallowDogs);
shallowDogs.sort((a, b) => a.recommendedFood - b.recommendedFood);
