const $params = document.querySelector('.container .params')
const $settings = document.querySelector('.container .settings .settings_container')

const TYPES = [{
    name: 'string',
    title: 'Строка',
}, {
    name: 'number',
    title: 'Число',
}, {
    name: 'array',
    title: 'Массив'
}, {
    name: 'object',
    title: 'Объект'
}, {
    name: 'date',
    title: 'Дата'
}]

//const COUNT_DB_FIELDS = 7
//let dbFields = []

//for (let i = 0; i < COUNT_DB_FIELDS; i++) {
//    dbFields = [...dbFields, {
//        name: `field${i + 1}`,
//        title: `Поле${i + 1}`
 //   }];
	console.log(dbFields);
//}

const root = {
    id: crypto.randomUUID(),
    type: 'object',
    childs: []
}

let selectedId = ""
let openedList = new Set()
const mainConfig = {
    disableParamNameInput: false,
    limitTypes: false       // если данные на вход - ограничить смену типа (строка -> дата / дата -> строка)
}

if (typeof inputData !== 'undefined') {
    root.childs = parseInput(inputData, root)
    mainConfig.disableParamNameInput = true
    mainConfig.limitTypes = true
}

function parseInput(obj, parent) {
    let output = []

    for (const key in obj) {
        switch (typeof obj[key]) {
            case 'string': {
                const newItem = {
                    id: crypto.randomUUID(),
                    field: dbFields[0].name,
                    parent
                }
                if (parent.type !== 'array') newItem.name = key

                if (!isNaN(Date.parse(obj[key]))) {
                    newItem.type = 'date'
                } else {
                    newItem.type = typeof obj[key]
                }

                output = [...output, newItem]
                break
            }

            case 'number': {
                const newItem = {
                    id: crypto.randomUUID(),
                    type: typeof obj[key],
                    field: dbFields[0].name,
                    parent
                }
                if (parent.type !== 'array') newItem.name = key
                output = [...output, newItem]
                break
            }

            case 'object': {
                const newItem = {
                    id: crypto.randomUUID(),
                    type: Array.isArray(obj[key]) ? 'array' : typeof obj[key],
                    parent
                }
                if (parent.type !== 'array') newItem.name = key

                newItem.childs = parseInput(obj[key], newItem)
                output = [...output, newItem]
                break
            }

            default:
                break;
        }
    }

    return output
}

renderParams()

function renderParams() {
    $params.innerHTML = ""

    const html = `<ul class="tree"></ul>`
    $params.insertAdjacentHTML('beforeend', html)
    const rootUl = $params.querySelector('ul')

    createParam(rootUl, root)

    if ($params.querySelector('.item.selected')) {
        $params.querySelector('.item.selected').scrollIntoView({behavior: 'smooth'})
    }
}

function createParam(rootUl, param) {
    param.childs.forEach((param, i) => {
        switch (param.type) {
            case 'array':
            case 'object': {
                const li = document.createElement('li')
                li.insertAdjacentHTML('beforeend', `<div class="close_list ${openedList.has(param.id) ? 'opened' : 'closed'}"></div><div class="item ${param.type} ${param.id === selectedId ? 'selected' : ''}">${param.parent.type !== 'array' ? `${param.name}` : `[${i}]`}</div><ul style="display: ${openedList.has(param.id) ? 'block' : 'none'};"></ul>`)
                rootUl.append(li)

                li.querySelector('.item').addEventListener('click', (e) => {
                    $params.querySelectorAll('div.item').forEach(item => item.classList.remove('selected'))
                    e.target.classList.add('selected')
                    renderSettings(param)
                    selectedId = param.id
                })

                li.querySelector('.close_list').addEventListener('click', (e) => {
                    if (Array.from(e.target.classList).includes("closed")) {
                        openedList.add(param.id)
                        e.target.className = "close_list opened"
                        return e.target.parentElement.querySelector('ul').style.display = "block"
                    }

                    openedList.delete(param.id)
                    e.target.className = "close_list closed"
                    return e.target.parentElement.querySelector('ul').style.display = "none"
                })

                createParam(li.querySelector('ul'), param)
                break
            }

            case 'number':
            case 'string':
            case 'date': {
                const li = document.createElement('li')
                li.insertAdjacentHTML('beforeend', `<div class="item ${param.type} ${param.id === selectedId ? 'selected' : ''}">${param.parent.type !== 'array' ? `${param.name}` : `[${i}]`}</div>`)
                rootUl.append(li)

                li.querySelector('.item').addEventListener('click', (e) => {
                    $params.querySelectorAll('div.item').forEach(item => item.classList.remove('selected'))
                    e.target.classList.add('selected')
                    renderSettings(param)
                    selectedId = param.id
                })

                break
            }

            default: break
        }
    })

    if (!mainConfig.limitTypes && (param.type === 'array' || param.type === 'object')) {
        const li = document.createElement('li')
        li.insertAdjacentHTML('beforeend', `<div class="item add-btn" style="border: none;"><div class="btn add-button btn-primary">Добавить</div></div>`)
        rootUl.append(li)

        li.querySelector('.btn').addEventListener('click', () => {
            const newParam = {
                id: crypto.randomUUID(),
                type: TYPES[0].name,
                field: dbFields[0].name,
                parent: param,
                childs: []
            }

            if (newParam.parent.type !== 'array') {
                newParam.name = `param${param.childs.length + 1}`
            }

            param.childs = [...param.childs, newParam]
            selectedId = newParam.id

            renderParams()
            renderSettings(newParam)
        })
    }
}

