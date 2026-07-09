import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-16 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to Home
      </Link>
      
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
          <p>Welcome to HireSense ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
          <p>We collect personal information that you voluntarily provide to us when you register on the application. The personal information that we collect depends on the context of your interactions with us and the application.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Use of Google Gmail API Data</h2>
          <p>Our application requires read-only access to your Gmail account to automatically track job application statuses from employers. Regarding data obtained via the Google Workspace APIs:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>We do not use your Google data for serving advertisements.</li>
            <li>We only read emails related to job applications you are tracking.</li>
            <li>We do not allow humans to read this data unless you explicitly provide consent for security purposes or to comply with applicable law.</li>
            <li>We do not sell or share your data with any third parties.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
          <p>We aim to protect your personal information through a system of organizational and technical security measures. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Contact Us</h2>
          <p>If you have questions or comments about this notice, you may email the developer at nikshithgurram2006@gmail.com.</p>
        </section>
      </div>
    </div>
  );
}
