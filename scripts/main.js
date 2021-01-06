/*	Constantes y Variables	*/
	//	URLs Conexion	
		const searchURL	= 'https://api.giphy.com/v1/gifs/search';
		const tagsURL	= 'https://api.giphy.com/v1/tags/related/'
		const trendURL 	= 'https://api.giphy.com/v1/gifs/trending';
		const uploadURL = 'https://upload.giphy.com/v1/gifs';
		const apiKey 	= 'LanYkWCgNLIRDm6XZOZWnYH9yZHOProA';
	// 	Parametros
		let url, limit  = 3, offset = 0;
		let total, pages;
		let phase, nextItem;
		let likeHit, downHit, openHit;
/*	Areas de Eventos	*/
	//	menu Hamburguesa
		const menuBtn	= document.querySelector('#menu');
		const menuList	= document.querySelector('.menu');
	//	Formulario de Busqueda
		const frmSearch	= document.querySelector('#search')
		const textField = document.querySelector('#search input')
		const dataList 	= document.querySelector('#suggestion')
	//	Resultados
		const titleArea = document.querySelector('section h1')
		const gifsArea 	= document.querySelector('#results')
		const pageArea 	= document.querySelector('#pagination')
		const trendArea = document.querySelector('#trending');
	//	Crear Gif
		const stageArea	= document.querySelectorAll('#crear_gifo .menu li');
		const gifBtn 	= document.querySelector('#crear_gifo button');
		const gifMedia 	= document.querySelector('#crear_gifo article video');
		const gifView	= document.querySelector('#crear_gifo article img');
		const recAgain	= document.querySelector('#crear_gifo .menu a');
	//	favoritos
		const favArea 	= document.querySelector('#favoritos div');
		const noFavs 	= document.querySelector('#favoritos .noItems')
