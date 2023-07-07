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
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-12-19T17:01:17.194Z',
    '2022-12-21T23:36:17.929Z',
    '2022-12-25T10:51:36.790Z',
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
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);
  //console.log(daysPassed);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(locale).format(date); //and in this case we don't want any options object, because here we don't need the hours or the minutes, all we want to simply display the date as simple as possible. And in that case we don't even need any options.
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]); //as we saw this is gonna be a nicely formatted time string. And so, we can use that string to create a new date() object. And we need that object so that then from there, we can call our usual methods to get the date and the month and the year. And so, that's the reason why we need to convert these strings back into a JavaScript object, because only then, we can actully work with that data.
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    // new Intl.NumberFormat(acc.locale, {
    //   style: 'currency',
    //   currency: acc.currency,
    // }).format(mov); // However the number itself is still formatted in the Portuguese way. So that's the current locale of the current user.

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
     <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>


    `;

    containerMovements.insertAdjacentHTML('afterbegin', html); //The insertAdjacentHTML () is a method of the Element interface so that you can invoke it from any element. The insertAdjacentHTML () method parses a piece of HTML text and inserts the resulting nodes into the DOM tree at a specified position: The positionName is a string that represents the position relative to the element.

    /*The positionName is a string that represents the position relative to the element. The positionName accepts one of the following four values:

'beforebegin': before the element
'afterbegin': before its first child of the element.
'beforeend': after the last child of the element
'afterend': after the element
Note that the 'beforebegin' and 'afterend' are only relevant if the element is in the DOM tree and has a parent element.*/
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0); // 100 % 60 = 40

    // In each call, print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;

    //when 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // Decrease 1sec
    time--; //HOwever you might have noticed that we still have a problem which is the fact that actually we get logged out once this the(labeltimer is 1 second). And so that not what we want to happen. This would only happen at zero second not at the one second and the problem here is that we decrease this time by 1 second before checking for zero. So, the problem here is that in the duration here. So in the callback function where the time is 1 and then we decrease to 0, then we check for 0 and so in this iteration where the time is intially one the (if statement) was still get executed. And that because we decrease that 1 second to 0. *(so, we need to decrease the time by one second after the checking of (if statement)). Like we already have done here.
  };

  // Set time to 5 minutes
  let time = 120;
  // Call the timer every second
  tick(); //we called this function immediately and after that below we also started calling it every second using the setInterval function below.
  const timer = setInterval(tick, 1000); //AS we login it takes quite some time until something happends in the user interface. (So you'll see it before it was still at one second so it was the value that we had before. And that happens because this entire function here only first executed after 1 second so, this callback function() that we passed is not called immediately it will only get called the first time after one second. But in fact we want to call this function also immediately. And the trick of doing that is to export this into a separate function like we did here, then call it immediately and then also start calling it every second using the setInterval function.

  return timer; //We'll log in as Jonas user so you see that the timer is running and now we'll also log in as Jessica Davis, just to see you yet another problem that we have.
  //So you see it's weirdly alternating between these two numbers. And the reason for that is that right now we have basically two timers running at the same time. So, one timer of Jonas and one timer of Jessica. And that's not at all what we need that's a big problem right now so how can we fix that problem. Well basically, what we can do is that whenever we log a user in, we check if there is already a timer running. And if so we stop that timer.
  //And so what we'll going to do now is to return the timer from this function (start log out timer) so that we can then use it in this call back function of the login and delete it in case it exists. So here, we will return to timer and that's important because to clear the timer,

  //so to use the clear interval function, we need the timer variable. And therefore we're returning it here.
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer; //Now, we actually need this timer as a global variable. So that's why put it outside here. And the reason for that is that we need this variable to persist(continue to exist; be prolonged:) between different logins. So otherwise after this handler function would be ready, then the timer variable would disappear. So, that's the reason why we have current account out here, and it's also the reason why we need to keep the timer out here. That's the only way in which we can then actually check if it appears. So timer and the current account both need to be in the parent scope of this function scope*(event handler of loginbtn).

//FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerAppstyle.opacity = 100;
// we only want day/month/year, and this is how they display it in Europe, now of course you can format it in any way that you want, for example how it looks like in your country.

// Experimenting API

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Create current date and time with Internationalization API:

    //Intl is basically is the name space for the internationalization API. And for times and dates we use the DateTimeFormat() function. Now all we need to paas into this function here is a so-called "locale" string. And this "locale" is basically the language and then '-' the country. And all of this here will create here a so-called formatter for this language in this country. So English-US. So all of this here creates a formatter. And then on that formatter, we can call dot'.' format(). And now here we can actully pass in the date that we actually want to format.

    //So that's 'now'. Right now it only displays the date here, but not any time. And so we can change that by providing an options object to the function here. And now we have to provide this options variable as a second argument into the DateTimeFormat function. So as you see now we get indeed the time.
    const noW = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', //For month we can also write long, so after chooing long for month we will get the name of the month, you can also specify the month as 2-digit.
      year: 'numeric', //that's 2022 but we can also say just 2-digit.
      //weekday: 'long', //it will write out the day completely. Now here you can also say 'short' or 'narrow'.
    };

    // const locale = navigator.language;
    // console.log(locale); //Now in many situations, it actually makes more sense to not define the locale manually, but instead to simply get it from the user's browser.

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(noW); //Now the date is actually formatted, just like it is ususally formatted in the U.S. with the month first and then the day. And to get these different codes, just goolge "iso language code table".

    //Create current date and time :
    // const day = `${nOw.getDate()}`.padStart(2, 0);
    // const month = `${nOw.getMonth() + 1}`.padStart(2, 0);
    // const year = nOw.getFullYear();
    // const hour = `${nOw.getHours()}`.padStart(2, 0);
    // const min = `${nOw.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}: ${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Timer :
    if (timer) clearInterval(timer); //so let's think what happens when we log infirst as Jonas. So when we log in now there is gonna be no timer. But now since I did login, now timer is equal to timer that we just exported from this startLogOutTimer() function using the return keywords. And so this timer now does exist. And so now when we login as someone else js for example, then when the code reaches this line here, then a timer will indeed exist. And so then that timer is going to be cleared. And so now there is no problem any more.(It's all kind of matter of thinking about what we want our code to do. So all we're doing here is to use all the tools that we already know to basically achieve one goal that we want to achieve.)

    timer = startLogOutTimer(); //so, here we would set the timer to the timer that is returned here. However if there is already a timer we first need to clear it.

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString()); // as we seen in the last section at the beginning of the project in the real world we would probably have an object for each movement. And so that object would then contain the amount, the date, and some other information about the movement, but we don't want to restructure the application now and therefore we simply created the separate movements dates.

    //So the new Date() that we added in the movementsDates looks little bit different compared to the other dates because actully it is really the object itself. So, that's not good so let's instead use the "toISOString" right here on the date.

    // Update UI
    updateUI(currentAccount);

    //REset the timer :
    //Now, another functionality that we want our timers to have is to basically reset once we done something in the account, because remember the goal of this timer here is to track the inactivity of the user. But if I do something then we should not get logged out. It should be resetted. So what we need to do now is to also reset the timer whenever the user does a transfer or requests a loan. So these are the only activities that exist in our application. And so these operations should always trigger the timer to be reset.
    //so what does resetting the timer actually mean?
    //Well, all we need to do is to basically clear interval using the timer that we already have and then start it again.
    clearInterval(timer); // And now one more time it is important that this timer variable is actually a global variable.So, variable that is outside of any of these handler functions.
    timer = startLogOutTimer(); //so imagine that the timer was at 1 min 30 seconds. So, when we do a transfer, that timer is cleared and a new timer is started again at 2 minutes.
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1))
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      //Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // REset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
_____________________________________________________________________________________________________________________                                        Converting and Checking Numbers:
_____________________________________________________________________________________________________________________

