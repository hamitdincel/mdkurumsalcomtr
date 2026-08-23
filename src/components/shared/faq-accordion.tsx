'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { trackEvent } from '@/lib/analytics/events'

export type FaqEntry = { id: string; question: string; answer: string }

export function FaqAccordion({ items }: { items: FaqEntry[] }) {
  if (items.length === 0) return null

  return (
    <Accordion
      type="single"
      collapsible
      className="border-t border-line"
      onValueChange={(value) => {
        if (!value) return
        const item = items.find((entry) => entry.id === value)
        if (item) trackEvent('faq_expand', { question: item.question })
      }}
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
