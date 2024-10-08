import { State, StateMachine } from "@stackr/sdk/machine";
import { keccak256, solidityPackedKeccak256, ZeroHash } from "ethers";
import { MerkleTree } from "merkletreejs";
import genesisState from "../../genesis-state.json";
import { transitions } from "./transitions";

interface GameState {
  score: number;
  player: string;
}

interface RawState {
  games: Array<GameState & { id: string }>;
}

interface WrappedState {
  games: Record<string, GameState>;
}

export class AppState extends State<RawState, WrappedState> {
  constructor(state: RawState) {
    super(state);
  }

  transformer() {
    return {
      wrap: () => {
        const games = this.state.games.reduce<WrappedState["games"]>(
          (acc, game) => {
            const { id, ...rest } = game;
            acc[id] = { ...rest };
            return acc;
          },
          {}
        );
        return { games };
      },
      unwrap: (wrappedState: WrappedState) => {
        const games = Object.keys(wrappedState.games).map((id) => ({
          id,
          score: wrappedState.games[id].score,
          player: wrappedState.games[id].player,
        }));
        return { games };
      },
    };
  }

  getRootHash(): string {
    const leaves = this.state.games.map(
      ({ id, score, player}) =>
        solidityPackedKeccak256(
          ["string", "uint256", "address"],
          [id, score, player]
        )
    );
    if (leaves.length === 0) {
      return ZeroHash;
    }
    const tree = new MerkleTree(leaves, keccak256);
    return tree.getHexRoot();
  }
}

const MACHINE_ID = "game_machine";
const machine = new StateMachine({
  id: MACHINE_ID,
  stateClass: AppState,
  initialState: genesisState.state,
  on: transitions,
});

export { machine, MACHINE_ID };