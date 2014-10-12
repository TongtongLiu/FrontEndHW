$(document).ready(function(){
	var title = $('.hw-table-title table tbody tr td');
	$(title[0]).attr('width', '3%');
	$(title[1]).attr('width', '19%');
	$(title[2]).attr('width', '6%');
	$(title[3]).attr('width', '6%');
	$(title[4]).attr('width', '13%');
	$(title[5]).attr('width', '13%');
	$(title[6]).attr('width', '5%');
	$(title[7]).attr('width', '9%');
	$(title[8]).attr('width', '9%');
	$('<td width="9%" class="gray">DDL倒计时</td>').insertBefore(title[6]);

	$('.hw-table-c table tbody tr').each(function() {
		var itemtd = $(this).find('td');
		var countdown = $('<td width="9%" class="gray"></td>');
		var curDate = new Date();
		var targetDate = new Date(Date.parse($(itemtd[5]).text()));
		var deltatime = (Date.parse(targetDate) - Date.parse(curDate)) / 1000;
		var txt = '', flag = false;

		if (deltatime < 0) {
			txt += '时间已过';
		}
		else {
			if (deltatime > 24 * 3600) {
				flag = true;
				txt = txt + parseInt(deltatime / 24 / 3600) + 'd ';
				deltatime -= parseInt(deltatime / 24 / 3600) * 24 * 3600;
			}
			if (deltatime > 3600 || flag) {
				flag = true;
				txt = txt + parseInt(deltatime / 3600) + 'h ';
				deltatime -= parseInt(deltatime / 3600) * 3600;
			}
			if (deltatime > 60 || flag) {
				flag = true;
				txt = txt + parseInt(deltatime / 60) + 'm';
			}
		}
		countdown.text(txt);

		$(itemtd[0]).attr('width', '3%');
		$(itemtd[1]).attr('width', '19%');
		$(itemtd[2]).attr('width', '6%');
		$(itemtd[3]).attr('width', '6%');
		$(itemtd[4]).attr('width', '13%');
		$(itemtd[5]).attr('width', '13%');
		$(itemtd[6]).attr('width', '5%');
		$(itemtd[7]).attr('width', '9%');
		$(itemtd[8]).attr('width', '9%');
		countdown.insertBefore(itemtd[6]);
	})
});