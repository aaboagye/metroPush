// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
                var field = document.getElementById("token");
                field.innerText = Windows.Storage.ApplicationData.current.roamingSettings.values["userToken"];
            }
            args.setPromise(WinJS.UI.processAll());
            var loginButtonRun = document.getElementById("loginButton");
            var loggedIn = Windows.Storage.ApplicationData.current.roamingSettings.values["hasToken"];
            if (null != loginButtonRun)
                loginButtonRun.addEventListener("click", loginHandler, false);
            if (loggedIn == false) {
                
            }
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

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
                            userToken = token;

                            /* Let's store the token */
                            var appData = Windows.Storage.ApplicationData.current;
                            var roamingSettings = appData.roamingSettings;
                            roamingSettings.values["userToken"] = token;
                            roamingSettings.values["hasToken"] = true;
                        }
                        // API calls here.
                        WinJS.Navigation.navigate("landing.html");
                        break;

                    case Windows.Security.Authentication.Web.WebAuthenticationStatus.userCancel:
                        Log(window.toStaticHTML(result.responseData));
                        Display("User cancelled the authentication to Facebook");
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

    app.start();
})();
