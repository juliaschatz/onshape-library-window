export interface OnshapeInsertable {
    type: "PART" | "ASSEMBLY";
    name: string;
    partId?: string;
    elemntId: string;
    versionId: string;
    documentId: string;
    visible: boolean;
    ref: number;
}