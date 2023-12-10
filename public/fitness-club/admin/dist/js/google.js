//GOOGLE API AJAX

function validationForm($form, check_required_fields = false){
	var $selects = $form.find('select');
	let data = [];
	data.error = false;
	data.error_message = '';

	//проверка что селекты заполнены
	$selects.each(function() {
		if($(this).val() == ''){
			data.error = true;
			data.error_message = 'Заполните все поля';
			$(this).css("border", "red solid 1px");
		}
	});

	//проверка, что кастомные поля заполнены
	var $inputs = $form.find('input.custom-field');
	if($inputs.length > 0) {
		$inputs.each(function () {
			if ($(this).val() == '') {
				data.error = true;
				data.error_message = 'Заполните все поля';
				$(this).css("border", "red solid 1px");
			}
		});
	}
	table_type = $('#table_type').val();
	//проверка, что среди левой колонки есть базовые поля
	if(check_required_fields && table_type == 'get_reg') {
		$selects = $form.find('.base-field');
		if ($selects.length > 0) {
			var error_base_fields = true;
			$selects.each(function () {
				if ($(this).val() == 'email' || $(this).val() == 'phone') {
					error_base_fields = false;
				}
			});
			if (error_base_fields) {
				data.error = true;
				data.error_message = 'Нужно выбрать хотя бы одно базовое поле: Email или Телефон';
				$selects.css("border", "red solid 1px");
			}
		}
	}


	return data;
}
// getList
jQuery(document).on('change', '#select-tables', function() {
	if(this.value.length > 0) {
		$.ajax({
			url: '/ajax/google.php',
			type: "POST",
			data: {
				table: this.value,
				base_id: $('#base-id').val(),
				table_type: $('#table_type').val(),
				query: 'getLists'
			},
			beforeSend: function () {
				$('.select-list').remove();
				$('.table-fields').remove();

				$('.select-tables').after('<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>');
			},
			success: function (response) {
				$('.select-tables').after(jQuery.parseJSON(response));
				$('.fa-spinner').remove();
			}
		});
	}else{
		$('.select-list').remove();
		$('.table-fields').remove();
	}

});

//getFields
jQuery(document).on('change', 'form.google-registration-fields #select-list', function() {
	if(this.value.length > 0) {
		$.ajax({
			url: '/ajax/google.php',
			type: "POST",
			data: {
				table: $('#select-tables').val(),
				list: this.value,
				base_id: $('#base-id').val(),
				table_type: $('#table_type').val(),
				query: 'getFields'
			},
			beforeSend: function () {
				$('.table-fields').remove();
				$('.alert-error').remove();
				$('.select-list').after('<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>');
			},
			success: function (response) {
				response = jQuery.parseJSON(response);
				$('.select-list').after(response['html']);
				if (response['error']) {
					var error_block = '<div class="alert alert-error alert-dismissible">' + response['error_message'] + '</div>';
					$('.select-list').after(error_block);
				}
				$('.fa-spinner').remove();

			}
		});
	}else{
		$('.table-fields').remove();
		$('.alert-error').remove();
	}

});




jQuery(document).on('click', '.add-row', function(e) {
	e.preventDefault();

	var tr = $(this).parent('.table-fields').find('tbody').children('tr:first-child').clone();
	var $tr = $(tr).not(".custom-field");
	$(tr).find('.base-field').val('');
	$(tr).find('.google-field').val('');
	$(this).parent('.table-fields').find('tbody').children('tr:last-child').after($tr);
});

jQuery(document).on('click', '.remove-row', function(e) {
	e.preventDefault();
	if ($(this).parent().parent().is(':not(:first-child)')) {
		$(this).parent().parent().hide('fast', function () {
			$(this).remove();
		});
	}

});

