import { useRef, useEffect } from 'react'
import { MessageRow } from './MessageRow'
import { InputBox } from './InputBox'
import { ModelSelector } from './ModelSelector'

// 空状态
const EmptyState = ({ onQuickInput }) => (
  <div className="flex-1 flex items-center justify-center p-10">
    <div className="text-center max-w-[420px]">
      <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-5">
        <div className="w-3.5 h-5.5 border-3 border-white border-t-0 border-l-0 rotate-45 translate-[-2px, 4px]"></div>
      </div>
      <h2 className="text-[22px] font-semibold text-text-primary tracking-tight mb-2">你好，我是 AI 助手</h2>
      <p className="text-text-secondary text-[14px] leading-relaxed mb-6">我可以帮你写代码、设计方案、整理文档或者只是聊聊天。你想从哪里开始？</p>
      <div className="flex flex-wrap gap-2 justify-center">
        <button className="px-4 py-2 border border-border-default rounded-3xl bg-bg-primary text-text-body text-[13px] cursor-pointer transition-colors hover:bg-bg-sidebar hover:border-border-hover" onClick={() => onQuickInput('帮我设计一个 SaaS 产品的配色方案')}>设计配色方案</button>
        <button className="px-4 py-2 border border-border-default rounded-3xl bg-bg-primary text-text-body text-[13px] cursor-pointer transition-colors hover:bg-bg-sidebar hover:border-border-hover" onClick={() => onQuickInput('如何优化 React 组件性能？')}>React 性能优化</button>
        <button className="px-4 py-2 border border-border-default rounded-3xl bg-bg-primary text-text-body text-[13px] cursor-pointer transition-colors hover:bg-bg-sidebar hover:border-border-hover" onClick={() => onQuickInput('写一个 Python 爬虫示例')}>Python 爬虫</button>
      </div>
    </div>
  </div>
)

// 生成中加载指示器
const GeneratingIndicator = () => (
  <div className="py-5 border-b border-bg-sidebar last:border-none animate-in">
    <div className="max-w-3xl mx-auto px-8 flex gap-4">
      <div className="w-7.5 h-7.5 rounded-sm shrink-0 mt-0.5 flex items-center justify-center text-[14px] bg-accent text-white font-bold">AI</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 px-4 py-2.5 bg-bg-hover rounded-xl w-fit">
          <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0s]"></div>
          <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    </div>
  </div>
)

// 聊天主区
export const ChatArea = ({
  conversation,
  messages,
  isGenerating,
  onSend,
  onStop,
  replyTarget,
  onSetReplyTarget,
  onCancelReply,
  models,
  selectedModelId,
  onModelChange,
  isLoadingModels,
  onQuickInput,
}) => {
  const textareaRef = useRef(null)
  const messagesEndRef = useRef(null)

  // 消息变化时自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isGenerating])

  const title = conversation?.title ?? '新对话'

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-bg-primary">
      <header className="px-6 py-3 border-b border-bg-hover flex items-center justify-between shrink-0">
        <span className="text-[16px] font-semibold text-text-primary">{title}</span>
        <ModelSelector
          models={models}
          selectedModelId={selectedModelId}
          onChange={onModelChange}
          isLoading={isLoadingModels}
        />
      </header>

      <div className="flex-1 overflow-y-auto py-6">
        {messages.length === 0 && !isGenerating ? (
          <EmptyState onQuickInput={onQuickInput} />
        ) : (
          messages.map(msg => (
            <MessageRow key={msg.id} msg={msg} onReply={onSetReplyTarget} textareaRef={textareaRef} />
          ))
        )}
        {isGenerating && <GeneratingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <InputBox
        textareaRef={textareaRef}
        onSend={onSend}
        isGenerating={isGenerating}
        onStop={onStop}
        replyTarget={replyTarget}
        onCancelReply={onCancelReply}
      />
    </main>
  )
}
