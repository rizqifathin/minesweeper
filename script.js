let Array2D = (r,c) => [...Array(r)].map(_=>Array(c).fill(0));

let solution = Array2D(9,9);
let flagsCount = 10;
let [minutes,seconds] = [0,0];
let answered = 0;
let finalAnswer = 81-flagsCount;
let timer = setInterval(displayTimer,1000);
let gameOn = true;

generateBomb(solution);
countBomb(solution);
setGame();
console.table(solution);

function generateBomb(solution){
  let arr = generateRandList2D(0,8,10);
  for (let i=0; i<10; i++){
    solution[arr[i][0]][arr[i][1]] = "#";
  }
}

function countBomb(solutionBomb){
  for (let i=0; i<9; i++){
    for (let j=0; j<9; j++){
      let count = 0;
      if (solutionBomb[i][j] != "#"){
        for (let m=i-1; m<=i+1; m++){
          for (let n=j-1; n<=j+1; n++){
            if (m>=0 && m<=8 && n>=0 && n<=8){
              count = solutionBomb[m][n] == "#"? ++count : count;
            }
          }
        }
        solutionBomb[i][j] = count==0?"":count;
      }
    }
  }
}

function generateRandList2D(st, end, n){
  let arr = [];
  let tempArr = [];
  while(arr.length < n){
    let tempR = Math.floor(Math.random() * (end-st+1) + st);
    let tempC = Math.floor(Math.random() * (end-st+1) + st);
    tempArr.push(tempR);
    tempArr.push(tempC);
    if(!findArray(arr,tempArr)) arr.push(tempArr);
    tempArr = [];
  }
  return arr;
}

function findArray(arr,value){
  for (let i=0; i<arr.length; i++){
    if (arr[i].toString()==value.toString()) return true;
  }
  return false;
}

function setGame() {
  // Board 9x9
  for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
          let tile = document.createElement("div");
          tile.id = r.toString() + "-" + c.toString();
          tile.addEventListener("click", selectLeft);
          tile.addEventListener("contextmenu", selectRight);
          tile.classList.add("tile");
          document.getElementById("board").append(tile);
      }
  }
}

function selectLeft() {
  // "0-0" "0-1" .. "3-1"
  if (this.classList.contains("flag-tile")){
    return;
  }
  if (gameOn){
    let coords = this.id.split("-"); //["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    this.classList.add("open-tile");
    this.innerText = solution[r][c];
    if (solution[r][c] == "#") {
      clearInterval(timer);
      gameOn = false;
      this.classList.add("bomb-tile");
      openBomb();
      alert("you lose");
    }
    else if(solution[r][c] == "") openEmptyTile(solution,[r,c]);
    answered++;
  }
}

function selectRight(ev){
  ev.preventDefault();
  if (this.classList.contains("open-tile")){
    return;
  }
  if (gameOn){
    let coords = this.id.split("-"); //["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    if (this.classList.contains("flag-tile")){
      this.innerText = "";
      this.classList.remove("flag-tile");
      flagsCount++;
    }
    else{
      this.innerText = "!";
      this.classList.add("flag-tile");
      flagsCount--;
    }
    document.getElementById("flags").innerText = flagsCount;
  }
  return false;
}

function displayTimer(){
  seconds+=1;
  if (minutes == 59 && seconds == 60){
    alert("Time out");
    clearInterval(timer);
  }
  if(seconds >= 60){
    seconds -= 60;
    minutes++;
  }
  let m = minutes < 10 ? `0${minutes}` : minutes;
  let s = seconds < 10 ? `0${seconds}` : seconds;
  document.getElementById("time_sec").innerHTML = s;
  document.getElementById("time_min").innerHTML = m;
  check();
}

function check(){
  for(let r=0;r<9;r++){
    for(let c=0;c<9;c++){
      let tile_id = r.toString() + "-" + c.toString();
      if(answered==finalAnswer){
        alert(`you win !! congratulation.....\nTime: ${minutes} minutes ${seconds} seconds`);
        clearInterval(timer);
        openBomb();
        gameOn = false;
        return;
      }
      else if(document.getElementById(tile_id).innerText == ""){
        return;
      }
    }
  }
}

function openEmptyTile(arr,index){
  let remainIndex = [index];
  while (remainIndex.length !== 0){
    let tempIndex = remainIndex.pop();
    for (let m=tempIndex[0]-1; m<=tempIndex[0]+1; m++){
      for (let n=tempIndex[1]-1; n<=tempIndex[1]+1; n++){
        if (m>=0 && m<=8 && n>=0 && n<=8){
          let tile_id = m.toString() + "-" + n.toString();
          let element = document.getElementById(tile_id);
          let boolLeft = element.classList.contains("open-tile");
          let boolRight = element.classList.contains("flag-tile");
          if (!(boolLeft || boolRight)){
            if (arr[m][n] == "") remainIndex.push([m,n]);
            element.classList.add("open-tile")
            element.innerText = arr[m][n];
            answered++;
          }
        }
      }
    }
  }
}

function openBomb(){
  for(let r=0;r<9;r++){
    for(let c=0;c<9;c++){
      let tile_id = r.toString() + "-" + c.toString();
      let element = document.getElementById(tile_id);
      let boolRight = element.classList.contains("flag-tile");
      if (solution[r][c]=="#") {
        if (!boolRight) element.innerText = solution[r][c];
        element.classList.add("bomb-tile");
      }
    }
  }
}

function toHome(){
  window.location.href="index.html";
}

function selectRestart(){
  window.location.reload();
}

