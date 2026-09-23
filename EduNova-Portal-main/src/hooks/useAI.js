import { useState, useCallback } from 'react';
import { askSageAI } from '../services/aiService';

export const useAI = (initialContext = {}) => {
  const [messages, setMessages] = useState([
    {
      id: 'init_msg',
      sender: 'sage',
      text: 'Hello! I am **Sage**, your AI tutor. Point your camera at any object or select a 3D model hotspot to explore.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [aiContext, setAiContext] = useState(initialContext);

  const sendMessage = useCallback(async (promptText, overrideContext = {}) => {
    if (!promptText.trim()) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const mergedContext = { ...aiContext, ...overrideContext };

    try {
      const response = await askSageAI(promptText, messages, mergedContext);
      const sageMsg = {
        id: `sage_${Date.now()}`,
        sender: 'sage',
        text: response.text,
        suggestedActions: response.suggestedActions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, sageMsg]);
    } catch (err) {
      console.error('Sage AI error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'sage',
          text: 'Sorry, I encountered a temporary connection issue. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [messages, aiContext]);

  const updateContext = useCallback((newCtx) => {
    setAiContext(prev => ({ ...prev, ...newCtx }));
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    loading,
    aiContext,
    sendMessage,
    updateContext,
    clearChat
  };
};

export default useAI;
