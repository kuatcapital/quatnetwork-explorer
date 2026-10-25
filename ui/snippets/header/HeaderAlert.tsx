// Modified by Quat Capital, 2026-10-25: localized Quat testnet notice (T18, GPL-3.0).
import type { FlexProps } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import AlertWithExternalHtml from 'ui/shared/alerts/AlertWithExternalHtml';

import IndexingBlocksAlert from './alerts/IndexingBlocksAlert';

const maintenanceAlertHtml = config.UI.maintenanceAlert.message || '';
const QUAT_TESTNET_WARNING =
  'ТЕСТОВАЯ СЕТЬ. Только для тестирования. KZTT и eAltyn не являются деньгами и не имеют ценности. Реальные средства не принимаются.';

const HeaderAlert = (props: FlexProps) => {
  const { t } = useTranslation();
  const alertHtml = maintenanceAlertHtml === QUAT_TESTNET_WARNING ? t('quat.testnet_warning') : maintenanceAlertHtml;
  return (
    <Flex flexDir="column" rowGap={ 1 } mb={{ base: 6, lg: 3 }} _empty={{ display: 'none' }} { ...props }>
      { alertHtml && <AlertWithExternalHtml html={ alertHtml } status="info" showIcon/> }
      <IndexingBlocksAlert/>
    </Flex>
  );
};

export default React.memo(HeaderAlert);
