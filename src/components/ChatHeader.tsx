import { ChevronDown } from "lucide-react";

interface ChatHeaderProps {
  isSidebarOpen?: boolean;
}

const ChatHeader = ({ isSidebarOpen = true }: ChatHeaderProps) => {
  return (
    <div className="fixed top-0 z-30 w-full border-b border-white/20 bg-[#1f1b33]/95 backdrop-blur">
      <div className="flex h-[60px] items-center justify-between px-4">
        <div></div>
        <div className="relative flex h-24 w-24 items-center justify-center">
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
