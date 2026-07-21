'use client'

import React, { useState, useEffect } from 'react'

interface ClientUser {
  id: string
  email: string
  company?: string
  active?: boolean
}

interface SignedUrlData {
  url: string
  format?: string
  duration?: number
  provider?: string
  transcodeStatus?: string
}

export default function ClientVerification({
  episodes,
}: {
  episodes: Array<{ id: string; episodeNumber: number; title: string; dramaTitle: string }>
}) {
  const [email, setEmail] = useState('client-active@easternvision.com')
  const [password, setPassword] = useState('password123')
  const [currentUser, setCurrentUser] = useState<ClientUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedEpisode, setSelectedEpisode] = useState(() => episodes[0]?.id || '')
  const [signedUrlData, setSignedUrlData] = useState<SignedUrlData | null>(null)

  // 检查当前登录状态
  const checkLoginStatus = async () => {
    try {
      const res = await fetch('/api/clients/me')
      if (res.ok) {
        const data = await res.json()
        if (data && data.user) {
          setCurrentUser(data.user)
        } else {
          setCurrentUser(null)
        }
      } else {
        setCurrentUser(null)
      }
    } catch {
      setCurrentUser(null)
    }
  }

  useEffect(() => {
    let isMounted = true
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/clients/me')
        if (res.ok) {
          const data = await res.json()
          if (isMounted) {
            setCurrentUser(data?.user || null)
          }
        } else if (isMounted) {
          setCurrentUser(null)
        }
      } catch {
        if (isMounted) {
          setCurrentUser(null)
        }
      }
    }

    fetchStatus()
    if (episodes.length > 0) {
      setTimeout(() => {
        if (isMounted) {
          setSelectedEpisode(episodes[0].id)
        }
      }, 0)
    }

    return () => {
      isMounted = false
    }
  }, [episodes])

  // 客户登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSignedUrlData(null)

    try {
      const res = await fetch('/api/clients/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || '登录失败，请检查邮箱或密码')
      }

      await checkLoginStatus()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '网络错误')
    } finally {
      setLoading(false)
    }
  }

  // 客户登出
  const handleLogout = async () => {
    setLoading(true)
    setError('')
    setSignedUrlData(null)
    try {
      await fetch('/api/clients/logout', { method: 'POST' })
      setCurrentUser(null)
    } catch {
      setError('登出失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取临时播放地址
  const handleGetSignedUrl = async () => {
    if (!selectedEpisode) {
      setError('请先选择一个剧集')
      return
    }

    setLoading(true)
    setError('')
    setSignedUrlData(null)

    try {
      const res = await fetch(`/api/video-assets/sign-play-url?episodeId=${selectedEpisode}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '获取临时播放地址失败')
      }

      setSignedUrlData(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '获取失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tester-box">
      <h3>🔐 B2B 客户登录与防盗链播放测试</h3>
      <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>
        提示：您可以在后台分别创建启用（active=true）和禁用（active=false）状态的客户账号，在此处模拟前台鉴权校验。
      </p>

      {currentUser ? (
        <div className="logged-in-area">
          <div className="status-badge success">
            <span>已登录客户账号：</span>
            <strong>{currentUser.email}</strong>
            <span className="company-tag">（{currentUser.company}）</span>
            <span className={`active-dot ${currentUser.active ? 'active' : 'inactive'}`} />
            <span>{currentUser.active ? '账号启用中' : '账号已禁用'}</span>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>选择剧集：</label>
            <select
              value={selectedEpisode}
              onChange={(e) => setSelectedEpisode(e.target.value)}
              className="tester-select"
            >
              {episodes.map((ep) => (
                <option key={ep.id} value={ep.id}>
                  {ep.dramaTitle} - 第 {ep.episodeNumber} 集: {ep.title}
                </option>
              ))}
            </select>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
              <button onClick={handleGetSignedUrl} className="tester-btn primary" disabled={loading}>
                {loading ? '获取中...' : '🎬 签发视频临时播放地址'}
              </button>
              <button onClick={handleLogout} className="tester-btn secondary" disabled={loading}>
                退出登录
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>电子邮箱：</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="tester-input"
              placeholder="请输入管理员在后台创建的客户邮箱"
            />
          </div>
          <div className="form-group">
            <label>密码：</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="tester-input"
              placeholder="请输入密码"
            />
          </div>
          <button type="submit" className="tester-btn primary" disabled={loading}>
            {loading ? '登录中...' : '登录 B2B 前台'}
          </button>
        </form>
      )}

      {error && (
        <div className="error-message" style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          ⚠️ 拦截/错误提示：{error}
        </div>
      )}

      {signedUrlData && (
        <div className="success-message" style={{ marginTop: '1rem', padding: '1rem', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>✅ 鉴权成功！临时防盗链地址已签发：</h4>
          <p style={{ margin: '0 0 0.5rem 0', wordBreak: 'break-all', fontSize: '0.85rem', fontFamily: 'monospace', backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px' }}>
            {signedUrlData.url}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem', opacity: 0.9 }}>
            <div>视频格式：<strong>{signedUrlData.format}</strong></div>
            <div>视频时长：<strong>{signedUrlData.duration} 秒</strong></div>
            <div>服务商：<strong>{signedUrlData.provider}</strong></div>
            <div>转码状态：<strong>{signedUrlData.transcodeStatus}</strong></div>
          </div>
        </div>
      )}
    </div>
  )
}