In JavaScript, all numbers are represented internally as floating point numbers. 
So basically, always as decimals, no matter if we actually write them as integers or as decimals. 
*/
console.log(23 === 23.0); //and so you see that 23 is,in fact, the same as 23.0. And that's the reason why we only have one data type for all numbers. Also numbers are represented internally in a 64 base 2 format. So, that means that numbers are always stored in a binary format. So basically, they're only composed of zeros and ones.

//Now, in this binary form it is very hard to represent some fractions that are very easy to represent in the base 10 system that we are used to. So base 10 is basically the numbers from zero to 9,

//while binary is base 2 and so that's the numbers zero and one.

// Base 10 - 0 to 9.    1/10 = 0.1. 3/10 = 3.3333333333 until infinity.
// Binary base 2 - 0 1

//So, as I was saying there are certain numbers that are very difficult to represent in base 2. And one example of that is the fraction 0.1. And that results in very weird results like this.
console.log(0.1 + 0.2); //JavaScript basically have no better way of representing this number. So in base 10 1/10 is simply 0.1 that's very easy to represent, but for example if we were trying to do 3/10, then that is also impossible to represent for us. In binary same thing happens with 0.1. So we get basically an infinite fraction and that then results in a weird result like this.

//Now, in some cases, JavaScript does some rounding behind the scenes to try its best to hide these problems but some operation simply this one simply cannot mask the fact that behind the scenes, they cannot represent certain fractions. And by the way many other languages use the same system. For example : php and ruby.

