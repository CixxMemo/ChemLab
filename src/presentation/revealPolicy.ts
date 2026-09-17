export type RevealField = 'bond' | 'product' | 'deltaEN' | 'octet' | 'explanation';

export const REVEAL_FIELDS: readonly RevealField[] = ['bond', 'product', 'deltaEN', 'octet', 'explanation'];

export interface RevealPolicy {
  readonly bond: boolean;
  readonly product: boolean;
  readonly deltaEN: boolean;
  readonly octet: boolean;
  readonly explanation: boolean;
  readonly showCanvas: boolean;
}

export function getRevealPolicy(level: number): RevealPolicy {
  const visible = (field: RevealField) => REVEAL_FIELDS.indexOf(field) < level;
  return {
    bond: visible('bond'),
    product: visible('product'),
    deltaEN: visible('deltaEN'),
    octet: visible('octet'),
    explanation: visible('explanation'),
    showCanvas: level >= REVEAL_FIELDS.length
  };
}
