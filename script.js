var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var w = canvas.width;
var h = canvas.height;

var words = [
  "I love cats",
  "Amo a los gatos",
  "J'aime les chats",
  "Ich liebe Katzen",
  "Amo i gatti",
  "Eu amo gatos",
  "私は猫が大好き",
  "나는 고양이를 사랑해",
  "我爱猫",
  "Я люблю кошек",
  "Ik hou van katten",
  "Jag älskar katter",
  "Kedileri seviyorum",
  "أنا أحب القطط",
  "मुझे बिल्लियाँ पसंद हैं",
  "Αγαπώ τις γάτες",
  "Kocham koty",
  "Mahal ko ang mga pusa"
];

// hidden canvas where the cat is drawn so we can find its shape
var hidden = document.createElement("canvas");
hidden.width = w;
hidden.height = h;
var hctx = hidden.getContext("2d");

var scale = h * 0.75 / 600;
var other = w * 0.8 / 265;
if (other < scale) {
  scale = other;
}

hctx.save();
hctx.translate(w / 2, h / 2);
hctx.scale(scale, scale);
hctx.translate(-365, -540);
hctx.fillStyle = "black";
hctx.strokeStyle = "black";

// head
hctx.beginPath();
hctx.ellipse(360, 392, 88, 70, 0, 0, Math.PI * 2);
hctx.fill()

// left ear
hctx.beginPath();
hctx.moveTo(268, 395);
hctx.quadraticCurveTo(245, 330, 252, 250);
hctx.quadraticCurveTo(305, 275, 352, 338);
hctx.closePath();
hctx.fill();

// right ear
hctx.beginPath();
hctx.moveTo(368, 338);
hctx.quadraticCurveTo(415, 275, 450, 238);
hctx.quadraticCurveTo(466, 320, 452, 395);
hctx.closePath();
hctx.fill();

// body (one curved pear shape)
hctx.beginPath();
hctx.moveTo(310, 440);
hctx.bezierCurveTo(270, 500, 232, 570, 235, 630);
hctx.bezierCurveTo(238, 690, 300, 705, 360, 705);
hctx.bezierCurveTo(420, 705, 485, 690, 487, 630);
hctx.bezierCurveTo(490, 570, 450, 500, 415, 440);
hctx.closePath();
hctx.fill();

// tail
hctx.lineWidth = 20;
hctx.lineCap = "round";
hctx.beginPath();
hctx.moveTo(350, 700);
hctx.bezierCurveTo(325, 760, 340, 835, 410, 838);
hctx.bezierCurveTo(450, 840, 485, 820, 488, 802);
hctx.stroke();

hctx.restore();

var list = [];
var img = hctx.getImageData(0, 0, w, h).data;
for (var y = 0; y < h; y = y + 7) {
  for (var x = 0; x < w; x = x + 7) {
    var alphaPixel = img[(y * w + x) * 4 + 3];
    if (alphaPixel > 200) {
      var size = 5 + Math.random() * 7;
      var alpha = 0.3 + (size - 5) / 7 * 0.7;
      var word = {
        text: words[Math.floor(Math.random() * words.length)],
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.random() * 1 - 0.5,
        vy: Math.random() * 1 - 0.5,
        tx: x + Math.random() * 2 - 1,
        ty: y + Math.random() * 2 - 1,
        size: size,
        alpha: alpha
      };
      list.push(word);
    }
  }
}

var frame = 0;
var pull = 0;

function draw() {
  frame = frame + 1;
  ctx.clearRect(0, 0, w, h);

  if (frame > 240) {
    pull = pull + 0.0002;
    if (pull > 0.04) {
      pull = 0.04;
    }
  }

  for (var i = 0; i < list.length; i++) {
    var a = list[i];

    if (frame > 240) {
      a.vx = a.vx * 0.97;
      a.vy = a.vy * 0.97;
      a.x = a.x + (a.tx - a.x) * pull;
      a.y = a.y + (a.ty - a.y) * pull;
    }

    a.x = a.x + a.vx;
    a.y = a.y + a.vy;

    if (a.x < 0) {
      a.x = w;
    }
    if (a.x > w) {
      a.x = 0;
    }
    if (a.y < 0) {
      a.y = h;
    }
    if (a.y > h) {
      a.y = 0;
    }

    var bob = Math.sin(frame * 0.03 + a.tx * 0.01) * 3 * (pull * 25);

    ctx.font = a.size + "px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 107, 129, " + a.alpha + ")";
    ctx.fillText(a.text, a.x, a.y + bob);
  }
}

setInterval(draw, 16);