
import { Menu, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  children?: ReactNode;
}

const Sidebar = ({ isOpen, onToggle, children }: SidebarProps) => {
  return (
    <div className={cn(
      "fixed top-0 left-0 z-40 h-screen bg-[#1f1b33] transition-all duration-300",
      isOpen ? "w-64" : "w-0"
    )}>
      <nav className="flex h-full w-full flex-col px-3" aria-label="Chat history">
        <div className="flex justify-between flex h-[60px] items-center">
          <button onClick={onToggle} className="h-10 rounded-lg px-2 text-token-text-secondary hover:bg-token-sidebar-surface-secondary">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center">
            <img 
              src="https://www.playtech.com/app/uploads/2023/08/logo-asset.svg" 
              alt="Playtech logo" 
              className="h-8 w-8 object-contain"
            />
          </div>
        </div>

        {/* Chat history goes here */}
        {children}

        {isOpen && (
          <div className="flex flex-col py-2 border-t border-white/20 mt-auto">
            <button className="group flex gap-2 p-2.5 text-sm items-start hover:bg-token-sidebar-surface-secondary rounded-lg px-2 text-left w-full min-w-[200px]">
              <span className="flex w-full flex-row flex-wrap-reverse justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Powered by</span>
                  <img 
                    src="https://www.playtech.com/app/uploads/2023/08/logo-asset.svg" 
                    alt="Playtech logo" 
                    className="h-5 w-5 object-contain"
                  />
                </div>
              </span>
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
