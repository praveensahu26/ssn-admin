import { useEffect, useMemo, useState, useRef } from 'react';
import MessageBody from '@/components/messages/MessageBody';
import MessageHeader from '@/components/messages/MessageHeader';
import MessageInput from '@/components/messages/MessageInput';
import type { MessageItem } from '@/components/messages/MessageBubble';
import { attachmentActions } from '@/components/messages/dummyData';
import { getMessages, sendMessage, uploadFile, onMessageReceived, onTypingStatus, onOnlineStatus, setupMessageListeners, removeMessageListeners, sendTypingStatus, markAsRead, getDialog, createDialog, type ChatMessage, type Dialog } from '@/services/connectyCubeChat';
import { getCurrentUser, getCurrentUserId, isAuthenticated, ensureAuthenticated } from '@/services/connectyCubeAuth';
import { initializeConnectyCube, getConnectyCube } from '@/lib/connectyCube';

interface MessageDrawerProfile {
  name: string;
  username: string;
  profilePicture?: string;
  connectyCubeUserId?: number;
}

interface MessageDrawerProps {
  isOpen: boolean;
  profile: MessageDrawerProfile;
  onClose: () => void;
  dialog?: Dialog;
}

export default function MessageDrawer({ isOpen, profile, onClose, dialog }: MessageDrawerProps) {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [currentDialog, setCurrentDialog] = useState<Dialog | undefined>(dialog);
  const [creatingDialog, setCreatingDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const statusCheckIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const commonEmojis = [
    '😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '👎', 
    '❤️', '🔥', '✨', '🎉', '👋', '🙏', '💯', '🚀',
    '😊', '😢', '😡', '🤣', '😇', '🥳', '😴', '🤯'
  ];

  const participant = useMemo(
    () => ({
      name: profile.name || 'User',
      username: profile.username || 'username',
      avatar: profile.profilePicture || '',
      isOnline,
    }),
    [profile.name, profile.profilePicture, profile.username, isOnline],
  );

  useEffect(() => {
    if (isOpen) {
      initializeConnectyCube();
      loadCurrentUser();
      
      // If no dialog provided, try to create one
      if (!dialog && profile.connectyCubeUserId) {
        handleDialogCreation();
      } else if (dialog) {
        setCurrentDialog(dialog);
        loadMessages(dialog.id);
      }
      
      // Set up real-time message listeners
      setupMessageListeners();
      onMessageReceived((message: ChatMessage) => {
        if (currentDialog && message.recipientId === currentUserId) {
          
          // Detect if message contains a URL
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          const containsUrl = urlRegex.test(message.body);
          const messageType: 'text' | 'link' | 'image' | 'voice' | 'file' = containsUrl ? 'link' : (message.type === 'text' ? 'text' : message.type === 'image' ? 'image' : message.type === 'audio' ? 'voice' : 'file');
          
          // Extract mediaUrl from attachments
          let mediaUrl: string | undefined;
          if (message.attachments && message.attachments.length > 0 && message.attachments[0]) {
            const attachment = message.attachments[0] as any; // Use any to access uid property
            
            // If attachment has a UID, resolve it to a URL
            if (attachment.uid && typeof attachment.uid === 'string') {
              try {
                const CB = getConnectyCube();
                mediaUrl = CB.storage.privateUrl(attachment.uid);
              } catch (error) {
                console.error('Failed to resolve private URL, trying public URL:', error);
                try {
                  const CB = getConnectyCube();
                  mediaUrl = CB.storage.publicUrl(attachment.uid);
                } catch (publicError) {
                  console.error('Failed to resolve public URL:', publicError);
                  mediaUrl = attachment.uid; // Fallback to UID
                }
              }
            } else if (typeof attachment.url === 'string') {
              mediaUrl = attachment.url;
            } else if (attachment.url && typeof attachment.url === 'object') {
              // URL might be nested in an object
              mediaUrl = attachment.url.url || attachment.url.href || JSON.stringify(attachment.url);
            }
          }
          
          const newMessageItem: MessageItem = {
            id: message.id,
            senderId: message.senderId ? message.senderId.toString() : 'unknown',
            type: messageType,
            body: message.body,
            timestamp: 'Just now',
            status: message.readStatus === 1 ? 'read' : message.deliveredStatus === 1 ? 'delivered' : 'sent',
            mediaUrl: mediaUrl,
          };
          setMessages((currentMessages) => [...currentMessages, newMessageItem]);
          
          // Mark message as read
          if (currentDialog) {
            markAsRead(currentDialog.id, message.id);
          }
        }
      });
      
      // Set up typing status listener
      onTypingStatus((userId: number, isTyping: boolean) => {
        if (currentDialog && userId !== currentUserId) {
          setIsTyping(isTyping);
          // If user is typing, they're definitely online
          if (isTyping && profile.connectyCubeUserId && userId === profile.connectyCubeUserId) {
            setIsOnline(true);
          }
        }
      });
      
      // Set up online status listener (may not work reliably in free tier)
      onOnlineStatus((userId: number, online: boolean) => {
        if (profile.connectyCubeUserId && userId === profile.connectyCubeUserId) {
          setIsOnline(online);
        }
      });
      
      // Periodically check online status by message activity
      const checkOnlineStatus = () => {
        if (profile.connectyCubeUserId && currentDialog) {
          // Check if user was active recently (based on last message)
          const recentMessage = messages.find(msg => 
            msg.senderId === profile.connectyCubeUserId!.toString() || 
            (currentDialog.userId && msg.senderId === currentDialog.userId.toString())
          );
          
          if (recentMessage) {
            const messageTime = new Date(recentMessage.timestamp === 'Just now' ? Date.now() : recentMessage.timestamp);
            const now = new Date();
            const diffMinutes = (now.getTime() - messageTime.getTime()) / (1000 * 60);
            
            // Consider online if last message was within 5 minutes
            if (diffMinutes < 5) {
              setIsOnline(true);
            } else {
              setIsOnline(false);
            }
          }
        }
      };
      
      statusCheckIntervalRef.current = setInterval(checkOnlineStatus, 30000); // Check every 30 seconds
      checkOnlineStatus(); // Initial check
    }
    
    return () => {
      removeMessageListeners();
      setIsTyping(false);
      if (statusCheckIntervalRef.current) {
        clearInterval(statusCheckIntervalRef.current);
      }
    };
  }, [isOpen, dialog, currentUserId, profile.connectyCubeUserId]);

  async function loadCurrentUser(): Promise<number> {
    try {
      const userId = getCurrentUserId();
      if (userId) {
        setCurrentUserId(userId);
        return userId;
      }
      
      // Fallback: try to get user from getCurrentUser
      const user = await getCurrentUser();
      if (user && user.id) {
        setCurrentUserId(user.id);
        return user.id;
      } else {
        // Final fallback: use the admin user ID directly
        setCurrentUserId(14922637);
        return 14922637;
      }
    } catch (error) {
      console.error('Failed to load current user:', error);
      // Final fallback: use the admin user ID directly
      setCurrentUserId(14922637);
      return 14922637;
    }
  }

  async function handleDialogCreation() {
    if (!profile.connectyCubeUserId) {
      console.error('Cannot create dialog: no ConnectyCube user ID');
      return;
    }

    try {
      setCreatingDialog(true);
      
      // Ensure we're authenticated first
      if (!isAuthenticated()) {
        await ensureAuthenticated();
      }
      
      // Try to get existing dialog first
      let existingDialog = await getDialog(profile.connectyCubeUserId);
      
      if (!existingDialog) {
        existingDialog = await createDialog(profile.connectyCubeUserId);
      }
      
      setCurrentDialog(existingDialog);
      await loadMessages(existingDialog.id);
    } catch (error) {
      console.error('Failed to create dialog:', error);
    } finally {
      setCreatingDialog(false);
    }
  }

  async function loadMessages(dialogId: string) {
    try {
      setLoading(true);
      
      const chatMessages = await getMessages(dialogId, 50, 0);
      
      const messageItems: MessageItem[] = chatMessages.map(msg => {
        // Detect if message contains a URL
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const containsUrl = urlRegex.test(msg.body);
        const messageType: 'text' | 'link' | 'image' | 'voice' | 'file' = containsUrl ? 'link' : (msg.type === 'text' ? 'text' : msg.type === 'image' ? 'image' : msg.type === 'audio' ? 'voice' : 'file');
        
        // Extract mediaUrl from attachments
        let mediaUrl: string | undefined;
        if (msg.attachments && msg.attachments.length > 0 && msg.attachments[0]) {
          const attachment = msg.attachments[0] as any; // Use any to access uid property
          
          // If attachment has a UID, resolve it to a URL
          if (attachment.uid && typeof attachment.uid === 'string') {
            try {
              const CB = getConnectyCube();
              mediaUrl = CB.storage.privateUrl(attachment.uid);
            } catch (error) {
              console.error('Failed to resolve private URL, trying public URL:', error);
              try {
                const CB = getConnectyCube();
                mediaUrl = CB.storage.publicUrl(attachment.uid);
              } catch (publicError) {
                console.error('Failed to resolve public URL:', publicError);
                mediaUrl = attachment.uid; // Fallback to UID
              }
            }
          } else if (typeof attachment.url === 'string') {
            mediaUrl = attachment.url;
          } else if (attachment.url && typeof attachment.url === 'object') {
            // URL might be nested in an object
            mediaUrl = attachment.url.url || attachment.url.href || JSON.stringify(attachment.url);
          }
        }
        
        return {
          id: msg.id,
          senderId: msg.senderId.toString(),
          type: messageType,
          body: msg.body,
          timestamp: formatTimestamp(msg.timestamp),
          status: (msg.readStatus === 1 ? 'read' : msg.deliveredStatus === 1 ? 'delivered' : 'sent') as 'read' | 'delivered' | 'sent',
          mediaUrl: mediaUrl,
        };
      }).reverse(); // Reverse to show oldest messages first
      
      setMessages(messageItems);
    } catch (error) {
      console.error('Failed to load messages:', error);
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

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}r ago`;
    
    return date.toLocaleDateString();
  }

  useEffect(() => {
    return () => {
      // Cleanup: stop recording and release microphone on unmount
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
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

  function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  }

  async function handleSend() {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || !currentDialog) {
      console.error('Cannot send message: no content or no dialog', { trimmedValue, currentDialog });
      return;
    }

    try {
      
      // Stop typing indicator
      if (currentDialog) {
        sendTypingStatus(currentDialog.id, false);
      }
      
      // Detect if message contains a URL
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const containsUrl = urlRegex.test(trimmedValue);
      const messageType = containsUrl ? 'link' : 'text';
      
      const newMessage = await sendMessage(currentDialog.id, trimmedValue, 'text');
      
      const messageItem: MessageItem = {
        id: newMessage.id,
        senderId: currentUserId ? currentUserId.toString() : 'admin',
        type: messageType,
        body: newMessage.body,
        timestamp: 'Now',
        status: 'sent',
      };
      setMessages((currentMessages) => [...currentMessages, messageItem]);
      setInputValue('');
      setIsAttachmentOpen(false);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please check console for details.');
    }
  }

  function handleInputChange(value: string) {
    setInputValue(value);
    
    // Send typing status when user starts typing
    if (currentDialog && value.length > 0 && !isTyping) {
      sendTypingStatus(currentDialog.id, true);
    }
    
    // Stop typing status when user clears input
    if (currentDialog && value.length === 0) {
      sendTypingStatus(currentDialog.id, false);
    }
  }

  function handleEmojiSelect(emoji: string) {
    setInputValue((prev) => prev + emoji);
    setIsEmojiPickerOpen(false);
  }

  function handleToggleEmojiPicker() {
    setIsEmojiPickerOpen((prev) => !prev);
    setIsAttachmentOpen(false);
  }

  async function handleStartRecording() {
    setIsAttachmentOpen(false);
    setRecordingSeconds(0);
    setIsRecording(true);
    setIsPaused(false);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Recorder stopped, chunks collected
      };
      
      mediaRecorder.start(1000); // Collect data every 1 second
      
      // Start timer that counts up
      startTimer();
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to access microphone. Please allow microphone access.');
      setIsRecording(false);
    }
  }

  function startTimer() {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Start new timer
    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function handlePauseToggle() {
    if (isPaused) {
      // Resume - just restart timer
      setIsPaused(false);
      startTimer();
    } else {
      // Pause - just stop timer, keep recorder running
      setIsPaused(true);
      stopTimer();
    }
  }

  function handleStopRecording() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  }

  function handleCancelRecording() {
    handleStopRecording();
    audioChunksRef.current = [];
    setIsRecording(false);
    setIsPaused(false);
    setRecordingSeconds(0);
  }

  async function handleSendRecording() {
    if (!currentDialog || audioChunksRef.current.length === 0) {
      console.error('Cannot send recording: no dialog or no audio chunks');
      alert('No audio recorded. Please record a voice message first.');
      return;
    }
    
    try {
      
      // Stop recording if still active
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      // Wait a bit for the recorder to finish and collect final chunks
      await new Promise(resolve => setTimeout(resolve, 200));
      
      
      // Create audio blob from chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      if (audioBlob.size === 0) {
        console.error('Audio blob is empty');
        alert('Recording failed - no audio data captured.');
        handleCancelRecording();
        return;
      }
      
      const audioFile = new File([audioBlob], `voice_${Date.now()}.webm`, { type: 'audio/webm' });
      
      setUploadingFile(true);
      
      // Upload audio file
      const fileUrl = await uploadFile(audioFile);
      
      if (!fileUrl) {
        console.error('Upload returned empty URL');
        alert('Failed to upload audio file.');
        setUploadingFile(false);
        return;
      }
      
      // Send message with audio attachment
      const newMessage = await sendMessage(currentDialog.id, `Voice message ${formatDuration(recordingSeconds)}`, 'audio', [{
        id: `att_${Date.now()}`,
        type: 'audio',
        url: fileUrl,
        name: audioFile.name,
        size: audioFile.size,
      }]);
      
      
      const messageItem: MessageItem = {
        id: newMessage.id,
        senderId: currentUserId ? currentUserId.toString() : 'admin',
        type: 'voice',
        body: newMessage.body,
        timestamp: 'Now',
        status: 'sent',
        mediaUrl: fileUrl,
      };
      
      setMessages((currentMessages) => [...currentMessages, messageItem]);
      handleCancelRecording();
    } catch (error) {
      console.error('Failed to send voice message:', error);
      alert('Failed to send voice message. Please try again.');
    } finally {
      setUploadingFile(false);
    }
  }

  async function handleFileUpload(file: File) {
    if (!currentDialog) return;

    try {
      setUploadingFile(true);
      setUploadProgress(0);

      const fileUrl = await uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      const fileType = file.type.startsWith('image/') ? 'image' : 
                     file.type.startsWith('video/') ? 'video' : 
                     file.type.startsWith('audio/') ? 'audio' : 'file';

      const newMessage = await sendMessage(currentDialog.id, file.name, fileType, [{
        id: `att_${Date.now()}`,
        type: fileType,
        url: fileUrl,
        name: file.name,
        size: file.size,
      }]);

      const messageItem: MessageItem = {
        id: newMessage.id,
        senderId: currentUserId ? currentUserId.toString() : 'admin',
        type: fileType === 'image' ? 'image' : 'file',
        body: file.name,
        timestamp: 'Now',
        status: 'sent',
        mediaUrl: fileUrl,
      };
      setMessages((currentMessages) => [...currentMessages, messageItem]);
    } catch (error) {
      console.error('Failed to upload file:', error);
    } finally {
      setUploadingFile(false);
      setUploadProgress(0);
    }
  }

  function handleAttachmentSelect(action: { type: 'camera' | 'image' | 'audio' | 'document' }) {
    if (action.type === 'camera') {
      handleCameraCapture();
    } else if (action.type === 'image' || action.type === 'document') {
      fileInputRef.current?.click();
    } else if (action.type === 'audio') {
      handleStartRecording();
    }
  }

  async function handleCameraCapture() {
    try {
      // Check if device supports camera
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        // Create video element to capture frame
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        
        // Create canvas to capture image
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Wait for video to be ready
        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Show video preview in a modal (simple implementation)
          const modal = document.createElement('div');
          modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10000;
          `;
          
          video.style.cssText = `
            max-width: 100%;
            max-height: 70vh;
            border-radius: 8px;
          `;
          
          const captureBtn = document.createElement('button');
          captureBtn.textContent = 'Capture';
          captureBtn.style.cssText = `
            margin-top: 20px;
            padding: 12px 24px;
            background: #3B82F6;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
          `;
          
          const cancelBtn = document.createElement('button');
          cancelBtn.textContent = 'Cancel';
          cancelBtn.style.cssText = `
            margin-top: 10px;
            padding: 12px 24px;
            background: #6B7280;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
          `;
          
          modal.appendChild(video);
          modal.appendChild(captureBtn);
          modal.appendChild(cancelBtn);
          document.body.appendChild(modal);
          
          captureBtn.onclick = () => {
            // Capture current frame
            context?.drawImage(video, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                const file = new File([blob], `camera_${Date.now()}.png`, { type: 'image/png' });
                handleFileUpload(file);
              }
              // Cleanup
              stream.getTracks().forEach(track => track.stop());
              document.body.removeChild(modal);
            }, 'image/png');
          };
          
          cancelBtn.onclick = () => {
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(modal);
          };
        };
      } else {
        // Fallback: use file input with camera capture attribute
        const cameraInput = document.createElement('input');
        cameraInput.type = 'file';
        cameraInput.accept = 'image/*';
        cameraInput.capture = 'environment';
        cameraInput.onchange = (e: any) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(file);
          }
        };
        cameraInput.click();
      }
    } catch (error) {
      console.error('Camera capture failed:', error);
      // Fallback to file input
      const cameraInput = document.createElement('input');
      cameraInput.type = 'file';
      cameraInput.accept = 'image/*';
      cameraInput.capture = 'environment';
      cameraInput.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          handleFileUpload(file);
        }
      };
      cameraInput.click();
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
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
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
        onChange={handleFileChange}
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
          avatar={participant.avatar}
          isOnline={participant.isOnline}
          onClose={onClose}
        />
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-btn-primary border-t-transparent" />
              <p className="mt-2 text-sm font-medium text-text-secondary">Loading messages...</p>
            </div>
          </div>
        ) : creatingDialog ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-btn-primary border-t-transparent" />
              <p className="mt-2 text-sm font-medium text-text-secondary">Creating conversation...</p>
            </div>
          </div>
        ) : !currentDialog && !profile.connectyCubeUserId ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-text-secondary">Cannot start conversation</p>
              <p className="mt-1 text-xs text-text-placeholder">User does not have ConnectyCube ID</p>
            </div>
          </div>
        ) : uploadingFile ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-btn-primary border-t-transparent" />
              <p className="mt-2 text-sm font-medium text-text-secondary">Uploading file... {uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <MessageBody messages={messages} currentUserId={currentUserId?.toString() || getCurrentUserId()?.toString() || '14922637'} participantAvatar={participant.avatar} />
        )}
        
        {/* Emoji Picker */}
        {isEmojiPickerOpen && (
          <div className="border-t border-[#DCE5EF] bg-white px-4 py-3">
            <div className="grid grid-cols-8 gap-2">
              {commonEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleEmojiSelect(emoji)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DCE5EF] bg-[#F6FBFF] text-2xl hover:border-btn-primary hover:bg-[#F0F7FF] transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <MessageInput
          value={inputValue}
          isRecording={isRecording}
          isPaused={isPaused}
          isAttachmentOpen={isAttachmentOpen}
          recordingDuration={formatDuration(recordingSeconds)}
          attachmentActions={attachmentActions}
          onChange={handleInputChange}
          onSend={handleSend}
          onStartRecording={handleStartRecording}
          onCancelRecording={handleCancelRecording}
          onSendRecording={handleSendRecording}
          onPauseToggle={handlePauseToggle}
          onToggleAttachment={() => setIsAttachmentOpen((isOpen) => !isOpen)}
          onCloseAttachment={() => setIsAttachmentOpen(false)}
          onAttachmentSelect={handleAttachmentSelect}
          onToggleEmojiPicker={handleToggleEmojiPicker}
        />
      </aside>
    </div>
  );
}
