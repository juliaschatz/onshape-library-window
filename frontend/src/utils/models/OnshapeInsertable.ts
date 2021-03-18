import { Configuration } from './Configuration';

export interface OnshapeInsertable {
    type: "PART" | "ASSEMBLY" | "PARTSTUDIO";
    name: string;
    partId?: string;
    elementId: string;
    versionId: string;
    documentId: string;
    visible: boolean;
    ref: number;
    thumb?: string;
    config?: Configuration[];
}