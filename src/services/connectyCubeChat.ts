import { getConnectyCube } from '@/lib/connectyCube';
import { ensureAuthenticated, connectToChat, isChatConnectionActive, getCurrentSession } from './connectyCubeAuth';

export interface ChatMessage {
  id: string;
  senderId: number;
  recipientId: number;
  body: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  attachments?: ChatAttachment[];
  timestamp: number;
  readStatus?: number;
  deliveredStatus?: number;
}

export interface ChatAttachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  name?: string;
  size?: number;
  duration?: number;
}

export interface Dialog {
  id: string;
  type: 'private' | 'group';
  userId?: number;
  occupantIds?: number[];
  lastMessage?: ChatMessage;
  unreadCount?: number;
  updatedAt?: number;
}

export interface ChatUser {
  id: number;
  login: string;
  fullName?: string;
  email?: string;
  avatar?: string;
  customData?: {
    mongoUserId?: string;
    role?: string;
  };
}

let messageListeners: ((message: ChatMessage) => void)[] = [];
let typingListeners: ((userId: number, isTyping: boolean) => void)[] = [];

export async function getDialogs(): Promise<Dialog[]> {
  await ensureAuthenticated();
  const CB = getConnectyCube();
  
  try {
    const response = await CB.chat.dialog.list();
    const dialogs = response.items || [];
    return dialogs.map((dialog: any) => ({
      id: dialog._id,
      type: dialog.type === 3 ? 'private' : dialog.type === 2 ? 'group' : 'private',
      userId: dialog.user_id,
      occupantIds: dialog.occupants_ids,
      lastMessage: dialog.last_message ? parseMessage(dialog.last_message) : undefined,
      unreadCount: dialog.unread_messages_count,
      updatedAt: dialog.updated_at ? new Date(dialog.updated_at).getTime() : undefined,
    }));
  } catch (error) {
    console.error('Failed to get dialogs:', error);
    return [];
  }
}

