// Modified by Quat Capital, 2026-10-27: localize Filecoin actor labels without changing API types. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FilecoinActorType } from 'types/api/addressParams';

import { Badge } from 'toolkit/chakra/badge';

const ACTOR_TYPES: Record<FilecoinActorType, string> = {
  account: 'addressTxUi.actor_account',
  cron: 'addressTxUi.actor_cron',
  datacap: 'addressTxUi.actor_datacap',
  eam: 'addressTxUi.actor_eam',
  ethaccount: 'addressTxUi.actor_ethaccount',
  evm: 'addressTxUi.actor_evm',
  init: 'addressTxUi.actor_init',
  market: 'addressTxUi.actor_market',
  miner: 'addressTxUi.actor_miner',
  multisig: 'addressTxUi.actor_multisig',
  paych: 'addressTxUi.actor_paych',
  placeholder: 'addressTxUi.actor_placeholder',
  power: 'addressTxUi.actor_power',
  reward: 'addressTxUi.actor_reward',
  system: 'addressTxUi.actor_system',
  verifreg: 'addressTxUi.actor_verifreg',
};

type Props = {
  actorType: FilecoinActorType;
};

const FilecoinActorTag = ({ actorType }: Props) => {
  const { t } = useTranslation();
  const key = ACTOR_TYPES[actorType];

  if (!key) {
    return null;
  }

  return <Badge colorPalette="gray">{ t(key) }</Badge>;
};

export default FilecoinActorTag;
