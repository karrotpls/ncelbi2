// App.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT";
const ABI = [...] // paste ABI from Remix compilation

export default function App() {
  const [provider, setProvider] = useState();
  const [contract, setContract] = useState();
  const [account, setAccount] = useState();
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      const prov = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(prov);
    }
  }, []);

  const connectWallet = async () => {
    const accs = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accs[0]);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    setContract(nftContract);
  };

  const mint = async () => {
    try {
      setStatus("Minting...");
      const tx = await contract.mintNFT({ value: ethers.utils.parseEther("0.01") });
      await tx.wait();
      setStatus("Mint successful!");
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Karrot x 404 NFT</h1>
      {!account ? (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      ) : (
        <div>
          <p>Connected: {account}</p>
          <Button onClick={mint}>Mint NFT</Button>
          <p>{status}</p>
        </div>
      )}
    </div>
  );
}
