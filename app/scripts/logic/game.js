define(['lodash', 'backbone'], function (_, Backbone) {
  var RandomThrowGenerator = function () {
    this.generate = function () {
      return Math.round(Math.random() * (6 - 1) + 1);
    }
  };

  var Pawn = function (homePosition, path) {
    this._homePosition = homePosition;
    this._position = homePosition;
    this._path = path;
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

  var Player = function (pawns, path) {
    this._pawns = pawns;
    this._path = path;
    this.getPawn = function (pawnId) {
      return this._getPawn(pawnId);
    };

    this.isMovablePawnsExist = function (die) {
      return this.getMovablePawns(die).length > 0;
    };

    this.isAnyPawnsOnTheBoard = function () {
      for (var i = 0; i < this._pawns.length; i++) {
        if (this._getPawn(i).isOnTheBoard()) {
          return true;
        }
      }
      ;
      return false;
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

      var result = [];
      for (var i = 0; i < this._pawns.length; i++) {
        if (typeof pawnNextPositions[i] === 'number') {
          result.push(i);
        }
      }
      return result;
    };
  };

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

      this.throwDie = function () {
        var value = this._dieThrowGenerator.generate();

        this._incrementDieThrowCount();
        this._setPlayedAfterDieThrow(false);
        if (!this._getCurrentPlayer().isMovablePawnsExist(value)) {
          this._changePlayerIfNeeded(value);
        }
        this.trigger('die:thrown', value);
        return value;
      };

      this._getPlayer = function (playerId) {
        return this._players[playerId];
      };

      this._getCurrentPlayer = function () {
        return this._getPlayer(this.getCurrentPlayerId());
      };

      this._getPlayersCount = function () {
        return 4;
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
        }
      };

      this.playMove = function (pawnId, die) {
        var playerId = this.getCurrentPlayerId();
        var player = this._getCurrentPlayer();
        var pawn = player.getPawn(pawnId);
        pawn.moveBy(die);
        var newPosition = pawn.getPosition();

        this._setPlayedAfterDieThrow(true);
        this._resetDieThrowCount();

        this._changePlayerIfNeeded(die);

        this.trigger('player:move', { playerId: playerId, pawnId: pawnId, pointId: newPosition});
      };
      this.getMovablePawns = function (die) {
        return this._getCurrentPlayer().getMovablePawns(die);
      };

    }
  });

  Game.create = function (options) {
    return new Game(options);
  };

  return Game;
});
