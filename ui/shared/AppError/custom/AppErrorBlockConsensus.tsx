// Modified by Quat Capital, 2026-10-25: localize chain reorganization feedback. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { route } from 'nextjs-routes';

import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';

import AppErrorIcon from '../AppErrorIcon';
import AppErrorTitle from '../AppErrorTitle';

interface Props {
  hash?: string;
}

const AppErrorBlockConsensus = ({ hash }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <AppErrorIcon statusCode={ 404 }/>
      <AppErrorTitle title={ t('errors.block_reorganized') }/>
      <Link href={ hash ? route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: hash } }) : route({ pathname: '/' }) } asChild>
        <Button
          mt={ 8 }
          variant="outline"
        >
          { hash ? t('errors.view_reorg') : t('errors.back_home') }
        </Button>
      </Link>
    </>
  );
};

export default AppErrorBlockConsensus;
