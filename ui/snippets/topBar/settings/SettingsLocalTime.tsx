// Modified by Quat Capital, 2026-10-25: localize local-time preference. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useSettingsContext } from 'lib/contexts/settings';
import { Switch } from 'toolkit/chakra/switch';

const SettingsLocalTime = () => {
  const { t } = useTranslation();
  const settingsContext = useSettingsContext();

  if (!settingsContext) {
    return null;
  }

  const { isLocalTime, toggleIsLocalTime } = settingsContext;

  return (
    <Switch
      id="local-time"
      defaultChecked={ isLocalTime }
      onChange={ toggleIsLocalTime }
      direction="rtl"
      justifyContent="space-between"
      w="100%"
      minH="34px"
    >
      { t('common.local_time_format') }
    </Switch>
  );
};

export default React.memo(SettingsLocalTime);
