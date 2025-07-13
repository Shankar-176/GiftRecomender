// ChatAssistant.jsx (Full Updated File)
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "../styles/ChatAssistant.css";

const ChatAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    const newUserMessage = {
      id: `user-${Date.now()}`,
      message: userMessage,
      sender: "user",
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const token = localStorage.getItem("token");
      const userId = token || "anonymous-user";

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || 'https://giftrecomenderproject.onrender.com'}/api/chat/message`,
        {
          sessionId,
          userId,
          message: userMessage
        }
      );

      if (response.data.success) {
        const assistantMessage = {
          id: response.data.messageId,
          message: response.data.response,
          sender: "assistant",
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response.data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: `error-${Date.now()}`,
        message: "Sorry, I'm having trouble responding right now. Please try again.",
        sender: "assistant",
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  };

  const startNewChat = () => {
    setMessages([]);
    setIsOpen(true);
    const welcomeMessage = {
      id: "welcome",
      message: "Hello! I'm your gift expert 🤖. Ask me for help finding the perfect gift for anyone!",
      sender: "assistant",
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  };

  return (
    <>
      <motion.button
        className="chat-toggle-btn"
        onClick={() => isOpen ? setIsOpen(false) : startNewChat()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          backgroundColor: isOpen ? "#ef4444" : "#3b82f6",
          rotate: isOpen ? 45 : 0 
        }}
      >
        {isOpen ? "✕" : "🤖"}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-window"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="chat-header">
              <div className="chat-title">
                <span className="ai-indicator">🤖</span>
                <div>
                  <h3>GiftBot</h3>
                  <p>Ask me anything about gifting 🎁</p>
                </div>
              </div>
              <div className="chat-controls">
                <button onClick={clearChat} className="clear-btn" title="New Chat">🗑️</button>
                <button onClick={() => setIsOpen(false)} className="close-btn" title="Close">✕</button>
              </div>
            </div>

            <div className="chat-messages">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`message ${msg.sender} ${msg.isError ? 'error' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="message-content">
                      <div className="message-text">{msg.message}</div>
                      <div className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div className="message assistant loading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="chat-input"
                disabled={isLoading}
              />
              <button type="submit" className="send-btn" disabled={isLoading || !inputMessage.trim()}>
                {isLoading ? "⏳" : "📨"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;