// sudoku_script.js

/**************************GLOBAL VARIABLES & INITIALIZATION********************/
//declare a 2D array that will hold the current game state
var board = new Array(9);
for(i = 0; i < 9; i++)
{
	board[i] = new Array(9);
}
for(i = 0; i < 9; i++)
{
	for(j = 0; j < 9; j++)
	{
		board[i][j] = 0;
	}
}
var solnBoard = new Array(9);//declare another to hold a solution
for(i = 0; i < 9; i++)
{
	solnBoard[i] = new Array(9);
}
for(i = 0; i < 9; i++)
{
	for(j = 0; j < 9; j++)
	{
		solnBoard[i][j] = 0;
	}
}

var undefined = 0;//to find blank cells
var parentOfInput;//to get column index
var parentOfTd;//to get row index
var tableRow, tableCol;//store the row and column
/******************************************************************************/


/********************TABLE FORMATTING, GAME MANAGEMENT*************************/
function newGame()
{
	//clear the board first
	//populate with numbers
	//format the board so zeroes aren't displayed & inserted values are read-only
	//puzzle difficulty will vary...
	clearTable();
	insertValues();
	editTable();
}
function insertToArray(value)
{
	//take the value inserted into the cell
	//and insert into the board array (on key up)
	//if cell contains "" set the array entry to 0
	var a = value;
	//get the cell position using parentNode
	tableCol = parentOfInput.cellIndex;
	tableRow = parentOfTd.rowIndex;
	
	if(a != "")
	{
		board[tableRow][tableCol] = a;
	}
	else
	{
		board[tableRow][tableCol] = 0;
	}
}
function returnParent(x)
{
	parentOfInput = null;
	parentOfTd = null;
	parentOfInput = x.parentNode;
	parentOfTd = parentOfInput.parentNode;
}
function checkGame()
{
	if(isDone())//check the entire board for errors in entries
	{
		document.getElementById("statusNote").innerHTML = "Solved &#10004;";
	}
	else
	{ 
		//check for correctness in entires
		//its ok if the entire board isnt filled out
		//first check for correctness based on a solution
		if(!isOk())
		{
			var x = document.getElementById('statusNote').innerHTML = "Problem!";
			//document.getElementById("statusNote").innerHTML = "Incorrect...";
		}
		else
		{
			document.getElementById("statusNote").innerHTML = "Ok";
			
			//document.getElementById("statusNote").innerHTML = "Ok!";
		}
	}
}
function clearTable()
{
	//clear the table (current game)
	var table = document.getElementById("mainTable").rows;
	var y;
	var data;
	for(i = 0; i < 9; i++)
	{
		for(j = 0; j < 9; j++)
		{
			y = table[i].cells;//now were in row of cells
			y[j].children[0].value = "";
		}
	}
	//clear the data structures as well
	for(i = 0; i < 9; i++)
	{	
		for(j = 0; j < 9; j++)
		{
			board[i][j] = 0;
			solnBoard[i][j] = 0;
		}
	}
}
function editTable()
{
	//after initial values are inserted
	//go thru the table, check if a number already exists
	//if so, make it readonly
	//document.getElementById("mainTable").contentEditable = true;//ok
	var table = document.getElementById("mainTable").rows;
	var y;
	for(i = 0; i < 9; i++)
	{
		for(j = 0; j < 9; j++)
		{
			y = table[i].cells;//now were in row of cells
			if(y[j].children[0].value != "")//access the input
			{
				y[j].children[0].readOnly = true;
			}
		}
	}
}
function isDone()
{
	//check if all cells have been filled
	return (board == solnBoard);
}
function isOk()
{
	//its ok if the entire board isn't filled
	//just check for correctness for a new value entered
	//compare the current board with solution board
	//using only positive values
	tableCol = parentOfInput.cellIndex;
	tableRow = parentOfTd.rowIndex;
	var value = board[tableRow][tableCol];
	if(value > 0)
	{
		//compare with solution board
		if(value == solnBoard[tableRow][tableCol])
		{
			return true;
		}
	}
	else
	{
		return false;
	}
}
/************************************************************************************/



