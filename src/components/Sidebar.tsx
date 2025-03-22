import { Menu, Globe, ChevronDown, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState, ReactNode } from "react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onApiKeyChange: (apiKey: string) => void;
  children?: ReactNode;
}

const Sidebar = ({ isOpen, onToggle, onApiKeyChange, children }: SidebarProps) => {
  const [apiKey, setApiKey] = useState("");

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    onApiKeyChange(newApiKey);
  };

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

        {/* API Key section */}
        {isOpen && (
          <div className="p-2 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-4 w-4" />
              <span className="text-sm">API Key</span>
            </div>
            <Input
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={handleApiKeyChange}
              className="bg-[#2F2F2F] border-none"
            />
          </div>
        )}

        {/* Chat history goes here */}
        {children}

        {isOpen && (
          <div className="flex flex-col py-2 border-t border-white/20 mt-auto">
            <button className="group flex gap-2 p-2.5 text-sm items-start hover:bg-token-sidebar-surface-secondary rounded-lg px-2 text-left w-full min-w-[200px]">
              <span className="flex w-full flex-row flex-wrap-reverse justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Powered by</span>
                  <span className="font-bold">Playtech</span>
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
