import { OnshapeDocument } from "./models/OnshapeDocument";
import { OnshapeInsertable } from "./models/OnshapeInsertable";

async function request<T>(endpoint: string): Promise<T> {
    const res = await fetch(endpoint);
    const body = await res.json();
    return body;
}

async function post<T>(endpoint: string, data: any): Promise<T> {
  const res = await fetch(endpoint, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: "POST",
    body: JSON.stringify(data)
  });
  const body = await res.json();
  return body;
}


export async function getMkcadDocsFromApi(): Promise<OnshapeDocument[]> {
    const docs = await request<OnshapeDocument[]>("mkcadDocs");
    console.log(docs);
    return docs;
}

export async function getOnshapeInsertablesFromApi(): Promise<OnshapeInsertable[]> {
  const docs = await request<OnshapeInsertable[]>("data");
  return docs;
}

export async function getOnshapeInsertablesThumbsFromApi(insertables: OnshapeInsertable[]): Promise<OnshapeInsertable[]> {
  const docs = await post<OnshapeInsertable[]>("thumbs", insertables);
  return docs;
}

getOnshapeInsertablesFromApi();
