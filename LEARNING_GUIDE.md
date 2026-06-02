# 个人作品集首页 - 学习指南

## 项目结构

```
project/
├── index.html          # 页面结构
├── style.css           # 样式和动画
├── script.js           # 交互逻辑
└── LEARNING_GUIDE.md   # 本学习文档
```

---

## 一、HTML 结构原理

### 1.1 语义化标签

```html
<!-- 主容器 -->
<div class="main-container">
    <!-- 标题 -->
    <h1 class="site-title">welcome to my site !</h1>
    
    <!-- 装饰元素 -->
    <div class="star">...</div>
    
    <!-- 主要内容区 -->
    <div class="content-wrapper">
        <!-- 电脑 -->
        <div class="laptop-container">...</div>
        <!-- 便签 -->
        <div class="sticky-note">...</div>
    </div>
</div>
```

**核心概念**：
- **容器嵌套**：外层控制整体布局，内层控制具体元素
- **z-index 层级**：背景(z:1) < 粒子(z:2) < 内容(z:10) < 交互元素(z:20+)
- **ID vs Class**：ID用于JS获取唯一元素，Class用于样式复用

### 1.2 外部资源引入

```html
<!-- Google Fonts - 字体加载 -->
<link href="https://fonts.googleapis.com/css2?family=Darumadrop+One&display=swap" rel="stylesheet">
```

**原理**：
- 浏览器遇到 `<link>` 会并行下载字体文件
- `display=swap` 确保文字先显示默认字体，加载完成后再切换
- 避免"字体闪烁"问题(FOIT - Flash of Invisible Text)

---

## 二、CSS 样式原理

### 2.1 盒模型 (Box Model)

```css
* {
    margin: 0;        /* 外边距 - 元素与其他元素的距离 */
    padding: 0;       /* 内边距 - 内容与边框的距离 */
    box-sizing: border-box;  /* 边框盒模型 - width包含padding和border */
}
```

**两种盒模型对比**：

| 属性 | content-box | border-box |
|------|-------------|------------|
| width计算 | 仅内容宽度 | 内容+padding+border |
| 实际占用 | width + padding + border | 就是width |
| 使用场景 | 需要精确控制内容 | 响应式布局推荐 |

### 2.2 Flexbox 布局

```css
.main-container {
    display: flex;           /* 启用弹性布局 */
    flex-direction: column;  /* 垂直排列 */
    align-items: center;     /* 水平居中 */
    justify-content: center; /* 垂直居中 */
}
```

**Flexbox 核心概念**：

```
┌─────────────────────────────────────┐
│  flex-direction: column             │
│                                     │
│  ┌─────────┐  ← align-items        │
│  │  元素1   │    (水平对齐)          │
│  ├─────────┤                        │
│  │  元素2   │                        │
│  ├─────────┤  ← justify-content     │
│  │  元素3   │    (垂直对齐)          │
│  └─────────┘                        │
│                                     │
└─────────────────────────────────────┘
```

### 2.3 定位系统 (Position)

```css
.star-top-left {
    position: absolute;  /* 绝对定位 */
    top: 15%;           /* 距离顶部15% */
    left: 8%;           /* 距离左侧8% */
}
```

**定位类型对比**：

| 类型 | 参照物 | 是否脱离文档流 |
|------|--------|----------------|
| static | 无 | 否 |
| relative | 自身原位置 | 否 |
| absolute | 最近的position非static祖先 | 是 |
| fixed | 视口 | 是 |
| sticky | 视口+文档流 | 混合 |

### 2.4 CSS 动画原理

#### 关键帧动画 (@keyframes)

```css
@keyframes twinkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(0.95); }
}

.star {
    animation: twinkle 2s ease-in-out infinite;
}
```

**动画属性解析**：

```
animation: [name] [duration] [timing-function] [delay] [iteration-count] [direction]
           twinkle   2s         ease-in-out       0s      infinite          normal
```

**缓动函数 (timing-function)**：
- `linear`：匀速
- `ease`：慢-快-慢（默认）
- `ease-in`：慢开始
- `ease-out`：慢结束
- `ease-in-out`：慢开始慢结束
- `cubic-bezier(x1,y1,x2,y2)`：贝塞尔曲线自定义

