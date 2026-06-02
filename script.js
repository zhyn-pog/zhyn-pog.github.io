/**
 * 个人作品集首页交互脚本 v2
 * 包含：便签交互、登录加载动画、背景波点粒子、鼠标星星掉落
 */

// ==================== DOM 元素获取 ====================
const stickyNote = document.getElementById('stickyNote');
const mainContainer = document.getElementById('mainContainer');
const noteOverlay = document.getElementById('noteOverlay');
const noteExpandedCard = document.getElementById('noteExpandedCard');
const backBtn = document.getElementById('backBtn');
const loginBtn = document.getElementById('loginBtn');
const loadingContainer = document.getElementById('loadingContainer');
const loadingProgress = document.querySelector('.loading-progress');
const particlesContainer = document.getElementById('particles-container');
const starCanvas = document.getElementById('star-canvas');

// ==================== 便签交互逻辑 ====================

/**
 * 便签点击 -> 打开全屏覆盖层
 * 不移动任何元素位置，只叠加覆盖层
 */
stickyNote.addEventListener('click', (e) => {
    e.stopPropagation();
    openNoteOverlay();
});

/**
 * 打开便签覆盖层
 */
function openNoteOverlay() {
    // 背景虚化拉暗（元素位置不变）
    mainContainer.classList.add('blur-bg');
    // 显示覆盖层
    noteOverlay.classList.add('show');
}

/**
 * 关闭便签覆盖层
 */
function closeNoteOverlay() {
    mainContainer.classList.remove('blur-bg');
    noteOverlay.classList.remove('show');
}

/**
 * 返回按钮点击
 */
backBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeNoteOverlay();
});

/**
 * 点击覆盖层空白区域也可关闭
 */
noteOverlay.addEventListener('click', (e) => {
    if (e.target === noteOverlay) {
        closeNoteOverlay();
    }
});

// ==================== 登录按钮加载动画 ====================

loginBtn.addEventListener('click', () => {
    loginBtn.classList.add('hidden');
    loadingContainer.classList.add('show');
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
            }, 200);
        }

        loadingProgress.style.width = progress + '%';
    }, interval);
}

// ==================== 背景波点粒子系统 ====================

/**
 * 创建固定漂浮的白色波点
 * 使用 CSS 自定义属性控制每个粒子的漂浮方向和速度
 */
function initParticles() {
    const count = 60;
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = 'particle';

        // 随机大小 (3px - 8px)
        const size = Math.random() * 5 + 3;

        // 随机位置
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        // 随机漂浮方向和距离
        const driftX = (Math.random() - 0.5) * 30;
        const driftY = (Math.random() - 0.5) * 30;

        // 随机动画时长 (6s - 14s)
        const duration = Math.random() * 8 + 6;

        // 随机延迟
        const delay = Math.random() * -10;

        // 随机透明度
        const opacity = Math.random() * 0.35 + 0.15;

        // 通过 CSS 自定义属性设置每个粒子的独立动画
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

/**
 * 掉落星星类
 * 在鼠标位置生成，受重力影响向下掉落，同时缩小和淡出
 */
class FallingStar {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 6 + 4;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.15;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = Math.random() * 1 + 0.5;  // 初始向下速度
        this.gravity = 0.08;                    // 重力加速度
        this.life = 1;
        this.decay = Math.random() * 0.012 + 0.008;
    }

    update() {
        this.speedY += this.gravity;  // 重力加速
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

        // 绘制五角星形状
        this.drawStarShape(context, 0, 0, 5, this.size, this.size * 0.45);

        // 泛光效果
        context.shadowBlur = 8;
        context.shadowColor = 'rgba(255, 255, 255, 0.9)';

        context.restore();
    }

    /**
     * 绘制五角星路径
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} cx 中心x
     * @param {number} cy 中心y
     * @param {number} spikes 角数
     * @param {number} outerRadius 外半径
     * @param {number} innerRadius 内半径
     */
    drawStarShape(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            // 外角
            let x = cx + Math.cos(rot) * outerRadius;
            let y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            // 内角
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }

        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();

        // 填充白色 + 黑色描边（涂鸦风格）
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// 存储所有掉落星星
const fallingStars = [];

/**
 * 鼠标移动事件 - 生成掉落星星
 */
let lastStarTime = 0;
const starInterval = 80; // 每80ms最多生成一颗

document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastStarTime > starInterval) {
        fallingStars.push(new FallingStar(e.clientX, e.clientY));
        lastStarTime = now;
    }
});

/**
 * 星星动画循环
 */
function animateStars() {
    // 完全清除画布（星星不需要拖尾）
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
    // 初始化背景波点
    initParticles();

    // 启动星星掉落动画
    animateStars();

    console.log('首页交互效果已初始化完成！');
});

// ==================== 窗口大小改变时重置画布 ====================

window.addEventListener('resize', () => {
    resizeCanvas();
});
