// ===============================
// Matrix Rain with Hiragana
// ===============================

// Canvas setup
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Font settings
const fontSize = 16;
ctx.font = `${fontSize}px monospace`;

// Character sets
const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const hiragana =
  "あいうえお" +
  "かきくけこ" +
  "さしすせそ" +
  "たちつてと" +
  "なにぬねの" +
  "はひふへほ" +
  "まみむめも" +
  "やゆよ" +
  "らりるれろ" +
  "わをん";

// Combine characters
const characters = (latin + hiragana).split("");

// Columns
const columns = Math.floor(canvas.width / fontSize);

// Drops (y-position per column)
const drops = Array(columns).fill(1);

// Draw function
function draw() {
  // Fade background
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Text color
  ctx.fillStyle = "#00ff9c";

  for (let i = 0; i < drops.length; i++) {
    const char = characters[Math.floor(Math.random() * characters.length)];

    const x = i * fontSize;
    const y = drops[i] * fontSize;

    ctx.fillText(char, x, y);

    // Reset drop randomly after it reaches bottom
    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

// Loop
setInterval(draw, 33);

// Resize handling
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
