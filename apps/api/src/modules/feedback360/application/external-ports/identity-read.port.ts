/**
 * Порт читання з Identity bounded context (anti-corruption boundary).
 *
 * Мінімальний read-only контракт, який потрібен Feedback360 для валідації посилань
 * (ratee/hr/position).
 */
export const IDENTITY_READ = Symbol('FEEDBACK360.IDENTITY_READ');

export interface IdentityReadPort {
  userExists(userId: number): Promise<boolean>;
  positionExists(positionId: number): Promise<boolean>;
}


