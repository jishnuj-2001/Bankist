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
    '2023-09-11T23:36:17.929Z',
    '2023-10-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'de-DE', // de-DE
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
    '2023-02-05T16:33:06.386Z',
    '2023-10-01T14:43:26.374Z',
    '2023-10-21T18:49:59.371Z',
    '2023-10-23T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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



const formatMovementDate = function(date){
  const day = `${date.getDate()}`.padStart(2, 0);
      const month = `${date.getMonth()+1}`.padStart(2, 0);
      const year = date.getFullYear();
      // const hours = now.getHours();
      // const minutes = now.getMinutes();
      const currentDate = new Date()
      const secondsPassed = calcSecondsPassed(Number(currentDate),Number(date));
      const daysPassed = Math.floor(secondsPassed/(1000*60*60*24));
      // console.log(daysPassed);
      if(daysPassed <= 30 && daysPassed > 1) return`${daysPassed} days ago`;
      if(daysPassed === 1) return  'Yesterday';
      if(daysPassed === 0) return  'Today';
      const option ={
        day: '2-digit',
        month : '2-digit',
        year : 'numeric'
      }
      if(daysPassed > 30) return new Intl.DateTimeFormat(currentAccount.locale,option).format(date);
}
//Display movement
const displayMovement = function(acc, sort = false){
    containerMovements.innerHTML= '';
    const movs = sort ? acc.movements.slice().sort((a,b)=> a-b):acc.movements;
    movs.forEach(function(mov, i){
      const date = new Date(acc.movementsDates[i]);
      const displayDate = formatMovementDate(date);
      const option = {
        style: 'currency',
        currency: currentAccount.currency
      }
      const formatedMov = new Intl.NumberFormat(currentAccount.locale, option).format(mov)         
        const moveType = mov < 0 ? 'withdrawal':'deposit';
        // console.log(mov,i);
        const html = `<div class="movements__row">
                        <div class="movements__type movements__type--${moveType}">${i+1} ${moveType}</div>
                        <div class="movements__date">${displayDate}</div>
                         <div class="movements__value">${formatedMov}</div>
                    </div>`;  
        containerMovements.insertAdjacentHTML('afterbegin', html);           
    })
}
// displayMovement(account1.movements);
const calcSecondsPassed = (date1, date2) =>{
  // console.log('Date1:'+date1)
  // console.log('Date2:'+date2)
  return Math.abs(date1 - date2)
}
// console.log(calcSecondsPassed(new Date(),new Date()));
//Generate Username
const user = 'Steven Thomas Williams';
const createUserName = function(accs){
    accs.forEach(function(acc){
        acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
        // console.log(acc);
    })
}

createUserName(accounts);

//Test movements
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//Calculate Balance 

const calculateBalance = function(account){
    // console.log(account);
     account.balance = account.movements.reduce(function( acc, mov, i, arr){
            return acc + mov;
        },0);
        const option = {
          style: 'currency',
          currency: currentAccount.currency
        }
        const formatedBalance = new Intl.NumberFormat(currentAccount.locale, option).format(account.balance)
        labelBalance.textContent = `${formatedBalance}`;
    return account.balance;
}
// calculateBalance(accounts)


//Maxinum movement
const maximum = movements.reduce((acc, mov)=>mov > acc ? mov : acc,movements[0]);

//Display Summary(income, outcome)

const calcDisplaySumary = function(account){
  const option = {
    style: 'currency',
    currency: currentAccount.currency
  } 
  const  income = account.movements.filter(mov => mov > 0).reduce( (acc, mov) => acc + mov, 0);
  const formattedIncome = new Intl.NumberFormat(currentAccount.locale, option).format(income)
  labelSumIn.textContent = `${formattedIncome}`;
  const  outcome = Math.abs(account.movements.filter(mov => mov < 0).reduce( (acc, mov) => acc + mov, 0));
  const formattedOutcome = new Intl.NumberFormat(currentAccount.locale, option).format(outcome)
  labelSumOut.textContent =  `${formattedOutcome}`;
  const interest = account.movements.filter(mov => mov > 0).map( deposit => deposit * account.interestRate/100).filter( int =>  int >= 1).reduce((acc,int)=> acc + int)
  const formattedInterest = new Intl.NumberFormat(currentAccount.locale, option).format(interest)
  labelSumInterest.textContent =  `${formattedInterest}`;
}

const startLogoutTimer = function(){
  // clearInterval(timer);
  let time = 300;
   timer = setInterval(function(){
    let min = `${Math.floor(time/ 60)}`.padStart(2,0);
    let seconds = `${time%60}`.padStart(2,0);
    labelTimer.textContent = `${min}:${seconds}`;  
    if(time>0){
      time--;  
    }else{
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started!`
      clearInterval(timer);
    }  
  },1000)
  return timer;
}

let currentAccount, timer, sort;
//Login

btnLogin.addEventListener('click',function(evt){
  
  evt.preventDefault();
  sort = false;
  currentAccount = accounts.find( acc => acc.username === inputLoginUsername.value );  
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)){
    // console.log('Correct login credentials');
    //Clear input fields
    inputLoginPin.value = inputLoginUsername.value = ''
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner}!`
    containerApp.style.opacity = 1;
    //Display Balance Summary and movements
    updateUI();
    if(timer) clearInterval(timer);
    timer = startLogoutTimer()
  }else{
    labelWelcome.textContent = `Incorrect Credentials!`
  }
  const now = new Date();
  const option = {
    day : 'numeric',
    month : 'numeric',
    year : 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    // weekday: 'short'
  }
  labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, option).format(now)
  // const now = new Date();
  // const day = `${now.getDate()}`.padStart(2, 0);
  // const month = `${now.getMonth()+1}`.padStart(2, 0);
  // const year = now.getFullYear();
  // const hours = `${now.getHours()}`.padStart(2,0);
  // const minutes = `${now.getMinutes()}`.padStart(2,0);
  // labelDate.textContent = `${day}/${month}/${year}, ${hours}:${minutes}`;    

})

