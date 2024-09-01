import { ActionSchema, SolidityType } from "@stackr/sdk";

export const StartGameSchema = new ActionSchema("startGame", {
  startTimestamp: SolidityType.UINT
});

export const EndGameSchema = new ActionSchema("endGame", {
  gameId: SolidityType.STRING,
  endTimestamp: SolidityType.UINT, 
  score: SolidityType.UINT,
  stages: SolidityType.STRING,
  inputs: SolidityType.STRING,
});