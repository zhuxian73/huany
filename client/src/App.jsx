import { useState } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Sidebar } from './components/Sidebar'
import { ChatArea } from './components/ChatArea'
import { SettingsModal } from './components/SettingsModal'
import { ConfirmDialog } from './components/ConfirmDialog'
import { useConversations } from './hooks/useConversations'

function App() {
  const {
    conversations,
    currentConversationId,
    currentConversation,
    currentMessages,
    handleNewConversation,
    handleSelectConversation,
    handleDeleteConversation,
    confirmDelete,
    cancelDelete,
    deleteTarget,
    handleSendMessage,
    isGenerating,
    stopGenerating,
    replyTarget,
    setReplyTarget,
    availableModels,
    selectedModelId,
    isLoadingModels,
    handleModelChange,
  } = useConversations()

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // 快捷输入：直接发送消息
  const handleQuickInput = (text) => {
    handleSendMessage({ content: text, images: [], replyTo: null })
  }

  return (
    <ErrorBoundary>
      <div className="flex w-full h-dvh font-sans text-text-body bg-bg-primary">
        <Sidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelect={handleSelectConversation}
          onNew={handleNewConversation}
          onDelete={handleDeleteConversation}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        <ChatArea
          conversation={currentConversation}
          messages={currentMessages}
          isGenerating={isGenerating}
          onSend={handleSendMessage}
          onStop={stopGenerating}
          replyTarget={replyTarget}
          onSetReplyTarget={setReplyTarget}
          onCancelReply={() => setReplyTarget(null)}
          models={availableModels}
          selectedModelId={selectedModelId}
          onModelChange={handleModelChange}
          isLoadingModels={isLoadingModels}
          onQuickInput={handleQuickInput}
        />
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          availableModels={availableModels}
          selectedModelId={selectedModelId}
          onModelChange={handleModelChange}
        />
        <ConfirmDialog
          target={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </div>
    </ErrorBoundary>
  )
}

export default App
