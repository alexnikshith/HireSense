import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-16 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to Home
      </Link>
      
      <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Agreement to Terms</h2>
          <p>By accessing our application, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations. If you disagree with any part of these terms, you may not access the service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. User Accounts</h2>
          <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. API Usage and Limits</h2>
          <p>You agree not to misuse our APIs or associated services (such as Gmail integrations). We reserve the right to rate-limit or revoke API access to protect the integrity of our platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Intellectual Property</h2>
          <p>The Service and its original content, features, and functionality are and will remain the exclusive property of HireSense and its licensors. The Service is protected by copyright, trademark, and other laws.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Disclaimer</h2>
          <p>Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied.</p>
        </section>
      </div>
    </div>
  );
}
