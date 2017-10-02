let app=angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
	$scope.levels = [];
	for (i = 3; i <= 99; i++) {
		$scope.levels.push(i);
	}

	$scope.changeLevel = function() {
		matrixSize = $scope.selectedLevel;
		reset();
		matrix(matrixSize, "stage");
		calcSums(matrixSize);		
		//console.log($scope.selectedLevel + " : " + matrixSize);
		//console.log(matrixSize);
	}
});

let rowSumIndex = []; // horizontal sum fields
let colSumIndex = []; // vertical sum fields
let diaSumIndex = []; // diagonal sum fields
let numIndex = [];
let matrixSize = 3;

// clear variables before creating a new matrix
let reset = function () {
	rowSumIndex = []; // horizontal sum fields
	colSumIndex = []; // vertical sum fields
	diaSumIndex = []; // diagonal sum fields
	numIndex = [];
	$("#win").empty();
}

let selected = "0"; // stores selected (last clicked) element
// click and swap function
let clicked = function(targetID) {
	//console.log($("#"+targetID).html());
	if (selected !== "0") {
		if (selected === targetID) {
			// clicking same tile twice = highlight
			$("#"+targetID).removeClass("selectedTile");
			$("#"+targetID).toggleClass("highlight");
		} else {
			let tmp1 = $("#"+selected).html();
			let tmp2 = $("#"+targetID).html();
			$("#"+selected).html(tmp2).removeClass("selectedTile");
			$("#"+targetID).html(tmp1).removeClass("selectedTile");
			calcSums(matrixSize);
			checkSums();
		}
		selected = "0";
	} else {
		selected = targetID;
		$("#"+targetID).addClass("selectedTile");
	}
}

let sumTileMouseover = function(targetID) {
	$("#"+targetID).addClass("sumRollover");

	// tid is targetID as int
	let tid = parseInt(targetID);
	if (tid === 0) {
		rowSumIndex.forEach(function(v, i) {
			// row 1 - 1, row 2 - 2, etc...
			$("#" + (v - i - 1)).addClass("sumRollover");
		});
	} else if (tid === Math.pow(matrixSize+1,2)) {
		rowSumIndex.forEach(function(v, i) {
			// row 1 - matrixSize, row 2 - matrixSize + 1, etc...
			$("#" + (v - matrixSize + i)).addClass("sumRollover");
		});
	} else if ($.inArray(tid, rowSumIndex) !== -1) {
		// row sum tiles
		for (i = tid - matrixSize; i < tid; i++) {
			$("#"+i).addClass("sumRollover");
		}
	} else {
		// col sum tiles
		let rowIndex = $.inArray(tid, colSumIndex);
		rowSumIndex.forEach(function(v) {
			$("#" + (v - matrixSize + rowIndex)).addClass("sumRollover");
		});
	}
};

let sumTileMouseout = function(targetID) {
	$("#"+targetID).removeClass("sumRollover");
	// tid is targetID as int
	let tid = parseInt(targetID);
	if (tid === 0) {
		rowSumIndex.forEach(function(v, i) {
			// row 1 - 1, row 2 - 2, etc...
			$("#" + (v - i - 1)).removeClass("sumRollover");
		});
	} else if (tid === Math.pow(matrixSize+1,2)) {
		rowSumIndex.forEach(function(v, i) {
			// row 1 - matrixSize, row 2 - matrixSize + 1, etc...
			$("#" + (v - matrixSize + i)).removeClass("sumRollover");
		});
	} else if ($.inArray(tid, rowSumIndex) !== -1) {
		// row sum tiles
		for (i = tid - matrixSize; i < tid; i++) {
			$("#"+i).removeClass("sumRollover");
		}
	} else {
		// col sum tiles
		let rowIndex = $.inArray(tid, colSumIndex);
		rowSumIndex.forEach(function(v) {
			$("#" + (v - matrixSize + rowIndex)).removeClass("sumRollover");
		});
	}
};



