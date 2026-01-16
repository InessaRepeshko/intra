import { Expose, type ExposeOptions } from 'class-transformer';
import { SerialisationGroupValue } from './serialisation.groups';

type GroupExposeOptions = Omit<ExposeOptions, 'groups'>;

export function ExposeWithGroup(
  group: SerialisationGroupValue,
  options: GroupExposeOptions = {},
): PropertyDecorator {
  return Expose({ ...options, groups: [group] });
}

export function ExposeBasic(options: GroupExposeOptions = {}): PropertyDecorator {
  return ExposeWithGroup(SerialisationGroupValue.BASIC, options);
}

export function ExposeConfidential(
  options: GroupExposeOptions = {},
): PropertyDecorator {
  return ExposeWithGroup(SerialisationGroupValue.CONFIDENTIAL, options);
}

export function ExposeSystemic(
  options: GroupExposeOptions = {},
): PropertyDecorator {
  return ExposeWithGroup(SerialisationGroupValue.SYSTEMIC, options);
}

export function ExposePrivate(options: GroupExposeOptions = {}): PropertyDecorator {
  return ExposeWithGroup(SerialisationGroupValue.PRIVATE, options);
}


