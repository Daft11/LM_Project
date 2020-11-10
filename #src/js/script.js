window.onload = () => {
	const filter_btn = document.getElementById('filter_btn');
	const slideBar = document.getElementById('slideBar');
	choiceBox.linkButton();
	filter_btn.addEventListener('click', filterObj.openFilters);
}

class Filter {
	//array of all items to filter==============================================
	itemsArray

	constructor() {
		// fetch('/getItemsArray').then(res => res.json()).then(res => { 
		fetch('/getItemsArray').then(res => res.json()).then(res => { 
			this.itemsArray = res;
			// console.log(this.itemsArray);
			this.setOfChecked();
		}).catch(error => console.warn(error));;
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
	facadeId: null,
	areaButton: document.getElementById("next__btn"),

	linkButton(){
		this.areaButton.addEventListener('click', shapeBox.startBox.bind(shapeBox))
		const links = document.getElementsByClassName("item__choice-button");
		for (let item of links) {
			item.addEventListener('click', this.action.bind(choiceBox));
		}
	},
	action(evt){
		// this.setBoxHeight();
		setBoxHeight("submit__facade", "100px");
		const facadeName = document.getElementById("selected__facade__name");
		const facadeImg = document.getElementById("selected__facade__img");
		facadeName.innerHTML = evt.target.parentElement.getElementsByClassName("item__name")[0].innerHTML;
		facadeImg.src = evt.target.parentElement.getElementsByClassName("item__img")[0].src;
		this.facadeId = evt.target.parentElement.id;

	}
}




const shapeBox = {
	shape: "line",
	sizeArray: [],
	shapeCardsIdArray: ["geometry-line-shaped", "geometry-l-shaped-left", "geometry-l-shaped-right", "geometry-u-shaped"],
	sizeInputIdArray:["size-first", "size-second", "size-third"],
	// sizeDisplay: document.getElementsByClassName("enter__size-display")[0],
	sizeWall: document.getElementById("size-wall"),
	sizeWallDefaultClassName: "enter__size-wall",
	inputVisibilitySet: {
		line: [1, 0.2, 0.2, false, true, true],
		lShapedLeft: [1, 1, 0.2, false, false, true],
		lShapedRight: [1, 1, 0.2, false, false, true],
		uShaped: [1, 1, 1, false, false, false]
	},
	animDependency: {
		first: "anim-left-border",
		second: "anim-top-border",
		third: "anim-right-border"
	},
	inputValidSumArray: {
		first: {validity: false, enabled: false},
		second: {validity: false, enabled: false},
		third: {validity: false, enabled: false}
	},


	startBox(){ //For initiate shape-box
		setBoxHeight("shape-box", "100vh", "600px");
		// document.getElementById("shape-box").style.minHeight = "600px";
		document.getElementById("shape-box").style.overflow = "visible";
		this.switchShape();
		this.getShape();
		this.flashingWall();
		document.getElementById("calc__btn").addEventListener("click", summaryProgress.startSummary.bind(summaryProgress));

	},

	inputFocus(){ //Sets the marker on firts size input
		const firstInput = document.getElementById(this.sizeInputIdArray[0]).firstElementChild;
		firstInput.focus();
		firstInput.select();
	},

	switchShape(){ //Adds listener on every shape icon
		this.shapeCardsIdArray.forEach(e => {
			document.getElementById(e).addEventListener("change", shapeBox.getShape.bind(shapeBox));
		});
	},



	getShape(){ //Changing property Shape of shapeBox object
		this.shapeCardsIdArray.forEach(e => {
			if(document.getElementById(e).checked){

				this.shape = document.getElementById(e).value;
				this.sizeWall.className = this.sizeWallDefaultClassName;
				this.sizeWall.className += e.slice(8);
				// console.log(this.wallsModel.className);
				this.inputShowSwitch(this.shape);
				setBoxHeight("submit-size", "0px");
				this.formValidCheck();
			}
		});
	},

	inputShowSwitch(shape) { //Controls size input visibility and access
		const shapeNameConvert = shape.split("-").reduce((r,e,i)=>{
			if(i>0){
				return r + e.charAt(0).toUpperCase() + e.slice(1)
			} else return r + e
		},"")
		this.inputValidSumArray.first.enabled = !this.inputVisibilitySet[shapeNameConvert][3];
		this.inputValidSumArray.second.enabled = !this.inputVisibilitySet[shapeNameConvert][4];
		this.inputValidSumArray.third.enabled = !this.inputVisibilitySet[shapeNameConvert][5];
		for (var i = 0; i < this.sizeInputIdArray.length; i++){
			document.getElementById(this.sizeInputIdArray[i]).style.opacity = this.inputVisibilitySet[shapeNameConvert][i];
			document.getElementById(this.sizeInputIdArray[i]).firstElementChild.disabled = this.inputVisibilitySet[shapeNameConvert][i+3];

		}
		return this.inputFocus();
	},


	flashingWall(){ //Adds listeners for animate visual models of walls to all size inputs
		for (var i = 0; i < this.sizeInputIdArray.length; i++) {
			document.getElementById(this.sizeInputIdArray[i]).firstElementChild.addEventListener("focus", shapeBox.animCurrentWall);
			document.getElementById(this.sizeInputIdArray[i]).firstElementChild.addEventListener("blur", shapeBox.animCurrentWallDisable);

			// add listener for validation and submit
			document.getElementById(this.sizeInputIdArray[i]).firstElementChild.addEventListener("input", shapeBox.inputValidCheck);
		}
	},


	animCurrentWall(evt){ //Enable blinking animaion for current wall
		const inputNumber = evt.target.name;
		const className = shapeBox.animDependency[inputNumber];
		shapeBox.sizeWall.classList.add(className);
	},

	animCurrentWallDisable(evt){ //Disable blinking animaion for current wall
		const inputNumber = evt.target.name;
		const className = shapeBox.animDependency[inputNumber];
		shapeBox.sizeWall.classList.remove(className);
	},

	inputValidCheck(evt){
		const inputNumber = evt.target.name;
		+evt.target.value === 0 ? evt.target.setCustomValidity("Invalid field.") : evt.target.setCustomValidity("")
		shapeBox.inputValidSumArray[inputNumber].validity = evt.target.validity.valid;
		shapeBox.formValidCheck();
		
	},

	formValidCheck(){
		const correct = [];
		let res = true;
		for (const [key, value] of Object.entries(this.inputValidSumArray)) {
			if(value.enabled) {correct.push(key)}
		}
		for (var i = 0; i < correct.length; i++) {
			res = res && shapeBox.inputValidSumArray[correct[i]].validity;
		}
		if (res) {
			setBoxHeight("baner-help", "0");
			setBoxHeight("submit-size", "100px", "80px");
			document.getElementById("shape-box").scrollIntoView(false)
			// setTimeout(function(){document.getElementById("shape-box").scrollIntoView(false)}, 25);
			this.pushSize(correct);
		} else {
			setBoxHeight("baner-help", "100px");
			setBoxHeight("submit-size", "0px", "0");
			summaryProgress.hideSummary();
			// document.getElementById("baner").removeEventListener("click", summaryProgress.startSummary.bind(summaryProgress));
		}
	},

	pushSize(correct){
		this.sizeArray = [];
		for (var i = 0; i < correct.length; i++) {
			this.sizeArray.push(Number(document.getElementById(this.sizeInputIdArray[i]).firstElementChild.value));
		}
	}
}

let framesInfo = fetch('/getFramesInfo').then(res => res.json()).then(res => {framesInfo = res})


const summaryProgress = {
	areaId: "calculating__area",
	facade: "",
	shape: "",
	size: [],
	resFrameSizeArrayTop: [],
	resFramePriceArrayTop: [],
	resFrameSizeArrayBottom: [],
	resFramePriceArrayBottom: [],

	startSummary(){
		this.pullParams();
		setBoxHeight(this.areaId, "300px");
	},

	hideSummary(){
		setBoxHeight(this.areaId, "0");
	},

	pullParams(){
		this.facade = Object.assign("", shapeBox["facadeId"]);
		this.shape = Object.assign("", shapeBox["shape"]);
		this.size = Object.assign([], shapeBox["sizeArray"]);
		this.resFrameSizeArrayBottom = [];
		this.resFramePriceArrayBottom = [];
		this.CalcFramesBottom = new CalcFrames(this.size, "bottom");
		// this.CalcFramesTop = new CalcFrames(this.size, "top");
	},

	consShowFiltredBuilds(array){
		// console.log("filtredBuildVars: ", array)
		this.calcPrice(array)
	},

	calcPrice(allArrays){
		allArrays.forEach((currentArray, i) => {
			let currentArrayPrices = [];
			currentArray.forEach(sizePack => {
				let price = sizePack.reduce((price, e) => { 
					const index = framesInfo.position.botttom.sizes.indexOf(e);
					price += framesInfo.position.botttom.prices[index];
					return price;
				}, 0)
				currentArrayPrices.push(price)
			})
			currentArrayPrices = currentArrayPrices.reduce((r, e) => r + e)
			this.resFramePriceArrayBottom.push(currentArrayPrices);
		})

		this.pickCheapest(allArrays, this.resFramePriceArrayBottom)
		console.log(this.resFrameSizeArrayBottom, this.resFramePriceArrayBottom)
		// return this.resFramePriceArrayBottom;
	},

	pickCheapest(frameArray, priceArray){
		let index = 0;
		let price = this.resFramePriceArrayBottom.reduce((r, e, i)=>{
			if(e<r){
				index = i
				return e
			} else {return r}
		}, Infinity)

		this.resFrameSizeArrayBottom = frameArray[index]
		this.resFramePriceArrayBottom = priceArray[index]
	}


}


class CalcFrames{
	constructor(sizeNoSort, position){
		if(position === "bottom"){
			this.resFramePriceArrayBottom = [];
			this.resFrameSizeArrayBottom = [];
			this.bigFrames = framesInfo.position.botttom.sizes.slice(6);//array of Frames for angle
			this.calculateSizes(sizeNoSort);
		}else if(position === "top"){
			this.resFramePriceArrayTop = [];
			this.resFrameSizeArrayTop = [];
			this.calculateSizes(sizeNoSort);
		}
	}

