import { useState, useRef, useEffect } from 'react'
import { marked } from 'marked'

// Configure marked
marked.setOptions({ breaks: true, gfm: true })

function App() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'ai',
      content: '你好！我很乐意帮你梳理产品主视觉设计方案。以下是几个方向供参考：\n\n1. **极简科技风** — 白色为主，蓝色点缀，适合 SaaS / 工具类产品\n2. **暗色专业风** — 深色背景 + 高饱和渐变，适合开发者工具\n3. **温暖人文风** — 柔和色调 + 圆角 + 插画，适合教育 / 健康类\n\n你做的产品属于哪个领域？我可以根据具体场景来细化方案。',
      tokens: { input: 156, output: 287, time: '1.8s' }
    },
    {
      id: '2',
      role: 'user',
      content: '我们是做服装供应链 SaaS 平台的，主要面向品牌方 and 工厂。希望视觉上专业、可信赖，同时保持现代感。'
    },
    {
      id: '3',
      role: 'ai',
      content: '了解了，服装供应链 SaaS 这个场景很适合 **极简科技风**，我给你一个具体的方案：\n\n**色彩系统**\n\n- 主色：`#1a1a2e` 深蓝黑 — 专业稳重\n- 强调色：`#4d7cfe` 科技蓝 — 代表效率与信任\n- 背景：`#fafbfc` 冷灰白 — 清爽干净\n\n**关键页面**\n\n- **仪表盘**：数据卡片 + 图表 + 实时状态\n- **订单追踪**：时间线视图 + 状态流转\n- **库存看板**：表格 + 预警标记\n\n需要我针对某个页面出详细的设计稿吗？',
      tokens: { input: 210, output: 398, time: '2.4s' }
    }
  ])
  const [userInput, setUserInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('apikey')
  const [replyTarget, setReplyTarget] = useState(null)
  const [attachedImages, setAttachedImages] = useState([])
  const [conversations, setConversations] = useState([
    { id: 'c1', title: '产品主视觉设计方案' },
    { id: 'c2', title: 'API 接口文档整理' }
  ])
  const [currentConversationId, setCurrentConversationId] = useState('c1')
  const [deleteTarget, setDeleteTarget] = useState(null)
  
  // 模型列表：当前为静态数据，后续可通过 useEffect 接入后端 API
  const [availableModels, setAvailableModels] = useState([
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
    { id: 'gpt-4o-mini', name: 'GPT-4o mini', provider: 'OpenAI' },
    { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' }
  ])
  const [selectedModelId, setSelectedModelId] = useState('gpt-4o')
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
  
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const modelDropdownRef = useRef(null)

  const selectedModel = availableModels.find(m => m.id === selectedModelId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isGenerating])

  // 点击外部关闭模型下拉菜单
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target)) {
        setIsModelDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // TODO: 从后端加载可用模型列表
  useEffect(() => {
    // 接入后端时在此调用 /api/models，例如：
    // fetch('/api/models')
    //   .then(res => res.json())
    //   .then(data => {
    //     setAvailableModels(data.models)
    //     setSelectedModelId(data.defaultModelId)
    //   })
  }, [])

  const handleInput = (e) => {
    setUserInput(e.target.value)
    autoResize()
  }

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }

  const handleSend = async () => {
    if (isGenerating) {
      setIsGenerating(false)
      return
    }

    if (!userInput.trim() && attachedImages.length === 0) return

    const newUserMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      images: attachedImages,
      replyTo: replyTarget
    }

    setMessages(prev => [...prev, newUserMsg])
    setUserInput('')
    setAttachedImages([])
    setReplyTarget(null)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    
    setIsGenerating(true)
    
    // Simulate AI thinking and response
    setTimeout(() => {
      const aiResponse = getSimulatedReply(userInput)
      const newAiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: '',
        tokens: {
          input: Math.floor(Math.random() * 100 + 100),
          output: 0,
          time: '0s'
        }
      }
      
      setMessages(prev => [...prev, newAiMsg])
      
      // Simulate streaming
      let currentContent = ''
      const chars = [...aiResponse]
      let i = 0
      const interval = setInterval(() => {
        if (i < chars.length) {
          currentContent += chars[i]
          setMessages(prev => {
            const last = prev[prev.length - 1]
            if (last && last.role === 'ai' && last.id === newAiMsg.id) {
              return [
                ...prev.slice(0, -1),
                { ...last, content: currentContent, tokens: { ...last.tokens, output: Math.floor(currentContent.length / 3.5), time: `${(i * 0.05).toFixed(1)}s` } }
              ]
            }
            return prev
          })
          i++
        } else {
          clearInterval(interval)
          setIsGenerating(false)
        }
      }, 30)
    }, 1000)
  }

  const getSimulatedReply = (text) => {
    if (text.includes('服装') || text.includes('SaaS')) {
      return `好的，服装供应链场景下建议采用**深蓝+冷灰**配色体系，突出数据可信度。\n\n### 推荐组件\n- 数据仪表盘：实时看板 + 趋势图\n- 订单追踪：时间线 + 状态标签\n- 库存预警：衡量标准 + 补货建议\n\n> 需要我输出具体的 CSS 变量方案吗？`
    }
    if (text.includes('API') || text.includes('接口')) {
      return `关于 API 设计，建议遵循以下原则：\n\n1. **RESTful 规范** — 统一资源命名\n2. **分页与过滤** — \`?page=1&size=20\`\n3. **错误码标准化** — 统一的错误响应格式\n\n\`\`\`json\n{\n  "code": 0,\n  "data": {},\n  "message": "ok"\n}\n\`\`\``
    }
    return `收到。请提供更多具体信息，我可以给你更有针对性的建议。`
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

  const handleDeleteConversation = (e, id) => {
    e.stopPropagation()
    const conversation = conversations.find(c => c.id === id)
    if (!conversation) return
    setDeleteTarget(conversation)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    const id = deleteTarget.id
    const nextConversations = conversations.filter(c => c.id !== id)
    setConversations(nextConversations)

    if (currentConversationId === id) {
      if (nextConversations.length > 0) {
        setCurrentConversationId(nextConversations[0].id)
      } else {
        setCurrentConversationId(null)
        setMessages([])
      }
    }
    setDeleteTarget(null)
  }

  const handleNewConversation = () => {
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const newConversation = { id: newId, title: '新对话' }
    setConversations(prev => [newConversation, ...prev])
    setCurrentConversationId(newId)
    setMessages([])
  }

  const handleModelChange = (modelId) => {
    setSelectedModelId(modelId)
    setIsModelDropdownOpen(false)
    // TODO: 后端接入时，可在此处调用 API 保存当前对话的模型选择
  }

  return (
    <div className="flex w-full h-dvh font-sans text-text-body bg-bg-primary">
      {/* Sidebar */}
      <aside className="w-[260px] min-w-[260px] bg-bg-sidebar flex flex-col border-r border-border-default hidden md:flex">
        <div className="p-3 shrink-0">
          <div className="flex items-center gap-2 text-[15px] font-semibold text-text-primary px-3 py-2 mb-1">
            <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center">
              <div className="w-1.5 h-2.5 border-2 border-white border-t-0 border-l-0 rotate-45 translate-[-1px, 1px]"></div>
            </div>
            AI 助手
          </div>
          <button className="flex items-center gap-2 w-full px-3.5 py-2.5 border border-border-hover rounded-lg bg-bg-primary text-text-body text-[13px] cursor-pointer transition-colors hover:bg-bg-hover hover:border-text-muted" onClick={handleNewConversation}>
            <svg className="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            新对话
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2.5 py-2">
          <div className="text-[11px] font-medium text-text-muted uppercase tracking-wider px-2.5 pt-3 pb-1.5">今天</div>
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer text-text-body transition-colors relative ${conversation.id === currentConversationId ? 'bg-bg-active' : 'hover:bg-bg-hover'}`}
              onClick={() => setCurrentConversationId(conversation.id)}
            >
              <svg className="opacity-40 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis text-[13px]">{conversation.title}</span>
              <div className="opacity-0 flex gap-0.5 transition-opacity group-hover:opacity-100">
                <button className="w-6 h-6 border-none bg-transparent text-text-muted cursor-pointer rounded-sm flex items-center justify-center hover:bg-bg-active hover:text-text-body" title="重命名">···</button>
                <button
                  className="w-6 h-6 border-none bg-transparent text-text-muted cursor-pointer rounded-sm flex items-center justify-center hover:bg-bg-active hover:text-text-body"
                  title="删除"
                  onClick={(e) => handleDeleteConversation(e, conversation.id)}
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
          {conversations.length === 0 && (
            <div className="px-3 py-2.5 text-[13px] text-text-muted text-center">暂无历史对话</div>
          )}
        </nav>

        <div className="p-3 border-t border-border-default shrink-0 flex items-center justify-between gap-1">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-bg-hover">
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-[12px] font-semibold shrink-0">Z</div>
            <span className="text-[13px] font-medium text-text-body">Zhu Xian</span>
          </div>
          <button className="w-7.5 h-7.5 border-none bg-transparent text-text-muted cursor-pointer rounded-md flex items-center justify-center transition-colors hover:text-text-body hover:bg-bg-hover" onClick={() => setIsSettingsOpen(true)} title="设置">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-bg-primary">
        <header className="px-6 py-3 border-b border-bg-hover flex items-center justify-between shrink-0">
          <span className="text-[16px] font-semibold text-text-primary">
            {conversations.find(c => c.id === currentConversationId)?.title ?? '新对话'}
          </span>
          <div className="relative" ref={modelDropdownRef}>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border-default rounded-3xl bg-bg-sidebar text-[12px] text-text-secondary cursor-pointer transition-colors hover:border-border-hover"
              onClick={() => setIsModelDropdownOpen(prev => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isModelDropdownOpen}
            >
              <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
              {selectedModel?.name ?? '选择模型'}
              <svg className={`transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            {isModelDropdownOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-56 bg-bg-primary border border-border-default rounded-xl shadow-xl py-1 z-50 animate-in" role="listbox">
                {availableModels.map((model) => (
                  <button
                    key={model.id}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left text-[13px] transition-colors ${selectedModelId === model.id ? 'text-text-primary bg-bg-active' : 'text-text-body hover:bg-bg-hover'}`}
                    onClick={() => handleModelChange(model.id)}
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
        </header>

        <div className="flex-1 overflow-y-auto py-6">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-10">
              <div className="text-center max-w-[420px]">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-5">
                  <div className="w-3.5 h-5.5 border-3 border-white border-t-0 border-l-0 rotate-45 translate-[-2px, 4px]"></div>
                </div>
                <h2 className="text-[22px] font-semibold text-text-primary tracking-tight mb-2">你好，我是 AI 助手</h2>
                <p className="text-text-secondary text-[14px] leading-relaxed mb-6">我可以帮你写代码、设计方案、整理文档或者只是聊聊天。你想从哪里开始？</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button className="px-4 py-2 border border-border-default rounded-3xl bg-bg-primary text-text-body text-[13px] cursor-pointer transition-colors hover:bg-bg-sidebar hover:border-border-hover" onClick={() => setUserInput('帮我设计一个 SaaS 产品的配色方案')}>设计配色方案</button>
                  <button className="px-4 py-2 border border-border-default rounded-3xl bg-bg-primary text-text-body text-[13px] cursor-pointer transition-colors hover:bg-bg-sidebar hover:border-border-hover" onClick={() => setUserInput('如何优化 React 组件性能？')}>React 性能优化</button>
                  <button className="px-4 py-2 border border-border-default rounded-3xl bg-bg-primary text-text-body text-[13px] cursor-pointer transition-colors hover:bg-bg-sidebar hover:border-border-hover" onClick={() => setUserInput('写一个 Python 爬虫示例')}>Python 爬虫</button>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="group py-5 border-b border-bg-sidebar last:border-none animate-in">
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
                    <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }} />
                    {msg.role === 'ai' && (
                      <>
                        <div className="flex gap-1 mt-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <button className="flex items-center gap-1 px-2 py-1 border border-border-default rounded-md bg-bg-primary text-text-secondary text-[12px] cursor-pointer transition-colors hover:bg-bg-sidebar" onClick={() => {
                            setReplyTarget(msg)
                            textareaRef.current?.focus()
                          }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
                            回复
                          </button>
                          <button className="flex items-center gap-1 px-2 py-1 border border-border-default rounded-md bg-bg-primary text-text-secondary text-[12px] cursor-pointer transition-colors hover:bg-bg-sidebar" onClick={() => navigator.clipboard.writeText(msg.content)}>
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
            ))
          )}
          {isGenerating && (
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
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-6 pt-4 pb-6 shrink-0">
          <div className="max-w-3xl mx-auto relative">
            {replyTarget && (
              <div className="flex items-center gap-2.5 px-3.5 py-2 mb-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[12px] text-[#64748b]">
                <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
                <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">回复 {replyTarget.role === 'ai' ? 'AI' : 'User'}: {replyTarget.content}</span>
                <button className="w-5 h-5 border-none bg-transparent text-[#94a3b8] cursor-pointer rounded-sm flex items-center justify-center text-[16px] shrink-0 hover:bg-[#e2e8f0] hover:text-[#475569]" onClick={() => setReplyTarget(null)}>&times;</button>
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
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center backdrop-blur-[2px]" onClick={() => setIsSettingsOpen(false)}>
          <div className="bg-bg-primary rounded-2xl w-[560px] max-w-[90vw] max-h-[85vh] overflow-y-auto shadow-2xl animate-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 pt-5 pb-0">
              <h3 className="text-[17px] font-semibold text-text-primary">设置</h3>
              <button className="w-7.5 h-7.5 border-none bg-transparent text-text-muted cursor-pointer rounded-md flex items-center justify-center text-[18px] transition-colors hover:bg-bg-hover hover:text-text-body" onClick={() => setIsSettingsOpen(false)}>&times;</button>
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
                    <input type="text" className="w-full px-3 py-2.5 border border-border-hover rounded-lg text-[13px] font-inherit text-text-body bg-bg-primary transition-all outline-none focus:border-accent focus:ring-3 focus:ring-accent/10" defaultValue="https://api.openai.com/v1" />
                  </div>
                  <div className="mb-5 last:mb-0">
                    <label className="block text-[13px] font-medium text-text-body mb-1.5">模型名称</label>
                    <select className="w-full px-3 py-2.5 border border-border-hover rounded-lg text-[13px] font-inherit text-text-body bg-bg-primary transition-all outline-none focus:border-accent focus:ring-3 focus:ring-accent/10" defaultValue="gpt-4o">
                      <option>gpt-4o</option>
                      <option>gpt-4o-mini</option>
                      <option>claude-3.5-sonnet</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-bg-hover">
              <button className="px-4.5 py-2 border border-border-hover rounded-lg bg-bg-primary text-text-body text-[13px] cursor-pointer transition-colors hover:bg-bg-sidebar" onClick={() => setIsSettingsOpen(false)}>取消</button>
              <button className="px-4.5 py-2 border-none rounded-lg bg-accent text-white text-[13px] font-medium cursor-pointer transition-colors hover:bg-accent-hover" onClick={() => setIsSettingsOpen(false)}>保存配置</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center backdrop-blur-[2px]" onClick={() => setDeleteTarget(null)}>
          <div className="bg-bg-primary rounded-2xl w-[400px] max-w-[90vw] shadow-2xl animate-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-6 pt-5 pb-3">
              <div className="w-9 h-9 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"></path></svg>
              </div>
              <h3 className="text-[16px] font-semibold text-text-primary">删除对话</h3>
            </div>
            <div className="px-6 pb-4">
              <p className="text-[13px] text-text-secondary leading-relaxed">
                确定要删除对话 “<span className="font-medium text-text-body">{deleteTarget.title}</span>” 吗？删除后将无法恢复。
              </p>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-bg-hover">
              <button className="px-4.5 py-2 border border-border-hover rounded-lg bg-bg-primary text-text-body text-[13px] cursor-pointer transition-colors hover:bg-bg-sidebar" onClick={() => setDeleteTarget(null)}>取消</button>
              <button className="px-4.5 py-2 border-none rounded-lg bg-danger text-white text-[13px] font-medium cursor-pointer transition-colors hover:bg-[#dc2626]" onClick={confirmDelete}>确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
