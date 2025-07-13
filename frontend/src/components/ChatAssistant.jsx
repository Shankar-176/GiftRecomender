
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

  // Initialize session
  useEffect(() => {
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when opened
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

    // Add user message to chat
    const newUserMessage = {
      id: `user-${Date.now()}`,
      message: userMessage,
      sender: "user",
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Get user ID from localStorage (from auth token)
      const token = localStorage.getItem("token");
      const userId = token || "anonymous-user";

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/chat/message`,
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
    // Add welcome message
    const welcomeMessage = {
      id: "welcome",
      message: "Hi! I'm your AI gift advisor. I'm here to help you find the perfect gifts for any occasion. What can I help you with today?",
      sender: "assistant",
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  };

  return (
    <>
      {/* Chat Toggle Button */}
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
        {isOpen ? "✕" : "💬"}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-window"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-title">
                <span className="ai-indicator">🤖</span>
                <div>
                  <h3>AI Gift Advisor</h3>
                  <p>Powered by Gemini 2.0 Flash</p>
                </div>
              </div>
              <div className="chat-controls">
                <button onClick={clearChat} className="clear-btn" title="New Chat">
                  🗑️
                </button>
                <button onClick={() => setIsOpen(false)} className="close-btn" title="Close">
                  ✕
                </button>
              </div>
            </div>

            {/* Chat Messages */}
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
                        {new Date(msg.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  className="message assistant loading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me about gift ideas..."
                className="chat-input"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="send-btn"
                disabled={isLoading || !inputMessage.trim()}
              >
                {isLoading ? "⏳" : "🚀"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;
