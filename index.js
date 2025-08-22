const START_FILE_AMOUNT = 8;


const pages = {
  notify: new Page("notify"),
  title: new Page("title"),
  main: new Page("main"),
}
const STATES = {
  ONE: 0,
  FIVE: 1
};
const audios = {
  wanko: {play(){}},
  tanutanu: {play(){}},
  start: {play(){}},
}

/** @type {HTMLElement} */
let mainBar;

/** @type {JQuery} */
let $reamingText;

/** @type {JQuery} */
let $reamingTime;

let startedAt = 0;
let maxTime = 60;
let state = STATES.ONE;

let lastClick = 0;
let isLoopRunnable = false;

$(function() {
  main();
});

let controller = null;

function main() {
  if ("serviceWorker" in navigator) {
    console.log("Tried to register service worker.");
    navigator.serviceWorker.register("sw.js").then((reg) => {
      console.log("Service worker was registered by index.js.");
      console.log('SW registered: ', reg);
    });
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      controller = navigator.serviceWorker.controller;
    });

  } else {
    alert("サービスワーカーが見つからなかった...")
  }

  if (!("Notification" in window) || Notification.permission === "granted") {
    pages.title.show(false);
    showLogo();
  } else {
    pages.notify.show(false);
    setupNotifyPage();
  }
  
  setupClickEvents();
  
}

function setupNotifyPage() {
  $(".notify-btn-deny").on("click", () => {
    pages.title.change();
    setTimeout(() => {
      showLogo();
    }, 1000);
  });
  $(".notify-btn-grant").on("click", () => {
    Notification.requestPermission()
      .then((e) => {
        if (e === "granted") alert("ありがとう！");
        else alert("...");
      }).catch((e) => {
        alert("おかしいぞ...");
      }).finally(() => {
        pages.title.change();
        setTimeout(() => {
          showLogo();
        }, 1000);
      });
  });
}

function setupClickEvents() {
  $(".title").on("click", () => {
    // navigator.serviceWorker.controller.postMessage("テストザマス", [new MessageChannel().port2])

    pages.main.change();

    audios.start = new Audio("audios/start"+(Math.floor(Math.random() * START_FILE_AMOUNT) + 1)+".mp3");

    startTimer();

    audios.wanko    = new Audio("audios/wnk.mp3");
    audios.tanutanu = new Audio("audios/tntn.mp3");
    
  });
  $(".main").on("click", () => {
    const now = Date.now();

    if (now - lastClick < 1000) {
      if (confirm("再読み込みしてもいい？"))
        reload();
    }
    
    lastClick = now;
  });
}

function showLogo() {
  $(".title-logo-b,.title-btn").hide();

  setTimeout(() => {
    $(".title-logo-b").show();

    setTimeout(() => {
      $(".title-btn").fadeIn(500);
      setTimeout(() => {
        $(".title-btn").addClass("anim");
      }, 200);
    }, 1750);
  }, 1500);
}

function startTimer() {
  mainBar = $(".main-bar")[0];
  $reamingText = $(".main-reaming-text");
  $reamingTime = $(".main-reaming-time");

  updateBarValue(0);

  
  maxTime = 60;
  startedAt = Date.now();
  
  $reamingText.text("飲み込むまで");
  $reamingTime.html("").append(
    $("<div>").addClass("main-reaming-timer-time"),
    $("<div>").addClass("main-reaming-timer-sec").text("秒"),
  );
  $reamingTime = $(".main-reaming-timer-time");

  sendMessage("startOne");

  isLoopRunnable = true;
  loop();

  audios.start.play();
}
function updateBarValue(value) {
  mainBar.style = "top: calc((100% - 70px) * "+(Math.floor(value*1000)/1000)+")";
}
function updateTimerValue(reamingTime) {
  if (state === STATES.ONE) {
    $reamingTime.text(reamingTime)
  } else {
    $reamingTime.text(Math.floor(reamingTime / 60)+":"+(reamingTime % 60).toString().padStart(2, "0"));
  }
}

function loop() {
  if (!isLoopRunnable) return;

  const reamingTime = Math.max(maxTime - ((Date.now() - startedAt) / 1000), 0);

  if (state === STATES.ONE) 
    updateBarValue(1 - (reamingTime / maxTime));
  else
    updateBarValue(reamingTime / maxTime);

  updateTimerValue(Math.ceil(reamingTime - 0.5));

  if (reamingTime === 0) {
    if (state === STATES.ONE) {
      finishOne();
    } else {
      finishFive();
      return;
    }
  }

  requestAnimationFrame(loop);
}
function finishOne() {
  audios.wanko.play();
  state = STATES.FIVE;
  // mainBar.classList.add("turn");

  $reamingText.text("ご飯まで");
  $reamingTime = $(".main-reaming-time");

  maxTime = 60 * 5;
  startedAt = Date.now();

  sendMessage("startFive");

}
function finishFive() {
  audios.tanutanu.play();
  isLoopRunnable = false;
}

function sendMessage(msg) {
  if (!navigator.serviceWorker.controller) return console.log("Service worker controller is not found.");
  
  navigator.serviceWorker.controller.postMessage(msg, [new MessageChannel().port2])

  // controller.postMessage("テストザマス", [new MessageChannel().port2])
  // const channel = new MessageChannel();
  // navigator.serviceWorker.controller.postMessage(msg, [channel.port2])
  // navigator.serviceWorker.controller.postMessage("テストザマス", [m])
  // channel.port2.postMessage(msg);
  console.log("message was sended.");
}


function reload() {
  pages.title.change();
  isLoopRunnable = false;

}