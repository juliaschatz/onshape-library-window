import { Configuration } from "./models/Configuration";
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
  return query.has("type") && query.get("type") === "partstudio";
}

export async function insertPart(insertable: OnshapeInsertable, configuration?: {}): Promise<boolean> {
  const query = new URLSearchParams(window.location.search);
  const docId = query.get("docId");
  //const wvm = query.get("wvm");
  const wvmId = query.get("wvmId");
  const eId = query.get("eId");

  if (isPartStudioContext()) {
    if (insertable.type !== "PART" && insertable.type !== "PARTSTUDIO") { // Only parts and part studios can be derived
      return new Promise<boolean>((resolve, reject) => {resolve(false);});
    }
    const endpoint = `/api/derive?documentId=${docId}&workspaceId=${wvmId}&elementId=${eId}`;
    let configList: {[k: string]: any}[] = [];
    let namespace = `d${insertable.documentId}::v${insertable.versionId}::e${insertable.elementId}::m${insertable.microversionId ?? "0"}`;
    if (configuration) {
      for (const key in configuration) {
        let value = (configuration as any)[key] as string;
        let item: {[k: string]: any} = {};
        let definition: Configuration | null = null;
        for (const definition_ of insertable.config) {
          if (definition_.id === key) {
            definition = definition_;
            break;
          }
        }
        if (!definition) {
          break;
        }
        if (definition.type === "BOOLEAN") {
          item["btType"] = "BTMParameterBoolean-144";
          item["value"] = value;
        }
        else if (definition.type === "ENUM") {
          item["btType"] = "BTMParameterEnum-145";
          item["namespace"] = namespace;
          item["value"] = value as string;
          item["enumName"] = `${key as string}_conf`;
        }
        else if (definition.type === "QUANTITY") {
          item["btType"] = "BTMParameterQuantity-147";
          item["isInteger"] = false;
          item["value"] = 0;
          item["expression"] = (value as string).replaceAll("+", " ");
          item["units"] = "";
        }
        else if (definition.type === "STRING") {
          item["btType"] = "BTMParameterString-149";
          item["value"] = value as string;
        }
        item["parameterId"] = key as string;
        configList.push(item);
      }
    }
    return new Promise<boolean>((resolve, reject) => {
      post(endpoint, {
        "feature": {
          "btType": "BTMFeature-134",
          "namespace": "",
          "name": `Derived ${insertable.name}`,
          "suppressed": false,
          "parameters": [
            {
              "btType": "BTMParameterQueryList-148",
              "queries": [
                {
                  "btType": "BTMIndividualQuery-138",
                  "queryStatement": null,
                  "queryString": insertable.type === "PART" ? `query=qTransient("${insertable.partId}");` : "query=qEverything(EntityType.BODY);"
                }
              ],
              "parameterId": "parts"
            },
            {
              "btType": "BTMParameterDerived-864",
              "configuration": configList,
              "parameterId": "buildFunction",
              "namespace": namespace,
              "imports": []
            }
          ],
          "featureType": "importDerived",
          "subFeatures": [],
          "returnAfterSubfeatures": false
        },
        "libraryVersion": 1746,
        "microversionSkew": false,
        "rejectMicroversionSkew": false,
        "serializationVersion": "1.1.23"
      }).then(() => {
        resolve(true);
      }).catch(() => {
        resolve(false);
      });
    });
  }
  else {
    // Collect configuration
    let configStr = "";
    if (configuration) {
      for (const key in configuration) {
        configStr += `${key}=${(configuration as any)[key] as string};`;
      }
      configStr = configStr.substring(0, configStr.length-1);
    }
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
        "configuration": configStr
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
