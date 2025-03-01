export type SearchOperator = 'AND' | 'OR';

export interface MetadataFilter {
    field: string;
    operator: '>' | '<' | '==' | '>=' | '<=';
    value: number;
}

export interface SearchQuery {
    operator: SearchOperator;
    filters: MetadataFilter[];
} 