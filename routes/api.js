var express = require('express');
var session = require('express-session');
var redis = require('redis');

var router = express.Router();
var authentication = require('../authentication');
var request = require('request-promise');
var url = require('url');
var storage = require('node-persist');
const { version } = require('os');
const passport = require('passport');

var  apiUrl = 'https://cad.onshape.com';
var localUrl = 'https://mkcad.julias.ch/api';
var mkcadTeamId = "5b620150b2190f0fca90ec10";

if (process.env.API_URL) {
  apiUrl = process.env.API_URL;
}
if (process.env.LOCAL_URL) {
  localUrl = process.env.LOCAL_URL;
}

var client;
if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  client = require("redis").createClient(rtg.port, rtg.hostname);

  client.auth(rtg.auth.split(":")[1]);
} else if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
  client = require("redis").createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
} else {
  client = redis.createClient();
}

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).send({
    authUri: authentication.getAuthUri(),
    msg: 'Authentication required.'
  });
}

router.sendNotify = function(req, res) {
  if (req.body.event == 'onshape.model.lifecycle.changed') {
    var state = {
      elementId : req.body.elementId,
      change : true
    };

    var stateString = JSON.stringify(state);
    var uniqueID = "change" + req.body.elementId;
    client.set(uniqueID, stateString);
  }

  res.send("ok");
}

router.post('/logout', function(req, res) {
  req.session.destroy();
  return res.send({});
});

function makeAPICall(req, res, endpoint, method, nosend) {
  var targetUrl = apiUrl + endpoint;
  var promise = method({
    uri: targetUrl,
    json: true,
    body: req.body,
    headers: {
      'Authorization': 'Bearer ' + req.user.accessToken
    }
  }).catch((data) => {
    console.log("CATCH " + data.statusCode);
    if (data.statusCode === 401) {
      authentication.refreshOAuthToken(req, res).then(function() {
        return makeAPICall(req, res, endpoint, method, nosend);
      }).catch(function(err) {
        console.log('Error refreshing token: ', err);
      });
    } else {
      console.log('Error: ', data);
    }
  });
  if (nosend) {
    return promise;
  }
  else {
    promise.then((data) => {
      if (!nosend) {
        res.send(data);
      }
    });
  }
}

var mkcadDocs = [
  {id: "92b0b8a2272e065eb151c20c", name: "Bearings"},
  {id: "c65881710a5484494e734574", name: "Bearings (Configurable)"},
  {id: "fbf06ec10d1fea773b1945a4", name: "Configurable Versaplanetary"},
  {id: "11dea59fcde97bd96bad66d1", name: "Electronics"},
  {id: "bf01f7bc3ee2be305acdb76d", name: "Extrusions (Configurable)"},
  {id: "8d7236e497bf1e271e21fbd2", name: "Fasteners"},
  {id: "4506675fee630d7eab89d419", name: "Featurescript"},
  {id: "bb4c8ef637000fb8f8c8b4ab", name: "FIRST FRC Infinite Recharge 2020 Field"},
  {id: "c867aae748085e5905211125", name: "Gearboxes"},
  {id: "92ef235726d5987b44918f0f", name: "Gears"},
  {id: "a649b1465060ffc7ed51867c", name: "Gears (Configurable)"},
  {id: "c2a381dccb443d1ba020579d", name: "Gussets & Brackets"},
  {id: "c2a381dccb443d1ba020579d", name: "Hubs"},
  {id: "762fca97a6ea961cdb515adc", name: "KOP Chassis (Configurable)"},
  {id: "b408248c9b853832dd903b35", name: "Minimal Versaplanetary"},
  {id: "2979144bb1e87ddd1747e172", name: "Motors"},
  {id: "baeab27eca5a2da03d2940bf", name: "Pneumatics"},
  {id: "a0b589f74b21e8886d697efc", name: "Pulleys"},
  {id: "3f9b0609904c94487985b0d4", name: "Pulleys (Configurable)"},
  {id: "e7db41383a7c6fd072a03821", name: "REV FTC Parts"},
  {id: "e83eca3cba69ccda678d5a93", name: "Sensors"},
  {id: "5cdc0fcf2f21e1a9e1de3191", name: "Shaft Retention"},
  {id: "921b031c460b21500bb32999", name: "Shafts (Configurable)"},
  {id: "9dfa04979f86ad20d2148621", name: "Spacers"},
  {id: "d49082876e0a537892bb9185", name: "Spacers (Configurable)"},
  {id: "ce30248c20c1959e634360bc", name: "Sprockets"},
  {id: "2530db2e553cef7eb5219903", name: "Sprockets and Chain (Configurable)"},
  {id: "2cad51ee956f732494213c6e", name: "Swerve"},
  {id: "163ea37a81632276cb7f5378", name: "Tube spacers (Configurable)"},
  {id: "8d9364e07015ad58febba74d", name: "Versa"},
  {id: "f895084b6f1942fd88e4e61f", name: "VersaRoller (Configurable)"},
  {id: "a94a3f196b6166e347eaf907", name: "Wheels"}
];
var META = {
  ASSEM: 1,
  PARTSTUDIO: 0
}

