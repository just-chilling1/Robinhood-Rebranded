"use client"

import { motion } from "framer-motion"
import { PageHeader } from "@/components/page-header"
import { ContactSupportWidget } from "@/components/contact-support-widget"
import { faqSections } from "@/lib/faq"
import { support } from "@/lib/support"
import { SupportChannelCards } from "./support-channel-cards"
import { SupportFaqAccordion, SupportFaqCardHeader } from "./support-faq-accordion"
import { SupportRefundSection, SupportTrustRow, containerVariants, itemVariants } from "./support-refund-section"
import { SupportHero } from "./support-hero"
import { SupportStatCards } from "./support-stat-cards"

export function SupportPageContent() {
  return (
    <div className="page-container mx-auto w-full max-w-7xl">
      <PageHeader eyebrow="Help" title={support.pageTitle} subtitle={support.pageSubtitle} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-5"
      >
        <motion.div variants={itemVariants}>
          <SupportHero />
        </motion.div>

        <motion.div variants={itemVariants}>
          <SupportStatCards />
        </motion.div>

        <motion.div variants={itemVariants}>
          <SupportChannelCards />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
          <div id="faq" className="card-base overflow-hidden p-0 lg:col-span-3">
            <SupportFaqCardHeader />
            <SupportFaqAccordion sections={faqSections} />
          </div>

          <div id="contact" className="lg:sticky lg:top-6 lg:col-span-2">
            <ContactSupportWidget />
          </div>
        </motion.div>

        <SupportRefundSection />
        <motion.div variants={itemVariants}>
          <SupportTrustRow />
        </motion.div>
      </motion.div>
    </div>
  )
}
