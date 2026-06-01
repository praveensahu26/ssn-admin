import { useEffect, useRef } from 'react';
import { Mic, Paperclip, Send, Smile } from 'lucide-react';
import AttachmentMenu from '@/components/messages/AttachmentMenu';
import VoiceRecorder from '@/components/messages/VoiceRecorder';

interface AttachmentAction {
  id: string;
  label: string;
  type: 'camera' | 'image' | 'audio' | 'document';
}

interface MessageInputProps {
  value: string;
  isRecording: boolean;
  isAttachmentOpen: boolean;
  recordingDuration: string;
  attachmentActions: AttachmentAction[];
  onChange: (value: string) => void;
  onSend: () => void;
  onStartRecording: () => void;
  onCancelRecording: () => void;
  onSendRecording: () => void;
  onToggleAttachment: () => void;
  onCloseAttachment: () => void;
  onAttachmentSelect: (action: AttachmentAction) => void;
}

export default function MessageInput({
  value,
  isRecording,
  isAttachmentOpen,
  recordingDuration,
  attachmentActions,
  onChange,
  onSend,
  onStartRecording,
  onCancelRecording,
  onSendRecording,
  onToggleAttachment,
  onCloseAttachment,
  onAttachmentSelect,
}: MessageInputProps) {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAttachmentOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!footerRef.current?.contains(event.target as Node)) {
        onCloseAttachment();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isAttachmentOpen, onCloseAttachment]);

  return (
    <footer ref={footerRef} className="shrink-0 border-t border-[#DCE5EF] bg-white">
      <AttachmentMenu isOpen={isAttachmentOpen} actions={attachmentActions} onSelect={onAttachmentSelect} />

      <div className="px-4 py-3">
        {isRecording ? (
          <VoiceRecorder duration={recordingDuration} onCancel={onCancelRecording} onSend={onSendRecording} />
        ) : (
          <div className="flex items-end gap-2">
            <button
              type="button"
              aria-label="Open attachment menu"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                isAttachmentOpen
                  ? 'border-btn-primary bg-[#F0F7FF] text-btn-primary'
                  : 'border-[#DCE5EF] bg-white text-text-secondary hover:text-btn-primary'
              }`}
              onClick={onToggleAttachment}
            >
              <Paperclip className="h-5 w-5" />
            </button>

            <div className="flex min-h-10 flex-1 items-end gap-2 rounded-lg border border-[#DCE5EF] bg-[#F6FBFF] px-3 py-2">
              <Smile className="mt-1 h-5 w-5 shrink-0 text-text-secondary" />
              <textarea
                value={value}
                rows={1}
                placeholder="Type your message"
                className="max-h-24 min-h-6 flex-1 resize-none bg-transparent text-sm-custom font-medium leading-6 text-text-primary outline-none placeholder:text-text-placeholder"
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    onSend();
                  }
                }}
              />
              <button type="button" aria-label="Start voice recording" className="text-text-secondary transition-colors hover:text-btn-primary" onClick={onStartRecording}>
                <Mic className="h-5 w-5" />
              </button>
            </div>

            <button
              type="button"
              aria-label="Send message"
              className="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg bg-btn-primary text-white"
              onClick={onSend}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}
