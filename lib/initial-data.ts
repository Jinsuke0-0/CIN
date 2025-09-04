
export interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  isPublic: boolean
  views: number
  likes: number
  createdAt: string
  updatedAt: string
}

export const initialNotes: Note[] = [
  {
    id: "1",
    title: "BTC分析 - 2024年Q1戦略",
    content: "ビットコインの技術分析と今四半期の投資戦略について詳細に分析...",
    category: "技術分析",
    tags: ["BTC", "テクニカル分析", "Q1戦略"],
    isPublic: true,
    views: 234,
    likes: 12,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "ETH ステーキング戦略",
    content: "イーサリアム2.0ステーキングの最適化手法について...",
    category: "DeFi",
    tags: ["ETH", "ステーキング", "DeFi"],
    isPublic: false,
    views: 0,
    likes: 0,
    createdAt: "2024-01-12T14:30:00Z",
    updatedAt: "2024-01-12T14:30:00Z",
  },
  {
    id: "3",
    title: "DeFiプロトコル比較分析",
    content: "主要DeFiプラットフォームの利回り比較と投資戦略...",
    category: "ファンダメンタル分析",
    tags: ["DeFi", "利回り", "比較分析"],
    isPublic: true,
    views: 456,
    likes: 28,
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-10T09:15:00Z",
  },
]
