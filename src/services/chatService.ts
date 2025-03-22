interface SendMessageParams {
  message: string;
  sessionId?: string | null;
}

interface ChatResponse {
  content: string;
  sessionId: string;
}

// Fallback UUID generation function
function generateUUID() {
  let d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export const sendChatMessage = async ({ message, sessionId }: SendMessageParams): Promise<ChatResponse> => {
  const webhookUrl = 'https://crypto-narrative.app.n8n.cloud/webhook/a3e11a26-c9fa-4088-bcfe-7d3d265c9849';
  
  // Generate a new sessionId if one is not provided
  const currentSessionId = sessionId || (typeof crypto !== 'undefined' && 'randomUUID' in crypto 
    ? crypto.randomUUID() 
    : generateUUID());
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: currentSessionId,
        action: 'sendMessage',
        chatInput: message
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    // Handle array response format
    const responseData = Array.isArray(data) && data.length > 0 ? data[0] : data;
    
    return {
      content: responseData.output || "I apologize, but I couldn't process your request at this time.",
      sessionId: currentSessionId,
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
