
interface SendMessageParams {
  message: string;
  sessionId?: string | null;
}

interface ChatResponse {
  content: string;
  sessionId: string;
}

export const sendChatMessage = async ({ message, sessionId }: SendMessageParams): Promise<ChatResponse> => {
  const webhookUrl = 'https://crypto-narrative.app.n8n.cloud/webhook-test/a3e11a26-c9fa-4088-bcfe-7d3d265c9849';
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      content: data.response || "I apologize, but I couldn't process your request at this time.",
      sessionId: data.sessionId || sessionId || crypto.randomUUID(),
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
