import { pbkdf2Sync, randomBytes } from 'crypto';

/**
 * Мінімальний (але коректний) хешер паролів без зовнішніх залежностей.
 * Формат: pbkdf2_sha256$<iterations>$<salt>$<hash>
 */
export class PasswordHasher {
  private static readonly iterations = 120_000;
  private static readonly keylen = 32;
  private static readonly digest = 'sha256';

  static hash(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(
      password,
      salt,
      PasswordHasher.iterations,
      PasswordHasher.keylen,
      PasswordHasher.digest,
    ).toString('hex');

    return `pbkdf2_sha256$${PasswordHasher.iterations}$${salt}$${hash}`;
  }
}


