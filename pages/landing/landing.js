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
    WinJS.UI.Pages.define("/pages/landing/landing.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            // TODO: Get list of devices
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
                function (progress) {});
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />
            // TODO: Respond to changes in layout.
        }

    });

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
