export default function Loading({ fullScreen = false }) {
  const spinner = (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}