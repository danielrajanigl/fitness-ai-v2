export const metadata = {
  title: "Fitness AI Coach",
  description: "Personal AI Coach"
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
