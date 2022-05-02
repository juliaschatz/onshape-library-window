import internal from 'stream';
import { Configuration } from './Configuration';

export interface OnshapeInsertable {
    type: "PART" | "ASSEMBLY" | "PARTSTUDIO";
    name: string;
    partId?: string;
    microversionId?: string;
    elementId: string;
    versionId: string;
    documentId: string;
    documentName: string;
    visible?: boolean; // deprecated
    lastVersion?: string;
    ref: number;
    thumb?: string;
    config: Configuration[];
    isPublished?: boolean;
    lastSchemaVersion: number;
    schemaVersion: number;
}