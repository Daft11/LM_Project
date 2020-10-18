window.onload = () => {
	const filter_btn = document.getElementById('filter_btn');
	const slideBar = document.getElementById('slideBar');
	choiceBox.linkButton();
	filter_btn.addEventListener('click', filterObj.openFilters);
	filterObj.getMaterialsIds().forEach((e,i) => {
		e = document.getElementById(e);
		e.addEventListener('click', function(event) {
			let sortCovers = filterObj.getSortCovers()
			if (event.target.checked === true) {
				sortCovers[i].forEach(element => document.getElementById(element).checked = true);
			} else {
				sortCovers[i].forEach(element => document.getElementById(element).checked = false);
			}
		});
	});
}

const filterObj = {
//array of all items to filter==============================================
	itemsArray: [
		{ idFacade: 'resh_blue', idMaterial: 'mdf', idCover: 'pet' },
		{ idFacade: 'resh_white', idMaterial: 'mdf', idCover: 'pet' },
		{ idFacade: 'berlin', idMaterial: 'mdf', idCover: 'pvh' },
		{ idFacade: 'megion', idMaterial: 'mdf', idCover: 'pvh' },
		{ idFacade: 'asha_white', idMaterial: 'dsp', idCover: 'lak' },
		{ idFacade: 'asha_green', idMaterial: 'dsp', idCover: 'lak' },
		{ idFacade: 'asha_red', idMaterial: 'dsp', idCover: 'lak' },
		{ idFacade: 'asha_beige', idMaterial: 'dsp', idCover: 'lak' },
		{ idFacade: 'nordic', idMaterial: 'dsp', idCover: 'ldsp' },
		{ idFacade: 'birsk', idMaterial: 'dsp', idCover: 'plastic' },
		{ idFacade: 'fatezh', idMaterial: 'dsp', idCover: 'ldsp' },
		{ idFacade: 'rouza', idMaterial: 'dsp', idCover: 'ldsp' },
		{ idFacade: 'nevel', idMaterial: 'massive', idCover: 'paint' },
		{ idFacade: 'newport_taupe', idMaterial: 'mdf', idCover: 'pvh' },
		{ idFacade: 'newport_white', idMaterial: 'mdf', idCover: 'pvh' },
		{ idFacade: 'oxford', idMaterial: 'mdf', idCover: 'pvh' },
		{ idFacade: 'petergof', idMaterial: 'mdf', idCover: 'pvh' },
		{ idFacade: 'plast', idMaterial: 'dsp', idCover: 'ldsp' },
		{ idFacade: 'santiago', idMaterial: 'dsp', idCover: 'ldsp' },
		{ idFacade: 'sofia', idMaterial: 'dsp', idCover: 'ldsp' },
		{ idFacade: 'tomari', idMaterial: 'mdf', idCover: 'pvh' },
	],

	getMaterialsIds() {
		const itemMaterial = [];
		filterObj.itemsArray.forEach(e => {
			if (!itemMaterial.includes(e.idMaterial)) {
				itemMaterial.push(e.idMaterial);
			}
		});
		return itemMaterial;
	},

	getCoversIds() {
		const itemCovers = [];
		filterObj.itemsArray.forEach(e => {
			if (!itemCovers.includes(e.idCover)) {
				itemCovers.push(e.idCover);
			}
		});
		return itemCovers;
	},

	getSortCovers() {
		const itemMaterial = filterObj.getMaterialsIds();//array of all materials
		const sortCovers = [];

		itemMaterial.forEach(eMat => {
			const itemCover = [];
			filterObj.itemsArray.forEach(eObj => {
				if(eObj.idMaterial === eMat){
					if (!itemCover.includes(eObj.idCover)){
						itemCover.push(eObj.idCover);
					}
				}
			})
			sortCovers.push(itemCover);
		})
		return sortCovers;
	},

	openFilters() {
		document.getElementById('filter_submit-btn').addEventListener('click', filterObj.submitFilters);
		document.getElementById('filter_clear-btn').addEventListener('click', filterObj.clearFilters);
		document.addEventListener('click', function(event) {
 	 	const isClickInside = document.getElementById('facade__filter').contains(event.target);
 	 	if (!isClickInside) {
 		   	filterObj.sidebarHide();
 	 		}
		});

		if (slideBar.style.height == '510px') {
			filterObj.sidebarHide();
		} else {
			filterObj.sidebarShow();
		}
	},

	submitFilters() {
		const itemMaterial = filterObj.getMaterialsIds();//array of all materials
		const itemCover = filterObj.getCoversIds();//array of all covers
		filterObj.reloadFilter();
		filterObj.filterCheckLoop(itemMaterial);
		filterObj.filterCheckLoop(itemCover);
		filterObj.sidebarHide();
		concat();
// Finish the filter submition...
	},

//reloads all items to default state
	reloadFilter() {
		filterObj.itemsArray.forEach(e => document.getElementById(e.idFacade).style.display = "flex");
	},

	sidebarHide() {
		slideBar.style.height = '50px';
		filter_btn.className = 'filter__btn';
	},

	sidebarShow() {
		slideBar.style.height = '510px';
		filter_btn.className += '_after';
	},
	clearFilters() {
		filterObj.itemsArray.forEach(e => {
			document.getElementById(e.idMaterial).checked = false;
			document.getElementById(e.idCover).checked = false;
		});
		filterObj.submitFilters();
	},

//creates array of CHECKED properties for items
	filterCheckLoop(arr) {
		let checkbox;
		let result = [];
		arr.forEach(e => {
			checkbox = document.getElementById(e)
			if(checkbox.checked === true) {
				result.push(e);
			}
		});
		if (result.length > 0) {
		result = arr.filter(x => result.includes(x));
		// console.log(result);
		return filterObj.filterAction(result);
		} 
	},

	filterAction(checkElements) {
		const uncheckedItemsId = [];//there will be all unpleasant items
		filterObj.itemsArray
			.filter(e => !checkElements.includes(e.idMaterial) && !checkElements.includes(e.idCover))
			.forEach(e => uncheckedItemsId.push(e.idFacade));
		for (var i = 0; i < uncheckedItemsId.length; i++) {
			document.getElementById(uncheckedItemsId[i]).style.display = "none";
		}
		// console.log(uncheckedItemsId);
		return uncheckedItemsId;
	}
}

