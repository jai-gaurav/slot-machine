// get user prompts
const prompt = require('prompt-sync')();

// global variables for size of slot machine
const ROWS = 3;
const COLS = 4;

const SYMBOLS_COUNT = {
    A: 1,
    K: 3,
    Q: 5,
    J: 7,
}

const SYMBOL_VALUES = {
    A: 3,
    K: 2.3,
    Q: 1.5,
    J: 1.1,
}

// get the deposit amount
const collectDeposit = () => {
    while (true) {
        const depositAmount = prompt('Enter the deposit amount: ');
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount)) {
            console.log('Please enter a valid number');
        } else {
            return numberDepositAmount;
        }
    }
};

// get the number of lines
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt('Enter the number of lines: ');
        const numberLines = parseInt(lines);

        if (isNaN(numberLines)) {
            console.log('Please enter a valid number');
        } else  if ((numberLines < 1 || numberLines > 3)) {
            console.log('Please enter a number between 1 and 3');
        } else {
            return numberLines;
        }
    }
}

// get the bet amount
const collectBet = (balance, lines) => {
    while (true) {
        const betAmount = prompt('Enter the bet amount: ');
        const numberBetAmount = parseFloat(betAmount);

        if (isNaN(numberBetAmount)) {
            console.log('Please enter a valid number');
        } else  if (numberBetAmount <= 0) {
            console.log('ERROR: Bet amount must be positive');
        } else if (numberBetAmount > balance / lines) {
            console.log('ERROR: Bet amount cannot exceed balance');
            console.log('NOTE: Bet amount is per line, i.e. max bet amount is', balance / lines);
        } else {
            return numberBetAmount;
        }
    }
};

// spin the slot machine
const spin = () => {
    const symbols = [];

    for (let [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const result = [];

    for (let i=0; i<ROWS; i++) {
        result.push([]);
        const reelSymbols = [...symbols];
        for (let j=0; j<COLS; j++) {
            const randomIndex = Math.floor(Math.random() * symbols.length);
            result[i].push(symbols[randomIndex]);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return result;
}

// show slot machine
const showSlotMachine = (reels) => {
    for (const row of reels) {
        console.log(row.join(' | '));
    }
}

// calculate winnings
const calculateWinnings = (reels, bet, lines) => {
    let winnings = 0;
    let winningLines = 0;

    // helper function to check if a line is valid
    const validLine = (line) => {
        for (let i=1; i<line.length; i++) {
            if (line[i] !== line[i-1]) {
                return false;
            }
        }
        return true;
    }

    for (const row of reels) {
        if (winningLines >= lines) {
            break;
        }

        if (validLine(row)) {
            winnings += bet * SYMBOL_VALUES[row[0]];
            winningLines++;
        }
    }

    winnings *= winningLines;

    return winnings;
}

// play 1 round of the game
const playRound = (balance = 0) => {
    if (balance === 0) {
        balance = collectDeposit();
    }
    const lines = getNumberOfLines();
    const bet = collectBet(balance, lines);
    const reels = spin();
    showSlotMachine(reels);
    const winnings = calculateWinnings(reels, bet, lines);
    balance += winnings - bet*lines;
    console.log('Winnings:', winnings);
    console.log('Balance:', balance);

    return balance;
}

// main function
let balance = 0;
while (true) {
    console.log('Current Balance:', balance);
    if (prompt('Do you want to play a round? (y/n) ') === 'n') {
        break;
    }

    balance = playRound(balance);
}