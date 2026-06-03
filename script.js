/**
 * 个人作品集首页交互脚本 v7
 * 包含：HELLO字母物理碰撞动画、登录加载动画、背景波点粒子、鼠标星星掉落
 */

// ==================== DOM 元素获取 ====================
const loginBtn = document.getElementById('loginBtn');
const loadingContainer = document.getElementById('loadingContainer');
const loadingProgress = document.querySelector('.loading-progress');
const particlesContainer = document.getElementById('particles-container');
const starCanvas = document.getElementById('star-canvas');
const helloContainer = document.getElementById('helloContainer');
const helloLetters = document.querySelectorAll('.hello-letter');

// ==================== HELLO字母物理碰撞动画 ====================

let helloAnimationTriggered = false;
const letters = []; // 存储所有字母的物理状态
const LETTER_WIDTH = 200;
const LETTER_HEIGHT = 200;
const GRAVITY = 0.5;
const BOUNCE = 0.6;
const FRICTION = 0.98;
const LETTER_GAP = 10; // 字母之间的间距

/**
 * 字母物理类
 */
class Letter {
    constructor(element, index) {
        this.element = element;
        this.index = index;
        this.x = 5 + index * (LETTER_WIDTH + LETTER_GAP); // 初始水平位置
        this.y = 0; // 初始垂直位置
        this.vx = (Math.random() - 0.5) * 3; // 水平速度
        this.vy = 0; // 垂直速度
        this.rotation = 0; // 旋转角度
        this.rotationSpeed = (Math.random() - 0.5) * 0.1; // 旋转速度
        this.isSettled = false; // 是否已停止
        this.started = false; // 是否已开始下落
        this.settleTime = 0; // 停止计时
    }

    start() {
        this.started = true;
        this.element.style.opacity = '1';
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    update(bottomY, allLetters) {
        if (!this.started) return;

        if (this.isSettled) {
            // 已停止的字母不更新位置
            this.settleTime++;
            return;
        }

        // 应用重力
        this.vy += GRAVITY;

        // 应用速度
        this.x += this.vx;
        this.y += this.vy;

        // 应用旋转
        this.rotation += this.rotationSpeed;

        // 边界碰撞检测 - 底部
        if (this.y + LETTER_HEIGHT > bottomY) {
            this.y = bottomY - LETTER_HEIGHT;
            this.vy = -this.vy * BOUNCE;
            this.vx *= FRICTION;
            this.rotationSpeed *= 0.9;

            // 如果速度足够小，停止
            if (Math.abs(this.vy) < 1) {
                this.vy = 0;
            }
        }

        // 边界碰撞检测 - 左右
        if (this.x < 0) {
            this.x = 0;
            this.vx = -this.vx * BOUNCE;
        }
        if (this.x + LETTER_WIDTH > window.innerWidth) {
            this.x = window.innerWidth - LETTER_WIDTH;
            this.vx = -this.vx * BOUNCE;
        }

        // 字母之间碰撞检测
        for (const other of allLetters) {
            if (other === this || !other.started) continue;

            // AABB碰撞检测
            if (this.x < other.x + LETTER_WIDTH &&
                this.x + LETTER_WIDTH > other.x &&
                this.y < other.y + LETTER_HEIGHT &&
                this.y + LETTER_HEIGHT > other.y) {

                // 计算重叠量
                const overlapX = Math.min(this.x + LETTER_WIDTH - other.x, other.x + LETTER_WIDTH - this.x);
                const overlapY = Math.min(this.y + LETTER_HEIGHT - other.y, other.y + LETTER_HEIGHT - this.y);

                // 分离重叠部分
                if (overlapX < overlapY) {
                    // 水平分离
                    const sign = (this.x + LETTER_WIDTH / 2) < (other.x + LETTER_WIDTH / 2) ? -1 : 1;
                    this.x += sign * overlapX * 0.5;
                    other.x -= sign * overlapX * 0.5;

                    // 交换速度
                    const tempVx = this.vx;
                    this.vx = other.vx * BOUNCE;
                    other.vx = tempVx * BOUNCE;
                } else {
                    // 垂直分离
                    const sign = (this.y + LETTER_HEIGHT / 2) < (other.y + LETTER_HEIGHT / 2) ? -1 : 1;
                    this.y += sign * overlapY * 0.5;
                    other.y -= sign * overlapY * 0.5;

                    // 交换速度
                    const tempVy = this.vy;
                    this.vy = other.vy * BOUNCE;
                    other.vy = tempVy * BOUNCE;
                }
            }
        }

        // 检查是否停止（速度足够小且在底部）
        const onBottom = this.y + LETTER_HEIGHT >= bottomY - 5;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (onBottom && speed < 0.5) {
            this.isSettled = true;
            this.vx = 0;
            this.vy = 0;
            this.y = bottomY - LETTER_HEIGHT;
            this.rotation = 0;
        }

        // 更新DOM位置
        this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}rad)`;
    }
}

/**
 * 触发HELLO字母物理碰撞动画
 */
function triggerHelloAnimation() {
    if (helloAnimationTriggered) return;
    helloAnimationTriggered = true;

    // 显示字母容器
    helloContainer.style.opacity = '1';

    // 初始化所有字母
    helloLetters.forEach((letter, index) => {
        const letterObj = new Letter(letter, index);
        letters.push(letterObj);
    });

    // 依次启动每个字母
    const bottomY = window.innerHeight - 10; // 距离底部10px

    letters.forEach((letter, index) => {
        setTimeout(() => {
            letter.start();
        }, index * 500); // 每个字母间隔500ms（0.5s）开始
    });

    // 启动物理模拟循环
    function physicsLoop() {
        letters.forEach(letter => {
            letter.update(bottomY, letters);
        });

        // 检查是否所有字母都停止
        const allSettled = letters.every(l => l.isSettled);
        const allStarted = letters.every(l => l.started);

        if (!allSettled || !allStarted) {
            requestAnimationFrame(physicsLoop);
        }
    }

    requestAnimationFrame(physicsLoop);
}

// ==================== 登录按钮加载动画 ====================

loginBtn.addEventListener('click', () => {
    loginBtn.classList.add('hidden');
    loadingContainer.classList.add('show');

    // 触发HELLO字母动画
    triggerHelloAnimation();

    startLoadingAnimation();
});

function startLoadingAnimation() {
    let progress = 0;
    const duration = 1500;
    const interval = 30;
    const increment = 100 / (duration / interval);

    const loadingInterval = setInterval(() => {
        progress += increment;

        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                console.log('登录成功！');
                // 滑动过渡跳转到dashboard
                transitionToDashboard();
            }, 200);
        }

        loadingProgress.style.width = progress + '%';
    }, interval);
}

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
    console.log('首页交互效果已初始化完成！');
});

window.addEventListener('resize', () => {
    resizeCanvas();
});

// ==================== 页面滑动过渡 ====================

/**
 * 首页向左滑出，然后跳转到dashboard
 */
function transitionToDashboard() {
    const mainContainer = document.getElementById('mainContainer');
    const helloContainer = document.getElementById('helloContainer');

    // 整个页面内容向左滑出
    document.body.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease';
    document.body.style.transform = 'translateX(-100%)';
    document.body.style.opacity = '0';

    // 动画结束后跳转
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 600);
}