#### 过渡动画 (Transition)

```css
.sticky-note {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**触发条件**：当元素的属性值发生变化时自动播放

### 2.5 滤镜效果 (Filter)

```css
.main-container.blur-bg {
    filter: blur(8px) brightness(0.4);
}
```

**常用滤镜**：
- `blur(px)`：高斯模糊
- `brightness(%)`：亮度
- `contrast(%)`：对比度
- `grayscale(%)`：灰度
- `hue-rotate(deg)`：色相旋转
- `drop-shadow()`：投影（与box-shadow不同，支持透明图片）

### 2.6 阴影效果

```css
/* 文字阴影 - 实现描边效果 */
text-shadow: 
    -3px -3px 0 #000,
    3px -3px 0 #000,
    -3px 3px 0 #000,
    3px 3px 0 #000;

/* 盒子阴影 */
box-shadow: 
    0 0 0 2px #333,           /* 内圈 */
    0 10px 40px rgba(0,0,0,0.3); /* 外阴影 */
```

---

## 三、JavaScript 交互原理

### 3.1 DOM 操作

```javascript
// 获取元素
const element = document.getElementById('id');
const elements = document.querySelectorAll('.class');

// 操作类名
element.classList.add('class-name');      // 添加类
element.classList.remove('class-name');   // 移除类
element.classList.toggle('class-name');   // 切换类

// 操作样式
element.style.property = 'value';
```

### 3.2 事件监听

```javascript
element.addEventListener('click', (e) => {
    e.stopPropagation();  // 阻止事件冒泡
    // 处理逻辑
});
```

**事件传播机制**：

```
点击便签时：
┌─────────────┐
│   window    │  ← 捕获阶段（从外到内）
├─────────────┤
│   document  │
├─────────────┤
│     body    │
├─────────────┤
│  container  │
├─────────────┤
│  stickyNote │  ← 目标阶段（实际点击的元素）
├─────────────┤
│  container  │  ← 冒泡阶段（从内到外）
├─────────────┤
│     body    │
└─────────────┘

e.stopPropagation() 阻止继续传播
e.preventDefault() 阻止默认行为
```

### 3.3 定时器

```javascript
// setInterval - 重复执行
const intervalId = setInterval(() => {
    // 每30ms执行一次
}, 30);

// setTimeout - 延迟执行
setTimeout(() => {
    // 200ms后执行一次
}, 200);

// 清除定时器
clearInterval(intervalId);
```

### 3.4 动画循环 (requestAnimationFrame)

```javascript
function animate() {
    // 更新状态
    update();
    // 绘制画面
    draw();
    // 请求下一帧
    requestAnimationFrame(animate);
}

// 启动动画
requestAnimationFrame(animate);
```

**为什么用 requestAnimationFrame 而不是 setInterval？**

| 特性 | requestAnimationFrame | setInterval |
|------|----------------------|-------------|
| 同步显示器 | 是（与刷新率同步） | 否 |
| 节能 | 后台标签自动暂停 | 继续运行 |
| 性能 | 浏览器优化 | 固定间隔 |
| 精度 | 约16.67ms (60fps) | 可自定义 |

### 3.5 面向对象编程 (Class)

```javascript
class Particle {
    constructor() {
        // 初始化属性
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
    }
    
    update() {
        // 更新位置
        this.x += this.speedX;
    }
    
    draw() {
        // 绘制粒子
    }
}

// 创建实例
const particle = new Particle();
```

### 3.6 Canvas 绘图

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 绘制圆形
ctx.beginPath();
ctx.arc(x, y, radius, 0, Math.PI * 2);
ctx.fill();

// 设置样式
ctx.fillStyle = 'color';
ctx.globalAlpha = 0.5;  // 透明度
ctx.shadowBlur = 10;    // 阴影模糊
ctx.shadowColor = 'color';
```

**拖尾效果原理**：

```javascript
// 不清除画布，而是用半透明色覆盖
ctx.fillStyle = 'rgba(245, 197, 24, 0.1)';
ctx.fillRect(0, 0, canvas.width, canvas.height);
```

