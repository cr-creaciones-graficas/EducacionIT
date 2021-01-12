/*	Constantes y Variables	*/
	//	URLs Conexion	
		const searchURL	= 'https://api.giphy.com/v1/gifs/search';
		const tagsURL	= 'https://api.giphy.com/v1/tags/related/'
		const trendURL 	= 'https://api.giphy.com/v1/gifs/trending';
		const uploadURL = 'https://upload.giphy.com/v1/gifs';
		const idURL		= 'https://api.giphy.com/v1/gifs/'
		const apiKey 	= 'LanYkWCgNLIRDm6XZOZWnYH9yZHOProA';
	// 	Parametros
		let url, limit  = 3, offset = 0, phase;
		let total, pages, msg = 'favs';
		let m = 0, s = 0;
		let likeHit = [], openHit = [], nowItem;
		let totalGifs = [], totalFavs = []
/*	Areas de Eventos	*/
	//	Elementos de Navegacion
		const menuBtn	= document.querySelector('#menu');
		const menuList	= document.querySelector('.menu');
		const menuItem	= document.querySelectorAll('.menu li');
		const prevItem	= document.querySelector('section:last-child > .prev');
		const nextItem	= document.querySelector('section:last-child > .next');
	//	Formulario de Busqueda
		const frmSearch	= document.querySelector('#search')
		const textField = document.querySelector('#search input')
		const dataList 	= document.querySelector('#suggestion')
	//	Area de Resultados
		const titleArea = document.querySelector('section h1')
		const gifsArea 	= document.querySelector('#results')
		const pageArea 	= document.querySelector('#pagination')
		const trendArea = document.querySelector('#trending');
	//	Seccion de Grabacion
		const stageArea	= document.querySelectorAll('#crear_gifo .menu li');
		const gifBtn 	= document.querySelector('#crear_gifo button');
		const gifMedia 	= document.querySelector('#crear_gifo article video');
		const gifView	= document.querySelector('#crear_gifo article img');
		const recAgain	= document.querySelector('#crear_gifo .menu a');
	//	Seccion de Favoritos
		const favArea 	= document.querySelector('#favoritos div');
		const noFavs 	= document.querySelector('#favoritos .noItems');
	//	Seccion mis Gifos
		const myGifs	= document.querySelector('#mis_gifos div')
		const noGifs	= document.querySelector('#mis_gifos .noItems')
