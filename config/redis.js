const redis = require('redis');

// Initialize the client
const redisClient = redis.createClient({
    // If you have a password or custom port, add it here:
    // url: 'redis://alice:foobared@awesome.redis.server:6380'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis
(async () => {
    try {
        await redisClient.connect();
        console.log("🚀 Connected to Redis Successfully");
    } catch (err) {
        console.error("❌ Could not connect to Redis", err);
    }
})();

module.exports = redisClient;