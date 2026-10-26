import React from 'react';
import ReCaptcha from 'react-google-recaptcha';
import { Trans, useTranslation } from 'react-i18next';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import { useLocale } from 'lib/i18n/provider';
import { Alert } from 'toolkit/chakra/alert';
import { Link } from 'toolkit/chakra/link';

interface Props {
  onInitError: () => void;
  hideWarning?: boolean;
}

const ReCaptchaInvisible = ({ onInitError, hideWarning = false }: Props, ref: React.Ref<ReCaptcha>) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const [ attempt, setAttempt ] = React.useState(0);
  const [ isError, setIsError ] = React.useState(false);
  const [ , setIsVisible ] = React.useState(false);

  const multichainContext = useMultichainContext();
  const chainConfig = multichainContext?.chain.app_config || config;

  const handleChange = React.useCallback(() => {
    setAttempt(attempt + 1);
  }, [ attempt ]);

  const handleError = React.useCallback(() => {
    setIsError(true);
    onInitError();
  }, [ onInitError ]);

  const handleClick = React.useCallback(() => {
    const badge = window.document.querySelector('.grecaptcha-badge');
    if (badge) {
      setIsVisible((prev) => {
        const nextValue = !prev;
        (badge as HTMLElement).style.visibility = nextValue ? 'visible' : 'hidden';
        (badge as HTMLElement).style.right = nextValue ? '14px' : '-1000px';
        return nextValue;
      });
    }
  }, [ ]);

  if (!chainConfig.services.reCaptchaV2.siteKey || config.app.isPrivateMode) {
    return null;
  }

  return (
    <>
      <ReCaptcha
        ref={ ref }
        key={ `${ attempt }-${ locale }` }
        hl={ locale }
        sitekey={ chainConfig.services.reCaptchaV2.siteKey }
        size="invisible"
        onChange={ handleChange }
        onErrored={ handleError }
      />
      { isError && !hideWarning && (
        <Alert status="warning" whiteSpace="pre-wrap" w="fit-content" mt={ 3 } descriptionProps={{ display: 'block' }}>
          <Trans t={ t } i18nKey="sharedUi.recaptcha_error" components={{ toggle: <Link onClick={ handleClick } display="inline"/> }}/>
        </Alert>
      ) }
    </>
  );
};

export default React.forwardRef(ReCaptchaInvisible);
// Modified by Quat Capital, 2026-10-26: localize reCAPTCHA UI and complete failure explanation. GPL-3.0.