/*	Funciones y Metodos	*/
	//	Consulta API Giphy
		async function fetchAPI(url, editArea, buildArea, type = 'result') { 
			fetch(url).then( response => response.json()
				.then( async giphy => { 
					giphy.pagination ? total = giphy.pagination.total_count : null;
					giphy.data.forEach( item => editArea.innerHTML += buildArea(item, type) )
					showPages(url, total);
					loadStorage();
					userActions();
		}	)	)	};
	//	Constructores
		//	Resultados de Busqueda
			const showGifs = (item, type) => (
				`<article id="${type == 'result' ? item.id : type + item.id}" 
					class="${type == 'fav_' ? 'favorite' : type == 'gif_' ? 'mygifo' : 'result'}">
					<img class="${type == 'fav_' ? 'favorite' : type == 'gif_' ? 'mygifo' : 'result'}" 
						src="${ item.images.fixed_height_downsampled.url }" 
						alt="${ item.title }"
						title="${ item.username }"
					ismap />
					${showActions(item, type)}
				</article>`
			);
			const showActions = (item, type) => (
				`<div class="hidden">
					<p>
						${item.username ? item.username : 'anonymous'}
						<br />
						<strong>${item.title ? item.title : 'untitled'}</strong>
					</p>
					<div class="social">
						<a class="icon${ type == 'gif_' ? ' trash' : 
							type == 'fav_' ? ' fav active' : ' fav'}">
						</a>
						<a href="${item.img ? item.img : item.images.fixed_height.url}" 
							class="icon download" target="_blank" download>
						</a>
						<a class="icon max"></a>
					</div>
				</div>`
			)
			const showPages = (url, total) => {
				if (url.includes('search') && total >= 1) { 
					pageArea.innerHTML =
						`<ul>
							<li><strong>Resultados</strong>${total}</li>
							<li>
								<strong>Paginas</strong> 
								${ ( actual = (offset / 12) + 1 ) <= (pages = Math.ceil(total / 12)) ?actual : pages } / ${ pages }
							</li>
						</ul>
						<button class="button">
							${ offset + limit <= total ? "VER MAS...": "NO HAY MAS RESULTADOS" }
						</button>`
				} else if (url.includes('search')){
					noResults(pageArea, 'results');
				}
			}
		//	Consejos y Sugerencias
			const showOptions = (item) => (
				`<option value="${item.name}">
					${item.name}
				</option>`
			);	
			const noResults = (editArea, icon) =>{
				switch(icon){
					case 'favs': 
						msg = `"¡guarda tu primer Gifo en favoritos <br/> para que se muestre aqui!"`; 
					break;
					case 'results': 
						msg = `"intenta con otra busqueda"`; 
					break; 
					case 'gifs': 
						msg = `"Animate a crear tu primer GIFO"`; 
					break;
				}
				editArea.innerHTML = `
					<img src="assets/icons/section_no_${icon}.svg" alt="ouch">
					<p class="notFound special">${msg}</p>`
			}
		//	Cronometro
			const timeStart = () => {
				clock();
				recTime = setInterval( clock , 999 );
			}
			const clock = () => {
			    var mAux, sAux;
			    s++;
			    if(s > 59){ m++; s=0 }
			    s < 10 ? sAux = "0" + s : sAux=s;
			    m < 10 ? mAux = "0" + m : mAux=m;
			    recAgain.innerHTML = `${mAux}:${sAux}`
			}
			const timeStop = () => {
				clearInterval(recTime);
				m = 0; s = 0;
			    recAgain.innerHTML = `Repetir Captura`
			}
		//	Creacion de Gif	
			const setPhase = (type) => {
				//	Etapas de Grabacion
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
							timeStart();
							break;
						case 3:
							stopGif(); 
							gifBtn.innerHTML = 'Subir';
							gifMedia.classList.toggle('show');
							gifView.classList.toggle('show');
							timeStop();
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
				//	Asignacion de Clases
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
	//	Barra de Navegacion	
		//	Menu hamburguesa
			menuBtn.addEventListener( 'click', () => { 
				menuList.classList.toggle('open');
				menuList.classList.contains('open')? menuBtn.innerHTML = '&times;' : menuBtn.innerHTML = '&equiv;';
			}	);
		//	Item Activo
			menuItem.forEach( (item, i) => item.addEventListener(
				'click', () => {
					for(li = 1 ; li < menuItem.length; li++){
						li === i ? menuItem[li].classList.toggle('active') : menuItem[li].classList.remove('active');
			}	}	)	)
	//	Elementos Populares
		window.addEventListener( 'load', () => { 
			url = `${trendURL}?api_key=${apiKey}&limit=${limit}&rating=g`;
			fetchAPI(url, trendArea, showGifs);
		}	)
	// 	Elementos Guardados
		const loadStorage = () =>{
			favArea.innerHTML = ``; 
			myGifs.innerHTML = ``;
			if(localStorage.length != 0){
				totalGifs = [];
				totalFavs = [];
				for ( i = 0; i < localStorage.length; i++ ){  
			  		id = localStorage.key(i);
			  		item = JSON.parse(localStorage.getItem(id));
			  		if (id.includes('gif_')) {
			  			totalGifs.push(id);
			  			myGifs.innerHTML += showGifs(item, 'gif_')
			  		}
			  		if (id.includes('fav_')){
			  			totalFavs.push(id);
				  		favArea.innerHTML += showGifs(item, 'fav_');
			}	}	} 	 
			totalGifs.length == 0 ? noResults(noGifs, 'gifs') : noGifs.innerHTML = ``;
			totalFavs.length == 0 ? noResults(noFavs, 'favs') : noFavs.innerHTML = ``;
			
			likeHit = document.querySelectorAll('.fav');
			binHit	= document.querySelectorAll('.trash')
			openHit = document.querySelectorAll('.max');
			}
		//	Agregar Item
			const addStorage = async (id, type) => {
				const response = await fetchURL(`https://api.giphy.com/v1/gifs/${id}?api_key=${apiKey}`);
				const data = JSON.stringify(response.data);
				localStorage.setItem(type + id, data);
				return loadStorage();
			} 
		//	Remover Item
			const remStorage = (id) => {
				window.localStorage.removeItem( id );
				return loadStorage()
			}
	//	Elementos del Usuario
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
				frmSearch.querySelector('button').click()
				textField.focus();
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
			offset += 12;
			url = `${searchURL}?api_key=${apiKey}&q=${termino}&limit=${limit}&offset=${offset}&rating=g&lang=es`
			fetchAPI(url, gifsArea, showGifs);
		}
	/*Creacion de Gifs*/
		// 	Proceso de Grabacion
			recAgain.addEventListener( 'click', () => {
				phase = 1;
				setPhase(false);
			}	)
			gifBtn.addEventListener( 'click', () => {
				phase < 4 ? phase++ : phase = 1;
				setPhase(true);
			}	)
		// 	Consultar Webcam
			async function startGif() {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: false,
					video: { max: 480 }
				}	);
				gifMedia.srcObject = stream;
				await gifMedia.play();
			}
		//	Comenzar Grabacion
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
					width: 480,
					hidden: 240
				});
				await videoRecorder.startRecording();
				await gifRecorder.startRecording();
				videoRecorder.stream = stream;
			}
		// 	Detener Grabacion
			async function stopGif() {
			//	Carga de contenido
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
			//	Limpieza de contenido
				gifSrc = await gifBlob;
				gifView.src = URL.createObjectURL(await gifBlob);
				gifRecorder = null;
				videoRecorder = null;
			}
		//	Subir Grabacion
			async function uploadGif() {
			//	Iniciando Carga
				alert("***comenzando subida***");
				const formData = new FormData();
				formData.append("file", gifSrc, "api_Gifo.gif");
					const params = {
						method: "POST",
						body: formData,
						json: true
				};
			// 	Consulta URL Subida
				const data = await fetchURL(`${uploadURL}?api_key=${apiKey}`, params);
				console.log(await data);
				alert("***subida exitosa***");
				id = data.data.id;
				item = data.data;
				addStorage(id, 'gif_');
				}
		//	Consulta API - Gif_Id
			const fetchURL = async(url, params = null) => {
				const fetchData = await fetch(url, params);
				const response = await fetchData.json();
				return response		
			};
