import { ActionSchema, AllowedInputTypes } from "@stackr/sdk";
import { HDNodeWallet, Wallet} from "ethers";

export const HDNodeSignMessage = async (
  wallet: HDNodeWallet,
  schema: ActionSchema,
  payload: AllowedInputTypes
) => {
  const signature = await wallet.signTypedData(
    schema.domain,
    schema.EIP712TypedData.types,
    payload
  );
  return signature;
};

export const signMessage = async (
  wallet: Wallet,
  schema: ActionSchema,
  payload: AllowedInputTypes
) => {
  const signature = await wallet.signTypedData(
    schema.domain,
    schema.EIP712TypedData.types,
    payload
  );
  return signature;
};
