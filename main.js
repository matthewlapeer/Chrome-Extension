const allowedLetter = new Set(['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']);
let playersGuess = '';
const dictionary = [
  "earth","which","there","their","about","would","these","other","words","could",
  "write","first","water","after","where","right","think","three","years","place",
  "sound","great","again","still","every","small","found","those","never","under",
  "might","while","house","world","below","asked","going","large","until","along",
  "shall","being","often","earth","began","since","study","night","light","above",
  "paper","parts","young","story","point","times","heard","whole","white","given",
  "means","music","miles","thing","today","later","using","money","lines","order",
  "group","among","learn","known","space","table","early","trees","short","hands",
  "state","black","shown","stood","front","voice","kinds","makes","comes","close",
  "power","lived","vowel","taken","built","heart","ready","quite","class","bring",
  "round","horse","shows","piece","green","stand","birds","start","river","tried",
  "least","field","whose","girls","leave","added","color","third","hours","moved",
  "plant","doing","names","forms","heavy","ideas","cried","check","floor","begin",
  "woman","alone","plane","spell","watch","carry","wrote","clear","named","books",
  "child","glass","human","takes","party","build","seems","blood","sides","seven",
  "mouth","solve","north","value","death","maybe","happy","tells","gives","looks",
  "shape","lives","steps","areas","sense","speak","force","ocean","speed","women",
  "metal","south","grass","scale","cells","lower","sleep","wrong","pages","ships",
  "needs","rocks","eight","major","level","total","ahead","reach","stars","store",
  "sight","terms","catch","works","board","cover","songs","equal","stone","waves",
  "guess","dance","spoke","break","cause","radio","weeks","lands","basic","liked",
  "trade","fresh","final","fight","meant","drive","spent","local","waxes","knows",
  "train","bread","homes","teeth","coast","thick","brown","clean","quiet","sugar",
  "facts","steel","forth","rules","notes","units","peace","month","verbs","seeds",
  "helps","sharp","visit","woods","chief","walls","cross","wings","grown","cases",
  "foods","crops","fruit","stick","wants","stage","sheep","nouns","plain","drink",
  "bones","apart","turns","moves","touch","angle","based","range","marks","tired",
  "older","farms","spend","shoes","goods","chair","twice","cents","empty","alike",
  "style","broke","pairs","count","enjoy","score","shore","roots","paint","heads",
  "shook","serve","angry","crowd","wheel","quick","dress","share","alive","noise",
  "solid","cloth","signs","hills","types","drawn","worth","truck","piano","upper",
  "loved","usual","faces","drove","cabin","boats","towns","proud","court","model",
  "prime","fifty","plans","yards","prove","tools","price","sheet","smell","boxes",
  "raise","match","truth","roads","threw","enemy","lunch","chart","scene","graph",
  "doubt","guide","winds","block","grain","smoke","mixed","games","wagon","sweet",
  "topic","extra","plate","title","knife","fence","falls","cloud","wheat","plays",
  "enter","broad","steam","atoms","press","lying","basis","clock","taste","grows",
  "thank","storm","agree","brain","track","smile","funny","beach","stock","hurry",
  "saved","sorry","giant","trail","offer","ought","rough","daily","avoid","keeps",
  "throw","allow","cream","laugh","edges","teach","frame","bells","dream","magic",
]

let answer = randomWord();
let letterCount = createLetterCount(answer);
let gameEnded = false;

/* -- EVENT LISTENERS FOR KEYPRESSES AND RESET -- */
document.addEventListener('DOMContentLoaded', ()=>{
  document.addEventListener('keydown', (e) => {
    keyPressed(e.key);
  });

  // adding an event listener for the button to reload the page / reset the game
  const button = document.getElementById('button');
  button.addEventListener('click', () => {
    location.reload();
  });
});

/* -- FUNCTION THAT IS CALLED WHEN A KEY PRESS IS TRIGGERED -- */
function keyPressed (keystroke) {
  if(keystroke === 'Enter' && playersGuess.length === 5 && !gameEnded){
    // run code to check the players guess against the answer
    // remove currentrow class from the current row node, and add it to the next row
    submitGuess(playersGuess)
  }
  else if(keystroke === 'Backspace' && playersGuess.length > 0) {
    playersGuess = playersGuess.slice(0,-1);
    updateTiles('deletion');
  }
  else if(allowedLetter.has(keystroke.toLowerCase()) && playersGuess.length < 5) {
    playersGuess += keystroke;
    updateTiles('addition', keystroke.toUpperCase());
  }
}

/* -- FUNCTION TO UPDATE THE TILES IN THE HTML TILES BASED ON THE KEY -- */
function updateTiles(updateType, key) {
  const currentRow = document.querySelector('.row.current-row');
  const tiles = currentRow.children;

  if (updateType === 'addition') {
    tiles[playersGuess.length - 1].textContent = key;
  }
  if (updateType === 'deletion') {
    if (playersGuess.length === 0) tiles[playersGuess.length].textContent = "";
    else tiles[playersGuess.length].textContent = "";
  }

}

/* -- FUNCTION TO SUBMIT THE USER'S GUESS, WILL CHECK EACH LETTER WITH THE CHOSEN WORD
      AND WILL ASSIGN DIFFERENT COLORS TO THE TILES BASED ON CORRECTNESS -- */
function submitGuess (guess) {
  const currentRow = document.querySelector('.row.current-row');
  const tiles = currentRow.children; 
  let nextRow;
  if (currentRow.nextElementSibling && currentRow.nextElementSibling.getAttribute('id') !== 'game-message') nextRow = currentRow.nextElementSibling;
  else nextRow = undefined;

  // creating shallow clone to mutate for each guess
  const countClone = Object.assign({},letterCount);
  // first iteration through to see which guesses were correct and in the correct spot
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      tiles[i].setAttribute('class', 'tile correct');
      countClone[guess[i]]--;
    } 
  }
  // second iteration through to see if the player's guess has letters that are in the answer word, but wrong spot
    // if they are, will turn tile orange
    // else, will turn tile dark gray
  for (let i = 0; i < 5; i++) {
    if (countClone[guess[i]] > 0 && guess[i] !== answer[i]) { 
      tiles[i].setAttribute('class', 'tile almost-correct');
      countClone[guess[i]]--;
    } else if (guess[i] !== answer[i] ){
      tiles[i].setAttribute('class', 'tile incorrect');
    }
  }

  // if the next row/guess is available, will reset guess and update currentRow
  if (nextRow != undefined){
    playersGuess = '';
    nextRow.setAttribute('class', 'row current-row');
    currentRow.setAttribute('class', 'row');
  }
  
  const message = document.getElementById('game-message');
  if (answer === guess) {
    message.textContent = 'Nice. You win!';
    button.removeAttribute('class');
    gameEnded = true;
  }

  if (!nextRow && answer !== guess){
    message.innerHTML = `Grab a dictionary, yo! The word was: <b>${answer}</b>`;
    button.removeAttribute('class');
    gameEnded = true;
  }
}

/* -- FUNCTION TO CHOOSE A WORD FROM THE ARRAY OF WORDS -- */
function randomWord(){
  return dictionary[Math.floor(Math.random() * (dictionary.length -1))];
}

/* -- CREATING A MAP OF THE LETTERS AND CORRESPONDING FREQUENCY OF OCCURENCE IN THE CHOSEN WORD -- */
function createLetterCount(ans) {
  const obj = {};
  for(var i=0; i < 5; i++) {
    obj[ans[i]] = obj[ans[i]] + 1 || 1
  }
  return obj;
}