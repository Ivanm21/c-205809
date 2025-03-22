import { cn } from '@/lib/utils';

const MessageAvatar = ({ isAssistant }: { isAssistant: boolean }) => {
  if (isAssistant) {
    return (
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#1f1b33]">
        <img 
          src="/images/assistant-logo.png"
          alt="Assistant avatar"
          className="h-8 w-8 object-contain"
          style={{ imageRendering: 'crisp-edges' }}
        />
      </div>
    );
  }
  
  return null;
};

export default MessageAvatar;
