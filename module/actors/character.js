import { moves } from '../moves/moves.js';

export default class CityCharacterSheet extends ActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['city', 'sheet', 'actor', 'character'],
			template: 'systems/city-of-mist/templates/sheets/character.hbs',
			width: 1024,
			height: 768,
			tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'themes' }]
		});
	}

	/** @override */
	get template() {
		return 'systems/city-of-mist/templates/sheets/character.hbs';
	}

	/** @override */
	getData() {
		const data = super.getData();
		const tags = data.items.filter(i => i.type === 'tag');
		data.actor.themes = data.items.filter(i => i.type === 'theme')
			.map(t => {
				t.weaknesses = [];
				t.powers = [];

				tags.forEach(tag => {
					const data = tag.data;
					if (data.theme === t._id) {
						if (data.type === 'weakness') {
							t.weaknesses.push(tag);
						} else if (data.type === 'power') {
							t.powers.push(tag);
						}
					}
				});

				return t;
			});

		for (let i = data.actor.themes.length; i < 4; i++) {
			data.actor.themes.push({ empty: true });
		}

		data.actor.storyTags = tags.filter(t => t.data.theme === '');
		data.actor.statuses = data.items.filter(i => i.type === 'status');
		data.actor.moves = moves;

		return data;
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		if (!this.options.editable) return;

		html.find('.add-theme').click(this._onCreateTheme.bind(this));
		html.find('.theme-kind').click(this._onThemeChange.bind(this));
		html.find('.theme-type').change(this._onThemeChange.bind(this));
		html.find('.theme-name').change(this._onThemeChange.bind(this));
		html.find('.theme-identity').change(this._onThemeChange.bind(this));
		html.find('.theme-crack').click(this._onThemeChange.bind(this));
		html.find('.theme-attention').click(this._onThemeChange.bind(this));
		html.find('.delete-theme').click(this._onThemeDelete.bind(this));

		html.find('.add-tag').click(this._onCreateTag.bind(this));
		html.find('.delete-tag').click(this._onTagDelete.bind(this));
		html.find('.tag-name').change(this._onTagChange.bind(this));
		html.find('.tag-burn').click(this._onTagChange.bind(this));

		html.find('.add-status').click(this._onCreateStatus.bind(this));
		html.find('.delete-status').click(this._onStatusDelete.bind(this));
		html.find('.status-name').change(this._onStatusChange.bind(this));
		html.find('.status-tier').click(this._onStatusChange.bind(this));

		html.find('.move-roll').click(this._onRoll.bind(this));

		html.find('textarea').each(function () {
			this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
		}).on('input', function () {
			this.style.height = 'auto';
			this.style.height = (this.scrollHeight) + 'px';
		});

		html.find('input[type="text"]').on('keypress', function (event) {
			if (event.keyCode === 13) {
				event.preventDefault();
				return false;
			}

			return true;
		});

		html.find('.edit-item-text-field').click(this._onEditItemTextField.bind(this));
	}

	async _onEditItemTextField(event) {
		event.stopPropagation();
		event.preventDefault();

		const { value, prop, id } = event.currentTarget.dataset;

		this._editTextArea({
			title: event.currentTarget.title,
			value: value,
			callback: async newValue => {
				if (newValue !== '') {
					await this.actor.updateEmbeddedDocuments('Item', [{ _id: id, [prop]: newValue }]);
				}
			},
		});
	}

	async _onTagChange(event) {
		event.preventDefault();
		event.stopPropagation();

		const { prop, id } = event.currentTarget.dataset;

		const item = this.actor.getEmbeddedDocument('Item', id);
		if (!item) return;
		const update = { _id: id };
		switch (prop) {
			case 'name':
				if (event.currentTarget.value !== "") {
					update.name = event.currentTarget.value;
				}
				break;
			case 'burned':
				update['data.burned'] = !item.data.data.burned;
		}

		await this.actor.updateEmbeddedDocuments('Item', [update]);
	}

	async _onTagDelete(event) {
		event.preventDefault();
		event.stopPropagation();

		const { id } = event.currentTarget.dataset;
		return await this.actor.deleteEmbeddedDocuments('Item', [id]);
	}

	async _onCreateTag(event) {
		event.preventDefault();
		const { id, type } = event.currentTarget.dataset;

		let placeholder = 'Nueva etiqueta';
		if (type === 'power') {
			placeholder = 'Nuevo poder';
		} else if (type === 'weakness') {
			placeholder = 'Nueva debilidad';
		}

		this._editTextArea({
			title: placeholder,
			placeholder,
			okLabel: 'Añadir',
			callback: async name => {
				if (name !== '') {
					const itemData = {
						name,
						type: 'tag',
						data: {
							type,
							invoked: false,
							burned: false,
							theme: id,
						},
					};

					await this.actor.createEmbeddedDocuments('Item', [itemData]);
				}
			},
		});
	}

	async _onCreateTheme(event) {
		console.log('create theme');
		event.preventDefault();

		const itemData = {
			name: 'Nuevo tema',
			type: 'theme',
			data: {
				kind: 'logos',
				type: 'Tipo de tema',
				identity: 'Identidad o misterio',
				crack: 0,
				attention: 0,
			},
		};

		console.log('caca');
		const res = await this.actor.createEmbeddedDocuments('Item', [itemData]);
		console.log('created', res);
	}

	async _onThemeChange(event) {
		event.preventDefault();
		event.stopPropagation();

		const { prop, id } = event.currentTarget.dataset;
		const value = event.currentTarget.value || event.currentTarget.dataset.value;

		const item = this.actor.getEmbeddedDocument('Item', id);
		if (!item) return;

		const update = { _id: id };
		switch (prop) {
			case 'name':
				if (value !== "") {
					update.name = value;
				}
				break;
			case 'crack':
			case 'attention':
				let val = Number(value);
				if (!isNaN(val) && val >= 0 && val <= 3) {
					if (val === 1 && item.data.data[prop] === 1) {
						val = 0;
					}

					update[`data.${prop}`] = val;
				}
				break;
			case 'type':
			case 'identity':
				if (value !== "") {
					update[`data.${prop}`] = value;
				}
				break;
			case 'kind':
				update['data.kind'] = item.data.data.kind === 'logos' ? 'mythos' : 'logos';
		}

		await this.actor.updateEmbeddedDocuments('Item', [update]);
	}

	async _onThemeDelete(event) {
		event.preventDefault();
		event.stopPropagation();

		const { id } = event.currentTarget.dataset;
		const tags = this.actor.data.items.filter(i => i.type === 'tag' && i.data.theme === id);

		this._confirmAction(
			'¿Borrar tema?',
			'¿Estás seguro de que deseas borrar este tema?',
			async () => {
				for (let t of tags) {
					await this.actor.deleteEmbeddedDocuments('Item', [t._id]);
				}

				await this.actor.deleteEmbeddedDocuments('Item', [id]);
			},
		);
	}

	async _onCreateStatus(event) {
		event.preventDefault();

		const itemData = {
			name: 'Nuevo estado',
			type: 'status',
			data: {
				tier: 0,
				chips: 0,
				duration: 'temporary',
			},
		};

		return await this.actor.createEmbeddedDocuments('Item', [itemData]);
	}

	async _onStatusChange(event) {
		event.preventDefault();
		event.stopPropagation();

		const { prop, id } = event.currentTarget.dataset;

		const item = this.actor.getEmbeddedDocument('Item', id);
		if (!item) return;
		const update = { _id: id };
		switch (prop) {
			case 'tier':
				const { tier, chips } = event.currentTarget.dataset;
				update['data.tier'] = Number(tier);
				update['data.chips'] = Number(chips) < 0 ? 0 : Number(chips);
				break;
			case 'name':
				const value = event.currentTarget.value;
				if (value !== '') {
					update.name = value;
				}
				break;
			case 'duration':
				item['data.duration'] = item.data.duration === 'temporary' ? 'permanent' : 'temporary';
		}

		await this.actor.updateEmbeddedDocuments('Item', [update]);
	}

	_onStatusDelete(event) {
		event.preventDefault();
		event.stopPropagation();

		const { id } = event.currentTarget.dataset;

		this._confirmAction(
			'¿Borrar estado?',
			'¿Estás seguro de que deseas borrar este estado?',
			async () => {
				await this.actor.deleteEmbeddedDocuments('Item', [id]);
			},
		);
	}

	_onRoll(event) {
		event.preventDefault();
		event.stopPropagation();

		const { move } = event.currentTarget.dataset;
		const template = `
		<form class="city-roll-dialog">
			<p>+1 por cada poder o estado favorable. -1 por cada debilidad o estado desfavorable.</p>
			<div class="city-roll-controls">
				<button class="city-roll-btn down" data-change="-1"><i class="fas fa-minus-square"></i></button>
				<input type="number" class="city-roll-power" value="0" />
				<button class="city-roll-btn up" data-change="1"><i class="fas fa-plus-square"></i></button>
		  	</div>
		</form>`;

		const buttons = {
			draw: {
				icon: '<i class="fas fa-check"></i>',
				label: 'Tirar',
				callback: async (html) => {
					let power = Number(html.find('.city-roll-power').val());
					if (isNaN(power)) {
						power = 0;
					}
					this._roll(move, power);
				}
			},
			cancel: {
				icon: '<i class="fas fa-times"></i>',
				label: 'No tirar',
			}
		}

		new Dialog({
			title: moves.core[move].name,
			content: template,
			buttons: buttons,
			default: 'draw',
			render: (html) => {
				const $power = html.find('.city-roll-power');
				html.find('.city-roll-btn').click(e => {
					e.preventDefault();
					e.stopPropagation();

					let power = Number($power.val());
					if (isNaN(power)) {
						power = 0;
					}

					$power.val(power + Number(e.currentTarget.dataset.change));
				});
			},
		}).render(true);
	}

	_editTextArea({ title, value = '', callback, okLabel = 'Actualizar', placeholder = '' }) {
		const template = `
			<form autocomplete="off">
				<div class="form-group">
					<textarea class="edit-input" placeholder="${placeholder}">${value}</textarea>
				</div>
			</form>`;

		const buttons = {
			ok: {
				icon: '<i class="fas fa-check"></i>',
				label: okLabel,
				callback: async (html) => {
					callback(html.find('.edit-input').val());
				}
			},
			cancel: {
				icon: '<i class="fas fa-times"></i>',
				label: 'Cancelar',
			}
		}

		new Dialog({
			title,
			content: template,
			buttons: buttons,
			default: 'ok',
		}).render(true);
	}

	_confirmAction(title, text, callback) {
		const template = `<p>${text}</p>`;

		const buttons = {
			ok: {
				icon: '<i class="fas fa-check"></i>',
				label: 'Aceptar',
				callback,
			},
			cancel: {
				icon: '<i class="fas fa-times"></i>',
				label: 'Cancelar',
			}
		}

		new Dialog({
			title: title,
			content: template,
			buttons: buttons,
			default: 'ok',
		}).render(true);
	}

	async _roll(move, power) {
		const sign = power >= 0 ? '+' : '';
		const roll = new Roll(`2d6${sign} ${power} `, this.actor.data.data);
		const rollResult = await roll.evaluate();

		let result = '';
		if (rollResult.total >= 10) {
			result = '<div class="city-roll great">¡Gran éxito!</div>';
		} else if (rollResult.total >= 7) {
			result = '<div class="city-roll hit">¡Éxito!</div>';
		} else {
			result = '<div class="city-roll miss">¡Fallo!</div>';
		}

		const m = moves.core[move];

		const msg = `
			<div class="move-title"> ${m.name}</div>
				<div class="move-description">${m.description}</div>
		${result}
		`;

		rollResult.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: this.actor }),
			flavor: msg,
		});
	}

}

