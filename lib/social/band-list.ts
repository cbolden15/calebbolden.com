export type BandKey = 'foundations' | 'pilot' | 'sequence';
export type ListName = 'owners' | 'operators';

/**
 * Readiness band determines which newsletter a respondent joins.
 * Foundations and pilot respondents are owner-shaped; sequence respondents
 * are operator-shaped. See the 2026-08-03 founder social presence spec.
 */
export function bandToList(band: BandKey): ListName {
  return band === 'sequence' ? 'operators' : 'owners';
}
