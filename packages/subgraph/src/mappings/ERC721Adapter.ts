import { SetErc721 } from "../../generated/templates/Kernel/ERC721Adapter"
import { loadERC721AdapterTokenData } from "../helpers"

export function handleSetErc721(event: SetErc721): void {
  loadERC721AdapterTokenData(event.address)
}
