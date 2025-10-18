# 🎵 DC Spider Music Bot

Premium Discord music bot ဖြင့် **SoundCloud streaming**, audio filters, 24/7 playback နှင့် web dashboard တို့ပါဝင်သည်။

## ✨ Features

### 🎵 Core Music Features
- **SoundCloud Streaming** - High quality, no authentication required 🎧
- **Zero Setup** - No API keys or cookies needed
- **Playlist Support** - Play entire SoundCloud playlists
- **Queue Management** - Unlimited queue with full control
- **Loop Modes** - Loop off/song/queue
- **Volume Control** - 0-100% adjustable volume
- **Shuffle** - Randomize queue order
- **Skip/Remove** - Full queue control

### 🎛️ Advanced Features
- **🎮 Interactive Buttons** - Complete dashboard with clickable buttons for all controls
- **Auto-play** - Queue ကုန်သွားရင် related သီချင်းများ အလိုအလျောက် ဆက်ဖွင့်မည် 🎵
- **Audio Filters** - Bassboost, Nightcore, Vaporwave, 8D, Karaoke
- **Vote Skip System** - Democratic song skipping
- **24/7 Mode** - Keep bot in voice channel
- **Auto Disconnect** - Smart disconnect when inactive
- **Dual Command System** - Both slash (/) and prefix (!) commands
- **Web Dashboard** - Real-time monitoring and control

### 🌐 Web Dashboard
- Real-time statistics
- Live queue display
- Now playing visualization
- Server activity monitoring
- Beautiful glassmorphism UI

## 📦 Installation

### Prerequisites
- Node.js 18.x သို့မဟုတ် ပိုမြင့်သော version
- npm သို့မဟုတ် yarn
- Discord Bot Token
- FFmpeg (audio processing အတွက်)
- **API keys မလိုပါ** - SoundCloud အလိုအလျောက် အလုပ်လုပ်ပါတယ်! 🎉

### Setup

1. **Repository ကို clone လုပ်ပါ**
```bash
git clone https://github.com/yourusername/dcspider.git
cd dcspider
```

2. **Dependencies များ install လုပ်ပါ**
```bash
npm install
```

3. **Environment variables များကို configure လုပ်ပါ**
```bash
cp .env.example .env
```

`.env` file ကို edit လုပ်ပြီး သင့် configuration များ ထည့်ပါ:
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
PREFIX=!
WEB_PORT=3000
```

4. **TypeScript ကို compile လုပ်ပါ**
```bash
npm run build
```

5. **Slash commands များကို register လုပ်ပါ**
```bash
npm run register
```

6. **Bot ကို စတင်ပါ**
```bash
npm start
```

Development mode အတွက်:
```bash
npm run dev
```

## 🎮 Commands

### Music Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/play <song>` | သီချင်း ဖွင့်ပါ (SoundCloud) | `/play despacito` |
| `/pause` | ခဏရပ်ပါ | `/pause` |
| `/resume` | ပြန်ဖွင့်ပါ | `/resume` |
| `/skip` | နောက်သီချင်း ကျော်ပါ | `/skip` |
| `/stop` | ရပ်ပြီး queue ရှင်းပါ | `/stop` |
| `/queue [page]` | သီချင်းစာရင်း ကြည့်ပါ | `/queue 1` |
| `/nowplaying` | လက်ရှိသီချင်း ကြည့်ပါ | `/nowplaying` |
| `/volume <0-100>` | အသံချိန်ညှိပါ | `/volume 80` |
| `/loop <mode>` | Loop mode ပြောင်းပါ | `/loop song` |
| `/shuffle` | Queue ကို ရောထွေးပါ | `/shuffle` |
| `/remove <position>` | သီချင်းဖယ်ပါ | `/remove 3` |
| `/filter <type>` | Audio filter ထည့်ပါ | `/filter bassboost` |
| `/autoplay` | Auto-play toggle | `/autoplay` |
| `/dashboard` | 🎮 **Interactive control panel** | `/dashboard` |
| `/247` | 24/7 mode toggle | `/247` |
| `/voteskip` | Skip vote | `/voteskip` |

### Utility Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/help` | Commands စာရင်း | `/help` |
| `/ping` | Bot latency | `/ping` |

### Prefix Commands

Slash commands အားလုံးကို prefix `!` ဖြင့်လည်း အသုံးပြုနိုင်ပါသည်:
```
!play <song>
!pause
!skip
!queue
```

## 🎛️ Audio Filters

Available filters:
- **Bassboost** - Enhanced bass
- **Nightcore** - Faster, higher pitch
- **Vaporwave** - Slower, lower pitch
- **8D Audio** - Surround sound effect
- **Karaoke** - Reduced vocals

## 🌐 Web Dashboard