	calculateSizes = (sizeNoSort) => {
			// this.size = sizeNoSort.sort((a, b) => a - b);//sort sizes
			this.size = sizeNoSort

			this.size.forEach((e, i) => promRed(this.fixkWallSize(e),framesInfo.position.botttom.sizes).then(res => this.pusher(res, this.resFrameSizeArrayBottom)));
		}

	fixkWallSize(size){
		if(size >= 1100 && size < 1200){
			return 1050
		}else {return size-size%50}
	}

	pusher = (x, array) => {
		array.push(x)
		if (array.length == this.size.length){this.bigSizeReducer(array, array.length)};
	}
		
	bigSizeReducer(allArrays){
		allArrays.forEach((elem, index) => {
			let res = elem.filter(e => {return !this.bigFrames.includes(e[e.length-3])});
			if (allArrays.length == 3){res = res.filter(e => e.includes(600)||!this.isArrayInclBigSizeAt(e, e.length-3))}
			else if (allArrays.length == 2){res = res.filter(e => e.includes(600)||!this.isArrayInclBigSizeAt(e, e.length-2))}
			else if (allArrays.length == 1){res =  res.filter(e => !this.isArrayInclBigSizeAt(e, e.length-1))}
			allArrays[index] = res;
		});
		this.pickCalculator(allArrays);
	}

