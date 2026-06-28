// generate-gallery.js
// 扫描三个文件夹，自动生成 graphic.html
// 运行方式：在项目根目录打开终端，输入 node generate-gallery.js

const fs = require('fs');
const path = require('path');

// ============ 配置区（按你的实际情况修改） ============
const config = {
    output: 'graphic.html',
    pageTitle: '平面设计',
    pageSubtitle: '海报 / 绘画 / 版式设计',
    categories: [
        {
            title: '海报设计',
            folder: 'images/graphic/posters',   // 海报图片放这里
        },
        {
            title: '绘画作品',
            folder: 'images/graphic/illustrations', // 绘画图片放这里
        },
        {
            title: '版式设计',
            folder: 'images/graphic/layouts',    // 版式图片放这里
        },
    ],
};

const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// ============ 工具函数：读取文件夹下所有图片 ============
function scanImages(folder) {
    if (!fs.existsSync(folder)) {
        console.log(`⚠️  文件夹不存在: ${folder}，跳过`);
        return [];
    }
    return fs.readdirSync(folder)
        .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
        .map(file => ({
            src: `${folder}/${file}`,
            name: path.basename(file, path.extname(file)),
        }));
}

// ============ 生成单个分类区块的 HTML ============
function generateCategorySection(category) {
    const images = scanImages(category.folder);
    
    if (images.length === 0) {
        return `
            <!-- ${category.title}：暂无图片 -->
            <div class="category-section">
                <h2 class="category-title">${category.title}</h2>
                <p style="color: #999; font-size: 14px;">暂无作品，敬请期待。</p>
            </div>`;
    }

    const items = images.map(img => `
                    <div class="work-item">
                        <img src="${img.src}" alt="${img.name}">
                        <div class="work-overlay">
                            <h3>${img.name}</h3>
                        </div>
                    </div>`).join('\n');

    return `
            <!-- ${category.title}：${images.length} 张 -->
            <div class="category-section">
                <h2 class="category-title">${category.title}</h2>
                <div class="work-grid">
${items}
                </div>
            </div>`;
}

// ============ 组装完整 HTML ============
const sections = config.categories.map(cat => generateCategorySection(cat)).join('\n');
const totalImages = config.categories.reduce((sum, cat) => sum + scanImages(cat.folder).length, 0);

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.pageTitle} · LEYANG ZHANG</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <nav>
        <div class="nav-inner">
            <div class="nav-logo">
                <a href="index.html">LEYANG ZHANG</a>
            </div>
            <button class="menu-toggle">☰</button>
            <ul class="nav-links">
                <li><a href="index.html">主页</a></li>
                <li><a href="zhiwu.html">植悟</a></li>
                <li><a href="graphic.html" class="active">平面</a></li>
                <li><a href="photo.html">摄影</a></li>
                <li><a href="print.html">物料</a></li>
            </ul>
        </div>
    </nav>

    <div class="main-content">
        <div class="container">
            <h1 class="page-title">${config.pageTitle}</h1>
            <p class="page-subtitle">${config.pageSubtitle}</p>

${sections}

        </div>
    </div>

    <footer>
        © 2024 Leyang Zhang. All Rights Reserved.
    </footer>

    <script src="script.js"></script>
</body>
</html>`;

fs.writeFileSync(config.output, html, 'utf-8');
console.log(`✅ 已生成 ${config.output}`);
console.log(`📊 海报: ${scanImages(config.categories[0].folder).length} 张`);
console.log(`📊 绘画: ${scanImages(config.categories[1].folder).length} 张`);
console.log(`📊 版式: ${scanImages(config.categories[2].folder).length} 张`);
console.log(`📊 共计: ${totalImages} 张`);