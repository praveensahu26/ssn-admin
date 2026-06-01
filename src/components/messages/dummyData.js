export const dummyConversation = {
  participant: {
    id: 'contact_001',
    name: 'Kristin Watson',
    username: '@kristin_watson',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face',
    isOnline: true,
    lastSeen: 'Online',
  },
  messages: [
    {
      id: 'msg_001',
      senderId: 'contact_001',
      type: 'text',
      body: 'Hey! I just published a new article on the recent economic developments. Would you like me to share the link?',
      timestamp: '10:22 AM',
      status: 'read',
    },
    {
      id: 'msg_002',
      senderId: 'contact_001',
      type: 'text',
      body: "Also, if you have any specific topics in mind, let me know. I'd love to cover them!",
      timestamp: '10:23 AM',
      status: 'read',
    },
    {
      id: 'msg_003',
      senderId: 'admin',
      type: 'text',
      body: "Sure, please share the link. We're always looking for fresh and credible content!",
      timestamp: '10:25 AM',
      status: 'delivered',
    },
    {
      id: 'msg_004',
      senderId: 'contact_001',
      type: 'link',
      body: 'https://chatgpt.com/c/67b85011-4490-8012-8bf6-fc16c9391279',
      timestamp: '10:27 AM',
      status: 'read',
    },
    {
      id: 'msg_005',
      senderId: 'contact_001',
      type: 'image',
      body: 'Reporter interview media attachment',
      mediaUrl:
        'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=760&h=940&fit=crop',
      timestamp: '10:28 AM',
      status: 'read',
    },
  ],
  connectyCubeReady: {
    realtimeMessages: true,
    typingIndicators: false,
    readReceipts: true,
    deliveredStatus: true,
    voiceMessages: true,
    imageMessages: true,
    fileSharing: true,
    onlineStatus: true,
    messageHistory: true,
  },
};

export const attachmentActions = [
  { id: 'camera', label: 'Camera', type: 'camera' },
  { id: 'image', label: 'Images', type: 'image' },
  { id: 'audio', label: 'Audio', type: 'audio' },
  { id: 'file', label: 'File', type: 'document' },
];
