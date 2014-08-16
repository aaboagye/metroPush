// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    var deviceList;
    var lv;
    var publicMembers = {
        itemList: deviceList
    };
    WinJS.Namespace.define("DataExample", publicMembers);

    // Store info about selected file.
    var fileObject =
    {
        src: null,
        name: null,
        path: null,
        displayName: null
    };

    var pushType = "note"; // First type of push is a note by default.

   var landingPage = WinJS.UI.Pages.define("/pages/landing/landing.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            var token = Windows.Storage.ApplicationData.current.roamingSettings.values["userToken"];

            WinJS.xhr({ user: token, password: "", url: "https://api.pushbullet.com/v2/devices", responseType: "json", type: "get" }).then(
                function (response) {
                    var json = JSON.parse(response.responseText);
                    deviceList = new WinJS.Binding.List(json.devices);
   
                    var deviceDiv = document.getElementById("devices");
                    lv = new WinJS.UI.ListView(deviceDiv);
                    lv.itemDataSource = deviceList.dataSource;
                    lv.itemTemplate = deviceListTemplate;
                    lv.layout = new WinJS.UI.ListLayout();
                    lv.itemsDraggable = false;
                    lv.selectionMode = WinJS.UI.SelectionMode.single;
                    lv.tapBehavior = WinJS.UI.TapBehavior.directSelect;
                    lv.swipeBehavior = WinJS.UI.SwipeBehavior.none;
                    lv.addEventListener("selectionchanged", updateToField);
                },
                function (error) {},
                function (progress) { });

            var linkButton = document.getElementById("linkpush");
            var textButton = document.getElementById("textpush");
            var fileButton = document.getElementById("filepush");
            var listButton = document.getElementById("listpush");
            var locButton = document.getElementById("locpush");
            var pushButton = document.getElementById("submitButton");

            linkButton.addEventListener("click", changeFormToLink);
            textButton.addEventListener("click", changeFormToText);
            //listButton.addEventListener("click", changeFormToList);
            locButton.addEventListener("click", changeFormToLoc);
            fileButton.addEventListener("click", fileSelectClickHandler);
            pushButton.addEventListener("click", pushHandler);
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />
            // TODO: Respond to changes in layout.
        },

        fileSelectClickHandler: function (eventInfo) {
            var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
            openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
            openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.thumbnail;

            openPicker.fileTypeFilter.clear();
            openPicker.pickSingleFileAsync().done(
                landingPage.prototype.changeFormToFile,
                landingPage.prototype.fileSelectError);
        },

        changeFormToFile: function(file) {
            if (file) {
                fileObject.name = file.name;
                fileObject.path = file.path;
                fileObject.displayName = file.displayName;

                var fileBlob = URL.createObjectURL(file, { oneTimeOnly: true });
                fileObject.src = fileBlob;

                var msg = document.getElementById("message-text");
                if (msg != null) {
                    msg.parentNode.removeChild(msg);
                    //pushInfo.appendChild(file_label);
                }

                var file_label = document.getElementById("title-text");
                file_label.setAttribute("data-win-bind", "innerText: path");
                file_label.disabled = true;
                var pushInfo = document.getElementById("pushInfoDiv");
                WinJS.Binding.processAll(pushInfo, fileObject);
                /* TODO: For file you have to do something different. */
                pushType = "file";
            }
        },

        fileSelectError: function (error) {
            console.log("unable to select file");
            // TODO: pop-up
        }

    });

   function pushHandler(eventInfo) {
       // TODO: need to pull the device_iden from the nickname. Otherwise it just goes out to all devices.
       var token = Windows.Storage.ApplicationData.current.roamingSettings.values["userToken"];
       var url = "https://api.pushbullet.com/v2/pushes";
       var data;

       switch (pushType) {
           case "note":
               // TODO: Title isn't working
               var title = document.getElementById("title-text").innerHTML;
               var body = document.getElementById("message-text").innerText;
               data = {
                   type: pushType,
                   title: title,
                   body: body
               }
               break;

           case "link":
               break;

           case "address":
               break;

           case "list":
               break;

           case "file":
               break;
       }

       WinJS.xhr({
           user: token,
           url: url,
           type: "POST",
           responseType: "json",
           data: JSON.stringify(data),
           headers: {
               "Content-Type": "application/json"
           }
       }).then(
                function (response) {
                    var json = JSON.parse(response.responseText);
                    console.log(json);
                },
                function (error) {
                    console.log("error performing push");
                    console.log(error);},
                function (progress) { });
   }

   function fileSelectClickHandler(eventInfo) {
       // TODO: Limit files selected to respect file size limit.
        var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
        openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
        openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.thumbnail;

        openPicker.fileTypeFilter.replaceAll(["*"]);
        openPicker.pickSingleFileAsync().done(
            landingPage.prototype.changeFormToFile,
            landingPage.prototype.fileSelectError);
   }

    function changeFormToLink() {
        var title = document.getElementById("title-text");
        title.placeholder = "Link Title";
        title.disabled = false;
        var message = document.getElementById("message-text");
        if (message == null) {
            var parent = document.getElementById("message-div");
            message = document.createElement("textarea");
            message.setAttribute("id", "message-text");
            parent.appendChild(message);
        }
        message.innerText = "http://www.example.com";
        pushType = "link";
    }

    function changeFormToText() {
        var title = document.getElementById("title-text");
        title.placeholder = "Title";
        title.disabled = false;
        var message = document.getElementById("message-text");
        if (message == null) {
            var parent = document.getElementById("message-div");
            message = document.createElement("textarea");
            message.setAttribute("id", "message-text");
            parent.appendChild(message);
        }
        message.innerText = "Message";
        pushType = "note";
    }

    function changeFormToLoc() {
        var title = document.getElementById("title-text");
        title.placeholder = "Name";
        title.disabled = false;
        var message = document.getElementById("message-text");
        if (message == null) {
            var parent = document.getElementById("message-div");
            message = document.createElement("textarea");
            message.setAttribute("id", "message-text");
            parent.appendChild(message);
        }
        message.innerText = "Street address, place, or name of location";
        pushType = "address";
    }

    function updateToField(element) {
        var toField = document.getElementById("to-field");
        var index = lv.selection.getItems().then(function (items) {
            toField.innerText = items[0].data.nickname;
        });
    }

    function deviceListTemplate(itemPromise) {
        return itemPromise.then(function (item) {
            var div = document.createElement("div");
            div.setAttribute("class", "device-list-item");
            var iconDiv = document.createElement("div");
            iconDiv.setAttribute("class", "device-icon");
            var icon = document.createElement("img");
            icon.setAttribute("src", "#");
            icon.setAttribute("style", "width: 60px; height: 60px;");
            switch (item.data.type){
                case "chrome":
                    icon.src = "/images/chrome_icon.png";
                    break;

                case "windows":
                    icon.src = "/images/windows_icon.png";
                    break;

                case "android":
                    icon.src = "/images/smartphone_icon.png";
                    break;
            }
            iconDiv.appendChild(icon);
            var nameDiv = document.createElement("div");
            nameDiv.setAttribute("class", "device-name");
            var name = document.createElement("h3");
            name.innerText = item.data.nickname;
            name.setAttribute("class", "device-title");
            nameDiv.appendChild(name);
            div.appendChild(iconDiv);
            div.appendChild(nameDiv);

            return div;
        });
    }
})();
