import { CheckCheck } from 'lucide-react';

export interface MessageItem {
  id: string;
  senderId: string;
  type: 'text' | 'link' | 'image' | 'voice' | 'file';
  body: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
}

interface MessageBubbleProps {
  message: MessageItem;
  currentUserId: string;
  showAvatar?: boolean;
  avatar?: string;
}

export default function MessageBubble({ message, currentUserId, showAvatar, avatar }: MessageBubbleProps) {
  const isSender = message.senderId === currentUserId;

  return (
    <div className={`flex w-full items-end gap-2 ${isSender ? 'justify-end' : 'justify-start'}`}>
      {!isSender && (
        <div className="h-7 w-7 shrink-0">
          {showAvatar && avatar ? (
            <img src={avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
          ) : null}
        </div>
      )}

      <div
        className={`group max-w-[82%] rounded-lg border px-4 py-3 shadow-card sm:max-w-[74%] ${
          isSender
            ? 'rounded-br-sm border-[#D7E8FF] bg-[#F8FBFF] text-text-primary'
            : 'rounded-bl-sm border-[#DCE5EF] bg-white text-text-primary'
        }`}
      >
        {message.type === 'image' && message.mediaUrl ? (
          <img
            src={message.mediaUrl}
            alt={message.body}
            className="-mx-3 -my-2 max-h-[44vh] w-[320px] max-w-full rounded-md object-cover sm:w-[365px]"
          />
        ) : (
          <p className={`text-[13px] font-medium leading-5 ${message.type === 'link' ? 'break-all text-btn-primary' : ''}`}>
            {message.body}
          </p>
        )}

        <div className="mt-1 flex items-center justify-end gap-1 text-sm-custom font-medium text-text-placeholder opacity-0">
          <span>{message.timestamp}</span>
          {isSender && <CheckCheck className="h-3 w-3 text-btn-primary" aria-hidden="true" />}
        </div>
      </div>
    </div>
  );
}
