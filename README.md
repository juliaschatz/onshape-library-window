# onshape-library-window
An interface for simplifying part libraries in Onshape. Created for the MKCad project.

## Onshape setup
### Required Permissions
- Read documents
- Write to documents

### Redirect URLs
`https://mybaseurl.com/oauthRedirect`

### OAuth URL
`https://mybaseurl.com/oauthSignin`

### Extensions
Element right panel: 
- URL: `https://mkcad.julias.ch/?type=assem&docId={$documentId}&wvm={$workspaceOrVersion}&wvmId={$workspaceOrVersionId}&eId={$elementId}`
- Context: Selected Assembly
