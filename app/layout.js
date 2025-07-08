import "./globals.css";
import { QueryProvider } from '@/components/QueryProvider'

export const metadata = {
  title: "ArgoStore - Moda que Define tu Estilo",
  description: "Descubre nuestra colección exclusiva de ropa y accesorios. Calidad y estilo en cada producto.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
