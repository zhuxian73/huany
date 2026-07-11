import { useState } from 'react'
import { DEFAULT_BASE_URL } from '../constants/models'

// 设置弹窗
export const SettingsModal = ({ isOpen, onClose, availableModels, selectedModelId, onModelChange }) => {
  const [activeTab, setActiveTab] = useState('apikey')
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center backdrop-blur-[2px]" onClick={onClose}>
      <div className="bg-bg-primary rounded-2xl w-[560px] max-w-[90vw] max-h-[85vh] overflow-y-auto shadow-2xl animate-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <h3 className="text-[17px] font-semibold text-text-primary">设置</h3>
          <button className="w-7.5 h-7.5 border-none bg-transparent text-text-muted cursor-pointer rounded-md flex items-center justify-center text-[18px] transition-colors hover:bg-bg-hover hover:text-text-body" onClick={onClose}>&times;</button>
        </div>
        <div className="flex gap-0 px-6 pt-3 border-b border-border-default">
          <button className={`px-4 py-2.5 text-[13px] cursor-pointer border-none bg-none border-b-2 transition-colors mb-[-1px] ${activeTab === 'apikey' ? 'text-accent border-accent font-medium' : 'text-text-secondary border-transparent hover:text-text-body'}`} onClick={() => setActiveTab('apikey')}>API Key</button>
          <button className={`px-4 py-2.5 text-[13px] cursor-pointer border-none bg-none border-b-2 transition-colors mb-[-1px] ${activeTab === 'model' ? 'text-accent border-accent font-medium' : 'text-text-secondary border-transparent hover:text-text-body'}`} onClick={() => setActiveTab('model')}>模型配置</button>
          <button className={`px-4 py-2.5 text-[13px] cursor-pointer border-none bg-none border-b-2 transition-colors mb-[-1px] ${activeTab === 'system' ? 'text-accent border-accent font-medium' : 'text-text-secondary border-transparent hover:text-text-body'}`} onClick={() => setActiveTab('system')}>系统</button>
        </div>

        <div className="p-6">
          {activeTab === 'apikey' && (
            <>
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-bg-sidebar border border-border-default rounded-lg">
                  <span className="w-2 h-2 rounded-full shrink-0 bg-success"></span>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium text-text-body">官方 API</div>
                    <div className="text-[12px] text-text-muted font-mono">sk-••••••••••••••••••••••3K8x</div>
                  </div>
                  <div className="flex gap-0.5">
                    <button className="w-6.5 h-6.5 border-none bg-transparent text-text-muted cursor-pointer rounded-sm flex items-center justify-center text-[13px] hover:bg-bg-active hover:text-text-body" title="编辑">&#9998;</button>
                    <button className="w-6.5 h-6.5 border-none bg-transparent text-text-muted cursor-pointer rounded-sm flex items-center justify-center text-[13px] hover:bg-bg-active hover:text-text-body" title="删除">&times;</button>
                  </div>
                </div>
              </div>
              <button className="flex items-center justify-center gap-1.5 w-full px-3.5 py-2 border border-dashed border-border-hover rounded-lg bg-transparent text-text-secondary text-[12px] cursor-pointer transition-colors hover:border-accent hover:text-accent">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                添加 API Key
              </button>
            </>
          )}
          {activeTab === 'model' && (
            <>
              <div className="mb-5 last:mb-0">
                <label className="block text-[13px] font-medium text-text-body mb-1.5">Base URL</label>
                <input type="text" className="w-full px-3 py-2.5 border border-border-hover rounded-lg text-[13px] font-inherit text-text-body bg-bg-primary transition-all outline-none focus:border-accent focus:ring-3 focus:ring-accent/10" value={baseUrl} onChange={e => setBaseUrl(e.target.value)} />
              </div>
              <div className="mb-5 last:mb-0">
                <label className="block text-[13px] font-medium text-text-body mb-1.5">模型名称</label>
                <select className="w-full px-3 py-2.5 border border-border-hover rounded-lg text-[13px] font-inherit text-text-body bg-bg-primary transition-all outline-none focus:border-accent focus:ring-3 focus:ring-accent/10" value={selectedModelId} onChange={e => onModelChange(e.target.value)}>
                  {availableModels.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          {activeTab === 'system' && (
            <>
              <div className="mb-5 last:mb-0">
                <label className="block text-[13px] font-medium text-text-body mb-1.5">主题</label>
                <select className="w-full px-3 py-2.5 border border-border-hover rounded-lg text-[13px] font-inherit text-text-body bg-bg-primary transition-all outline-none focus:border-accent focus:ring-3 focus:ring-accent/10" defaultValue="light">
                  <option value="light">浅色</option>
                  <option value="dark">深色</option>
                  <option value="system">跟随系统</option>
                </select>
              </div>
              <div className="mb-5 last:mb-0">
                <label className="block text-[13px] font-medium text-text-body mb-1.5">字体大小</label>
                <select className="w-full px-3 py-2.5 border border-border-hover rounded-lg text-[13px] font-inherit text-text-body bg-bg-primary transition-all outline-none focus:border-accent focus:ring-3 focus:ring-accent/10" defaultValue="medium">
                  <option value="small">小</option>
                  <option value="medium">中</option>
                  <option value="large">大</option>
                </select>
              </div>
              <div className="mb-5 last:mb-0">
                <label className="block text-[13px] font-medium text-text-body mb-1.5">语言</label>
                <select className="w-full px-3 py-2.5 border border-border-hover rounded-lg text-[13px] font-inherit text-text-body bg-bg-primary transition-all outline-none focus:border-accent focus:ring-3 focus:ring-accent/10" defaultValue="zh-CN">
                  <option value="zh-CN">简体中文</option>
                  <option value="en-US">English</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-bg-hover">
          <button className="px-4.5 py-2 border border-border-hover rounded-lg bg-bg-primary text-text-body text-[13px] cursor-pointer transition-colors hover:bg-bg-sidebar" onClick={onClose}>取消</button>
          <button className="px-4.5 py-2 border-none rounded-lg bg-accent text-white text-[13px] font-medium cursor-pointer transition-colors hover:bg-accent-hover" onClick={onClose}>保存配置</button>
        </div>
      </div>
    </div>
  )
}
