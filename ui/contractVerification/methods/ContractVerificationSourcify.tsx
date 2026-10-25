// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';

import config from 'configs/app';

import ContractVerificationMethod from '../ContractVerificationMethod';

const ContractVerificationSourcify = () => {
  const { t: tQuat } = useTranslation();

  const { watch } = useFormContext<FormFields>();
  const address = watch('address');

  // Disable iframe in private mode to prevent tracking
  if (config.app.isPrivateMode) {
    return (
      <ContractVerificationMethod title={ tQuat('verification.sourcify_title') }>
        <p>{ tQuat('verification.private_mode_disabled') }</p>
      </ContractVerificationMethod>
    );
  }

  const iframeUrl = `https://verify.sourcify.dev/widget?chainId=${ config.chain.id }&address=${ address }`;

  return (
    <ContractVerificationMethod title={ tQuat('verification.sourcify_title') }>
      <iframe
        title={ tQuat('verification.sourcify_widget') }
        src={ iframeUrl }
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="no-referrer"
        width="100%"
        height="840"
      />
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationSourcify);