function getName(metaItem) {
  for (var i = 0; i < metaItem.properties.length; ++i) {
    var item = metaItem.properties[i];
    if (item.name === "Name") {
      var name = item.value;
      return name;
    }
  }
}

function checkAuth(id) {
  return new Promise((resolve, reject) => {
    client.get("mkcad" + id, function(getError, data) {
      if (getError) throw getError;

      console.log("Response to session " + id + " is " + data)
      if (data !== null && data) {
        resolve();
      }
      else {
        reject("Unauthenticated");
      }
    });
  });
}

function documentList(req, res) {
  res.send(mkcadDocs);
}

function documentData(req, res) {
  
  checkAuth(req.user.id).then(() => {
    var insertable_data = [];
    var versionPromisesLeft = mkcadDocs.length;
    var documentId = req.query.documentId;

    storage.get(documentId + "_visible").then((visible_items) => {
      oldVerMap = {};
      if (visible_items !== undefined) {
        visible_items.forEach((item) => {
          if (item.partId) {
            oldVerMap[item.elementId + "/" + item.partId] = item.visible;
          }
          else {
            oldVerMap[item.elementId] = item.visible;
          }
          
        });
      }

      function isVisible(elementId, partId) {
        var key = "";
        if (partId) {
          key = elementId + "/" + partId;
        }
        else {
          key = elementId;
        }
        return oldVerMap[key];
      }

      versionReq = req;
      versionReq.query = {
        documentId: documentId
      };
      var versionPromise = getVersionsRaw(versionReq, res).then((versions) => {
        var versionId = versions[versions.length - 1].id;
        console.log("Latest version: " + versionId);
        // Collect assemblies and part studios
        eMetaReq = req;
        eMetaReq.query = {
          documentId: documentId,
          versionId: versionId
        };
        var eMetaPromise = getElementsMetadataRaw(eMetaReq, res).then((metadataResult) => {
          var elementsLeft = metadataResult.items.length;
          var decreaseElements = function() {
            elementsLeft--;
            console.log(elementsLeft);
            if (elementsLeft === 0) {
              res.send(insertable_data);
            }
          };

          metadataResult.items.forEach((metaItem) => {
            if (metaItem.elementType === META.ASSEM) {
              // Assembly: Check if element description is Release
              var name = getName(metaItem);
              insertable_data.push({
                type: "ASSEMBLY",
                name: name,
                elementId: metaItem.elementId,
                versionId: versionId,
                documentId: documentId,
                visible: isVisible(metaItem.elementId)
              });
              
              decreaseElements();
            }
            else if (metaItem.elementType === META.PARTSTUDIO) {
              // Part studio: Check each item in studio
              partMetaReq = req;
              partMetaReq.query = {
                documentId: documentId,
                elementId: metaItem.elementId,
                versionId: versionId
              };
              var pMetaPromise = getPartsMetadataRaw(partMetaReq, res).then((itemMetaResult) => {
                if (itemMetaResult === undefined) {
                  decreaseElements();
                  return;
                }
                itemMetaResult.items.forEach((itemMeta) => {
                  var name = getName(itemMeta);
                  insertable_data.push({
                    type: "PART",
                    name: name,
                    partId: itemMeta.partId,
                    elementId: metaItem.elementId,
                    versionId: versionId,
                    documentId: documentId,
                    visible: isVisible(metaItem.elementId, itemMeta.partId)
                  });
                  
                });
                decreaseElements();
              }); // part meta promise
            } 
            else { // All non-part studio non-assemblies
              decreaseElements();
            }
            // element type switch
          }); // metadata meta foreach
        }); // element meta promise

      }); // versions promise
    }); // storage get

    
  }).catch(() => {
    res.status(401).send();
  }); // auth promise
}

function saveDocumentData(req, res) {
  
  checkAuth(req.user.id).then(() => {
    var insertable_data = [];
    var versionPromisesLeft = mkcadDocs.length;
    var documentId = req.query.documentId;
    
    storage.set(documentId + "_visible", req.body).then(() => {
      res.status(200).send();
    });
  }).catch(() => {
    res.status(401).send();
  }); // auth promise
}

