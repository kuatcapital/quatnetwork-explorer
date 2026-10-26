// Modified by Quat Capital, 2026-10-26: localize shared controls, details and data feedback. GPL-3.0.
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { NetworkExplorer as TNetworkExplorer } from 'types/networks';

import config from 'configs/app';
import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { stripTrailingSlash } from 'toolkit/utils/url';
import IconSvg from 'ui/shared/IconSvg';
import VerifyWith from 'ui/shared/VerifyWith';

interface Props {
  className?: string;
  type: keyof TNetworkExplorer['paths'];
  pathParam: string;
}

const NetworkExplorers = ({ className, type, pathParam }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const explorersLinks = React.useMemo(() => {
    return config.UI.explorers.items
      .filter((explorer) => typeof explorer.paths[type] === 'string')
      .map((explorer) => {
        const path = explorer.paths[type] || '';
        let pathWithParam;
        if (path.includes(':id_lowercase')) {
          pathWithParam = path.replace(':id_lowercase', pathParam.toLowerCase());
        } else if (path.includes(':id')) {
          pathWithParam = path.replace(':id', pathParam);
        } else {
          pathWithParam = stripTrailingSlash(path) + '/' + pathParam.toLowerCase();
        }
        const url = new URL(pathWithParam, explorer.baseUrl);
        return (
          <Link external h="34px" key={ explorer.baseUrl } href={ url.toString() } alignItems="center" display="inline-flex" minW="120px">
            { explorer.logo ?
              <Image boxSize={ 5 } mr={ 2 } src={ explorer.logo } alt={ t('common.icon', { name: explorer.title }) }/> :
              <IconSvg name="explorer" boxSize={ 5 } color="icon.primary" mr={ 2 }/>
            }
            { explorer.title }
          </Link>
        );
      });
  }, [ pathParam, type, t ]);

  if (explorersLinks.length === 0) {
    return null;
  }

  return (
    <VerifyWith
      className={ className }
      links={ explorersLinks }
      label={ t('sharedUi.verify_other_explorers') }
      longText={ t('sharedUi.explorers', { count: explorersLinks.length, value: formatNumber(explorersLinks.length, locale) }) }
      shortText={ formatNumber(explorersLinks.length, locale) }
    />
  );
};

export default React.memo(chakra(NetworkExplorers));
