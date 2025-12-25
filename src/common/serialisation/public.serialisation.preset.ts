import {
  SerialisationGroupKey,
  defineModelSerialisation,
} from './serialisation.groups';

/**
 * Стандартний пресет серіалізації “без PRIVATE”.
 * Підходить для більшості публічних сутностей/ендпоінтів.
 */
export const PUBLIC_SERIALISATION = defineModelSerialisation([
  SerialisationGroupKey.BASIC,
  SerialisationGroupKey.CONFIDENTIAL,
  SerialisationGroupKey.SYSTEMIC,
] as const);

export const PUBLIC_GROUP_VALUES = PUBLIC_SERIALISATION.VALUES;
export const PUBLIC_SERIALISATION_GROUPS = PUBLIC_SERIALISATION.GROUPS;


