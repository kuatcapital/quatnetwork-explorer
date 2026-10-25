// Quat Capital, 2026-10-25: expose runtime localization configuration.
import apis from './apis';
import app from './app';
import chain from './chain';
import * as features from './features';
import { i18n } from './i18n';
import meta from './meta';
import services from './services';
import UI from './ui';

const config = Object.freeze({
  app,
  chain,
  apis,
  UI,
  features,
  services,
  meta,
  i18n,
});

export default config;
