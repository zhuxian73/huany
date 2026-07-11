// 模拟 AI 回复（后续接入真实 LLM API 时替换此模块）

export const getSimulatedReply = (text) => {
  if (text.includes('服装') || text.includes('SaaS')) {
    return `好的，服装供应链场景下建议采用**深蓝+冷灰**配色体系，突出数据可信度。\n\n### 推荐组件\n- 数据仪表盘：实时看板 + 趋势图\n- 订单追踪：时间线 + 状态标签\n- 库存预警：衡量标准 + 补货建议\n\n> 需要我输出具体的 CSS 变量方案吗？`
  }
  if (text.includes('API') || text.includes('接口')) {
    return `关于 API 设计，建议遵循以下原则：\n\n1. **RESTful 规范** — 统一资源命名\n2. **分页与过滤** — \`?page=1&size=20\`\n3. **错误码标准化** — 统一的错误响应格式\n\n\`\`\`json\n{\n  "code": 0,\n  "data": {},\n  "message": "ok"\n}\n\`\`\``
  }
  return `收到。请提供更多具体信息，我可以给你更有针对性的建议。`
}

// 根据首条用户消息自动生成会话标题
export const generateTitle = (text) => {
  const trimmed = text.trim().replace(/[#*`>\-\n]/g, ' ').replace(/\s+/g, ' ').trim()
  if (!trimmed) return '新对话'
  const MAX_LENGTH = 20
  return trimmed.length > MAX_LENGTH ? trimmed.slice(0, MAX_LENGTH) + '…' : trimmed
}
