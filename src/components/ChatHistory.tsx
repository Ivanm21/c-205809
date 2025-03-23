import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

interface ChatHistoryProps {
  onSelectConversation: (sessionId: string, title: string) => void;
  currentSessionId: string | null;
}

type ChatConversation = {
  session_id: string;
  title: string;
  created_at: string;
  last_response?: string;
};

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
  
  return title;
};

const ChatHistory = ({ onSelectConversation, currentSessionId }: ChatHistoryProps) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      // Fetch conversations from the n8n_chat_histories table
      const { data, error } = await supabase
        .from('n8n_chat_histories')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      
      // Create a Map to store unique conversations by session_id
      const uniqueConversations = new Map<string, ChatConversation>();
      
      // Group messages by session_id to find the last human message
      const messagesBySession = new Map<string, ChatHistoryMessage[]>();
      
      // First, group all messages by session_id
      data?.forEach(item => {
        const messageData = item.message as unknown as ChatHistoryMessage;
        if (!messagesBySession.has(item.session_id)) {
          messagesBySession.set(item.session_id, []);
        }
        messagesBySession.get(item.session_id)?.push(messageData);
      });
      
      // Then process each session to find the last human message and last assistant response
      messagesBySession.forEach((messages, sessionId) => {
        // Find the last human message
        const lastHumanMessage = [...messages].reverse().find(msg => 
          msg && msg.type === 'human' && msg.content
        );
        
        // Find the last assistant response
        const lastAssistantMessage = [...messages].reverse().find(msg => 
          msg && msg.type === 'ai' && msg.content
        );
        
        let title = 'New conversation';
        if (lastHumanMessage && lastHumanMessage.content) {
          title = generateTitle(lastHumanMessage.content);
        }
        
        uniqueConversations.set(sessionId, {
          session_id: sessionId,
          title: title,
          created_at: data?.find(item => item.session_id === sessionId)?.created_at || new Date().toISOString(),
          last_response: lastAssistantMessage?.content || undefined
        });
      });
      
      // Convert Map to array
      setConversations(Array.from(uniqueConversations.values()));
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error fetching conversations",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch conversations on mount and when currentSessionId changes
  useEffect(() => {
    fetchConversations();
  }, [currentSessionId, toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
      <h2 className="mb-2 px-2 text-lg font-semibold text-white">Conversations</h2>
      
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        </div>
      ) : conversations.length === 0 ? (
        <div className="py-4 text-center text-sm text-gray-400">
          No conversations found
        </div>
      ) : (
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <button
              key={conversation.session_id}
              onClick={() => onSelectConversation(conversation.session_id, conversation.title)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                currentSessionId === conversation.session_id 
                  ? 'bg-[#2A2B32]' 
                  : 'hover:bg-[#2A2B32]/50'
              }`}
            >
              <MessageSquare className="h-4 w-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div 
                  className="font-medium truncate group relative"
                  title={conversation.title}
                >
                  {conversation.title}
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-max max-w-[28rem] p-2 bg-[#2A2B32] text-white text-sm rounded-lg shadow-lg border border-white/10 z-50">
                    {conversation.title}
                    <div className="absolute bottom-0 left-4 -mb-1.5 w-2 h-2 bg-[#2A2B32] border-r border-b border-white/10 transform rotate-45"></div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">{formatDate(conversation.created_at)}</div>
                {conversation.last_response && (
                  <div className="text-xs text-gray-500 truncate mt-1">{conversation.last_response}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
