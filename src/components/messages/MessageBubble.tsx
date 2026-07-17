import { CheckCheck, FileText, Download, Mic } from 'lucide-react';

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
          <>
            <img
              src={message.mediaUrl}
              alt={message.body}
              className="-mx-3 -my-2 max-h-[44vh] w-[320px] max-w-full rounded-md object-cover sm:w-[365px]"
              onError={(e) => console.error('Image load error:', e)}
            />
            <p className="text-xs text-text-secondary mt-2">{message.body}</p>
          </>
        ) : message.type === 'voice' && message.mediaUrl ? (
          <div className="flex items-center gap-3 rounded-md border border-[#D7E8FF] bg-[#F8FBFF] p-3">
            <Mic className="h-8 w-8 text-btn-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{message.body}</p>
              <audio 
                controls 
                src={message.mediaUrl}
                className="w-full mt-1 h-8"
              />
            </div>
          </div>
        ) : message.type === 'file' && message.mediaUrl ? (
          <a
            href={message.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-md border border-[#D7E8FF] bg-[#F8FBFF] p-3 hover:bg-[#F0F5FF] transition-colors"
          >
            <FileText className="h-8 w-8 text-btn-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{message.body}</p>
              <p className="text-xs text-text-secondary">Click to view or download</p>
            </div>
            <Download className="h-5 w-5 text-text-secondary shrink-0" />
          </a>
        ) : (
          <p className={`text-[13px] font-medium leading-5`}>
            {message.type === 'link' ? (
              <a 
                href={message.body.match(/https?:\/\/[^\s]+/)?.[0]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="break-all text-btn-primary hover:underline"
              >
                {message.body}
              </a>
            ) : (
              message.body
            )}
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
