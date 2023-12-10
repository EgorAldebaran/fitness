function ajax_f(id) {

	tel = $('#tel-'+id).val();
	if(tel == ''){
		$("#tel-"+id).addClass('error');
		$("#tel-"+id).focus();
		setTimeout(function () {
			$("#tel-"+id).removeClass('error');
		}, 2600);
		return false;
	}

	var msg = $("#form-"+id).serialize();
	$.ajax({
		type: "POST",
		url: "/ajax/send_form.php",
		data: msg,
		success: function(data){
			$('#demo_form').html(data);
		},
		error:  function(xhr, str){
			alert("error!");
		}
	});
}


jQuery(document).ready(function () {
	$('#info_ico').click(function () {
		info_toggle();
		return false;
	});

	$(".anchor").click(function () {
		var dop = 0;
		$("html, body").animate({
			scrollTop: $($(this).attr("href")).offset().top + dop + "px"
		}, {
			duration: 500
		});
		return false;
	});
	$(".anchor2").click(function () {
		var dop = 0;
		$("html, body").animate({
			scrollTop: $($(this).data("to_elem")).offset().top + dop + "px"
		}, {
			duration: 500
		});
		return false;
	});

});

function info_toggle() {
	if ($('#info_ico').hasClass('active')) {
		$('#info_ico').removeClass('active');
		$('#relevantKbHtml').addClass('hidden');
	} else {
		$('#info_ico').addClass('active');
		$('#relevantKbHtml').removeClass('hidden');
		$('#relevantKbHtml').click(function (event) {
			//event.stopPropagation();
		});
		$('body').click(function (event) {
			InfoMenu();
		});
	}
}
function InfoMenu() {
	$('#info_ico').removeClass('active');
	$('#relevantKbHtml').addClass('hidden');
	$('body').unbind('click');
}

//скопировать шорткод
jQuery(document).on('click','.shortcode', function(e){
	e.preventDefault();
	var $temp = $("<input>");
	$("body").append($temp);
	$temp.val($(this).find('span').html()).select();
	document.execCommand("copy");
	$temp.remove();
	$(this).append('<i class="fa fa-check shortcode-copied" aria-hidden="true">Скопировано!</i>');
	setTimeout(function() {
		$('.shortcode-copied').remove();
	}, 1000);
});






// LPTracker data
$('form#save-lptracker-form').submit(function(e) {
	e.preventDefault();

	var $form = $(this);

	let validation = [];
	validation.error = false;

	if(validation.error == false) {

		var $values = $form.serialize();

		$.ajax({
			url: '/ajax/lptracker.php',
			type: "POST",
			data: {
				values: $values,
				query: 'saveForm'
			},
			beforeSend: function () {
				$('form .save-button').after('<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>');
			},
			success: function (response) {
				response = JSON.parse(response);
				console.log(response);
				if(response.error == true){
					$('.save-button').parent().append('<div class="alert alert-warning" style="margin-top:10px;">'+response.error_message+'</div>');
				}
				$('.fa-spinner').remove();
			}
		});

	}else{
		$('form .save-button').after('<div class="alert alert-error validation-error" style="margin-top:10px;">'+validation.error_message+'</div>');
	}
});


// LPTracker base form
$('form#lptracker-main').submit(function(e) {
	e.preventDefault();

	var $form = $(this);

	let validation = [];
	validation.error = false;

	if(validation.error == false) {

		var $values = $form.serialize();
		console.log($values);

		$.ajax({
			url: '/ajax/lptracker.php',
			type: "POST",
			data: {
				base_id: $('#base_id').val(),
				values: $values,
				query: 'saveBaseForm'
			},
			beforeSend: function () {
				$('form .save-button').after('<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>');
			},
			success: function (response) {
				console.log();
				response = JSON.parse(response);
				if(response.error == true){
					$('.save-button').parent().append('<div class="alert alert-warning" style="margin-top:10px;">'+response.error_message+'</div>');
				}else{
					$('.save-button').parent().append('<div class="alert alert-info" style="margin-top:10px;">'+response.message+'</div>');
				}
				setTimeout(function() {
					$('.alert').remove();
				}, 4000);
				$('.fa-spinner').remove();
			}
		});

	}else{
		$('form .save-button').after('<div class="alert alert-error validation-error" style="margin-top:10px;">'+validation.error_message+'</div>');
	}
});

jQuery(document).on('change','form#lptracker-main .project-name', function(){
	var value = $(this).val();

	$.ajax({
		url: '/ajax/lptracker.php',
		type: "POST",
		data: {
			project_id: value,
			query: 'changeProject'
		},
		success: function(response){
			response = JSON.parse(response);
			$('.reg-funnel-select').html(response.funnel);
			$('.vebinar_status_id').html(response.funnel);
			//$('.vebinar_old_status_id').html(response.funnel);
			$('.payment_new_status_id').html(response.funnel);
			$('.payment_part_status_id').html(response.funnel);
			$('.payment_full_status_id').html(response.funnel);

			$('.custom-field-lead-name').html(response.custom_fields);
			$('.custom-field-prim-name').html(response.custom_fields);

			$('.payment-custom-field-price').html(response.custom_fields);
		}
	});
});

