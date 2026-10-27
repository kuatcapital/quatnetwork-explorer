// Modified by Quat Capital, 2026-10-27: complete runtime contract-interface localization. GPL-3.0.
// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { Box, Text, Icon } from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

// This icon doesn't work properly when it is in the sprite
// Probably because of the gradient
// eslint-disable-next-line no-restricted-imports
import solidityScanIcon from 'icons/brands/solidity_scan.svg';
import useFetchReport from 'lib/solidityScan/useFetchReport';
import { Link } from 'toolkit/chakra/link';
import { PopoverBody, PopoverContent, PopoverRoot } from 'toolkit/chakra/popover';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import SolidityscanReportButton from 'ui/shared/solidityscanReport/SolidityscanReportButton';
import SolidityscanReportDetails from 'ui/shared/solidityscanReport/SolidityscanReportDetails';
import SolidityscanReportScore from 'ui/shared/solidityscanReport/SolidityscanReportScore';

interface Props {
  hash: string;
}

const SolidityscanReport = ({ hash }: Props) => {
  const { t: tQuat } = useTranslation();

  const popover = useDisclosure();
  const { data, isPlaceholderData, isError } = useFetchReport({ hash });

  if (isError || !data) {
    return null;
  }

  const score = Number(data.scan_report.scan_summary.score_v2);

  if (!score) {
    return null;
  }

  const vulnerabilities = data.scan_report.scan_summary.issue_severity_distribution;
  const vulnerabilitiesCounts = vulnerabilities ? Object.values(vulnerabilities) : [];
  const vulnerabilitiesCount = vulnerabilitiesCounts.reduce((acc, val) => acc + val, 0);

  return (
    <PopoverRoot open={ popover.open } onOpenChange={ popover.onOpenChange }>
      <SolidityscanReportButton
        score={ score }
        isLoading={ isPlaceholderData }
        tooltipDisabled={ popover.open }
      />
      <PopoverContent w={{ base: '100vw', lg: '328px' }}>
        <PopoverBody textStyle="sm">
          <Box mb={ 5 } lineHeight="25px">
            <Trans
              t={ tQuat }
              i18nKey="contractRemainderUi.scan_analyzed"
              components={{ scanner: <span>
                <Icon as={ solidityScanIcon } mr={ 1 } ml="6px" w="23px" h="20px" display="inline-block" verticalAlign="middle"/>
                <Text fontWeight={ 600 } display="inline-block">SolidityScan</Text>
              </span> }}
            />
          </Box>
          <SolidityscanReportScore score={ score } mb={ 5 }/>
          { vulnerabilities && vulnerabilitiesCount > 0 && (
            <Box mb={ 5 }>
              <Text py="7px" color="text.secondary" textStyle="xs" fontWeight={ 500 }>{ tQuat('addresses.vulnerability_distribution') }</Text>
              <SolidityscanReportDetails vulnerabilities={ vulnerabilities } vulnerabilitiesCount={ vulnerabilitiesCount }/>
            </Box>
          ) }
          <Link href={ data.scan_report.scanner_reference_url } external>{ tQuat('addresses.view_full_report') }</Link>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(SolidityscanReport);
