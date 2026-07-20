import { useState } from 'react';
import { X } from 'lucide-react';
import ConversationList, { type ConversationItem } from '@/components/messages/ConversationList';
import MessageDrawer from '@/components/messages/MessageDrawer';
import { getDialogById, createDialog, type Dialog } from '@/services/connectyCubeChat';

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<ConversationItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null);

  async function handleSelectConversation(conversation: ConversationItem) {
    setSelectedConversation(conversation);
    
    // Get or create dialog for this conversation
    let dialog: Dialog | null = null;
    if (conversation.id) {
      dialog = await getDialogById(conversation.id);
    }
    
    if (!dialog && conversation.user) {
      // Create new dialog if it doesn't exist
      dialog = await createDialog(conversation.user.id);
    }
    
    setCurrentDialog(dialog);
    setIsDrawerOpen(true);
  }

  function handleCloseDrawer() {
    setIsDrawerOpen(false);
    setSelectedConversation(null);
    setCurrentDialog(null);
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversation List */}
      <div className="w-full max-w-md border-r border-[#DCE5EF] bg-white lg:max-w-lg">
        <ConversationList
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversation?.id}
        />
      </div>

      {/* Chat Area - Desktop */}
      <div className="hidden flex-1 lg:block">
        {selectedConversation && currentDialog ? (
          <div className="flex h-full flex-col">
            <div className="border-b border-[#DCE5EF] bg-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedConversation.user?.avatar ? (
                    <img
                      src={selectedConversation.user.avatar}
                      alt={selectedConversation.user.fullName || selectedConversation.user.login}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-btn-primary text-white">
                      <span className="text-sm font-semibold">
                        {(selectedConversation.user?.fullName || selectedConversation.user?.login || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">
                      {selectedConversation.user?.fullName || selectedConversation.user?.login || 'Unknown User'}
                    </h2>
                    <p className="text-sm font-medium text-text-secondary">
                      {selectedConversation.user?.customData?.role || 'User'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseDrawer}
                  className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <MessageDrawer
                isOpen={true}
                profile={{
                  name: selectedConversation.user?.fullName || selectedConversation.user?.login || 'User',
                  username: selectedConversation.user?.login || 'username',
                  email: selectedConversation.user?.email,
                  profilePicture: selectedConversation.user?.avatar,
                  connectyCubeUserId: selectedConversation.user?.id,
                }}
                dialog={currentDialog}
                onClose={handleCloseDrawer}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg
                  className="h-8 w-8 text-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary">Select a conversation</h3>
              <p className="mt-1 text-sm font-medium text-text-secondary">
                Choose a conversation from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      <MessageDrawer
        isOpen={isDrawerOpen}
        profile={
          selectedConversation
            ? {
                name: selectedConversation.user?.fullName || selectedConversation.user?.login || 'User',
                username: selectedConversation.user?.login || 'username',
                email: selectedConversation.user?.email,
                profilePicture: selectedConversation.user?.avatar,
                connectyCubeUserId: selectedConversation.user?.id,
              }
            : {
                name: '',
                username: '',
              }
        }
        dialog={currentDialog || undefined}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
