import Navbar from "../components/Navbar";
import Footer from "../components/Footer"
import ReduxProvider from "@/redux/Provider";
import "./globals.css";
import ToastProvider from "../components/ToastProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
        <Navbar />
        {children}
        <ToastProvider />
        <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}