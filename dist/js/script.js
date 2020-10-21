window.onload = () => {
	const filter_btn = document.getElementById('filter_btn');
	const slideBar = document.getElementById('slideBar');
	choiceBox.linkButton();
	filter_btn.addEventListener('click', filterObj.openFilters);
	// filterObj.getMaterialsIds().forEach((e, i) => {
	// 	e = document.getElementById(e);
	// 	e.addEventListener('click', function (event) {
	// 		let sortCovers = filterObj.getSortCovers()
	// 		if (event.target.checked === true) {
	// 			sortCovers[i].forEach(element => document.getElementById(element).checked = true);
	// 		} else {
	// 			sortCovers[i].forEach(element => document.getElementById(element).checked = false);
	// 		}
	// 	});
	// });
}

class Filter {
	//array of all items to filter==============================================
	itemsArray

	constructor() {
		fetch('http://localhost:3000/getItemsArray').then(res => res.json()).then(res => { 
			this.itemsArray = res;
			console.log(this.itemsArray);
			this.setOfChecked();
		});
	}

	setOfChecked = () => {
		filterObj.getMaterialsIds().forEach((e, i) => {
		e = document.getElementById(e);
		e.addEventListener('click', function (event) {
			let sortCovers = filterObj.getSortCovers()
			if (event.target.checked === true) {
				sortCovers[i].forEach(element => document.getElementById(element).checked = true);
			} else {
				sortCovers[i].forEach(element => document.getElementById(element).checked = false);
			}
			});
		});
	}

	getMaterialsIds = () => { 
		const itemMaterial = [];
		this.itemsArray.forEach(e => {
			if (!itemMaterial.includes(e.idMaterial)) {
				itemMaterial.push(e.idMaterial);
			}
		});
		return itemMaterial;
	}

	getCoversIds = () => { 
		const itemCovers = [];
		this.itemsArray.forEach(e => {
			if (!itemCovers.includes(e.idCover)) {
				itemCovers.push(e.idCover);
			}
		});
		return itemCovers;
	}

	getSortCovers = () => { 
		const itemMaterial = this.getMaterialsIds();//array of all materials
		const sortCovers = [];

		itemMaterial.forEach(eMat => {
			const itemCover = [];
			this.itemsArray.forEach(eObj => {
				if (eObj.idMaterial === eMat) {
					if (!itemCover.includes(eObj.idCover)) {
						itemCover.push(eObj.idCover);
					}
				}
			})
			sortCovers.push(itemCover);
		})
		return sortCovers;
	}

	openFilters = () => {
		document.getElementById('filter_submit-btn').addEventListener('click', this.submitFilters);
		document.getElementById('filter_clear-btn').addEventListener('click', this.clearFilters);
		document.addEventListener('click', event => {
			const isClickInside = document.getElementById('facade__filter').contains(event.target);
			if (!isClickInside) {
				this.sidebarHide();
			}
		});

		if (slideBar.style.height == '510px') {
			this.sidebarHide();
		} else {
			this.sidebarShow();
		}
	}

	submitFilters = () => { 
		const itemMaterial = this.getMaterialsIds();//array of all materials
		const itemCover = this.getCoversIds();//array of all covers
		this.reloadFilter();
		this.filterCheckLoop(itemMaterial);
		this.filterCheckLoop(itemCover);
		this.sidebarHide();
		this.showResult();
		// Finish the filter submition...
	}

	//reloads all items to default state
	reloadFilter = () => { 
		this.itemsArray.forEach(e => document.getElementById(e.idFacade).style.display = "flex");
	}

	sidebarHide = () => { 
		slideBar.style.height = '50px';
		filter_btn.className = 'filter__btn';
	}

	sidebarShow = () => { 
		slideBar.style.height = '510px';
		filter_btn.className += '_after';
	}

	clearFilters = () => { 
		this.itemsArray.forEach(e => {
			document.getElementById(e.idMaterial).checked = false;
			document.getElementById(e.idCover).checked = false;
		});
		this.submitFilters();
	}

	//creates array of CHECKED properties for items
	filterCheckLoop = (arr) => {
		let checkbox;
		let result = [];
		arr.forEach(e => {
			checkbox = document.getElementById(e)
			if (checkbox.checked === true) {
				result.push(e);
			}
		});
		if (result.length > 0) {
			result = arr.filter(x => result.includes(x));
			// console.log(result);
			return this.filterAction(result);
		}
	}

	filterAction = (checkElements) => {
		const uncheckedItemsId = [];//there will be all unpleasant items
		this.itemsArray
			.filter(e => !checkElements.includes(e.idMaterial) && !checkElements.includes(e.idCover))
			.forEach(e => uncheckedItemsId.push(e.idFacade));
		for (var i = 0; i < uncheckedItemsId.length; i++) {
			document.getElementById(uncheckedItemsId[i]).style.display = "none";
		}
		// console.log(uncheckedItemsId);
		return uncheckedItemsId;
	}

	showResult = () => {
		const resultField = document.getElementById("filter_info");
		const itemMaterial = this.getMaterialsIds();//array of all materials
		const itemCover = this.getCoversIds();//array of all covers
		let res = [];
		res = res.concat(this.filterCheckLoop(itemMaterial)).concat(this.filterCheckLoop(itemCover));
		res = res.reduce((r, e) => {
			if (r.includes(e) || e == undefined) {
				return r
			} else {
				return [...r, e]
			}
		}, []);
		if (res.length > 0) {
			resultField.innerHTML = 'Показано ' + (this.itemsArray.length - res.length) + ' из ' + this.itemsArray.length + '<a class="filter__info__clear-btn" id="filter__info__clear-btn"></a>';
			document.getElementById('filter__info__clear-btn').addEventListener('click', this.clearFilters);
		} else resultField.innerHTML = "";
	}
}

const filterObj = new Filter();


const choiceBox = {
	area: document.getElementById("select__area"),
	areaButton: document.getElementById("next__btn"),
	currentItemId: null,
	currentAreaHeight: null,
	correctAreaHeight: "100px",
	currentName: null,
	currentImgSrc: null,
	linkButton(){
		this.areaButton.addEventListener('click', showBox)
		const links = document.getElementsByClassName("item__choice-button");
		for (let item of links) {
			item.addEventListener('click', this.action);
		}
	},
	action(evt){
		// console.log(this);
		choiceBox.showArea();
		choiceBox.currentItemId = evt.target.parentElement.id;
		choiceBox.currentName = evt.target.parentElement.getElementsByClassName("item__name")[0].innerHTML;
		choiceBox.currentImgSrc = evt.target.parentElement.getElementsByClassName("item__img")[0].src;
		choiceBox.currentAreaHeight = document.getElementById("select__area").style.height;

		document.getElementById("selected__facade__name").innerHTML = choiceBox.currentName;
		document.getElementById("selected__facade__img").src = choiceBox.currentImgSrc;
		console.log(choiceBox.currentItemId);

	},
	showArea(){
		// console.log("show");
		if (this.currentAreaHeight != this.correctAreaHeight) {
			this.area.style.height = this.correctAreaHeight;
		}
	}
}



function hide() {
	document.getElementById("select__area").style.height = 0;
	choiceBox.currentAreaHeight = document.getElementById("select__area").style.height;
}

function showBox(){
	document.getElementById("shape-box").style.height = "800px";
}