//Transfer money

btnTransfer.addEventListener('click', function(evt){
  evt.preventDefault()
  // console.log('Transfer');
  const amount = inputTransferAmount.value;
  const to = inputTransferTo.value;
  const recieverAccount = accounts.find(acc => to === acc.username);
  if(amount>0 && currentAccount.balance >= amount && recieverAccount && recieverAccount?.username !== currentAccount.username){
    //Transfering
    recieverAccount?.movements.push(Number(amount));
    currentAccount.movements.push(Number(`-${amount}`)); 
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAccount?.movementsDates.push(new Date().toISOString());
    //Update Balance Summary and movements
    updateUI();
    if(timer) clearInterval(timer);
    timer = startLogoutTimer()
    labelWelcome.textContent = `Money transfered to ${recieverAccount.owner}!`
  }else{
    labelWelcome.textContent = `Incorrect money transfer credentials!`
  }
  clearInput();
  function clearInput(){
    inputTransferAmount.value = inputTransferTo.value = '';
  }
})
btnClose.addEventListener('click',function(evt){
  evt.preventDefault();
  if((currentAccount.pin === Number(inputClosePin.value)) && (currentAccount.username === inputCloseUsername.value)){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    accounts.splice(index,1);
    labelWelcome.textContent = `Your account has been closed successfully!`
    containerApp.style.opacity = 0;
  }else{
    labelWelcome.textContent = `Account closing failed credentials incorrect,  Tryagain!`
  }
  inputClosePin.value = inputClosePin.value = '';
})


function updateUI(){
  calculateBalance(currentAccount);
  displayMovement(currentAccount);
  calcDisplaySumary(currentAccount);
}

//Loan function
btnLoan.addEventListener('click',function(evt){
  evt.preventDefault();
  // console.log('Asking loan');
  const loanAmount = Math.floor(inputLoanAmount.value);
  const eligible = currentAccount.movements.some( mov => mov>= .1*loanAmount)
  if(loanAmount > 0){
    if(eligible ){
      setTimeout(function(){
        currentAccount.movements.push(Number(loanAmount));
        const date = new Date()
        currentAccount.movementsDates.push(date.toISOString());
        labelWelcome.textContent = `Recieved a loan of ${loanAmount}€!`
        updateUI();
        if(timer) clearInterval(timer);
        timer = startLogoutTimer()
        inputLoanAmount.value = ''
      },2500)     
    }else{
      labelWelcome.textContent = `Ineligible for this amount of loan!`
    }
  }else{
    labelWelcome.textContent = `Enter loan amount!`
  } 
})

btnSort.addEventListener('click', function(){
  sort = !sort;
  displayMovement(currentAccount, sort) 
});

//FAKE LOGIN
// currentAccount = accounts[0];
// updateUI();
// containerApp.style.opacity = 1;

//SetInterval

setInterval(function(){
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  // console.log(`${hour}:${minu  te}:${second}`)
},1000)



/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const calcAvgHumanAge = function(dogAge){
//   console.log('----------------------------')
//   const humanAge = dogAge.map( dage => dage <= 2 ? 2*dage : 16 + dage * 4);
//   console.log(humanAge)
//   const adultDogs = humanAge.filter(hage => hage >=18 )
//   console.log(adultDogs)
//   const avgAdultDogsAge = adultDogs.reduce((acc, age) => acc + age/(adultDogs.length),0)
//   console.log(avgAdultDogsAge);
// }

// calcAvgHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAvgHumanAge([16, 6, 10, 5, 6, 1, 4]);
/////////////////////////////////////////////////

// const array = Array.from({length : 100}, () => Math.trunc(Math.random()*6))+1;
// console.log(array);

// const bankDeposits = accounts.map(acc => acc.movements).flat().filter(mov => mov>0).reduce( (acc,  mov)=> acc+mov, 0);
// console.log(bankDeposits);

// const bankDeposits1000 = accounts.flatMap(acc => acc.movements).filter( mov => mov>=1000).length
// console.log(bankDeposits1000);

// const {deposits, withdrawals} = accounts.flatMap(acc => acc.movements).reduce((sums, mov)=>{
//   // mov > 0 ? sums.deposits += mov : sums.withdrawals += mov;
//   sums[mov > 0? 'deposits' : 'withdrawals'] += mov;
//   return sums;
// }, {
//   deposits: 0,
//   withdrawals: 0
// })
// console.log(deposits, withdrawals);

// const titelCase = function(string){
//   const exceptions = ['a' , 'and', 'the', 'but', 'on', 'or', 'in', 'an', 'with']
//   // const str = string.split(' ').map((word)=> word.length > 1 ? word[0].toUpperCase() + word.slice(1) : word ).join(' ')
//   const str = string.toLowerCase().split(' ').map( word => exceptions.some( e => e === word)? word : word[0].toUpperCase() + word.slice(1)).join(' ');
//   console.log(str);
// }

// titelCase('this is a title case sentence');
// titelCase('this is a nice title');
// titelCase('this is a long title but not too long');
// titelCase('and here is another title with AN example');
// console.log(+(22.456789).toFixed(2));