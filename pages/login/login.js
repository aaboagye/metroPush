// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/login/login.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            var loginButtonRun = document.getElementById("loginButton");
            var loggedIn = Windows.Storage.ApplicationData.current.roamingSettings.values["hasToken"];
            if (null != loginButtonRun)
                loginButtonRun.addEventListener("click", loginHandler, false);
            if (loggedIn != true) {
                loginHandler();
            }
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }
    });

    function loginHandler() {
        // Launch the request in the iFrame
        var pushBulletOauthUrl = "https://www.pushbullet.com/authorize";
        var clientID = "T4bWrUyIoEnoozVHdXZ3bGjH2SZdKRtS";
        var redirect_uri = "http://127.0.0.1/success.html";
        var request_url = Windows.Foundation.Uri(pushBulletOauthUrl +
            "?client_id=" + clientID +
            "&redirect_uri=" + redirect_uri +
            "&response_type=token&scope=everything");
        var callbackUri = Windows.Foundation.Uri(redirect_uri);

        // WebAuthenticationBroker here
        Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(Windows.Security.Authentication.Web.WebAuthenticationOptions.none, request_url, callbackUri).
            done(
            function (result) {
                // Check the response status here
                switch (result.responseStatus) {
                    case Windows.Security.Authentication.Web.WebAuthenticationStatus.success:
                        var fragment = Windows.Foundation.Uri(result.responseData).fragment;
                        if (fragment.indexOf("#access_token=") != -1) {
                            var token = fragment.substring(
                                new String("#access_token=").length);

                            /* Let's store the token */
                            var appData = Windows.Storage.ApplicationData.current;
                            var roamingSettings = appData.roamingSettings;
                            roamingSettings.values["userToken"] = token;
                            roamingSettings.values["hasToken"] = true;
                        }
                        // API calls here.
                        //navigate to landing page
                        WinJS.Navigation.navigate("/pages/landing/landing.html");
                        break;

                    case Windows.Security.Authentication.Web.WebAuthenticationStatus.userCancel:
                        Log(window.toStaticHTML(result.responseData));
                        Display("User cancelled the authentication");
                        break;

                    case Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp:
                        Log(window.toStaticHTML(result.responseData));
                        Display("An error occurred while communicating with Pushbullet");
                        break;
                }
            },
            function (exception) {
                Log();
            },
            function progress() {

            }
        );
    }
})();
