import './globals.css'

export const metadata = {
  title: 'Automated Aeroponics',
  description: 'Automated Aeroponics System Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
