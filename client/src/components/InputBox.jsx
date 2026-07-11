import { useState, useRef } from 'react'

// 输入框组件
export const InputBox = ({ onSend, isGenerating, onStop, replyTarget, onCancelReply, textareaRef }) => {
  const [userInput, setUserInput] = useState('')
  const [attachedImages, setAttachedImages] = useState([])
  const fileInputRef = useRef(null)

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }

  const handleInput = (e) => {
    setUserInput(e.target.value)
    autoResize()
  }

  const handleSend = () => {
    if (isGenerating) {
      onStop()
      return
    }
    if (!userInput.trim() && attachedImages.length === 0) return

    onSend({ content: userInput, images: attachedImages, replyTo: replyTarget })
    setUserInput('')
    setAttachedImages([])
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (event) => {
        setAttachedImages(prev => [...prev, { id: Date.now() + Math.random(), src: event.target.result, name: file.name }])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const removeImage = (id) => {
    setAttachedImages(prev => prev.filter(img => img.id !== id))
  }

  return (
    <div className="px-6 pt-4 pb-6 shrink-0">
      <div className="max-w-3xl mx-auto relative">
        {replyTarget && (
          <div className="flex items-center gap-2.5 px-3.5 py-2 mb-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[12px] text-[#64748b]">
            <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">回复 {replyTarget.role === 'ai' ? 'AI' : 'User'}: {replyTarget.content}</span>
            <button className="w-5 h-5 border-none bg-transparent text-[#94a3b8] cursor-pointer rounded-sm flex items-center justify-center text-[16px] shrink-0 hover:bg-[#e2e8f0] hover:text-[#475569]" onClick={onCancelReply}>&times;</button>
          </div>
        )}
        {attachedImages.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-2">
            {attachedImages.map(img => (
              <div key={img.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border-default bg-bg-sidebar group">
                <img className="w-full h-full object-cover" src={img.src} alt={img.name} />
                <button className="absolute top-0.5 right-0.5 w-4.5 h-4.5 border-none bg-black/55 text-white rounded-full cursor-pointer text-[12px] flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100" onClick={() => removeImage(img.id)}>&times;</button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2 px-3.5 py-2.5 border border-border-hover rounded-2xl bg-bg-input transition-all focus-within:border-accent focus-within:ring-3 focus-within:ring-accent-ring focus-within:bg-bg-primary">
          <button className="w-7.5 h-7.5 border-none bg-transparent text-[#94a3b8] cursor-pointer rounded-lg flex items-center justify-center transition-colors shrink-0 hover:text-accent hover:bg-accent/8" onClick={() => fileInputRef.current?.click()} title="上传图片">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileChange} />
          <textarea
            ref={textareaRef}
            className="flex-1 border-none bg-transparent resize-none outline-none font-inherit text-[14px] leading-[1.5] text-text-body min-h-[24px] max-h-[200px] py-0.5"
            value={userInput}
            placeholder="输入消息… (Enter 发送, Shift+Enter 换行)"
            rows={1}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          ></textarea>
          <button
            className={`w-7.5 h-7.5 border-none rounded-lg flex items-center justify-center transition-all shrink-0 active:scale-95 ${(userInput.trim() || attachedImages.length > 0 || isGenerating) ? 'bg-accent cursor-pointer hover:bg-accent-hover' : 'bg-border-hover cursor-default'} ${isGenerating ? 'bg-danger animate-pulse-stop' : ''}`}
            onClick={handleSend}
            disabled={!userInput.trim() && attachedImages.length === 0 && !isGenerating}
          >
            {!isGenerating ? (
              <svg className="text-white" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            ) : (
              <svg className="text-white" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2"></rect>
              </svg>
            )}
          </button>
        </div>
        <p className="text-center text-[11px] text-text-muted mt-2.5">AI 助手可能产生不准确信息，请注意甄别</p>
      </div>
    </div>
  )
}
