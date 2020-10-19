 /*
     some utility funnctions 
   */
 $ = {};

 if ($.redirect == undefined)
     $.redirect = (url) => {
         document.location = url;
     }

 if ($.toggleClass == undefined)
     $.toggleClass = (el, className) => {
         el.classList.toggle(className);
     };
 if ($.select == undefined)
     $.select = (selector) => {
         return document.querySelector(selector);
     };
 if ($.selectAll == undefined)
     $.selectAll = (selector) => {
         return document.querySelectorAll(selector);
     };

 if ($.clone == undefined)
     $.clone = (aObject) => {
         if (!aObject)
             return aObject;

         let v;
         let bObject = Array.isArray(aObject) ? [] : {};
         for (const k in aObject) {
             v = aObject[k];
             bObject[k] = (typeof v === "object") ? $.clone(v) : v;
         }

         return bObject;
     }

 /****************/

 var board = {};
 var boardRef;
 var piecesRefs = [];
 var piecesSets = [
     //set1
     {
         //side1
         '0': '',
         '1': 'pawn1',
         '2': 'rook1',
         '3': 'knight1',
         '4': 'bishop1',
         '5': 'king1',
         '6': 'queen1',
         //side2
         '-1': 'pawn2',
         '-2': 'rook2',
         '-3': 'knight2',
         '-4': 'bishop2',
         '-5': 'king2',
         '-6': 'queen2'
     }
 ];
 var iconsSet = piecesSets[0];

 var boardPos = gameDetails.board;
 /* [
   [2,3,4,5,6,4,3,2] ,
   [1,1,1,1,1,1,1,1] ,
   [0,0,0,0,0,0,0,0] ,
   [0,0,0,0,0,0,0,0] ,
   [0,0,0,0,0,0,0,0] ,
   [0,0,0,0,0,0,0,0] ,
   [-1,-1,-1,-1,-1,-1,-1,-1] ,
   [-2,-3,-4,-6,-5,-4,-3,-2] 
 ]; */

 var activePiece;
 var playerSide;
 var playerTurn = {
     val: undefined,
     turn: (t) => {
         if (t == undefined) return this.val;
         else this.val = t;
     },
     update: (game) => {
         if (username == game.turn)
             this.val = 1;
         else
             this.val = -1;
     },
     toggle: () => {
         this.val = this.val * -1;
     }
 };

 function setBoard() {

     if (username == gameDetails.firstPlayer)
         playerSide = -1;
     else
         playerSide = 1;

     playerTurn.update(gameDetails);

     $.select('#opponent #name').innerHTML = gameDetails.firstPlayer;
     $.select('#im #name').innerHTML = gameDetails.secondPlayer;

     boardRef = document.querySelector('#board');
     var boardHtml = "";
     for (var i = 0; i < 8; i++)
         for (var j = 0; j < 8; j++) {
             var block = i % 2 == 0 ? (j % 2 == 0 ? 'block1' : 'block2') : (j % 2 == 0 ? 'block2' : 'block1');
             boardHtml += '<div onClick="handleBlockClick(this)" class="block ' + block + '" id="b' + i + '_' + j + '" row="' + i + '" col="' + j + '" ><div class="piece" row="' + i + '" col="' + j + '" id="b' + i + '_' + j + '"></div></div>';
         }
     boardRef.innerHTML = boardHtml;
     piecesRefs = document.querySelectorAll('.board .piece');
 }

 function updateBoard(piecesRefs, piecesPos) {
     console.log('updating .. ' + piecesRefs + ' ' + piecesPos);
     for (var i = 0; i < piecesRefs.length; i++) {
         var piece = piecesRefs[i];
         var row = piece.getAttribute('row');
         var col = piece.getAttribute('col');
         var cls = iconsSet[piecesPos[row][col]];
         piecesRefs[i].setAttribute('class', 'piece ' + cls);
     }
 }

 function handleBlockClick(block) {
     var child = block.childNodes[0];
     var row = child.getAttribute('row');
     var col = child.getAttribute('col');

     handlePieceClick(row, col);
 }

 function pieceAt(row, col) {
     var val = boardPos[row][col];
     var el = $.select('.piece[row="' + row + '"][col="' + col + '"]');

     var piece = {
         element: el,
         getElement: () => { return $.select('.piece[row="' + row + '"][col="' + col + '"]'); },
         row: row,
         col: col,
         val: val
     };
     piece.isWithinMoves = (posblMoves) => { isWithinMoves(row, col, posblMoves) };
     return piece;
 }

 function minPieceAt(row, col) {
     var val = boardPos[row][col];
     var piece = {
         element: undefined,
         getElement: () => { return $.select('.piece[row="' + this.row + '"][col="' + this.col + '"]'); },
         row: row,
         col: col,
         val: val
     };
     return piece;
 }

 function isWithinMoves(row, col, posblMoves) {
     for (var i = 0; i < posblMoves.length; i++)
         if (posblMoves[i][0] == row && posblMoves[i][1] == col)
             return true;
     return false;
 }

 function handlePieceClick(row, col) {

     var action = identifyAction(row, col);
     console.log('action ' + action);

     //doAction(action,row,col);

     if (!action == actions.INVALID)
         passAction(action, row, col);
 }

 function doAction(action, row, col) {
     if (action == actions.ACTIVATE_AND_SHOW_MOVES)
         activateAndShowValidMoves(row, col);
     else if (action == actions.PLAY_MOVE)
         playMove(row, col);
 }

 var actions = {
     INVALID: 0,
     ACTIVATE: 1,
     SHOW_MOVES: 2,
     ACTIVATE_AND_SHOW_MOVES: 3,
     PLAY_MOVE: 4,
 };

 function identifyAction(row, col) {
     var val = boardPos[row][col];
     console.log('val' + val + ' turn ' + playerTurn.turn());
     if (playerTurn.turn() < 0)
         return actions.INVALID;

     if (val * playerSide <= 0 && activePiece == undefined)
         return actions.INVALID
     else
     if (activePiece == undefined && val * playerSide > 0)
         return actions.ACTIVATE_AND_SHOW_MOVES;
     else
     if (boardPos[activePiece.row][activePiece.col] * val > 0)
         return actions.ACTIVATE_AND_SHOW_MOVES;
     else
         return actions.PLAY_MOVE;
 }
 var audio = {
     play: (action) => {
         let audio;
         if (action == 'click')
             audio = new Audio('../audio/click.mp3');
         else if (action == 'move')
             audio = new Audio('../audio/move.mp3');
         audio.play();
     }
 };

 function playMove(row, col) {

     let piece = pieceAt(row, col);
     if (activePiece != undefined && isWithinMoves(row, col, activePossibleMoves)) {
         $.toggleClass(activePiece.element, 'active');
         movePiece(activePiece, piece);
         clearPossibleMoves();
         activePiece = undefined;
         playerTurn.toggle();
         checkWin(piece);
     }
 }
 actions.LOOSE = 12;

 function checkWin(piece) {
     if (Math.abs(piece.val) == 5) {
         if (piece.val * playerSide < 0) {
             showWinMsg(true);
         } else
             showWinMsg(false);
     }
 }

 function showWinMsg(win) {
     Swal.fire({
         title: win ? '  Bravo  !!!' : ' Better luck next time !',
         text: win ? "You Have Won the game ." : "Your friend won the game . ",
         type: win ? 'success' : 'warning',
         showCancelButton: win ? true : false,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Exit the Game',
         allowOutsideClick: false
     }).then((result) => {
         if (result.value) {
             window.close();
         }
     });
 }

 function movePiece(from, to) {
     audio.play('move');

     var fromCls = iconsSet[boardPos[from.row][from.col]];
     var toCls = iconsSet[boardPos[to.row][to.col]];
     if (fromCls != '') {
         $.toggleClass(from.getElement(), fromCls);
     }
     if (toCls != '') {
         $.toggleClass(to.getElement(), toCls);
     }

     if (fromCls != '') {
         $.toggleClass(to.getElement(), fromCls);
         if (boardPos[to.row][to.col] != 0)
             updateOutDashBoard(to, to.val > 0 ? 1 : -1);

         var beforeBoard = $.clone(boardPos);
         boardPos[to.row][to.col] = boardPos[from.row][from.col];
         boardPos[from.row][from.col] = 0;
         moveHistory.updateHistory(to.val > 0 ? 1 : -1, from, to, beforeBoard);
         //togglePlayer();
     }

     //check for winner 

 }

 var movesHistory = [];
 var moveHistory = {
     updateHistory: (player, from, to, boardBefore, boardAfter) => {
         console.log('boardBefore :' + boardBefore);
         var move = {
             player: player,
             from: from,
             to: to,
             boardBefore: boardBefore,
             boardAfter: boardAfter
         }
         movesHistory.push(move);
     },
     undo: () => {
         var move = movesHistory.pop();
         updateBoard(piecesRefs, move.boardBefore);
         boardPos = $.clone(move.boardBefore);
         playerTurn.toggle();
     }
 };

 var activePossibleMoves;

 function int(val) {
     return parseInt(val);
 }

 function activateAndShowValidMoves(row, col) {
     if (activePiece != undefined)
         $.toggleClass(activePiece.element, 'active');
     activePiece = pieceAt(row, col);
     $.toggleClass(activePiece.element, 'active');

     var val = boardPos[row][col];
     console.log('val' + val);
     var posblMoves = moves.possibleMoves[val](boardPos, activePiece, int(row), int(col));
     console.log('psblmovs :' + JSON.stringify(posblMoves));

     showPossibleMoves(posblMoves);
 }

 function showPossibleMoves(posblMoves) {
     audio.play('click');

     //clear previous highlighted moves.
     clearPossibleMoves();

     //code to draw border on pices
     for (var i = 0; i < posblMoves.length; i++) {
         var row = posblMoves[i][0];
         var col = posblMoves[i][1];
         console.log(' style ' + '.piece[row="' + row + '"][col="' + col + '"]');
         $.toggleClass($.select('.piece[row="' + row + '"][col="' + col + '"]'), 'active-posib');
     }

     //store current highlighted moves;
     activePossibleMoves = posblMoves;
 }

 function clearPossibleMoves() {
     if (activePossibleMoves != undefined)
         for (var i = 0; i < activePossibleMoves.length; i++) {
             var row = activePossibleMoves[i][0];
             var col = activePossibleMoves[i][1];
             $.toggleClass($.select('.piece[row="' + row + '"][col="' + col + '"]'), 'active-posib');
         }
     activePossibleMoves = undefined;
 }


 var moves = {
     possibleMoves: {
         '0': [],
         '1': (boardPoss, piece, row, col) => {
             return moves.filters.boundaryFilter(moves.filters.pawnFilter([
                 [
                     [row + 1, col],
                     [row + 2, col]
                 ],
                 [
                     [row + 1, col - 1],
                     [row + 1, col + 1]
                 ]
             ], piece));
         },
         '2': (boardPoss, piece, row, col) => {
             return moves.filters.obstacleFilter(moves.filters.boundaryFilter(moves.crossRange([row + 1, col], [8, 8], [1, 0])), piece)
                 .concat(moves.filters.obstacleFilter(moves.filters.boundaryFilter(moves.crossRange([row, col + 1], [8, 8], [0, 1])), piece))
                 .concat(moves.filters.obstacleFilter(moves.filters.boundaryFilter(moves.crossRange([row, col - 1], [-1, -1], [0, -1])), piece))
                 .concat(moves.filters.obstacleFilter(moves.filters.boundaryFilter(moves.crossRange([row - 1, col], [-1, -1], [-1, 0])), piece));
         },
         '3': (boardPoss, piece, row, col) => {
             return moves.filters.selfFilter(moves.filters.boundaryFilter([
                 [row + 2, col + 1],
                 [row - 2, col + 1],
                 [row + 2, col - 1],
                 [row - 2, col - 1],
                 [row + 1, col + 2],
                 [row + 1, col - 2],
                 [row - 1, col + 2],
                 [row - 1, col - 2]
             ]), piece);
         },
         '4': (boardPoss, piece, row, col) => {
             return moves.filters.obstacleFilter(moves.filters.boundaryFilter(moves.crossRange([row + 1, col + 1], [8, 8], [1, 1])), piece)
                 .concat(moves.filters.obstacleFilter(moves.filters.boundaryFilter(moves.crossRange([row + 1, col - 1], [8, -8], [1, -1])), piece))
                 .concat(moves.filters.obstacleFilter(moves.filters.boundaryFilter(moves.crossRange([row - 1, col + 1], [-8, 8], [-1, 1])), piece))
                 .concat(moves.filters.obstacleFilter(moves.filters.boundaryFilter(moves.crossRange([row - 1, col - 1], [-8, -8], [-1, -1])), piece));
         },
         '5': (boardPoss, piece, row, col) => {
             return moves.filters.selfFilter(moves.filters.boundaryFilter([
                 [row + 1, col],
                 [row + 1, col + 1],
                 [row, col + 1],
                 [row - 1, col + 1],
                 [row - 1, col],
                 [row - 1, col - 1],
                 [row, col - 1],
                 [row + 1, col - 1]
             ]), piece);
         },
         '6': (boardPoss, piece, row, col) => {
             return moves.possibleMoves['2'](boardPoss, piece, row, col).concat(moves.possibleMoves['4'](boardPoss, piece, row, col));
         },
         '-1': (boardPoss, piece, row, col) => {
             return moves.filters.boundaryFilter(moves.filters.pawnFilter([
                 [
                     [row - 1, col],
                     [row - 2, col]
                 ],
                 [
                     [row - 1, col - 1],
                     [row - 1, col + 1]
                 ]
             ], piece));
         },
         '-2': (boardPoss, piece, row, col) => {
             return moves.possibleMoves['2'](boardPoss, piece, row, col);
         },
         '-3': (boardPoss, piece, row, col) => {
             return moves.possibleMoves['3'](boardPoss, piece, row, col);
         },
         '-4': (boardPoss, piece, row, col) => {
             return moves.possibleMoves['4'](boardPoss, piece, row, col);
         },
         '-5': (boardPoss, piece, row, col) => {
             return moves.possibleMoves['5'](boardPoss, piece, row, col);
         },
         '-6': (boardPoss, piece, row, col) => {
             return moves.possibleMoves['6'](boardPoss, piece, row, col);
         }
     },
 };

 moves.range = (start, end, step = 1) => {
     var range = [];
     for (var i = start; i < end; i = i + step)
         range.push(i);
     return range;
 };
 moves.crossRange = (start, end, step) => {

     var iter = 0;
     var range = [];

     for (var i = start[0], j = start[1];
         (step[0] == 0 ? true : step[0] > 0 ? i < end[0] : i > end[0]) && (step[1] == 0 ? true : step[1] >= 0 ? j < end[1] : j > end[1]); i += step[0], j += step[1]) {
         range.push([i, j]);
         if (iter++ > 100)
             break;
     }
     return range;

 };
 moves.filters = {
     boundaryFilter: (unfiltered) => {
         var filtered = [];
         for (var i = 0; i < unfiltered.length; i++)
             if (unfiltered[i][0] >= 0 && unfiltered[i][1] >= 0 && unfiltered[i][0] < 8 && unfiltered[i][1] < 8)
                 filtered.push(unfiltered[i]);
         return filtered;
     },
     obstacleFilter: (unfiltered, piece, flag) => {
         console.log('piece:' + piece + ' ' + flag);
         if (unfiltered == undefined)
             return [];

         var filtered = [];
         for (var i = 0; i < unfiltered.length; i++) {
             if (boardPos[unfiltered[i][0]][unfiltered[i][1]] == 0)
                 filtered.push(unfiltered[i]);
             else {
                 if (flag == undefined && boardPos[unfiltered[i][0]][unfiltered[i][1]] * piece.val <= 0)
                     filtered.push(unfiltered[i]);
                 break;
             }
         }
         return filtered;
     },
     selfFilter: (unfiltered, piece) => {
         var filtered = [];
         for (var i = 0; i < unfiltered.length; i++)
             if (boardPos[unfiltered[i][0]][unfiltered[i][1]] * piece.val <= 0)
                 filtered.push(unfiltered[i]);

         return filtered;
     },
     pawnFilter: (unfiltered, piece) => {
         var filtered = [];
         console.log(unfiltered + '\n' + piece.row);
         unfiltered[0] = moves.filters.obstacleFilter(unfiltered[0], true);
         if (unfiltered[0] != undefined && unfiltered[0].length > 0)
             if (piece.val > 0 ? piece.row == 1 : piece.row == 6)
                 filtered = filtered.concat(unfiltered[0]);
             else
                 filtered.push(unfiltered[0][0]);

         console.log(filtered);

         for (var i = 0; i < unfiltered[1].length; i++)
             if (boardPos[unfiltered[1][i][0]][unfiltered[1][i][1]] * piece.val < 0)
                 filtered.push(unfiltered[1][i]);

         return filtered;
     },
 };



 function updateOutDashBoard(piece, playerSide) {
     $.select('.out-list[playerSide="' + playerSide + '"]').innerHTML += '<div class="out-item ' + iconsSet[boardPos[piece.row][piece.col]] + '"></div>';
 }

 function togglePlayer() {
     playerSide = -1 * playerSide;
 }

 setBoard();
 updateBoard(piecesRefs, boardPos);

 //controls handlers
 actions.REQ_UNDO = 6;
 actions.DO_UNDO = 7;
 actions.REJECT_UNDO = 8;
 actions.ACC_UNDO = 9;

 var controls = {
     undo: () => {
         passControl(actions.REQ_UNDO);
     },
     pause() {
         Swal.fire({
             title: 'Game Paused',
             text: "",
             type: 'info',
             confirmButtonColor: '#3085d6',
             confirmButtonText: 'Resume the Game',
             allowOutsideClick: false,
         });
     },
     giveUp() {
         Swal.fire({
             title: 'Are you sure?',
             text: "You wan't to Give Up the game ...",
             type: 'warning',
             showCancelButton: true,
             confirmButtonColor: '#3085d6',
             cancelButtonColor: '#d33',
             confirmButtonText: 'Give Up'
         }).then((result) => {
             if (result.value) {
                 window.close();
             }
         });
     },
     exit() {
         Swal.fire({
             title: 'Are you sure?',
             text: "You wan't to exit the game ...",
             type: 'warning',
             showCancelButton: true,
             confirmButtonColor: '#3085d6',
             cancelButtonColor: '#d33',
             confirmButtonText: 'Exit'
         }).then((result) => {
             if (result.value) {
                 window.close();
             }
         });
     }
 }

 /* 
 Creating and Initilizing websocket and utility functions  
   */
