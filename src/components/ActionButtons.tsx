import { HelpCircle } from "lucide-react";

interface ActionButtonsProps {
  onPromptClick: (prompt: string) => void;
}

const ActionButtons = ({ onPromptClick }: ActionButtonsProps) => {
  const prompts = [
    "What is Playtech's history?",
    "Tell me about Playtech's gaming solutions",
    "What are Playtech's latest innovations?",
    "How does Playtech ensure responsible gaming?",
    "What markets does Playtech operate in?"
  ];

  return (
    <div className="flex gap-2 flex-wrap justify-center mt-4">
      {prompts.map((prompt) => (
        <button 
          key={prompt} 
          onClick={() => onPromptClick(prompt)}
          className="relative flex h-[42px] items-center gap-1.5 rounded-full border border-[#383737] px-3 py-2 text-start text-[13px] shadow-xxs transition enabled:hover:bg-token-main-surface-secondary disabled:cursor-not-allowed xl:gap-2 xl:text-[14px]"
        >
          <HelpCircle className="h-4 w-4 text-blue-400" />
          {prompt}
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
