// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Link } from 'toolkit/chakra/link';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  href: string;
}

const DocsLink = ({ href }: Props) => {
  const { t: tQuat } = useTranslation();

  return (
    <Link
      href={ href }
      external
      noIcon
      display="inline-flex"
      alignItems="center"
      columnGap={ 1 }
    >
      <IconSvg name="docs" boxSize={ 5 } color="icon.primary"/>
      <span>{ tQuat('tokenUi.documentation') }</span>
    </Link>
  );
};

export default DocsLink;
