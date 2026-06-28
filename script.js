// ========== 移动端菜单切换 ==========
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    // 点击导航链接后自动收起菜单
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
        });
    });
}

// ========== 当前页面导航高亮 ==========
(function() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        const href = link.getAttribute('href');
        // 精确匹配或处理首页情况
        if (currentPath.endsWith(href) || 
            (currentPath.endsWith('/') && href === 'index.html') ||
            (currentPath.endsWith('/index.html') && href === 'index.html')) {
            link.classList.add('active');
        }
    });
})();

// ========== 图片渐显动画 (Intersection Observer) ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 为所有作品图片添加入场动画
document.querySelectorAll('.work-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
});

console.log('✦ 作品集已就绪');
// ========== 灯箱功能 ==========
(function() {
    // 创建灯箱 DOM（动态插入页面）
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <span class="lightbox-prev">&#8249;</span>
        <span class="lightbox-next">&#8250;</span>
        <img src="" alt="">
        <span class="lightbox-counter"></span>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');

    let currentGroup = [];   // 当前灯箱里的图片组
    let currentIndex = 0;

    // 给所有 work-item 里的图片绑定点击事件
    function bindLightbox() {
        // 每个 .work-grid 视为一组
        const grids = document.querySelectorAll('.work-grid');
        
        grids.forEach(grid => {
            const items = grid.querySelectorAll('.work-item img');
            const groupArray = Array.from(items).map(img => img.src);

            items.forEach((img, index) => {
                img.style.cursor = 'pointer';
                img.addEventListener('click', () => {
                    currentGroup = groupArray;
                    currentIndex = index;
                    showImage();
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden'; // 禁止背景滚动
                });
            });
        });
    }

    function showImage() {
        lightboxImg.src = currentGroup[currentIndex];
        lightboxCounter.textContent = `${currentIndex + 1} / ${currentGroup.length}`;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % currentGroup.length;
        showImage();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
        showImage();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 事件监听
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox(); // 点击黑色背景关闭
    });
    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);

    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // 初始化绑定
    bindLightbox();
    window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});
})();