/*	Funciones y Metodos	*/
	//	Consulta API Giphy
		async function fetchAPI(url, editArea, buildArea) { 
			await fetch(url)
				.then( resultado => resultado.json()
				.then( async giphy => { 
					giphy.pagination ? total = giphy.pagination.total_count : null;
					giphy.data.forEach( item => editArea.innerHTML += buildArea(item) )
					showPages(url, total);
					getItems();
		}	)	)	};
	//	Constructores
		const showGifs = function(item){ return (
			`<article id="${item.id}" class="result">
					<img class="result" 
						src="${item.images.fixed_height_downsampled.webp}" 
						alt="${item.title}"
						title="${item.username}"
						ismap
					/>
					<div class="hidden">
						<p>
							${item.username ? item.username : 'anonymous'}
							<br />
							<strong>${item.title ? item.title : 'untitled'}</strong>
						</p>
						<div class="social">
							<a class="icon fav"></a>
							<a class="icon download"></a>
							<a class="icon max"></a>
						</div>
					<div>
			</article>`
		)	}
		const showOptions = function(item) { return (
			`<option value="${item.name}">
				${item.name}
			</option>`
		)	}
		const showPages = function(url, total){
			if (url.includes('search') && total >= 1) { 
				pageArea.innerHTML =
					`<ul>
						<li><strong>Resultados </strong> ${total}</li>
						<li>
							<strong>Paginas </strong> 
							${ ( actual = (offset / 12) + 1 ) <= (pages = Math.ceil(total / 12)) ? actual : pages } 
							/ ${ pages }
						</li>
					</ul>
					<button class="button">
						${ offset + limit <= total ? `VER MAS...`: `NO HAY MAS RESULTADOS` }
					</button>`

			} else if (url.includes('search')){
				pageArea.innerHTML =
					`<img src="assets/icons/section_no_results.svg" alt="ouch">
					<p class="notFound">intenta con otra busqueda</p>`
			}
		}
		const setPhase = function(type){
			switch(phase){
				case 1:
					startGif();	
					gifBtn.innerHTML = 'Grabar';
					gifMedia.classList.add('show'); 
					gifView.classList.remove('show'); 
					break;
				case 2:
					recGif(); 
					gifBtn.innerHTML = 'Finalizar';
					recAgain.innerHTML = `00:00`;
					break;
				case 3:
					stopGif(); 
					gifBtn.innerHTML = 'Subir';
					gifMedia.classList.toggle('show');
					gifView.classList.toggle('show');
					recAgain.innerHTML = `Repetir Captura`
					break;
				case 4:
					question = confirm('¿deseas subir el GIF?')
						question? uploadGif(): null 		
						gifBtn.innerHTML = 'Comenzar'
						gifMedia.classList.toggle('show'); 
						gifView.classList.toggle('show'); 
						phase = 1;
						type = false;
					break;
			}
			stageArea[phase - 1].classList.add('active')
			switch (type){
				case true:
					phase > 1 ? stageArea[phase - 2].classList.remove('active') : null
					break;
				case false:
					for(i = 0 ; i < stageArea.length; i++){
						stageArea[i].classList.remove('active');
					}
					stageArea[phase - 1].classList.add('active');
					break;
			}
		}
	//	Menu hamburguesa
		menuBtn.addEventListener( 'click', () => { 
			menuList.classList.toggle('open');
			menuList.classList.contains('open')? menuBtn.innerHTML = '&times;' : menuBtn.innerHTML = '&equiv;';
		}	);
	//	Definicion Cookies
		var setCookie = function(item){
			document.cookie = `${item.id} = ${item.images.fixed_height_downsampled.webp}; Max-Age=2600000; Secure`; 
		};
	//	Elementos Populares
		window.addEventListener( 'load', () => { 
			url = `${trendURL}?api_key=${apiKey}&limit=${limit}&rating=g`;
			fetchAPI(url, trendArea, showGifs);
		}	)
	// 	Elementos Favoritos
		function favLoad(){
			if(localStorage.length < 1){
				noFavs.innerHTML = `
					<img src="assets/icons/section_no_favs.svg" alt="ouch">
					<p class="notFound special">
						"¡guarda tu primer Gifo en favoritos
						para que se muestre aqui!"
					</p>`
			} else {
				for ( i = 0; i < localStorage.length; i++ ){  
		  			favGif = localStorage.key(i);
		  			item = JSON.parse(localStorage.getItem(favGif));
		 			favArea.innerHTML += `
		 				<article id="fav_${favGif}">
						<img class="favorite" 
							src="${item.img}"
							title="${item.username}" 
							alt="${item.title}"
							ismap />
						<div class="hidden">
							<p>
								${item.username ? item.username : 'anonymous'}
								<br />
								<strong>${item.title ? item.title : 'untitled'}</strong>
							</p>
							<div class="social">
								<a class="icon fav active"></a>
								<a class="icon download"></a>
								<a class="icon max"></a>
							</div>
						<div>
						</article>`
		 			document.getElementById(favGif) ? favImg = document.getElementById(favGif).querySelector('img') : favImg = false;
		 			document.getElementById(favGif) ? favIco = document.getElementById(favGif).querySelector('.fav') : favIco = false;
		 			if(favImg && favIco){
		 				favImg.classList.add('active');
		 				favIco.classList.add('active')
		 			}
			}}
			
		}
	//	Elementos Usuario
	//	Sugerencias de Busqueda 
		textField.addEventListener(
			'input', () => {
				if(textField.checkValidity()){
					termino = textField.value;
					url = `${tagsURL}${termino}?api_key=${apiKey}&lang=es`;
					dataList.innerHTML = ``;
					fetchAPI(url, dataList, showOptions);
		}	}	)	;
		dataList.addEventListener(
			'click', () => {
				textField.value = dataList.value 
				textField.focus()
		}	)
	//	Resultados Busqueda
		frmSearch.addEventListener( 'submit', (e) => {
			e.preventDefault();
			limit = 12;
			offset = 0;
			termino = textField.value;
			url = `${searchURL}?api_key=${apiKey}&q=${termino}&limit=${limit}&offset=${offset}&rating=g&lang=es`
			gifsArea.innerHTML = ``;
			fetchAPI(url, gifsArea, showGifs);
			titleArea.innerHTML = termino;
		}	)
	//	Cargar Paginas
		pageArea.onsubmit =  (e) => {
			e.preventDefault();
			offset = offset + 12;
			url = `${searchURL}?api_key=${apiKey}&q=${termino}&limit=${limit}&offset=${offset}&rating=g&lang=es`
			fetchAPI(url, gifsArea, showGifs);

		}
	//	Creacion de Gifs
		recAgain.addEventListener( 'click', () => {
			phase = 1;
			setPhase(false);
		}	)
		gifBtn.addEventListener( 'click', () => {
			phase < 4 ? phase = phase + 1: phase = 1;
			setPhase(true);
		}	)
