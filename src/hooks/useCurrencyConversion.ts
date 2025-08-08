import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ConversionPayload {
  amount: string;
  from_currency: string;
  to_currency: string;
}

interface ConversionResponse {
  converted_amount: number;
}

/**
 * A custom hook to convert an amount from one currency to another.
 * @param amount The amount to convert.
 *- @param fromCurrency The original currency (e.g., 'USD').
 * @param toCurrency The target currency (e.g., 'TZS').
 * @returns The query result including the converted amount.
 */
export const useCurrencyConversion = (payload: ConversionPayload) => {
  const currencyClient = axios.create({
    baseURL: "http://192.168.1.193:8010/api/v1",
  });
  const { amount, from_currency, to_currency } = payload;

  return useQuery<ConversionResponse>({
    queryKey: ["currencyConversion", amount, from_currency, to_currency],
    queryFn: async () => {
      const response = await currencyClient.post("/currency/convert", {
        amount: String(amount), // API expects a string
        from_currency,
        to_currency,
      });
      return response.data;
    },
    // Only run this query if the amount is a positive number and currencies are different
    enabled:
      !!amount && parseFloat(amount) > 0 && from_currency !== to_currency,
    staleTime: 1000 * 60 * 60, // Cache conversion for 1 hour
    refetchOnWindowFocus: false,
  });
};
