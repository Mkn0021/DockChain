import { Button } from "@/components/Button";
import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  return (
    <main>
      <Navbar className="dark">
        <Button variant="secondary" href="#how-it-works">
          How It Works?
        </Button>
        <Button variant="primary" href="/login">
          Login
        </Button>
      </Navbar>
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white text-gray-900">
        <h1 className="text-4xl font-bold">Welcome to DockChain</h1>
        <p className="mt-4 text-lg">
          DockChain — verifiable document signing and storage on-chain. Sign, verify and store documents securely with blockchain anchors.
        </p>
      </div>
    </main>
  );
}
