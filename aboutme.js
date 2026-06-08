/**
 * About Me 页面交互脚本
 * 包含：标签物理下坠效果（初始固定）、标签点击消散、背景波点粒子、鼠标星星掉落
 */

// ==================== 标签数据 ====================
const tagLabels = ['计算机网络', '软件工程', '云运维', 'hcip', '英语六级'];
const tagsContainer = document.getElementById('tagsContainer');

// ==================== 标签物理引擎 ====================
const GRAVITY = 0.4;
const BOUNCE = 0.5;
const FRICTION = 0.97;
const SCROLL_FORCE = 0.8;

const tags = [];
let physicsRunning = false;
let physicsInitialized = false; // 标签初始化完成标志

class Tag {
    constructor(element, initialX, initialY) {
        this.element = element;
        this.x = initialX;
        this.y = initialY;
        this.vx = 0;
        this.vy = 0;
        this.width = element.offsetWidth;
        this.height = element.offsetHeight;
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.isSettled = true;       // 初始固定
        this.isPopped = false;       // 是否已消散
        this.settleFrame = 0;

        // 设置初始位置
        this.element.style.transform =
            `translate(${this.x}px, ${this.y}px) rotate(0rad)`;
    }

    applyScrollForce(directionY) {
        if (this.isPopped) return;
        this.vy += directionY * SCROLL_FORCE;
        this.vx += (Math.random() - 0.5) * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.isSettled = false;
    }

    pop() {
        if (this.isPopped) return;
        this.isPopped = true;
        this.element.classList.add('popping');
        // 动画结束后移除元素
        setTimeout(() => {
            if (this.element.parentNode) {
                this.element.remove();
            }
        }, 500);
    }

    update(containerWidth, containerHeight, allTags) {
        if (this.isPopped) return;

        if (this.isSettled) {
            this.settleFrame++;
            return;
        }

        this.vy += GRAVITY;
        this.vx *= FRICTION;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // 底部碰撞
        if (this.y + this.height > containerHeight) {
            this.y = containerHeight - this.height;
            this.vy = -this.vy * BOUNCE;
            this.vx *= FRICTION;
        }
        // 顶部碰撞
        if (this.y < 0) {
            this.y = 0;
            this.vy = -this.vy * BOUNCE;
        }
        // 左右边界
        if (this.x < 0) {
            this.x = 0;
            this.vx = -this.vx * BOUNCE;
        }
        if (this.x + this.width > containerWidth) {
            this.x = containerWidth - this.width;
            this.vx = -this.vx * BOUNCE;
        }

        // 标签间碰撞
        for (const other of allTags) {
            if (other === this || other.isPopped) continue;
            if (this.x < other.x + other.width &&
                this.x + this.width > other.x &&
                this.y < other.y + other.height &&
                this.y + this.height > other.y) {

                const overlapX = Math.min(
                    this.x + this.width - other.x,
                    other.x + other.width - this.x
                );
                const overlapY = Math.min(
                    this.y + this.height - other.y,
                    other.y + other.height - this.y
                );

                if (overlapX < overlapY) {
                    const sign = (this.x + this.width / 2) < (other.x + other.width / 2) ? -1 : 1;
                    this.x += sign * overlapX * 0.5;
                    other.x -= sign * overlapX * 0.5;
                    const tmp = this.vx;
                    this.vx = other.vx * BOUNCE;
                    other.vx = tmp * BOUNCE;
                } else {
                    const sign = (this.y + this.height / 2) < (other.y + other.height / 2) ? -1 : 1;
                    this.y += sign * overlapY * 0.5;
                    other.y -= sign * overlapY * 0.5;
                    const tmp = this.vy;
                    this.vy = other.vy * BOUNCE;
                    other.vy = tmp * BOUNCE;
                }
            }
        }

        // 停止检测
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const onBottom = this.y + this.height >= containerHeight - 2;
        if (onBottom && speed < 0.3) {
            this.isSettled = true;
            this.vx = 0; this.vy = 0;
            this.y = containerHeight - this.height;
            this.rotation += (0 - this.rotation) * 0.2;
        }

        this.element.style.transform =
            `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}rad)`;
    }
}

// ==================== 物理循环 ====================
function startPhysicsLoop() {
    if (physicsRunning) return;
    physicsRunning = true;

    function loop() {
        const allPopped = tags.every(t => t.isPopped);
        if (allPopped) { physicsRunning = false; return; }

        const cw = tagsContainer.offsetWidth;
        const ch = tagsContainer.offsetHeight;
        const active = tags.filter(t => !t.isPopped);
        const allSettled = active.every(t => t.isSettled);

        active.forEach(tag => tag.update(cw, ch, active));

        if (!allSettled || active.some(t => t.settleFrame < 120)) {
            requestAnimationFrame(loop);
        } else {
            physicsRunning = false;
        }
    }

    requestAnimationFrame(loop);
}

