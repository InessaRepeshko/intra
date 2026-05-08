export interface TeamBaseDto<TDate = Date> {
    id: number;
    title: string;
    description: string | null;
    headId: number | null;
    createdAt: TDate;
    updatedAt: TDate;
}

export type TeamDto = TeamBaseDto<Date>;

export type TeamResponseDto = TeamBaseDto<string>;