jQuery(document).on('click','form#lptracker-main .fill-default-reg-values', function(e){
	e.preventDefault();
	var value = $(this).val();

	var name = 'Рег. на {vebinar_time_date} {vebinar_time_hi}';
	var contact_name = '{name} {phone}';
	var prim = 'РЕГИСТРАЦИЯ НА ВЕБИНАР \n' +
		'E-mail: {email}\n' +
		'Телефон: {phone}\n' +
		'utm_source: {utm_source}\n' +
		'utm_medium: {utm_medium}\n' +
		'utm_campaign : {utm_campaign}\n' +
		'utm_content : {utm_content}\n' +
		'utm_term :{utm_term}\n' +
		'ДАТА И ВРЕМЯ – {vebinar_time_date} {vebinar_time_hi}';
	$('#_reg_lead_name').val(name);
	$('#_reg_contact_name').val(contact_name);
	$('#_reg_prim').val(prim);

});

jQuery(document).on('click','form#lptracker-main .fill-default-report-values', function(e){
	var name='{view_date_data}  - {bil_minut} мин, {city}';
	var prim='ОТЧЕТ ИЗ BIZON365 О ПРИСУТСТВИИ НА ВЕБИНАРЕ:\n' +
		'Имя: {name} E-mail: {email}\n' +
		'Телефон: {phone}\n' +
		'Город: {city}\n' +
		'Клик на кнопке: {clickFile} \n' +
		'Кликал ли по баннеру: {clickBanner}\n' +
		'Был минут: {bil_minut} ; с {view_date} до {viewTill_date}\n' +
		'Досмотрел до конца: {finished} \n' +
		'Вебинарная комната {webinarId} \n' +
		'Дата вебинара: {view_date_data} ';
	$('#_report_name').val(name);
	$('#_report_prim').val(prim);

});
jQuery(document).on('click','form#lptracker-main .fill-default-pay-values', function(e){
	var name='ЗАКАЗ №{payment_number}';
	var prim='ГЕТКУРС ЗАКАЗ №{payment_number} \n' +
		'Название тарифа {positions}\n' +
		'стоимость тарифа: {costMoney}\n' +
		'осталось оплатить: {leftCostMoney}\n' +
		'оплачено: {payedMoney}\n' +
		'статус платежа: {payment_status}\n' +
		'ссылка на оплату: {paymentLink}\n' +
		'Имя: {name} E-mail: {email}\n' +
		'Телефон: {phone}';
	$('#_pay_name').val(name);
	$('#_pay_prim').val(prim);
});


/*
jQuery(document).on('click','.test', function(e){
	e.preventDefault();
	
	var value = $(this).val();

	$.ajax({
		url: '/ajax/lptracker.php',
		type: "POST",
		data: {
			project_id: 90016,
			base_id: $('#base_id').val(),
			user_id_from_base: $('#user_id_from_base').val(),
			query: 'testSend'
		},
		success: function(response){
			response = JSON.parse(response);
			console.log(response);
		}
	});
});
jQuery(document).on('click','.test-report', function(e){
	e.preventDefault();

	var value = $(this).val();

	$.ajax({
		url: '/ajax/lptracker.php',
		type: "POST",
		data: {
			project_id: 90016,
			base_id: $('#base_id').val(),
			user_id_from_base: $('#user_id_from_base').val(),
			query: 'testSendReport'
		},
		success: function(response){
			response = JSON.parse(response);
			console.log(response);
		}
	});
});
jQuery(document).on('click','.test-payment', function(e){
	e.preventDefault();

	var value = $(this).val();

	$.ajax({
		url: '/ajax/lptracker.php',
		type: "POST",
		data: {
			project_id: 90016,
			base_id: $('#base_id').val(),
			user_id_from_base: $('#user_id_from_base').val(),
			query: 'testSendPayment'
		},
		success: function(response){
			response = JSON.parse(response);
			console.log(response);
		}
	});
});
*/


/***автосмена**/

(function ($) {
	$.fn.datepicker.dates['ru'] = {
		days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
		daysShort: ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб"],
		daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
		months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
		monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
		today: "Сегодня",
		clear: "Очистить",
		format: "dd.mm.yyyy",
		weekStart: 1,
		monthsTitle: 'Месяцы'
	};
}(jQuery));

function new_date_piker() {
	$('.datepicker').datepicker({
		language: 'ru',
		autoclose: true
	});
	$('.date_del').click(function () {
		$(this).parent().parent().parent().remove();
		return false;
	});

	$('.date_del_price').click(function () {
		$(this).parent().parent().parent().parent().remove();
		return false;
	});
	upd_timepicker();

}

$(function () {

	$('.nav-tabs a').click(function () {
		var t = $(this).data('type');
		$('#data_types').val(t)
	});

	//Datemask dd/mm/yyyy
	//$('#datemask').inputmask('dd.mm.yyyy', {'placeholder': 'dd.mm.yyyy'})

	//Date picker
	$('#datepicker').datepicker({
		language: 'ru',
		autoclose: true
	});
	new_date_piker();

});

function upd_timepicker(){
	//Timepicker
	$('.timepicker').timepicker({
		showInputs: false,
		showMeridian: false,
		minuteStep: 5,

	});
	$('.timepicker').timepicker().on('changeTime.timepicker', function(e) {
		e.time.minutes = parseInt(e.time.minutes,10);
		if(e.time.minutes<10){
			e.time.minutes = 0+''+e.time.minutes;
		}

		if(e.time.hours<10){
			$(this).val('0'+e.time.hours+':'+e.time.minutes);
		}

	});
	$('.timepicker').timepicker().on('show.timepicker', function(e) {
		e.time.minutes = parseInt(e.time.minutes,10);
		if(e.time.minutes<10){
			e.time.minutes = 0+''+e.time.minutes;
		}

		if(e.time.hours<10){
			$(this).val('0'+e.time.hours+':'+e.time.minutes);
		}
	});
	$('.timepicker').timepicker('showWidget');
	$('.timepicker').timepicker('hideWidget');

}
$(function () {
	upd_timepicker();

})