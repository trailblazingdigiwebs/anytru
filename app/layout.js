import { Inter } from "next/font/google";
import "./globals.css";
import "./main.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AnyTru - Bringing Your Ideas To Life",
  description: "Bringing Your Ideas To Life",
};

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      {/* <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head> */}
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
