Design
===
This document describes the implementation of the Onshape Library Window app.
The app is split into two components: backend (node.js, redis, and mongodb) and frontend (React).

The backend is the core of the app. It handles authentication and interacting with the Onshape API, collecting and caching library parts, and admin-side management. 

The frontend displays parts, generates Onshape API calls which are passed through the backend to get a token, and looks pretty.

### Authentication
The app uses a basic OAuth2 flow. When a user opens the app, it authenticates with Onshape on their behalf and stores a token with their session. I don't really understand this part myself, it's mostly taken from one of the Onshape examples. This token is used in all API calls that the user makes. It's also used to determine whether the user is part of the Onshape group specified as admin, which allows them to do parts management. This lives across `app.js`, `authentication.js`, and `api.js` in the backend. 

### Part library acquisition
A list of documents and their associated Onshape IDs are stored as part of the app deployment (documents.json). When a user loads the static app page, the first thing it does is call the `isAdmin` endpoint, which takes the user session and determines whether they should have admin access to the app (via an Onshape team membership call), storing this along with ther session. They then have the option to access the Admin menu, which displays the same list of documents. When one of these documents is selected, a call is made to the backend to get the admin parts for this document. On the backend, a long sequence of API calls and processing happens. The code for this is in `api.js::documentData()`.

1. Gets the latest version of the document from Onshape.
2. Get all elements (part studios and assemblies) in the document.
3. For each element, (each call made asynchronously)
    1. Get the configuration definition via a call to the `element/configuration` endpoint which is then turned into a more succinct format.
    2. If it's an assembly, the thumbnail is acquired and the entire structure popped into an array.
    3. If it's a part studio, another call is made to get the metadata for all parts within the studio. Some rules are applied about whether to show the part to the admin or not, heavily tailored to how the MKCad library is formatted. The thumbnail for each shown part is acquired and added to the list.
4. Any insertable elements (parts or assemblies) that no longer exist in this version are removed from the database.
5. Insertable elements that did exist in the old version are marked as being able to update.
6. Once all elements have been processed, they are sent as whole objects to the frontend.

Each insertable includes document id, version id, element id, part id (if applicable), thumbnail, what type of insertable it is, and configuration information. See `OnshapeInsertable.ts` for the model.

Once these insertables are sent to the admin, which can take up to a minute or even time out on larger documents, they are added to a React array which turns them into visible elements. Each one has a toggle switch to be shown to the user or not. Sliding this toggle switch, or clicking Update, will send another backend request for each part with a payload of the insertable element. This call performs an insert/update or delete on the MongoDB part database.

#### Thumbnails
Thumbnails have their own cache database, as they're the most time-intensive API calls and we can't afford to redo this every time the admin calls for parts in a version. When the backend asks for a thumbnail, it first search this local cache for the insertable element keyed on version, and promises to return either a thumbnail from the cache or from Onshape (which is then automatically added to the cache).

### Inserting Insertables
When the user loads the page, an async call is made to load all the documents and insertables in a single bulk call (a few MB, mostly thumbnails). This is also cached for 30 minutes except for admins who can bust the cache. So the `api.js::getData` call just makes a DB query for all parts, and sends them up.
From the magic of React these get put into an array, which is then comprehended into InsertableElement elements and put in document accordions. Each InsertableElement React element owns an onshape insertable.

These elements can be filtered using the search bar and a whole lot of what I'm sure are terrible React practices.

When this element is clicked, if the element is configurable it creates a configuration popup, which reads the configuration stored in the insertable data structure. Configuration data should, nominally, go through the API to turn from JSON into a configuration string, but this is annoying and slow so we just do it ourselves (it's basically just urlencoding once you figure out which parts are important). After configuration (if necessary) is done, it constructs the relevant API call payload (derive or insert) and calls the corresponding thin wrapper on the backend, which adds the user's token.