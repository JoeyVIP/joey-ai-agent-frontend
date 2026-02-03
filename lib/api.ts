import { Project, TaskLog, User } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = {
  // Auth
  githubLogin: async (githubData: {
    github_id: string
    username: string
    email?: string
    avatar_url?: string
  }): Promise<User> => {
    const res = await fetch(`${API_BASE_URL}/api/auth/github-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(githubData),
    })
    if (!res.ok) throw new Error('Failed to login')
    return res.json()
  },

  getCurrentUser: async (userId: number): Promise<User> => {
    const res = await fetch(`${API_BASE_URL}/api/auth/me?user_id=${userId}`)
    if (!res.ok) throw new Error('Failed to get user')
    return res.json()
  },

  // Projects
  listProjects: async (userId: number = 1, skip = 0, limit = 20): Promise<Project[]> => {
    const res = await fetch(
      `${API_BASE_URL}/api/projects?user_id=${userId}&skip=${skip}&limit=${limit}`
    )
    if (!res.ok) throw new Error('Failed to fetch projects')
    return res.json()
  },

  getProject: async (projectId: number, userId: number = 1): Promise<Project> => {
    const res = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}?user_id=${userId}`
    )
    if (!res.ok) throw new Error('Failed to fetch project')
    return res.json()
  },

  createProject: async (
    data: {
      name: string
      description?: string
      task_prompt: string
    },
    userId: number = 1
  ): Promise<Project> => {
    const res = await fetch(`${API_BASE_URL}/api/projects?user_id=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create project')
    return res.json()
  },

  deleteProject: async (projectId: number, userId: number = 1): Promise<void> => {
    const res = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}?user_id=${userId}`,
      { method: 'DELETE' }
    )
    if (!res.ok) throw new Error('Failed to delete project')
  },

  getProjectLogs: async (projectId: number, userId: number = 1): Promise<TaskLog[]> => {
    const res = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/logs?user_id=${userId}`
    )
    if (!res.ok) throw new Error('Failed to fetch logs')
    return res.json()
  },

  // SSE Stream
  streamProjectProgress: (projectId: number, userId: number = 1): EventSource => {
    return new EventSource(
      `${API_BASE_URL}/api/projects/${projectId}/stream?user_id=${userId}`
    )
  },

  // Uploads
  uploadFiles: async (files: File[]): Promise<{
    success: boolean
    files: Array<{ filename: string; path: string; size: number }>
    total: number
  }> => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const res = await fetch(`${API_BASE_URL}/api/uploads/files`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) throw new Error('Failed to upload files')
    return res.json()
  },
}
