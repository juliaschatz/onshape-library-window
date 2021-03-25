import { Configuration } from './Configuration';

export interface OnshapeInsertable {
    type: "PART" | "ASSEMBLY" | "PARTSTUDIO";
    name: string;
    partId?: string;
    elementId: string;
    versionId: string;
    documentId: string;
    documentName: string;
    visible?: boolean; // deprecated
    lastVersion?: string;
    ref: number;
    thumb?: string;
    config: Configuration[];
}