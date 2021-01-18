////////////////////////////////////////////////////////////////
// global data

var theContext = {};
var ResultTable;

////////////////////////////////////////////////////////////////
// startup
//
$(document).ready(function() {

  // retrieve the query params
  var theQuery = $.getQuery();
  var url = window.location.href;
  console.log(url);
  var customQuery = url.split("#")[1].split("?")[0].split("/");
  var stdQuery = url.split("?")[1];
  stdQuery.split("&").forEach(s => {
    var name = s.split("=")[0];
    var value = s.split("=")[1];
    theContext[name] = value;
  });

  theContext.type = customQuery[0];
  theContext.documentId = customQuery[1];
  theContext.workspaceOrVersion = customQuery[2];
  theContext.wvId = customQuery[3];
  theContext.elementId = customQuery[4];

  // Hold onto the current session information
  theContext.verison = 0;
  theContext.microversion = 0;

  console.log(theContext);

  var itemsList = $("#items-list");
  itemsList.html("");

  // Retrieve elements from MKCad
  var sourceDID = "c867aae748085e5905211125"; // MKCad - Gearboxes
  var sourceVID;
  // Get latest version
  $.ajax('/api/versions?documentId=' + sourceDID, {
    dataType: 'json',
    type: 'GET',
    success: function(data) {
      var latestVersionId = data[data.length - 1].id;
      sourceVID = latestVersionId;
      
      $.ajax('/api/assemblies_version?documentId='+ sourceDID + '&versionId=' + latestVersionId, {
        dataType: 'json',
        type: 'GET',
        success: function(assemblies) {
          assemblies.forEach(asm => {
            itemsList.append("<li class='insert-asm' data-doc='"+sourceDID+"' data-version='"+sourceVID+"' data-id='"+ asm.id + "'>" + asm.name + "</li>");
          });

          // Setup callbacks
          $(".insert-asm").click(function() {
            var asm_id = $(this).data("id");
            var doc_id = $(this).data("doc");
            var ver_id = $(this).data("version");
            console.log("Trying to insert " + asm_id)
            insertAssembly(doc_id, ver_id, asm_id);
          });
        }
      });
      /*
      $.ajax('/api/partstudios_version?documentId='+ sourceDID + '&versionId=' + latestVersionId, {
        dataType: 'json',
        type: 'GET',
        success: function(studios) {
          studios.forEach(studio => {
            $.ajax('/api/parts_studio?documentId='+ sourceDID + '&versionId=' + latestVersionId + '&elementId=' + studio.id, {
              dataType: 'json',
              type: 'GET',
              success: function(parts) {
                console.log("Studio " + studio.id + " has " + parts.length + " parts");
                parts.forEach(part => {
                  itemsList.append("<li class='insert-part' data-doc='"+sourceDID+"' data-version='"+sourceVID+"' data-element='"+studio.id+"' data-id='"+ part.id + "'>" + part.name +" " + studio.id + "</li>");
                });
      
                // Setup callbacks
                $(".insert-part[data-element='"+ studio.id + "']").click(function() {
                  var part_id = $(this).data("id");
                  var elem_id = $(this).data("element");
                  var doc_id = $(this).data("doc");
                  var ver_id = $(this).data("version");
                  console.log("Trying to insert " + part_id)
                  insertPart(doc_id, ver_id, elem_id, part_id);
                });
              }
            });
          });

          
        }
      });*/

      


    }
  });
});

function insertAssembly(sourceDocId, sourceVersionId, sourceAssemId) {
  $.ajax('/api/insert_assembly?documentId=' + theContext.documentId + "&elementId=" + theContext.elementId + "&workspaceId=" + theContext.wvId,
  {
    method: "POST",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      "documentId": sourceDocId,
      "elementId": sourceAssemId,
      "featureId": "",
      "isAssembly": true,
      "isWholePartStudio": false,
      "microversionId": "",
      "partId": "",
      "versionId": sourceVersionId
    }),
    success: function() {
      console.log("Inserted!");
    }
  }).fail(function(err) {
    console.log("Insert failed")
  });
}

function insertPart(sourceDocId, sourceVersionId, sourceElementId, sourcePartId) {
  $.ajax('/api/insert_assembly?documentId=' + theContext.documentId + "&elementId=" + theContext.elementId + "&workspaceId=" + theContext.wvId,
  {
    method: "POST",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      "documentId": sourceDocId,
      "elementId": sourceElementId,
      "featureId": "",
      "isAssembly": false,
      "isWholePartStudio": false,
      "microversionId": "",
      "partId": sourcePartId,
      "versionId": sourceVersionId
    }),
    success: function() {
      console.log("Inserted!");
    }
  }).fail(function(err) {
    console.log("Insert failed")
  });
}

// Send message to Onshape
function sendMessage(msgName) {
  var msg = {};
  msg['documentId'] = theContext.documentId;
  msg['workspaceId'] = theContext.workspaceId;
  msg['elementId'] =  theContext.elementId;
  msg['messageName'] = msgName;

  parent.postMessage(msg, '*');
}

//
// Tab is now shown
function onShow() {

}

function onHide() {
  // our tab is hidden
  // take appropriate action
}

function handlePostMessage(e) {
  if (e.data.messageName === 'show') {
    onShow();
  } else if (e.data.messageName === 'hide') {
    onHide();
  }
};

// keep Onshape alive if we have an active user
var keepaliveCounter = 5 * 60 * 1000;   // 5 minutes
var timeLastKeepaliveSent;
// User activity detected. Send keepalive if we haven't recently
function keepAlive() {
  var now = new Date().getTime();
  if (now > timeLastKeepaliveSent + keepaliveCounter) {
    sendKeepalive();
  }
}

// Send a keepalive message to Onshape
function sendKeepalive() {
  sendMessage('keepAlive');
  timeLastKeepaliveSent = new Date().getTime();
}

// First message to Onshape tells the Onshape client we can accept messages
function onDomLoaded() {
  // listen for messages from Onshape client
  window.addEventListener('message', handlePostMessage, false);
  timeLastKeepaliveSent = 0;
  document.onmousemove = keepAlive;
  document.onkeypress = keepAlive;
  sendKeepalive();
  return false;
}

// When we are loaded, start the Onshape client messageing
document.addEventListener("DOMContentLoaded", onDomLoaded);

//
// Simple alert infrasturcture
function displayAlert(message) {
  $("#alert_template span").remove();
  $("#alert_template button").after('<span>' + message + '<br></span>');
  $('#alert_template').fadeIn('slow');
  $('#alert_template .close').click(function(ee) {
    $("#alert_template").hide();
    $("#alert_template span").hide();
  });
}

var Subscribed = true;

//
// Check to see if the user is subscribed to this application
function checkSubscription() {
  // Make sure the user is subscribed
  return new Promise(function(resolve, reject) {
    $.ajax('/api/accounts', {
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        var object = data;

        Subscribed = object.Subscribed;

        // If there is no active subscription, then block the Create button.
        if (Subscribed == false) {
          displayAlert('No active subscription for this application. Check the Onshape App Store.');
          var b = document.getElementById("element-generate");
          b.disabled = true;

          reject(0);
        }
        else
          resolve(1);
      }
    });
  });
}
