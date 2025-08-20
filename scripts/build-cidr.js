#!/usr/bin/env node
/**
 * Génère data/meta-asn.json avec toutes les plages IPv4 & IPv6 de l'ASN 32934 (Meta).
 * Usage :  node scripts/build-cidr.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASN = 'AS32934';
const OUT = path.join(__dirname, '..', 'data', 'meta-asn.json');

/* -------------------------------------------------------------------------- */

function queryRADB(prefix) {
  const cmd = `whois -h whois.radb.net -- '-i origin ${ASN}' | grep ^${prefix}`;
  console.log(`🔍 Querying RADB for ${prefix}...`);
  
  try {
    const raw = execSync(cmd, { encoding: 'utf8', timeout: 30000 }); // 30s timeout
    const results = raw
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .map(l => l.replace(new RegExp(`^${prefix}:\\s+`), ''))
      .filter(l => l && !l.startsWith('route'));
    
    console.log(`✅ Found ${results.length} ${prefix} entries`);
    return results;
  } catch (e) {
    console.error(`❌ Error querying ${prefix}:`, e.message);
    // si aucune entrée, whois renvoie code 1 → on retourne liste vide
    return [];
  }
}

/* -------------------------------------------------------------------------- */

const ipv4 = queryRADB('route');     // ex : 69.63.176.0/20
const ipv6 = queryRADB('route6');    // ex : 2a03:2880::/32

let uniqueSorted = Array.from(new Set([...ipv4, ...ipv6])).sort(
  (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
);

// Validation : on ne doit pas avoir une liste vide
if (uniqueSorted.length === 0) {
  console.error('❌ ERROR: No IP prefixes found from RADB!');
  console.error('IPv4 found:', ipv4.length);
  console.error('IPv6 found:', ipv6.length);
  console.log('🔄 Using fallback IP list...');
  uniqueSorted = FALLBACK_IPS;
}

fs.writeFileSync(OUT, JSON.stringify(uniqueSorted, null, 2) + '\n');
console.log(`✨  ${uniqueSorted.length} prefixes written to ${OUT}`); 