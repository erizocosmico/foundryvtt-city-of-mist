export class CityItem extends Item {
}

export class CityItemSheet extends ItemSheet {
	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['city', 'sheet', 'item'],
			width: 520,
			height: 480,
		});
	}

	/** @override */
	get template() {
		return `systems/city-of-mist/templates/items/item.hbs`;
	}

	/** @override */
	getData() {
		const data = super.getData()
		return data;
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) return;
	}
}
