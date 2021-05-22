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
- URL: `https://mybaseurl.com/application/?type=assem&docId={$documentId}&wvm={$workspaceOrVersion}&wvmId={$workspaceOrVersionId}&eId={$elementId}`
- Context: Selected Assembly

## Environment
Place the following in a file named .env in the working directory of the app.
```
OAUTH_CLIENT_ID=<acquired from onshape dev portal>
OAUTH_CLIENT_SECRET=<acquired from onshape dev portal>
OAUTH_CALLBACK_URL=https://mybaseurl.com/oauthRedirect
ONSHAPE_HOST=https://mybaseurl.com
ONSHAPE_PLATFORM=https://cad.onshape.com
ONSHAPE_OAUTH_SERVICE=https://oauth.onshape.com
OAUTH_URL=https://oauth.onshape.com
API_URL=https://cad.onshape.com
PRIVKEY=<certificate location>/privkey.pem
CERT=<certificate location>/fullchain.pem
SESSION_SECRET=<any simple string>
ADMIN_TEAM=<onshape team ID, can be found in URL on team page in account settings>
MONGODB_URI=mongodb://<mongodb ip/url:port>/?poolSize=20&writeConcern=majority

REDIS_HOST=<redis ip/url>
REDIS_PORT=<redis port>
```
The following is a sample systemd service file for the application.
```
[Service]
Description=Onshape Library Window
After=mongod.service
StartLimitIntervalSec=0[Service]
Type=simple
Restart=always
RestartSec=1
User=root
WorkingDirectory=<base directory>
Environment="PORT=4000"
ExecStart=<base directory>/bin/www

[Install]
WantedBy=multi-user.target
```
The following is a sample nginx site configuration to reverse proxy the application.
```
server {
    # Redirect all to corresponding SSL sites
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    return 301 https://$host$request_uri;
}

server {
    # Main site
    server_name mybaseurl.com;
    listen 443 ssl;
    listen [::]:443 ssl ipv6only=on;

    ssl_certificate <certificate location>/fullchain.pem;
    ssl_certificate_key <certificate location>/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass https://localhost:4000;
        proxy_set_header Host $host;
    }
}
```