const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Line Messaging API access token
const CHANNEL_ACCESS_TOKEN =
  '+GUv+rFSwTf1xQJYwju9xd1CviHS5TS6XgUxuusYDZtUOgqaKGyywF68/al2fonGdzbeodUtv/E93rHdXnnQwP2KAjv3rruIK9xSC9ePOZFaEexQi+196ItEemA33B4CPMEt5ugIcoPFPU2J7UXEoQdB04t89/1O/w1cDnyilFU=';

app.use(bodyParser.json());

// 處理line messaging API webhook請求
app.post('/webhook', async (req, res) => {
  const events = req.body.events;

  // 處理事件區
  for (const event of events) {
    if (event.type === 'follow') {
      console.log('User ID:', event.source.userId);

      // 加入好友，發送預設訊息
      await sendDefaultMessage(event.source.userId);
    }
  }

  res.sendStatus(200);
});

// 發送預設消息
const sendDefaultMessage = async (userId) => {
  try {
    const response = await axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: userId,
        messages: [
          //文字+emoji訊息
          {
            type: 'text',
            text: '歡迎加入膂盟萌萌噠',
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );

    console.log('Default message sent:', response.data);
  } catch (error) {
    console.error('Error sending default message:', error);
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
