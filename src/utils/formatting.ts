import { Country } from '../types';

type CurrencyFormatOptions = {
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  notation?: 'standard' | 'compact';
};

export function getCurrencyCode(country: Country): 'USD' | 'PLN' {
  return country === 'pl' ? 'PLN' : 'USD';
}

export function getCurrencyLocale(country: Country): string {
  return country === 'pl' ? 'pl-PL' : 'en-US';
}

export function formatCurrency(
  value: number,
  country: Country,
  options: CurrencyFormatOptions = {}
): string {
  return new Intl.NumberFormat(getCurrencyLocale(country), {
    style: 'currency',
    currency: getCurrencyCode(country),
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    notation: options.notation ?? 'standard',
  }).format(value);
}

export function formatCompactCurrency(value: number, country: Country): string {
  return formatCurrency(value, country, {
    maximumFractionDigits: 1,
    notation: 'compact',
  });
}