//let url = 'http://localhost:8080';
let url = "https://onchess.herokuapp.com/login";

 var instance;
 var socket = io.connect(url, { query: 'username=' + username + '&gameId=' + gameDetails.id });

 // handle incoming messages
 socket.on('instance', function(data) {
     console.log('instance:' + JSON.stringify(data));
     instance = data.instance;
 });

 socket.on('pass', function(event) {
     console.log('incoming:' + JSON.stringify(event));
     doAction(event.action, event.data.row, event.data.col);
 });

 socket.on('pass-turn', function(event) {
     console.log('incoming:' + JSON.stringify(event));
     if (event.event.action == 'click') {
         handleRowColClick(event.event.data.row, event.event.data.row);
     }
 });

 socket.on('control', (control) => {
     console.log('control : ' + JSON.stringify(control));
     if (control.action == actions.REQ_UNDO) {
         if (control.username != username)
             Swal.fire({
                 title: control.username + ' is requesting to do undo',
                 text: "Are you agree to do undo ?",
                 type: 'warning',
                 showCancelButton: true,
                 confirmButtonColor: '#3085d6',
                 cancelButtonColor: '#d33',
                 confirmButtonText: 'Agree'
             }).then((result) => {
                 if (result.value) {
                     passControl(actions.DO_UNDO);
                 }
             });

     } else if (control.action == actions.DO_UNDO) {
         moveHistory.undo();
     }

 });

 function passControl(action) {
     data = {
         username: username,
         gameId: gameDetails.id,
         action: action
     }
     socket.emit('control', data);
 }

 function passAction(action, row, col) {
     let data = {
         username: username,
         gameId: gameDetails.id,
         action: action,
         data: {
             row: row,
             col: col
         }
     };

     console.log('emitting ' + JSON.stringify(data));
     socket.emit('pass', data);
 }

 function checkEnter(e) {
     if (e.keyCode == 13)
         sendMessage();
 }

 function sendMessage() {
     let msgBox = $.select('input#chat-box');
     let msg = {
         username: username,
         gameId: gameDetails.id,
         msg: msgBox.value
     }
     msgBox.value = '';
     socket.emit('chat', msg);
 }
 socket.on('chat', (msg) => {
     //('got '+JSON.stringify(msg));
     let html = '';
     var cls = msg.username == username ? 'from' : 'to';
     html += `<div class="chat ` + cls + `">` + msg.msg + `</div>`;
     let chatBox = $.select('.chats');
     chatBox.innerHTML = chatBox.innerHTML + html;
 });
 