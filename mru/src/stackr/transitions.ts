import { REQUIRE, STF, Transitions } from "@stackr/sdk/machine";
import { hashMessage } from "ethers";
import { AppState } from "./machine";

export type StartGameInput = {
  startTimestamp: number;
};

export type EndGameInput = {
  gameId: string;
  endTimestamp: number;
  score: number;
  stages: string;
  gameinputs: string;
};

const startGame: STF<AppState, StartGameInput> = {
  handler: ({ state, inputs, msgSender, block, emit }) => {
    const { startTimestamp } = inputs;
    const gameId = hashMessage(
      `${msgSender}::${startTimestamp}::${block.timestamp}::${
        Object.keys(state.games).length
      }::${startTimestamp}`
    );

    state.games[gameId] = {
      score: 0,
      player: String(msgSender),
    };

    emit({
      name: "GameCreated",
      value: gameId,
    });
    return state;
  },
};


const endGame: STF<AppState, EndGameInput> = {
  handler: ({ state, inputs, msgSender }) => {
    const { gameId, endTimestamp, score, stages, gameinputs} = inputs;
    const { games } = state;
    // validation checks
    REQUIRE(!!games[gameId], "GAME_NOT_FOUND");
    REQUIRE(games[gameId].score === 0, "GAME_ALREADY_ENDED");
    REQUIRE(games[gameId].player === String(msgSender), "UNAUTHORIZED");

    games[gameId].score = score;
    return state;
  },
};

export const transitions: Transitions<AppState> = {
  startGame,
  endGame,
};