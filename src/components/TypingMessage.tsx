import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TypingMessageProps {
  content: string;
  speed?: number;
}

const TypingMessage = ({ content, speed = 8.45 }: TypingMessageProps) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Split content into words while preserving markdown formatting
  const words = content.split(/(\s+)/);

  const scrollToBottom = () => {
    if (contentRef.current) {
      // Get the message container
      const messageContainer = contentRef.current.closest('.message-container');
      if (messageContainer) {
        // Get the current scroll position and viewport height
        const currentScroll = window.scrollY;
        const viewportHeight = window.innerHeight;
        const messageBottom = messageContainer.getBoundingClientRect().bottom + currentScroll;
        const chatInputHeight = 200; // Approximate height of chat input area
        
        // Calculate the position to scroll to, ensuring the message is above the chat input
        const targetScroll = messageBottom - viewportHeight + chatInputHeight + 50; // 50px buffer
        
        // Force scroll to the target position
        window.scrollTo({
          top: targetScroll,
          behavior: 'instant' // Changed from 'smooth' to 'instant' for more reliable scrolling
        });
      }
    }
  };

  useEffect(() => {
    if (currentIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(prev => prev + words[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        // Add a small delay before scrolling to ensure content is rendered
        setTimeout(scrollToBottom, 10);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      // When message is fully typed, ensure it's fully visible
      const finalScroll = () => {
        if (contentRef.current) {
          const messageContainer = contentRef.current.closest('.message-container');
          if (messageContainer) {
            const messageBottom = messageContainer.getBoundingClientRect().bottom + window.scrollY;
            const viewportHeight = window.innerHeight;
            const chatInputHeight = 200; // Approximate height of chat input area
            
            // Calculate the position to scroll to, ensuring the message is above the chat input
            const targetScroll = messageBottom - viewportHeight + chatInputHeight + 50; // 50px buffer
            
            // Force scroll to the target position
            window.scrollTo({
              top: targetScroll,
              behavior: 'instant' // Changed from 'smooth' to 'instant' for more reliable scrolling
            });
          }
        }
      };
      
      // Small delay to ensure content is rendered
      setTimeout(finalScroll, 100);
    }
  }, [currentIndex, words, speed]);

  return (
    <div ref={contentRef} className="message-container">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
          ul: ({node, ...props}) => <ul className="mb-4 list-disc pl-4 last:mb-0" {...props} />,
          ol: ({node, ...props}) => <ol className="mb-4 list-decimal pl-4 last:mb-0" {...props} />,
          li: ({node, ...props}) => <li className="mb-1 last:mb-0" {...props} />,
          strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
          em: ({node, ...props}) => <em className="italic" {...props} />,
          code: ({node, ...props}) => <code className="bg-black/20 rounded px-1" {...props} />,
          pre: ({node, ...props}) => <pre className="bg-black/20 rounded p-2 my-2 overflow-x-auto" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-white/20 pl-4 my-2" {...props} />,
        }}
      >
        {displayedContent}
      </ReactMarkdown>
    </div>
  );
};

export default TypingMessage; 