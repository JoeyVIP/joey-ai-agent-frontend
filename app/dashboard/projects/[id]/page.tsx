'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Project, TaskLog, TaskStatus, SSEEvent } from '@/types'

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [logs, setLogs] = useState<TaskLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProject()
    loadLogs()
  }, [id])

  // SSE connection for real-time updates
  useEffect(() => {
    if (!project) return

    const eventSource = api.streamProjectProgress(parseInt(id))

    eventSource.onmessage = (event) => {
      const data: SSEEvent = JSON.parse(event.data)

      if (data.type === 'log') {
        setLogs((prev) => [
          ...prev,
          {
            id: data.log_id,
            project_id: parseInt(id),
            message: data.message,
            log_type: data.log_type,
            created_at: data.timestamp,
          },
        ])
      } else if (data.type === 'status') {
        setProject((prev) =>
          prev ? { ...prev, status: data.status } : null
        )
      } else if (data.type === 'complete') {
        setProject((prev) =>
          prev
            ? {
                ...prev,
                status: data.status,
                result_summary: data.result_summary,
                error_message: data.error_message,
              }
            : null
        )
        eventSource.close()
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [project, id])

  const loadProject = async () => {
    try {
      const data = await api.getProject(parseInt(id))
      setProject(data)
    } catch (error) {
      console.error('Failed to load project:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadLogs = async () => {
    try {
      const data = await api.getProjectLogs(parseInt(id))
      setLogs(data)
    } catch (error) {
      console.error('Failed to load logs:', error)
    }
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'bg-green-100 text-green-800'
      case TaskStatus.RUNNING:
        return 'bg-blue-100 text-blue-800'
      case TaskStatus.FAILED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return '等待中'
      case TaskStatus.RUNNING:
        return '執行中'
      case TaskStatus.COMPLETED:
        return '已完成'
      case TaskStatus.FAILED:
        return '失敗'
      case TaskStatus.CANCELLED:
        return '已取消'
    }
  }

  const getLogIcon = (logType: string) => {
    switch (logType) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'tool_use':
        return '🔧'
      default:
        return 'ℹ️'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            找不到專案
          </h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            返回儀表板
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Joey AI Agent</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← 返回
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Project Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-bold text-gray-900">{project.name}</h2>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                project.status
              )}`}
            >
              {getStatusText(project.status)}
            </span>
          </div>

          {project.description && (
            <p className="text-gray-600 mb-6">{project.description}</p>
          )}

          {project.status === TaskStatus.COMPLETED && project.result_summary && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-green-900 mb-2">執行結果</h3>
              <p className="text-green-800 whitespace-pre-wrap">
                {project.result_summary}
              </p>
            </div>
          )}

          {project.status === TaskStatus.FAILED && project.error_message && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-red-900 mb-2">錯誤訊息</h3>
              <p className="text-red-800 whitespace-pre-wrap">
                {project.error_message}
              </p>
            </div>
          )}

          <div className="text-sm text-gray-500 space-y-1">
            <div>建立於：{new Date(project.created_at).toLocaleString('zh-TW')}</div>
            {project.started_at && (
              <div>開始於：{new Date(project.started_at).toLocaleString('zh-TW')}</div>
            )}
            {project.completed_at && (
              <div>完成於：{new Date(project.completed_at).toLocaleString('zh-TW')}</div>
            )}
          </div>
        </div>

        {/* Execution Logs */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">執行日誌</h3>

          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              尚無執行日誌
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-2xl flex-shrink-0">
                    {getLogIcon(log.log_type)}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-900">{log.message}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(log.created_at).toLocaleTimeString('zh-TW')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {project.status === TaskStatus.RUNNING && (
            <div className="mt-6 flex items-center justify-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span>執行中，請稍候...</span>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
