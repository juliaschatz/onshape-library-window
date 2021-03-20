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

export async function insertPart(insertable: OnshapeInsertable, configuration?: string): Promise<boolean> {
  const query = new URLSearchParams(window.location.search);
  const docId = query.get("docId");
  const wvm = query.get("wvm");
  const wvmId = query.get("wvmId");
  const eId = query.get("eId");

  const endpoint = `api/insert?documentId=${docId}&workspaceId=${wvmId}&elementId=${eId}`;
  return new Promise<boolean>((resolve, reject) => {
    const result = post(endpoint, {
      "documentId": insertable.documentId,
      "elementId": insertable.elementId,
      "featureId": "",
      "isAssembly": insertable.type === "ASSEMBLY",
      "isWholePartStudio": insertable.type === "PARTSTUDIO",
      "microversionId": "",
      "partId": insertable.partId ? insertable.partId : "",
      "versionId": insertable.versionId,
      "configuration": configuration ? configuration : ""
    }).then((result) => {
      resolve(true);
    }).catch((reason) => {
      resolve(false);
    })
  });
}

export async function getMkcadDocsFromApi(): Promise<OnshapeDocument[]> {
  const docs = await request<OnshapeDocument[]>("api/mkcadDocs");
  return docs;
}

export async function getOnshapeInsertablesFromApi(): Promise<OnshapeInsertable[]> {
  const docs = await request<OnshapeInsertable[]>("api/data");
  return docs;
}

export async function getOnshapeInsertablesThumbsFromApi(insertables: OnshapeInsertable[]): Promise<OnshapeInsertable[]> {
  const docs = await post<OnshapeInsertable[]>("api/thumbs", insertables);
  return docs;
}

getOnshapeInsertablesFromApi();
