export interface CreateOperationDto {
  amount: number;
  type: 'plus' | 'minus';
  description: string;
}