	pickCalculator(allArrays){
		// console.log(allArrays)
		if(allArrays.length === 1){this.filterBuildsOne(allArrays)}
		else if(allArrays.length === 2){this.filterBuildsTwo(allArrays)}
		else if(allArrays.length === 3){this.filterBuildsThree(allArrays)}
	}
		
	filterBuildsOne(allArrays){
		let filtredBuildVars = [];
		let res = [];
		allArrays[0].forEach((sizePack,i) => {
			let filtredSizePack = sizePack.filter(e =>{return sizePack.includes(600)})
			if(filtredSizePack.length > 0) res.push(filtredSizePack)
		});
		filtredBuildVars[0] = res
		summaryProgress.consShowFiltredBuilds(filtredBuildVars)

	}


	filterBuildsTwo(allArrays){
		const priceToRemove = framesInfo.position.botttom.prices[framesInfo.position.botttom.sizes.indexOf(600)];
		let arrayOfAllVars = [];
		let count = 0;
		allArrays[0].forEach((sizePackOne,i) => {
			if(!this.isArrayInclBigSizeAt(sizePackOne, sizePackOne.length-2)){
				allArrays[1].forEach((sizePackTwo, j) => {
					if(!this.isArrayInclBigSizeAt(sizePackTwo, sizePackTwo.length-2)){
						arrayOfAllVars[count] = []
						arrayOfAllVars[count].push(sizePackOne)
						arrayOfAllVars[count].push(sizePackTwo)
						count++
					}
				})
			}
		})
		let mergedBuild = [];
		let filtredBuildVars = [];

		//condition 1 600 1000
		arrayOfAllVars.forEach(buildArray => {
			mergedBuild = buildArray[0].concat(buildArray[1])
			if(!this.isArrayInclBigSizeAt(buildArray[0], buildArray[0].length-1)
				&& buildArray[0].includes(600)
				&& this.isArrayInclBigSizeAt(buildArray[1], buildArray[1].length-1)
				&& this.checkForNumberOfFrames(mergedBuild, 600, 2))
				filtredBuildVars.push(buildArray)
		})

		//condition 1 1000 600
		arrayOfAllVars.forEach(buildArray => {
			mergedBuild = buildArray[0].concat(buildArray[1])
			if(this.isArrayInclBigSizeAt(buildArray[0], buildArray[0].length-1) 
				&& buildArray[1].includes(600) 
				&& !this.isArrayInclBigSizeAt(buildArray[1], buildArray[1].length-1)
				&& (this.checkForNumberOfFrames(mergedBuild, 600, 2)))
				filtredBuildVars.push(buildArray)
		})
		filtredBuildVars = this.fixExcessFrames(filtredBuildVars, 2)
		summaryProgress.consShowFiltredBuilds(filtredBuildVars)
	}