jQuery(document).on('change', '.base-field', function() {

	if(this.value=="custom-field"){
		$(this).after('<input type="text" value="" name="custom-field" class="form-control custom-field" placeholder="Введите произвольное поле">');
		$(this).removeAttr("name");
	}else{
		$(this).parent("td").children(".custom-field").hide('fast', function(){ $(this).remove(); });
		$(this).attr("name","base-field");
	}
});

//todo скорее всего форма проверки чтобы разные данные не выгружались в одну и туже ячейку
jQuery(document).on('change', 'form.google-export-fields .google-field', function() {

	var value = $(this).val();
	var $this = $(this);
	$('form.google-export-fields .google-field').each(function(){
		if($(this).val() == value){
			$(this).css("border", "red solid 1px");
			$this.css("border", "red solid 1px");
		}
	});
});

jQuery(document).on('change', '.form-control', function() {

	$(this).css("border", "#d2d6de solid 1px");
	$('.validation-error').remove();
});


document.addEventListener('DOMContentLoaded', function () {
	$('#gg_set_get_reg').on('ifChecked', function (event) {
		$('#gg_get_reg_table').removeClass('hidden');
		updatesettings('saveGetReg',1);
	});
	$('#gg_set_get_reg').on('ifUnchecked', function (event) {
		$('#gg_get_reg_table').addClass('hidden');
		updatesettings('saveGetReg',0);
	});


	$('#gg_set_exp_reg').on('ifChecked', function (event) {
		$('#gg_exp_reg_table').removeClass('hidden');
		updatesettings('saveExpReg',1);
	});
	$('#gg_set_exp_reg').on('ifUnchecked', function (event) {
		$('#gg_exp_reg_table').addClass('hidden');
		updatesettings('saveExpReg',0);
	});


	$('#gg_set_exp_report').on('ifChecked', function (event) {
		$('#gg_exp_report_table').removeClass('hidden');
		updatesettings('saveExpReport',1);
	});
	$('#gg_set_exp_report').on('ifUnchecked', function (event) {
		$('#gg_exp_report_table').addClass('hidden');
		updatesettings('saveExpReport',0);
	});

	$('#gg_set_exp_pay').on('ifChecked', function (event) {
		$('#gg_exp_pay_table').removeClass('hidden');
		updatesettings('saveExpPay',1);
	});
	$('#gg_set_exp_pay').on('ifUnchecked', function (event) {
		$('#gg_exp_pay_table').addClass('hidden');
		updatesettings('saveExpPay',0);
	});


	$('#gg_set_exp_gkpay').on('ifChecked', function (event) {
		$('#gg_exp_gk_pay_table').removeClass('hidden');
		updatesettings('saveExpGkPay',1);
	});
	$('#gg_set_exp_gkpay').on('ifUnchecked', function (event) {
		$('#gg_exp_gk_pay_table').addClass('hidden');
		updatesettings('saveExpGkPay',0);
	});


});
function updatesettings(type,value){
	$.ajax({
		url: '/ajax/google.php',
		type: "POST",
		data: {
			base_id: $('#base-id').val(),
			value: value,
			query: type
		},
		beforeSend: function () {
			$('#show_loader').after('<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>');
		},
		success: function (response) {
			console.log(response);
			$('.fa-spinner').remove();
			//$('.get-new-users').removeAttr('disabled');
			//$('.reset-counter').removeAttr('disabled');
		}
	});
}

//сохранить форму
$('form.google-registration-fields').submit(function(e) {
	e.preventDefault();

	var $form = $(this);

	validation = validationForm($form, true);

	if(validation.error == false) {
		var $values = $form.serializeArray();
		$.ajax({
			url: '/ajax/google.php',
			type: "POST",
			data: {
				table: $('#select-tables').val(),
				list: $('#select-list').val(),
				base_id: $('#base-id').val(),
				table_type: $('#table_type').val(),
				values: JSON.stringify($values),
				query: 'saveForm'
			},
			beforeSend: function () {
				$('form .save-button').after('<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>');
			},
			success: function (response) {
				$('.fa-spinner').remove();
				$('.get-new-users').removeAttr('disabled');
				//$('.reset-counter').removeAttr('disabled');
			}
		});

	}else{
		$('form .save-button').after('<div class="alert alert-error validation-error" style="margin-top:10px;">'+validation['error_message']+'</div>');
	}
});

