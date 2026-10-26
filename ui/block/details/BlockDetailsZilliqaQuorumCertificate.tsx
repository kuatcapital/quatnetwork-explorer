// Modified by Quat Capital, 2026-10-26: runtime locale for block and statistics UI. GPL-3.0.
import { Separator, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ZilliqaNestedQuorumCertificate, ZilliqaQuorumCertificate } from 'types/api/block';

import { formatNumber } from 'lib/format/localeNumbers';
import { useLocale } from 'lib/i18n/provider';
import { AccordionRoot, AccordionItem, AccordionItemTrigger, AccordionItemContent } from 'toolkit/chakra/accordion';
import { Hint } from 'toolkit/components/Hint/Hint';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';

function formatSigners(signers: Array<number>) {
  return `[${ signers.join(', ') }]`;
}

interface Props {
  data: ZilliqaQuorumCertificate & {
    nested_quorum_certificates?: Array<ZilliqaNestedQuorumCertificate>;
  };
}

const BlockDetailsZilliqaQuorumCertificate = ({ data }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const hint = (isNested?: boolean) => (
    <span style={{ whiteSpace: 'pre-line' }}>
      { t('blockDetails.certificate_hint') }
      { isNested && <>{ '\n\n' }{ t('blockDetails.nested_hint') }</> }
    </span>
  );

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ hint() }
      >
        { data.nested_quorum_certificates ? t('blockDetails.aggregate_certificate') : t('blockDetails.certificate') }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue flexWrap="wrap">
        <Grid
          textStyle="sm"
          gridTemplateColumns="min-content 1fr"
          columnGap={ 5 }
          mt={{ base: 2, lg: 1.5 }}
        >
          <GridItem fontWeight={ 600 }>{ t('blockDetails.view') }</GridItem>
          <GridItem>{ formatNumber(data.view, locale) }</GridItem>
          <DetailedInfo.ItemDivider my={{ base: 2, lg: 2 }} colSpan={ 2 }/>
          <GridItem fontWeight={ 600 }>{ t('blockDetails.signature') }</GridItem>
          <GridItem whiteSpace="pre-wrap" wordBreak="break-word" display="flex" alignItems="flex-start">
            { data.signature }
            <CopyToClipboard text={ data.signature }/>
          </GridItem>
          <DetailedInfo.ItemDivider my={{ base: 2, lg: 2 }} colSpan={ 2 }/>
          <GridItem fontWeight={ 600 }>{ t('blockDetails.signers') }</GridItem>
          <GridItem whiteSpace="pre-wrap">{ formatSigners(data.signers) }</GridItem>
        </Grid>
        { data.nested_quorum_certificates && data.nested_quorum_certificates.length > 0 && (
          <>
            <Separator mt={ 2 } w="100%"/>
            <AccordionRoot
              multiple
              w="100%"
              textStyle="sm"
            >
              <AccordionItem
                value="nested-quorum-certificates"
                borderWidth={ 0 }
                _last={{ borderBottomWidth: 0 }}
              >
                <AccordionItemTrigger
                  textStyle="sm"
                  fontWeight={ 600 }
                >
                  <span>{ t('blockDetails.nested_certificates') }</span>
                  <Hint label={ hint(true) }/>
                </AccordionItemTrigger>
                <AccordionItemContent display="flex" flexDirection="column" rowGap={ 2 } p={ 0 }>
                  { data.nested_quorum_certificates?.map((item, index) => (
                    <Grid
                      key={ index }
                      gridTemplateColumns="90px minmax(0, 1fr)"
                      columnGap={ 3 }
                      rowGap={ 2 }
                      bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
                      p={ 4 }
                      borderRadius="md"
                      _first={{ borderTopRightRadius: 0, borderTopLeftRadius: 0 }}
                    >
                      <GridItem>{ t('blockDetails.view') }</GridItem>
                      <GridItem>{ formatNumber(item.view, locale) }</GridItem>
                      <GridItem>{ t('blockDetails.signature') }</GridItem>
                      <GridItem whiteSpace="pre-wrap" wordBreak="break-word" display="flex" alignItems="flex-start">
                        { item.signature }
                        <CopyToClipboard text={ item.signature }/>
                      </GridItem>
                      <GridItem>{ t('blockDetails.signers') }</GridItem>
                      <GridItem whiteSpace="pre-wrap">{ formatSigners(item.signers) }</GridItem>
                      <GridItem whiteSpace="pre-wrap">{ t('blockDetails.proposed_by') }</GridItem>
                      <GridItem >{ formatNumber(item.proposed_by_validator_index, locale) }</GridItem>
                    </Grid>
                  )) }
                </AccordionItemContent>
              </AccordionItem>
            </AccordionRoot>
          </>
        ) }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(BlockDetailsZilliqaQuorumCertificate);