这样每一帧都会在上一帧基础上叠加，产生渐隐的拖尾效果。

---

## 四、交互效果详解

### 4.1 便签交互流程

```
用户点击便签
    ↓
添加 expanded 类 → 便签右拉展开
    ↓
添加 shift-left 类 → 电脑左移
    ↓
添加 blur-bg 类 → 背景虚化
    ↓
显示 overlay 遮罩层 → 捕获点击事件
    ↓
用户点击其他区域
    ↓
移除所有类 → 恢复原状
```

### 4.2 加载动画原理

```javascript
// 计算每步增量
const duration = 1500;    // 总时长1.5秒
const interval = 30;      // 每30ms更新
const increment = 100 / (duration / interval);  // 每次增加的百分比

// 定时更新
setInterval(() => {
    progress += increment;
    progressBar.style.width = progress + '%';
}, interval);
```

### 4.3 粒子系统原理

```
初始化阶段：
┌─────────────────────────────────────┐
│  创建30个Particle实例                │
│  每个粒子随机位置、大小、速度          │
│  添加到DOM和数组中                    │
└─────────────────────────────────────┘
            ↓
动画循环（每帧）：
┌─────────────────────────────────────┐
│  遍历所有粒子                         │
│  ├─ 更新位置 (x += speedX)          │
│  ├─ 边界检测                         │
│  └─ 应用到DOM                        │
│  requestAnimationFrame(下一轮)       │
└─────────────────────────────────────┘
```

---

## 五、响应式设计

### 5.1 媒体查询

```css
@media (max-width: 768px) {
    /* 屏幕宽度小于768px时生效 */
    .laptop {
        width: 320px;
    }
}
```

**断点选择**：
- 320px：手机竖屏
- 768px：平板
- 1024px：小桌面
- 1440px：大桌面

### 5.2 相对单位

| 单位 | 相对对象 | 使用场景 |
|------|----------|----------|
| px | 无（绝对单位） | 边框、阴影 |
| % | 父元素 | 宽度、高度 |
| rem | 根元素字体大小 | 字体、间距 |
| em | 当前元素字体大小 | 组件内部 |
| vh/vw | 视口 | 全屏布局 |

---

## 六、性能优化

### 6.1 动画性能

**GPU加速属性**（优先使用）：
- `transform`（位移、旋转、缩放）
- `opacity`（透明度）

**触发重排的属性**（避免动画中使用）：
- `width`、`height`、`top`、`left`
- `margin`、`padding`
- `display`

### 6.2 节流与防抖

```javascript
// 节流 - 限制执行频率
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 使用
window.addEventListener('scroll', throttle(handleScroll, 100));
```

---

## 七、学习路径建议

### 初学者
1. 理解 HTML 标签和属性
2. 掌握 CSS 选择器和基本样式
3. 学习 Flexbox 布局
4. 了解 JavaScript 基础语法
5. 练习 DOM 操作

### 进阶
1. 深入 CSS 动画和过渡
2. 学习 Canvas 绘图
3. 掌握事件机制和事件委托
4. 了解浏览器渲染原理
5. 学习性能优化技巧

### 高级
1. 学习 WebGL / Three.js
2. 掌握 CSS Houdini
3. 了解 Web Animations API
4. 学习设计模式在UI中的应用

---

## 八、调试技巧

### Chrome DevTools

1. **Elements 面板**：查看和修改DOM/CSS
2. **Console 面板**：执行JavaScript，查看日志
3. **Sources 面板**：断点调试
4. **Network 面板**：查看资源加载
5. **Performance 面板**：性能分析

### 常用调试代码

```javascript
// 查看元素位置
console.log(element.getBoundingClientRect());

// 监听所有点击事件
document.addEventListener('click', (e) => {
    console.log('Clicked:', e.target);
});

// 性能计时
console.time('operation');
// ... 代码
console.timeEnd('operation');
```

---

## 九、扩展阅读

- [MDN Web Docs](https://developer.mozilla.org/zh-CN/)
- [CSS-Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)
- [Can I use](https://caniuse.com/) - 浏览器兼容性查询

---

*祝学习愉快！*