// ==================== 初始化标签 ====================
function initTags() {
    const containerWidth = tagsContainer.offsetWidth;
    const containerHeight = tagsContainer.offsetHeight;

    const positions = [
        { x: containerWidth * 0.05, y: containerHeight * 0.1 },
        { x: containerWidth * 0.4,  y: containerHeight * 0.05 },
        { x: containerWidth * 0.15, y: containerHeight * 0.35 },
        { x: containerWidth * 0.45, y: containerHeight * 0.3 },
        { x: containerWidth * 0.1,  y: containerHeight * 0.6 },
    ];

    tagLabels.forEach((label, index) => {
        const el = document.createElement('div');
        el.className = 'tag-item';
        el.textContent = label;
        const sizes = ['1rem', '0.85rem', '1.1rem', '0.95rem', '0.9rem'];
        el.style.fontSize = sizes[index];
        tagsContainer.appendChild(el);

        // 点击消散
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const tag = tags.find(t => t.element === el);
            if (tag && !tag.isPopped) {
                tag.pop();
                // 如果物理循环停止，不需要重启
            }
        });

        // 等待渲染后获取尺寸并创建物理对象
        setTimeout(() => {
            const tag = new Tag(el, positions[index].x, positions[index].y);
            tags.push(tag);
            // 检查所有标签是否创建完毕
            if (tags.length === tagLabels.length) {
                physicsInitialized = true;
            }
        }, 80);
    });
}

// ==================== 滚动/滑动事件 ====================
let lastWheelTime = 0;

document.addEventListener('wheel', (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastWheelTime < 50) return;
    lastWheelTime = now;

    const direction = Math.sign(e.deltaY);
    tags.forEach(tag => tag.applyScrollForce(direction));
    startPhysicsLoop();
}, { passive: false });

// 触摸滑动
let touchStartY = 0;
let touchStartX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    const deltaY = touchStartY - e.touches[0].clientY;
    const deltaX = touchStartX - e.touches[0].clientX;

    // 检测滑动方向和力度
    if (Math.abs(deltaY) > 8 || Math.abs(deltaX) > 8) {
        const dirY = Math.sign(deltaY);
        const dirX = Math.sign(deltaX);
        tags.forEach(tag => {
            tag.applyScrollForce(dirY);
            // 水平滑动也给一点水平力
            tag.vx += dirX * 0.5;
        });
        startPhysicsLoop();
    }
}, { passive: true });

// ==================== 背景波点粒子 ====================
const particlesContainer = document.getElementById('particles-container');

function initParticles() {
    const count = 60;
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = 'particle';
        const size = Math.random() * 5 + 3;
        dot.style.cssText = `
            width: ${size}px; height: ${size}px;
            left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.35 + 0.15};
            --drift-x: ${(Math.random() - 0.5) * 30}px;
            --drift-y: ${(Math.random() - 0.5) * 30}px;
            --drift-duration: ${Math.random() * 8 + 6}s;
            --drift-delay: ${Math.random() * -10}s;
        `;
        particlesContainer.appendChild(dot);
    }
}

// ==================== 鼠标星星掉落 ====================
const starCanvas = document.getElementById('star-canvas');
const ctx = starCanvas.getContext('2d');

function resizeCanvas() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class FallingStar {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.size = Math.random() * 6 + 4;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.15;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = Math.random() * 1 + 0.5;
        this.gravity = 0.08; this.life = 1;
        this.decay = Math.random() * 0.012 + 0.008;
    }
    update() {
        this.speedY += this.gravity;
        this.x += this.speedX; this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.life -= this.decay; this.size *= 0.995;
    }
    draw(ctx) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        this.drawStar(ctx);
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255,255,255,0.9)';
        ctx.restore();
    }
    drawStar(ctx) {
        let r = Math.PI / 2 * 3;
        const s = Math.PI / 5;
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        for (let i = 0; i < 5; i++) {
            ctx.lineTo(Math.cos(r) * this.size, Math.sin(r) * this.size);
            ctx.lineTo(Math.cos(r + s) * this.size * 0.45, Math.sin(r + s) * this.size * 0.45);
            r += s * 2;
        }
        ctx.closePath();
        ctx.fillStyle = 'white'; ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1; ctx.stroke();
    }
}

const fallingStars = [];
let lastStarTime = 0;

document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastStarTime > 80) {
        fallingStars.push(new FallingStar(e.clientX, e.clientY));
        lastStarTime = now;
    }
});

function animateStars() {
    ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    for (let i = fallingStars.length - 1; i >= 0; i--) {
        const s = fallingStars[i];
        s.update(); s.draw(ctx);
        if (s.life <= 0 || s.y > starCanvas.height + 20) fallingStars.splice(i, 1);
    }
    requestAnimationFrame(animateStars);
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    animateStars();
    initTags();
    console.log('About Me 页面已初始化完成！');
});

window.addEventListener('resize', () => {
    resizeCanvas();
});
