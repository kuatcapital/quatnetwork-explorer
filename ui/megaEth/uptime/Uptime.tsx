// Modified by Quat Capital, 2026-10-27: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useTranslation } from 'react-i18next';

import PageTitle from 'ui/shared/Page/PageTitle';

import UptimeCharts from './UptimeCharts';
import UptimeStats from './UptimeStats';
import UptimeStatus from './UptimeStatus';
import useUptimeSocketData from './useUptimeSocketData';

const Uptime = () => {
  const { t: tQuat } = useTranslation();

  const { realtimeData, historyData, status, onReconnect } = useUptimeSocketData();

  return (
    <>
      <PageTitle
        title={ tQuat('suppUi.uptime') }
        contentAfter={ <UptimeStatus status={ status } onReconnect={ onReconnect }/> }
      />
      <UptimeStats realtimeData={ realtimeData }/>
      <UptimeCharts historyData={ historyData }/>
    </>
  );
};

export default React.memo(Uptime);