function renderSettings(param) {
    $settings.innerHTML = ""
    const html = `
        ${param.parent.type !== 'array' ? `
            <div class="settings_item form-group">
                <label>Имя параметра:</label>
                <div class="setting_field">
                    <input type="text" class="form-control" name="name_param" placeholder="Имя параметра" value=${param.name} ${mainConfig.disableParamNameInput ? 'disabled style="border-color: var(--delete-color);"' : ''}>
                </div>
            </div>
        ` : ''}
        <div class="settings_item form-group">
            <label>Тип параметра:</label>
            <div class="setting_field">
                ${mainConfig.limitTypes ? `
                    <select name="type_param"  class="form-control">
                        ${TYPES.map(type => {
                            if (
                                (
                                    (type.name === 'string' || type.name === 'date') 
                                    && (param.type === 'string' || param.type === 'date')
                                ) 
                            || param.type === type.name) {
                                return `<option value="${type.name}" ${param.type === type.name ? 'selected' : ''}>${type.title}</option>` 
                            }
                        }).join('')}
                    </select>
                ` : ''}

                ${!mainConfig.limitTypes ? `
                    <select name="type_param"  class="form-control">
                        ${TYPES.map(type => `<option value="${type.name}" ${param.type === type.name ? 'selected' : ''}>${type.title}</option>`)}
                    </select>
                ` : ''}
            </div>
        </div>
        ${param.type !== 'array' && param.type !== 'object' ? `
            <div class="settings_item form-group" name="db_field_item">
                <label>Поле таблицы базы данных:</label>
                <div class="setting_field">
                    <select name="db_field" class="form-control">
                        ${dbFields.map(field => `<option value="${field.name}" ${param.field === field.name ? 'selected' : ''}>${field.title}</option>`)}
                    </select>
                </div>
            </div>
        ` : ''}
        
        <div class="settings_buttons">
            <!-- <div name="save" class="btn bg-button btn-primary">Сохранить</div> -->
            <div name="remove" class="btn bg-button btn-danger">Удалить параметр</div>
        </div>
    `

    $settings.insertAdjacentHTML('beforeend', html)

    const typeSelect = $settings.querySelector('.settings_item select[name="type_param"]')

    if ($settings.querySelector('.settings_item input[name="name_param"]')) {
        const nameInput = $settings.querySelector('.settings_item input[name="name_param"]')
        nameInput.addEventListener('change', saveChanges)
    }

    if ($settings.querySelector('.settings_item select[name="db_field"]')) {
        const fieldSelect = $settings.querySelector('.settings_item select[name="db_field"]')
        fieldSelect.addEventListener('change', saveChanges)
    }

    typeSelect.addEventListener('change', (e) => {
        const type = e.target.options[typeSelect.selectedIndex].value

        if (type === 'object' || type === 'array') {
            if ($settings.querySelector('.settings_item[name="db_field_item"]'))
                $settings.querySelector('.settings_item[name="db_field_item"]').remove()

            saveChanges()
            return
        }

        param.field = dbFields[0].name      // поле по-умолчанию

        if (!$settings.querySelector('.settings_item[name="db_field_item"]')) {
            $settings.querySelector('.settings_buttons').insertAdjacentHTML('beforebegin', `
                <div class="settings_item form-group" name="db_field_item">
                    <label>Поле таблицы базы данных:</label>
                    <div class="setting_field">
                        <select name="db_field"  class="form-control">
                            ${dbFields.map(field => `<option value="${field.name}" ${param.field === field.name ? 'selected' : ''}>${field.title}</option>`)}
                        </select>
                    </div>
                </div>
            `)
        }
        saveChanges()
    })

    function saveChanges() {
        const type = typeSelect.options[typeSelect.selectedIndex].value

        const clearChilds = !(param.type === 'array' || param.type === 'object')
        const prevType = param.type
        param.type = type

        if (param.parent.type !== 'array') {
            const name = $settings.querySelector('.settings_item input[name="name_param"]').value
            param.name = name
        }

        if (param.parent.type === 'array') {
            delete param.name
        }

        switch (type) {
            case 'object':
            case 'array': {
                if (clearChilds) param.childs = []
                delete param.field
                break
            }

            case 'number':
            case 'string':
            case 'date': {
                const fieldSelect = $settings.querySelector('.settings_item select[name="db_field"]')
                const field = fieldSelect.options[fieldSelect.selectedIndex].value
                param.field = field

                delete param.childs
            }

            default:
                break;
        }

        if (prevType === 'array' && param.type === 'object') {
            param.childs.forEach((child, i) => child.name = `param${i + 1}`)
        }

        renderParams()
        const output = generateOutput(root)
        console.log(output);
    }

    // $settings.querySelector('.settings_buttons div.btn[name="save"]').addEventListener('click', () => {

    // })

    $settings.querySelector('.settings_buttons div.btn[name="remove"]').addEventListener('click', () => {
        param.parent.childs = param.parent.childs.filter(child => child.id !== param.id)
        renderParams()
        renderEmptySettings()

        const output = generateOutput(root)
        console.log(output);
    })
}

