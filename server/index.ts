import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors());
app.use(express.json());

// Initialize Socket.IO with CORS options
const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['polling', 'websocket'],
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000
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

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Chat functionality
  socket.on("joinChat", (chatId: string) => {
    try {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat room: ${chatId}`);
    } catch (error) {
      console.error('Error joining chat:', error);
    }
  });

  socket.on("sendMessage", (message: Message) => {
    try {
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
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on("typing", (data: { chatId: string; userId: string }) => {
    try {
      io.to(data.chatId).emit("typing", data);
    } catch (error) {
      console.error('Error handling typing status:', error);
    }
  });

  // Notification functionality
  socket.on("join", (userId: string) => {
    try {
      socket.join(userId);
      console.log(`User ${socket.id} joined notification room for user ${userId}`);
    } catch (error) {
      console.error('Error joining notification room:', error);
    }
  });

  // Skill swap request notifications
  socket.on("skillSwapRequest", (data: SkillSwapData) => {
    try {
      const { fromUserId, toUserId, skill } = data;
      sendNotification(
        toUserId,
        'New Skill Swap Request',
        `${fromUserId} wants to learn ${skill} from you`,
        'info'
      );
    } catch (error) {
      console.error('Error handling skill swap request:', error);
    }
  });

  // Skill swap accepted notifications
  socket.on("skillSwapAccepted", (data: SkillSwapData) => {
    try {
      const { fromUserId, toUserId, skill } = data;
      sendNotification(
        fromUserId,
        'Skill Swap Accepted',
        `${toUserId} accepted your request to learn ${skill}`,
        'success'
      );
    } catch (error) {
      console.error('Error handling skill swap acceptance:', error);
    }
  });

  // Skill swap rejected notifications
  socket.on("skillSwapRejected", (data: SkillSwapData) => {
    try {
      const { fromUserId, toUserId, skill } = data;
      sendNotification(
        fromUserId,
        'Skill Swap Rejected',
        `${toUserId} declined your request to learn ${skill}`,
        'warning'
      );
    } catch (error) {
      console.error('Error handling skill swap rejection:', error);
    }
  });

  // Profile update notifications
  socket.on("profileUpdated", (data: ProfileUpdateData) => {
    try {
      const { userId, followers } = data;
      followers.forEach((followerId: string) => {
        sendNotification(
          followerId,
          'Profile Update',
          `${userId} updated their profile`,
          'info'
        );
      });
    } catch (error) {
      console.error('Error handling profile update:', error);
    }
  });

  // New follower notifications
  socket.on("newFollower", (data: { userId: string; followerId: string }) => {
    try {
      const { userId, followerId } = data;
      sendNotification(
        userId,
        'New Follower',
        `${followerId} started following you`,
        'success'
      );
    } catch (error) {
      console.error('Error handling new follower:', error);
    }
  });

  // Message read notifications
  socket.on("messageRead", (data: MessageReadData) => {
    try {
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
    } catch (error) {
      console.error('Error handling message read status:', error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test notification endpoint
app.get('/test-notification/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Test notification requested for user:', userId);
    
    sendNotification(
      userId,
      'Test Notification',
      'This is a test notification message',
      'info'
    );
    
    res.json({ success: true, message: 'Test notification sent' });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ success: false, error: 'Failed to send test notification' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
}); 