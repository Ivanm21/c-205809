
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

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentConversationTitle, setCurrentConversationTitle] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // If a session is selected, fetch its messages
    const fetchConversationMessages = async () => {
      if (!sessionId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('n8n_chat_histories')
          .select('*')
          .eq('session_id', sessionId)
          .order('id', { ascending: true });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Convert n8n_chat_histories format to our Message format
          const conversationMessages: Message[] = [];
          
          data.forEach(item => {
            if (item.message && typeof item.message === 'object') {
              // Add user message
              if (item.message.message) {
                conversationMessages.push({
                  role: 'user',
                  content: item.message.message
                });
              }
              
              // Add assistant response if available
              if (item.message.response) {
                conversationMessages.push({
                  role: 'assistant',
                  content: item.message.response
                });
              }
            }
          });
          
          setMessages(conversationMessages);
        } else {
          setMessages([]);
        }
      } catch (error: any) {
        console.error('Error fetching conversation messages:', error);
        toast({
          title: "Error fetching messages",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversationMessages();
  }, [sessionId, toast]);

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

  const handleSelectConversation = (selectedSessionId: string, title: string) => {
    setSessionId(selectedSessionId);
    setCurrentConversationTitle(title);
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex h-screen relative overflow-hidden">
      {/* Background image with overlay - reduced blur */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://www.playtech.com/app/uploads/2025/01/About-us.svg" 
          alt="Background" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1f1b33]/70 backdrop-blur-[2px]"></div>
      </div>
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onApiKeyChange={() => {}}
      >
        {isSidebarOpen && (
          <ChatHistory 
            onSelectConversation={handleSelectConversation} 
            currentSessionId={sessionId}
          />
        )}
      </Sidebar>
      
      <main className={`flex-1 transition-all duration-300 relative z-10 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <ChatHeader isSidebarOpen={isSidebarOpen} />
        
        <div className={`flex h-full flex-col ${messages.length === 0 ? 'items-center' : ''} pt-[60px] pb-4`}>
          {messages.length === 0 ? (
            <div className="w-full max-w-3xl px-4 flex flex-col h-full">
              <div className="flex-1 flex flex-col justify-center items-center">
                <h1 className="mb-8 text-4xl font-semibold text-center text-white">How can I help you with Playtech?</h1>
                <div className="w-full">
                  <ActionButtons onPromptClick={handlePromptClick} />
                </div>
              </div>
              <div className="w-full mt-auto py-6">
                <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                <MessageList messages={messages} />
              </div>
              <div className="w-full max-w-3xl mx-auto px-4 py-6 mt-auto">
                <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
                <div className="text-xs text-center text-gray-300 mt-2">
                  {currentConversationTitle ? `Current conversation: ${currentConversationTitle}` : 'New conversation'}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
