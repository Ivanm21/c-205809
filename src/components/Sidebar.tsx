import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import NewChatIcon from "./icons/NewChatIcon";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  children?: ReactNode;
}

const Sidebar = ({ isOpen, onToggle, onNewChat, children }: SidebarProps) => {
  return (
    <>
      {/* Backdrop overlay when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={onToggle}
        />
      )}
      
      {/* Fixed buttons container */}
      <div className="fixed top-0 left-0 z-40 flex h-[60px] items-center gap-2 px-3">
        <button 
          onClick={onToggle} 
          className="h-10 rounded-lg px-2 text-token-text-secondary hover:bg-token-sidebar-surface-secondary"
        >
          <Menu className="h-5 w-5" />
        </button>
        <button 
          onClick={onNewChat}
          className="h-10 rounded-lg px-2 text-token-text-secondary hover:bg-token-sidebar-surface-secondary"
          title="New Chat"
        >
          <NewChatIcon />
        </button>
      </div>
      
      {/* Sidebar content */}
      <div className={cn(
        "fixed top-0 left-0 z-40 h-screen w-[31rem] bg-[#1f1b33] transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <nav className="flex h-full w-full flex-col px-3" aria-label="Chat history">
          <div className="h-[60px]" /> {/* Spacer for fixed buttons */}

          {/* Chat history goes here */}
          {children}

          {isOpen && (
            <div className="flex flex-col py-0.5 border-t border-white/20 mt-auto">
              <button className="group flex gap-1 p-1.5 text-sm items-center hover:bg-token-sidebar-surface-secondary rounded-lg px-2 text-left w-full min-w-[200px]">
                <span className="flex w-full flex-row flex-wrap-reverse justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-sm">Powered by</span>
                    <img 
                      src="https://www.playtech.com/app/uploads/2023/08/logo-asset.svg" 
                      alt="Playtech logo" 
                      className="h-24 w-24 object-contain"
                    />
                  </div>
                </span>
              </button>
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