function renderEmptySettings() {
    $settings.innerHTML = ""
    $settings.insertAdjacentHTML('beforeend', `
        <div class="message-box">Выберите параметр для редактирования из панели слева</div>
    `)
}

function generateOutput(root) {
    return root.childs.reduce((prev, cur) => {
        const newOut = {
            type: cur.type
        }

        if (cur.parent.type !== 'array') {
            newOut.name = cur.name
        }

        if (cur.type !== 'array' && cur.type !== 'object') newOut.field = cur.field
        if (cur.type === 'array' || cur.type === 'object') newOut.childs = generateOutput(cur)

        return [...prev, newOut]
    }, [])
}

renderEmptySettings();

function testGetData(){
   var id_webhook = $("#id_webhook").val();
    console.log(id_webhook);
	$.ajax({
			type: "POST",
			url: "/ajax/matcher_api.php",
			data: {'type':'testGetData','id_webhook':id_webhook},
			success: function(json){
				data = $.parseJSON(json);
				$('#result_testJson').html(data.html);
				$('#result_testJson').slideDown();
			}
	});
}

async function handlerSaveConfig() {
	//red_webhook2
	var ars = $("#red_webhook2").serializeArray();
	var id_webhook = $("#id_webhook").val();
    console.log(ars);
    console.log(id_webhook);
	$.ajax({
			type: "POST",
			url: "/ajax/matcher_api.php",
			data: {'type':'SaveConfig','ars':ars,'id_webhook':id_webhook,setparams:generateOutput(root)},
			success: function(json){
				data = $.parseJSON(json);
				$('#mes_warning').slideUp();
				createAlert('Настройки успешно сохранены', 3000)
			}
	});
}

function parseConfig(parent) {
    let output = []

    parent.childs.forEach(item => {
        const newItem = {...item, parent, id: crypto.randomUUID()}

        if (newItem.type === 'array' || newItem.type === 'object') {
            newItem.childs = parseConfig(newItem)
        }

        output = [...output, newItem]
    })

    return output
}

function openAllChilds() {
    const mayOpenObjects = document.querySelectorAll('.params li > ul')
    mayOpenObjects.forEach(ul => ul.closest('li').querySelector('.close_list').click())
}

function ping_add_data(){
	var id_webhook = $("#id_webhook").val();
	if(typeof timerId !== "undefined") clearInterval(timerId);
	$('#modal_activ_ping').modal('show');
	$("#modal_34562").html("Ожидание входящего пакета");
	$("#modal_3456").html('<p>Ожидаем входящий Webhook на url </p><img src="/img/loadinganimation.gif" alt="">');
	$("#result_testJson2").html('');
	var n = 0;
	timerId = setInterval(function() {
		$.ajax({
				type: "POST",
				url: "/ajax/matcher_api.php",
				data: {'type':'ping_add_data','id_webhook':id_webhook,n:n},
				success: function(json){
					data = $.parseJSON(json);
					if(data.status == 'data'){
					   $("#modal_3456").html('Данные получены, перейдите к настройки и сопоставлению масива данных!<img style="width: 258px;" src="/img/checked22.png">');
					   $("#result_testJson2").html(data.html);
                       $("#modal_34562").html("Пакет получен");
						setTimeout(function(){
							$('#modal_activ_ping').modal('hide');
							$('#mes_warning').slideDown();
						}, 2000);
					    clearInterval(timerId);
						root.childs = parseInput($.parseJSON(data.data), root);
						mainConfig.disableParamNameInput = true;
						mainConfig.limitTypes = true;
						renderEmptySettings();
						renderParams();
						openAllChilds();

					}
				}
		});
    n++;
	}, 1000);
}

async function handlerLoadConfig() {
	var id_webhook = $("#id_webhook").val();
	$.ajax({
			type: "POST",
			url: "/ajax/matcher_api.php",
			data: {'type':'get_config','id_webhook':id_webhook},
			success: function(json){
				data = $.parseJSON(json);
				root.childs = data.arrs;
				root.childs = parseConfig(root)
				renderEmptySettings()
				renderParams()

				createAlert('Настройки успешно сохранены', 3000)
			}
	});

}

function createAlert(text, time) {
    const message = document.createElement('div')
    message.className = "message-box"
    message.innerText = text
    $settings.parentElement.querySelector('.config .message_block').innerHTML = ""
    $settings.parentElement.querySelector('.config .message_block').append(message)
    setTimeout(() => {
        message.classList.add('hide')
        setTimeout(() => {
            message.remove()
        }, 550)
    }, time)
}


$settings.parentElement.querySelector('.btn[name="save_to_config"]').addEventListener('click', handlerSaveConfig)
$settings.parentElement.querySelector('.btn[name="load_config"]').addEventListener('click', handlerLoadConfig)