//So, be aware that you cannot do like really precise scientific or financial calculations in JavaScript becaue eventually, you will run into a problem like this.
console.log(0.1 + 0.2 === 0.3);

//Now we know, how JavaScript represents numbers let's go back to actually working with them.

//Easier way to convert string into number: which is simple +23 to sting. This works because when JavaScript sees the plus operator, it will do type coercion. So it'll automatically convert all the operands to numbers.
console.log(Number('23'));
console.log(+'23'); //so it looks little bit cleaner.

// Parsing : So the Number function is actually is an object cause remember that every function is also an object.  And this Number here have some methods to do parsing. So let's use parseInt. So we can parse a number from a string. And "int" word in it stands for integers. And that string can also include some symbols. And JavaScript will then automatically try to figure out the number that is in this string. Now in order to this work the string needs to start with a number.
console.log(Number.parseInt('20px', 10));
console.log(Number.parseInt('px23', 10)); //so this is little bit like "type coercion" but even more advanced because we just saw, it tries to get rid of unnecessary symbols that are not numbers. And this can be very useful.

//Now the parseInt actually accepts a second argument, which is the so-called "regex". And the regex is the base of the "numeral system" that we are using. So here we are simply using base 10 numbers. Sao numbers from 0-9. And most of the time we are doing that and so we should always pass in the number 10 here. So, that can avoid bugs in some situations. But if we are working for example binary, then we would write 2 and then the result would be completely different.

console.log(Number.parseFloat('2.5rem')); // And so now it reads the decimal number from our string. So, a floating point number.For example : coming from CSS.
console.log(Number.parseInt('2.5rem')); // and then we will get only the integer part.

//By the way these two functions here are actually also so-called gloabal functions. So we would not have to acall them on Number.
// console.log(parseFloat('3.5rem'));but this is the more traditional way of doing it. NOw in modern JavaScript, it is more encouraged to call these functions actually on the Number object.

//So we can say that Number here provides something called name space.

// Check if value is NaN :
console.log(Number.isNaN(20)); // And we can use this one to basically check if any value is a number. Well not any value...
console.log(Number.isNaN('20')); //We get a false because this also isn't not a number it's just a regular value.
console.log(Number.isNaN(+'20X')); //This is offcourse NaN.
console.log(Number.isNaN(23 / 0)); //So, infinity is also not a NaN. The special value of Infinity also exists in JavaScirpt. And so this is not a number is not a perfect way for checking if a value is a number because it doesn't consider this use case and sometimes, this might very well happen. And therefore there is a better method called isFinite.

// Checking if a value is a number:
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20'));
console.log(Number.isFinite(23 / 0)); //And so this method is the ultimate method that you should use to check if any value is a number, at least when you're working with floating point numbers. So if you are sure that you just need to check for an integer, then you can use isInteger as well.

console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23 / 0)); //false

/*
_____________________________________________________________________________________________________________________                                               Math And Rounding                             
_____________________________________________________________________________________________________________________ 
We've been already using lots of mathematical operations, for example +,-,*,/, exponentiation and so on. And so we don't need to go over these again. 

So, let's start here with the square root: And so just like many other functions the square root is part of the math namespace.
*/
console.log(Math.sqrt(25)); //so this stands for square root. And so all we need to do is just pass in number and then it will give us the square root. And same could be achieved using the 'exponentiation operator' as well. By doing 1/2. And that 2 is the square. And actually we would have to put this into parenthesis().
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3)); //and same would be work for a cubic root.

console.log(Math.max(5, 18, 23, 11, 2)); //23
console.log(Math.max(5, 18, '23', 11, 2)); //and this max function here actually does type coercion. So, it should now still give us 23 , ok but it doesn't "parsing".

//Type coercion : Type coercion is the automatic or implicit(suggested though not directly expressed) conversion of values from one data type to another (such as strings to numbers). Type conversion is similar to type coercion because they both convert values from one data type to another with one key difference — type coercion is implicit whereas type conversion can be either implicit or explicit(stated clearly and in detail, leaving no room for confusion or doubt). You can look for examples in MDN documents.

