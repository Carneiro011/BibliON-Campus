// src/types/index.ts

export type Role = 'STUDENT' | 'MODERATOR' | 'ADMIN'
export type ResourceType = 'PDF' | 'VIDEO' | 'LINK' | 'ARTICLE'
export type ResourceStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl?: string
  institution?: string
  bio?: string
  createdAt: string
  _count?: { resources: number; ratings: number; comments: number }
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface Discipline {
  id: string
  name: string
  slug: string
  color: string
  _count?: { resources: number }
}

export interface Resource {
  id: string
  title: string
  description?: string
  type: ResourceType
  url: string
  fileSize?: number
  summary?: string
  status: ResourceStatus
  viewCount: number
  createdAt: string
  updatedAt: string
  user: Pick<User, 'id' | 'name' | 'avatarUrl'>
  discipline?: Pick<Discipline, 'id' | 'name' | 'color'>
  tags: Tag[]
  avgRating?: number
  ratingCount: number
  _count?: { comments: number }
}

export interface Comment {
  id: string
  body: string
  createdAt: string
  user: Pick<User, 'id' | 'name' | 'avatarUrl'>
  replies?: Comment[]
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    pages: number
    query?: string
  }
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface AiAnalysis {
  summary: string
  tags: string[]
}
