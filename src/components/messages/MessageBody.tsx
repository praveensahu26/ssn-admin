import { useEffect, useRef } from 'react';
import MessageBubble, { type MessageItem } from '@/components/messages/MessageBubble';

interface MessageBodyProps {
  messages: MessageItem[];
  currentUserId: string;
  participantAvatar: string;
}

export default function MessageBody({ messages, currentUserId, participantAvatar }: MessageBodyProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-white px-4 py-4">
      <div className="flex min-h-full flex-col justify-end gap-3">
        {messages.map((message, index) => {
          const previousMessage = messages[index - 1];
          const showAvatar = message.senderId !== currentUserId && previousMessage?.senderId !== message.senderId;

          return (
            <MessageBubble
              key={message.id}
              message={message}
              currentUserId={currentUserId}
              avatar={participantAvatar}
              showAvatar={showAvatar}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
