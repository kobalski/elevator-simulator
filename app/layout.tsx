import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Elevator Simulator",
  description: "Coding challenge for Elevator Simulator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
