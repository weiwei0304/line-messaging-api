// check-image.js

const path = require('path');
const fs = require('fs');

// 定義圖片路徑
const imagePath = path.join(__dirname, '..', 'src', 'image', 'richmenu.png');

console.log('Image path:', imagePath);

// 讀取圖片文件
fs.readFile(imagePath, (err, data) => {
  if (err) {
    console.error('Error reading image:', err);
  } else {
    console.log('Image read successfully.');
    // 在這裡可以做更進一步的處理，例如顯示圖片大小、類型等信息
  }
});
