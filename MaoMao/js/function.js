$(document).ready(function(){
    var time = new Date();
    var hour = time.getHours();
    var myhour = hour;
    //var myhour = 0;
    var height = 120;
    $(".hour-list").css({
        'transform': 'translateY(-' + height * myhour + 'px)',
        '-webkit-transform': 'translateY(-' + height * myhour + 'px)',
        '-moz-transform': 'translateY(-' + height * myhour + 'px)',
        '-o-transform': 'translateY(-' + height * myhour + 'px)',
        '-ms-transform': 'translateY(-' + height * myhour + 'px)'
    });
    $("#bg-img img:eq(" + myhour + ")").addClass("img-selected");
    $("#words-container div:eq(" + myhour + ")").addClass("words-selected");

    $("body").mousewheel(function(event, delta){
            var limit = new Date();
            limit.setFullYear(2014,8,2);
            limit.setHours(0,0,0,0);
            var flag = time >= limit ? true : false;
            if (delta > 0) {
                if (myhour > 0) {
                    myhour--;
                    $(".hour-list").css({
                        'transform': 'translateY(-' + height * myhour + 'px)',
                        '-webkit-transform': 'translateY(-' + height * myhour + 'px)',
                        '-moz-transform': 'translateY(-' + height * myhour + 'px)',
                        '-o-transform': 'translateY(-' + height * myhour + 'px)',
                        '-ms-transform': 'translateY(-' + height * myhour + 'px)'
                    });
                }
            }
            else {
                if (myhour < hour || (flag && myhour < 23)) {
                //if (myhour < 23) {
                    myhour++;
                    $(".hour-list").css({
                        'transform': 'translateY(-' + height * myhour + 'px)',
                        '-webkit-transform': 'translateY(-' + height * myhour + 'px)',
                        '-moz-transform': 'translateY(-' + height * myhour + 'px)',
                        '-o-transform': 'translateY(-' + height * myhour + 'px)',
                        '-ms-transform': 'translateY(-' + height * myhour + 'px)'
                    });
                }
            }

            $("#bg-img img").removeClass("img-selected");
            $("#bg-img img:eq(" + myhour + ")").addClass("img-selected");

            $("#words-container div").removeClass("words-selected");
            $("#words-container div:eq(" + myhour + ")").addClass("words-selected");
        }
    );

    
});