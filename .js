var unitClass = document.getElementsByClassName("unit");
var white_pieces = document.getElementsByClassName("white_pieces");
var black_pieces = document.getElementsByClassName("black_pieces");
var table = document.getElementById("table");
var LengthOfMove = 80 ;
var moveDeviation = 10;
var pieceSelected,pieceSelectedIndex;
var upRight,upLeft,downLeft,downRight;
var block = [];
var whiteChecker = [];
var blackChecker = [];
var the_checker ;
var oneMove;
var otherMove;
var attack = false;
var multiplier = 1
var tableLimit, reverse_tableLimit, moveUpLeft, moveUpRight, moveDownLeft, moveDownRight, tableLimitLeft, tableLimitRight;

var squarePosition = function(unit,index){
    this.id = unit;
    this.ocupied = false;
    this.pieceId = undefined;
    this.id.onclick = function() {
        menMove(index);
    }
}

var checker = function(piece,color,unit) {
    this.id = piece;
    this.color = color;
    this.king = false;
    this.ocupied_square = unit;
    this.alive = true;
    this.attack = false;
    if(unit%8){
        this.coordX= unit%8;
        this.coordY = Math.floor(unit/8) + 1 ;
    }
    else{
        this.coordX = 8;
        this.coordY = unit/8 ;
    }
    this.id.onclick = function  () {
        possibleMoves(piece);
    }
}

checker.prototype.Coordinate = function(X,Y){
    var x = (this.coordX - 1  ) * LengthOfMove + moveDeviation;
    var y = (this.coordY - 1 ) * LengthOfMove  + moveDeviation;
    this.id.style.top = y + 'px';
    this.id.style.left = x + 'px';
}

checker.prototype.newCoord = function(X,Y){
    this.coordY +=Y;
    this.coordX += X;
}

checker.prototype.King = function () {
    if(this.coordY == 8 && !this.king &&this.color == "white"){
        this.king = true;
        this.id.style.border = "4px solid red";
    }
    if(this.coordY == 1 && !this.king &&this.color == "black"){
        this.king = true;
        this.id.style.border = "4px solid red";
    }
}

for (var a = 1; a <=64; a++)
    block[a] =new squarePosition(unitClass[a],a);

for (var a = 1; a <= 4; a++){
    whiteChecker[a] = new checker(white_pieces[a], "white", 2*a );
    whiteChecker[a].Coordinate(0,0);
    block[2*a].ocupied = true;
    block[2*a].pieceId =whiteChecker[a];
}

for (var a = 5; a <= 8; a++){
    whiteChecker[a] = new checker(white_pieces[a], "white", 2*a- 1 );
    whiteChecker[a].Coordinate(0,0);
    block[2*a- 1].ocupied = true;
    block[2*a- 1].pieceId = whiteChecker[a];
}

for (var a = 9; a <= 12; a++){
    whiteChecker[a] = new checker(white_pieces[a], "white", 2*a );
    whiteChecker[a].Coordinate(0,0);
    block[2*a].ocupied = true;
    block[2*a].pieceId = whiteChecker[a];
}

for (var a = 1; a <= 4; a++){
    blackChecker[a] = new checker(black_pieces[a], "black", 55+2*a);
    blackChecker[a].Coordinate(0,0);
    block[55+2*a].ocupied = true;
    block[55+2*a].pieceId =blackChecker[a];
}

for (var a = 5; a <= 8; a++){
    blackChecker[a] = new checker(black_pieces[a], "black", 40+2*a);
    blackChecker[a].Coordinate(0,0);
    block[40+2*a].ocupied = true;
    block[40+2*a].pieceId = blackChecker[a];
}

for (var a = 9; a <= 12; a++){
    blackChecker[a] = new checker(black_pieces[a], "black", 23+2*a);
    blackChecker[a].Coordinate(0,0);
    block[23+2*a].ocupied = true;
    block[23+2*a].pieceId = blackChecker[a];
}

the_checker = whiteChecker;

