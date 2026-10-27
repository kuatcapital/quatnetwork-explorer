// Modified by Quat Capital, 2026-10-27: T18 supplemental interface localization. GPL-3.0.
/* eslint-disable @next/next/no-img-element */
import { Box, Text, Flex } from '@chakra-ui/react';
import Script from 'next/script';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import { useLocale } from 'lib/i18n/provider';
import { Button } from 'toolkit/chakra/button';
import { Heading } from 'toolkit/chakra/heading';
import { Link } from 'toolkit/chakra/link';

const easterEggBadgeFeature = config.features.easterEggBadge;

const CapybaraRunner = () => {
  const { t: tQuat } = useTranslation();
  const { locale } = useLocale();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const gameOverText = tQuat('suppUi.game_over');
  const highScoreText = tQuat('suppUi.high_score');

  const [ hasReachedHighScore, setHasReachedHighScore ] = React.useState(false);

  const isMobile = useIsMobile();

  React.useEffect(() => {
    const gameWindow = window as Window & {
      Runner?: { updateLocale?: (element: HTMLDivElement | null) => void };
    };
    // The first draw reads the attributes if the lazy script has not loaded yet.
    gameWindow.Runner?.updateLocale?.(containerRef.current);
  }, [ locale, gameOverText, highScoreText ]);

  React.useEffect(() => {
    const preventDefaultKeys = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
      }
    };

    const handleHighScore = () => {
      setHasReachedHighScore(true);
    };

    window.addEventListener('reachedHighScore', handleHighScore);
    window.addEventListener('keydown', preventDefaultKeys);

    return () => {
      window.removeEventListener('keydown', preventDefaultKeys);
      window.removeEventListener('reachedHighScore', handleHighScore);
    };
  }, []);

  return (
    <>
      <Heading level="2" mt={ 12 } mb={ 2 }>{ tQuat('suppUi.runner_goal') }</Heading>
      <Box mb={ 4 }>{ isMobile ? tQuat('suppUi.tap_start') : tQuat('suppUi.space_start') }</Box>
      <Script strategy="lazyOnload" src="/static/capybara/index.js"/>
      <Box width={{ base: '100%', lg: '600px' }} height="300px" p="50px 0">
        <div
          id="main-frame-error"
          className="interstitial-wrapper"
          style={{ marginTop: '20px' }}
          ref={ containerRef }
          data-locale={ locale }
          data-game-over={ gameOverText }
          data-high-score={ highScoreText }
        >
          <div id="main-content"></div>
          <div id="offline-resources" style={{ display: 'none' }}>
            <img id="offline-resources-1x" src="/static/capybara/capybaraSprite.png"/>
            <img id="offline-resources-2x" src="/static/capybara/capybaraSpriteX2.png"/>
          </div>
        </div>
      </Box>
      { easterEggBadgeFeature.isEnabled && hasReachedHighScore && (
        <Flex flexDirection="column" alignItems="center" justifyContent="center" gap={ 4 } mt={ 10 }>
          <Text fontSize="2xl" fontWeight="bold">{ tQuat('suppUi.badge_unlocked') }</Text>
          <Text fontSize="lg" textAlign="center">{ tQuat('suppUi.badge_congrats') }</Text>
          <Link
            href={ easterEggBadgeFeature.badgeClaimLink }
            external noIcon
          >
            <Button>{ tQuat('suppUi.claim') }</Button>
          </Link>
        </Flex>
      ) }
    </>
  );
};

export default CapybaraRunner;
