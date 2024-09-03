import { useState, useEffect } from 'react';
import { submitAction, fetchInfo } from "@/rpc/api";
import { getAddress } from "viem";
import { useAccount, useSignTypedData } from "wagmi";

export const useAction = () => {
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const [info, setInfo] = useState<{ domain: any, schemas: Record<string, any> } | null>(null);

  useEffect(() => {
    const fetchAndSetInfo = async () => {
      try {
        const data = await fetchInfo();
        setInfo({ domain: data.domain, schemas: data.schemas });
      } catch (error) {
        console.error("Error fetching info:", error);
      }
    };
    fetchAndSetInfo();
  }, []);

  if (!address || !info) {
    return { submit: () => Promise.resolve() };
  }
  
  const { domain, schemas } = info;
  const msgSender = getAddress(address);

  const submit = async (transition: string, inputs: any) => {
    console.log("Submit function triggered for transition:");
    const schema = schemas[transition];
    
    if (!schema) {
      console.error(`Schema for transition "${transition}" not found.`);
      return;
    }

    const { primaryType, types } = schema;


    const message = { ...inputs };
  
    
    let signature;
    try {
      signature = await signTypedDataAsync({
        domain,
        primaryType: schemas[transition].primaryType,
        types: schemas[transition].types,
        message,
        account: msgSender,
      });
      console.log("Signature generated:", signature);
    } catch (e) {
      console.error("Error signing message", e);
      return;
    }

    return submitAction(transition, {
      inputs,
      signature,
      msgSender,
    });
  };

  return { submit };
};