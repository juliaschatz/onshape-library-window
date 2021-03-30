import { OnshapeDocument } from "./models/OnshapeDocument";
import { OnshapeInsertable } from "./models/OnshapeInsertable";

async function request<T>(endpoint: string): Promise<T> {
    const res = await fetch(endpoint);
    const body = await res.json();
    return body;
}

async function post<T>(endpoint: string, data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const res = fetch(endpoint, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: "POST",
      body: JSON.stringify(data)
    });
    res.then((response) => {
      resolve(response);
    }).catch((reason) => {
      reject(reason);
    })
  });
  
}

export async function insertPart(insertable: OnshapeInsertable, configuration?: string): Promise<boolean> {
  const query = new URLSearchParams(window.location.search);
  const docId = query.get("docId");
  //const wvm = query.get("wvm");
  const wvmId = query.get("wvmId");
  const eId = query.get("eId");

  const endpoint = `/api/insert?documentId=${docId}&workspaceId=${wvmId}&elementId=${eId}`;
  return new Promise<boolean>((resolve, reject) => {
    post(endpoint, {
      "documentId": insertable.documentId,
      "elementId": insertable.elementId,
      "featureId": "",
      "isAssembly": insertable.type === "ASSEMBLY",
      "isWholePartStudio": insertable.type === "PARTSTUDIO",
      "microversionId": "",
      "partId": insertable.partId ? insertable.partId : "",
      "versionId": insertable.versionId,
      "configuration": configuration ? configuration : ""
    }).then(() => {
      resolve(true);
    }).catch(() => {
      resolve(false);
    })
  });
}

export async function getMkcadDocsFromApi(): Promise<OnshapeDocument[]> {
  const docs = await request<OnshapeDocument[]>("/api/mkcadDocs");
  return docs;
}

export async function getOnshapeInsertablesFromApi(): Promise<OnshapeInsertable[]> {
  let bust: number = +(localStorage.getItem("bust") ?? "0");
  const docs = await request<OnshapeInsertable[]>(`/api/data?bust=${bust}`);
  return docs;
}

export async function getOnshapeInsertablesThumbsFromApi(insertables: OnshapeInsertable[]): Promise<OnshapeInsertable[]> {
  const docs = await post<OnshapeInsertable[]>("/api/thumbs", insertables);
  return docs;
}

export async function getIsAdmin(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    request<{auth: boolean}>("/api/isAdmin").then((result) => {
      resolve(result.auth);
    }).catch(() => {
      var redirect = `/oauthSignin?redirectOnshapeUri=${encodeURIComponent(window.location.href)}`;
      window.location.href = redirect;
    })
  });
}

export async function getAllDocumentInsertables(documentId: string): Promise<OnshapeInsertable[]> {
  const docs = await request<OnshapeInsertable[]>(`/api/documentData?documentId=${documentId}`);
  return docs;
}

export async function publishPart(insertable: OnshapeInsertable, publish: boolean): Promise<boolean> {

  const endpoint = `/api/saveDocumentData`;
  return new Promise<boolean>((resolve, reject) => {
    post(endpoint, {
      "item": insertable,
      "action": publish ? "REPLACE" : "REMOVE",
      "documentId": insertable.documentId
    }).then((result) => {
      let bust: number = +(localStorage.getItem("bust") ?? "0");
      console.log(bust);
      localStorage.setItem("bust", (bust+1) as any as string);
      resolve(true);
    }).catch(() => {
      resolve(false);
    });
  });
}
