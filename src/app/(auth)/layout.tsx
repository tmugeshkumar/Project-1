export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-center py-12 sm:py-16 px-4">
      <div className="w-full max-w-lg">
        {children}
      </div>
    </div>
  );
}
