// Modified by Quat Capital, 2026-10-26: complete empty-result translations with icon/link structure. GPL-3.0.
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { MarketplaceCategory } from 'types/client/marketplace';

import config from 'configs/app';
import { EmptyState } from 'toolkit/chakra/empty-state';
import { Link } from 'toolkit/chakra/link';
import IconSvg from 'ui/shared/IconSvg';

const feature = config.features.marketplace;

type Props = {
  favoriteApps: Array<string>;
  selectedCategoryId?: string;
};

const EmptySearchResult = ({ favoriteApps, selectedCategoryId }: Props) => {
  const { t: tEco } = useTranslation();
  return (
    <EmptyState
      description={
        (selectedCategoryId === MarketplaceCategory.FAVORITES && !favoriteApps.length) ? (
          <Trans
            t={ tEco }
            i18nKey="marketplaceUI.empty_favorites"
            components={{ heart: <IconSvg name="heart_outline" boxSize={ 5 } verticalAlign="text-bottom" color="icon.secondary"/>, br: <br/> }}
          />
        ) : (
          <>
            { tEco('marketplaceUI.no_matching_apps') }
            { 'suggestIdeasFormUrl' in feature && (
              <>
                { ' ' }
                <Trans
                  t={ tEco }
                  i18nKey="marketplaceUI.suggestion"
                  components={{ share: <Link external href={ feature.suggestIdeasFormUrl }/>, br: <br/> }}
                />
              </>
            ) }
          </>
        )
      }
    />
  );
};

export default React.memo(EmptySearchResult);
