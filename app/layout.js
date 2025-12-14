// app/layout.js
// Make sure your globals.css file exists in the 'app' folder
import './globals.css'; 

export const metadata = {
  title: 'Perfume Store Order',
  description: 'Perfume Order Form.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}