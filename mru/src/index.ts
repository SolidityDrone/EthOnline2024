import {
  ActionConfirmationStatus,
  ActionExecutionStatus,
  ActionSchema,
  MicroRollup,
  AllowedInputTypes,
} from "@stackr/sdk";
import { Wallet } from "ethers";
import express from "express";
import { stackrConfig } from "../stackr.config";
import { EndGameSchema, StartGameSchema } from "./stackr/schemas";
import { machine, MACHINE_ID } from "./stackr/machine";
import { signMessage } from "./utils";

const PORT = process.env.PORT || 3210;



const ensCache = new Map<string, string>();

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

const main = async () => {
  await mru.init();

  const inputs = {
    startTimestamp: 1,
  };

  const app = express();
  app.use(express.json({ limit: "50mb" }));
  
  // Allow CORS
  app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  const stateMachine = mru.stateMachines.get<typeof machine>(MACHINE_ID);
  if (!stateMachine) {
    throw new Error("State machine not found");
  }

  const handleAction = async (
    transition: string,
    schema: ActionSchema,
    payload: any
  ) => {
    const action = schema.actionFrom(payload);
    const ack = await mru.submitAction(transition, action);
    const { logs, errors } = await ack.waitFor(ActionConfirmationStatus.C1);
    if (errors?.length) {
      throw new Error(errors[0].message);
    }
    return logs;
  };

  app.post("/:transition", async (req, res) => {
    const { transition } = req.params;
    const schema = stfSchemaMap[transition];
    const { inputs, signature, msgSender } = req.body;

    try {
      const logs = await handleAction(transition, schema, {
        inputs,
        signature,
        msgSender,
      });
      return res.json({
        isOk: true,
        logs,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ isOk: false, error: error.message });
    }
  });

  const getUniquePlayers = (games: typeof stateMachine.state.games) => {
    const players = new Set<string>();
    for (const game of games) {
      players.add(game.player);
    }
    return [...players];
  };

  app.get("/history", async (_req, res) => {
    const { address } = _req.query;
    const actionsAndBlocks = await mru.actions.query(
      {
        name: "endGame",
        executionStatus: ActionExecutionStatus.ACCEPTED,
        confirmationStatus: [
          ActionConfirmationStatus.C1,
          ActionConfirmationStatus.C2,
          ActionConfirmationStatus.C3A,
          ActionConfirmationStatus.C3B,
        ],
        block: {
          isReverted: false,
        },
      },
      false
    );

    const games = actionsAndBlocks.map((actionAndBlock) => {
      const { hash, block, payload } = actionAndBlock;
      const { gameId, height } = payload;
      const player = stateMachine.wrappedState.games[String(gameId)].player;
      const score = stateMachine.wrappedState.games[String(gameId)].score;
      return {
        gameId,
        player: ensCache.get(player) || player,
        hash,
        score,
        blockInfo: block
          ? {
              status: block.status,
              daMetadata: block.batchInfo?.daMetadata || null,
              l1TxHash: block.batchInfo?.l1TransactionHash || null,
            }
          : null,
      };
    }).filter((game) => !address || game.player.toLowerCase() === address.toString().toLowerCase());
    
    return res.send(games);
  });

  // Define /leaderboard route
  app.get("/leaderboard", async (_req, res) => {
    const { state } = stateMachine;
    const sortedheights = [...state.games].sort((a, b) => b.score - a.score);

    const players = new Set<string>();

    const topTen = sortedheights
      .filter((game) => {
        if (players.has(game.player)) {
          return false;
        }
        players.add(game.player);
        return true;
      })
      .slice(0, 10);

    const leaderboard = await Promise.all(
      topTen.map(async (game) => ({
        address: game.player,
        score: game.score,
      }))
    );

    return res.json(leaderboard);
  });


  app.get("/info", (_, res) => {
    const transitionToSchema = mru.getStfSchemaMap();
    return res.send({
      rpcUrls: [mru.config.L1RPC],
      signingInstructions: "signTypedData(domain, schema.types, inputs)",
      domain: mru.config.domain,
      transitionToSchema,
      schemas: [StartGameSchema, EndGameSchema].reduce((acc, schema) => {
        acc[schema.identifier] = {
          primaryType: schema.EIP712TypedData.primaryType,
          types: schema.EIP712TypedData.types,
        };
        return acc;
      }, {} as Record<string, any>),
    });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

main();
