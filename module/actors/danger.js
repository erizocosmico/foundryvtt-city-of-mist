export default class CityCharacterSheet extends ActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['city', 'sheet', 'actor', 'danger'],
			template: 'systems/city-of-mist/templates/sheets/danger.hbs',
			width: 500,
			height: 620,
		});
	}

	/** @override */
	get template() {
		return 'systems/city-of-mist/templates/sheets/danger.hbs';
	}

	/** @override */
	getData() {
		const data = super.getData();

		data.actor.spectrums = data.items.filter(i => i.type === 'spectrum');
		const moves = data.items.filter(i => i.type === 'move');
		data.actor.moves = {
			soft: moves.filter(m => m.data.type === 'soft'),
			hard: moves.filter(m => m.data.type === 'hard'),
			custom: moves.filter(m => m.data.type === 'custom'),
		};
		data.actor.statuses = data.items.filter(i => i.type === 'status');

		return data;
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		if (!this.options.editable) return;

		html.find('.add-spectrum').click(this._onCreateSpectrum.bind(this));
		html.find('.add-description').click(this._onEditDescription.bind(this));
		html.find('.danger-description').click(this._onEditDescription.bind(this));
		html.find('.add-move').click(this._onCreateMove.bind(this));
		html.find('.delete-item').click(this._onDeleteItem.bind(this));
		html.find('.add-status').click(this._onCreateStatus.bind(this));
		html.find('.status-name').change(this._onStatusChange.bind(this));
		html.find('.status-tier').click(this._onStatusChange.bind(this));

		html.find('input[type="text"]').on('keypress', function (event) {
			if (event.keyCode === 13) {
				event.preventDefault();
				return false;
			}

			return true;
		});
	}

	async _onEditDescription(event) {
		event.preventDefault();
		event.stopPropagation();

		console.log(this.actor.data);

		this._showForm({
			title: 'Editar descripción',
			fields: {
				description: {
					label: 'Descripción',
					type: 'textarea',
					value: this.actor.data.data.description,
				},
			},
			callback: async (desc) => {
				const actorData = duplicate(this.actor);
				actorData.data.description = desc;
				this.actor.update(actorData);
			}
		});
	}

	async _onCreateSpectrum(event) {
		event.preventDefault();
		event.stopPropagation();

		this._showForm({
			title: 'Crear espectro',
			fields: {
				name: {
					label: 'Nombre del espectro'
				},
				value: {
					label: 'Rango',
					type: 'number',
					value: 0
				}
			},
			callback: async (name, value) => {
				const spectrum = {
					name,
					type: 'spectrum',
					data: { value: Number(value) },
				};

				await this.actor.createEmbeddedDocuments('Item', [spectrum]);
			}
		});
	}

	async _onCreateMove(event) {
		event.preventDefault();
		event.stopPropagation();

		const { type } = event.currentTarget.dataset;

		this._showForm({
			title: 'Crear movimiento',
			fields: {
				description: {
					label: 'Descripción',
					type: 'textarea'
				},
				...(type === 'custom' && {
					name: { label: 'Nombre' }
				})
			},
			callback: async (description, name = '') => {
				const move = {
					name: name || description,
					type: 'move',
					data: { type, description },
				};

				await this.actor.createEmbeddedDocuments('Item', [move]);
			}
		});
	}

	async _onDeleteItem(event) {
		event.preventDefault();
		event.stopPropagation();

		const { id } = event.currentTarget.dataset;
		await this.actor.deleteEmbeddedDocuments('Item', [id]);
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
				update['data.duration'] = item.data.data.duration === 'temporary' ? 'permanent' : 'temporary';
		}

		await this.actor.updateEmbeddedDocuments('Item', [update]);
	}

	_showForm({ title, fields, callback }) {
		let template = '<form autocomplete="off">';
		for (let k in fields) {
			const { type = 'text', label, value = '' } = fields[k];
			let input;
			if (type === 'textarea') {
				input = `<textarea class="${k}" name="${k}" placeholder="${label}">${value}</textarea>`;
			} else {
				input = `<input type="${type}" class="${k}" name="${k}" placeholder="${label}" value="${value}" />`;
			}

			template += `
			<div class="form-group">
				<label for="${k}">${label}</label>
				${input}
			</div>
			`;
		}
		template += '</form>';

		const buttons = {
			ok: {
				icon: '<i class="fas fa-check"></i>',
				label: 'Aceptar',
				callback: async (html) => {
					let args = [];

					for (let k in fields) {
						args.push(html.find(`form .${k}`).val());
					}

					callback(...args);
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

}