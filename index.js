const express = require('express');
const line = require('@line/bot-sdk');
const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create LINE client
const client = new line.Client(config);

// Ford Knowledge Base (JSON format - easily editable)
const fordKnowledgeBase = {
  "models": {
    "everest": {
      "name": "Ford Everest",
      "price": "1,599,000 - 1,899,000 บาท",
      "engine": "2.0L Turbo Diesel",
      "fuel": "ประหยัดน้ำมัน 12-14 กม./ลิตร",
      "features": ["7 ที่นั่ง", "4WD", "ระบบ SYNC 4A", "เซนเซอร์ถอยหลัง", "ระบบเบรก ABS"],
      "suitable": "ครอบครัวใหญ่ ชอบเดินทางไกล ต้องการความปลอดภัยสูง"
    },
    "ranger": {
      "name": "Ford Ranger",
      "price": "659,000 - 1,359,000 บาท",
      "engine": "2.0L Turbo หรือ 2.0L Bi-Turbo",
      "fuel": "ประหยัดน้ำมัน 10-12 กม./ลิตร",
      "features": ["กระบะ 4 ประตู", "4WD", "ขุมพลัง Bi-Turbo", "ระบบ SYNC 3", "กันชนหน้าเหล็ก"],
      "suitable": "ธุรกิจขนส่ง ชอบออฟโรด ต้องการรถทนทาน"
    },
    "territory": {
      "name": "Ford Territory",
      "price": "1,199,000 - 1,399,000 บาท",
      "engine": "1.5L EcoBoost Turbo",
      "fuel": "ประหยัดน้ำมัน 13-15 กม./ลิตร",
      "features": ["7 ที่นั่ง", "ระบบ Co-Pilot 360", "จอสัมผัส 12 นิ้ว", "เซนเซอร์รอบคัน", "ระบบช่วยจอดรถอัตโนมัติ"],
      "suitable": "ครอบครัวสมัยใหม่ ชอบเทคโนโลยี ใช้ในเมือง"
    },
    "focus": {
      "name": "Ford Focus",
      "price": "999,000 - 1,199,000 บาท",
      "engine": "1.5L EcoBoost",
      "fuel": "ประหยัดน้ำมัน 14-16 กม./ลิตร",
      "features": ["5 ที่นั่ง", "ระบบ SYNC 3", "เซนเซอร์ถอยหลัง", "ระบบเบรก ABS", "ไฟ LED"],
      "suitable": "วัยรุ่น ครอบครัวเล็ก ใช้ในเมือง ต้องการความประหยัด"
    }
  },
  "services": {
    "warranty": "ประกันรถยนต์ 3 ปี หรือ 100,000 กิโลเมตร",
    "maintenance": "บริการ