	filterBuildsThree(allArrays, prices){
		const bigFrames = framesInfo.position.botttom.sizes.slice(6);
		const priceToRemove = framesInfo.position.botttom.prices[framesInfo.position.botttom.sizes.indexOf(600)]
		let arrayOfAllVars = [];
		let count = 0
		allArrays[0].forEach((sizePackOne,i) => {
			if(!bigFrames.includes(sizePackOne[sizePackOne.length-2])){
				allArrays[1].forEach((sizePackTwo,j) => {
					allArrays[2].forEach((sizePackThree, k) => {
						if(!bigFrames.includes(sizePackThree[sizePackThree.length-2])){
							arrayOfAllVars[count] = []
							arrayOfAllVars[count].push(sizePackOne)
							arrayOfAllVars[count].push(sizePackTwo)
							arrayOfAllVars[count].push(sizePackThree)
							count++
						}
					})
					
				})
			}
		})
		let mergedBuild = []
		let filtredBuildVars = []


		//condition 1 1000 600 600 1000
		arrayOfAllVars.forEach(buildArray => {
			mergedBuild = buildArray[0].concat(buildArray[1]).concat(buildArray[2])
			if((bigFrames.includes(buildArray[0][buildArray[0].length-1])) 
				&& (this.checkForNumberOfFrames(buildArray[1], 600, 2)) 
				&& (!bigFrames.includes(buildArray[1][buildArray[1].length-1]))
				&& (bigFrames.includes(buildArray[2][buildArray[2].length-1])) 
				&& (this.checkForNumberOfFrames(mergedBuild, 600, 3)))
				filtredBuildVars.push(buildArray);
		})

		//condition 2 1000 600 1000 600
		arrayOfAllVars.forEach(buildArray => {
			mergedBuild = buildArray[0].concat(buildArray[1]).concat(buildArray[2])
			if((bigFrames.includes(buildArray[0][buildArray[0].length-1])) 
				&& (this.checkForNumberOfFrames(buildArray[1], 600, 1)) 
				&& (bigFrames.includes(buildArray[1][buildArray[1].length-1]))
				&& (this.checkForNumberOfFrames(buildArray[2], 600, 1)) 
				&& (!bigFrames.includes(buildArray[2][buildArray[2].length-1])) 
				&& (this.checkForNumberOfFrames(mergedBuild, 600, 3)))
				filtredBuildVars.push(buildArray);
		})

		//condition 3 600 1000 600 1000
		arrayOfAllVars.forEach(buildArray => {
			mergedBuild = buildArray[0].concat(buildArray[1]).concat(buildArray[2])
			if((!bigFrames.includes(buildArray[0][buildArray[0].length-1])) 
				&& (this.checkForNumberOfFrames(buildArray[0], 600, 1)) 
				&& (bigFrames.includes(buildArray[1][buildArray[1].length-1]))
				&& (this.checkForNumberOfFrames(buildArray[1], 600, 1)) 
				&& (bigFrames.includes(buildArray[2][buildArray[2].length-1])) 
				&& (this.checkForNumberOfFrames(mergedBuild, 600, 3)))
				filtredBuildVars.push(buildArray);
		})

		//condition 4 600 1000 1000 600
		arrayOfAllVars.forEach(buildArray => {
			mergedBuild = buildArray[0].concat(buildArray[1]).concat(buildArray[2])
			if((!bigFrames.includes(buildArray[0][buildArray[0].length-1])) 
				&& (this.checkForNumberOfFrames(buildArray[0], 600, 1)) 
				&& (bigFrames.includes(buildArray[1][buildArray[1].length-2]))
				&& (this.checkForNumberOfFrames(buildArray[2], 600, 1)) 
				&& (!bigFrames.includes(buildArray[2][buildArray[2].length-1])) 
				&& (this.checkForNumberOfFrames(mergedBuild, 600, 3)))
				filtredBuildVars.push(buildArray);
		})
		// filtredBuildVars.flat(1)
		filtredBuildVars = this.fixExcessFrames(filtredBuildVars, 3)
		summaryProgress.consShowFiltredBuilds(filtredBuildVars)
	}

