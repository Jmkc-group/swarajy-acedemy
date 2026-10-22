/** tel: link for a 10-digit Indian mobile number */
export function telHref(number) {
  return `tel:+91${number}`
}

/** 9168074652 -> +91 91680 74652 */
export function formatPhone(number) {
  return `+91 ${number.slice(0, 5)} ${number.slice(5)}`
}

export function mapsSearchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function mapsDirectionsUrl(query) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`
}