/* 	Acciones del Usuario */
	//	Botones de Accion
		const userActions = () => {			
			likeHit.forEach( (like) => like.addEventListener( 'click', () => { 
				totalItems(like);
				box.parentNode.parentNode.id == 'favoritos' ? location.reload() : null
				box.id.includes('fav_') ? remStorage(id) : 
				localStorage.getItem('fav_'+ box.id) ? remStorage('fav_' + box.id) : 
					addStorage(box.id, 'fav_');
				like.classList.toggle('active');
			}	)	)
			binHit.forEach( bin => bin.addEventListener( 'click', () => {
				totalItems(bin);
				box.parentNode.parentNode.id == 'mis_gifos' ? location.reload() : null
				remStorage(box.id)
			}	)	)	
			openHit.forEach( open  => open.addEventListener('click', (e) => {	
				totalItems(open);
				box.classList.toggle('active');
				open.classList.toggle('max');
				open.classList.toggle('close');
				prevItem.classList.toggle('selected');
				nextItem.classList.toggle('selected');
			}	)	)
		}
		const totalItems = (param) => { 
			box = param.parentNode.parentNode.parentNode
			item = param.parentNode.parentNode.parentNode.querySelector('img');
		}

		nextItem.addEventListener('click', () => changeItem(nextItem,true));
		prevItem.addEventListener('click', () => changeItem(prevItem,false));

		const changeItem = (item, type) => {
			nowItem = document.querySelector('article.active');
			nowItem ? null : 
				document.querySelector('article.selected') ? 
					nowItem = document.querySelector('article.selected') :
					nowItem = document.querySelector('section:last-child article');
			firstItem = nowItem.parentNode.firstElementChild;
			lastItem  = nowItem.parentNode.lastElementChild;
			switch(type){
				case true:
					nowItem == lastItem ? 
						newItem = firstItem : 
						newItem = nowItem.nextElementSibling;
				break;
				case false:
					nowItem == firstItem ? 
						newItem = lastItem : 
						newItem = nowItem.previousElementSibling;
				break;
			}	
			if(item.classList.contains('selected')){
				nowItem.querySelector('.close').classList.add('max');
				nowItem.querySelector('.max').classList.remove('close');
				newItem.querySelector('.max').classList.add('close');
				newItem.querySelector('.close').classList.remove('max');
				nowItem.classList.remove('active');
				newItem.classList.add('active');
			} else {
				nowItem.classList.contains('selected') ?
					newItem.classList.toggle('selected') :
					nowItem.classList.toggle('selected');
				newItem.classList.contains('selected') ?
					nowItem.classList.remove('selected') : null
			}
		}