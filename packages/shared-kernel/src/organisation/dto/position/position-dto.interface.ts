export interface PositionBaseDto<TDate = Date> {
    id: number;
    title: string;
    description: string | null;
    createdAt: TDate;
    updatedAt: TDate;
}

export type PositionDto = PositionBaseDto<Date>;

export type PositionResponseDto = PositionBaseDto<string>;
