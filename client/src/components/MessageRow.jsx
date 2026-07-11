import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({ breaks: true, gfm: true })

// 安全复制到剪贴板，带错误处理
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 单条消息渲染
export const MessageRow = ({ msg, onReply, textareaRef }) => {
  return (
    <div className="group py-5 border-b border-bg-sidebar last:border-none animate-in">
      <div className="max-w-3xl mx-auto px-8 flex gap-4">
        <div className={`w-7.5 h-7.5 rounded-sm shrink-0 mt-0.5 flex items-center justify-center text-[14px] ${msg.role === 'ai' ? 'bg-accent text-white font-bold' : 'bg-[#1e293b] text-white font-semibold'}`}>
          {msg.role === 'ai' ? 'AI' : 'Z'}
        </div>
        <div className="flex-1 min-w-0 leading-[1.7] text-[14px] text-text-body prose prose-slate max-w-none prose-p:mb-3 prose-p:last:mb-0 prose-ul:pl-5 prose-ul:mb-3 prose-li:mb-1 prose-code:bg-inline-code prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:text-[13px] prose-code:font-mono prose-pre:bg-code-bg prose-pre:text-code-text prose-pre:p-4 prose-pre:rounded-lg prose-pre:mb-3 prose-pre:text-[13px] prose-pre:leading-relaxed prose-h3:text-[15px] prose-h3:font-semibold prose-h3:text-text-primary prose-h3:mt-4 prose-h3:mb-2 prose-blockquote:border-l-3 prose-blockquote:border-border-default prose-blockquote:pl-3 prose-blockquote:my-2 prose-blockquote:text-text-secondary">
          {msg.replyTo && (
            <div className="mb-2 p-2 bg-[#f8fafc] border-l-3 border-[#cbd5e1] rounded-r-md text-[12px] text-[#64748b] leading-relaxed flex items-start gap-1.5">
              <svg className="shrink-0 mt-0.5 opacity-50" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
              <div>
                <div className="font-semibold text-[#475569] mb-0.5">{msg.replyTo.role === 'ai' ? 'AI' : 'User'}</div>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[400px]">{msg.replyTo.content}</div>
              </div>
            </div>
          )}
          {msg.images && msg.images.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-2">
              {msg.images.map(img => (
                <div key={img.id} className="mt-2 rounded-lg overflow-hidden border border-border-default max-w-[320px]">
                  <img className="w-full h-auto block" src={img.src} alt={img.name} />
                </div>
              ))}
            </div>
          )}
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(msg.content)) }} />
          {msg.role === 'ai' && (
            <>
              <div className="flex gap-1 mt-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button className="flex items-center gap-1 px-2 py-1 border border-border-default rounded-md bg-bg-primary text-text-secondary text-[12px] cursor-pointer transition-colors hover:bg-bg-sidebar" onClick={() => { onReply(msg); textareaRef.current?.focus() }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
                  回复
                </button>
                <button className="flex items-center gap-1 px-2 py-1 border border-border-default rounded-md bg-bg-primary text-text-secondary text-[12px] cursor-pointer transition-colors hover:bg-bg-sidebar" onClick={() => copyToClipboard(msg.content)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  复制
                </button>
              </div>
              {msg.tokens && (
                <div className="flex items-center gap-3 mt-2.5 text-[11px] text-text-muted opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex items-center gap-1"><span className="w-1 h-1 bg-[#94a3b8] rounded-full"></span> 输入 {msg.tokens.input}</span>
                  <span className="flex items-center gap-1"><span className="w-1 h-1 bg-accent rounded-full"></span> 输出 {msg.tokens.output}</span>
                  <span className="flex items-center gap-1"><span className="w-1 h-1 bg-[#cbd5e1] rounded-full"></span> 耗时 {msg.tokens.time}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
