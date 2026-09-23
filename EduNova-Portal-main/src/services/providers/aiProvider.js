import apiClient from '../../lib/apiClient';

export const dispatchAIRequest = async (prompt, systemPrompt = '', context = {}, isJsonMode = false) => {
  const response = await apiClient.post('/ai/chat', {
    message: prompt,
    conversationId: context.conversationId || null,
  });
  return isJsonMode ? JSON.parse(response.data.reply) : response.data.reply;
};
