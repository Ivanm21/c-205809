
const MessageAvatar = ({ isAssistant }: { isAssistant: boolean }) => {
  if (isAssistant) {
    return (
      <div className="relative flex h-full items-center justify-center rounded-full bg-[#1f1b33] text-white">
        <img 
          src="https://www.playtech.com/app/uploads/2023/08/logo-asset.svg" 
          alt="Playtech logo" 
          className="h-2/3 w-2/3 object-contain"
        />
      </div>
    );
  }
  
  return null;
};

export default MessageAvatar;
