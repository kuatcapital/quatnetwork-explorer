// Modified by Quat Capital, 2026-10-25: localized entity labels and accessibility text. GPL-3.0.
import { ImageData, getNounData, getNounSeedFromBlockHash } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
import CryptoJS from 'crypto-js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Image } from 'toolkit/chakra/image';

const { palette } = ImageData;

interface NounsIdenticonProps {
  hash: string;
  size: number;
}

const MAGIC_HASH = '0xAC1CA184579A254E4F289319E42FF4A67BF5698AD26C6E7C68769D0D21FAFCB1';

// analog of getNumberFromString from deleted @cloudnoun package
export const getNumberFromString = (input: string): number => {
  const str = input.trim();
  if (!str) return 0;

  const combined = [
    str,
    CryptoJS.MD5(str).toString(CryptoJS.enc.Hex),
    CryptoJS.SHA1(str).toString(CryptoJS.enc.Base64),
    CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex),
    CryptoJS.SHA512(str).toString(CryptoJS.enc.Base64),
    CryptoJS.RIPEMD160(str).toString(CryptoJS.enc.Base64),
  ].join('');

  let sum = 0;
  for (let i = 0; i < combined.length; i++) {
    sum += combined.charCodeAt(i);
  }
  return sum * str.length;
};

const NounsIdenticon: React.FC<NounsIdenticonProps> = ({ hash, size }) => {
  const { t } = useTranslation();
  const id = getNumberFromString(hash);
  const seed = getNounSeedFromBlockHash(id, MAGIC_HASH);

  const { parts, background } = getNounData(seed);
  const svg = buildSVG(parts, palette, background);
  const svgData = btoa(svg);
  if (!svgData) {
    return null;
  }

  return (
    <Image
      src={ `data:image/svg+xml;base64,${ svgData }` }
      alt={ t('sharedEntities.nouns_identicon', { hash }) }
      width={ `${ size }px` }
      height={ `${ size }px` }
    />
  );
};

export default React.memo(NounsIdenticon);
