import AuthForm from "@/components/auth-page/AuthForm";
import { Navbar } from "@/components/layout/Navbar";
import { Section } from "@/components/ui/Section";
import { BsCheckCircle } from "react-icons/bs";

export default function Login() {
  const featureList = [
    "Facilitates Secure and Efficient Data Exchanges",
    "Enhanced Security for All Transactions",
    "Ensures a Fast and Reliable Verification Process",
    "Offers Immutable Record Keeping for All Documents",
    "Prevents Fraud through Advanced Authentication",
    "Delivers Global Accessibility for Users Everywhere"
  ]
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
          <div className="hidden lg:flex w-1/2 h-full flex-col justify-center items-center px-6 my-auto">
            <div className="w-full">
              <h2 className="self-start text-left text-white mb-6 text-3xl xl:text-4xl">Start Issuing Verified and Immutable Records</h2>
              {featureList.map((feature, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-3">
                  <BsCheckCircle size={24} className="text-accent" />
                  <h4 className="m-0 p-0 text-accent text-base xl:text-lg">{feature}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
