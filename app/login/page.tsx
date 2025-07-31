import AuthForm from "@/components/auth-page/AuthForm";
import { Navbar } from "@/components/layout/Navbar";
import { Section } from "@/components/ui/Section";

export default function Login() {
  return (
    <main>
      <Navbar />
      <Section className="!py-4 overflow-hidden">
        <div className="flex w-full h-full flex-col lg:flex-row md:justify-center">
          {/* Left Side - Auth Form */}
          <div className="w-full lg:w-1/2 h-full flex justify-center items-center">
            <AuthForm />
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex w-2/4 xl:w-3/5 h-full">
            <h1>Right Side</h1>
          </div>
        </div>
      </Section>
    </main>
  );
}
