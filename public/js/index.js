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
  var customQuery = url.split("#")[1].split("?")[0].split("/");
  /*var stdQuery = url.split("?")[1];
  stdQuery.split("&").forEach(s => {
    var name = s.split("=")[0];
    var value = s.split("=")[1];
    theContext[name] = value;
  });*/

  theContext.type = customQuery[0];
  theContext.documentId = customQuery[1];
  theContext.workspaceOrVersion = customQuery[2];
  theContext.wvId = customQuery[3];
  theContext.elementId = customQuery[4];

  // Hold onto the current session information
  theContext.verison = 0;
  theContext.microversion = 0;

  var itemsList = $("#insert-list");
  var docList = $("#doc-list");
  var adminList = $("#admin-list");
  var itemsListContainer = $("#insert-list-container");
  var docListContainer = $("#doc-list-container");
  var adminListContainer = $("#admin-list-container");
  var adminMenu = $("#admin-menu");
  var adminStatus = $("#status");
  var adminButton = $("#toggle-view");
  let searchbar = $("#insert-search");
  let clearSearch = $("#clear-search");

  var admin = false;
  adminButton.click(function(evt) {
    admin = !admin;
    clearSearch.click();
    if (admin) {
      docListContainer.show();
      adminListContainer.show();
      adminMenu.show();
      itemsListContainer.hide();
      adminButton.text("User");
    }
    else {
      docListContainer.hide();
      adminListContainer.hide();
      adminMenu.hide();
      itemsListContainer.show();
      adminButton.text("Admin");
    }
  });

  $.ajax('/api/isAdmin').then((data) => {
    if (data.auth) {
      adminButton.show();
      $.ajax('/api/mkcadDocs').then((docs) => {
        docs.forEach((doc) => {
          var h = '<li class="view-doc" data-id="' + doc.id + '">' + doc.name + '</li>';
          docList.append(h);
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

        $(".view-doc").click(function() {
          let id = $(this).data("id");
          adminStatus.html("Loading...");
          adminList.html("");
          $.ajax('/api/documentData?documentId=' + id).then((items) => {
            adminStatus.html("Document loaded.");

            items.sort(function(a,b) {
              return a.name.localeCompare(b.name);
            });

            var i = 0;
            items.forEach((item) => {
              var val = "check-" + i;
              let thisnum = i;
              var h = '<tr class="admin-item">' +
                '<td><input data-doc="'+id+'" type="checkbox" id="'+val+'" name="'+val+'" value="'+i+'" '+(item.visible?"checked":"")+'/></td>' +
                '<td><img class="thumb admin" data-ref="'+i+'" src=""/></td>' + 
                '<td><label for="'+val+'">'+item.name+'</label></td>' + 
                '</tr>';
              adminList.append(h);
              var targetUrl;
              if (item.type === "ASSEMBLY") {
                targetUrl = "/api/assemThumb?documentId=" + item.documentId + "&versionId=" + item.versionId + "&elementId=" + item.elementId;
              }
              else if (item.type === "PART") {
                targetUrl = "/api/partThumb?documentId=" + item.documentId + "&versionId=" + item.versionId + "&elementId=" + item.elementId + "&partId=" + item.partId;
              }
              $.get(targetUrl).then((thumb) => {
                $('img.thumb.admin[data-ref='+thisnum+']').attr("src", "data:image/jpeg;base64," + thumb);
              });
              
              ++i;
            });

            $("#save").unbind("click");
            $("#save").click(function() {
              adminStatus.text("Saving...");
              var newItems = [];
              for (let i = 0; i < items.length; ++i) {
                
                var visible = $('input[data-doc="' + id + '"]').filter("#check-"+i).is(":checked");
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
      itemsList.append('<li class="doc-folder"><span class="folder-title">'+doc.name+'</span><ul style="display:none;" class="folder" data-id="'+doc.id+'"></ul></li>');

    });
    $(".folder-title").click(function() {
      $(this).siblings("ul").toggle();
    });
    $.ajax('/api/data').then((data) => {
      for (var i = 0; i < data.length; ++i) {
        var item = data[i];
        var h = '<li class="insert-item" data-ref="' + i + '"><img data-ref="'+i+'" class="thumb user" src=""/><span class="item-name">' + item.name + '</li>';
        $("ul.folder[data-id=" + item.documentId +"]").append(h);
        var targetUrl;
        if (item.type === "ASSEMBLY") {
          targetUrl = "/api/assemThumb?documentId=" + item.documentId + "&versionId=" + item.versionId + "&elementId=" + item.elementId;
        }
        else if (item.type === "PART") {
          targetUrl = "/api/partThumb?documentId=" + item.documentId + "&versionId=" + item.versionId + "&elementId=" + item.elementId + "&partId=" + item.partId;
        }
        let thisnum = i;
        $.get(targetUrl).then((thumb) => {
          $("img.thumb.user[data-ref="+thisnum+"]").attr("src", "data:image/jpeg;base64," + thumb);
        });
        
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

      clearSearch.click(function() {
        searchbar.val("");
        searchbar.trigger("input");
      })
      searchbar.on('input', function() {
        var text = $(this).val().toLowerCase();

        if (admin) {
          $("tr.admin-item").each(function() {
            let thisText = $(this).children(":eq(2)").text().toLowerCase();
            if (thisText.includes(text)) {
              $(this).show();
            }
            else {
              $(this).hide();
            }
          });
        }
        else {
          $("li.doc-folder").each(function() {
            let anyVisible = false;
            $(this).find("li.insert-item").each(function() {
              var thisText = $(this).children("span").text().toLowerCase();
              if (thisText.includes(text)) {
                $(this).show();
                anyVisible = true;
              }
              else {
                $(this).hide();
              }
            });
            if (anyVisible) {
              $(this).show();
              $(this).children("ul").show();
            }
            else {
              $(this).hide();
              $(this).children("ul").hide();
            }
            if (text === "") {
              $(this).children("ul").hide();
            }
          });
        }
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
