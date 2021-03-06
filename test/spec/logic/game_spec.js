'use strict';

(function () {

  /* test helpers */
  var boardDescription = {
    "paths": [
      [23, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27],
      [22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 28, 29, 30, 31],
      [21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 32, 33, 34, 35],
      [20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 36, 37, 38, 39]
    ],
    "homes": [
      [40, 41, 42, 43],
      [44, 45, 46, 47],
      [48, 49, 50, 51],
      [52, 53, 54, 55]
    ]
  };

  var smallBoardDescription = {
    "paths": [
      [0, 1, 2, 3, 4, 5, 6, 100, 101, 102, 103],
      [1, 2, 3, 4, 5, 6, 7, 104, 105, 106, 107],
      [2, 3, 4, 5, 6, 7, 8, 108, 109, 110, 111],
      [3, 4, 5, 6, 7, 8, 9, 112, 113, 114, 115]
    ],
    "homes": [
      [201, 202, 203, 204],
      [205, 206, 207, 208],
      [209, 210, 211, 212],
      [213, 214, 215, 216]
    ]
  };

  var SequentialThrowGenerator = function (sequence) {
    this._sequence = sequence;
    this._index = 0;

    this.generate = function () {
      this._index += 1;
      return this._sequence[this._index - 1];
    }
  }

  var generateDefaultGame = function (externalOptions) {
    var options = {board: boardDescription};
    if (externalOptions) {
      if (externalOptions.throws) {
        options.dieThrowGenerator = new SequentialThrowGenerator(externalOptions.throws);
      }
    }
    return Game.create(options);
  };

  var generateSmallGame = function (externalOptions) {
    var options = {board: smallBoardDescription};
    if (externalOptions) {
      if (externalOptions.throws) {
        options.dieThrowGenerator = new SequentialThrowGenerator(externalOptions.throws);
      }
    }
    return Game.create(options);
  };
  /* END test helpers */


  var RandomThrowGenerator = function () {
    this.generate = function () {
      return Math.round(Math.random() * (6 - 1) + 1);
    }
  };

  describe('Unit: RandomThrowGenerator', function () {
    describe('#generate()', function () {
      it('generates numbers', function () {
        var generator = new RandomThrowGenerator();
        expect(typeof generator.generate() === 'number').toBe(true);
      });
    });
  });

  var Pawn = function (homePosition, path) {
    this._homePosition = homePosition;
    this._position = homePosition;
    this._path = path;

    this.moveToHome = function () {
      this._position = this._homePosition;
    };

    this.isAtHome = function () {
      return this._homePosition === this._position;
    };

    this.isOnTheBoard = function () {
      for (var i = 0; i < this._path.length - 4; i++) {
        if (this._path[i] === this.getPosition()) return true;
      }
      return false;
    }

    this.isAtTheFinish = function () {
      return !this.isAtHome() && !this.isOnTheBoard();
    };

    this.setPosition = function (position) {
      this._position = position;
    };

    this.getPosition = function () {
      return this._position;
    };

    this._getFirstPositionOnPath = function () {
      return this._path[0];
    };

    this.getNextPosition = function (die) {
      if (this.isAtHome()) {
        if (die === 6) {
          return this._getFirstPositionOnPath();
        } else {
          return null;
        }
      }

      var newPosition = this.getNextPositionOnPath(this.getPosition(), die);

      if (typeof newPosition === 'number') return newPosition;
      return null;
    }

    this.moveBy = function (die) {
      this.setPosition(this.getNextPosition(die));
    }

    this.getNextPositionOnPath = function (startPosition, distance) {
      return this._path[this._findPositionIndex(startPosition) + distance];
    };

    this._findPositionIndex = function (position) {
      for (var i = 0; i < this._path.length; i++) {
        if (this._path[i] == position) return i;
      }
    };

  };

  describe('Unit: Pawn', function () {
    describe('#isAtHome()', function () {
      it('returns true if at starting position', function () {
        var pawn = new Pawn(41);
        expect(pawn.isAtHome()).toBe(true);
      });

      it('returns false if NOT at at starting position', function () {
        var pawn = new Pawn(41);
        pawn.setPosition(0);
        expect(pawn.isAtHome()).toBe(false);
      });
    });

    describe('#getPosition()', function () {
      it('returns the current position', function () {
        var pawn = new Pawn(41);
        expect(pawn.getPosition()).toEqual(41);
        pawn.setPosition(1);
        expect(pawn.getPosition()).toEqual(1);
      });
    });

    describe('#moveToHome()', function () {
      it('moves the pawn to it\'s home position', function () {
        var pawn = new Pawn(41);
        expect(pawn.getPosition()).toEqual(41);
        pawn.setPosition(1);
        expect(pawn.getPosition()).toEqual(1);
        pawn.moveToHome();
        expect(pawn.getPosition()).toEqual(41);
      });
    });

    describe('#isAtTheFinish()', function () {
      it('returns a boolean', function () {
        var pawn = new Pawn(0, [1, 2, 3, 4, 5, 6]);
        pawn.setPosition(3);
        expect(pawn.isAtTheFinish()).toBe(true);
        pawn.setPosition(2);
        expect(pawn.isAtTheFinish()).toBe(false);
      });
    });

    describe('#isOnTheBoard()', function () {
      it('returns a boolean', function () {
        var pawn = new Pawn(6, [1, 2, 3, 4, 5, 6]);
        expect(pawn.isOnTheBoard()).toBe(false);
        pawn.setPosition(2);
        expect(pawn.isOnTheBoard()).toBe(true);
      });
    });
  });

  var Player = function (pawns, path) {
    this._pawns = pawns;
    this._path = path;
    this.getPawn = function (pawnId) {
      return this._getPawn(pawnId);
    };

    this.isMovablePawnsExist = function (die) {
      return Object.keys(this.getMovablePawns(die)).length !== 0;
    };

    this.isAnyPawnsOnTheBoard = function () {
      for (var i = 0; i < this._pawns.length; i++) {
        if (this._getPawn(i).isOnTheBoard()) {
          return true;
        }
      }
      return false;
    };

    this.isAllPawnsAreAtFinish = function () {
      for (var i = 0; i < this._pawns.length; i++) {
        var atTheFinish = this._getPawn(i).isAtTheFinish();
        if (!atTheFinish) {
          return false;
        }
      }
      return true;
    };

    this.isAllPawnsAreAtHome = function () {
      for (var i = 0; i < this._pawns.length; i++) {
        if (!this._getPawn(i).isAtHome()) {
          return false;
        }
      }
      return true;
    }

    this._getPawn = function (id) {
      return this._pawns[id];
    };

    this.getMovablePawns = function (die) {

      var pawnNextPositions = [];
      for (var i = 0; i < this._pawns.length; i++) {
        var pawn = this._getPawn(i);
        pawnNextPositions[i] = pawn.getNextPosition(die);
      }
      ;

      for (var i = 0; i < this._pawns.length; i++) {
        var pawn = this._getPawn(i);
        var pawnPosition = pawn.getPosition();
        for (var j = 0; j < this._pawns.length; j++) {
          if (pawnNextPositions[j] == pawnPosition) pawnNextPositions[j] = null;
        }
      }


      var result = {};
      for (var i = 0; i < this._pawns.length; i++) {
        if (typeof pawnNextPositions[i] === 'number') {
          result[i] = this._getPawn(i).getNextPosition(die);
        }
      }
      return result;
    };
  };

  describe('Unit: Player', function () {
    describe('#getPawn(pawnId)', function () {
      it('returns the pawn', function () {
        var player = new Player(['a', 'b'], null);
        expect(player.getPawn(1)).toEqual('b');
      });
    });

    describe('#isAnyPawnsOnTheBoard()', function () {
      var path = [1, 2, 3, 4, 5];
      var pawn1 = new Pawn(0, path);
      var pawn2 = new Pawn(0, path);
      var player = new Player([pawn1, pawn2], path);
      expect(player.isAnyPawnsOnTheBoard()).toBe(false);
      pawn1.setPosition(1);
      expect(player.isAnyPawnsOnTheBoard()).toBe(true);
      pawn1.setPosition(2);
      expect(player.isAnyPawnsOnTheBoard()).toBe(false);
      pawn2.setPosition(1);
      expect(player.isAnyPawnsOnTheBoard()).toBe(true);
      pawn2.setPosition(5);
      expect(player.isAnyPawnsOnTheBoard()).toBe(false);
    })

    describe('#isAllPawnsAreAtHome()', function () {
      var path = [1, 2, 3, 4, 5];
      var pawn1 = new Pawn(0, path);
      var pawn2 = new Pawn(0, path);
      var player = new Player([pawn1, pawn2], path);
      expect(player.isAllPawnsAreAtHome()).toBe(true);
      pawn1.setPosition(1);
      expect(player.isAllPawnsAreAtHome()).toBe(false);
    })

    describe('#getMovablePawns(die)', function () {
      it('when all pawns are at home and you get less than 6', function () {
        var path = [1, 2, 3, 4, 5];
        var pawn1 = new Pawn(0, path);
        var pawn2 = new Pawn(0, path);

        var player = new Player([pawn1, pawn2], path);
        expect(player.getMovablePawns(5)).toEqual({});
      });

      it('when all pawns are at home and you get less than 6', function () {
        var path = [1, 2, 3, 4, 5];
        var pawn1 = new Pawn(0, path);
        var pawn2 = new Pawn(0, path);

        var player = new Player([pawn1, pawn2], path);
        expect(player.getMovablePawns(6)).toEqual({0: 1, 1: 1});
      });

      it('when a pawn is not at home and you get less than 6', function () {
        var path = [1, 2, 3, 4, 5];
        var pawn1 = new Pawn(0, path);
        var pawn2 = new Pawn(0, path);
        pawn1.setPosition(1);
        var player = new Player([pawn1, pawn2], path);
        expect(player.getMovablePawns(2)).toEqual({0: 3});
      });

      it('when a pawn is not at home and you get 6', function () {
        var path = [1, 2, 3, 4, 5, 6, 7, 8];
        var pawn1 = new Pawn(0, path);
        var pawn2 = new Pawn(0, path);
        pawn1.setPosition(2);
        var player = new Player([pawn1, pawn2], path);
        expect(player.getMovablePawns(6)).toEqual({0: 8, 1: 1});
      });

      it('when a pawn is at the exit and gets too large a number', function () {
        var path = [1, 2, 3, 4, 5, 6, 7, 8];
        var pawn1 = new Pawn(0, path);
        var pawn2 = new Pawn(0, path);
        pawn1.setPosition(4);
        var player = new Player([pawn1, pawn2], path);
        expect(player.getMovablePawns(5)).toEqual({});
      });
    });
  });
  var Game = function () {
    this.initialize.apply(this, arguments);
  };

  _.extend(Game.prototype, Backbone.Events, {
    initialize: function (options) {
      this._board = options.board;
      this._currentPlayerId = 0;

      this._dieThrowGenerator = options.dieThrowGenerator || new RandomThrowGenerator();
      this._generatePlayersFromBoard = function (board) {
        this._players = {};
        for (var playerId = 0; playerId < 4; playerId++) {
          var paths = board.paths[playerId];
          var homes = board.homes[playerId];
          var pawns = [];
          for (var pawnId = 0; pawnId < 4; pawnId++) {
            pawns.push(new Pawn(homes[pawnId], paths));
          }
          this._players[playerId] = new Player(pawns, paths);
        }
      };
      this._generatePlayersFromBoard(this._board);

      this.getCurrentPlayerId = function () {
        return this._currentPlayerId;
      };

      this.throwDie = function (wantedDieNumber) {
        var value = wantedDieNumber || this._dieThrowGenerator.generate();

        this._incrementDieThrowCount();
        this._setPlayedAfterDieThrow(false);
        this._currentDieValue = value;
        var movablePawnsExist = this._getCurrentPlayer().isMovablePawnsExist(value);
        var movablePawns = this.getMovablePawns();
        var result = { playerId: this.getCurrentPlayerId(), value: value, movablePawns: movablePawns};
        this.trigger('die:thrown', result);

        if (!movablePawnsExist) {
          this._changePlayerIfNeeded(value);
          this._triggerDieWaitingThrow();
        }
        return result;
      };

      this.start = function () {
        this._triggerDieWaitingThrow();
      };

      this._triggerDieWaitingThrow = function () {
        this.trigger('die:awaitingThrow');
      };

      this._getPlayer = function (playerId) {
        return this._players[playerId];
      };

      this._getCurrentPlayer = function () {
        return this._getPlayer(this.getCurrentPlayerId());
      };

      this._getPlayersCount = function () {
        return Object.keys(this._players).length;
      }

      this._getDieThrowCount = function () {
        return this._dieThrowCount || 0;
      };

      this._incrementDieThrowCount = function () {
        this._dieThrowCount = this._getDieThrowCount() + 1;
      };

      this._resetDieThrowCount = function () {
        this._dieThrowCount = 0;
      };

      this._isPlayedAfterDieThrow = function () {
        return !!this._playedAfterDieThrow || false;
      };

      this._setPlayedAfterDieThrow = function (value) {
        this._playedAfterDieThrow = value;
      };

      this._shouldChangePlayer = function (die) {
        var currentPlayer = this._getCurrentPlayer();
        if (die === 6) {
          return false;
        }
        ;
        if (currentPlayer.isAllPawnsAreAtHome()) {
          return this._getDieThrowCount() >= 3;
        } else {
          return  this._isPlayedAfterDieThrow() || !currentPlayer.isMovablePawnsExist(die);
        }
        return false;
      };

      this._changePlayerIfNeeded = function (die) {
        if (this._shouldChangePlayer(die)) {
          this._currentPlayerId = (this._currentPlayerId + 1) % this._getPlayersCount();
          this._resetDieThrowCount();
          this.trigger('player:change', { playerId: this._currentPlayerId });
        }
      };

      this._getPlayerIdAndPawnIdAtSamePositionAs = function (pawn) {
        for (var playerId = 0; playerId < this._getPlayersCount(); playerId++) {
          for (var pawnId = 0; pawnId < 4; pawnId++) {
            var otherPawn = this._getPlayer(playerId).getPawn(pawnId);
            if (otherPawn !== pawn) {
              if (otherPawn.getPosition() === pawn.getPosition()) {
                return { playerId: playerId, pawnId: pawnId, pawn: otherPawn };
              }
            }
          }
        }
        return null;
      };

      this._checkForEatenPawns = function (pawn) {
        var eatenPawnInfo = this._getPlayerIdAndPawnIdAtSamePositionAs(pawn);
        if (eatenPawnInfo) {
          eatenPawnInfo.pawn.moveToHome();
          this.trigger('pawn:eaten', { playerId: eatenPawnInfo.playerId, pawnId: eatenPawnInfo.pawnId, pointId: eatenPawnInfo.pawn.getPosition()});
        }
      };

      this._checkIfFinished = function (playerId) {
        var player = this._getPlayer(playerId);
        var isFinished = player.isAllPawnsAreAtFinish();
        if (isFinished) {
          this.trigger('player:finished', { playerId: playerId});
        }
      };

      this.getCurrentDieValue = function () {
        return this._currentDieValue;
      };

      this.isValidMove = function (playerId, pawnId) {
        if (this._isPlayedAfterDieThrow()) {
          return false;
        }
        if (playerId === this.getCurrentPlayerId()) {
          return !!this.getMovablePawns()[pawnId];
        }
        return false;
      };

      this.getMovablePawns = function () {
        return this._getCurrentPlayer().getMovablePawns(this.getCurrentDieValue());
      };

      this.playMove = function (pawnId) {
        var die = this.getCurrentDieValue();
        var playerId = this.getCurrentPlayerId();
        var player = this._getCurrentPlayer();
        var pawn = player.getPawn(pawnId);
        pawn.moveBy(die);
        var newPosition = pawn.getPosition();
        this._checkForEatenPawns(pawn);
        this._setPlayedAfterDieThrow(true);
        this._resetDieThrowCount();

        this._checkIfFinished(playerId);

        this._changePlayerIfNeeded(die);

        this.trigger('player:move', { playerId: playerId, pawnId: pawnId, pointId: newPosition});

      };

      this._logState = function () {
        var state = {};
        for (var i = 0; i < this._getPlayersCount(); i++) {
          state[i] = [];
          var player = this._getPlayer(i);
          for (var j = 0; j < 4; j++) {
            var pawn = player.getPawn(j);
            state[i].push(pawn.getPosition());
          }
        }
        console.log(state);
      };
    }


  });

  Game.create = function (options) {
    return new Game(options);
  }

  describe('Stories: Game', function () {
    it('should play a game, player 1 wins', function () {
      //[0, 1, 2, 3, 4, 5, 6, 100, 101, 102, 103]
      var emptyThrows = [1, 1, 1, 1, 1, 1, 1, 1, 1];
      var throws = [6, 6, 4].concat(emptyThrows).concat([6, 6, 3]).concat(emptyThrows).concat([6, 6, 2]).concat(emptyThrows).concat([6, 6, 1]);
      var game = generateSmallGame({throws: throws});

      var playForPlayer0 = function (pawnId) {
        for (var i = 0; i < 3; i++) {
          game.throwDie();
          game.playMove(pawnId);

        }
      };

      var playForOtherPlayers = function () {
        for (var i = 0; i < 9; i++) {
          game.throwDie();
        }
      };

      playForPlayer0(0);
      playForOtherPlayers();
      playForPlayer0(1);
      playForOtherPlayers();
      playForPlayer0(2);
      playForOtherPlayers();

      game.throwDie();
      game.playMove(3);
      game.throwDie();
      game.playMove(3);
      game.throwDie();
      spyOn(game, 'trigger');

      game.playMove(3);
      expect(game.trigger).toHaveBeenCalledWith('player:finished', { playerId: 0 });

    });

    it('should give you three chances to throw a 6 to exit home', function () {
      var game = generateDefaultGame({throws: [1, 1, 1]});
      expect(game.getCurrentPlayerId()).toBe(0);
      expect(game.throwDie()).toEqual({ playerId: 0, value: 1, movablePawns: {} });
      expect(game.getCurrentPlayerId()).toBe(0);
      game.throwDie();
      expect(game.getCurrentPlayerId()).toBe(0);
      game.throwDie();
      expect(game.getCurrentPlayerId()).toBe(1);
    });

    it('should give you only one throw after you exit the home', function () {
      var game = generateDefaultGame({throws: [6, 1]});
      expect(game.getCurrentPlayerId()).toEqual(0);
      game.throwDie();
      game.playMove(0);
      expect(game.getCurrentPlayerId()).toEqual(0);
      game.throwDie();
      game.playMove(0);

      expect(game.getCurrentPlayerId()).toEqual(1);
    });

    it('should eat another users pawns', function () {
      var game = generateSmallGame({throws: [6, 5, 6, 4]});
      game.throwDie();
      game.playMove(0);
      game.throwDie();
      game.playMove(0);
      game.throwDie();
      game.playMove(0);
      game.throwDie();
      spyOn(game, 'trigger');
      game.playMove(0);
      expect(game.trigger).toHaveBeenCalledWith('pawn:eaten', { playerId: 0, pawnId: 0, pointId: 201});
    });

    it('should put your pawn on the starting position if it is entering the board', function () {
      var game = generateDefaultGame({throws: [6]});
      spyOn(game, 'trigger');
      expect(game.getCurrentPlayerId()).toEqual(0);
      game.throwDie();
      game.playMove(0);
      expect(game.getCurrentPlayerId()).toEqual(0);
      expect(game.trigger).wasCalledWith('player:move', {playerId: 0, pawnId: 0, pointId: 23});
    });
  });

  describe('Unit tests: Game', function () {
    describe('#isValidMove', function () {
      it('returns if the move is valid', function () {
        var game = generateDefaultGame({throws: [5, 6, 6, 1]});
        game.throwDie();
        for (var playerId = 0; playerId < 4; playerId++) {
          for (var pawnId = 0; pawnId < 4; pawnId++) {
            expect(game.isValidMove(playerId, pawnId)).toBe(false);
          }
        }

        game.throwDie();
        for (var playerId = 0; playerId < 4; playerId++) {
          for (var pawnId = 0; pawnId < 4; pawnId++) {
            expect(game.isValidMove(playerId, pawnId)).toBe(playerId === 0);
          }
        }

        game.playMove(0, 0);
        expect(game.isValidMove(0, 0)).toBe(false);
        game.throwDie();
        for (var playerId = 0; playerId < 4; playerId++) {
          for (var pawnId = 0; pawnId < 4; pawnId++) {
            expect(game.isValidMove(playerId, pawnId)).toBe(playerId === 0 && pawnId === 0);
          }
        }
        game.playMove(0, 0);
        game.throwDie();
        for (var playerId = 0; playerId < 4; playerId++) {
          for (var pawnId = 0; pawnId < 4; pawnId++) {
            expect(game.isValidMove(playerId, pawnId)).toBe(playerId === 0 && pawnId === 0);
          }
        }
      });
    });

    describe('#throwDie', function () {
      it('returns a number', function () {
        var game = generateDefaultGame();
        expect(typeof game.throwDie() === 'number');
      });
    });

    describe('#getCurrentPlayerId()', function () {
      it('returns a number', function () {
        var game = generateDefaultGame();
        expect(typeof game.getCurrentPlayerId() === 'number');
      });
    });

    describe('#getMovablePawns(die)', function () {
      it('should delegate that call to the player', function () {
        var game = generateDefaultGame({throws: [5]});
        var player = game._getCurrentPlayer();

        game.throwDie();
        spyOn(player, 'getMovablePawns');
        game.getMovablePawns();
        expect(player.getMovablePawns).toHaveBeenCalledWith(5);
      });
    });
  });

  describe('#start()', function () {
    it('should trigger die:awaitingThrow', function () {
      var game = generateDefaultGame({throws: [5]});
      spyOn(game, 'trigger');
      game.start();
      expect(game.trigger).toHaveBeenCalledWith('die:awaitingThrow');
    });
  });
})();