export async function getDialog(userId: number): Promise<Dialog | null> {
  await ensureAuthenticated();
  const CB = getConnectyCube();
  
  try {
    const response = await CB.chat.dialog.list();
    const dialogs = response.items || [];
    const dialog = dialogs.find((d: any) => d.occupants_ids?.includes(userId));
    if (dialog) {
      return {
        id: dialog._id,
        type: dialog.type === 3 ? 'private' : dialog.type === 2 ? 'group' : 'private',
        userId: dialog.user_id,
        occupantIds: dialog.occupants_ids,
        lastMessage: dialog.last_message ? parseMessage(dialog.last_message) : undefined,
        unreadCount: dialog.unread_messages_count,
        updatedAt: dialog.updated_at ? new Date(dialog.updated_at).getTime() : undefined,
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to get dialog:', error);
    return null;
  }
}

export async function getDialogById(dialogId: string): Promise<Dialog | null> {
  await ensureAuthenticated();
  const CB = getConnectyCube();
  
  try {
    const response = await CB.chat.dialog.list();
    const dialogs = response.items || [];
    const dialog = dialogs.find((d: any) => d._id === dialogId);
    if (dialog) {
      return {
        id: dialog._id,
        type: dialog.type === 3 ? 'private' : dialog.type === 2 ? 'group' : 'private',
        userId: dialog.user_id,
        occupantIds: dialog.occupants_ids,
        lastMessage: dialog.last_message ? parseMessage(dialog.last_message) : undefined,
        unreadCount: dialog.unread_messages_count,
        updatedAt: dialog.updated_at ? new Date(dialog.updated_at).getTime() : undefined,
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to get dialog by ID:', error);
    return null;
  }
}

export async function createDialog(userId: number): Promise<Dialog> {
  await ensureAuthenticated();
  const CB = getConnectyCube();
  
  try {
    const dialog = await CB.chat.dialog.create({ type: 3, occupants_ids: [userId] });
    return {
      id: dialog._id,
      type: dialog.type === 3 ? 'private' : dialog.type === 2 ? 'group' : 'private',
      occupantIds: dialog.occupants_ids,
      unreadCount: 0,
    };
  } catch (error) {
    console.error('Failed to create dialog:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw new Error(`Failed to create dialog with user ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getMessages(dialogId: string, limit: number = 50, skip: number = 0): Promise<ChatMessage[]> {
  await ensureAuthenticated();
  const CB = getConnectyCube();
  
  // Ensure chat is connected for message operations
  if (!isChatConnectionActive()) {
    await connectToChat();
  }
  
  try {
    // Use SDK chat message method
    const messages = await CB.chat.message.list({
      chat_dialog_id: dialogId,
      limit,
      skip,
    });
    
    const messageList = messages as any;
    const items = messageList.items || [];
    
    return items.map((msg: any) => parseMessage(msg));
  } catch (error) {
    console.error('Failed to get messages:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return [];
  }
}

export async function sendMessage(
  dialogId: string,
  body: string,
  type: 'text' | 'image' | 'video' | 'audio' | 'file' = 'text',
  attachments?: ChatAttachment[]
): Promise<ChatMessage> {
  
  await ensureAuthenticated();
  const CB = getConnectyCube();
  
  try {
    const messageData: any = {
      message: body,  // API expects 'message' field, not 'body'
      type,
      send_to_chat: 1,
      chat_dialog_id: dialogId,
    };
    
    if (attachments && attachments.length > 0) {
      messageData.attachment = attachments.map(att => ({
        type: att.type,
        url: att.url,
        name: att.name,
        size: att.size,
        duration: att.duration,
      }));
    }
    
    
    // Use SDK's REST API method for sending messages (saves to history)
    const message = await CB.chat.message.create(messageData);
    
    
    const parsedMessage = parseMessage(message);
    
    return parsedMessage;
  } catch (error) {
    console.error('Failed to send message:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw new Error('Failed to send message');
  }
}

export async function uploadFile(file: File, _onProgress?: (progress: number) => void): Promise<string> {
  await ensureAuthenticated();
  const CB = getConnectyCube();
  
  return new Promise((resolve, reject) => {
    const uploadParams: any = {
      file: file,
      public: true, // Make file public so it can be accessed for preview
      name: file.name,
      type: file.type,
      size: file.size,
    };
    
    CB.storage.createAndUpload(uploadParams)
      .then(async (result: any) => {
        
        // Properly extract URL from ConnectyCube response
        let fileUrl: string;
        if (typeof result === 'string') {
          fileUrl = result;
        } else if (result && result.uid) {
          // ConnectyCube returns uid for uploaded files - resolve to URL
          const uid = result.uid;
          
          // Use ConnectyCube SDK to resolve UID to a proper URL
          try {
            // Try private URL first (requires authentication)
            fileUrl = CB.storage.privateUrl(uid);
          } catch (error) {
            console.error('Failed to resolve private URL, trying public URL:', error);
            try {
              // Fallback to public URL
              fileUrl = CB.storage.publicUrl(uid);
            } catch (publicError) {
              console.error('Failed to resolve public URL:', publicError);
              // Last resort: use UID directly (will likely fail but provides debugging info)
              fileUrl = uid;
            }
          }
        } else if (result && result.url) {
          // Direct URL field
          fileUrl = result.url;
        } else if (result && typeof result === 'object') {
          // Try to find URL in nested structure
          fileUrl = result.uid || result.id || result.href || result.toString();
        } else {
          fileUrl = result.toString();
        }
        
        resolve(fileUrl);
      })
      .catch((error: any) => {
        console.error('Failed to upload file:', error);
        reject(error);
      });
  });
}

export async function markAsRead(_dialogId: string, messageId: string): Promise<void> {
  await ensureAuthenticated();
  const session = getCurrentSession();
  
  try {
    if (!session || !session.token) {
      console.error('No session or token available for markAsRead');
      return;
    }
    
    // Use REST API to mark message as read
    await fetch(`https://api.connectycube.com/chat/Message/${messageId}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'QB-Token': session.token,
      },
      body: JSON.stringify({ read: 1 }),
    });
  } catch (error) {
    console.error('Failed to mark as read:', error);
  }
}

export async function sendTypingStatus(dialogId: string, _isTyping: boolean): Promise<void> {
  await ensureAuthenticated();
  
  // Ensure chat is connected
  if (!isChatConnectionActive()) {
    await connectToChat();
  }
  
  const CB = getConnectyCube();
  
  try {
    await CB.chat.sendIsTypingStatus(dialogId);
  } catch (error) {
    console.error('Failed to send typing status:', error);
  }
}

export function onMessageReceived(callback: (message: ChatMessage) => void): void {
  messageListeners.push(callback);
}

export function onTypingStatus(callback: (userId: number, isTyping: boolean) => void): void {
  typingListeners.push(callback);
}

let onlineStatusListeners: ((userId: number, isOnline: boolean) => void)[] = [];

export function onOnlineStatus(callback: (userId: number, isOnline: boolean) => void): void {
  onlineStatusListeners.push(callback);
}

export function setupMessageListeners(): void {
  const CB = getConnectyCube();
  
  CB.chat.onMessageListener = (_userId: number, message: any) => {
    const parsedMessage = parseMessage(message);
    messageListeners.forEach(callback => callback(parsedMessage));
  };
  
  CB.chat.onChatStatusListener = (...args: any[]) => {
    const userId = args[0];
    const status = args[2];
    if (status === 'typing') {
      typingListeners.forEach(callback => callback(userId, true));
    } else {
      typingListeners.forEach(callback => callback(userId, false));
    }
  };
  
  // Use system message listener for presence updates
  CB.chat.onSystemMessageListener = (message: any) => {
    // ConnectyCube may send presence updates via system messages
    if (message.extension && message.extension.notification_type === 'presence') {
      const userId = message.sender_id;
      const isOnline = message.extension.online === true;
      onlineStatusListeners.forEach(callback => callback(userId, isOnline));
    }
  };
}

export function removeMessageListeners(): void {
  messageListeners = [];
  typingListeners = [];
  onlineStatusListeners = [];
}

function parseMessage(message: any): ChatMessage {
  
  // Handle both 'attachment' (singular) and 'attachments' (plural) from ConnectyCube
  const attachmentData = message.attachment || message.attachments;
  const attachments = attachmentData ? (Array.isArray(attachmentData) ? attachmentData : [attachmentData]) : undefined;
  
  
  // Get ConnectyCube instance for URL resolution
  const CB = getConnectyCube();
  
  // Resolve UIDs to URLs for attachments
  const resolvedAttachments = attachments ? attachments.map((att: any) => {
    let url = att.url;
    
    // If URL is a UID, resolve it using ConnectyCube SDK
    if (att.uid && typeof att.uid === 'string') {
      try {
        url = CB.storage.privateUrl(att.uid);
      } catch (error) {
        console.error('Failed to resolve private URL, trying public URL:', error);
        try {
          url = CB.storage.publicUrl(att.uid);
        } catch (publicError) {
          console.error('Failed to resolve public URL:', publicError);
          url = att.uid; // Fallback to UID
        }
      }
    } else if (typeof att.url === 'object' && att.url !== null) {
      // Handle nested URL objects
      url = att.url.url || att.url.href || JSON.stringify(att.url);
    }
    
    return {
      id: att.id,
      type: att.type,
      url: url,
      name: att.name,
      size: att.size,
      duration: att.duration,
    };
  }) : undefined;
  
  const parsed = {
    id: message._id,
    senderId: message.sender_id,
    recipientId: message.recipient_id,
    body: message.message || message.body,  // ConnectyCube uses 'message' field
    type: message.type || 'text',
    attachments: resolvedAttachments,
    timestamp: message.date_sent,
    readStatus: message.read_status,
    deliveredStatus: message.delivered_status,
  };
  
  return parsed;
}

export async function getUserInfo(userId: number): Promise<ChatUser | null> {
  await ensureAuthenticated();
  const CB = getConnectyCube();
  
  try {
    const user = await CB.users.get({ id: userId });
    const userData = user as any;
    return {
      id: userData.id || userData.user_id,
      login: userData.login || userData.email,
      fullName: userData.full_name || userData.name,
      email: userData.email || userData.login,
      avatar: userData.avatar,
      customData: userData.custom_data || userData.customData,
    };
  } catch (error) {
    console.error('Failed to get user info:', error);
    return null;
  }
}
