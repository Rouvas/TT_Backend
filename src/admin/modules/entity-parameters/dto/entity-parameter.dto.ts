export interface EntityParameterDto {
  name: string;
  label: string;
  measure: string | null;
  type: 'select_many' | 'select_one' | 'input_text' | 'input_number';
  entityType: 'notebook' | 'macbook' | 'device' | 'accessories' | 'all';
  valuesVariants: string[] | number[] | null;
}
