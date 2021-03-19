export interface OnshapeInsertable {
    type: "PART" | "ASSEMBLY";
    name: string;
    partId?: string;
    elementId: string;
    versionId: string;
    documentId: string;
    visible: boolean;
    ref: number;
    thumb?: string;
}