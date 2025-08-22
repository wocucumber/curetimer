// https://qiita.com/kkuzu/items/bb6dc999e6b44af5da2e
// https://note.com/neji_bit/n/nca6cf8b2d2d2


const cacheName = "apuchannel-cure-timer-pwa";
const filesToCache = [
  "/",
  "/index.html",

  "/index.js",
  "/js/pageManager.js",

  "/css/style.css",
  "/css/tengu.css",

  "/audios/tntn.mp3",
  "/audios/wnk.mp3",

  "/images/bgMain.PNG",
  "/images/bgTitle.PNG",
  "/images/logo.PNG",
  "/images/logoA.PNG",
  "/images/logoB.PNG",
  "/images/startBtn.PNG",
];

const otherFilesToCache = [
  "https://fonts.googleapis.com/css2?family=Mozilla+Text&family=Potta+One&display=swap",
  "https://code.jquery.com/jquery-3.7.1.min.js",
  "https://fonts.gstatic.com/s/mozillatext/v1/SZcr3FrnJ7S7WZIff2mJ7Tbp4zu7ULu3HkPOB4UcDNdbVKutKXt0lA.woff2",
  "https://fonts.gstatic.com/s/pottaone/v18/FeVSS05Bp6cy7xI-YfxQ2J5hm24c1sY_XjjYC1QMPbpH11Hj8t620eOL.108.woff2",
  "https://fonts.gstatic.com/s/pottaone/v18/FeVSS05Bp6cy7xI-YfxQ2J5hm24c1sY_XjjYC1QMPbpH11Hj8t620eOL.119.woff2",
  "https://fonts.gstatic.com/s/pottaone/v18/FeVSS05Bp6cy7xI-YfxQ2J5hm24c1sY_XjjYC1QMPbpH11Hj8t620eOL.114.woff2",
  "https://fonts.gstatic.com/s/pottaone/v18/FeVSS05Bp6cy7xI-YfxQ2J5hm24c1sY_XjjYC1QMPbpH11Hj8t620eOL.115.woff2",
  "https://fonts.gstatic.com/s/pottaone/v18/FeVSS05Bp6cy7xI-YfxQ2J5hm24c1sY_XjjYC1QMPbpH11Hj8t620eOL.94.woff2",
  "https://fonts.gstatic.com/s/pottaone/v18/FeVSS05Bp6cy7xI-YfxQ2J5hm24c1sY_XjjYC1QMPbpH11Hj8t620eOL.100.woff2"
];


// キャッシュする
self.addEventListener("install", function(e) {
  console.log("Service worker was registered.");
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([...filesToCache.map(e=>"/curetimer"+e), ...otherFilesToCache])
    })
  );
});

// オフライン時、キャッシュからコンテンツを取得
self.addEventListener("fetch", function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(self.clients.claim())
});

self.addEventListener("message", e => {
  const msg = e.data;
  console.log("Recieved: "+msg);

  if (msg === "startOne") {
    console.log("one");
    setTimeout(() => {
      self.registration.showNotification("クイのキュアタイマー", {
        body: "もうすぐ飲み込む時間！"
      })
    }, 1000 * 50);
  } else if (msg === "startFive") {
    console.log("five");
    setTimeout(() => {
      self.registration.showNotification("クイのキュアタイマー", {
        body: "もうすぐご飯の時間！"
      })
    }, 1000 * (60 * 4 + 50));
  }
});

self.addEventListener("push", () => {
  self.registration.showNotification("実験３の通知です！2", {
    body: "サービスワーカーです！"
  })
});