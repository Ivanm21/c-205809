import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatInput from '@/components/ChatInput';
import ActionButtons from '@/components/ActionButtons';
import MessageList from '@/components/MessageList';
import ChatHistory from '@/components/ChatHistory';
import { sendChatMessage } from '@/services/chatService';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

// Interface to help with typing the message JSON structure
interface ChatHistoryMessage {
  type: 'human' | 'ai';
  content: string;
  additional_kwargs: Record<string, unknown>;
  response_metadata: Record<string, unknown>;
  tool_calls?: unknown[];
  invalid_tool_calls?: unknown[];
}

const generateTitle = (content: string): string => {
  // Remove markdown formatting
  const plainText = content.replace(/\*\*/g, '').replace(/\n/g, ' ');
  
  // Try to extract a meaningful title
  let title = plainText;
  
  // If it's a question, use the first sentence
  if (plainText.includes('?')) {
    title = plainText.split('?')[0] + '?';
  } else {
    // Otherwise use the first sentence or first few words
    const firstSentence = plainText.split(/[.!?]/)[0];
    title = firstSentence;
  }
  
  // Truncate if too long
  return title.length > 40 ? title.substring(0, 40) + '...' : title;
};

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentConversationTitle, setCurrentConversationTitle] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to process messages from Supabase
  const processMessages = (data: any[]): Message[] => {
    console.log('Processing messages from data:', data);
    const conversationMessages: Message[] = [];
    
    data.forEach((item, index) => {
      console.log(`Processing message ${index + 1}:`, item);
      // Extract the message object
      const messageData = item.message;
      console.log('Message data:', messageData);
      
      // Process user message
      if (messageData.chatInput || messageData.message) {
        const userMessage = {
          role: 'user' as const,
          content: messageData.chatInput || messageData.message
        };
        console.log('Adding user message:', userMessage);
        conversationMessages.push(userMessage);
      }
      
      // Process assistant message
      if (messageData.output || messageData.response) {
        const assistantMessage = {
          role: 'assistant' as const,
          content: messageData.output || messageData.response
        };
        console.log('Adding assistant message:', assistantMessage);
        conversationMessages.push(assistantMessage);
      }
    });
    
    console.log('Final processed messages:', conversationMessages);
    return conversationMessages;
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const newMessages = [
        ...messages,
        { role: 'user', content } as const
      ];
      
      setMessages(newMessages);

      // Send message to n8n webhook
      const response = await sendChatMessage({
        message: content,
        sessionId: sessionId
      });

      // Update session ID if this is a new conversation
      if (!sessionId) {
        setSessionId(response.sessionId);
      }
      
      // Always update the conversation title with the latest user message
      setCurrentConversationTitle(generateTitle(content));

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.content
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = async (newSessionId: string, title: string) => {
    console.log('Selecting conversation:', { newSessionId, title });
    // Clear existing messages and update state immediately
    setMessages([]);
    setCurrentConversationTitle(title);
    setSessionId(newSessionId);
    setIsLoading(true);
    
    try {
      // Fetch messages for the selected conversation
      const { data, error } = await supabase
        .from('n8n_chat_histories')
        .select('*')
        .eq('session_id', newSessionId)
        .eq('visible', true)
        .order('id', { ascending: true });
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log('Raw data from Supabase:', JSON.stringify(data, null, 2));
        // Process each message
        const conversationMessages: Message[] = [];
        
        data.forEach(item => {
          // First cast to unknown, then to ChatHistoryMessage to avoid type errors
          const messageData = item.message as unknown as ChatHistoryMessage;
          
          // Verify the message structure
          if (messageData && 
              'type' in messageData && 
              'content' in messageData && 
              typeof messageData.content === 'string') {
            
            // Handle the message based on type
            if (messageData.type === 'human') {
              conversationMessages.push({
                role: 'user',
                content: messageData.content
              });
            } else if (messageData.type === 'ai') {
              conversationMessages.push({
                role: 'assistant',
                content: messageData.content
              });
            }
          }
        });
        
        console.log('Final conversation messages:', JSON.stringify(conversationMessages, null, 2));
        setMessages(conversationMessages);
      }
    } catch (error: any) {
      console.error('Error loading conversation:', error);
      toast({
        title: "Error loading conversation",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a prop to force ChatHistory to refresh
  const [chatHistoryKey, setChatHistoryKey] = useState(0);

  const handleNewChat = () => {
    setSessionId(null);
    setMessages([]);
    setCurrentConversationTitle(null);
    // Increment the key to force ChatHistory to remount and refresh
    setChatHistoryKey(prev => prev + 1);
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  // Remove the useEffect hook since we're handling message loading in handleSelectConversation
  useEffect(() => {
    // Only keep this for initial session restoration if needed
    if (!sessionId) return;
  }, [sessionId]);

  return (
    <div className="flex h-screen relative overflow-hidden">
      {/* Background image with overlay - reduced blur */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://www.playtech.com/app/uploads/2025/01/About-us.svg" 
          alt="Background" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1f1b33]/70 backdrop-blur-[1px]"></div>
      </div>
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={handleNewChat}
      >
        {isSidebarOpen && (
          <ChatHistory 
            key={chatHistoryKey}
            onSelectConversation={handleSelectConversation} 
            currentSessionId={sessionId}
          />
        )}
      </Sidebar>
      
      <main className="flex-1 relative">
        <ChatHeader />
        
        <div className="flex h-full flex-col pt-[60px] pb-4">
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
            {messages.length > 0 ? (
              <MessageList messages={messages} isLoading={isLoading} />
            ) : (
              <div className="flex-1"></div>
            )}
          </div>
          
          <div className="w-full max-w-3xl mx-auto px-4 mt-auto">
            {messages.length === 0 && (
              <div className="mb-6">
                <h1 className="mb-4 text-4xl font-semibold text-center text-white">Ask anything about Playtech</h1>
                <p className="mb-8 text-center text-gray-400 text-sm max-w-2xl mx-auto">
                  All responses are sourced from official Playtech website content and documentation.
                </p>
                <ActionButtons onPromptClick={handlePromptClick} />
              </div>
            )}
            
            <div className="py-4">
              <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
              {sessionId && (
                <div className="text-xs text-center text-gray-300 mt-2">
                  {currentConversationTitle ? `Current conversation: ${currentConversationTitle}` : 'New conversation'}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
