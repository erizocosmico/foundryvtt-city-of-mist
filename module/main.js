import CityActor from './actors/actor.js';
import CityCharacterSheet, { makeThemeCounter, makeStatusTier } from './actors/character.js';
import CityDangerSheet from './actors/danger.js';
import { CityItem, CityItemSheet } from './items/items.js';

Hooks.once('init', async function () {
	CONFIG.Actor.documentClass = CityActor;
	CONFIG.Item.documentClass = CityItem;

	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("city", CityCharacterSheet, {
		types: ["character"],
		makeDefault: true,
		label: "Personaje",
	});
	Actors.registerSheet("city", CityDangerSheet, {
		types: ["danger"],
		makeDefault: true,
		label: "Peligro",
	});
	/*Actors.registerSheet("city", CityCrewSheet, {
		types: ["crew"],
		makeDefault: true,
		label: "Banda",
	});*/

	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("city", CityItemSheet, {
		makeDefault: true,
	});
});

Handlebars.registerHelper('safeHTML', html => new Handlebars.SafeString(html));
Handlebars.registerHelper('isEmpty', x => (x || '').length === 0);
Handlebars.registerHelper('makeThemeCounter', makeThemeCounter);
Handlebars.registerHelper('makeStatusTier', makeStatusTier);
Handlebars.registerHelper('eq', (a, b) => a == b);
Handlebars.registerHelper('neq', (a, b) => a != b);