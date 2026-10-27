// Modified by Quat Capital, 2026-10-27: format widget numbers by locale without losing API integer digits. GPL-3.0.
import { get } from 'es-toolkit/compat';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { useLocale } from 'lib/i18n/provider';

import { formatAddressWidgetValue } from '../localization';

const RESOURCE_NAME = 'general:address_3rd_party_info';

export default function useWidgetData(name: string, valuePath: string | undefined, address: string, isLoading: boolean) {
  const { locale } = useLocale();
  const query = useApiQuery<typeof RESOURCE_NAME, unknown, string | undefined>(RESOURCE_NAME, {
    pathParams: { name },
    queryParams: { address, chain_id: config.chain.id },
    queryOptions: {
      select: (response) => {
        try {
          const value = get(response, valuePath || '');
          return formatAddressWidgetValue(value, locale);
        } catch {
          return undefined;
        }
      },
      enabled: !isLoading && Boolean(valuePath),
      refetchOnMount: false,
    },
  });

  return query;
}
