// 테스트용 데이터
var student1 = {studentId: "1234-56789", name: "user1", maxMemory: 4,
  lastStrategy: "",
  memories: {
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
    hhddhd: ['h', 1],
    hhddhddh: ['h', 1]
  },
  scores: Array(Array()),
  // history: ["hh", "dd", "hd", 'dh'],
  history: [],
  games: 0,
  getMemory: getMemory,
  makeDecision: makeDecision,
};

var student2 = {studentId: '12345-678', name: 'user2', maxMemory: 1,
  lastStrategy: "",
  memories: {
    init: ['h', 1],
    dd: ['h', 1],
    dh: ['d', 1],
    hd: ['h', 1],
    hh: ['d', 1]
  },
  // history: ["dh", "dd"],
  // scores: [[0, 0, 130, 105, 0, 130, 105, 0, 130, 0], [105, 0, 130]],
  history: [],
  scores: Array(Array()),
  games: 57,
  getMemory: getMemory,
  makeDecision: makeDecision,
};

// 전략을 가지고 d, h 중 무엇을 낼지 결정
function makeDecision(round) {
  var randonNumber = Math.random();
  var memoryNumber = Math.min(round - 1, this.maxMemory, this.history.length); // round마다 사용해야할 memory 숫자를 판단
  var strategy = this.getMemory(memoryNumber, this.memories, this.history); // 실제 참고한 전략
  lastStrategy = strategy;
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
        console.log("error: strategy character");
    }
  }
  return char;
}

  // history와 비교하여 전략을 짬
  function getMemory(num, memories, history) {
    var memory = [];
    var recentHistory = "";

    if (num === 0) {
      memory = memories["init"];
    } else if (num <= 10) {
      for (var i = 0; i < num; i++) {
        recentHistory += history[i]; // 최근 히스토리 생성
      }
      memory = memories[recentHistory]; // recentHistory에 해당하는 메모리 가져옴.
      if (unusableMemory(memory)) {  //
        memory = arguments.callee(num - 1, memories, history);
      }
    } else {
      console.log("error: round value");
    }
    console.log(num, recentHistory, memory);
    return memory;
  }

function unusableMemory(memory) {
  return !memory || ( memory[0] !== 'h' && memory[0] !== 'd'); // 못쓰는 값이면 true 반환
}

// 두 명이 한 라운드 대결을 함. 결과를 history에 저장하고, 점수를 계산하여 저장. 10라운드인지 판단
function duel(user1, user2, round) {
  var result = user1.makeDecision(round) + user2.makeDecision(round);
  user1.history.unshift(result); // 최근 결과가 앞에 옴.
  user2.history.unshift(result);

  user1.scores[0][round - 1] = calScore(result)[0]; // 몇번째 게임인지 알아내서 [0] 부분을 교체해야 함
  user2.scores[0][round - 1] = calScore(result)[1];

  putDuelLogs(user1, round);
  putDuelLogs(user2, round);

  if (round === 10) {
    user1.games ++;
    user2.games ++;
  }

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
      console.log("error: invalid result");
  }
}

function putDuelLogs(user, round) {
  document.write("Round " + round + " " + user.name + ": ");
  document.write(user.history[0] + " ");
  document.write(user.scores[0][round-1] + " ");
  document.write(user.lastStrategy + "<br/>");
}

function playGame(user1, user2) {
  for (var i = 1; i <= 10; i++) {
    duel(user1, user2, i);
  }
    document.write("user1: " + user1.scores + " " + tempReverse(user1.history) + "<br/>");
    document.write("user2: " + user2.scores + " " + tempReverse(user2.history) + "<br/>");
}

function tempReverse(array) {
  return array.reverse();
}
