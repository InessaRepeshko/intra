import { pbkdf2Sync, randomBytes } from 'crypto';
import { PasswordHasherPort } from '../../domain/services/password-hasher.port';

/**
 * Реалізація PasswordHasherPort через PBKDF2 (без зовнішніх залежностей).
 * Формат: pbkdf2_sha256$<iterations>$<salt>$<hash>
 */
export class Pbkdf2PasswordHasher implements PasswordHasherPort {
  private static readonly iterations = 120_000;
  private static readonly keylen = 32;
  private static readonly digest = 'sha256';

  hash(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(
      password,
      salt,
      Pbkdf2PasswordHasher.iterations,
      Pbkdf2PasswordHasher.keylen,
      Pbkdf2PasswordHasher.digest,
    ).toString('hex');

    return `pbkdf2_sha256$${Pbkdf2PasswordHasher.iterations}$${salt}$${hash}`;
  }
}


