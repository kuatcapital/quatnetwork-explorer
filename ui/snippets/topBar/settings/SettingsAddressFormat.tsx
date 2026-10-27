// Modified by Quat Capital, 2026-10-27: complete runtime shell localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import { BECH_32_SEPARATOR } from 'lib/address/bech32';
import { useSettingsContext } from 'lib/contexts/settings';
import { Switch } from 'toolkit/chakra/switch';

const SettingsAddressFormat = () => {
  const { t: tShell } = useTranslation();
  const settingsContext = useSettingsContext();

  if (!settingsContext || config.UI.views.address.hashFormat.availableFormats.length < 2) {
    return null;
  }

  const { addressFormat, toggleAddressFormat } = settingsContext;

  return (
    <Switch
      id="address-format"
      defaultChecked={ addressFormat === 'bech32' }
      onChange={ toggleAddressFormat }
      mt={ 4 }
      direction="rtl"
      justifyContent="space-between"
      w="100%"
    >
      { tShell('shellUi.show_address_format', { prefix: config.UI.views.address.hashFormat.bech32Prefix + BECH_32_SEPARATOR }) }
    </Switch>
  );
};

export default React.memo(SettingsAddressFormat);
