import { OnshapeDocument } from "./models/OnshapeDocument";
import { OnshapeInsertable } from "./models/OnshapeInsertable";

async function request<T>(endpoint: string): Promise<T> {
    const res = await fetch(endpoint);
    const body = await res.json();
    return body;
}


export async function getMkcadDocs(): Promise<OnshapeDocument[]> {
    const docs = await request<OnshapeDocument[]>("mkcadDocs");
    return docs;
}

export async function getOnshapeInsertables(): Promise<OnshapeInsertable[]> {
    const docs = await request<OnshapeInsertable[]>("data");
    return docs;
}