function possibleMoves (piece) {
    var match = false;
    attack = false;
    if(pieceSelected){
        delete_checker(pieceSelected);
    }
    pieceSelected = piece;
    var a,j;
    for ( j = 1; j <= 12; j++){
        if(the_checker[j].id == piece){
            a = j;
            pieceSelectedIndex = j;
            match = true;
        }
    }

    if(oneMove && !attackMoves(oneMove)){
        turn(oneMove);
        oneMove = undefined;
        return false;
    }
    if(oneMove && oneMove != the_checker[i] ){
        return false;
    }

    if(!match) {
        return 0 ;
    }

    if(the_checker[a].color =="white"){
        tableLimit = 8;
        tableLimitRight = 1;
        tableLimitLeft = 8;
        moveUpRight = 7;
        moveUpLeft = 9;
        moveDownRight = - 9;
        moveDownLeft = -7;
    }
    else{
        tableLimit = 1;
        tableLimitRight = 8;
        tableLimitLeft = 1;
        moveUpRight = -7;
        moveUpLeft = -9;
        moveDownRight = 9;
        moveDownLeft = 7;
    }

    attackMoves(the_checker[a]);

    if(!attack){
        downLeft = checkMove( the_checker[a] , tableLimit , tableLimitRight , moveUpRight , downLeft);
        downRight = checkMove( the_checker[a] , tableLimit , tableLimitLeft , moveUpLeft , downRight);
        if(the_checker[a].king){
            upLeft = checkMove( the_checker[a] , reverse_tableLimit , tableLimitRight , moveDownRight , upLeft);
            upRight = checkMove( the_checker[a], reverse_tableLimit , tableLimitLeft , moveDownLeft, upRight)
        }
    }
    if(downLeft || downRight || upLeft || upRight){
        return true;
    }
    return false;

}

function delete_checker(piece){
    if(downRight) block[downRight].id.style.background = "saddlebrown";
    if(downLeft) block[downLeft].id.style.background = "saddlebrown";
    if(upRight) block[upRight].id.style.background = "saddlebrown";
    if(upLeft) block[upLeft].id.style.background = "saddlebrown";
}

function menMove (index) {
    var isMove = false;
    if(!pieceSelected)
        return false;
    if(index != upLeft && index != upRight && index != downLeft && index != downRight){
        delete_checker(0);
        pieceSelected = undefined;
        return false;
    }

    if(the_checker[1].color=="white"){
        cpy_downRight = upRight;
        cpy_downLeft = upLeft;
        cpy_upLeft = downLeft;
        cpy_upRight = downRight;
    }
    else{
        cpy_downRight = upLeft;
        cpy_downLeft = upRight;
        cpy_upLeft = downRight;
        cpy_upRight = downLeft;
    }

    if(attack)
        multiplier = 2;
    else
        multiplier = 1;

    if(index == cpy_upRight){
        isMove = true;
        if(the_checker[1].color=="white"){
            executeMove( multiplier * 1, multiplier * 1, multiplier * 9 );
            if(attack) eliminateCheck(index - 9);
        }
        else{
            executeMove( multiplier * 1, multiplier * -1, multiplier * -7);
            if(attack) eliminateCheck( index + 7 );
        }
    }

    if(index == cpy_upLeft){

        isMove = true;
        if(the_checker[1].color=="white"){
            executeMove( multiplier * -1, multiplier * 1, multiplier * 7);
            if(attack)	eliminateCheck(index - 7 );
        }
        else{
            executeMove( multiplier * -1, multiplier * -1, multiplier * -9);
            if (attack) eliminateCheck( index + 9 );
        }
    }

    if(the_checker[pieceSelectedIndex].king){

        if(index == cpy_downRight){
            isMove = true;
            if(the_checker[1].color=="white"){
                executeMove( multiplier * 1, multiplier * -1, multiplier * -7);
                if(attack) eliminateCheck ( index  + 7) ;
            }
            else{
                executeMove( multiplier * 1, multiplier * 1, multiplier * 9);
                if(attack) eliminateCheck ( index  - 9) ;
            }
        }

        if(index == cpy_downLeft){
            isMove = true;
            if(the_checker[1].color=="white"){
                executeMove( multiplier * -1, multiplier * -1, multiplier * -9);
                if(attack) eliminateCheck ( index  + 9) ;
            }
            else{
                executeMove( multiplier * -1, multiplier * 1, multiplier * 7);
                if(attack) eliminateCheck ( index  - 7) ;
            }
        }
    }

    delete_checker(0);
    the_checker[pieceSelectedIndex].King();

    if (isMove) {
        otherMove = undefined;
        if(attack) {
            otherMove = attackMoves(the_checker[pieceSelectedIndex]);
        }
        if (otherMove){
            oneMove = the_checker[pieceSelectedIndex];
            possibleMoves(oneMove);
        }
        else{
            oneMove = undefined;
            turn(the_checker[1]);
        }
    }
}

