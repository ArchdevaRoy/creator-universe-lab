import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Last updated: March 8, 2026</p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-display font-bold text-foreground">1. Information We Collect</h2>
          <p>We collect information you provide directly, such as your name, email address, and profile details when you create an account. We also collect usage data automatically, including pages visited, features used, and device information.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-display font-bold text-foreground">2. How We Use Your Information</h2>
          <p>We use your information to provide and improve Nine Lives services, personalize your experience, communicate updates, and ensure platform security. We do not sell your personal data to third parties.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-display font-bold text-foreground">3. Data Storage & Security</h2>
          <p>Your data is stored securely using industry-standard encryption. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-display font-bold text-foreground">4. Cookies & Tracking</h2>
          <p>We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver relevant content. You can manage cookie preferences through your browser settings.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-display font-bold text-foreground">5. Third-Party Services</h2>
          <p>We may integrate with third-party services for analytics, payment processing, and content delivery. These services have their own privacy policies, and we encourage you to review them.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-display font-bold text-foreground">6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. You may also request data portability or withdraw consent for data processing. Contact us to exercise these rights.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-display font-bold text-foreground">7. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please reach out to us at <span className="text-foreground font-medium">privacy@ninelives.app</span>.</p>
        </section>
      </div>
    </motion.div>
  );
}
