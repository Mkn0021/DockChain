import AuthForm from "@/components/auth-page/AuthForm";
import { Navbar } from "@/components/layout/Navbar";
import { Section } from "@/components/ui/Section";

export default function Login() {
  return (
    <main>
      <Navbar />
      <Section className="!py-4">
        <div className="flex w-full h-full">
          {/* Left Side - Auth Form */}
          <div className="w-2/5 h-full flex justify-center items-center">
            <AuthForm />
          </div>

          {/* Right Side */}
          <div className="w-3/5 h-full">
            <h1>Right Side</h1>
          </div>
        </div>
      </Section>
    </main>
  );
}
