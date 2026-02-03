'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function NewProjectPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    task_prompt: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const project = await api.createProject(formData)
      router.push(`/dashboard/projects/${project.id}`)
    } catch (error) {
      console.error('Failed to create project:', error)
      alert('建立專案失敗，請稍後再試')
    } finally {
      setSubmitting(false)
    }
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
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">新建專案</h2>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 專案名稱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                專案名稱 *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例：太空貓咖啡館官網"
              />
            </div>

            {/* 專案描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                專案描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="簡單描述這個專案的用途"
              />
            </div>

            {/* 任務提示詞 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                任務描述 *
              </label>
              <textarea
                required
                value={formData.task_prompt}
                onChange={(e) =>
                  setFormData({ ...formData, task_prompt: e.target.value })
                }
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="請詳細描述你想建立的網站，包括：&#10;- 網站類型（官網、作品集、電商等）&#10;- 風格設計（現代、簡約、活潑等）&#10;- 主要功能&#10;- 色調偏好&#10;- 其他特殊需求"
              />
            </div>

            {/* 提交按鈕 */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
              >
                {submitting ? '建立中...' : '建立專案'}
              </button>
            </div>
          </form>
        </div>

        {/* 提示說明 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 提示
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 盡可能詳細描述你的需求，AI 會根據描述建立網站</li>
            <li>• 提交後可以在專案詳情頁即時查看執行進度</li>
            <li>• 完成後會自動部署到 Render 並提供網址</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
