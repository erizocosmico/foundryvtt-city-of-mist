export const moves = {
	core: {
		convince: {
			name: 'Convencer',
			shortDescription: 'Hacer que alguien haga algo que no quiere',
			description: `
			<p>Cuando usas tus habilidades <strong>para hablar, amenazar o seducir a alguien para hacer algo</strong>, tira + Poder. Al tener éxito escoge un estado relevante con rango=Poder. El objetivo puede elegir aceptar el estado o:<p>
			<ul>
				<li>con un 7-9, ceder un poco, pero proteger sus propios intereses.</li>
				<li>con un 10+, cambiar sus planes para incluir los tuyos, por ahora al menos.</li>
			</ul>
			`,
		},
		changeGame: {
			name: 'Cambiar el juego',
			shortDescription: 'Dar una ventaja o quitar desventaja',
			description: `
			<p>Cuando usas tus habilidades <strong>para darte a ti o a tus aliados una ventaja</strong>, tira+Poder. Al tener éxito obtienes Gasolina = Poder. Gasta tu Gasolina para ganar los siguientes efectos, punto a punto:</p>
			<ul>
				<li>Crear una tag de historia</li>
				<li>Quemar una tag de poder o una tag de historia</li>
				<li>Dar o reducir un estado (un rango por punto de Gasolina)</li>
			</ul>
			<p>Con un 10+ obtienes un mínimo de 2 de Gasolina y puedes usarla para escoger:</p>
			<ul>
				<li>Escalar los efectos (más área o más objetivos)</li>
				<li>Prolongar el efecto (hacerlo duradero)</li>
				<li>Ocultar el efecto</li>
				<li>Cualquier otra mejora que tú y el MC acordéis</li>
			</ul>
			`,
		},
		faceDanger: {
			name: 'Enfrentarse al peligro',
			shortDescription: 'Evitar peligro o resistir una influencia maligna',
			description: `
			<p>Cuando usas tus habilidades <strong>para evitar un golpe, soportar el daño, resistir una influencia maligna o mantener la calma</strong>, el MC (o jugador) elegirá un estado con su rango. Tira + Poder. Con un 10+ evitas el efecto y no recibes el estado. Con un 7-9 obtienes el estado pero con -1 rango. Si fallas, recibes el estado completo.</p>
			`,
		},
		goToeToToe: {
			name: 'Ir cara a cara',
			shortDescription: 'Pelear con alguien por el control de algo',
			description: `
			<p>Cuando usas tus habilidades para vencer a alguien o a algo en una lucha por el control, explica cual es tu objetivo. Tu oponente puede describir cómo responde. Tira + Poder. Con un 7-9 elige 1. Con un 10+ elige 2:</p>
			<ul>
				<li>Consigues tu objetivo, por ejemplo: conseguir algo que tu adversario tiene.</li>
				<li>Le das una buena, dando a tu oponente un estado con rango=Poder.</li>
				<li>Bloqueas, esquivas o contrarrestas sus intentos. Si no escoges esta, pueden imponerte un estado. Si es un jugador, el rango=su Poder.</li>
			</ul>
			`,
		},
		hitWithAll: {
			name: 'Ir con todo',
			shortDescription: 'Herir a alguien con todo lo que tienes',
			description: `
			<p>Cuando tienes un tiro limpio y usas tu habilidad para golpear a alguien o algo con todo lo que tienes tira + Poder. Con un éxito le das al objetivo el estado apropiado de tu elección con rango=Poder.</p>
			<p>Con un 10+ elige 2. Con un 7-9 elige 1:</p>
			<ul>
				<li>Te pones a cubierto o aseguras una posición ventajosa. Si no eliges esta pueden imponerte un estado. Si es un jugador el rango=su Poder.</li>
				<li>Le das una buena o a varios de ellos (+1 rango).</li>
				<li>Controlas el daño colateral.</li>
				<li>Mantienes la atención del objetivo, si es posible.</li>
				<li>Obtienes la ventaja. Obtén 1 Gasolina (para usar como si de Cambiar el Juego se tratase).</li>
			</ul>
			`,
		},
		investigate: {
			name: 'Investigar',
			shortDescription: 'Obtener respuestas o información útil',
			description: `
			<p>Cuando usas tus habilidades para buscar respuestas tira + Poder. Con un éxito obtienes Pistas = Poder. Gasta tus Pistas una a una haciendo preguntas al MC sobre el tema de tu investigación o pregunta a otro jugador alguna pregunta relevante sobre su personaje. Deben darte una respuesta directa o una pista sólida. Con un 7-9 pueden elegir 1:</p>
			<ul>
				<li>Tu investigación te expone a un peligro.</li>
				<li>Las pistas que obtienes son incompletas, medio falsas medio verdaderas o difusas.</li>
				<li>Pueden hacerte una pregunta también. Respondes en los mismos términos.</li>
			</ul>
			`,
		},
		sneakAround: {
			name: 'Ir a hurtadillas',
			shortDescription: 'Actuar discretamente o engañosamente',
			description: `
			<p>Cuando usas tus habilidades para actuar secretamente o engañosamente tira + Poder. Con un éxito cualquiera que pueda tragárselo lo hace. Con un 7-9 la cosa se complica. El MC elige 1:</p>
			<ul>
				<li>Alguien poco importante te ha detectado, ¿pero eso acaba de hacerles importantes, no?</li>
				<li>Eres detectado solamente mediante un sentido secundario (alguien capta tu olor, eres visto susurrando un mensaje pero no se oye el mensaje).</li>
				<li>Debes dejar atrás algo importante o ser descubierto.</li>
			</ul>
			`,
		},
		takeRisk: {
			name: 'Tomar un riesgo',
			shortDescription: 'Llevar a cabo una proeza atrevida',
			description: `
			<p>Cuando llevas a cabo una proeza atrevida, arriesgada o directamente estúpida tira + Poder. Con un 10+ de alguna forma lo consigues. Con un 7-9 las cosas se ponen feas. El MC te ofrecerá un trato duro o una elección desgradable.</p>`,
		},
	}
}