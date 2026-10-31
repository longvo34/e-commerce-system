export default function Footer() {
  // const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-foreground text-background py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <span className="text-xl font-extrabold tracking-tight text-background">
          ABC
        </span>
        <p className="text-sm text-background/70">
          © 2026 ABC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
