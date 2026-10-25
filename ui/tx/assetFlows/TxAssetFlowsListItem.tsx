// Modified by Quat Capital, 2026-10-25: runtime transaction interface localization. GPL-3.0.
import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Skeleton } from 'toolkit/chakra/skeleton';
import IconSvg from 'ui/shared/IconSvg';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import NovesFromTo from 'ui/shared/Noves/NovesFromTo';

import NovesActionSnippet from './components/NovesActionSnippet';
import type { NovesFlowViewItem } from './utils/generateFlowViewData';

type Props = {
  isPlaceholderData: boolean;
  item: NovesFlowViewItem;
};

const TxAssetFlowsListItem = (props: Props) => {
  const { t: tTx } = useTranslation();

  return (
    <ListItemMobile rowGap={ 4 } w="full" >
      <Skeleton borderRadius="sm" loading={ props.isPlaceholderData } w="full">

        <Box display="flex" >
          <IconSvg
            name="lightning"
            height="5"
            width="5"
            color="icon.primary"
          />

          <Text textStyle="sm" fontWeight="medium">
            { tTx('transactions.action') }</Text>
        </Box>

      </Skeleton>

      <NovesActionSnippet item={ props.item } isLoaded={ !props.isPlaceholderData }/>

      <Box maxW="full">
        <NovesFromTo item={ props.item } isLoaded={ !props.isPlaceholderData }/>
      </Box>
    </ListItemMobile>
  );
};

export default React.memo(TxAssetFlowsListItem);