Web dashboard ကို `http://localhost:3000` တွင် ဖွင့်ကြည့်နိုင်ပါသည်။

Features:
- Real-time server statistics
- Active queue monitoring
- Now playing information
- Uptime tracking
- Beautiful responsive design

## ⚙️ Configuration

`.env` file တွင် configure လုပ်နိုင်သော options များ:

```env
# Discord
DISCORD_TOKEN=your_token
CLIENT_ID=your_client_id

# Bot Settings
PREFIX=!
MAX_QUEUE_SIZE=100

# Web Dashboard
WEB_PORT=3000
WEB_ENABLED=true

# Audio
AUDIO_QUALITY=high
DEFAULT_VOLUME=50

# Features
ENABLE_FILTERS=true
ENABLE_LYRICS=true
ENABLE_VOTING=true
AUTO_DISCONNECT_TIME=300000

# 24/7 Mode
DEFAULT_247_MODE=false
```

## 🚀 Deployment

### Cloud Platforms

#### Render.com (Recommended) ⭐

အလွယ်ဆုံး deployment option - Free tier available!

**📖 [Complete Render Deployment Guide →](RENDER_DEPLOYMENT.md)**

Quick steps:
1. GitHub repository ကို connect လုပ်ပါ
2. Build command: `npm install && npm run build && npm run register`
3. Environment variables ထည့်ပါ
4. Deploy button နှိပ်ပါ
5. ✅ Done! Auto-redeploy on push

**Features:**
- ✅ Auto-deploy from GitHub
- ✅ Free tier (750 hrs/month)
- ✅ Easy rollback
- ✅ Built-in logs & monitoring

#### Other Options

**Heroku, Railway, DigitalOcean** - [See DEPLOYMENT.md](DEPLOYMENT.md)

### VPS/Dedicated Server

1. Install Node.js နှင့် FFmpeg
2. Clone repository
3. Install dependencies
4. Configure `.env`
5. Build project: `npm run build`
6. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start dist/index.js --name dcspider-bot
pm2 save
pm2 startup
```

**📖 [Full VPS Guide →](DEPLOYMENT.md)**

### Docker

```bash
# Quick start with Docker
docker-compose up -d
```

**📖 [Docker Guide →](DEPLOYMENT.md#docker-deployment)**

## 📚 Documentation

- **[SoundCloud Setup Guide](./SOUNDCLOUD_SETUP.md)** - အလိုအလျောက် initialization (config မလိုပါ!)
- **[Interactive Buttons Guide](./BUTTONS.md)** - Button controls နှင့် အသုံးပြုနည်း
- **[Auto-play Guide](./AUTOPLAY.md)** - Auto-play feature အသေးစိတ်
- **[Filter Guide](./FILTER_GUIDE.md)** - Audio filter documentation
- **[Deployment Guides](./RENDER_DEPLOYMENT.md)** - Render, VPS, Docker deployment

## 🔧 Troubleshooting

### Bot ကို voice channel သို့ ဝင်၍မရပါ
- Bot တွင် Voice permissions ရှိမရှိ စစ်ဆေးပါ
- Voice channel ၏ user limit ပြည့်မနေပါစေနှင့်

### Audio ဖွင့်၍မရပါ
- FFmpeg installed ရှိမရှိ စစ်ဆေးပါ: `ffmpeg -version`
- Internet connection ကောင်းမကောင်း စစ်ဆေးပါ

### Commands များ မမြင်ရပါ
- Slash commands register လုပ်ပြီးပြီလား: `npm run register`
- Bot တွင် application.commands permission ရှိမရှိ စစ်ဆေးပါ

### SoundCloud "client_id" error
- Bot ကို restart လုပ်ပါ - SoundCloud initialization အလိုအလျောက် ပြန်လုပ်ပါမည်
- Startup logs ကြည့်ပါ: `✅ SoundCloud initialized successfully` ပေါ်ရပါမည်
- အသေးစိတ်: [SOUNDCLOUD_SETUP.md](./SOUNDCLOUD_SETUP.md) ဖတ်ပါ

## 📝 License

MIT License - အသုံးပြုရန် လွတ်လပ်သည်

## 🤝 Contributing

Contributions များကို ကြိုဆိုပါသည်! Pull requests များ ဖန်တီးနိုင်ပါသည်။

## 📧 Support

Issues များ ရှိပါက GitHub Issues တွင် တင်ပြနိုင်ပါသည်။

## 🎉 Credits

Built with:
- [Discord.js](https://discord.js.org/)
- [play-dl](https://github.com/play-dl/play-dl)
- [@discordjs/voice](https://discord.js.org/#/docs/voice/main/general/welcome)
- [Express](https://expressjs.com/)
- [Socket.io](https://socket.io/)

---

Made with ❤️ for the Discord community

# eragsdf
# eragsdf
# eragsdf