/*
jQuery(document).on('click', '.get-new-users', function(e) {
	e.preventDefault();

	if ($(this).is("[disabled]")) {
		$('.get-new-users').parent().append('<div class="alert alert-warning" style="margin-top:10px;">Сначала настройте таблицу и нажмите кнопку сохранить</div>');
		return;
	}

	$.ajax({
		url: '/ajax/google.php',
		type: "POST",
		data: {
			base_id: $('#base-id').val(),
			query: 'getData'
		},
		beforeSend: function(){
			$('.get-new-users').after('<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>');
		},
		success: function(response){
			response = jQuery.parseJSON(response);
			$('.fa-spinner').remove();
			$('.get-new-users').parent().append('<div class="alert alert-success alert-info" style="margin-top:10px;">Получено '+response['count']+' пользователей</div>');
			setTimeout(function() {
				$('.alert-info').remove();
			}, 4000);

		}
	});
});
jQuery(document).on('click', '.export-users', function(e) {
	e.preventDefault();

	if ($(this).is("[disabled]")) {
		$('.export-users').parent().append('<div class="alert alert-warning" style="margin-top:10px;">Сначала настройте таблицу и нажмите кнопку сохранить</div>');
		return;
	}

	$.ajax({
		url: '/ajax/google.php',
		type: "POST",
		data: {
			base_id: $('#base-id').val(),
			query: 'exportUsers'
		},
		beforeSend: function(){
			$('.export-users').after('<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>');
		},
		success: function(response){
			response = jQuery.parseJSON(response);
			$('.fa-spinner').remove();
			$('.export-users').parent().append('<div class="alert alert-success alert-info" style="margin-top:10px;">Выгружено '+response.count + ' пользователей</div>');
			setTimeout(function() {
				$('.alert-info').remove();
			}, 4000);
		}
	});
});

jQuery(document).on('click', '.reset-counter', function(e) {
	e.preventDefault();

	if ($(this).is("[disabled]")) {
		$('.reset-counter').parent().append('<div class="alert alert-warning" style="margin-top:10px;">Сначала настройте таблицу и нажмите кнопку сохранить</div>');
		return;
	}

	$.ajax({
		url: '/ajax/google.php',
		type: "POST",
		data: {
			base_id: $('#base-id').val(),
			query: 'resetCounter'
		},
		beforeSend: function(){
			$('.reset-counter').after('<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>');
		},
		success: function(){
			$('.fa-spinner').remove();
			$('.reset-counter').parent().append('<div class="alert alert-success alert-info" style="margin-top:10px;">Счётчик сброшен</div>');
			setTimeout(function() {
				$('.alert-info').remove();
			}, 4000);

		}
	});
});
jQuery(document).on('click', '.reset-export-counter', function(e) {
	e.preventDefault();

	if ($(this).is("[disabled]")) {
		$('.get-new-users').parent().append('<div class="alert alert-warning" style="margin-top:10px;">Сначала настройте таблицу и нажмите кнопку сохранить</div>');
		return;
	}

	$.ajax({
		url: '/ajax/google.php',
		type: "POST",
		data: {
			base_id: $('#base-id').val(),
			query: 'resetExportCounter'
		},
		beforeSend: function(){
			$('.reset-export-counter').after('<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>');
		},
		success: function(){
			$('.fa-spinner').remove();
			$('.reset-export-counter').parent().append('<div class="alert alert-success alert-info" style="margin-top:10px;">Счётчик сброшен</div>');
			setTimeout(function() {
				$('.alert-info').remove();
			}, 4000);

		}
	});
});

 */