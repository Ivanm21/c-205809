const LoadingAnimation = () => {
  return (
    <div className="py-6">
      <div className="flex gap-4">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#1f1b33] text-white">
          <img 
            src="https://www.playtech.com/app/uploads/2023/08/logo-asset.svg" 
            alt="Playtech logo" 
            className="h-2/3 w-2/3 object-contain"
          />
        </div>
        <div className="flex items-end">
          <div className="flex space-x-1 pb-1.5">
            <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation; 