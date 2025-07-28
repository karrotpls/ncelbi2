const stakingContractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const ncelbi2TokenAddress = "0xb9d801Ded0ff1102701dbF0Edf6aC74dd42D6392";

const stakingAbi = [
  "function stake(uint256 amount) external",
  "function withdraw(uint256 amount) external",
  "function stakedBalance(address user) external view returns (uint256)"
];

const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

let signer, provider, stakingContract, ncelbi2;

async function connectWallet() {
  if (!window.ethereum) return alert("Install MetaMask");

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();

  const address = await signer.getAddress();
  document.getElementById("wallet").innerText = address;

  stakingContract = new ethers.Contract(stakingContractAddress, stakingAbi, signer);
  ncelbi2 = new ethers.Contract(ncelbi2TokenAddress, erc20Abi, signer);

  updateBalances();
}

async function updateBalances() {
  const address = await signer.getAddress();
  const balance = await ncelbi2.balanceOf(address);
  const staked = await stakingContract.stakedBalance(address);
  const decimals = await ncelbi2.decimals();

  document.getElementById("balance").innerText = ethers.utils.formatUnits(balance, decimals);
  document.getElementById("staked").innerText = ethers.utils.formatUnits(staked, decimals);
}

async function stake() {
  const amount = document.getElementById("stakeAmount").value;
  if (!amount) return;

  const decimals = await ncelbi2.decimals();
  const parsed = ethers.utils.parseUnits(amount, decimals);

  const tx1 = await ncelbi2.approve(stakingContractAddress, parsed);
  await tx1.wait();

  const tx2 = await stakingContract.stake(parsed);
  await tx2.wait();

  updateBalances();
}

async function withdraw() {
  const amount = document.getElementById("withdrawAmount").value;
  if (!amount) return;

  const decimals = await ncelbi2.decimals();
  const parsed = ethers.utils.parseUnits(amount, decimals);

  const tx = await stakingContract.withdraw(parsed);
  await tx.wait();

  updateBalances();
}
