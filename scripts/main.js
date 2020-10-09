/*Responsive Web Design*/
	//Validacion de Formularios
		let contactFields = [
			'contactName',
			'contactLastname',
			'contactEmail',
			'contactPhone',
			'contactConsult'
		]
		
		contactFields.map( field =>{
			document.getElementById(field).addEventListener(
				'input', () =>{
					if(document.getElementById(field).checkValidity()){
						document.getElementById(field).classList.add('is-valid');
						document.getElementById(field).classList.remove('is-invalid');	
					} else {
						document.getElementById(field).classList.add('is-invalid');
						document.getElementById(field).classList.remove('is-valid');	
					}
				}
			)
		} )
	//Menu Desplegable
		let openMenu = true;
		document.querySelector('#menu').addEventListener(
			'click', () => {
				document.querySelector('.menu').classList.toggle('openMenu');
				if (openMenu) {
					document.querySelector('#menu').innerHTML = '&times;'
					openMenu = false;
				} else {
					document.querySelector('#menu').innerHTML = '&equiv;'
					openMenu = true;
				}
			}
		);
/*Autor: Cristian Racedo*/