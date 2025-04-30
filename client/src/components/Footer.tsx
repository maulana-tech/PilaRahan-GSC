import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="py-8 px-4 text-foreground/70 bg-background">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm mb-2">
          PilaRahan adalah layanan pengelolaan sampah berbasis AI.
        </p>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} PilaRahan. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
