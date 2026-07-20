import { useEffect, useState } from 'react';
import { MessageCircle, Search } from 'lucide-react';
import { getDialogs, getUserInfo, type Dialog, type ChatUser } from '@/services/connectyCubeChat';
import { getCurrentUser } from '@/services/connectyCubeAuth';

export interface ConversationItem extends Dialog {
  user?: ChatUser;
  lastMessageTime?: string;
}

interface ConversationListProps {
  onSelectConversation: (conversation: ConversationItem) => void;
  selectedConversationId?: string;
}

export default function ConversationList({ onSelectConversation, selectedConversationId }: ConversationListProps) {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    loadConversations();
    loadCurrentUser();
    
    // Refresh conversations every 30 seconds
    const interval = setInterval(loadConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadCurrentUser() {
    try {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    } catch (error) {
    }
  }

  async function loadConversations() {
    try {
      setLoading(true);
      const dialogs = await getDialogs();
      
      // Load user info for each dialog
      const conversationsWithUsers = await Promise.all(
        dialogs.map(async (dialog) => {
          let user: ChatUser | undefined;
          
          if (dialog.type === 'private' && dialog.userId) {
            const userInfo = await getUserInfo(dialog.userId);
            user = userInfo || undefined;
          } else if (dialog.occupantIds && dialog.occupantIds.length > 0) {
            // Get the other user in the dialog (not current user)
            const otherUserId = dialog.occupantIds.find(id => id !== currentUserId);
            if (otherUserId) {
              const userInfo = await getUserInfo(otherUserId);
              user = userInfo || undefined;
            }
          }
          
          return {
            ...dialog,
            user,
            lastMessageTime: dialog.lastMessage ? formatTimestamp(dialog.lastMessage.timestamp) : undefined,
          };
        })
      );
      
      // Sort by last message time (most recent first)
      conversationsWithUsers.sort((a, b) => {
        if (!a.updatedAt) return 1;
        if (!b.updatedAt) return -1;
        return b.updatedAt - a.updatedAt;
      });
      
      setConversations(conversationsWithUsers);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }

  function formatLastMessage(message: string): string {
    if (message.length > 50) {
      return message.substring(0, 50) + '...';
    }
    return message;
  }

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const userName = conv.user?.fullName || conv.user?.login || '';
    const lastMessage = conv.lastMessage?.body || '';
    return userName.toLowerCase().includes(query) || lastMessage.toLowerCase().includes(query);
  });

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <MessageCircle className="mx-auto h-8 w-8 animate-pulse text-text-secondary" />
          <p className="mt-2 text-sm font-medium text-text-secondary">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-[#DCE5EF] bg-white px-4 py-3">
        <h2 className="text-lg font-semibold text-text-primary">Messages</h2>
      </div>

      {/* Search */}
      <div className="border-b border-[#DCE5EF] bg-white px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#DCE5EF] bg-[#F6FBFF] py-2 pl-10 pr-4 text-sm font-medium text-text-primary outline-none placeholder:text-text-placeholder focus:border-btn-primary"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4">
            <p className="text-center text-sm font-medium text-text-secondary">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#DCE5EF]">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation)}
                className={`flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-[#F6FBFF] ${
                  selectedConversationId === conversation.id ? 'bg-[#F0F7FF]' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative h-12 w-12 shrink-0">
                  {conversation.user?.avatar ? (
                    <img
                      src={conversation.user.avatar}
                      alt={conversation.user.fullName || conversation.user.login}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-btn-primary text-white">
                      <span className="text-sm font-semibold">
                        {(conversation.user?.fullName || conversation.user?.login || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {/* Online indicator */}
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="truncate text-sm font-semibold text-text-primary">
                      {conversation.user?.fullName || conversation.user?.login || 'Unknown User'}
                    </h3>
                    {conversation.lastMessageTime && (
                      <span className="text-xs font-medium text-text-placeholder">
                        {conversation.lastMessageTime}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="truncate text-xs font-medium text-text-secondary">
                      {conversation.lastMessage ? formatLastMessage(conversation.lastMessage.body) : 'No messages yet'}
                    </p>
                    {conversation.unreadCount && conversation.unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-btn-primary px-1.5 text-xs font-semibold text-white">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
