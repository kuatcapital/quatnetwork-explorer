// Modified by Quat Capital, 2026-10-27: per-request runtime metadata translations. GPL-3.0.
import type { TFunction } from 'i18next';

export type MetadataTemplateParams = Record<string, string | Array<string> | undefined>;

export function metadataRouteKey(pathname: string): string {
  return pathname === '/' ? 'home' : pathname.slice(1).replace(/\[([^\]]+)\]/g, 'by_$1').replace(/[^a-zA-Z0-9_]+/g, '_');
}

export function localizeMetadataTemplate(template: string, key: string, t: TFunction, params: MetadataTemplateParams): string {
  const values: Record<string, string> = {};
  for (const [ name, value ] of Object.entries(params)) {
    values[name] = Array.isArray(value) ? value.join(', ') : value ?? '';
  }
  // Interpolate once: placeholder-shaped query/API values must remain literal user data.
  return t(key, {
    ...values,
    defaultValue: template.replace(/%(\w+)%/g, '{{$1}}'),
    interpolation: { escapeValue: false, skipOnVariables: true },
  });
}
