import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (for testing only)
    methods: ["GET", "POST"],
  },
});

// Helper function to send notifications
const sendNotification = (userId: string, title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
  const notification = {
    id: Date.now().toString(),
    title,
    message,
    type,
    read: false,
    createdAt: new Date()
  };
  
  io.to(userId).emit('notification', notification);
  console.log(`Notification sent to user ${userId}:`, notification);
};

interface Message {
  chatId: string;
  sender: string;
  content: string;
}

interface SkillSwapData {
  fromUserId: string;
  toUserId: string;
  skill: string;
}

interface ProfileUpdateData {
  userId: string;
  followers: string[];
}

interface MessageReadData {
  chatId: string;
  userId: string;
  messageId: string;
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Chat functionality
  socket.on("joinChat", (chatId: string) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat room: ${chatId}`);
  });

  socket.on("sendMessage", (message: Message) => {
    console.log('Message received:', message);
    io.to(message.chatId).emit("receiveMessage", message);
    console.log('Message emitted to room:', message.chatId);

    // Send notification to other chat participants
    const otherParticipants = message.chatId.split('-').filter((id: string) => id !== message.sender);
    otherParticipants.forEach((userId: string) => {
      sendNotification(
        userId,
        'New Message',
        `${message.sender} sent you a message`,
        'info'
      );
    });
  });

  socket.on("typing", (data: { chatId: string; userId: string }) => {
    io.to(data.chatId).emit("typing", data);
  });

  // Notification functionality
  socket.on("join", (userId: string) => {
    socket.join(userId);
  });

  // Skill swap request notifications
  socket.on("skillSwapRequest", (data: SkillSwapData) => {
    const { fromUserId, toUserId, skill } = data;
    sendNotification(
      toUserId,
      'New Skill Swap Request',
      `${fromUserId} wants to learn ${skill} from you`,
      'info'
    );
  });

  // Skill swap accepted notifications
  socket.on("skillSwapAccepted", (data: SkillSwapData) => {
    const { fromUserId, toUserId, skill } = data;
    sendNotification(
      fromUserId,
      'Skill Swap Accepted',
      `${toUserId} accepted your request to learn ${skill}`,
      'success'
    );
  });

  // Skill swap rejected notifications
  socket.on("skillSwapRejected", (data: SkillSwapData) => {
    const { fromUserId, toUserId, skill } = data;
    sendNotification(
      fromUserId,
      'Skill Swap Rejected',
      `${toUserId} declined your request to learn ${skill}`,
      'warning'
    );
  });

  // Profile update notifications
  socket.on("profileUpdated", (data: ProfileUpdateData) => {
    const { userId, followers } = data;
    followers.forEach((followerId: string) => {
      sendNotification(
        followerId,
        'Profile Update',
        `${userId} updated their profile`,
        'info'
      );
    });
  });

  // New follower notifications
  socket.on("newFollower", (data: { userId: string; followerId: string }) => {
    const { userId, followerId } = data;
    sendNotification(
      userId,
      'New Follower',
      `${followerId} started following you`,
      'success'
    );
  });

  // Message read notifications
  socket.on("messageRead", (data: MessageReadData) => {
    const { chatId, userId, messageId } = data;
    const otherParticipants = chatId.split('-').filter((id: string) => id !== userId);
    otherParticipants.forEach((participantId: string) => {
      sendNotification(
        participantId,
        'Message Read',
        `${userId} read your message`,
        'info'
      );
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Add test notification endpoint
app.get('/test-notification/:userId', (req, res) => {
  const { userId } = req.params;
  console.log('Test notification requested for user:', userId);
  
  sendNotification(
    userId,
    'Test Notification',
    'This is a test notification message',
    'info'
  );
  
  res.json({ success: true, message: 'Test notification sent' });
});

server.listen(4000, () => console.log("Server running on port 4000"));
