import { useEffect, useMemo, useState } from 'react';
import MessageBody from '@/components/messages/MessageBody';
import MessageHeader from '@/components/messages/MessageHeader';
import MessageInput from '@/components/messages/MessageInput';
import type { MessageItem } from '@/components/messages/MessageBubble';
// @ts-ignore - local dummyData is a plain JS module kept for easy fixture edits.
import { attachmentActions, dummyConversation } from '@/components/messages/dummyData';

interface MessageDrawerProfile {
  name: string;
  username: string;
  profilePicture?: string;
}

interface MessageDrawerProps {
  isOpen: boolean;
  profile: MessageDrawerProfile;
  onClose: () => void;
}

const currentUserId = 'admin';

export default function MessageDrawer({ isOpen, profile, onClose }: MessageDrawerProps) {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(7);
  const [messages, setMessages] = useState<MessageItem[]>(dummyConversation.messages);

  const participant = useMemo(
    () => ({
      ...dummyConversation.participant,
      name: profile.name || dummyConversation.participant.name,
      username: profile.username || dummyConversation.participant.username,
      avatar: profile.profilePicture || dummyConversation.participant.avatar,
    }),
    [profile.name, profile.profilePicture, profile.username],
  );

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isRecording) return;

    const interval = window.setInterval(() => {
      setRecordingSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isRecording]);

  function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  }

  function handleSend() {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `msg_${Date.now()}`,
        senderId: currentUserId,
        type: 'text',
        body: trimmedValue,
        timestamp: 'Now',
        status: 'sent',
      },
    ]);
    setInputValue('');
    setIsAttachmentOpen(false);
  }

  function handleStartRecording() {
    setIsAttachmentOpen(false);
    setRecordingSeconds(7);
    setIsRecording(true);
  }

  function handleCancelRecording() {
    setIsRecording(false);
    setRecordingSeconds(7);
  }

  function handleSendRecording() {
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `voice_${Date.now()}`,
        senderId: currentUserId,
        type: 'voice',
        body: `Voice message ${formatDuration(recordingSeconds)}`,
        timestamp: 'Now',
        status: 'sent',
      },
    ]);
    handleCancelRecording();
  }

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      <button
        type="button"
        aria-label="Close message drawer backdrop"
        className={`absolute inset-0 bg-black/25 backdrop-blur-[1px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Message ${participant.name}`}
        className={`absolute right-0 top-0 flex h-full w-full max-w-[390px] flex-col bg-white shadow-card transition-transform duration-300 ease-out sm:max-w-[430px] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <MessageHeader
          name={participant.name}
          username={participant.username}
          avatar={participant.avatar}
          isOnline={participant.isOnline}
          onClose={onClose}
        />
        <MessageBody messages={messages} currentUserId={currentUserId} participantAvatar={participant.avatar} />
        <MessageInput
          value={inputValue}
          isRecording={isRecording}
          isAttachmentOpen={isAttachmentOpen}
          recordingDuration={formatDuration(recordingSeconds)}
          attachmentActions={attachmentActions}
          onChange={setInputValue}
          onSend={handleSend}
          onStartRecording={handleStartRecording}
          onCancelRecording={handleCancelRecording}
          onSendRecording={handleSendRecording}
          onToggleAttachment={() => setIsAttachmentOpen((isOpen) => !isOpen)}
          onCloseAttachment={() => setIsAttachmentOpen(false)}
          onAttachmentSelect={() => setIsAttachmentOpen(false)}
        />
      </aside>
    </div>
  );
}
