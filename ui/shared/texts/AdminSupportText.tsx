import { Box, chakra } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Link } from 'toolkit/chakra/link';

interface Props {
  className?: string;
}

const AdminSupportText = ({ className }: Props) => {
  const { t } = useTranslation();
  return (
    <Box className={ className }>
      <Trans t={ t } i18nKey="sharedUi.admin_support" components={{ email: <Link href="mailto:help@blockscout.com"/> }}/>
    </Box>
  );
};

export default chakra(AdminSupportText);
// Modified by Quat Capital, 2026-10-26: translate the complete support sentence. GPL-3.0.
