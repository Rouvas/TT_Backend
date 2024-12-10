export interface EntityDto {
  brandId: string;
  modelId: string;
  name: string;
  description: string;
  quality: string;
  availability: string;
  type: string;
  sellPrice: number;
  sellPriceMarket: number;
  boughtPrice: number;
  market_sku: string;
  parameters: {
    parameterId: string;
    value: string | number | string[] | number[];
  };
}
