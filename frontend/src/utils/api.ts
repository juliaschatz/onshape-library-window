import { OnshapeDocument } from "./models/OnshapeDocument";
import { OnshapeInsertable } from "./models/OnshapeInsertable";

async function request<T>(endpoint: string): Promise<T> {
    const res = await fetch(endpoint);
    const body = await res.json();
    return body;
}

async function post<T>(endpoint: string, data: any): Promise<T> {
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
      resolve(response as unknown as T);
    }).catch((reason) => {
      reject(reason);
    })
  });
  
}

export function isPartStudioContext(): boolean {
  const query = new URLSearchParams(window.location.search);
  return query.get("type") === "partstudio";
}

export async function insertPart(insertable: OnshapeInsertable, configuration?: string): Promise<boolean> {
  const query = new URLSearchParams(window.location.search);
  const docId = query.get("docId");
  //const wvm = query.get("wvm");
  const wvmId = query.get("wvmId");
  const eId = query.get("eId");

  if (isPartStudioContext()) {
    // todo properly create feature
    const endpoint = `/api/derive?documentId=${docId}&workspaceId=${wvmId}&elementId=${eId}`;
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
      });
    });
  }
  else {
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
      });
    });
  }
}

export async function getDocsFromApi(): Promise<OnshapeDocument[]> {
  const docs = await request<OnshapeDocument[]>("/api/documents");
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
      resolve(false);
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
      localStorage.setItem("bust", (bust+1) as any as string);
      resolve(true);
    }).catch(() => {
      resolve(false);
    });
  });
}
