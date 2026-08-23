'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics/events'

/** Hizmet sayfası görüntüleme event'i. */
export function ServiceViewTracker({ slug, title }: { slug: string; title: string }) {
  useEffect(() => {
    trackEvent('service_view', { service_slug: slug, service_title: title })
  }, [slug, title])

  return null
}

/** Proje/vaka sayfası görüntüleme event'i. */
export function ProjectViewTracker({ slug, title }: { slug: string; title: string }) {
  useEffect(() => {
    trackEvent('project_view', { project_slug: slug, project_title: title })
  }, [slug, title])

  return null
}