console.log(Math.min(5, 18, 23, 11, 2)); //2

//Now, besides a couple of methods, there are also constants on the Math object or on the Math namespace. And for example if we wanted to calculate the area of a circle with 10pixles radius, we could do that:
console.log(Math.PI * Number.parseFloat('10px') ** 2); //this is how we calculate the area of a circle with this 10px radius.

//Now another thing that is on Math object is the random function that we already have been using a couple of times. And it's really imporatant to generate good random numbers when we need them.
console.log(Math.floor(Math.random() * 6) + 1); //so Math.random() will give us the number between 0 and 1. And then we multiply this by 6 and then we removed basically the decimal part by doing Math.trunc or Math.floor. Now the problem with this was that then the highest number could be 5. And so we simply added "+1" to offset(a consideration or amount that diminishes (make or become less.) or balances the effect of an opposite one.) that truncation here. And then we will get the values between really 1 and 6.

//Generalization function which works in all situations :
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
//0...1 -> 0...(max-min) -> min...(max - min + min) and we end up with a range between the minimum and the maximum value that we specified.

// console.log(randomInt(10, 20));

//Rounding Intergers:
console.log(Math.trunc(23.3)); //so, this one removes any decimal part always but we have also other ways.

console.log(Math.round(23.9)); //24 so, this one will always round to the nearest integer.
console.log(Math.round(23.5)); //24
console.log(Math.round(23.2)); //23

console.log(Math.ceil(23.3)); //24 and The Math.ceil() function always rounds up and returns the smaller integer greater than or equal to a given number..
console.log(Math.ceil(23.9)); //24
//Round Down : To use a lower or the next-lowest number, especially so as to eliminate decimal places. (Usually done when the non-whole number is less than .5; higher than that, and the number would typically be rounded up.)

console.log(Math.floor(23.3)); //23
console.log(Math.floor('23.9')); //these two both be rounded down to 23.
//and by the way all these methods, they also do type coercion.

//Now you might think that floor and trunc are very similar. And indeed they do the same when we are dealing with positive numbers. So basically floor and trunc, both cut off the decimal part when we are dealing with positive numbers. However for negative numbers, it doesn't work this way.
console.log(Math.trunc(-23.9)); //-23 now this one here just like before it gets truncated so it simply removes the part which comes after decimal.
console.log(Math.floor(-23.9)); //-24 but floor now gets rounded to -24. Because with negative numbers, rounding works the other way around(opposite way or in the opposite order). So, actully floor is better than trunc because it works in all situations, no matter if we are dealing with positive or negative numbers.
console.log(Math.floor(-23.3)); // -24
console.log(Math.floor(23.2)); //23
console.log(Math.floor(23.6)); //23

//Rounding decimals : Now with decimals it works in a little bit different way. In decimals we have to specify the number in parenthesis(). And on that number we call toFixed method.
console.log((2.7).toFixed(0)); //3. -> with 0 it is converted to 3. So toFixed will always return a string and not a number.
console.log((2.7).toFixed(3)); //2.700 -> it returns 2.7 and it adds zeros until it has exactly three decimal parts.
console.log((+2.345).toFixed(2)); //2.35
//Just keep in mind that this method here works in a similar way than the string methods. So this is a number, so it's primitive. And primitives actually don't have methods. And so behind the scenecs, JavaScript will do the boxing. And boxing is to basically transform this to a number object, then call the method on that object. And then once the operation is finished it will convert it back to a primitive.

//There are a lot more functions like logarhythmical functions or sinuses, then ofcourse you can always check out the MDN documentation.

/*
_____________________________________________________________________________________________________________________                                              The Remainder operator                            
_____________________________________________________________________________________________________________________

The remainder operator, has actually some special use cases. The remainder operator simply returns the remainder of a division.
*/
console.log(5 % 2); //1
console.log(5 / 2); //2.5 -> 5 = 2 * 2 + 1
console.log(8 % 3); //2
console.log(8 / 3); //2.6666 -> 8 = 2 * 3 + 2

//Now one thing that is many times useful in programming is to check whether a certain number is even or odd. So, even numbers are zero, two, four, six, eight, 10 and so on and so forth.
//And the odd numbers are the others : so 1, 3, 5, 7 etc.

console.log(6 % 2); //0
console.log(6 / 2); //0

console.log(7 % 2);
console.log(7 / 2);
//so now we can use this knowledge to check whether a certain number is even or odd.

