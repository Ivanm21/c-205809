
import { ChevronDown } from "lucide-react";

interface ChatHeaderProps {
  isSidebarOpen?: boolean;
}

const ChatHeader = ({ isSidebarOpen = true }: ChatHeaderProps) => {
  return (
    <div className="fixed top-0 z-30 w-full border-b border-white/20 bg-[#1f1b33]/95 backdrop-blur">
      <div className="flex h-[60px] items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${!isSidebarOpen ? 'ml-24' : ''}`}>AskPlaytech</span>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="relative flex h-8 w-8 items-center justify-center">
          <img 
            src="https://www.playtech.com/app/uploads/2023/08/logo-asset.svg" 
            alt="Playtech logo" 
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
