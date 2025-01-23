var countColumns = 4, countRows = 4, widthImage, heightImage, resWidthImage=300, resHeightImage=300, widthPiece, heightPiece, border = 1;
var x, y, imageList = new Array(), randomImageList = new Array();
var puzzle_area = document.getElementById("puzzle_area");
var puzzle_box = document.getElementById("puzzle_box");

function generateRandomPermutation(n) {
    let permutation = Array.from({ length: n }, (_, i) => i + 1);
    permutation.sort(() => Math.random() - 0.5);
    return permutation;
}

function getClippedRegion(image, x, y, width, height, resWidth, resHeight) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = resWidth;
    canvas.height = resHeight;
    ctx.drawImage(image, x, y, width, height,  0, 0, resWidth, resHeight);
    return canvas;
}

function checkPuzzleArea(){
    var currentPuzzleArea = puzzle_area.children;
    var rightPuzzle = true;
    for(i=0; i<countRows*countColumns; i++){
        if(imageList[i] !== currentPuzzleArea[i].children[0]){
            rightPuzzle = false;
        }
    }
    if(rightPuzzle){
        document.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('touchstart', onMouseDown);
        for(i=0; i<countRows*countColumns; i++){
            currentPuzzleArea[i].children[0].style.border = "none";
            currentPuzzleArea[i].children[0].style.width = resWidthPiece+2*border+"px";
            currentPuzzleArea[i].children[0].style.height = resHeightPiece+2*border+"px";
            currentPuzzleArea[i].style.border = "none";
            currentPuzzleArea[i].style.width = resWidthPiece+2*border+"px";
            currentPuzzleArea[i].style.height = resHeightPiece+2*border+"px";
        }
    }
}

const img = new Image();
img.onload = function(){
    widthImage = this.width;
    widthPiece = widthImage/countColumns;
    resWidthPiece = resWidthImage/countColumns - 2*border;
    heightImage = this.height;
    heightPiece = heightImage/countRows;
    resHeightPiece = resHeightImage/countRows - 2*border;
    
    for(var i = 0; i<countRows; i++){
        y=i*heightPiece;
        for(var j = 0; j<countColumns; j++){
            x=j*widthPiece;
            var puzzle_block = getClippedRegion(this, x, y, widthPiece-2*border, heightPiece-2*border, resWidthPiece, resHeightPiece);
            puzzle_block.classList.add('puzzle_block');
            imageList.push(puzzle_block);

            var puzzle_place = document.createElement('div');
            puzzle_place.style.width = resWidthPiece+"px";
            puzzle_place.style.height = resHeightPiece+"px";
            puzzle_place.classList.add('puzzle_place');
            puzzle_area.appendChild(puzzle_place);
        }
    }
    var permutation = generateRandomPermutation(countColumns*countRows);
    for(var i=0; i<countColumns*countRows; i++){
        puzzle_box.appendChild(imageList[permutation[i]-1]);
    }
}
img.src = 'images/puzzle1.jpg';


function onMouseDown(event){
    var puzzle = event.target;
    if(puzzle !== null && puzzle.classList.contains('puzzle_block')){
        let shiftX = (event.clientX || event.targetTouches[0].clientX) - puzzle.getBoundingClientRect().left;
        let shiftY = (event.clientY || event.targetTouches[0].clientY) - puzzle.getBoundingClientRect().top;

        puzzle.style.position = 'absolute';
        document.body.appendChild(puzzle);

        moveAt(event.pageX, event.pageY);
        function moveAt(pageX, pageY) {
            puzzle.style.left = pageX - shiftX + 'px';
            puzzle.style.top = pageY - shiftY + 'px';
        }
        
        let currentDroppable = null;
        function onMouseMove(event) {
            moveAt(event.pageX || event.touches[0].pageX, event.pageY || event.touches[0].pageY);

            puzzle.hidden = true;
            let elemBelow = document.elementFromPoint(event.clientX || event.touches[0].clientX, 
                event.clientY || event.touches[0].clientY);
            puzzle.hidden = false;

            if (!elemBelow) return;
            let droppableBelow = elemBelow.closest('.puzzle_place');

            if (currentDroppable != droppableBelow) {
                if (currentDroppable) {
                    currentDroppable.style.backgroundColor="chocolate";
                }
            }
            currentDroppable = droppableBelow;
            if (currentDroppable) {
                currentDroppable.style.backgroundColor="green";
            }
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('touchmove', onMouseMove);

  
        puzzle.onmouseup = onMouseUp;
        puzzle.ontouchend = onMouseUp;
        function onMouseUp(event) {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('touchmove', onMouseMove);

           
            puzzle.hidden = true;
            let elemBelow = document.elementFromPoint(event.clientX || event.changedTouches[0].clientX, 
                event.clientY || event.changedTouches[0].clientY);
            puzzle.hidden = false;
            if (!elemBelow) return;
            let droppableBelow = elemBelow.closest('.puzzle_place');
           

            if(droppableBelow && droppableBelow.children.length==0){
                droppableBelow.appendChild(puzzle);
                puzzle.style.position="absolute";
                puzzle.style.left="0";
                puzzle.style.top="0";
            }
            else{
                puzzle_box.appendChild(puzzle);
                puzzle.style.position="static";
                puzzle.style.top = "initial";
                puzzle.style.left = "initial";
            }

            if(puzzle_box.children.length == 0 ){
                checkPuzzleArea();
            }
            puzzle.onmouseup = null;
            puzzle.ontouchend = null;
        }
    }
}

document.addEventListener('mousedown', onMouseDown);
document.addEventListener('touchstart', onMouseDown);