	fixExcessFrames(array, wallsNumber){
		if(wallsNumber === 2){
			array = array.map(build => {
				build = build.map(wall => {
					if(!this.isArrayInclBigSizeAt(wall, wall.length-1)){
						return this.removeFrame(wall, 600, 1)
					}else {return wall}
				})
				return build
			})
		}else if (wallsNumber === 3){
			array = array.map(build => {
				build = build.map((wall, i) => {
					if((i==0 || i==2) && !this.isArrayInclBigSizeAt(wall, wall.length-1)){
						return this.removeFrame(wall, 600, 1)
					}else if(i==1) {
						if(!this.isArrayInclBigSizeAt(wall, wall.length-1)){
							return this.removeFrame(wall, 600, 2)
						}
						if(!this.isArrayInclBigSizeAt(wall, wall.length-2) && this.isArrayInclBigSizeAt(wall, wall.length-1)){
							return this.removeFrame(wall, 600, 1)
						} else {return wall}
					}else {return wall}
				})
				return build
			})
		}
		return array
	}

	removeFrame(array, size, number){
		let count =	array.reduce((acc, cur) => {if(cur==size){return acc+1}else {return acc}},0);
		array = array.filter(cur => cur!=size);
		for (var i = 0; i <(count-number) ; i++) {
			array.push(size)
		}
		return array
	}

	isArrayInclBigSizeAt(array, position){
		return this.bigFrames.includes(array[position])
	}

	checkForNumberOfFrames(array, size, number){
		return (array.reduce((r, e) => {if(e==size){return r+1}else {return r}},0)>=number)
	}
}


function setBoxHeight(areaId, correctAreaHeight, minHight){
	const area = document.getElementById(areaId);
	const currentAreaHeight = document.getElementById(areaId).style.height;
	if (currentAreaHeight != correctAreaHeight) {
			area.style.height = correctAreaHeight;
		}
	if(minHight){
		area.style.minHeight = minHight;
	}
}

function onlyNumberKey(evt) { // Validation for size inputs (only numbers)
        var iKeyCode = (evt.which) ? evt.which : evt.keyCode
        if (iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
            return false;
        return true;
    } 

function checkLength(len,ele){ // Validation for size inputs (length control max:4)
	var fieldLength = ele.value.length;
	if(fieldLength <= len){return true;}
	else {
		var str = ele.value;
		str = str.substring(0, str.length - 1);
		ele.value = str;
	}
}


//=================

const promRed = (len, sizes) => {
var requestOptions = {
  method: 'POST',
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({"length":len,"sizes":sizes}),
  // redirect: 'follow'
};
// return fetch("/permutation", requestOptions)
return fetch("/permutation", requestOptions)
	.then(response => response.json())
	.then(res => {
		return new Promise((resolve, reject)=>{
			res.forEach(e => {e.sort((a, b) => a - b)})
			resolve(res)
		})
	})
	.then(res => {
	return Array.from(new Set(res.map(JSON.stringify)), JSON.parse);
	})
	.catch(error => console.log('error', error));
}

