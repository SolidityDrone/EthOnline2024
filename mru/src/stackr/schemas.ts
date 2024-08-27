import { ActionSchema, SolidityType } from "@stackr/sdk";

export const StartGameSchema = new ActionSchema("startGame", {
  startTimestamp: SolidityType.UINT
});

export const EndGameSchema = new ActionSchema("endGame", {
  gameId: SolidityType.UINT,
  endTimestamp: SolidityType.UINT, 
  score: SolidityType.UINT,
  stackTimestamps: SolidityType.STRING,
});