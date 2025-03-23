import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MessageAvatar from './MessageAvatar';
import TypingMessage from './TypingMessage';

type MessageProps = {
  role: 'user' | 'assistant';
  content: string;
  isLastMessage?: boolean;
};

const Message = ({ role, content, isLastMessage = false }: MessageProps) => {
  return (
    <div className="py-6 animate-message-in">
      <div className={`flex gap-4 ${role === 'user' ? 'flex-row-reverse' : ''}`}>
        <MessageAvatar isAssistant={role === 'assistant'} />
        <div className={`flex-1 space-y-2 ${role === 'user' ? 'flex justify-end' : ''}`}>
          <div className="bg-[#1f1b33]/80 border border-white/20 rounded-[20px] px-4 py-2 inline-block text-white">
            {role === 'assistant' && isLastMessage ? (
              <TypingMessage content={content} speed={10} />
            ) : (
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
                {content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