export function makeThemeCounter(theme, type) {
	let html = `<div class="theme-counter theme-counter-${type}"><div class="theme-counter-bar">`;
	for (let i = 0; i < 3; i++) {
		const filled = i + 1 <= theme.data[type];
		html += `<button class="theme-${type} ${filled ? 'filled' : ''}" data-id="${theme._id}" data-value="${i + 1}" data-prop="${type}"></button>`;
	}

	let name = 'Atención';
	if (type === 'crack') {
		name = theme.data.kind === 'mythos' ? 'Desvanecimiento' : 'Rotura';
	}

	html += `</div><p class="theme-counter-name">${name}</p></div> `;
	return new Handlebars.SafeString(html);
}

export function makeStatusTier(status) {
	let html = `<div class="status-tiers"> `;
	for (let i = 0; i < 6; i++) {
		html += '<div class="status-tier-group">';
		for (let j = 0; j < i - 1; j++) {
			const filled = status.data.tier > i || (status.data.tier === i && status.data.chips > j);
			html += `<button class="status-tier chip ${filled ? 'filled' : ''}" data-chips="${j + 1}" data-tier="${i}" data-prop="tier" data-id="${status._id}"></button> `;
		}
		const filled = status.data.tier > i;
		html += `<button class="status-tier ${filled ? 'filled' : ''}" data-chips="0" data-tier="${i + 1}" data-prop="tier" data-id="${status._id}"></button> `;
		html += '</div>';
	}
	html += '</div>';
	return new Handlebars.SafeString(html);
}

function updateProp(item, prop, value) {
	let i = item;
	const path = prop.split('.');
	const last = path.pop();
	for (let p of path) {
		i = i[p];
	}
	i[last] = value;
}