import "./globals.css";
import Navbar from "./Navbar/page";
import ToasterProvider from "./ToasterProvider";

export const metadata = {
  title: "Social Media App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Navbar />
        <ToasterProvider /> 
        <div className="max-w-3xl mx-auto py-10">{children}</div>
      </body>
    </html>
  );
}
