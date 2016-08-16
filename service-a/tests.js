var page = require("webpage").create();
page.open("http://service-a", function (status) {
    if (status !== "success") {
        console.log("Status:" + status);
        phantom.exit(1);
    }
    phantom.exit();
})
