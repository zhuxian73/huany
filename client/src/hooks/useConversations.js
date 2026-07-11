import { useState, useRef, useEffect, useCallback } from 'react'
import { DEFAULT_MODELS, DEFAULT_MODEL_ID } from '../constants/models'
import { getSimulatedReply, generateTitle } from '../utils/simulateReply'

// 生成唯一 ID
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// 初始演示数据
const createInitialConversations = () => {
  const now = Date.now()
  return [
    {
      id: 'c1',
      title: '产品主视觉设计方案',
      modelId: DEFAULT_MODEL_ID,
      createdAt: now,
      updatedAt: now,
      messages: [
        {
          id: '1',
          role: 'ai',
          content: '你好！我很乐意帮你梳理产品主视觉设计方案。以下是几个方向供参考：\n\n1. **极简科技风** — 白色为主，蓝色点缀，适合 SaaS / 工具类产品\n2. **暗色专业风** — 深色背景 + 高饱和渐变，适合开发者工具\n3. **温暖人文风** — 柔和色调 + 圆角 + 插画，适合教育 / 健康类\n\n你做的产品属于哪个领域？我可以根据具体场景来细化方案。',
          tokens: { input: 156, output: 287, time: '1.8s' },
          createdAt: now
        },
        {
          id: '2',
          role: 'user',
          content: '我们是做服装供应链 SaaS 平台的，主要面向品牌方 and 工厂。希望视觉上专业、可信赖，同时保持现代感。',
          createdAt: now
        },
        {
          id: '3',
          role: 'ai',
          content: '了解了，服装供应链 SaaS 这个场景很适合 **极简科技风**，我给你一个具体的方案：\n\n**色彩系统**\n\n- 主色：`#1a1a2e` 深蓝黑 — 专业稳重\n- 强调色：`#4d7cfe` 科技蓝 — 代表效率与信任\n- 背景：`#fafbfc` 冷灰白 — 清爽干净\n\n**关键页面**\n\n- **仪表盘**：数据卡片 + 图表 + 实时状态\n- **订单追踪**：时间线视图 + 状态流转\n- **库存看板**：表格 + 预警标记\n\n需要我针对某个页面出详细的设计稿吗？',
          tokens: { input: 210, output: 398, time: '2.4s' },
          createdAt: now
        }
      ]
    },
    {
      id: 'c2',
      title: 'API 接口文档整理',
      modelId: DEFAULT_MODEL_ID,
      createdAt: now - 86400000,
      updatedAt: now - 86400000,
      messages: []
    }
  ]
}

