import { OnshapeDocument } from "./models/OnshapeDocument";
import { OnshapeInsertable } from "./models/OnshapeInsertable";

async function request<T>(endpoint: string): Promise<T> {
    const res = await fetch(endpoint);
    const body = await res.json();
    return body;
}


export async function getMkcadDocsFromApi(): Promise<OnshapeDocument[]> {
    const docs = await request<OnshapeDocument[]>("mkcadDocs");
    return docs;
}

export async function getOnshapeInsertablesFromApi(): Promise<OnshapeInsertable[]> {
    const docs = await request<OnshapeInsertable[]>("data");
    console.log(docs);
    return docs;
}

getOnshapeInsertablesFromApi();