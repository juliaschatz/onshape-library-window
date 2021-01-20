var express = require('express');
var session = require('express-session');
var redis = require('redis');

var router = express.Router();
var authentication = require('../authentication');
var request = require('request-promise');
var url = require('url');
const { version } = require('os');

var  apiUrl = 'https://cad.onshape.com';
var localUrl = 'https://mkcad.julias.ch/api';
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
  "c867aae748085e5905211125" // Gearboxes
  /*"92b0b8a2272e065eb151c20c", // Bearings
  "c65881710a5484494e734574", // Bearings (Configurable)
  "c65881710a5484494e734574", // Configurable Versaplanetary
  "11dea59fcde97bd96bad66d1", // Electronics
  "bf01f7bc3ee2be305acdb76d", // Extrusions (Configurable)
  "8d7236e497bf1e271e21fbd2", // Fasteners
  "4506675fee630d7eab89d419", // Featurescript
  "bb4c8ef637000fb8f8c8b4ab", // FIRST FRC Infinite Recharge 2020 Field
  "92ef235726d5987b44918f0f", // Gears
  "a649b1465060ffc7ed51867c", // Gears (Configurable)
  "c2a381dccb443d1ba020579d", // Gussets & Brackets
  "c2a381dccb443d1ba020579d", // Hubs
  "762fca97a6ea961cdb515adc", // KOP Chassis (Configurable)
  "b408248c9b853832dd903b35", // Minimal Versaplanetary
  "2979144bb1e87ddd1747e172", // Motors
  "baeab27eca5a2da03d2940bf", // Pneumatics
  "a0b589f74b21e8886d697efc", // Pulleys
  "3f9b0609904c94487985b0d4", // Pulleys (Configurable)
  "e7db41383a7c6fd072a03821", // REV FTC Parts
  "e83eca3cba69ccda678d5a93", // Sensors
  "5cdc0fcf2f21e1a9e1de3191", // Shaft Retention
  "921b031c460b21500bb32999", // Shafts (Configurable)
  "9dfa04979f86ad20d2148621", // Spacers
  "d49082876e0a537892bb9185", // Spacers (Configurable)
  "ce30248c20c1959e634360bc", // Sprockets
  "2530db2e553cef7eb5219903", // Sprockets and Chain (Configurable)
  "2cad51ee956f732494213c6e", // Swerve
  "163ea37a81632276cb7f5378", // Tube spacers (Configurable)
  "8d9364e07015ad58febba74d", // Versa
  "f895084b6f1942fd88e4e61f", // VersaRoller (Configurable)
  "a94a3f196b6166e347eaf907" // Wheels*/
];
var META = {
  ASSEM: 1,
  PARTSTUDIO: 0
}

function checkRelease(metaItem) {
  var isVisible = false;
  var hasName = false;
  var hasDesc = false;
  var name = null;
  for (var i = 0; i < metaItem.properties.length; ++i) {
    var item = metaItem.properties[i];
    if (item.name === "Description") {
      isVisible = (item.value === "Release");
      hasDesc = true;
    }
    else if (item.name === "Name") {
      name = item.value;
      hasName = true;
    }
    if ((hasDesc && !isVisible) || (hasDesc && hasName)) {
      break;
    }
  }
  return {
    isVisible: isVisible,
    name: name
  };
}

function getMKCadData(req, res) {
  console.log(req.user.accessToken);
  // Collect latest version
  var insertable_data = [];
  var versionPromisesLeft = mkcadDocs.length;
  mkcadDocs.forEach((documentId) => {
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
            versionPromisesLeft--;
            if (versionPromisesLeft === 0) {
              res.send(insertable_data);
            }
          }
        };

        metadataResult.items.forEach((metaItem) => {
          console.log("Examining element " + metaItem.elementId + " type " + metaItem.elementType);
          if (metaItem.elementType === META.ASSEM) {
            // Assembly: Check if element description is Release
            var result = checkRelease(metaItem);
            if (result.isVisible) {
              // Add to visible assembly list
              insertable_data.push({
                type: "ASSEMBLY",
                name: result.name,
                elementId: metaItem.elementId,
                versionId: versionId,
                documentId: documentId
              });
            }
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
                var result = checkRelease(itemMeta);
                if (result.isVisible) {
                  // Add to visible assembly list
                  insertable_data.push({
                    type: "PART",
                    name: result.name,
                    partId: itemMeta.partId,
                    elementId: metaItem.elementId,
                    versionId: versionId,
                    documentId: documentId
                  });
                }
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
  }); // document foreach
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

module.exports = router;
