// Modified by Quat Capital, 2026-10-26: runtime locale for block and statistics UI. GPL-3.0.
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { AddressParam } from 'types/api/addressParams';
import type { BlockBaseFeeCelo } from 'types/api/block';
import type { TokenInfo } from 'types/api/token';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { Link } from 'toolkit/chakra/link';
import { ZERO_ADDRESS } from 'toolkit/utils/consts';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';
import TokenValue from 'ui/shared/value/TokenValue';

type ItemProps = BlockBaseFeeCelo['breakdown'][number] & {
  addressFrom: AddressParam;
  token: TokenInfo;
};

const BreakDownItem = ({ amount, percentage, address, addressFrom, token }: ItemProps) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const isBurning = address.hash === ZERO_ADDRESS;

  return (
    <Flex alignItems="center" columnGap={ 2 } flexWrap="wrap">
      <Box color="text.secondary">{ t('blockDetails.celo_amount', { value: formatNumber(percentage, locale) }) }</Box>
      <TokenValue
        amount={ amount }
        token={ token }
      />
      { isBurning ? (
        <>
          <AddressEntity address={ addressFrom } truncation="constant"/>
          <IconSvg name="flame" boxSize={ 5 } color="icon.primary"/>
          <Box color="text.secondary">{ t('blockDetails.celo_burnt') }</Box>
        </>
      ) : <AddressFromTo from={ addressFrom } to={ address }/> }
    </Flex>
  );
};

interface Props {
  data: BlockBaseFeeCelo;
}

const BlockDetailsBaseFeeCelo = ({ data }: Props) => {
  const { t } = useTranslation();
  const totalFeeLabel = (
    <Box whiteSpace="pre-wrap">
      <Trans i18nKey="blockDetails.celo_distribution" components={{ fund: <Link external href="https://www.ultragreen.money"/> }}/>
    </Box>
  );

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ t('blockDetails.base_handler_hint') }
      >
        { t('blockDetails.base_handler') } </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <AddressEntity address={ data.recipient }/>
      </DetailedInfo.ItemValue>
      <DetailedInfo.ItemLabel hint={ totalFeeLabel }>
        { t('blockDetails.base_total') } </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow flexDirection="column" alignItems="flex-start">
        <TokenValue
          amount={ data.amount }
          token={ data.token }
        />
        { data.breakdown.length > 0 && (
          <Flex flexDir="column" rowGap={ 2 } mt={ 2 }>
            { data.breakdown.map((item, index) => (
              <BreakDownItem
                key={ index }
                { ...item }
                addressFrom={ data.recipient }
                token={ data.token }
              />
            )) }
          </Flex>
        ) }
      </DetailedInfo.ItemValue>
      <DetailedInfo.ItemDivider/>
    </>
  );
};

export default React.memo(BlockDetailsBaseFeeCelo);
