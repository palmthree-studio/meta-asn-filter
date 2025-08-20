/**
 * Export principal : isMetaIP(ip) → boolean
 * Utilise la liste CIDR générée dans data/meta-asn.json
 */
import CidrMatcher from "cidr-matcher";
import metaCIDR from "../data/meta-asn.json";

const matcher = new CidrMatcher(metaCIDR);

/** Retourne true si l'IP appartient à l'ASN 32934 (Meta) */
export function isMetaIP(ip: string): boolean {
  return matcher.contains(ip);
}
