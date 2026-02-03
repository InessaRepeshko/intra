<<<<<<< HEAD
import { applyDecorators } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiCreateAndUpdateErrorResponses() {
    return applyDecorators(
        ApiBadRequestResponse({ description: 'Invalid data' }),
        ApiForbiddenResponse({ description: 'Forbidden' }),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
        ApiConflictResponse({ description: 'Conflict' }),
    );
}

export function ApiReadErrorResponses() {
    return applyDecorators(
        ApiNotFoundResponse({ description: 'Not found' }),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}

export function ApiListReadErrorResponses() {
    return applyDecorators(
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}

export function ApiDeletionErrorResponses() {
    return applyDecorators(
        ApiBadRequestResponse({ description: 'Invalid data' }),
        ApiForbiddenResponse({ description: 'Forbidden' }),
        ApiNotFoundResponse({ description: 'Not found' }),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}
=======
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiCreateAndUpdateErrorResponses() {
  return applyDecorators(
    ApiBadRequestResponse({ description: 'Invalid data' }),
    ApiForbiddenResponse({ description: 'Forbidden' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiConflictResponse({ description: 'Conflict' }),
  );
}

export function ApiReadErrorResponses() {
  return applyDecorators(
    ApiNotFoundResponse({ description: 'Not found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function ApiListReadErrorResponses() {
  return applyDecorators(
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function ApiDeletionErrorResponses() {
  return applyDecorators(
    ApiBadRequestResponse({ description: 'Invalid data' }),
    ApiForbiddenResponse({ description: 'Forbidden' }),
    ApiNotFoundResponse({ description: 'Not found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
>>>>>>> origin/main