const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    // 0, 2, 4, 6
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';

    // 0, 3, 6, 9
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  }); //And actually just like before this here actually has to happen inside of a handler,because this code here, will execute right when we start our application but then as we login we over write that with the deposits of the current user.
});
//So, whenever you need to something every Nth time then it is good idea to use the remainder operator for that. So this is how we use the remainder operator our another tool box now.

/*
_____________________________________________________________________________________________________________________                                             Numeric Separators                                                
_____________________________________________________________________________________________________________________
Starting from ES 2021, we can use a feature called "Numeric Separators" to format(the way in which something is arranged or set out) numbers in a way that is easier for us , or for other developers to read and to understand. So, let's say that we wanted to represent a really large number. For example, the diameter of our solar system.
*/
// 287,460,000,000
const diameter = 287_460_000_000; //its relly hard to read here there are just too many zeros to read here.

//So, numeric separators are simply underscores that we can place anywhere that we want in our numbers, and which will make it really easy to understand and to parse numbers this large. So, using the underscore here as here as a thousand separator, then makes it really easy to understand, that this number here means in fact, 287 billion.
console.log(diameter); //and so here we sees that the engine basically ignores these underscores. So these numeric separators. It simply sees the number itself. And so what this means is that we can actually place the underscores, so the numeric separators, anywhere that we want.
//So underscore is not allowed to place at the beggining of the number at the end of the number and at the right and left side of the decimal of the number. Also we cannot place 2 underscore in a row. So, all of these are illigal.
const priceCents = 345_99; //the value after the underscore is represented as cents.
console.log(priceCents);

const transferFee1 = 15_00;
const transferFee2 = 1_500;

const PI = 3.14_15;
console.log(PI);

console.log(Number('230_000')); //So what that means is that you should really only use, these numeric separators, when you're writing down numbers. So really in the code. If you need to store a number in a string, for example, in an API, or if you get a number as string from an API, you should not use underscores in there, because then JavaScript will not be able to parse the number correctly out of the string. So, it's not gonna work as expected and you will get it's not a number, that might then introduce bugs into your application. And the same is true with the "parseInt" function.
console.log(parseInt('230_000')); // 230 so we will not get the whole number it will only show the number which is in front of the underscore.

/*
_____________________________________________________________________________________________________________________                                              Working with BigInt
_____________________________________________________________________________________________________________________

Let's now meet one of the primitive data types that we never talked about before and that is BigInt. So Big Int is a special type of integers that was introduced in 2020 and let's quickly take a look at it.
So we learned in the first section that numbers are represented internally as 64 bits. And that means that there are exactly 64 ones or zeros to represent any given number. Now these 64 bits only 53 are used to actually store the digits themselves. The rest are storing the position of the decimal point and the sign. 

Now, if there are only 53 bits to store the number, that means that there is a limit of how big numbers can be, and we can calculate that number. So that's two elevated to 53 and then -1, because the numbers starts at zero.

*/
console.log(2 ** 53 - 1); // And it is 2 because again we are working with base 2, which only zero and ones. And this is so important that it's even stored into the number namespace as Max_safe_integer. So, this is the biggest number that JavaScript can safely represent.
console.log(Number.MAX_SAFE_INTEGER); //so this gives us the exact same number. So any integer that is larger than this is not safe and that means it cannot be represented accurately.

console.log(2 ** 53 + 0); //So we keep adding numbers here and they are always the same. And so that means that JavaScript can simply not represent these numbers accurately. And so if we do calculations with numbers that are bigger than this, than we might lose precision(the quality, condition, or fact of being exact and accurate). So, in some numbers it does actually work for some reason, but that's because JavaScript behind the scenes uses some tricks to still represent some of the unsafe numbers. But again sometimes it works, sometimes it doesn't. And so that's why we call these unsafe numbers.
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);
//So this can be a problem sometimes because in some situations we might need really really big numbers way bigger than this one. For example for "data base IDs", or when interacting with real "60 bit numbers" and these numbers are actually used in other languages. And we might for example from some API, get a number that is larger than this. And then we have no way of storing that in JavaScript , at least not untill now, because now starting from ES2020 a new primitive was added, which is called BigInt. And BigInt stands for "Big Integer". That can be used to store numbers as large as we want. So no matter how big.

console.log(53489754389753849573849573489755893453433n); // before using 'n' it probably does not have precision(the quality, condition, or fact of being exact and accurate) because it's larger than the number we saw before but if we use the 'n', then this will be a "BigInt". And so this 'n' here basically transforms a regular number, into a BigInt number and it does also look different in the console. So this is a really really huge number, but now JavaScript has a way of finally displaying this number here in console accurately.

