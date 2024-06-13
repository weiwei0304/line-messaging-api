const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Line Messaging API 設定
const CHANNEL_ACCESS_TOKEN =
  '+GUv+rFSwTf1xQJYwju9xd1CviHS5TS6XgUxuusYDZtUOgqaKGyywF68/al2fonGdzbeodUtv/E93rHdXnnQwP2KAjv3rruIK9xSC9ePOZFaEexQi+196ItEemA33B4CPMEt5ugIcoPFPU2J7UXEoQdB04t89/1O/w1cDnyilFU=';

app.use(express.json());

// 建立 Rich Menu
async function createRichMenu() {
  try {
    const richMenuData = {
      size: {
        width: 2500,
        height: 1686,
      },
      selected: false,
      name: 'Test the default rich menu',
      chatBarText: '點我看更多',
      areas: [
        {
          bounds: {
            x: 0,
            y: 0,
            width: 1666,
            height: 1686,
          },
          action: {
            type: 'uri',
            label: 'Tap area A',
            uri: 'https://developers.line.biz/en/news/',
          },
        },
        {
          bounds: {
            x: 1667,
            y: 0,
            width: 834,
            height: 843,
          },
          action: {
            type: 'uri',
            label: 'Tap area B',
            uri: 'https://lineapiusecase.com/en/top.html',
          },
        },
        {
          bounds: {
            x: 1667,
            y: 844,
            width: 834,
            height: 843,
          },
          action: {
            type: 'uri',
            label: 'Tap area C',
            uri: 'https://techblog.lycorp.co.jp/en/',
          },
        },
      ],
    };

    const response = await axios.post(
      'https://api.line.me/v2/bot/richmenu',
      richMenuData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );

    console.log('Rich Menu created:', response.data.richMenuId);
    return response.data.richMenuId;
  } catch (error) {
    console.error('Error creating Rich Menu:', error.response.data);
    throw error;
  }
}

// 上傳 Rich Menu 圖片
async function uploadRichMenuImage(richMenuId, imagePath) {
  try {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`File not found: ${imagePath}`);
    }

    const imageBuffer = fs.readFileSync(imagePath);

    const response = await axios.post(
      `https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`,
      imageBuffer,
      {
        headers: {
          'Content-Type': 'image/png',
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );

    console.log('Rich Menu image successfully uploaded:', response.data);
  } catch (error) {
    console.error('Error uploading Rich Menu image:', error.response.data);
    throw error;
  }
}

// 設置 Rich Menu 為預設
async function setRichMenuAsDefault(richMenuId) {
  try {
    const response = await axios.post(
      `https://api.line.me/v2/bot/user/all/richmenu/${richMenuId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );

    console.log('Rich Menu successfully set as default:', response.data);
  } catch (error) {
    console.error('Error setting Rich Menu as default:', error.response.data);
    throw error;
  }
}

// 設置 Rich Menu
async function setupRichMenu() {
  try {
    // 建立 Rich Menu
    const richMenuId = await createRichMenu();

    // 定義圖片路徑
    const imagePath = path.join(
      __dirname,
      '..',
      'src',
      'image',
      'richmenu.png'
    );

    // 上傳 Rich Menu 圖片
    await uploadRichMenuImage(richMenuId, imagePath);

    // 設置 Rich Menu 為預設
    await setRichMenuAsDefault(richMenuId);

    console.log('Rich Menu setup completed.');
  } catch (error) {
    console.error('Error setting up Rich Menu:', error);
  }
}

// 啟動應用程式
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  setupRichMenu();
});
