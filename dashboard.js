/**
 * Dashboard页面交互脚本
 * 包含：背景波点粒子、鼠标星星掉落
 */

// ==================== DOM 元素获取 ====================
const particlesContainer = document.getElementById('particles-container');
const starCanvas = document.getElementById('star-canvas');

// ==================== 背景波点粒子系统 ====================

function initParticles() {
    const count = 60;
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = 'particle';

        const size = Math.random() * 5 + 3;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const driftX = (Math.random() - 0.5) * 30;
        const driftY = (Math.random() - 0.5) * 30;
        const duration = Math.random() * 8 + 6;
        const delay = Math.random() * -10;
        const opacity = Math.random() * 0.35 + 0.15;

        dot.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            opacity: ${opacity};
            --drift-x: ${driftX}px;
            --drift-y: ${driftY}px;
            --drift-duration: ${duration}s;
            --drift-delay: ${delay}s;
        `;

        particlesContainer.appendChild(dot);
    }
}

// ==================== 鼠标星星掉落效果 ====================

const ctx = starCanvas.getContext('2d');

function resizeCanvas() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class FallingStar {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 6 + 4;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.15;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = Math.random() * 1 + 0.5;
        this.gravity = 0.08;
        this.life = 1;
        this.decay = Math.random() * 0.012 + 0.008;
    }

    update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.life -= this.decay;
        this.size *= 0.995;
    }

    draw(context) {
        if (this.life <= 0) return;
        context.save();
        context.globalAlpha = Math.max(0, this.life);
        context.translate(this.x, this.y);
        context.rotate(this.rotation);

        this.drawStarShape(context, 0, 0, 5, this.size, this.size * 0.45);

        context.shadowBlur = 8;
        context.shadowColor = 'rgba(255, 255, 255, 0.9)';

        context.restore();
    }

    drawStarShape(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            let x = cx + Math.cos(rot) * outerRadius;
            let y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }

        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();

        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

const fallingStars = [];
let lastStarTime = 0;
const starInterval = 80;

document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastStarTime > starInterval) {
        fallingStars.push(new FallingStar(e.clientX, e.clientY));
        lastStarTime = now;
    }
});

function animateStars() {
    ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);

    for (let i = fallingStars.length - 1; i >= 0; i--) {
        const star = fallingStars[i];
        star.update();
        star.draw(ctx);

        if (star.life <= 0 || star.y > starCanvas.height + 20) {
            fallingStars.splice(i, 1);
        }
    }

    requestAnimationFrame(animateStars);
}

// ==================== 初始化 ====================

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    animateStars();
    console.log('Dashboard页面已初始化完成！');
});

window.addEventListener('resize', () => {
    resizeCanvas();
});
