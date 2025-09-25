/**
 * PixelBox.js - 一个简单的像素绘图库
 */
class PixelBox {
    constructor(canvasId, width, height, pixelSize = 4) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.pixelSize = pixelSize;
        
        // 设置画布实际尺寸
        this.canvas.width = width * pixelSize;
        this.canvas.height = height * pixelSize;
        
        // 创建像素缓冲区
        this.pixels = new Array(width * height).fill('#000000');
        
        // 清空画布
        this.clear();
    }
    
    // 清除画布
    clear(color = '#000000') {
        this.pixels.fill(color);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    // 设置像素颜色
    setPixel(x, y, color) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            const index = y * this.width + x;
            this.pixels[index] = color;
            
            // 绘制像素
            this.ctx.fillStyle = color;
            this.ctx.fillRect(
                x * this.pixelSize,
                y * this.pixelSize,
                this.pixelSize,
                this.pixelSize
            );
        }
    }
    
    // 获取像素颜色
    getPixel(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            const index = y * this.width + x;
            return this.pixels[index];
        }
        return null;
    }
    
    // 绘制矩形
    drawRect(x, y, width, height, color) {
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                this.setPixel(x + dx, y + dy, color);
            }
        }
    }
    
    // 绘制线段（使用Bresenham算法）
    drawLine(x1, y1, x2, y2, color) {
        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);
        let sx = (x1 < x2) ? 1 : -1;
        let sy = (y1 < y2) ? 1 : -1;
        let err = dx - dy;
        
        while (true) {
            this.setPixel(x1, y1, color);
            
            if (x1 === x2 && y1 === y2) break;
            
            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
        }
    }
    
    // 绘制圆形
    drawCircle(x0, y0, radius, color) {
        let x = radius;
        let y = 0;
        let err = 0;
        
        while (x >= y) {
            this.setPixel(x0 + x, y0 + y, color);
            this.setPixel(x0 + y, y0 + x, color);
            this.setPixel(x0 - y, y0 + x, color);
            this.setPixel(x0 - x, y0 + y, color);
            this.setPixel(x0 - x, y0 - y, color);
            this.setPixel(x0 - y, y0 - x, color);
            this.setPixel(x0 + y, y0 - x, color);
            this.setPixel(x0 + x, y0 - y, color);
            
            if (err <= 0) {
                y += 1;
                err += 2 * y + 1;
            }
            if (err > 0) {
                x -= 1;
                err -= 2 * x + 1;
            }
        }
    }
    
    // 绘制精灵（像素数组）
    drawSprite(x, y, sprite) {
        const spriteWidth = sprite[0].length;
        const spriteHeight = sprite.length;
        
        for (let dy = 0; dy < spriteHeight; dy++) {
            for (let dx = 0; dx < spriteWidth; dx++) {
                const color = sprite[dy][dx];
                if (color !== 'transparent') {
                    this.setPixel(x + dx, y + dy, color);
                }
            }
        }
    }
    
    // 添加键盘事件监听
    onKeyDown(callback) {
        document.addEventListener('keydown', callback);
    }
    
    // 添加鼠标点击事件监听
    onMouseClick(callback) {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / this.pixelSize);
            const y = Math.floor((e.clientY - rect.top) / this.pixelSize);
            callback(x, y);
        });
    }
}