console.log(BigInt(53489754389753849573849573489755893453433)); // we can also create the BigInt by using the BigInt function. So sometimes that's necessary and without the 'n'. And so this give us kind of the same result, well not really, for some reason, but it is because JavaScript will first have to still represent this number here internally, before it can then transform it into a BigInt. And that's the reason why here from a certain point on this second number is different.
//So this constructor function should probably only be used with small numbers for example :
console.log(BigInt(53489754));

//Operations:
console.log(10000n + 10000n);
console.log(
  438975348925734895734857348957348957349857348957348957348957348957n *
    10000000000000000000n
);

//Now what is not possible is to mix BigInts with regualar numbers.

const huge = 2324923099324832934832432848n;
const num = 23;
console.log(huge * BigInt(num)); //then we will get this type of error :TypeError: Cannot mix BigInt and other types, use explicit conversions.
//and so this is where we then have to convert this number here to BigInt this is where the constructor function becomes necessary. And so now it's going to work.

//EXCEPTIONS:
//However there are exceptions of this which are the comparison operators and the plus operator when working with strings.
console.log(20n > 15); //true
console.log(20n === 15); //false . we get the false but that makes sense because JavaScript when we use the triple operator does not do type coercion. And in fact these two values here, they have a different primitive type. 15 is a regualar number and 20n is a BigInt.
console.log(typeof 20n, typeof 15);

//however if we do the regualr equality operator, so the loose one the this should still be true. because then JavaScript does the type coercion and so then it will coerce 20n to a regular number. And they both are the same.
console.log(20n == '  15');

console.log(huge + '   is REALLY big!!!'); //so you can see in this case the number is not actually converted to a string. So even the BigInt number.

//One another thing that also the math operations that we talked about earlier are not gonna work here.

// console.log(Math.sqrt(16n)); so that doesn't work.

// Divisions
console.log(11n / 3n); //3n it will simply then return the closest BigInt. So, basically it cuts the decimal parts off.
console.log(10 / 3);

/*
_____________________________________________________________________________________________________________________                                                Creating Dates :
_____________________________________________________________________________________________________________________ 
Now dates and time can be little bit messy and confusing in JavaScript.
*/
//Create A Date : There are the four ways of creating a date in JavaScript and they all use the new date constructor function, but they can accept different parameters.

const now = new Date();
console.log(now); //we get the current date and time at this very movement.

//Parse the date from a date string:

console.log(new Date('Dec 25 2022 18:01:23')); //so simply giving JavaScript a string here and it will then automatically parse the time based on that.

//WE can also of course write a string ouselves.
console.log(new Date('December 24, 2015')); // so indeed that works and we even get the day of the week here, however it's generally not a good idea to do this because it can be quite unreliable. However, if the string was actually created by JavaScript itself, then of course it is pretty safe.

console.log(new Date(account1.movementsDates[0])); //The Z here means here UTC. So that's the coordinated Universal Time, which is basically the time without any time zone in London and also without daylight savings.

//So that's based on a string, but we can also pass in year, month, day, hour, minute, hence even second into this constructor.

console.log(new Date(2037, 10, 19, 15, 23, 5));
console.log(new Date(2037, 10, 31, 15, 23, 5)); //The month here in JavaScript is zero based. Now what's cool about this is that JavaScript actually autocorrects the day. We know that November only has 30 days, and so if we take a look at this, it will then autocorrect right to the next day. So, that's gonna be December 1st.

console.log(new Date(0)); //Finally we also pass into the date constructor function, the amount of milliseconds passed since the beginning of the Unix time, which is January 1, 1970,

console.log(new Date(3 * 24 * 60 * 60 * 1000)); //(days * hours * min * seconds * miliseconds) And so now we get Jan 04, so that's exactly three days later. So this number that we calculated here can also be calculated in the console so the result is called the timestamp. So call this a timestamp of day number 3 which is this 259200000.

//Now these dates that we just created here are infact just another special type object. And so therefore they have their own methods, just like arrays or maps or strings. So we can use these methods to get or to set components of a date.

// Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear()); //2037  there is also getYear but never use that, always use getFullYear.
console.log(future.getMonth()); //10.  and remember that this is actually 0 based.
console.log(future.getDate()); //19
console.log(future.getDay()); //4 getDay( ) is actually not the day of the month, but the day of the week. and 0 is the Sunday and so 4 is Thursday.
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
//So, sometimes it's pretty useful to work with a date.
console.log(future.toISOString()); //So this is an ISO string which follows some international standard. And it is actually similar to the string that we used before coming from account1. So these were generated by exactly this method. And so that's one of the very useful cases when you want to convert a particular date object into a string that you can then store somewhere.

console.log(future.getTime()); // timestamp is the milliseconds which have passed since "Unix Time" January 1, 1970.

console.log(new Date(2142237180000)); //so if we want to create a date based on the milliseconds then we've to simply put the miliseconds into the parenthesis.

//Timestamp are so important that there is a special method that we can use to get a time stamp for right now.
console.log(Date.now());

//Finally there are also the set versions of all of these methods.
future.setFullYear(2040);
console.log(future);
//So there also exists set month, set date, set day and so forth. And these also perform autocorrection just like here, when we create a new date.

/*
____________________________________________________________________________________________________________________                                           Operations With Dates                              
_____________________________________________________________________________________________________________________

So, one cool thing that we can do with dates is to do calculations with them. For example we can subtract one date from another date, in order to calculate how many days have passed between the two dates. 
And this works because whenever we attempt to convert a date to a number, then the result is going to be the timestamp in milliseconds. 
And with these milliseconds we can then perform calculations. So again, the timestamps are going to be really helpful here in this situation. 
*/
const future2 = new Date(2037, 10, 19, 15, 23);
console.log(+future2);

const daysPassed = (date1, date2) =>
  Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)); //1000 converts milliseconds to seconds then times 60 to convert it to minutes, then times 60 to convert it to hours, and then times 24, which converts it to days.
//and so now we get 10 days.

const days1 = daysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
console.log(days1); // and so this gives us the milliseconds and so now we just need to convert them.

//Now if you need really precise calculations for example, including time changes due to daylight saving changes, and other weird edge cases like that, then you should use a date library like moment.js. And that's a library that's available for free for all JavaScript developers. But for something simple like this, we should be fine.

//Now let's just consider that one of these days here also has some time. So let's say in this one here, it's also 10 in the morning, or 10 hours and 8 minutes doesn't really matter. So in the days we now get the 10.4. So we might not want that. And in this case we can simply use Math.Round() on all of this.

/*
_____________________________________________________________________________________________________________________                                            INternationalizing Dates (INTL)
_____________________________________________________________________________________________________________________
That's sounds very fancy but all it does is allow us to easily format numbers and strings, according to different languages. So with this new API, we can make our applications support different languages for users around the world which is pretty important for example, currencies or dates are represented in a completely different way in Europe or in the US or in Asia for example. Now there's a lot language specific things that we can do with the internationalization API.  

But in this section, we're just briefly gonna talk about formatting dates and numbers. 
Intl is basically is the name space for the internationalization API. And for times and dates we use the DateTimeFormat() function. Now all we need to paas into this function here is a so-called "locale" string. And this "locale" is basically the language and then '-' the country. And all of this here will create here a so-called formatter for this language in this country. So English-US. So all of this here creates a formatter. And then on that formatter, we can call dot'.' format(). And now here we can actully pass in the date that we actually want to format. So that's 'now'. Right now it only displays the date here, but not any time. And so we can change that by providing an options object to the function here. And now we have to provide this options variable as a second argument into the DateTimeFormat function. So as you see now we get indeed the time.

const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', //For month we can also write long, so after chooing long for month we will get the name of the month, you can alo specify the month as 2-digit.
      year: 'numeric', //that's 2022 but we can also say just 2-digit.
      //weekday: 'long', //it will write out the day completely. Now here you can also say 'short' or 'narrow'.
    };

    // const locale = navigator.language;
    // console.log(locale); //Now in many situations, it actually makes more sense to not define the locale manually, but instead to simply get it from the user's browser.

*/
const todaysdate = new Date();
const options2 = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'long', //For month we can also write long, so after chooing long for month we will get the name of the month, you can alo specify the month as 2-digit.
  year: 'numeric', //that's 2022 but we can also say just 2-digit.
  weekday: 'short', //it will write out the day completely. Now here you can also say 'short' or 'narrow'.
};

const intlExample = new Intl.DateTimeFormat(
  navigator.language,
  options2
).format(todaysdate);
console.log(intlExample);
/*
____________________________________________________________________________________________________________________                                              INternationalizing Number(Intl)                                         
_____________________________________________________________________________________________________________________

*/
const number = 3884764.23;

