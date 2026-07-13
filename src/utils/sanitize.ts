import DOMPurify from 'dompurify'

export function sanitize(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span'],
    ALLOWED_ATTR: ['href', 'title', 'class'],
  })
}

export function sanitizePlain(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] })
}
