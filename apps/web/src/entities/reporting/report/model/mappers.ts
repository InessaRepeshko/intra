import type { ReportResponseDto } from '@entities/reporting/report/model/types';

export interface Report extends Omit<ReportResponseDto, 'createdAt'> {
    createdAt: Date;
}

export function mapReportDtoToModel(dto: ReportResponseDto): Report {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
    };
}