function executeMove (X,Y,nSquare){
    the_checker[pieceSelectedIndex].newCoord(X,Y);
    the_checker[pieceSelectedIndex].Coordinate(0,0);
    block[the_checker[pieceSelectedIndex].ocupied_square].ocupied = false;
    block[the_checker[pieceSelectedIndex].ocupied_square + nSquare].ocupied = true;
    block[the_checker[pieceSelectedIndex].ocupied_square + nSquare].pieceId = 	block[the_checker[pieceSelectedIndex].ocupied_square ].pieceId;
    block[the_checker[pieceSelectedIndex].ocupied_square ].pieceId = undefined;
    the_checker[pieceSelectedIndex].ocupied_square += nSquare;

}

function checkMove(Apiece,tLimit,tLimit_Side,moveDirection,theDirection){
    if(Apiece.coordY != tLimit){
        if(Apiece.coordX != tLimit_Side && !block[ Apiece.ocupied_square + moveDirection ].ocupied){
            block[ Apiece.ocupied_square + moveDirection ].id.style.background = "#704923";
            theDirection = Apiece.ocupied_square + moveDirection;
        }
        else
            theDirection = undefined;
    }
    else
        theDirection = undefined;
    return theDirection;
}



function  checkAttack( check , X, Y , negX , negY, squareMove, direction){
    if(check.coordX * negX >= 	X * negX && check.coordY *negY <= Y * negY && block[check.ocupied_square + squareMove ].ocupied && block[check.ocupied_square + squareMove].pieceId.color != check.color && !block[check.ocupied_square + squareMove * 2 ].ocupied){
        attack = true;
        direction = check.ocupied_square +  squareMove*2 ;
        block[direction].id.style.background = "#704923";
        return direction ;
    }
    else
        direction =  undefined;
    return direction;
}

function eliminateCheck(indexx){
    if(indexx < 1 || indexx > 64)
        return  0;

    var x =block[ indexx ].pieceId ;
    x.alive =false;
    block[ indexx ].ocupied = false;
    x.id.style.display  = "none";
}

function attackMoves(ckc){

    upRight = undefined;
    upLeft = undefined;
    downRight = undefined;
    downLeft = undefined;

    if(ckc.king ){
        if(ckc.color == "white"){
            upRight = checkAttack( ckc , 6, 3 , -1 , -1 , -7, upRight );
            upLeft = checkAttack( ckc, 3 , 3 , 1 , -1 , -9 , upLeft );
        }
        else{
            downLeft = checkAttack( ckc , 3, 6, 1 , 1 , 7 , downLeft );
            downRight = checkAttack( ckc , 6 , 6 , -1, 1 ,9 , downRight );
        }
    }
    if(ckc.color == "white"){
        downLeft = checkAttack( ckc , 3, 6, 1 , 1 , 7 , downLeft );
        downRight = checkAttack( ckc , 6 , 6 , -1, 1 ,9 , downRight );
    }
    else{
        upRight = checkAttack( ckc , 6, 3 , -1 , -1 , -7, upRight );
        upLeft = checkAttack( ckc, 3 , 3 , 1 , -1 , -9 , upLeft );
    }

    if(ckc.color== "black" && (upRight || upLeft || downLeft || downRight ) ) {
        var p = upLeft;
        upLeft = downLeft;
        downLeft = p;

        p = upRight;
        upRight = downRight;
        downRight = p;

        p = downLeft ;
        downLeft = downRight;
        downRight = p;

        p = upRight ;
        upRight = upLeft;
        upLeft = p;
    }
    if(upLeft != undefined || upRight != undefined || downRight != undefined || downLeft != undefined){
        return true;

    }
    return false;
}

function turn(ckc){
    if(ckc.color=="white")
        the_checker = blackChecker;
    else
        the_checker = whiteChecker;
}
