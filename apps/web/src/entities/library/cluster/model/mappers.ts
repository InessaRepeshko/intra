import { ClusterResponseDto } from './types';

export interface Cluster extends Omit<
    ClusterResponseDto,
    'createdAt' | 'updatedAt' | 'lowerBound' | 'upperBound'
> {
    createdAt: Date;
    updatedAt: Date;
    lowerBound: number | null;
    upperBound: number | null;
}

/**
 * Convert BigInt/Decimal serialization object {s, e, d} to number
 * s = sign, e = exponent, d = digits array
 */
function parseDecimalValue(value: unknown): number | null {
    if (value === null || value === undefined) {
        return null;
    }
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'object' && value !== null) {
        const obj = value as { s?: number; e?: number; d?: number[] };
        if (
            Array.isArray(obj.d) &&
            typeof obj.s === 'number' &&
            typeof obj.e === 'number'
        ) {
            // Calculate: sign * (digits as number) * 10^exponent
            const digits = obj.d;
            let num = 0;
            for (let i = 0; i < digits.length; i++) {
                num = num * 10 + digits[i];
            }
            // Apply sign and exponent
            const result = obj.s * num * Math.pow(10, obj.e);
            return result;
        }
    }
    return null;
}

export function mapClusterDtoToModel(dto: ClusterResponseDto): Cluster {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
        lowerBound: parseDecimalValue(dto.lowerBound as unknown),
        upperBound: parseDecimalValue(dto.upperBound as unknown),
    };
}
