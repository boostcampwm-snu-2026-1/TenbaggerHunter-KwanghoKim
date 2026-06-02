import { MOCK_COMPANIES, type MockCompany } from "./companies";

const byTicker = new Map<string, MockCompany>(
  MOCK_COMPANIES.map((c) => [c.profile.ticker, c]),
);

export function getMockCompany(ticker: string): MockCompany | undefined {
  return byTicker.get(ticker.toUpperCase());
}

export { MOCK_COMPANIES };
export type { MockCompany };
