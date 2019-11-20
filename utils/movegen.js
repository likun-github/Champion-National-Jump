////////////////////////////////////////////////////////
// util start
////////////////////////////////////////////////////////
// 把origin用50位的二进制表示
function fill50(origin) {
  // 把原始数字转化成二进制，并以字符串形式表示
  let originString = Number(origin).toString(2);

  // 若原始数字不足50位，补齐
  let temp = [];
  let originString50bits = [];
  for (let i = 0; i < 50 - originString.length; i++) {
    temp += '0';
  }
  originString50bits = temp + originString;

  return originString50bits;
}

// rightShift对origin进行右移k位的操作
function Shift(origin, k, DIR) {
  // 完成移位运算
  let resultString50bits = 0;
  if (DIR == 'l') { // 完成左移运算
    for (let i = 0; i < k; i++) {
      origin += '0';

    }
    resultString50bits = origin.toString().substring(k, 50 + k);
  } else { // 完成右移运算
    let temp = [];
    for (let i = 0; i < k; i++) {
      temp += '0';
    }
    origin = temp + origin;
    resultString50bits = origin.toString().substring(0, 50);
  }
  return resultString50bits;
}

// And对a，b进行与运算
function And(a, b) {
  let result = [];
  for (let i = 0; i < 50; i++) {
    if (a[i] == 1 && b[i] == 1) {
      result += '1';
    } else {
      result += '0';
    }
  }
  return result;
}

// Or对a，b 进行或运算
function Or(a, b) {
  let result = [];
  for (let i = 0; i < 50; i++) {
    if (a[i] == 1 || b[i] == 1) {
      result += '1';
    } else {
      result += '0';
    }
  }
  return result;
}

// Not对origin求反
function Not(origin) {
  let result = [];
  for (let i = 0; i < 50; i++) {
    if (origin[i] == '0') {
      result += '1';
    } else {
      result += '0';
    }
  }
  return result;
}

// findLowBit求解x中第一个为1的索引
function findLowBit(x) {
  for (let i = 49; i >= 0; i--) {
    if (x[i] == '1') {
      return 49 - i;
    }
  }
  return -1;	// x中不存在为1的位！
}

// countOnes求解x中1的个数
function countOnes(x) {
  let c = 0;
  for (let i = 0; i < 50; i++) {
    if (x[i] == '1') {
      c++;
    }
  }
  return c;
}

// squareToBitboard确定paddedArray中squareIndex的棋子对应Bitboard中的索引
function squareToBitboard(squareIndex/*padded array中的索引号*/) {
  // squareIndex不在paddedArray范围内
  if (squareIndex < 6 || squareIndex > 60 || squareIndex % 11 == 0) {
    return -1;
  }
  // squareIndex是paddedArray的棋子
  return bitboardArray[squareIndex];
}

// bitboardToSquare确定bitboard中bitboardIndex的棋子对应padded array中的索引
function bitboardToSquare(bitboardIndex/*bitboard中的索引号*/) {
  // bitboardIndex不在bitboard范围内
  if (bitboardIndex < 0 || bitboardIndex > 49) {
    return -1;
  }
  // bitboardIndex是bitboard的棋子
  return paddedArray[bitboardIndex];
}

// miniProgramBoardToBitBoard把小程序的棋盘以bitboard的形式表示
function miniProgramBoardToBitBoard(whiteChess, blackChess, kingChess) {
  let bitboard = { "W": 0, "B": 0, "K": 0 };
  let W = 0;
  let B = 0;
  let K = 0;
  for (let i = 0; i < 100; i++) {
    if (whiteChess[i] == 1) {
      W = Or(W, Shift(fill50(1), miniBitboardArray[i], 'l'));
    }
    if (blackChess[i] == 1) {
      B = Or(B, Shift(fill50(1), miniBitboardArray[i], 'l'));
    }
    if (kingChess[i] == 1) {
      K = Or(K, Shift(fill50(1), miniBitboardArray[i], 'l'));
    }
  }
  bitboard["W"] = parseInt(W.toString(), 2);
  bitboard["B"] = parseInt(B.toString(), 2);
  bitboard["K"] = parseInt(K.toString(), 2);
  return bitboard;
}
////////////////////////////////////////////////////////
// util end
////////////////////////////////////////////////////////


