export interface CompetenceBaseDto<TDate = Date> {
    id: number;
    code: string | null;
    title: string;
    description: string | null;
    createdAt: TDate;
    updatedAt: TDate;
}

export type CompetenceDto = CompetenceBaseDto<Date>;

export type CompetenceResponseDto = CompetenceBaseDto<string>;
