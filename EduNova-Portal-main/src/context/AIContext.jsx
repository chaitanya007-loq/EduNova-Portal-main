import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { askSageAI } from '../services/aiService';
import { getChatHistory, saveChatMessage, clearChatHistory } from '../services/chatService';

const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeContext, setActiveContext] = useState({});

  useEffect(() => {
    setMessages(getChatHistory());
  }, []);

  const toggleAIChat = useCallback(() => setIsOpen((prev) => !prev), []);
  const openAIChat = useCallback(() => setIsOpen(true), []);
  const closeAIChat = useCallback(() => setIsOpen(false), []);

  const sendMessage = useCallback(async (text, extraContext = {}) => {
    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      type: 'text',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = saveChatMessage(userMsg);
    setMessages(updated);
    setIsTyping(true);

    const mergedContext = { ...activeContext, ...extraContext };

    try {
      const response = await askSageAI(text, updated, mergedContext);
      
      const isQuizSetup = response.data && (response.data.isQuizSetup || response.data.isConfigurator);
      const isQuizType = response.type === 'quiz' || (response.data && response.data.questions && response.data.questions.length > 0);

      const aiMsg = {
        id: `sage_${Date.now()}`,
        sender: 'sage',
        type: isQuizSetup ? 'quiz_setup' : (isQuizType ? 'quiz' : 'text'),
        text: isQuizSetup ? (response.data.message || response.text) : response.text,
        setupConfig: isQuizSetup ? response.data : null,
        quizData: isQuizType ? response.data : null,
        isError: !!response.error,
        suggestedActions: isQuizType 
          ? ["Submit Quiz", "Try Another Topic"] 
          : (response.suggestedActions || ["Explain in 2 lines", "Give 10 MCQs", "Create formula sheet"]),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalHistory = saveChatMessage(aiMsg);
      setMessages(finalHistory);
    } catch (err) {
      console.error('Sage AI Error:', err);
      const errMsg = {
        id: `sage_err_${Date.now()}`,
        sender: 'sage',
        type: 'text',
        isError: true,
        text: "Sage couldn't reach the AI service right now. Please check your network connection or API configuration.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(saveChatMessage(errMsg));
    } finally {
      setIsTyping(false);
    }
  }, [activeContext]);

  const setSubjectContext = useCallback((subjectName, topicName = null) => {
    setActiveContext({ subjectName, topicName });
  }, []);

  const resetChat = useCallback(() => {
    const reset = clearChatHistory();
    setMessages(reset);
  }, []);

  const contextValue = useMemo(() => ({
    isOpen,
    toggleAIChat,
    openAIChat,
    closeAIChat,
    messages,
    sendMessage,
    isTyping,
    resetChat,
    activeContext,
    setSubjectContext
  }), [
    isOpen,
    toggleAIChat,
    openAIChat,
    closeAIChat,
    messages,
    sendMessage,
    isTyping,
    resetChat,
    activeContext,
    setSubjectContext
  ]);

  return (
    <AIContext.Provider value={contextValue}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);

