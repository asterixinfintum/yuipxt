function base64ToImage(base64String) {

    var img = new Image();
    var hascomma = base64String.includes(',');

    if (hascomma) {
        var base64StringArray = base64String.split(',');
        var htype = base64StringArray[0];
        var hdata = base64StringArray[1];

        if (htype == "data:text/html;base64") {
            const iframeElement = document.createElement('iframe');
            iframeElement.src = base64String;

            return iframeElement;
        }
        else {
            img.src = base64String;
            return img;
        }
    }
    else {
        img.src = "data:image/png;base64," + base64String;
        return img;
    }
}