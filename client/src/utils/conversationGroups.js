// 按日期对会话进行分组

const GROUP_LABELS = {
  today: '今天',
  yesterday: '昨天',
  earlier: '更早'
}

const startOfDay = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export const groupConversationsByDate = (conversations) => {
  const todayStart = startOfDay(new Date())
  const yesterdayStart = todayStart - 86400000

  const buckets = { today: [], yesterday: [], earlier: [] }

  conversations.forEach((conv) => {
    const ts = conv.updatedAt || conv.createdAt || Date.now()
    if (ts >= todayStart) {
      buckets.today.push(conv)
    } else if (ts >= yesterdayStart) {
      buckets.yesterday.push(conv)
    } else {
      buckets.earlier.push(conv)
    }
  })

  // 返回带标签的分组数组，过滤掉空分组
  return Object.entries(buckets)
    .filter(([, items]) => items.length > 0)
    .map(([key, items]) => ({ key, label: GROUP_LABELS[key], items }))
}
