const LoadingAnimation = () => {
  return (
    <div className="py-6">
      <div className="flex gap-4">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#1f1b33]">
          <img 
            src="./images/assistant-logo.png"
            alt="Assistant avatar"
            className="h-8 w-8 object-contain"
            style={{ imageRendering: 'crisp-edges' }}
          />
        </div>
        <div className="flex items-end">
          <div className="flex space-x-2 pb-1.5">
            <div className="h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s] transform hover:scale-110"></div>
            <div className="h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s] transform hover:scale-110"></div>
            <div className="h-3 w-3 bg-white rounded-full animate-bounce transform hover:scale-110"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation; 