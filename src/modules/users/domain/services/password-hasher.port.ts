export interface PasswordHasherPort {
  hash(password: string): string;
}


