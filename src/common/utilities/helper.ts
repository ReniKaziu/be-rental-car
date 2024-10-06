import { phone } from 'phone';

export function getPhoneNumber(number: string): string {
  return phone(number).phoneNumber;
}
