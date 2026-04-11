export interface Region {
  id: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  exchangeRate: number;
  deliveryInfo: string;
  deliveryDays: string;
}

export const regions: Region[] = [
  { id: "za", name: "South Africa", flag: "🇿🇦", currency: "ZAR", currencySymbol: "R", exchangeRate: 1, deliveryInfo: "Free delivery on orders over R500", deliveryDays: "2-5 business days" },
  { id: "bw", name: "Botswana", flag: "🇧🇼", currency: "BWP", currencySymbol: "P", exchangeRate: 0.72, deliveryInfo: "Standard delivery fee applies", deliveryDays: "5-10 business days" },
  { id: "na", name: "Namibia", flag: "🇳🇦", currency: "NAD", currencySymbol: "N$", exchangeRate: 1, deliveryInfo: "Standard delivery fee applies", deliveryDays: "5-10 business days" },
  { id: "sz", name: "Eswatini", flag: "🇸🇿", currency: "SZL", currencySymbol: "E", exchangeRate: 1, deliveryInfo: "Standard delivery fee applies", deliveryDays: "5-8 business days" },
  { id: "ls", name: "Lesotho", flag: "🇱🇸", currency: "LSL", currencySymbol: "L", exchangeRate: 1, deliveryInfo: "Standard delivery fee applies", deliveryDays: "5-8 business days" },
  { id: "mz", name: "Mozambique", flag: "🇲🇿", currency: "MZN", currencySymbol: "MT", exchangeRate: 3.5, deliveryInfo: "International shipping", deliveryDays: "7-14 business days" },
  { id: "zw", name: "Zimbabwe", flag: "🇿🇼", currency: "USD", currencySymbol: "$", exchangeRate: 0.055, deliveryInfo: "International shipping", deliveryDays: "7-14 business days" },
  { id: "ke", name: "Kenya", flag: "🇰🇪", currency: "KES", currencySymbol: "KSh", exchangeRate: 7.1, deliveryInfo: "International shipping", deliveryDays: "10-18 business days" },
  { id: "ng", name: "Nigeria", flag: "🇳🇬", currency: "NGN", currencySymbol: "₦", exchangeRate: 82, deliveryInfo: "International shipping", deliveryDays: "10-18 business days" },
  { id: "gb", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", currencySymbol: "£", exchangeRate: 0.043, deliveryInfo: "International shipping", deliveryDays: "14-21 business days" },
  { id: "us", name: "United States", flag: "🇺🇸", currency: "USD", currencySymbol: "$", exchangeRate: 0.055, deliveryInfo: "International shipping", deliveryDays: "14-21 business days" },
];
