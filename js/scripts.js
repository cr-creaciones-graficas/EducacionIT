/*Menu Hamburguesa*/
	document.querySelector('#menu').addEventListener(
		'click', () => { document.querySelector('.menu').classList.toggle('openMenu');
			if(document.querySelector('.menu').classList.contains('openMenu')){
				document.querySelector('#menu').innerHTML = '&times;'
			} else {
				document.querySelector('#menu').innerHTML = '&equiv;'
			}
		}
	)
/*Imagenes Lightbox*/
	document.querySelectorAll('figure div').forEach( 
		item => item.addEventListener('click', () => item.classList.toggle('fixed'))
	);