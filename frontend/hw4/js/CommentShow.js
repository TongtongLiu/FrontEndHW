var current = parseInt(localStorage['current_comment']) || 1;
var totpages = 4;

function ShowComment() {
	$('#comment-title a').click(function(event) {
		event.preventDefault();
		if($('#comment-list').hasClass('hide-comment')) {
			$('#comment-list').removeClass('hide-comment');
			$('#comment-list').addClass('show-comment');
			$(this).attr('title', "收起评论列表");
		}
		else {
			$('#comment-list').removeClass('show-comment');
			$('#comment-list').addClass('hide-comment');
			$(this).attr('title', "展开评论列表");
		}

		$('#cur-page').text("第" + current + "页，共" + totpages + "页");
		if (current <= 1) {
			if (!$('#pre-page').hasClass('inactive-button')) {
				$('#pre-page').addClass('inactive-button');
			}
		}
		else {
			if ($('#pre-page').hasClass('inactive-button')) {
				$('#pre-page').removeClass('inactive-button');
			}
		}
		if (current >= totpages) {
			if (!$('#next-page').hasClass('inactive-button')) {
				$('#next-page').addClass('inactive-button');
			}
		}
		else {
			if ($('#next-page').hasClass('inactive-button')) {
				$('#next-page').removeClass('inactive-button');
			}
		}
	});

	$('#pre-page').click(function(event) {
		event.preventDefault();
		if (current > 1) {
			ajax_comments(current - 1);
			$('#cur-page').text("第" + current + "页，共" + totpages + "页");
		}

		if (current <= 1) {
			if (!$('#pre-page').hasClass('inactive-button')) {
				$('#pre-page').addClass('inactive-button');
			}
		}
		else {
			if ($('#pre-page').hasClass('inactive-button')) {
				$('#pre-page').removeClass('inactive-button');
			}
		}
		if (current >= totpages) {
			if (!$('#next-page').hasClass('inactive-button')) {
				$('#next-page').addClass('inactive-button');
			}
		}
		else {
			if ($('#next-page').hasClass('inactive-button')) {
				$('#next-page').removeClass('inactive-button');
			}
		}
	});

	$('#next-page').click(function(event) {
		event.preventDefault();
		if (current < totpages) {
			ajax_comments(current + 1);
			$('#cur-page').text("第" + current + "页，共" + totpages + "页");
		}

		if (current <= 1) {
			if (!$('#pre-page').hasClass('inactive-button')) {
				$('#pre-page').addClass('inactive-button');
			}
		}
		else {
			if ($('#pre-page').hasClass('inactive-button')) {
				$('#pre-page').removeClass('inactive-button');
			}
		}
		if (current >= totpages) {
			if (!$('#next-page').hasClass('inactive-button')) {
				$('#next-page').addClass('inactive-button');
			}
		}
		else {
			if ($('#next-page').hasClass('inactive-button')) {
				$('#next-page').removeClass('inactive-button');
			}
		}
	})
}
ShowComment();

function processData_comments(data) {
    var item = $('.comment-item');
    var i;

    for (i = 0; i < item.length; i++) {
        $(item[i]).find('.commenter-logo-size').attr('src', data.commentsList[i]['logo']);
        $(item[i]).find('.commenter-name').text(data.commentsList[i]['name']);
        $(item[i]).find('.comment-context').html(data.commentsList[i]['content']);
        $(item[i]).find('.comment-info').text(data.commentsList[i]['info']);
    }
}

function handler_comments() {
    if (this.readyState == this.DONE) {
        if (this.status == 200) {
            try {
                processData_comments(JSON.parse(this.responseText));
            } catch(exception) {
                console.log(exception.message);
            }
        }
    }
}

function ajax_comments(index) {
    var client = new XMLHttpRequest();
    current = index;
    localStorage['current_comment'] = current + '';

    try
    {
        client.onreadystatechange = handler_comments;
        client.open('GET', './json/comments' + current + '.json');
        client.send();
    }
    catch(exception)
    {
        alert("XMLHttpRequest Fail!");
    }
}

ajax_comments(current);