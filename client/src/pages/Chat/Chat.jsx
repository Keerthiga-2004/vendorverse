// src/pages/Chat/Chat.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import toast from 'react-hot-toast'
import './Chat.css'

// ─── HELPERS ─────────────────────────────────────────────
const AVATAR_COLORS = [
  '#7C3AED','#F72585','#10B981','#F59E0B',
  '#3B82F6','#FF5757','#00C9B1','#8B5CF6',
]

function avatarColor(name = '') {
  return AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length]
}

function formatTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function formatDate(dateStr) {
  const d   = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
}

function timeAgo(dateStr) {
  const d       = new Date(dateStr)
  const now     = new Date()
  const diffMin = Math.floor((now - d) / 60000)
  if (diffMin < 1)   return 'Just now'
  if (diffMin < 60)  return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24)   return `${diffHr}h ago`
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

// Send icon SVG
function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  )
}

// Chat bubble icon
function ChatIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function Chat() {
  const { user, token } = useAuth()
  const navigate   = useNavigate()
  const { conversationId } = useParams() // format: customerId_vendorId

  const [conversations,    setConversations]    = useState([])
  const [convLoading,      setConvLoading]      = useState(true)

  const [activeConvId,     setActiveConvId]     = useState(conversationId || null)
  const [messages,         setMessages]         = useState([])
  const [msgLoading,       setMsgLoading]       = useState(false)

  const [text,             setText]             = useState('')
  const [sending,          setSending]          = useState(false)

  // Mobile: toggle sidebar vs thread
  const [showSidebar,      setShowSidebar]      = useState(true)

  const messagesEndRef = useRef(null)
  const pollRef        = useRef(null)
  const textareaRef    = useRef(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  // ── Fetch conversations on mount ──────────────────────
  const fetchConversations = useCallback(async () => {
  if (!token) return

  try {
    const { data } = await api.get('/chat/conversations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setConversations(data)
  } catch (err) {
    console.error(
      'FETCH CONVERSATIONS ERROR:',
      err.response?.data || err
    )
  } finally {
    setConvLoading(false)
  }
}, [token])

useEffect(() => {
  if (!token) return
  fetchConversations()
}, [token, fetchConversations])

  // ── Set active conversation from URL param ────────────
  useEffect(() => {
    if (conversationId) {
      setActiveConvId(conversationId)
      setShowSidebar(false)
    }
  }, [conversationId])

  // ── Fetch messages for active conversation ────────────
  const fetchMessages = useCallback(async (convId) => {
    if (!convId) return
    const [customerId, vendorId] = convId.split('_')
    if (!customerId || !vendorId) return

    try {
      const { data } = await api.get(`/chat/${customerId}/${vendorId}`)
      setMessages(data)
    } catch (err) {
      // Silently fail during polling
    }
  }, [])

  // When active conversation changes — load messages + start polling
  useEffect(() => {
    if (!activeConvId) return

    // Clear old poll
    if (pollRef.current) clearInterval(pollRef.current)

    setMsgLoading(true)
    fetchMessages(activeConvId).finally(() => setMsgLoading(false))

    // Poll every 4 seconds for new messages
    pollRef.current = setInterval(() => {
      fetchMessages(activeConvId)
      fetchConversations() // refresh unread badges too
    }, 4000)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [activeConvId, fetchMessages, fetchConversations])

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Select a conversation ─────────────────────────────
  const selectConversation = (convId) => {
    setActiveConvId(convId)
    setMessages([])
    setShowSidebar(false)
    navigate(`/chat/${convId}`, { replace: true })
  }

  // ── Send a message ────────────────────────────────────
  const handleSend = async () => {
    if (!text.trim() || sending || !activeConvId) return

    const [customerId, vendorId] = activeConvId.split('_')
    const isVendor = user.role === 'vendor'

    try {
      setSending(true)
      const body = { text: text.trim() }
      if (isVendor) body.customerId = customerId // vendors must specify customer

      const { data } = await api.post(`/chat/${vendorId}`, body)

      // Append immediately without waiting for poll
      setMessages(prev => [...prev, data.message])
      setText('')
      textareaRef.current?.focus()

      // Refresh conversation list to update last message preview
      fetchConversations()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  // Send on Enter (Shift+Enter = newline)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Group messages by date for separators ─────────────
  const groupedMessages = messages.reduce((groups, msg) => {
    const date = formatDate(msg.createdAt)
    if (!groups[date]) groups[date] = []
    groups[date].push(msg)
    return groups
  }, {})

  // ── Active conversation info ──────────────────────────
  const activeConv = conversations.find(c => c.conversationId === activeConvId)

  // ── RENDER ────────────────────────────────────────────
  if (!user) return null

  return (
    <div className="chat-page">
      <div className="chat-layout">

        {/* ════════ CONVERSATIONS SIDEBAR ════════ */}
        <div className={`chat-sidebar${!showSidebar ? ' hidden-mobile' : ''}`}>
          <div className="chat-sidebar-header">
            <div className="chat-sidebar-title">Messages</div>
          </div>

          <div className="chat-conv-list">
            {convLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink3)', fontSize: 13 }}>
                Loading…
              </div>
            ) : conversations.length === 0 ? (
              <div className="chat-empty-convs">
                <div className="chat-empty-convs-icon">💬</div>
                <div className="chat-empty-convs-text">
                  {user.role === 'user'
                    ? 'Visit a vendor page and click "Message vendor" to start a conversation'
                    : 'Conversations with customers will appear here'
                  }
                </div>
              </div>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.conversationId}
                  className={`chat-conv-item${activeConvId === conv.conversationId ? ' active' : ''}`}
                  onClick={() => selectConversation(conv.conversationId)}
                >
                  <div
                    className="chat-conv-avatar"
                    style={{ background: avatarColor(conv.partner.name) }}
                  >
                    {(conv.partner.name || '?')[0].toUpperCase()}
                  </div>
                  <div className="chat-conv-info">
                    <div className="chat-conv-name">{conv.partner.name}</div>
                    <div className="chat-conv-preview">
                      {conv.lastMessage.senderRole === (user.role === 'vendor' ? 'vendor' : 'user')
                        ? `You: ${conv.lastMessage.text}`
                        : conv.lastMessage.text
                      }
                    </div>
                  </div>
                  <div className="chat-conv-meta">
                    <div className="chat-conv-time">{timeAgo(conv.lastMessage.createdAt)}</div>
                    {conv.unreadCount > 0 && (
                      <div className="chat-unread-badge">{conv.unreadCount}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ════════ MESSAGE THREAD ════════ */}
        {!activeConvId ? (
          <div className={`chat-no-selection${showSidebar ? '' : ' hidden-mobile'}`}>
            <div className="chat-no-selection-icon">
              <ChatIcon size={32} />
            </div>
            <h3>Select a conversation</h3>
            <p>Choose a conversation from the left to start messaging</p>
          </div>
        ) : (
          <div className={`chat-thread${showSidebar ? ' hidden-mobile' : ''}`}>

            {/* Thread header */}
            <div className="chat-thread-header">
              {/* Back button on mobile */}
              <button
                onClick={() => setShowSidebar(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink2)', padding: '4px 8px 4px 0', display: 'none' }}
                className="chat-back-btn"
              >
                ←
              </button>

              {activeConv && (
                <>
                  <div
                    className="chat-thread-avatar"
                    style={{ background: avatarColor(activeConv.partner.name) }}
                  >
                    {(activeConv.partner.name || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="chat-thread-name">{activeConv.partner.name}</div>
                    {activeConv.partner.category && (
                      <div className="chat-thread-sub">{activeConv.partner.category}</div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            {msgLoading ? (
              <div className="chat-loading">
                <div style={{ width: 28, height: 28, border: '2.5px solid var(--border)', borderTopColor: 'var(--v)', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                Loading messages…
              </div>
            ) : (
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink3)', fontSize: 14 }}>
                    No messages yet. Say hello!
                  </div>
                ) : (
                  Object.entries(groupedMessages).map(([date, msgs]) => (
                    <div key={date}>
                      <div className="chat-date-sep">{date}</div>
                      {msgs.map(msg => {
                        const isMine = msg.sender?._id === user._id ||
                                       msg.senderRole === (user.role === 'vendor' ? 'vendor' : 'user')
                        const senderName = msg.sender?.name || ''
                        return (
                          <div
                            key={msg._id}
                            className={`chat-bubble-wrap ${isMine ? 'mine' : 'theirs'}`}
                          >
                            {!isMine && (
                              <div
                                className="chat-bubble-avatar"
                                style={{ background: avatarColor(senderName) }}
                              >
                                {(senderName || '?')[0].toUpperCase()}
                              </div>
                            )}
                            <div className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}>
                              {msg.text}
                              <div className="chat-bubble-time">
                                {formatTime(msg.createdAt)}
                                {isMine && msg.read && ' · Read'}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} className="chat-messages-anchor" />
              </div>
            )}

            {/* Input */}
            <div className="chat-input-bar">
              <div className="chat-input-wrap">
                <textarea
                  ref={textareaRef}
                  placeholder="Type a message…"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  style={{ height: 'auto' }}
                  onInput={e => {
                    e.target.style.height = 'auto'
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                  }}
                />
              </div>
              <button
                className="chat-send-btn"
                onClick={handleSend}
                disabled={!text.trim() || sending}
                title="Send message"
              >
                <SendIcon />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}