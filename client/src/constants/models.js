// 模型列表默认数据
// 后续接入后端时，可通过 API 替换此常量
export const DEFAULT_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'gpt-4o-mini', name: 'GPT-4o mini', provider: 'OpenAI' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' }
]

export const DEFAULT_MODEL_ID = 'gpt-4o'

// 默认 Base URL
export const DEFAULT_BASE_URL = 'https://api.openai.com/v1'
