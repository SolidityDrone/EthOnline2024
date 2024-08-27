import { REQUIRE, STF, Transitions } from "@stackr/sdk/machine";
import { hashMessage } from "ethers";
import { AppState } from "./machine";

export type StartGameInput = {
  startTimestamp: number;
};

export type EndGameInput = {
  gameId: string;
  timestamp: number;
  score: number;
  gameInputs: string;
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
      height: 0,
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

    return state;
  },
};

export const transitions: Transitions<AppState> = {
  startGame,
  endGame,
};