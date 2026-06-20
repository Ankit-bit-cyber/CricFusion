const MatchDiscussion = require('../models/MatchDiscussion');

const onlineUsers = new Map(); // userId -> socketId

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Join personal room for notifications
        socket.on('join', (userId) => {
            if (userId) {
                socket.join(userId);
                onlineUsers.set(userId, socket.id);
                io.emit('onlineUsers', Array.from(onlineUsers.keys()));
            }
        });

        // Join match discussion room
        socket.on('joinMatch', (matchId) => {
            socket.join(`match:${matchId}`);
        });

        // Leave match discussion room
        socket.on('leaveMatch', (matchId) => {
            socket.leave(`match:${matchId}`);
        });

        // Real-time match discussion message
        socket.on('matchMessage', async ({ matchId, userId, message }) => {
            try {
                const msg = await MatchDiscussion.create({ matchId, userId, message });
                const populated = await MatchDiscussion.findById(msg._id).populate('userId', 'name avatar');
                io.to(`match:${matchId}`).emit('newMatchMessage', populated);
            } catch (error) {
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Typing indicator
        socket.on('typing', ({ matchId, userName }) => {
            socket.to(`match:${matchId}`).emit('userTyping', { userName });
        });

        socket.on('disconnect', () => {
            onlineUsers.forEach((socketId, userId) => {
                if (socketId === socket.id) onlineUsers.delete(userId);
            });
            io.emit('onlineUsers', Array.from(onlineUsers.keys()));
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};

module.exports = socketHandler;