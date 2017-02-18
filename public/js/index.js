$(function() {
	var $wrapper = $('#wrap-select');

	// theme switcher
	var theme_match = String(window.location).match(/[?&]theme=([a-z0-9]+)/);
	var theme = (theme_match && theme_match[1]) || 'default';
	var themes = ['default','legacy','bootstrap2','bootstrap3'];
	$('head').append('<link rel="stylesheet" href="../dist/css/selectize.' + theme + '.css">');



	// display scripts on the page
	$('script', $wrapper).each(function() {
		var code = this.text;
		if (code && code.length) {
			var lines = code.split('\n');
			var indent = null;

			for (var i = 0; i < lines.length; i++) {
				if (/^[	 ]*$/.test(lines[i])) continue;
				if (!indent) {
					var lineindent = lines[i].match(/^([ 	]+)/);
					if (!lineindent) break;
					indent = lineindent[1];
				}
				lines[i] = lines[i].replace(new RegExp('^' + indent), '');
			}

			var code = $.trim(lines.join('\n')).replace(/	/g, '    ');

		}
	});

	// show current input values
	// TODO: only add class 'selected-email' to the users selection and add class 'selected-topic' to the input tags
	$('select.selectized,input.selectized', $wrapper).each(function() {
		var $container = $('<div>').addClass('value')
		var $value = $('<input>').addClass('selected-email').attr('type','hidden').appendTo($container);
		var $input = $(this);
		console.log($input);
		var update = function(e) { $value.text($input.val()); }

		$(this).on('change', update);
		update();

		$container.insertAfter($input);
	});


});