function getUserIsMKCadAdmin(req, res) {
  var targetUrl = apiUrl + "/api/teams/" + mkcadTeamId;
  request.get({
    uri: targetUrl,
    json: true,
    body: req.body,
    headers: {
      'Authorization': 'Bearer ' + req.user.accessToken
    }
  }).then((data) => {
    client.set("mkcad" + req.user.id, true);
    console.log("Set admin session " + req.user.id)
    res.send({auth: true});
  }).catch((data) => {
    console.log("CATCH " + data.statusCode);
    if (data.statusCode === 401) {
      authentication.refreshOAuthToken(req, res).then(function() {
        getUserIsMKCadAdmin(req, res);
      }).catch(function(err) {
        console.log('Error refreshing token: ', err);
      });
    } else {
      res.send({auth: false});
      console.log('Error: ', data);
    }
  });
}

function getMKCadData(req, res) {
  console.log(req.user.accessToken);

  var data = [];
  var docsLeft = mkcadDocs.length;
  mkcadDocs.forEach((doc) => {
    storage.get(doc.id + "_visible").then((docData) => {
      if (docData !== undefined) data = data.concat(docData);

      docsLeft--;
      if (docsLeft === 0) {
        res.send(data); 
      }
    });
  });
}

var getVersions = (req, res) => makeAPICall(req, res, '/api/documents/d/' + req.query.documentId + '/versions', request.get);
var callInsert = (req, res) => makeAPICall(req, res, '/api/assemblies/d/' + req.query.documentId + '/w/' + req.query.workspaceId + '/e/' + req.query.elementId + '/instances', request.post);
var getElements = (req, res) => makeAPICall(req, res, '/api/documents/d/' + req.query.documentId + '/v/' + req.query.versionId + '/elements', request.get);
var getElementsMetadata = (req, res) => makeAPICall(req, res, '/api/metadata/d/' + req.query.documentId + '/v/' + req.query.versionId + '/e', request.get);
var getPartsMetadata = (req, res) => makeAPICall(req, res, '/api/metadata/d/' + req.query.documentId + '/v/' + req.query.versionId + '/e/' + req.query.elementId + '/p', request.get);

var getElementsMetadataRaw = (req, res) => makeAPICall(req, res, '/api/metadata/d/' + req.query.documentId + '/v/' + req.query.versionId + '/e', request.get, true);
var getPartsMetadataRaw = (req, res) => makeAPICall(req, res, '/api/metadata/d/' + req.query.documentId + '/v/' + req.query.versionId + '/e/' + req.query.elementId + '/p', request.get, true);
var getVersionsRaw = (req, res) => makeAPICall(req, res, '/api/documents/d/' + req.query.documentId + '/versions', request.get, true);

router.get('/versions', getVersions);
// Insert
router.post('/insert', callInsert);
router.get('/elements', getElements);
// Metadata
router.get('/elements_metadata', getElementsMetadata);
router.get('/parts_metadata', getPartsMetadata);
// Thumbnails
var thumbView = "0.612,0.612,0,0,-0.354,0.354,0.707,0,0.707,-0.707,0.707,0"; // Isometric view
var thumbPixelSize = 0.003; // meters per pixel
var thumbHeight = 250;
var thumbWidth = 250;
router.get('/part_thumb', (req, res) => {
  req.query.data = JSON.stringify({
    viewMatrix: thumbView,
    pixelSize: thumbPixelSize,
    outputHeight: thumbHeight,
    outputWidth: thumbWidth
  });
  makeAPICall(req, res, '/parts/d/'+ req.query.documentId +'/v/'+req.query.versionId+'/e/' + req.query.elementId + '/partid/' + req.query.partId + '/shadedviews', request.get);
});
router.get('/assembly_thumb', (req, res) => {
  req.query.data = JSON.stringify({
    viewMatrix: thumbView,
    pixelSize: thumbPixelSize,
    outputHeight: thumbHeight,
    outputWidth: thumbWidth
  });
  makeAPICall(req, res, '/assemblies/d/'+ req.query.documentId +'/v/'+req.query.versionId+'/e/' + req.query.elementId + '/shadedviews', request.get);
});
// Non-passthrough API
router.get('/data', getMKCadData);
router.get('/documentData', documentData);
router.post('/saveDocumentData', saveDocumentData);
router.get('/isAdmin', getUserIsMKCadAdmin);
router.get('/mkcadDocs', documentList);

module.exports = router;
