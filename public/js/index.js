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

  var itemsList = $("#insert-list");
  var docList = $("#doc-list");
  var adminList = $("#admin-list");
  var itemsListContainer = $("#insert-list-container");
  var docListContainer = $("#doc-list-container");
  var adminListContainer = $("#admin-list-container");
  var adminMenu = $("#admin-menu");
  var adminStatus = $("#status");

  var admin = false;
  $("#toggle-view").click(function(evt) {
    admin = !admin;
    if (admin) {
      docListContainer.show();
      adminListContainer.show();
      adminMenu.show();
      itemsListContainer.hide();
    }
    else {
      docListContainer.hide();
      adminListContainer.hide();
      adminMenu.hide();
      itemsListContainer.show();
    }
  });

  $.ajax('/api/isAdmin').then((data) => {
    if (data.auth) {
      $("#toggle-view").show();
      $.ajax('/api/mkcadDocs').then((docs) => {
        docs.forEach((doc) => {
          var h = '<li class="view-doc" data-id="' + doc.id + '">' + doc.name + '</li>';
          docList.append(h);
        });
        $(".view-doc").click(function() {
          var id = $(this).data("id");
          adminStatus.html("Loading...");
          adminList.html("");
          $.ajax('/api/documentData?documentId=' + id).then((items) => {
            adminStatus.html("Document loaded.");
            var i = 0;
            items.forEach((item) => {
              var val = "check-" + i;
              var h = '<tr>' +
                '<td><input type="checkbox" id="'+val+'" name="'+val+'" value="'+i+'" '+(item.visible?"checked":"")+'/></td>' +
                '<td><label for="'+val+'">'+item.name+'</label></td>' + '</tr>';
              adminList.append(h);
              ++i;
            });

            $("#select-all").click(function() {
              adminList.find("input[type=checkbox]").each(function() {
                $(this).prop("checked", true);
              });
            });
            $("#unselect-all").click(function() {
              adminList.find("input[type=checkbox]").each(function() {
                $(this).prop("checked", false);
              });
            });

            $("#save").click(function() {
              adminStatus.text("Saving...");
              var newItems = [];
              for (i = 0; i < items.length; ++i) {
                var visible = $("input[name=check-"+i+"]").is(":checked");
                if (visible) {
                  items[i].visible = true;
                  newItems.push(items[i]);
                }
              }
              $.ajax('/api/saveDocumentData?documentId='+id, { 
                method: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(newItems),
                success: function() {
                  adminStatus.text("Saved!");
                }}).fail(function(err) {
                  adminStatus.text("Failed to save");
                  console.log(err);
                });
            });
          });
        });
      });
    }
  }); 
  $.ajax('/api/mkcadDocs').then((docList) => {
    var docMap = {};
    docList.forEach((doc) => {
      docMap[doc.id] = doc.name;
    });
    $.ajax('/api/data').then((data) => {
      for (var i = 0; i < data.length; ++i) {
        var item = data[i];
        var h = '<li class="insert-item" data-ref="' + i + '">' + item.name + '</li>';
        console.log(h);
        $("#insert-list").append(h);
      }
      $(".insert-item").click(function() {
        var ref = parseInt($(this).data("ref"));
        var item = data[ref];
        if (item.type === "ASSEMBLY") {
          insertAssembly(item.documentId, item.versionId, item.elementId);
        }
        else if (item.type === "PART") {
          insertPart(item.documentId, item.versionId, item.elementId, item.partId);
        }
      });
      $("#insert-search").on('input', function() {
        var text = $(this).val().toLowerCase();
        itemsList.children().each(function() {
          var thisText = $(this).text().toLowerCase();
          if (thisText.includes(text)) {
            $(this).show();
          }
          else {
            $(this).hide();
          }
        });
      });
    });
  });
});

function insertAssembly(sourceDocId, sourceVersionId, sourceAssemId) {
  $.ajax('/api/insert?documentId=' + theContext.documentId + "&elementId=" + theContext.elementId + "&workspaceId=" + theContext.wvId,
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
  $.ajax('/api/insert?documentId=' + theContext.documentId + "&elementId=" + theContext.elementId + "&workspaceId=" + theContext.wvId,
  {
    method: "POST",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      "documentId": sourceDocId,
      "elementId": sourceElementId,
      "isAssembly": false,
      "isWholePartStudio": false,
      "isPart": true,
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
