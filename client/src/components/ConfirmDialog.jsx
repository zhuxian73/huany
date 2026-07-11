// 通用确认弹窗，复用现有 UI 风格
export const ConfirmDialog = ({ target, title = '删除对话', message, confirmText = '确认删除', onConfirm, onCancel }) => {
  if (!target) return null

  return (
    <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center backdrop-blur-[2px]" onClick={onCancel}>
      <div className="bg-bg-primary rounded-2xl w-[400px] max-w-[90vw] shadow-2xl animate-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-6 pt-5 pb-3">
          <div className="w-9 h-9 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"></path></svg>
          </div>
          <h3 className="text-[16px] font-semibold text-text-primary">{title}</h3>
        </div>
        <div className="px-6 pb-4">
          <p className="text-[13px] text-text-secondary leading-relaxed">
            {message || (<>确定要删除对话 “<span className="font-medium text-text-body">{target.title}</span>” 吗？删除后将无法恢复。</>)}
          </p>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-bg-hover">
          <button className="px-4.5 py-2 border border-border-hover rounded-lg bg-bg-primary text-text-body text-[13px] cursor-pointer transition-colors hover:bg-bg-sidebar" onClick={onCancel}>取消</button>
          <button className="px-4.5 py-2 border-none rounded-lg bg-danger text-white text-[13px] font-medium cursor-pointer transition-colors hover:bg-[#dc2626]" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  )
}
