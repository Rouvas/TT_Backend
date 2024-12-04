export interface CompleteResetDto {
  code: string;
  password: string;

  email: string | null;
  phone: string | null;
}
