// app/layout.tsx

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />

          <main>{children}</main>

          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
