import { motion } from "framer-motion";

export default function TermsConditions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Terms & Conditions
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Last updated: March 8, 2026</p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-display font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>By accessing or using Nine Lives, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the platform.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-display font-bold text-foreground">2. Account Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use. You must be at least 13 years old to create an account.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-display font-bold text-foreground">3. Acceptable Use</h2>
          <p>You agree not to use Nine Lives for any unlawful purpose, to harass or harm others, to distribute malicious software, or to infringe on intellectual property rights. We reserve the right to suspend accounts that violate these terms.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-display font-bold text-foreground">4. Intellectual Property</h2>
          <p>Content you create using Nine Lives remains yours. However, by using the platform, you grant us a limited license to display and process your content as necessary to provide our services. The Nine Lives brand, logo, and platform code are our intellectual property.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-display font-bold text-foreground">5. Subscriptions & Payments</h2>
          <p>Paid features are billed according to the plan you select. You may cancel at any time; cancellation takes effect at the end of the current billing cycle. Refunds are handled on a case-by-case basis.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-display font-bold text-foreground">6. Limitation of Liability</h2>
          <p>Nine Lives is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-display font-bold text-foreground">7. Modifications</h2>
          <p>We may update these terms at any time. Continued use of the platform after changes constitutes acceptance. We will notify users of significant changes via email or in-app notification.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-display font-bold text-foreground">8. Contact</h2>
          <p>For questions about these Terms & Conditions, contact us at <span className="text-foreground font-medium">legal@ninelives.app</span>.</p>
        </section>
      </div>
    </motion.div>
  );
}
