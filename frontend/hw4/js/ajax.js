var url = "./json/pictures.json";

function processData_pictures(data) {
    var pic = $('#pictures-view div a');
    var txt = $('#pictures-view div p');
    var i;

    for (i = 0; i < pic.length; i++){
        $(pic[i]).attr('title', data.picturesList[i]['title']);
        $(pic[i]).attr('href', data.picturesList[i]['link']);
        $(pic[i]).find('img').attr('src', data.picturesList[i]['src']);
        $(txt[i]).text(data.picturesList[i]['description']);
    }
}

function handler_pictures() {
    if (this.readyState == this.DONE) {
        if (this.status == 200) {
            try {
                processData_pictures(JSON.parse(this.responseText));
            } catch(exception) {
                console.log(exception.message);
            }
        }
    }
}

function ajax_pictures() {
    var client = new XMLHttpRequest();

    try
    {
        client.onreadystatechange = handler_pictures;
        client.open('GET', url);
        client.send();
    }
    catch(exception)
    {
        alert("XMLHttpRequest Fail!");
    }
}

$(document).ready(function(){
    ajax_pictures();
});
