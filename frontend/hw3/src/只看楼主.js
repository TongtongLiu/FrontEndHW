var simplifybutton = $('<a id="simplifybutton" class="gray-button">只看楼主</a>');
$('.topbar').append(simplifybutton);
simplifybutton.click(function(){
	var item = $('.info-detail-list li');
	var hostinfo = $(item[0]).find('.author-info p').text();
	
	item.each(function(){
		if ($(this).find('.author-info p').text() != hostinfo) {
			$(this).attr('style', 'display: none');
		}
	})
})