export const useConversations = () => {
  const [conversations, setConversations] = useState(createInitialConversations)
  const [currentConversationId, setCurrentConversationId] = useState('c1')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [replyTarget, setReplyTarget] = useState(null)

  // 模型相关状态
  // TODO: 接入后端时改为 const [availableModels, setAvailableModels] = useState(DEFAULT_MODELS)
  const [availableModels] = useState(DEFAULT_MODELS)
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL_ID)
  const [isLoadingModels] = useState(false)

  // 定时器引用，用于 cleanup 防止内存泄漏
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)

  // 组件卸载时清理所有定时器
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // TODO: 接入后端时在此加载模型列表
  useEffect(() => {
    // 需要先声明 setAvailableModels（见上方 useState）
    // fetch('/api/models')
    //   .then(res => res.json())
    //   .then(data => {
    //     setAvailableModels(data.models)
    //     setSelectedModelId(data.defaultModelId)
    //   })
  }, [])

  // 派生值
  const currentConversation = conversations.find(c => c.id === currentConversationId) || null
  const currentMessages = currentConversation?.messages ?? []
  const selectedModel = availableModels.find(m => m.id === selectedModelId)

  // 更新指定会话的消息
  const updateConversation = useCallback((conversationId, updater) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv
      const next = typeof updater === 'function' ? updater(conv) : updater
      return { ...next, updatedAt: Date.now() }
    }))
  }, [])

  // 停止生成
  const stopGenerating = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsGenerating(false)
  }, [])

  // 新建会话
  const handleNewConversation = useCallback(() => {
    stopGenerating()
    const newId = generateId()
    const now = Date.now()
    const newConversation = {
      id: newId,
      title: '新对话',
      modelId: selectedModelId,
      createdAt: now,
      updatedAt: now,
      messages: []
    }
    setConversations(prev => [newConversation, ...prev])
    setCurrentConversationId(newId)
    setReplyTarget(null)
  }, [selectedModelId, stopGenerating])

  // 选择会话（切换时停止当前生成）
  const handleSelectConversation = useCallback((id) => {
    if (id === currentConversationId) return
    stopGenerating()
    setCurrentConversationId(id)
    setReplyTarget(null)
  }, [currentConversationId, stopGenerating])

  // 打开删除确认弹窗
  const handleDeleteConversation = useCallback((id) => {
    const conversation = conversations.find(c => c.id === id)
    if (!conversation) return
    setDeleteTarget(conversation)
  }, [conversations])

  // 确认删除
  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return
    const id = deleteTarget.id
    setConversations(prev => prev.filter(c => c.id !== id))

    if (currentConversationId === id) {
      const remaining = conversations.filter(c => c.id !== id)
      if (remaining.length > 0) {
        setCurrentConversationId(remaining[0].id)
      } else {
        setCurrentConversationId(null)
      }
    }
    setDeleteTarget(null)
  }, [deleteTarget, currentConversationId, conversations])

  const cancelDelete = useCallback(() => {
    setDeleteTarget(null)
  }, [])

  // 重命名会话
  const handleRenameConversation = useCallback((id, newTitle) => {
    const title = newTitle.trim()
    if (!title) return
    setConversations(prev => prev.map(conv =>
      conv.id === id ? { ...conv, title, updatedAt: Date.now() } : conv
    ))
  }, [])

  // 切换模型
  const handleModelChange = useCallback((modelId) => {
    setSelectedModelId(modelId)
    // TODO: 后端接入时可调用 API 保存当前会话的模型选择
  }, [])

  // 发送消息
  const handleSendMessage = useCallback(({ content, images = [], replyTo = null }) => {
    if (isGenerating) return
    if (!content.trim() && images.length === 0) return

    const conversationId = currentConversationId
    if (!conversationId) return

    const now = Date.now()
    const newUserMsg = {
      id: generateId(),
      role: 'user',
      content,
      images,
      replyTo,
      createdAt: now
    }

    // 添加用户消息，并在首条消息时自动生成标题
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv
      const isFirstMessage = conv.messages.length === 0
      return {
        ...conv,
        messages: [...conv.messages, newUserMsg],
        title: isFirstMessage ? generateTitle(content) : conv.title,
        updatedAt: now
      }
    }))

    setReplyTarget(null)
    setIsGenerating(true)

    // 模拟 AI 思考和流式回复
    timeoutRef.current = setTimeout(() => {
      const aiResponse = getSimulatedReply(content)
      const aiMsgId = generateId()
      const newAiMsg = {
        id: aiMsgId,
        role: 'ai',
        content: '',
        tokens: {
          input: Math.floor(Math.random() * 100 + 100),
          output: 0,
          time: '0s'
        },
        createdAt: Date.now()
      }

      updateConversation(conversationId, conv => ({
        ...conv,
        messages: [...conv.messages, newAiMsg]
      }))

      // 模拟流式输出
      let currentContent = ''
      const chars = [...aiResponse]
      let i = 0

      intervalRef.current = setInterval(() => {
        if (i < chars.length) {
          currentContent += chars[i]
          updateConversation(conversationId, conv => {
            const msgs = conv.messages
            const last = msgs[msgs.length - 1]
            if (last && last.role === 'ai' && last.id === aiMsgId) {
              return {
                ...conv,
                messages: [...msgs.slice(0, -1), {
                  ...last,
                  content: currentContent,
                  tokens: {
                    ...last.tokens,
                    output: Math.floor(currentContent.length / 3.5),
                    time: `${(i * 0.05).toFixed(1)}s`
                  }
                }]
              }
            }
            return conv
          })
          i++
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          setIsGenerating(false)
        }
      }, 30)
    }, 1000)
  }, [isGenerating, currentConversationId, updateConversation])

  return {
    // 数据
    conversations,
    currentConversationId,
    currentConversation,
    currentMessages,
    // 会话操作
    handleNewConversation,
    handleSelectConversation,
    handleDeleteConversation,
    confirmDelete,
    cancelDelete,
    deleteTarget,
    handleRenameConversation,
    // 消息操作
    handleSendMessage,
    isGenerating,
    stopGenerating,
    replyTarget,
    setReplyTarget,
    // 模型
    availableModels,
    selectedModelId,
    selectedModel,
    isLoadingModels,
    handleModelChange,
  }
}
