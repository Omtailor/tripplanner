import { useEffect } from 'react'

export default function useDocumentMeta({ title, description, noindex = false }) {
  useEffect(() => {
    const previousTitle = document.title
    const descriptionMeta = document.querySelector('meta[name="description"]')
    const robotsMeta = document.querySelector('meta[name="robots"]')
    const previousDescription = descriptionMeta?.getAttribute('content')
    const previousRobots = robotsMeta?.getAttribute('content')

    document.title = title
    if (descriptionMeta) descriptionMeta.setAttribute('content', description)
    if (robotsMeta) robotsMeta.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow')

    return () => {
      document.title = previousTitle
      if (descriptionMeta && previousDescription !== null) {
        descriptionMeta.setAttribute('content', previousDescription)
      }
      if (robotsMeta && previousRobots !== null) robotsMeta.setAttribute('content', previousRobots)
    }
  }, [title, description, noindex])
}
