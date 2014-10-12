$('.bread-nav li').each(function(){
	var word = $(this).text();
	var item = $('<a style="text-decoration: underline">' + word + '</a>');

	if (word == "首页") {
		$('a:contains("首页")').each(function(){
			if ($(this).text() == "首页") {
				item.attr('href', $(this).attr('href'));
			}
		})
	}
	else if (word == "我的课程" || word == "课堂") {
		$('a:contains("课堂")').each(function(){
			if ($(this).text() == "课堂") {
				item.attr('href', $(this).attr('href'));
			}
		})
	}
	else {
		$('a:contains('+word+')').each(function() {
			if ($(this).text() == word){
				item.attr('href', $(this).attr('href'));
			}
		})
	}

	if (item.attr('href') == undefined){
		$('a:contains("课程首页")').each(function() {
			item.attr('href', $(this).attr('href'));
		})
	}

	$(this).text("");
	$(this).append(item);
})