////////////////////////////////////////////////////////
// initialization start
////////////////////////////////////////////////////////
const INVALID = -99;
const EMPTY = 0;
const WPIECE = 1;
const BPIECE = 2;
const WKING = -1;
const BKING = -2;
const maskL4 = fill50(33017592576030);	    // 向左上方行走数字+4的位置：01 02 03 04 11 12 13 14 21 22 23 24 31 32 33 34 41 42 43 44
const maskL6 = fill50(515899884000);		// 向右上方行走数字+6的位置：05 06 07 08 15 16 17 18 25 26 27 28 35 36 37 38
const maskR4 = fill50(528281481216480);		// 向右下方行走数字-4的位置：45 46 47 48 35 36 37 38 25 26 27 28 15 16 17 18 05 06 07 08
const maskR6 = fill50(33017592576000);		// 向左下方行走数字-6的位置：41 42 43 44 31 32 33 34 21 22 23 24 11 12 13 14
// padded array中棋盘的索引集合
const paddedArray = [6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 56, 57, 58, 59, 60];
const bitboardArray = [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 0, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 0, 45, 46, 47, 48, 49];
const miniProgramsArray = [0, 0, 0, 0, 0, 0, 90, 92, 94, 96, 98, 0, 81, 83, 85, 87, 89, 70, 72, 74, 76, 78, 0, 61, 63, 65, 67, 69, 50, 52, 54, 56, 58, 0, 41, 43, 45, 47, 49, 30, 32, 34, 36, 38, 0, 21, 23, 25, 27, 29, 10, 12, 14, 16, 18, 0, 1, 3, 5, 7, 9];
const miniBitboardArray = [0, 45, 0, 46, 0, 47, 0, 48, 0, 49, 40, 0, 41, 0, 42, 0, 43, 0, 44, 0, 0, 35, 0, 36, 0, 37, 0, 38, 0, 39, 30, 0, 31, 0, 32, 0, 33, 0, 34, 0, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0];
let paddedArrayBoard = [INVALID, INVALID, INVALID, INVALID, INVALID, INVALID,
  EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, INVALID,
  EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
  EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, INVALID,
  EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
  EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, INVALID,
  EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
  EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, INVALID,
  EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
  EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, INVALID,
  EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
////////////////////////////////////////////////////////
// initialization end
////////////////////////////////////////////////////////



////////////////////////////////////////////////////////
// checkerBitboard start
////////////////////////////////////////////////////////
class CheckerBitboard {
  constructor(white, black, king) {
    this.W = fill50(white);	// 白子
    this.B = fill50(black);	// 黑子
    this.K = fill50(king);	// 王
    this.nOcc = Not((Or(this.B, this.W)));	// 空棋位
  }
  // getMoversWhite用于求出可移动的白子棋位
  getMoversWhite() {
    // 获取可往前移动一步的白子位置
    let moves = Shift(this.nOcc, 5, 'r');
    moves = Or(moves, Shift(And(this.nOcc, maskR4), 4, 'r'));
    moves = Or(moves, Shift(And(this.nOcc, maskR6), 6, 'r'));
    moves = And(moves, this.W);
    // 获取可移动的白王位置
    let WK = And(this.W, this.K);
    if (countOnes(WK) > 0) {
      moves = Or(moves, And(Shift(this.nOcc, 5, 'l'), WK));
      moves = Or(moves, And(Shift(And(this.nOcc, maskL4), 4, 'l'), WK));
      moves = Or(moves, And(Shift(And(this.nOcc, maskL6), 6, 'l'), WK));
    }
    return moves;
  }

  // getMoversBlack用于求出可移动的黑子棋位
  getMoversBlack() {
    // 获取可往前移动一步的黑子位置
    let moves = Shift(this.nOcc, 5, 'l');
    moves = Or(moves, Shift(And(this.nOcc, maskL4), 4, 'l'));
    moves = Or(moves, Shift(And(this.nOcc, maskL6), 6, 'l'));
    moves = And(moves, this.B);
    // 获取可移动的黑王位置
    let BK = And(this.B, this.K);
    if (countOnes(BK) > 0) {
      moves = Or(moves, And(Shift(this.nOcc, 5, 'r'), BK));
      moves = Or(moves, And(Shift(And(this.nOcc, maskR4), 4, 'r'), BK));
      moves = Or(moves, And(Shift(And(this.nOcc, maskR6), 6, 'r'), BK));
    }
    return moves;
  }

  // kingJumpSearchDirectionWhite在指定方向DIR上查看白王是否有跳吃可能，如可能，则将该王棋加入movers中
  kingJumpSearchDirectionWhite(movers /*可跳吃的棋子*/, squareKingIndex /*王棋在padded array中的索引*/, DIR /*棋子移动方向：+5，+6，-5，-6*/, index /*王棋在bitboard中的索引*/, flag /*标识此方向是否能够跳吃*/) {
    for (let squareIndex = squareKingIndex + DIR; squareToBitboard(squareIndex) >= 0 && squareToBitboard(squareIndex + 2 * DIR) >= 0; squareIndex += DIR) {
      if (countOnes(And(Shift(fill50(1), Number(squareToBitboard(squareIndex)), 'l'), this.W)) > 0) {
        break;
      }
      if (countOnes(And(Shift(fill50(1), Number(squareToBitboard(squareIndex + DIR)), 'l'), this.B)) > 0 && countOnes(And(Shift(fill50(1), Number(squareToBitboard(squareIndex + 2 * DIR)), 'l'), this.nOcc)) > 0) {
        movers[0] = Or(movers[0], Shift(fill50(1), index, 'l'));
        flag[0] = 1;
        break;
      }
    }
  }

  // kingJumpSearchDirectionBlack在指定方向DIR上查看黑王是否有跳吃可能，如可能，则将该王棋加入movers中
  kingJumpSearchDirectionBlack(movers /*可跳吃的棋子*/, squareKingIndex /*王棋在padded array中的索引*/, DIR /*棋子移动方向：+5，+6，-5，-6*/, index /*王棋在bitboard中的索引*/, flag /*标识此方向是否能够跳吃*/) {
    for (let squareIndex = squareKingIndex + DIR; squareToBitboard(squareIndex) >= 0 && squareToBitboard(squareIndex + 2 * DIR) >= 0; squareIndex += DIR) {
      if (countOnes(And(Shift(fill50(1), Number(squareToBitboard(squareIndex)), 'l'), this.B)) > 0) {
        break;
      }
      if (countOnes(And(Shift(fill50(1), Number(squareToBitboard(squareIndex + DIR)), 'l'), this.W)) > 0 && countOnes(And(Shift(fill50(1), Number(squareToBitboard(squareIndex + 2 * DIR)), 'l'), this.nOcc)) > 0) {
        movers[0] = Or(movers[0], Shift(fill50(1), index, 'l'));
        flag[0] = 1;
        break;
      }
    }
  }

  // getJumpersWhite用于求出可以跳吃黑子的白子棋位
  getJumpersWhite() {
    let movers = [0]
    // 获取可以跳吃黑子的白子棋位-往前单步跳吃
    let temp = And(Shift(this.nOcc, 5, 'r'), this.B);
    movers[0] = And(Or(Shift(And(temp, maskR4), 4, 'r'), Shift(And(temp, maskR6), 6, 'r')), this.W);
    temp = And(Or(Shift(And(this.nOcc, maskR4), 4, 'r'), Shift(And(this.nOcc, maskR6), 6, 'r')), this.B);
    movers[0] = Or(movers[0], And(Shift(temp, 5, 'r'), this.W));
    // 获取可以跳吃黑子的白子棋位-往后单步跳吃
    temp = And(Shift(this.nOcc, 5, 'l'), this.B);
    movers[0] = Or(movers[0], And(Or(Shift(And(temp, maskL4), 4, 'l'), Shift(And(temp, maskL6), 6, 'l')), this.W));
    temp = And(Or(Shift(And(this.nOcc, maskL4), 4, 'l'), Shift(And(this.nOcc, maskL6), 6, 'l')), this.B);
    movers[0] = Or(movers[0], And(Shift(temp, 5, 'l'), this.W));
    // 获取可以跳吃黑子的白王棋位
    let WK = And(this.W, this.K);
    WK = And(WK, Not(movers[0]));	// 已在moves中的白王不必重复计算
    while (parseInt(WK.toString(), 2) > 0) {
      let index = findLowBit(WK);
      WK = And(WK, Not(Shift(fill50(1), index, 'l')));
      let squareWK = paddedArray[index];

      let flag = [0];
      this.kingJumpSearchDirectionWhite(movers, squareWK, 5, index, flag);
      if (flag[0] == 1) { continue; }
      this.kingJumpSearchDirectionWhite(movers, squareWK, 6, index, flag);
      if (flag[0] == 1) { continue; }
      this.kingJumpSearchDirectionWhite(movers, squareWK, -5, index, flag);
      if (flag[0] == 1) { continue; }
      this.kingJumpSearchDirectionWhite(movers, squareWK, -6, index, flag);
    }
    return movers;
  }

  // getJumpersBlack用于求出可以跳吃白子的黑子棋位
  getJumpersBlack() {
    let movers = [0]
    // 获取可以跳吃白子的黑子棋位-往前单步跳吃
    let temp = And(Shift(this.nOcc, 5, 'l'), this.W);
    movers[0] = And(Or(Shift(And(temp, maskL4), 4, 'l'), Shift(And(temp, maskL6), 6, 'l')), this.B);
    temp = And(Or(Shift(And(this.nOcc, maskL4), 4, 'l'), Shift(And(this.nOcc, maskL6), 6, 'l')), this.W);
    movers[0] = Or(movers[0], And(Shift(temp, 5, 'l'), this.B));
    // 获取可以跳吃黑子的白子棋位-往后单步跳吃
    temp = And(Shift(this.nOcc, 5, 'r'), this.W);
    movers[0] = Or(movers[0], And(Or(Shift(And(temp, maskR4), 4, 'r'), Shift(And(temp, maskR6), 6, 'r')), this.B));
    temp = And(Or(Shift(And(this.nOcc, maskR4), 4, 'r'), Shift(And(this.nOcc, maskR6), 6, 'r')), this.W);
    movers[0] = Or(movers[0], And(Shift(temp, 5, 'r'), this.B));
    // 获取可以跳吃黑子的白王棋位
    let BK = And(this.B, this.K);
    BK = And(BK, Not(movers[0]));	// 已在moves中的黑王不必重复计算
    while (parseInt(BK.toString(), 2) > 0) {
      let index = findLowBit(BK);
      BK = And(BK, Not(Shift(fill50(1), index, 'l')));
      let squareBK = paddedArray[index];

      let flag = [0];
      this.kingJumpSearchDirectionBlack(movers, squareBK, 5, index, flag);
      if (flag[0] == 1) { continue; }
      this.kingJumpSearchDirectionBlack(movers, squareBK, 6, index, flag);
      if (flag[0] == 1) { continue; }
      this.kingJumpSearchDirectionBlack(movers, squareBK, -5, index, flag);
      if (flag[0] == 1) { continue; }
      this.kingJumpSearchDirectionBlack(movers, squareBK, -6, index, flag);
    }
    return movers;
  }

  // getWhiteMoves用于求出可移动的白子个数（不含跳吃）
  getWhiteMoves() {
    return countOnes(this.getMoversWhite());
  }

  // getBlackMoves用于求出可移动的黑子个数（不含跳吃）
  getBlackMoves() {
    return countOnes(this.getMoversBlack());
  }
}
////////////////////////////////////////////////////////
// checkerBitboard end
////////////////////////////////////////////////////////


////////////////////////////////////////////////////////
// checkerMoveList start
////////////////////////////////////////////////////////
function checkerMove(parent, src, dst, kill, layer) {
  this.parent = parent;   // 父节点（普通移动的父节点均为null；跳吃的父节点为上一个连跳对象的地址，第一步跳吃的父节点为null）
  this.src = src;     // 起点
  this.dst = dst;     // 终点
  this.kill = kill;   // 被吃的棋
  this.layer = layer; // 层数（普通移动均为0,；跳吃随着连跳数增加而增加）
}

class checkerMoveList {
  constructor(cb) {
    this.numMoves = 0;  // 移动的个数（包括普通移动和跳吃）
    this.numJumps = 0;  // 跳吃的个数
    this.moves = [];   // 对于普通移动，存移动本身；对于跳吃，存叶子节点。
    this.bitboardToPaddedArrayBoard(cb);    // 根据bitboard初始化padded array board
    this.counter = [INVALID, INVALID, INVALID, INVALID, INVALID, INVALID, // 初始化计数器
      0, 0, 0, 0, 0, INVALID,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, INVALID,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, INVALID,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, INVALID,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, INVALID,
      0, 0, 0, 0, 0];
  }

  // 清空moveList
  clear() {
    this.numMoves = 0;
    this.numJumps = 0;
    this.moves = [];
  }

  // 计数器清零 
  resetCounter() {
    this.counter = [INVALID, INVALID, INVALID, INVALID, INVALID, INVALID,
      0, 0, 0, 0, 0, INVALID,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, INVALID,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, INVALID,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, INVALID,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, INVALID,
      0, 0, 0, 0, 0];
  }

  resetPaddedArray() {
    paddedArrayBoard = [INVALID, INVALID, INVALID, INVALID, INVALID, INVALID,
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, INVALID,
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, INVALID,
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, INVALID,
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, INVALID,
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, INVALID,
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
  }

  // 根据bitboard初始化paddedArrayBoard
  bitboardToPaddedArrayBoard(cb) {
    this.resetPaddedArray();
    let temp = cb.W;
    this.setpaddedArrayBoard(WPIECE, temp);
    temp = cb.B;
    this.setpaddedArrayBoard(BPIECE, temp);
    temp = And(cb.W, cb.K);
    this.setpaddedArrayBoard(WKING, temp);
    temp = And(cb.B, cb.K);
    this.setpaddedArrayBoard(BKING, temp);
  }

  // setpaddedArrayBoard根据bitboardPiece设置paddedArrayBoard的piece棋子
  setpaddedArrayBoard(piece/*WPIECE/BPIECE/WKING/BKING*/, bitboardPieceIndices) {
    while (bitboardPieceIndices > 0) {
      let index = findLowBit(bitboardPieceIndices);
      bitboardPieceIndices = And(bitboardPieceIndices, Not(Shift(fill50(1), index, 'l')));
      paddedArrayBoard[paddedArray[index]] = piece;
    }
  }

  // isIdxValid确认idx在padded array中是否合法
  isIdxValid(idx) {
    if (idx >= 6 && idx <= 60) {
      if (paddedArrayBoard[idx] != INVALID) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  // ownPiece根据对手棋子的颜色oppoPiece求得本方棋子的颜色
  ownPiece(oppoPiece) {
    return -oppoPiece + 3;
  }


  // findMovesWhite找出当前bitboard上白子的所有可走步，并将其存放于checkerMoveList中
  findMovesWhite(cb /*checker bitboard*/) {
    let jumpers = cb.getJumpersWhite();
    if (jumpers[0] > 0) {
      this.findJumps(jumpers, BPIECE);
    } else { // 如果能跳吃，就无需寻找可移动的棋子，因为有跳吃必须走跳吃
      let movers = cb.getMoversWhite();
      this.findNonJumps(movers, BPIECE);
    }
  }
  // findMovesBlack找出当前bitboard上黑子的所有可走步，并将其存放于checkerMoveList中
  findMovesBlack(cb /*checker bitboard*/) {
    let jumpers = cb.getJumpersBlack();
    if (jumpers > 0) {
      this.findJumps(jumpers, WPIECE);
    } else { // 如果能跳吃，就无需寻找可移动的棋子，因为有跳吃必须走跳吃
      let movers = cb.getMoversBlack();
      this.findNonJumps(movers, WPIECE);
    }
  }

  findJumps(jumpers, opponentPiece/*对手棋子*/) {
    while (jumpers[0] > 0) {
      let index = findLowBit(jumpers[0]);
      jumpers[0] = And(jumpers[0], Not(Shift(fill50(1), index, 'l')));
      let square = bitboardToSquare(index);

      let numSqMoves = [0];
      let layer = 0;
      // 四个方向寻找跳吃
      if (square) { // 根节点没有父节点
        this.checkJumpDir(null, square, 5, opponentPiece, layer, numSqMoves);
        this.checkJumpDir(null, square, 6, opponentPiece, layer, numSqMoves);
        this.checkJumpDir(null, square, -5, opponentPiece, layer, numSqMoves);
        this.checkJumpDir(null, square, -6, opponentPiece, layer, numSqMoves);
      } else {
        console.log("index不在bitboard范围内！");
      }
    }
    this.numMoves = this.numJumps;
  }

  checkJumpDir(parent, square/*当前棋位在padded array上的索引*/, DIR/*方向*/, opponentPiece/*对手棋子*/, layer, numSqMoves) {
    let moveStack = [];
    let jumpedPieceSq = null;

    // 存moveStack
    if (paddedArrayBoard[square] == WKING || paddedArrayBoard[square] == BKING) { // 王的跳吃
      for (let squareIndex = square; this.isIdxValid(squareIndex + 2 * DIR) && this.isIdxValid(squareIndex + DIR); squareIndex += DIR) {
        if (Math.abs(Number(paddedArrayBoard[squareIndex + DIR])) == this.ownPiece(opponentPiece) || this.counter[squareIndex + DIR] != 0) {	// 下一位是本方棋子，该方向不存在跳吃可能 /////////////////////////////////////////////////////
          break;
        }
        if (Math.abs(Number(paddedArrayBoard[squareIndex + DIR])) == opponentPiece && paddedArrayBoard[squareIndex + 2 * DIR] == EMPTY && this.counter[squareIndex + 2 * DIR] == 0) { // 下一位是对手棋子且再下一位为空，可以跳吃 /////////////////////////////////////////////////////////////////////////////////////////////////////////////
          numSqMoves[0]++;
          jumpedPieceSq = squareIndex + DIR;
          for (let idx = squareIndex + 2 * DIR; this.isIdxValid(idx) && this.counter[idx] == 0; idx += DIR) {
            if (paddedArrayBoard[idx] == EMPTY) {
              let move = new checkerMove(parent, square, idx, jumpedPieceSq, layer);
              moveStack.push(move);
            } else {
              break;
            }
          }
          break;
        }
      }

    } else { // 兵的跳吃
      if (this.isIdxValid(square + 2 * DIR) && this.isIdxValid(square + DIR) && Math.abs(Number(paddedArrayBoard[square + DIR])) == opponentPiece && paddedArrayBoard[square + 2 * DIR] == EMPTY) { // 下一位是对手棋子且再下一位为空，可以跳吃
        numSqMoves[0]++;
        jumpedPieceSq = square + DIR;
        let move = new checkerMove(parent, square, square + 2 * DIR, jumpedPieceSq, layer);
        moveStack.push(move);
      }
    }

    layer = layer + 1;
    while (moveStack.length != 0) {
      if (layer == 1) {
        this.resetCounter(); //////////////////////////////////////////////////////////////////////////////////
      }
      let topElement = moveStack.pop();
      // 查找后续跳吃
      this.findSqJumps(topElement, layer, jumpedPieceSq, opponentPiece);
    }
  }

  // findSqJumps是跟checkJumpDir打配合哒
  findSqJumps(move, layer, jumpedPieceSq, opponentPiece/*对手棋子*/) {
    let numSqMoves = [0];

    // 将被跳吃的棋子“拿走”，以防多次连跳
    let jumpedPiece = paddedArrayBoard[jumpedPieceSq];
    paddedArrayBoard[jumpedPieceSq] = EMPTY;
    this.counter[jumpedPieceSq] += 1; ///////////////////////////////////////////////////////////////////////////////////
    let jumpPiece = paddedArrayBoard[move.src];
    paddedArrayBoard[move.src] = EMPTY;
    paddedArrayBoard[move.dst] = jumpPiece;

    // 寻找连跳
    this.checkJumpDir(move, move.dst, 5, opponentPiece, layer, numSqMoves);
    this.checkJumpDir(move, move.dst, 6, opponentPiece, layer, numSqMoves);
    this.checkJumpDir(move, move.dst, -5, opponentPiece, layer, numSqMoves);
    this.checkJumpDir(move, move.dst, -6, opponentPiece, layer, numSqMoves);

    // 叶子节点，存
    if (numSqMoves[0] == 0) {
      this.moves.push(move);
      this.numJumps++
    }

    // 把被“拿走”的棋子放回，还原棋盘
    paddedArrayBoard[jumpedPieceSq] = jumpedPiece;
    paddedArrayBoard[move.src] = jumpPiece;
    paddedArrayBoard[move.dst] = EMPTY;
    this.counter[jumpedPieceSq] -= 1;
  }

  // findJumps找出当前bitboard上白/黑子的所有可移动步，并将其存放于checkerMoveList中
  findNonJumps(movers, opponentPiece/*对手棋子*/) {
    while (movers > 0) {
      let index = findLowBit(movers);
      movers = And(movers, Not(Shift(fill50(1), index, 'l')));
      let square = bitboardToSquare(index);

      if (paddedArrayBoard[square] == BKING || paddedArrayBoard[square] == WKING) { // 王棋四个方向都能走
        this.checkNonJumpDir(square, 5);
        this.checkNonJumpDir(square, 6);
        this.checkNonJumpDir(square, -5);
        this.checkNonJumpDir(square, -6);
      } else {
        if (opponentPiece == BPIECE) { // 白子只能往上走
          if (paddedArrayBoard[square + 5] == EMPTY) {
            this.moves.push(new checkerMove(null, square, square + 5, null, 0));
          }
          if (paddedArrayBoard[square + 6] == EMPTY) {
            this.moves.push(new checkerMove(null, square, square + 6, null, 0));
          }
        } else { // 黑子只能往下走
          if (paddedArrayBoard[square - 5] == EMPTY) {
            this.moves.push(new checkerMove(null, square, square - 5, null, 0));
          }
          if (paddedArrayBoard[square - 6] == EMPTY) {
            this.moves.push(new checkerMove(null, square, square - 6, null, 0));
          }
        }
      }
    }
  }

  // checkJumpDir确定DIR有无王的移动
  checkNonJumpDir(square/*当前棋位在padded array上的索引*/, DIR/*方向*/) {
    for (let idx = square; this.isIdxValid(idx + DIR); idx += DIR) {
      if (paddedArrayBoard[idx + DIR] != EMPTY) {
        break;
      } else {
        this.moves.push(new checkerMove(null, square, idx + DIR, null, 0));
      }
    }
  }

  // movesExtraction把moves中的最长路径选出来，并将坐标转换成小程序中的坐标
  movesExtraction() {
    // 选出最长路径
    let length = 0;
    if (this.numJumps > 0) {
      for (let i = 0; i < this.moves.length; i++) {
        if (this.moves[i].layer > length) {
          length = this.moves[i].layer;
        }
      }
    }

    // 提取最长路径
    let max_length = [];
    for (let i = 0; i < this.moves.length; i++) {
      if (Number(this.moves[i].layer) == Number(length)) {
        max_length.push(this.moves[i]);
      }
    }


    // 修改最长路径的src与dst索引
    let final_move = [];
    let move, temp;
    for (let i = 0; i < max_length.length; i++) {
      temp = max_length[i];
      if (temp.kill == null) { // 没有跳吃
        move = new checkerMove(null, miniProgramsArray[temp.src], miniProgramsArray[temp.dst], null, temp.layer);
      } else {
        move = new checkerMove(null, miniProgramsArray[temp.src], miniProgramsArray[temp.dst], miniProgramsArray[temp.kill], temp.layer);
      }
      this.find_parent(move, temp);
      final_move.push(move);
    }
    return final_move;
  }

  find_parent(move, temp) {
    if (temp.parent == null) { // 根节点
    } else {
      temp = temp.parent;
      let temp_move;
      if (temp.kill == null) { // 没有跳吃, 这个似乎可以不要？
        temp_move = new checkerMove(null, miniProgramsArray[temp.src], miniProgramsArray[temp.dst], null, temp.layer);
      } else {
        temp_move = new checkerMove(null, miniProgramsArray[temp.src], miniProgramsArray[temp.dst], miniProgramsArray[temp.kill], temp.layer);
      }
      move.parent = temp_move;
      this.find_parent(move.parent, temp);
    }
  }
}

////////////////////////////////////////////////////////
// checkerMoveList end
////////////////////////////////////////////////////////

module.exports = {
  miniProgramBoardToBitBoard: miniProgramBoardToBitBoard,
  CheckerBitboard: CheckerBitboard,
  CheckerMoveList: checkerMoveList
}