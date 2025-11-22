
const { WebSocketServer } = require('ws');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Config
const PORT = process.env.PORT || 8080;
const DB_FILE = path.join(__dirname, 'database.json');
const MONGO_URI = process.env.MONGO_URI; // Connection String from Cloud

// Server Instance
const server = require('http').createServer((req, res) => {
    res.writeHead(200);
    res.end('LernCasino Backend is running!');
});
const wss = new WebSocketServer({ server });

// --- DATABASE LAYER ---
let db = { users: {} };
let dbClient = null;
let usersCollection = null;

async function initDB() {
    if (MONGO_URI) {
        try {
            console.log("🔗 Connecting to MongoDB...");
            dbClient = new MongoClient(MONGO_URI);
            await dbClient.connect();
            const database = dbClient.db('lerncasino');
            usersCollection = database.collection('users');
            console.log("✅ Connected to MongoDB Cloud");
        } catch (e) {
            console.error("❌ MongoDB Connection Error:", e);
        }
    } else {
        console.log("📂 Using Local File System (database.json)");
        loadLocalDB();
    }
}

// Load Local DB
function loadLocalDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(data);
    } else {
        saveLocalDB();
    }
  } catch (e) {
    console.error('⚠️ Error loading local DB:', e);
  }
}

function saveLocalDB() {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Save DB (Router)
async function saveUser(username, stats) {
    if (usersCollection) {
        // Cloud Save
        try {
            await usersCollection.updateOne(
                { username }, 
                { $set: { stats, lastSeen: new Date() } }, 
                { upsert: true }
            );
        } catch(e) {
            console.error("Save Error", e);
        }
    } else {
        // Local Save
        db.users[username] = stats;
        saveLocalDB();
    }
}

async function getUser(username) {
    if (usersCollection) {
        try {
            const doc = await usersCollection.findOne({ username });
            return doc ? doc.stats : null;
        } catch(e) {
            console.error("Get User Error", e);
            return null;
        }
    } else {
        return db.users[username] || null;
    }
}

initDB();

// --- SOCKET LOGIC ---

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      // 1. LOGIN REQUEST
      if (data.type === 'LOGIN') {
        const username = data.username;
        ws.username = username; 
        
        console.log(`🔑 User logged in: ${username}`);

        let userStats = await getUser(username);

        if (!userStats) {
           // Create New User
           userStats = {
               xp: 1250,
               coins: 1500,
               streak: 1,
               hearts: 5,
               maxHearts: 5,
               level: 4,
               inventory: ['skin_novice_student', 'skin_freshman_lily'],
               equippedSkin: 'skin_novice_student',
               weakTopics: []
           };
           await saveUser(username, userStats);
        }
        
        ws.send(JSON.stringify({
            type: 'INIT_STATE',
            stats: userStats
        }));
      }

      // 2. UPDATE STATS
      if (data.type === 'UPDATE_STATS') {
         if (ws.username && data.stats) {
             await saveUser(ws.username, data.stats);
         }
      }

      // 3. CHAT
      if (data.id && data.text) { 
        wss.clients.forEach(client => {
           if (client !== ws && client.readyState === 1) {
               client.send(JSON.stringify(data));
           }
        });
      }

    } catch (e) {
      console.error('Error processing message:', e);
    }
  });

  // Keep-alive mechanism for Render
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
});

// Heartbeat interval
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
});

server.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});
