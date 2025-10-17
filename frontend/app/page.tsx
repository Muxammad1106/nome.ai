export default function HomePage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  return (
    <main>
      <h1>Welcome to the nome.ai frontend</h1>
      <p>This Next.js application is ready for development.</p>
      <p>API URL: {apiUrl}</p>
    </main>
  );
}
