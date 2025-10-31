// Tic-Tac-Toe (X O) — Two players (local)
const cells = Array.from(document.querySelectorAll('.cell'));
const playerEl = document.getElementById('player');
const turnEl = document.getElementById('turn');
const restartBtn = document.getElementById('restart');
const resetAllBtn = document.getElementById('resetAll');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const scoreDEl = document.getElementById('scoreD');

const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]          // diags
];

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let scores = { X: 0, O: 0, D: 0 };

function startGame(){
  board.fill(null);
  gameActive = true;
  currentPlayer = 'X';
  updateTurnUI();
  cells.forEach(cell => {
    cell.className = 'cell';
    cell.textContent = '';
    cell.disabled = false;
  });
}

function updateTurnUI(){
  playerEl.textContent = currentPlayer;
}

function handleCellClick(e){
  const idx = Number(e.currentTarget.dataset.index);
  if(!gameActive || board[idx]) return;

  board[idx] = currentPlayer;
  renderCell(idx);
  const result = checkWinner();

  if(result.winner){
    gameActive = false;
    highlightWinning(result.line);
    scores[result.winner] += 1;
    updateScores();
    setTimeout(()=> alert(`${result.winner} wins!`), 80);
    return;
  }

  if(result.draw){
    gameActive = false;
    scores.D += 1;
    updateScores();
    setTimeout(()=> alert(`It's a draw!`), 80);
    return;
  }

  // switch
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateTurnUI();
}

function renderCell(i){
  const cell = cells[i];
  cell.textContent = board[i];
  cell.classList.add(board[i].toLowerCase());
}

function checkWinner(){
  for(const combo of WIN_COMBOS){
    const [a,b,c] = combo;
    if(board[a] && board[a] === board[b] && board[a] === board[c]){
      return { winner: board[a], line: combo, draw:false };
    }
  }
  if(board.every(Boolean)){
    return { winner: null, line: null, draw:true };
  }
  return { winner: null, line: null, draw:false };
}

function highlightWinning(line){
  if(!line) return;
  line.forEach(i => cells[i].classList.add('winner'));
  // disable remaining cells
  cells.forEach(c => c.disabled = true);
}

function updateScores(){
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDEl.textContent = scores.D;
}

restartBtn.addEventListener('click', startGame);
resetAllBtn.addEventListener('click', ()=>{
  scores = { X:0, O:0, D:0 };
  updateScores();
  startGame();
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// Allow numeric keyboard input 1-9 (optional)
window.addEventListener('keydown', (ev) => {
  if(!gameActive) return;
  const k = ev.key;
  if(k >= '1' && k <= '9'){
    const idx = Number(k) - 1;
    cells[idx].click();
  }
});

startGame();
