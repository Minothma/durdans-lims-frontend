import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Durdans LIMS",
    description: "Laboratory Management ERP System - Durdans Hospital",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}