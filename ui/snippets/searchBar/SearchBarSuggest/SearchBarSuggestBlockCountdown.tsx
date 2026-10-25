// Modified by Quat Capital, 2026-10-25: localize complete countdown messages with links. GPL-3.0.
import { chakra, Box } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { route } from 'nextjs-routes';

import { Link } from 'toolkit/chakra/link';

interface Props {
  blockHeight: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  isMultichain?: boolean;
}

const SearchBarSuggestBlockCountdown = ({ blockHeight, onClick, className, isMultichain }: Props) => {
  const { t } = useTranslation();

  if (isMultichain) {
    return (
      <Box className={ className }>
        <Trans
          t={ t }
          i18nKey="search.block_not_created"
          components={{ blocks: <Link href={ route({ pathname: '/blocks' }) } onClick={ onClick }/> }}
        />
      </Box>
    );
  }

  return (
    <Box className={ className }>
      <Trans
        t={ t }
        i18nKey="search.block_countdown_link"
        components={{
          countdown: <Link href={ route({ pathname: '/block/countdown/[height]', query: { height: blockHeight } }) } onClick={ onClick }/>,
        }}
      />
    </Box>
  );
};

export default React.memo(chakra(SearchBarSuggestBlockCountdown));
