
import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatHistoryProps {
  onSelectConversation: (sessionId: string, title: string) => void;
  currentSessionId: string | null;
}

type ChatConversation = {
  session_id: string;
  title: string;
  created_at: string;
};

const ChatHistory = ({ onSelectConversation, currentSessionId }: ChatHistoryProps) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
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
        
        // Process the data to get unique conversations
        data?.forEach(item => {
          if (!uniqueConversations.has(item.session_id)) {
            // Use the first message content as the title
            const messageContent = typeof item.message === 'object' && item.message.message 
              ? item.message.message.substring(0, 30) + '...'
              : 'New conversation';
            
            uniqueConversations.set(item.session_id, {
              session_id: item.session_id,
              title: messageContent,
              created_at: new Date().toISOString() // Fallback if no created_at in the item
            });
          }
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

    fetchConversations();
  }, [toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="flex-1 overflow-y-auto px-3">
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
              <div className="flex-1 truncate">
                <div className="truncate font-medium">{conversation.title}</div>
                <div className="text-xs text-gray-400">{formatDate(conversation.created_at)}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
