import { jsxRenderer } from "hono/jsx-renderer";

export default jsxRenderer(({ children }) => (
  <html>
    <head>
      <title>Interactive Marble Diagram Builder</title>
      <link rel="stylesheet" href="/output.css" />
    </head>
    <body className="bg-gray-900 text-white">{children}</body>
  </html>
));
