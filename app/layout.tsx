import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Algorich",
  description: "A simple web app to categorize your transactions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
