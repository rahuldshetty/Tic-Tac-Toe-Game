
var turn='X';

var gameOver=false;

//For the bot
var hUplayer='X',aiPlayer='O';

function isLeftEmpty(board){
    var res;
    for(var i=0;i<3;i++)
        for(var j=0;j<3;j++)
            if(board[i][j]=='_')
                return true;
    return false;
}


function winning(board,mover){
    //for row calc
    for(var row=0;row<3;row++)
    {
        if (board[row][0]==board[row][1]  && board[row][1]==board[row][2])
        {
            if(board[row][0]==mover)
                return true;
        }
    }
    //for col
    for(var col=0;col<3;col++)
    {
        if (board[0][col]==board[1][col]  && board[1][col]==board[2][col])
        {
            if(board[0][col]==mover)
                return true;
        }
    }
    //diagonal
    if(board[0][0]==board[1][1] && board[1][1]==board[2][2])
    {
        if(board[0][0]==mover)
            return true;
    }
    if(board[0][2]==board[1][1] && board[1][1]==board[2][0])
    {
        if(board[0][2]==mover)
            return true;
    }
    //no conditions
    return false;
}

function minmax(newBoard,mover){
    if(winning(newBoard,hUplayer))
        return {score:-10};
    else if(winning(newBoard,aiPlayer))
        return {score:10};
    else if(isLeftEmpty(newBoard)==false)
        return {score:0};
    
    var moves=[];

    for(var i=0;i<3;i++)
    {
        for(var j=0;j<3;j++)
        {
            if(newBoard[i][j]=='_')
            {
                //if there is an empty cell
                newBoard[i][j]=mover;
                var move={};
                move.x  =i;
                move.y=j;
                if(mover==aiPlayer)
                {
                    var result=minmax(newBoard,hUplayer);
                    move.score=result.score;
                }
                else{
                    var result=minmax(newBoard,aiPlayer);
                    move.score=result.score;
                }
                newBoard[i][j]='_';
                moves.push(move);

            }

        }
    }  
    
    var bestMove=0;
    if(mover==aiPlayer){
        var bestScore=-10000;
        for(var i=0;i<moves.length;i++)
        {
            if(moves[i].score > bestScore)
            {
                bestScore = moves[i].score;
                bestMove=i;
            }
        }
    }
    else{
        var bestScore=10000;
        for(var i=0;i<moves.length;i++)
        {
            if(moves[i].score < bestScore)
            {
                bestScore = moves[i].score;
                bestMove=i;
            }
        }
    }
    return moves[bestMove]; 

}

function place(){    
    var board=getBoard();
    var moves=minmax(board,aiPlayer);
    console.log(moves);
    var pos=moves.x*3+moves.y+1;
    clicked(pos);
}

function getCellChar(id){
    var ele=document.getElementById(id);
    if(ele.innerText!='X' && ele.innerText!='O')
        return '_';
    else
        return ele.innerText;
}


function getBoard(){
    var pos=1;
    var array=[];
    for(var i=0;i<3;i++)
    {
        var temp=[];
        for(var j=0;j<3;j++)
        {
            var char=getCellChar(pos.toString());
            temp.push(char);
            pos++;
        } 
        array.push(temp);           
    }
    return array;
}

function updateGUI(){
    var messageBox1=document.getElementById('prompt1');
    var messageBox2=document.getElementById('prompt2');
    var str;
    if(turn=='X')
    {
        messageBox1.style.color="#66BB6A";
        messageBox2.style.color="#000";
    }
    else 
    {
        messageBox2.style.color="#66BB6A";
        messageBox1.style.color="#000";
    }
   

}

function checkWin(mover){
    if(winning(getBoard(),mover))
        return true;
    return false;
}

function clicked(id){
    if(!gameOver)
    {
        var id=id.toString();
        var ele=document.getElementById(id);
        var wintext=document.getElementById('winstatus');
        var radiobot=document.getElementById('r1');


        if(ele.innerText!='X' && ele.innerText!='O'){
            ele.innerHTML=turn;
            if(turn=='O'){
                ele.style.color="#2196F3";        
            }
            else{
                ele.style.color="#673AB7";
            }
            
            if(turn=='X')turn='O';
            else turn='X';

            if(checkWin(hUplayer))
            {
                //human wins
                wintext.innerHTML="You might have won this time...";
                wintext.style.color="#4CAF50";
                gameOver=true;
            }

            //for bot playing
            if(turn=='O' && radiobot.checked  && isLeftEmpty(getBoard()))
            {
                turn='O';
                place();
                turn='X';
            }
            if(checkWin(aiPlayer))
            {
                //ai wins
                wintext.innerHTML="You are Defeated!!";
                wintext.style.color="#f44336";
                gameOver=true;
            }

            if(isLeftEmpty(getBoard())==false)
            {
                //draw
                wintext.innerHTML="This is a draw match.";
                wintext.style.color='#607D8B';
                gameOver=true;
            }

            
        }
        else
        {
            window.alert('You cannot place here...');
        }
        updateGUI();
    }
}

function resetGame(){
    turn='X';
    gameOver=false;
    var wintext=document.getElementById('winstatus');
    wintext.innerHTML="";
    for(var i=1;i<=9;i++)
    {
        var ele=document.getElementById(i.toString());
        ele.innerHTML="";
    }
    updateGUI();

}