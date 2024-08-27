import { ActionSchema, MicroRollup } from "@stackr/sdk";
import { stackrConfig } from "../../stackr.config";
import { machine } from "./machine";
import { EndGameSchema, StartGameSchema } from "./schemas";


const stfSchemaMap: Record<string, ActionSchema> = {
  startGame: StartGameSchema,
  endGame: EndGameSchema,
};


const mru = await MicroRollup({
  config: stackrConfig,
  actionSchemas: [StartGameSchema, EndGameSchema],
  stateMachines: [machine],
  stfSchemaMap,
});

await mru.init();

export { mru, stfSchemaMap};
