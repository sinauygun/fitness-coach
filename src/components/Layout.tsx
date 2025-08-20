import type { ReactNode } from "react"
import { Link, useLocation } from "react-router-dom";

export default function Layout({children}:{children:ReactNode}) {
  const { pathname } = useLocation();
  const is = (p:string)=> pathname===p ? "text-white bg:white/5" : "";
  return (
    <div className="min-h-screen">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="brand">🏋️ Fitness Coach</Link>
          <nav className="nav flex items-center gap-1">
            <Link className={`rounded-lg ${is("/")}`} to="/">Bugün</Link>
            <Link className={`rounded-lg ${is("/calendar")}`} to="/calendar">Takvim</Link>
            <Link className={`rounded-lg ${is("/charts")}`} to="/charts">Grafikler</Link>
            <Link className={`rounded-lg ${is("/editor")}`} to="/editor">Düzenle</Link>
          </nav>
        </div>
      </header>
      <main className="container-app py-6">{children}</main>
      <footer className="container-app py-8 text-center subtle">PWA — iPhone’da “Paylaş → Ana Ekrana Ekle”</footer>
    </div>
  );
}
