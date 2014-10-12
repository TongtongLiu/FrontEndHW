$('h3').each(function(){
	var roll = $('<a style="float: right; margin-right: 10px;">折叠</a>');
	$(this).append(roll);
	roll.click(function(){
		if ($(this).parent().next().css('display') != 'none') {
			$(this).parent().next().css('display', 'none');
		}
		else {
			$(this).parent().next().css('display', 'block');
		}
	})
})