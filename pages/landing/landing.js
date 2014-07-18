// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    var deviceList;
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
                    var lv = new WinJS.UI.ListView(deviceDiv);
                    lv.itemDataSource = deviceList.dataSource;
                    lv.itemTemplate = deviceListTemplate;
                    lv.layout = WinJS.UI.ListLayout;
                    lv.itemsDraggable = false;
                    lv.selectionMode = WinJS.UI.SelectionMode.single;
                    lv.tapBehavior = WinJS.UI.TapBehavior.directSelect;
                    lv.swipeBehavior = WinJS.UI.SwipeBehavior.none;
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

    function addDevice(list, device) {
        var list = document.getElementById(list);
        var li = document.createElement("li");
        li.innerHTML = device;
        li.setAttribute("class", "device");
        list.appendChild(li);
    }

    function deviceListTemplate(itemPromise) {
        return itemPromise.then(function (item) {
            var div = document.createElement("div");
            div.setAttribute("class", "device-list-item");
            // TODO: Add another div here for the icons
            var nameDiv = document.createElement("div");
            nameDiv.setAttribute("class", "device-name");
            var name = document.createElement("h3");
            name.innerText = item.data.nickname;
            name.setAttribute("class", "device-title");
            nameDiv.appendChild(name);
            div.appendChild(nameDiv);

            return div;
        });
    }
})();
