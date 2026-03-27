const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
const fontSize = 15;
let columns = Math.floor(canvas.width / fontSize);
const drops = [];

const cloudWidth = 430;
const cloudLeft = () => (canvas.width / 2) - (cloudWidth / 2);
const lakeY = () => canvas.height * 0.71;   // lago um pouco mais alto

const ripples = [];

function initDrops() {
  columns = Math.floor(canvas.width / fontSize);
  drops.length = 0;
  for (let x = 0; x < columns; x++) {
    drops[x] = Math.random() * -40;
  }
}
initDrops();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#a8d4ff';
  ctx.font = `${fontSize}px monospace`;

  const currentCloudLeft = cloudLeft();
  const lakeHeight = lakeY();

  // Desenha as letras
  for (let i = 0; i < drops.length; i++) {
    const x = i * fontSize;
    
    if (x < currentCloudLeft || x > currentCloudLeft + cloudWidth) {
      drops[i] += 3;
      continue;
    }

    const text = letters[Math.floor(Math.random() * letters.length)];
    const y = drops[i] * fontSize;

    if (y < lakeHeight) {
      ctx.fillText(text, x, y);
    } 
    else if (drops[i] * fontSize < lakeHeight + 30) {
      ripples.push({ 
        x: x, 
        y: lakeHeight, 
        radius: 2.5, 
        alpha: 0.85, 
        life: 38 
      });
      drops[i] = Math.random() * -35;
    }

    drops[i]++;
  }

  // Ondulações mais realistas
  for (let j = ripples.length - 1; j >= 0; j--) {
    const r = ripples[j];
    
    ctx.strokeStyle = `rgba(180, 225, 255, ${r.alpha})`;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
    ctx.stroke();

    // Segundo círculo mais fraco para efeito de onda real
    ctx.strokeStyle = `rgba(200, 235, 255, ${r.alpha * 0.4})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.radius * 1.6, 0, Math.PI * 2);
    ctx.stroke();

    r.radius += 1.65;
    r.alpha -= 0.024;
    r.life--;

    if (r.life <= 0 || r.alpha <= 0) ripples.splice(j, 1);
  }

  // === ÁGUA MAIS REALISTA ===
  // Base profunda do lago
  const lakeGradient = ctx.createLinearGradient(0, lakeHeight, 0, canvas.height);
  lakeGradient.addColorStop(0, 'rgba(20, 55, 95, 0.92)');   // superfície
  lakeGradient.addColorStop(1, 'rgba(8, 28, 55, 0.98)');    // fundo escuro

  ctx.fillStyle = lakeGradient;
  ctx.fillRect(0, lakeHeight, canvas.width, canvas.height - lakeHeight);

  // Reflexo sutil da luz (brilho na superfície)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.13)';
  ctx.fillRect(0, lakeHeight, canvas.width, 55);

  // Linha de brilho mais forte no topo da água
  ctx.fillStyle = 'rgba(220, 240, 255, 0.22)';
  ctx.fillRect(0, lakeHeight, canvas.width, 18);
}

setInterval(draw, 30);

window.addEventListener('resize', () => {
  resizeCanvas();
  initDrops();
});