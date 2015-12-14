var totalGames = 0;
var gameResults = [];
function Player(studentId, name, maxMemory, memories) {
  this.name = name;
  this.studentId = studentId;
  this.maxMemory = maxMemory;
  this.memories = memories;
  this.lastStrategy = "";
  this.scores = [];
  this.history = []; // [주의] 최근 것이 앞에 옴. 말하자면 내림차순.
  this.gameNumbers = [];
  this.gameScore = [];
  this.gameHistory = [];
  this.games = 0;
}
Player.prototype = {
  constructor: Player,
  // history와 비교하여 전략을 짬
  getMemory: function (num, memories, history) {
    var strategy = [];
    var recentHistory = "";

    if (num === 0) {
      strategy = memories["init"];
    } else if (num <= 10) {
      for (var i = 0; i < num; i++) {
        recentHistory += history[i]; // 최근 히스토리 생성
      }
      strategy = memories[recentHistory]; // recentHistory에 해당하는 메모리 가져옴.
      if (unusableMemory(strategy)) {  //
        recentHistory = arguments.callee(num - 1, memories, history).recentHistory;
        strategy = arguments.callee(num - 1, memories, history).strategy;
      }
    } else {
      console.warn("error: round value");
    }
    // console.log(num, recentHistory, strategy);
    return {recentHistory: recentHistory, strategy: strategy};
  },

  // 전략을 가지고 d, h 중 무엇을 낼지 결정
  makeDecision: function (round) {
    var randonNumber = Math.random();
    var memoryNumber = Math.min(round - 1, this.maxMemory, this.history.length); // round마다 사용해야할 memory 숫자를 판단
    var memory = this.getMemory(memoryNumber, this.memories, this.history); // 실제 참고한 전략의 키와 값
    this.lastStrategy = memory.recentHistory;
    var strategy = memory.strategy;
    var char = strategy[0];
    var probability = strategy[1] || 1;

    if (randonNumber > probability) {
      switch (char) {
        case 'd':
          char = 'h';
          break;
        case 'h':
          char = 'd';
          break;
        default:
          console.warn("error: strategy character");
      }
    }
    return char;
  }

};

// 테스트용 데이터
var student1 = new Player("1234-56789", "user1", 4, {
    init: ['d', 1],
    dd: ['d', 1],
    dh: ['h', 1],
    hd: ['d', 1],
    hh: ['h', 1],
    dddd:	['d', ],
    dddh: ['h', 1],
    ddhd: ['d', 1],
    ddhh: ['h', 1],
    dhdd: ['d', 1],
    dhdh: ['h', 1],
    dhhd: ['d', 1],
    dhhh: ['h', 1],
    hddd: ['d', 1],
    hddh: ['h', 1],
    hdhd: ['d', 1],
    hdhh: ['h', 1],
    hhdd: ['d', 1],
    hhdh: ['h', 1],
    hhhd: ['d', 1],
    hhhh: ['h', 1],
    hhhddh: ['d', 1],
    hhddhd: ['h', 1],
    hhddhddh: ['h', 1]
  }
);
var student2 = new Player('12345-678', 'user2', 1, {
    init: ['h', 1],
    dd: ['h', 1],
    dh: ['d', 1],
    hd: ['h', 1],
    hh: ['d', 1]
  }
);

// 못쓰는 값이면 true 반환
function unusableMemory(memory) {
  return !memory || ( memory[0] !== 'h' && memory[0] !== 'd');
}

// 두 명이 한 라운드 대결을 함. 결과를 history에 저장하고, 점수를 계산하여 저장. 10라운드인지 판단
function duel(user1, user2, round) {
  var result = user1.makeDecision(round) + user2.makeDecision(round);
  user1.history.unshift(result); // 최근 결과가 앞에 옴.
  user2.history.unshift(result);

  user1.scores[round - 1] = calScore(result)[0]; // 몇번째 게임인지 알아내서 [0] 부분을 교체해야 함
  user2.scores[round - 1] = calScore(result)[1];

  putDuelLogs(user1, round);
  putDuelLogs(user2, round);

}

function calScore(result) {
  switch (result) {
    case "dd":
      return [105, 105];
    case "dh":
      return [105, 130];
    case "hd":
      return [130, 105];
    case "hh":
      return [0, 0];
    default:
      console.warn("error: invalid result");
  }
}

function putDuelLogs(user, round) {
  document.write("Round " + round + " " + user.name + ": ");
  document.write(user.history[0] + " ");
  document.write(user.scores[round-1] + " ");
  document.write(user.lastStrategy + "<br />");
}

function playGame(user1, user2) {
  user1.lastStrategy = "";
  user1.scores = [];
  user1.history = [];
  user2.lastStrategy = "";
  user2.scores = [];
  user2.history = [];

  for (var i = 1; i <= 10; i++) {
    duel(user1, user2, i);
  }

  totalGames ++;

  var gameResult = {
    gameNumber: totalGames,
    players: [user1.studentId, user2.studentId],
    gameHistory: user1.history,
    scores: (function () {
      var sumScores = [0,0];
      for (var i = 0; i < 10; i++) {
        sumScores[0] += user1.scores[i];
        sumScores[1] += user2.scores[i];
      }
      return sumScores;
    })()
  };

  gameResults.push(gameResult);

  // 게임 결과를 각 user에 저장
  user1.games ++;
  user1.gameScore.push(gameResult.scores[0]);
  user1.gameHistory.push(tempReverse(user1.history).join(" "));
  user1.gameNumbers.push(totalGames);
  user2.games ++;
  user2.gameScore.push(gameResult.scores[1]);
  user2.gameHistory.push((function () {
    tempArray = [];
    for (var i = 9; i >= 0; i--) {
      tempArray.push(user2.history[i][1] + user2.history[i][0]);
    }
    return tempArray.join(" ");
  })());
  user2.gameNumbers.push(totalGames);

  // log 출력
  document.write("user1: " + user1.scores + " " + tempReverse(user1.history) + "<br />");
  document.write("user2: " + user2.scores + " " + tempReverse(user2.history) + "<br />");
  console.log("Game result", gameResult);
}

function tempReverse(array) {
  return array.reverse();
}

// Ajax
var xhr = new XMLHttpRequest();
xhr.open('POST', './data.php');
xhr.setRequestHeader("Content-Type", "application/json");
xhr.send();

var player1, player2;
xhr.onload = function () {
  // document.write(xhr.responseText);
  var data = JSON.parse(xhr.responseText);

  user1 = new Player(data[0].studentId, data[0].name, data[0].maxMemory, data[0].memories);
  user2 = new Player(data[1].studentId, data[1].name, data[1].maxMemory, data[1].memories);
  player1 = user1;
  player2 = user2;

  playGame(player1, player2);
  console.log("Players", player1, player2);
  console.log("gameResults", gameResults);
};