/***************************NEW SUDOKU GAME CREATION*********************************/
function insertValues()
{
	//insert the initial values for the new game
	//use an array for this...
	//then call strikeoutcells()
	//then insert to the table 
	//if board[i][j] > 0, insert, otherwise leave it blank
	var table = document.getElementById("mainTable").rows;
	var y;
	//generate a valid initial sudoku board
	//genNumber();
	//shift and interchance columns and rows
	
	fillSudoku(board, 0, 0);
	var b = Math.floor((Math.random() * 12) + 40);
	for(i = 0; i < 10; i++)
	{
		var s = Math.floor((Math.random() * 5) + 0);
		switch(s)
		{
			case 1:
			{
				board = colSwap(board);
				break;
			}
			case 2:
			{
				board = rowSwap(board);
				break;
			}
			case 3:
			{
				board = swapBigRows(board);
				break;
			}
			case 4:
			{
				board = swapBigCols(board);
				break;
			}
			default:
			{
				board = transpose(board);
				break;
			}
		}
	}
	
	//keep generating and swapping/shiffling until we have a solveable puzzle
	//set our solution board
	
	for(i = 0; i < 9; i++)
	{
		for(j = 0; j < 9; j++)
		{
			solnBoard[i][j] = board[i][j];
		}
	}
	Object.seal(solnBoard);
	//strike out cells
	board = strikeOutCells(board);

	for(i = 0; i < 9; i++)
	{
		for(j = 0; j < 9; j++)
		{
			y = table[i].cells;
			if(board[i][j] > 0)
			{
				y[j].children[0].value = board[i][j];
			}
		}
	}
}
function genNumber()
{
	//start with a valid board (satifies all conditions) like so:
	var row1, row2, row3, row4, row5, row6, row7, row8, row9;
	row1 = [1,2,3,4,5,6,7,8,9];
	row2 = [4,5,6,7,8,9,1,2,3];
	row3 = [7,8,9,1,2,3,4,5,6];
	row4 = [2,3,4,5,6,7,8,9,1];
	row5 = [5,6,7,8,9,1,2,3,4];
	row6 = [8,9,1,2,3,4,5,6,7];
	row7 = [3,4,5,6,7,8,9,1,2];
	row8 = [6,7,8,9,1,2,3,4,5];
	row9 = [9,1,2,3,4,5,6,7,8];
	var initial = [row1, row2, row3, row4, row5, row6, row7, row8, row9];
	for(i = 0; i < 9; i++)
	{
		for(j = 0; j < 9; j++)
		{
			board[i][j] = initial[i][j];
		}
	}
}
function rowSwap(array)
{
	//swap two rows within the same group
	var a = Math.floor((Math.random() * 9) + 0);
	var b = Math.floor((Math.random() * 9) + 0);
	while (!allowed(a,b))
	{
		b = Math.floor((Math.random() * 9) + 0);
	}
	var x = 0;
	var y = 0;
	if(a > b)
	{
		x = b;
		y = a;
	}
	else
	{
		x = a;
		y = b;
	}
	//use a buffer
	var temp = new Array(9);
	for(i = 0; i < 9; i++)
	{
		temp[i] = new Array(9);
	}
	for(i = 0; i < 9; i++)
	{
		for(j = 0; j < 9; j++)
		{
			temp[i][j] = 0;
		}
	}
	//copy contents over to buffer
	for (j = 0; j < 9; j++)
	{
		temp[y][j] = array[x][j];
	}
	for (j = 0; j < 9; j++)
	{
		temp[x][j] = array[y][j];
	}
	//copy back to array
	for (j = 0; j < 9; j++)
	{
		array[y][j] = temp[y][j];
	}
	for (j = 0; j < 9; j++)
	{
		array[x][j] = temp[x][j];
	}
	return array;
}
function colSwap(array)
{
	//swap two columns within the same group
	var a = Math.floor((Math.random() * 9));
	var b = Math.floor((Math.random() * 9));
	while (!allowed(a,b))
	{
		b = Math.floor((Math.random() * 9));
	}
	var x = 0;
	var y = 0;
	if(a > b)
	{
		x = b;
		y = a;
	}
	else
	{
		x = a;
		y = b;
	}
	//buffer
	var temp = new Array(9);
	for(i = 0; i < 9; i++)
	{
		temp[i] = new Array(9);
	}
	for(i = 0; i < 9; i++)
	{
		for(j = 0; j < 9; j++)
		{
			temp[i][j] = 0;
		}
	}

	//copy to buffer
	//start
	for (j = 0; j < 9; j++)
	{
		temp[j][x] = array[j][y];
	}
	//copy to buffer
	//end
	for (j = 0; j < 9; j++)
	{
		temp[j][y] = array[j][x];
	}
	//copy back to array
	for (j = 0; j < 9; j++)
	{
		array[j][x] = temp[j][x];
	}
	for (j = 0; j < 9; j++)
	{
		array[j][y] = temp[j][y];
	}
	return array;
}  
function swapBigRows(array)
{
	var temp = new Array(9);
	for(i = 0; i < 9; i++)
	{
		temp[i] = new Array(9);
	}
	for(i = 0; i < 9; i++)
	{
		for(j = 0; j < 9; j++)
		{
			temp[i][j] = 0;
		}
	}
	var a = Math.floor((Math.random() * 3));
	var b = Math.floor((Math.random() * 3));
	var indexes = [0,3,6];
	if (a == b)
	{
		while (a == b)
		{
			b = Math.floor((Math.random() * 2));
		}
	}
	var start = indexes[a];//we've chosen a starting big row group
	var end = indexes[b];//and a target big row group to swap with
	var x = 0, y = 0;
	if(start - 3 > end)
	{
		x = end;
        y = end + start;
	}
	if(start - 3 == end)
	{
		x = end;
        y = start;
	}
	if(start < end)
	{
		x = start;
		y = end;
	}
	
	//copy contents over to temp
	for(i = x; i < x + 3; i++)
	{
		for(j = 0; j < 9; j++)
		{
			temp[i + y][j] = array[i][j];
		}
	}
	//copy end contents over to temp as well
	for(i = y; i < y + 3; i++)
	{
		for(j = 0; j < 9; j++)
		{
			temp[i - y][j] = array[i][j];
		}
	}
	//copy back swapped group rows to array
	for(i = x; i < x + 3; i++)
	{
		for(j = 0; j < 9; j++)
		{
			array[i][j] = temp[i][j];
		}
	}
	for(i = y; i < y + 3; i++)
	{
		for(j = 0; j < 9; j++)
		{
			array[i][j] = temp[i][j];
		}
	}
	return array;
}   
function swapBigCols(array)
{
	var temp = new Array(9);

	for(i = 0; i < 9; i++)
	{
		temp[i] = new Array(9);
	}
	for(i = 0; i < 9; i++)
	{
		for(j = 0; j < 9; j++)
		{
			temp[i][j] = 0;
		}
	}
	var a = Math.floor((Math.random() * 3));
	var b = Math.floor((Math.random() * 3));
	var indexes = [0,3,6];
	if (a == b)
	{
		while (a == b)
		{
			b = Math.floor((Math.random() * 2));
		}
	}
	var start = indexes[a];//we've chosen a starting big row group
	var end = indexes[b];//and a target big row group to swap with
	var x = 0;
	var y = 0;

	if (start - 3 > end)
	{
		x = end;
		y = end + start;
	}
	if (start - 3 == end)
	{
		x = end;
		y = start;
	}
	if (start - 6 == end)//like 6, 0
	{
		x = end;
		y = start;
		for (i = x; i < x + 3; i++)
		{
			for (j = 0; j < 9; j++)
			{
				temp[j, i + 6] = array[j, i];
			}
		}
		//copy end contents over to temp as well
		//end
		for (i = y; i < y + 3; i++)
		{
			for (j = 0; j < 9; j++)
			{
				temp[j, i - 6] = array[j, i];
			}
		}
		//copy back to array, start from temp
		for (i = x; i < x + 3; i++)
		{
			for (j = 0; j < 9; j++)
			{
				array[j, i] = temp[j, i];
			}
		}
		for (i = y; i < y + 3; i++)
		{
			for (j = 0; j < 9; j++)
			{
				array[j, i] = temp[j, i];
			}
		}
		return array;
	}
	if (start + 6 == end)//like 0, 6
	{
		x = start;
		y = end;
		for (i = x; i < x + 3; i++)
		{
			for (j = 0; j < 9; j++)
			{
				temp[j, i + 6] = array[j, i];
			}
		}
		//copy end contents over to temp as well
		//end
		for (i = y; i < y + 3; i++)
		{
			for (j = 0; j < 9; j++)
			{
				temp[j, i - 6] = array[j, i];
			}
		}
		//copy back to array, start from temp
		for (i = x; i < x + 3; i++)
		{
			for (j = 0; j < 9; j++)
			{
				array[j, i] = temp[j, i];
			}
		}
		for (i = y; i < y + 3; i++)
		{
			for (j = 0; j < 9; j++)
			{
				array[j, i] = temp[j, i];
			}
		}
		return array;
	}
	if (start < end)
	{
		x = start;
		y = end;
	}
	//copy contents over to temp & shift
	//start
	for (i = x; i < x + 3; i++)
	{
		for (j = 0; j < 9; j++)
		{
			temp[j, i + 3] = array[j, i];
		}
	}
	//copy end contents over to temp as well
	//end
	for (i = y; i < y + 3; i++)
	{
		for (j = 0; j < 9; j++)
		{
			temp[j, i - 3] = array[j, i];
		}
	}
	//copy back swapped group rows to array
	for (i = x; i < x + 3; i++)
	{
		for (j = 0; j < 9; j++)
		{
			array[j, i] = temp[j, i];
		}
	}
	for (i = y; i < y + 3; i++)
	{
		for (j = 0; j < 9; j++)
		{
			array[j,i] = temp[j, i];
		}
	}
	return array;
}
function transpose(array)
{
	//transpose the board (like a matrix)
	//create a new 2D array to hold the transpose
	//return it after the transformation
	var transformed = new Array(9);
	for(i = 0; i < 9; i++)
	{
		transformed[i] = new Array(9);
	}
	for(i = 0; i < 9; i++)
	{
		for(j = 0; j < 9; j++)
		{
			transformed[i][j] = 0;
		}
	}
	//transpose the array passed in
	for(i = 0; i < 9; i++)
	{
		for(j = 0; j < 9; j++)
		{
			transformed[i][j] = board[j][i];
		}
	}
	return transformed;
}
function allowed(a, b)
{
	if ((a == 0) || (a == 3) || (a == 6))
	{
		if ((b == a + 1) || (b == a + 2))
		{
			return true;
		}
	}

	if ((a == 1) || (a == 4) || (a == 7))
	{
		if ((b == a - 1) || (b == a + 1))
		{
			return true;
		}
	}
	if ((a == 2) || (a == 5) || (a == 8))
	{
		if ((b == a - 1) || (b == a - 2))
		{
			return true;
		}
	}
	else
	{
		return false;
	}
}
function strikeOutCells(array)
{
	var eraseAmount = Math.floor((Math.random() * 20) + 55);
	var counter = 0;
	var checked = new Array(9);
	for(i = 0; i < 9; i++)
	{
		checked[i] = new Array(9);
	}
	for(i = 0; i < 9; i++)
	{
		for(j = 0; j < 9; j++)
		{
			checked[i][j] = false;
		}
	}
	while(counter < eraseAmount)
	{
		var xRow = Math.floor((Math.random() * 9) + 0);
		var xCol = Math.floor((Math.random() * 9) + 0);
		if(!checked[xRow][xCol])
		{
			array[xRow][xCol] = 0;
			checked[xRow][xCol] == true;
			counter++;
		}
	}
	return array;	
}
function isAvailable(array, row, col, num)
{
	var rowStart = Math.floor(row / 3) * 3;
	var colStart = Math.floor(col / 3) * 3;
	var i, j;
	for(i=0; i<9; ++i)
    {
        if (array[row][i] == num) 
		{
			return 0;
		}
        if (array[i][col] == num) 
		{
			return 0;
		}
        if (array[rowStart + (i%3)][colStart + Math.floor(i/3)] == num) 
		{
			return 0;
		}
    }
    return 1;
}
function fillSudoku(array, row, col)
{
	var i;
    if(row<9 && col<9)
    {
        if(array[row][col] != 0)
        {
            if((col+1)<9) 
			{
				return fillSudoku(array, row, col+1);
			}
            else if((row+1)<9) 
			{
				return fillSudoku(array, row+1, 0);
			}
            else 
			{
				return 1;
			}
        }
        else
        {
            for(i=0; i<9; ++i)
            {
				var x = Math.floor((Math.random() * 9) + 1);
                if(isAvailable(array, row, col, x))//i+1
                {
                    array[row][col] = x;//i+1
                    if((col+1)<9)
                    {
                        if(fillSudoku(array, row, col +1)) 
						{
							return 1;
						}
                        else 
						{
							array[row][col] = 0;
						}
                    }
                    else if((row+1)<9)
                    {
                        if(fillSudoku(array, row+1, 0)) 
						{
							return 1;
						}
                        else 
						{
							array[row][col] = 0;
						}
                    }
                    else 
					{
						return 1;
					}
                }
            }
        }
        return 0;
    }
    else 
	{
		return 1;
	}
}
function saveGame()
{
	//use localStorage
	localStorage.clear();
	localStorage.setItem("gameBoard", JSON.stringify(board));
	localStorage.setItem("solution", JSON.stringify(solnBoard));
}
function loadGame()
{
	//use localStorage
	//display the board
	//clear the table
	
	board = JSON.parse(localStorage.getItem("gameBoard"));
	solnBoard = JSON.parse(localStorage.getItem("solution"));
	Object.seal(solnBoard);
	
	var table = document.getElementById("mainTable").rows;
	var y;
	//clear table first
	for(i = 0; i < 9; i++)
	{
		for(j = 0; j < 9; j++)
		{
			y = table[i].cells;
			y[j].children[0].value = "";
		}
	}
	for(i = 0; i < 9; i++)
	{
		for(j = 0; j < 9; j++)
		{
			y = table[i].cells;
			if(board[i][j] > 0)
			{
				y[j].children[0].value = board[i][j];
			}
		}
	}
	editTable();
}
function showHelp()
{
	// Get the button that opens the modal
	//var btn = document.getElementById('helpBtn');
	
	var modal = document.getElementById('helpDiag');

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	// When the user clicks on the button, open the modal
	/*btn.onclick = function() 
	{
    	
	}*/
	modal.style.display = "block";
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() 
	{
    	modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) 
	{
    	if (event.target == modal) 
		{
        	modal.style.display = "none";
    	}
	}
}
/**************************************END OF CODE******************************************/