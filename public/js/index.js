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
  /*var stdQuery = url.split("?")[1];
  stdQuery.split("&").forEach(s => {
    var name = s.split("=")[0];
    var value = s.split("=")[1];
    theContext[name] = value;
  });*/

  theContext.type = theQuery.type;
  theContext.documentId = theQuery.docId;
  theContext.workspaceOrVersion = theQuery.wvm;
  theContext.wvId = theQuery.wvmId;
  theContext.elementId = theQuery.eId;

  if (!theContext.documentId) {
    $("#message").html("The application encountered an error loading. Please close and reopen the MKCad tab.");
    throw new Error("Didn't receive query data");
  }

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
  let modalClose = $("#close-modal");
  let modal = $("#configure-modal");
  let modalInsert = $("#modal-insert");
  let modalData = $("#config-opts");

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

  modalClose.click(function() {
    modal.hide();
  });

  $.ajax({
    url: '/api/isAdmin',
    success: function(data) {
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
            clearSearch.click();
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
                  '<td>' + (item.type==="ASSEMBLY" ? "ASM" : "PART") + '</td>' +
                  '<td><label for="'+val+'">'+item.name+'</label></td>' + 
                  '</tr>';
                adminList.append(h);
                item.ref = i;              
                ++i;
              });
              $.ajax({
                url: '/api/thumbs',
                method: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(items),
                success: function(data) {
                  data.forEach((item) => {
                    $('img.thumb.admin[data-ref='+item.ref+']').attr("src", "data:image/png;base64," + item.thumb);
                  });
                }
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
    },
    error: function(err) {
      console.log(err);
      if (err.status === 401) {
        var redirect = "/oauthSignin?redirectOnshapeUri=" + encodeURIComponent(window.location);
        window.location.href = redirect;
      }
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
      console.log(data);
      for (var i = 0; i < data.length; ++i) {
        var item = data[i];
        var h = '<li class="insert-item" data-ref="' + i + '"><img data-ref="'+i+'" class="thumb user" src=""/><span class="item-name">' + item.name + '</li>';
        $("ul.folder[data-id=" + item.documentId +"]").append(h);
        item.ref = i;
      }
      $.ajax({
        url: '/api/thumbs',
        method: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        success: function(data) {
          console.log(data);
          data.forEach((item) => {
            $('img.thumb.user[data-ref='+item.ref+']').attr("src", "data:image/png;base64," + item.thumb);
          });
        }
      });
      $(".insert-item").click(function() {
        var ref = parseInt($(this).data("ref"));
        var item = data[ref];
        if (item.config.length > 0) {
          modalInsert.unbind("click");
          modalData.html("");
          let i = 0;
          item.config.forEach((item) => {
            modalData.append("<label for='config-opt-"+i+"'>" + item.name + ": </label>");
            if (item.type === "QUANTITY") {
              modalData.append("<br /><input class='config-opt' type='number' id='config-opt-"+i+"' data-ref='"+i+"' value='"+item.default+"' "
               + "min='"+item.quantityMin+"' max='"+item.quantityMax+"' " + ((item.quantityType === "INTEGER") ? "step='1'" : "step='any'") + " />");
              modalData.append("&nbsp;<span class='.input-units'>" + item.quantityUnits + "</span>" );
            }
            else if (item.type === "BOOLEAN") {
              modalData.append("&nbsp;<input class='config-opt' type='checkbox' id='config-opt-"+i+"' data-ref='"+i+"' " + (item.default ? "checked" : "") + " />");
            }
            else if (item.type === "STRING") {
              modalData.append("<br /><input class='config-opt' type='text' id='config-opt-"+i+"' data-ref='"+i+"' value='"+item.default+"' />");
            }
            else if (item.type === "ENUM") {
              let id = 'config-opt-'+i;
              modalData.append("<br /><select class='config-opt' id='"+id+"' data-ref='"+i+"' value='"+item.default+"'></select>");
              item.options.forEach((option) => {
                $("#"+id).append("<option value='"+option.value+"'>"+option.name+"</option>")
              });
            }
            modalData.append("<br />")
            i += 1;
          });

          modalInsert.click(function() {
            let configuration = {};
            $(".config-opt").each(function() {
              let i = $(this).data('ref');
              let conf = item.config[i];
              if (conf.type === "QUANTITY") {
                configuration[conf.id] = parseFloat($(this).val()).toFixed(6);
                if (conf.quantityUnits !== "") {
                  configuration[conf.id] +=  "+" + conf.quantityUnits;
                }
              }
              else if (conf.type === "BOOLEAN") {
                configuration[conf.id] = $(this).is(":checked");
              }
              else if (conf.type === "ENUM") {
                configuration[conf.id] = $(this).val();
              }
              else if (conf.type === "STRING") {
                configuration[conf.id] = $(this).val();
              }
            });
            doInsert(item.type, item.documentId, item.versionId, item.elementId, configuration, item.partId);
            modal.hide();
          });

          modal.show();
        }
        else {
          doInsert(item.type, item.documentId, item.versionId, item.elementId, null, item.partId);
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
            let thisText = $(this).children(":eq(3)").text().toLowerCase();
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

function encodeConfiguration(config) {
  if (!config || config === null || config === undefined) {
    return "";
  }
  let keys = Object.keys(config);
  let confStr = "";
  keys.forEach((id) => {
    confStr += id + "=" + config[id];
    confStr += ";";
  });
  confStr = confStr.slice(0, -1); // Remove trailing ;
  console.log(confStr);
  return confStr;
}

function doInsert(type, sourceDocId, sourceVersionId, sourceElemId, configuration, partId) {
  if (partId === undefined) {
    partId = "";
  }
  $.ajax('/api/insert?documentId=' + theContext.documentId + "&elementId=" + theContext.elementId + "&workspaceId=" + theContext.wvId,
  {
    method: "POST",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      "documentId": sourceDocId,
      "elementId": sourceElemId,
      "featureId": "",
      "isAssembly": type === "ASSEMBLY",
      "isWholePartStudio": type === "PARTSTUDIO",
      "microversionId": "",
      "partId": partId,
      "versionId": sourceVersionId,
      "configuration": encodeConfiguration(configuration)
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

