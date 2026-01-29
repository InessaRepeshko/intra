export enum ClusterSortField {
    ID = 'id',
    COMPETENCE_ID = 'competenceId',
    LOWER_BOUND = 'lowerBound',
    UPPER_BOUND = 'upperBound',
    TITLE = 'title',
    DESCRIPTION = 'description',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export const CLUSTER_SORT_FIELDS = Object.values(ClusterSortField);