/*	Funciones asincronas	*/
	// 	Consultar Webcam
		async function startGif() {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: { max: 480 }
			}	);
			gifMedia.srcObject = stream;
			await gifMedia.play();
		}
	//	Comenza Grabacion
		async function recGif() {
			const stream = gifMedia.srcObject;
			videoRecorder = new RecordRTCPromisesHandler(stream, {
				type: "video",
				mimeType: "video/webm; codecs=vp8",
				disableLogs: true,
				videoBitsPerSecond: 128000,
				frameRate: 30,
				quality: 10,
				width: 480,
				hidden: 240
			});
			gifRecorder = new RecordRTCPromisesHandler(stream, {
				disableLogs: true,
				type: "gif",
				frameRate: 1,
				quality: 10,
				width: 360,
				hidden: 240
			});
			await videoRecorder.startRecording();
			await gifRecorder.startRecording();
			videoRecorder.stream = stream;
		}
	// 	Detener Grabacion
		async function stopGif() {
		//	Carga de Contenido
			await videoRecorder.stopRecording();
			await gifRecorder.stopRecording();
			const videoBlob = await videoRecorder.getBlob();
			const gifBlob = await gifRecorder.getBlob();
		// 	Formato de Salida
			gifMedia.src = URL.createObjectURL(videoBlob);
			videoRecorder.stream.getTracks().forEach(t => t.stop());
			gifMedia.srcObject = null;
		// 	Reiniciar Parametros
			await videoRecorder.reset();
			await videoRecorder.destroy();
			await gifRecorder.reset();
			await gifRecorder.destroy();
		//	Limpieza de Contenido
			gifSrc = await gifBlob;
			gifView.src = URL.createObjectURL(await gifBlob);
			gifRecorder = null;
			videoRecorder = null;
		}
	//	Subir Gif Animado
		async function uploadGif() {
		//	Iniciando Carga
			console.log("***comenzando subida***");
			const formData = new FormData();
			formData.append("file", gifSrc, "myGif.gif");
				const params = {
					method: "POST",
					body: formData,
					json: true
			};
		// Consulta URL Subida
			const data = await fetchURL(`${uploadURL}?api_key=${apiKey}`, params);
			console.log(await data);
			console.log("***subida exitosa***");
			return await data;
		}
	//	Consulta API Giphy - UserId
		async function fetchURL(url, params = null) {
			try {
				const fetchData = await fetch(url, params);
				const response = await fetchData.json();
				return response;
			} catch (error) {
				if (error.name !== "AbortError") {
					console.log("Error al obtener resultados");
				}
				return error;
			};
		};
/* 	Acciones del Usuario */
	//	Elementos Utilizables
		var getItems = function(){
			likeHit = document.querySelectorAll('.result + .hidden .fav');
			downHit = document.querySelectorAll('.result + .hidden .download');
			openHit = document.querySelectorAll('.result + .hidden .max');
			userAction();
		}
	//	Botones de Accion
		var userAction = function (){
		//	Like Button
			likeHit.forEach( (like , i) => like.addEventListener( "click", () => { 
				artKey = document.querySelectorAll('article.result')[i];
				item = document.querySelectorAll('img.result')[i];
				artKey.id.includes('fav_') ? key = artKey.id.slice(4) : key = artKey.id;
				like.classList.toggle('active');
				like.classList.contains('active') ? 	
					window.localStorage.setItem( key , JSON.stringify( {
						'img': item.src, 
						'username': item.title, 
						'title': item.alt
					}	)	) : ( window.localStorage.removeItem( key )
					)
				favArea.innerHTML = ``;
				noFavs.innerHTML = ``;
				favLoad()
				}	)	);
		//	Download Button
			downHit.forEach( (down , i) => down.addEventListener( "click", () => {
				item = document.querySelectorAll('img.result')[i].src
				a = document.createElement('a');
				a.download = true;
				a.target = '_blank';
				a.href= item;
				a.click();
			}	)	)
		//	Open Button
			openHit.forEach( open => open.addEventListener("click", () => {	
				alert('vas a maximizar')
			}	)	)	
			favLoad();
		}