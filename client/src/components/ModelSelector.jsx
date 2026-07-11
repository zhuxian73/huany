import { useState, useRef } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'

// 模型下拉选择器
export const ModelSelector = ({ models, selectedModelId, onChange, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setIsOpen(false))

  const selectedModel = models.find(m => m.id === selectedModelId)

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 border border-border-default rounded-3xl bg-bg-sidebar text-[12px] text-text-secondary cursor-pointer transition-colors hover:border-border-hover disabled:opacity-60"
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={isLoading}
      >
        <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
        {isLoading ? '加载中…' : (selectedModel?.name ?? '选择模型')}
        <svg className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      {isOpen && !isLoading && (
        <div className="absolute top-full right-0 mt-1.5 w-56 bg-bg-primary border border-border-default rounded-xl shadow-xl py-1 z-50 animate-in" role="listbox">
          {models.map((model) => (
            <button
              key={model.id}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left text-[13px] transition-colors ${selectedModelId === model.id ? 'text-text-primary bg-bg-active' : 'text-text-body hover:bg-bg-hover'}`}
              onClick={() => { onChange(model.id); setIsOpen(false) }}
              role="option"
              aria-selected={selectedModelId === model.id}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${selectedModelId === model.id ? 'bg-accent' : 'bg-text-muted'}`}></span>
              <span className="flex-1">{model.name}</span>
              {selectedModelId === model.id && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4d7cfe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
