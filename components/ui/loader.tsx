export function Loader({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center p-4 gap-1 max-h-[300px] max-w-[300px]">
        <video
          src={"/assets/videos/general/drea_metrix_loader.mp4"}
          autoPlay={true}
        />
        <label className="mt-4 text-sm text-slate-500">Loading...</label>
      </div>
    </div>
  );
}
