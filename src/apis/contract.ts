import { CurrentSecretUrl } from "@/plugins/chain";
import { GraphqlClient } from "@/utils/gql";

export const callContract = async (caller: string, contract: string, payload: string, signatureType: number, signature: string) => {
    const response = await (new GraphqlClient(CurrentSecretUrl())).query({
        query: `mutation{
            contractCall(
                caller:"${caller}",
                contract:"${contract}",
                payload:"${payload}",
                signatureType:${signatureType},
                signature:"${signature}",
            )
          }`,
    })

    console.log(response)
    return response
}

