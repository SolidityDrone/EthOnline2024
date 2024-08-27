import { State } from "@stackr/sdk/machine";
import { keccak256, solidityPackedKeccak256, ZeroHash } from "ethers";
import { MerkleTree } from "merkletreejs";

interface GameState {
  score: number;
  height: number;
  player: string;
}

export interface RawState {
  games: Array<GameState & { id: string }>;
}

export interface WrappedState {
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
          ...wrappedState.games[id],
        }));
        return { games };
      },
    };
  }

  getRootHash(): string {
    const leaves = this.state.games.map(
      ({ id, height, player }) =>
        solidityPackedKeccak256(
          ["string", "uint256", "address"],
          [id, height, player]
        )
    );
    if (leaves.length === 0) {
      return ZeroHash;
    }
    const tree = new MerkleTree(leaves, keccak256);
    return tree.getHexRoot();
  }
}