const options = {
  style: 'unit', // we can also change the style into %. And again the unit is different for different countries. And then there's also currency. So, these are the three options for the style. So that's "unit", "percent" and "currency". *(Again if we have currency then the unit just completely ignored. But we do have to then define currency.)
  unit: 'mile-per-hour', // and there are tons of units like this. And so as always, you can read more about the units that are available in the documentation.

  currency: 'EUR', //In Europe it comes after the number and in the US it comes before the number. And it's important to understand that we do indeed have to set this currency here. The currency is not determenent by the locale. So it's not defined by the country here. Because it's of course possible to show for example EUROS in the US. So we have to define the currency manually.

  //useGrouping : false,  Finally we can also turn on and off the grouping. And then you'll see that the number is just printed just as-it-is without the separators. IF YOU WANT TO SEE MORE PROPERTIES THAT YOU WANT TO SET HERE IN THE OPTIONS, THEN JUST CHECK OUT THE DOCUMENTATION HERE ON "MDN".
}; //Now we have the other properties in this object. It's no longer the day or month. But instead we can specify the style

console.log(
  'US:                ',
  new Intl.NumberFormat('en-US', options).format(number)
); //So you see that the number now is formatted using these dividers so these commas as seprators so thta it's easier to read 3,884 thousand and so on.
console.log('Germany:', new Intl.NumberFormat('de-DE', options).format(number));
console.log('Syria:', new Intl.NumberFormat('ar-SY', options).format(number)); // and so you see that in Germany, as in general in Europe, the separator is the dot, and then a comma',' for the decimal part. So basically just as the opposite just as it is in the US.

console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(number)
); //So in UK it is basically the same as in the US.
//so we get the different units in US and in Geramny and in Europe in general.

/*
_____________________________________________________________________________________________________________________                                          Timers: Set Timeout And Set Interval
_____________________________________________________________________________________________________________________
We have two kind of timers. 
1st the set timeout timer runs just once, after a defined time, and this function receives a callback function.
while the set interval timer keeps running forever, until we stop it.
So basically, we can use set timeout to execute some code at some point in the future.
*/

//setTimeout :
const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza 🍕 with ${ing1} and ${ing2}`),
  3000,
  ...ingredients
); //it is the setTimeout() function who's gonna call this arrow function we simply pass in this arrow funciton as an argument to setTimeout. And it is this function who will then call our callback function in the future. And we can specify the future here in the second argument. So here we pass in the amount of "milliseconds" that will pass until this function is called. So let's say we want to call this function after 3 seconds and so we need to pass 3000 milliseconds.

//We can also say that we can schedule this function call for 3 seconds later. Now, what's really important to realize here is that the code execution does not stop here at this point. So when the execution of our code reaches to the expected point, it will simply call the setTimeout() function it will then essentially register this callback function here to be called later. And then the code execution simply continues.
console.log('Waiting...'); //and if we now save this then we immediately we will this waiting in the console. And then after the 3 seconds, our log will be appeared.

//Asynchoronous JavaScript Mechanism : So again, as soon as JavaScript hits the setTimeout() line of the code, it will simply basically keep counting the time in the background, and register this callback function to be called after that time has elapsed, and then immediately, JavaScript will move on to the next line.

if (ingredients.includes('spinach')) clearTimeout(pizzaTimer); //We can actually cancel the timer, at least until the delay has actually passed. So before these 3 seconds here have passed, we can cancel the timeout. By the method of clearTimeout().

//Now if we wanted to run a function over and over again, like every 5 seconds, or every 10 minutes. For that we have the setInterval function.

//setInterval
setInterval(function () {
  const now = new Date();

  const clock = `${now.getHours()} : ${now.getMinutes()} : ${now.getSeconds()} `;
  // console.log(clock);
}, 1000);

/*
_____________________________________________________________________________________________________________________                                        Implementing a countdown Timer                                    
_____________________________________________________________________________________________________________________
For securities reasons, real bank applications will log out users after some inactive time. For example, after 5 minutes without doing anything. And that's what we will implement in this video using the set interval timer. So the place where the timer is setted up is on the "btnlogin" part.
_____________________________________________________________________________________________________________________
The formula of converting any number into minute and seconds : 
_____________________________________________________________________________________________________________________

const startLogOutTimer = function () {
  const newFunction = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0); // 100 % 60 = 40

    // In each call, print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;

    //when 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // Decrease 1sec
    time--;
  };

  // Set time to 5 minutes
  let time = 30;
_____________________________________________________________________________________________________________________

*/
