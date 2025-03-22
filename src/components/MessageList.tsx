import { useEffect, useRef } from 'react';
import Message from './Message';
import LoadingAnimation from './LoadingAnimation';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

const MessageList = ({ messages, isLoading = false }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]); // Scroll when messages change or loading state changes

  return (
    <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
      <div className="w-full max-w-3xl mx-auto px-4">
        {messages.map((message, index) => (
          <Message key={index} {...message} />
        ))}
        {isLoading && <LoadingAnimation />}
        <div ref={messagesEndRef} /> {/* Invisible element to scroll to */}
      </div>
    </div>
  );
};

export default MessageList;