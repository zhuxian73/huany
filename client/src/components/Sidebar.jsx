import { groupConversationsByDate } from '../utils/conversationGroups'

// 侧边栏
export const Sidebar = ({ conversations, currentConversationId, onSelect, onNew, onDelete, onOpenSettings }) => {
  const groups = groupConversationsByDate(conversations)

  return (
    <aside className="w-[260px] min-w-[260px] bg-bg-sidebar flex flex-col border-r border-border-default hidden md:flex">
      <div className="p-3 shrink-0">
        <div className="flex items-center gap-2 text-[15px] font-semibold text-text-primary px-3 py-2 mb-1">
          <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center">
            <div className="w-1.5 h-2.5 border-2 border-white border-t-0 border-l-0 rotate-45 translate-[-1px, 1px]"></div>
          </div>
          AI 助手
        </div>
        <button className="flex items-center gap-2 w-full px-3.5 py-2.5 border border-border-hover rounded-lg bg-bg-primary text-text-body text-[13px] cursor-pointer transition-colors hover:bg-bg-hover hover:border-text-muted" onClick={onNew}>
          <svg className="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          新对话
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-2">
        {groups.length === 0 && (
          <div className="px-3 py-2.5 text-[13px] text-text-muted text-center">暂无历史对话</div>
        )}
        {groups.map(group => (
          <div key={group.key}>
            <div className="text-[11px] font-medium text-text-muted uppercase tracking-wider px-2.5 pt-3 pb-1.5">{group.label}</div>
            {group.items.map(conversation => (
              <div
                key={conversation.id}
                className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer text-text-body transition-colors relative ${conversation.id === currentConversationId ? 'bg-bg-active' : 'hover:bg-bg-hover'}`}
                onClick={() => onSelect(conversation.id)}
              >
                <svg className="opacity-40 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <span className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis text-[13px]">{conversation.title}</span>
                <div className="opacity-0 flex gap-0.5 transition-opacity group-hover:opacity-100">
                  <button className="w-6 h-6 border-none bg-transparent text-text-muted cursor-pointer rounded-sm flex items-center justify-center hover:bg-bg-active hover:text-text-body" title="重命名">···</button>
                  <button
                    className="w-6 h-6 border-none bg-transparent text-text-muted cursor-pointer rounded-sm flex items-center justify-center hover:bg-bg-active hover:text-text-body"
                    title="删除"
                    onClick={(e) => { e.stopPropagation(); onDelete(conversation.id) }}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-border-default shrink-0 flex items-center justify-between gap-1">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-bg-hover">
          <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-[12px] font-semibold shrink-0">Z</div>
          <span className="text-[13px] font-medium text-text-body">Zhu Xian</span>
        </div>
        <button className="w-7.5 h-7.5 border-none bg-transparent text-text-muted cursor-pointer rounded-md flex items-center justify-center transition-colors hover:text-text-body hover:bg-bg-hover" onClick={onOpenSettings} title="设置">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>
      </div>
    </aside>
  )
}
