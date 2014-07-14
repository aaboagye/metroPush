// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

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
                    var list = new WinJS.Binding.List(json.devices);
                    var text = WinJS.Utilities.query("#test")[0];
                    text.innerHTML = list.getItem(0).data.nickname;
                },
                function (error) {},
                function (progress) {});

            var Oldlist = document.getElementById("devices-list").innerHTML;
            var newList = "<li>Nexus 5</li>";
            Oldlist = Oldlist + newList;
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }
    });

    function getDevices() {
        var token = Windows.Storage.ApplicationData.current.roamingSettings.values["token"];
        var deviceRequestURI = new Uri("https://" + token + "api.pushbullet.com/v2/devices");
        var httpClient = new Windows.Web.Http.HttpClient();

        httpClient.getStringAsync(deviceRequestURI).done(function (response) {

        }, onError);

        function onError(reason) {
            // details in reason.Message and ex.HResult
        }
    }
})();