concat = () => {
	const itemMaterial = filterObj.getMaterialsIds();//array of all materials
	const itemCover = filterObj.getCoversIds();//array of all covers
	let res = [];
	res = res.concat(filterObj.filterCheckLoop(itemMaterial));
	res = res.concat(filterObj.filterCheckLoop(itemCover));
	res = res.reduce((r, e) => {
	if(r.includes(e) || e == undefined){
			return r
		}else{
			return [...r, e]
		}
	}, []);
	document.getElementById("filter_info").innerHTML = 'Показано ' + (filterObj.itemsArray.length - res.length) + ' из ' + filterObj.itemsArray.length
}

const choiceBox = {
	// nameField: document.getElementById("selected__facade__name"),
	currentItemId: null,
	currentAreaHeight: null,
	correctAreaHeight: "100px",
	currentName: null,
	currentImgSrc: null,
	linkButton() {
		const links = document.getElementsByClassName("item__choice-button");
		for (let item of links) {
			item.addEventListener('click', choiceBox.action);
		}
	},
	action(evt) {
		choiceBox.showArea();
		choiceBox.currentItemId = evt.target.parentElement.id;
		choiceBox.currentName = evt.target.parentElement.getElementsByClassName("item__name")[0].innerHTML;
		choiceBox.currentImgSrc = evt.target.parentElement.getElementsByClassName("item__img")[0].src;
		choiceBox.currentAreaHeight = document.getElementById("select__area").style.height;

		document.getElementById("selected__facade__name").innerHTML = choiceBox.currentName;
		document.getElementById("selected__facade__img").src = choiceBox.currentImgSrc;
		// console.log(choiceBox.currentItemId);

	},
	showArea() {
		if (choiceBox.currentAreaHeight != choiceBox.correctAreaHeight) {
			document.getElementById("select__area").style.height = choiceBox.correctAreaHeight;
		}
	}
}

function hide(){
	document.getElementById("select__area").style.height = 0;
	choiceBox.currentAreaHeight = document.getElementById("select__area").style.height;
}