// calc sums on change
let calcSums = function(matrixSize) {

	// calc the sum fields, update on play tile change
	rowSumIndex.forEach(function(i) {
		let sumi = 0;
		for (j = i - matrixSize; j < i; j++) {
			sumi += parseInt($("#"+j).html());
		}
		$("#"+i).html(sumi); // update sums for horizontal lines
	});

	colSumIndex.forEach(function(i, k) {
		let sumi = 0;
		rowSumIndex.forEach(function(j) {
			sumi += parseInt($("#" + (j - (matrixSize - k))).html());
		});
		$("#"+i).html(sumi); // update sums for vertical lines
	});

	let sum0 = 0; // diagonal sum from top/right to bottom/left
	let sumn = 0; // diagonal sum from top/left to bottom/right
	for(i = 1; i <= matrixSize; i++) {
		// logic for calculating diagonal sums
		sum0 += parseInt($("#" + (rowSumIndex[i-1] - i)).html());
		sumn += parseInt($("#" + (rowSumIndex[i-1] - matrixSize + i - 1)).html());
	}
	$("#"+diaSumIndex[0]).html(sum0);
	$("#"+diaSumIndex[1]).html(sumn);

}

// check sums
let checkSums = function() {
	// check sums if equal
	let isEqual = true;
	[].concat(rowSumIndex, colSumIndex, diaSumIndex).forEach(function(i, k) {
		//console.log(`${i} : ${k}`);
		if ($("#0").html() !== $("#"+i).html()) {
			//console.log("sums not equal");
			isEqual = false;
		}
	});
	if (isEqual) {
		//console.log("All sums equal.");
		$("#win").html("Completed!");
	} else {
		//console.log("Sums are not equal.");
	}
}

// create new matix function
let matrix = function(matrixSize, stageName) {
	//console.log("matrix: " + matrixSize);
	reset();

	// first matrix element for diag sum
	$("#"+stageName).empty().append(`<div id="0">0</div>`);

	let rowCount = 0;
	for (i = 1; i <= Math.pow(matrixSize + 1, 2); i++) {
		$("#"+stageName).append(`<div id="${i}" class="tile">${i}</div>`);

		// collecting sum indexes for row and col
		rowCount++;
		if (i > Math.pow(matrixSize + 1, 2) - matrixSize - 1) {
			colSumIndex.push(i);
		} else if (rowCount > matrixSize) {
			rowSumIndex.push(i);
			rowCount = 0;
		} else {
			numIndex.push(i);
		}
	}
	// sum indexes for diagonals
	diaSumIndex.push(0);
	diaSumIndex.push(Math.pow(matrixSize + 1, 2));

	// re-init playable fields
	for (i = 1; i <= Math.pow(matrixSize, 2); i++) {
		$("#"+numIndex[i]).html(i+1);
	}


	matrixStyle(matrixSize, stageName); // Applying CSS

	//console.log("rowSumIndex: " + rowSumIndex);
	//console.log("colSumIndex: " + colSumIndex);
	//console.log("diaSumIndex: " + diaSumIndex);

}

let matrixStyle = function(matrixSize, stageName) {
	//console.log("matrixStyle: " + matrixSize);
	let sheet = document.createElement("style");
	document.head.appendChild(sheet);
	sheet.innerHTML = ".colSize { grid-template-columns: repeat(" + (matrixSize+1) + ", min-content); }";
	$("#"+stageName).addClass("colSize");

	sheet.innerHTML += `.gridStart { grid-column-start: ${matrixSize+1}; }`;
	$("#0").addClass("gridStart");

	// Add style to sum tiles
	// Add mouseover function to sum tiles
	[].concat(rowSumIndex, colSumIndex, diaSumIndex).forEach(function(i) {
		$("#"+i).addClass("tile sumTile");
		$("#"+i).mouseover(function(i) {
			sumTileMouseover(i.target.id);
		}).mouseout(function(i) {
			sumTileMouseout(i.target.id);
		});
		//console.log('test');
	});

	// Add click function to play tiles
	numIndex.forEach(function(i){
		$("#"+i).addClass("playTile");
		// adding click function to play tile
		$("#"+i).click(function(i) {
			clicked(i.target.id);
		});
	})
}


$(function() {
	//let matrixSize = 3;

	matrix(matrixSize, "stage");
	calcSums(matrixSize);

});