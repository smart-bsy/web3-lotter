const { useMoralis, useWeb3Contract } = require("react-moralis");
const { abi, contractAddress } = require("../contract/index");
const { useEffect, useState } = require("react");
const { ethers } = require("ethers");
const { useNotification } = require("web3uikit");
/**
 *  TODO：
 *  1. 采用监听 event 的方式来更新 recentWinner、playnersNum等变量
 *  现在这种方式不太灵敏
 *  2. 显示lottery balance
 *  3. 使用tailwind css
 */
const LotteryEntrance = function () {
  const dispatch = useNotification();
  // call contract need address, abi, functionName param
  const [entranceFee, setEntranceFee] = useState("0");
  const [recentWinner, setRecentWinnter] = useState("0");
  const [playersNum, setPlayersNum] = useState("0");
  const [lotteryBalance, setLotteryBalance] = useState("0");
  const { chainId: chainHex, isWeb3Enabled, web3 } = useMoralis();
  const chainId = parseInt(chainHex, 16);
  const raffleAddress =
    chainId in contractAddress ? contractAddress[chainId] : null;
  const { runContractFunction: getEnteranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEnteranceFee",
    params: {},
  });
  // how can i set tx value and other fields , data
  const {
    runContractFunction: enterRaffle,
    data: enterTxResponse,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    msgValue: ethers.utils.parseEther(entranceFee),
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  const { runContractFunction: getPlayersNum } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getPlayersNum",
    params: {},
  });

  async function updateUI() {
    const winner = (await getRecentWinner()).toString();
    setRecentWinnter(winner);
    const pm = (await getPlayersNum()).toString();
    setPlayersNum(pm);
    const ef = (await getEnteranceFee()).toString();
    setEntranceFee(ethers.utils.formatEther(ef));
    const rb = (await web3.getBalance(raffleAddress)).toString();
    setLotteryBalance(ethers.utils.formatEther(rb));
  }
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  async function entranceLottery() {
    // onSuccess: hook metaMask sent transaction success
    await enterRaffle({
      onSuccess: handleEntranceSuccess,
      onError: handleEntranceError,
    });
  }
  async function handleEntranceSuccess(tx) {
    await tx.wait(1);
    // ? tx ~ enterTxResponse ?
    console.log(tx);
    handleNewNotification("success");
  }
  async function handleEntranceError(error) {
    handleNewNotification("error");
    console.log(error);
  }
  function handleNewNotification(type) {
    dispatch({
      type: type,
      message: "Transaction Complete!",
      title: "Transaction Notification",
      icon: "bell",
      position: "topR",
    });
  }

  return (
    <div className="p-5">
      <div>Hi from raffle!!!</div>
      {raffleAddress ? (
        <div>
          <button
            onClick={entranceLottery}
            disabled={isLoading || isFetching}
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded ml-auto"
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter lottery</div>
            )}
          </button>
          <div>
            <div>lottery entrance fee {entranceFee} eth</div>
            <div>lottery balance {lotteryBalance} eth</div>
            <div>The current number of players is: {playersNum}</div>
            <div>The most previous winner was: {recentWinner}</div>
          </div>
        </div>
      ) : (
        <h3>please connect a chain</h3>
      )}
    </div>
  );
};
module.exports = LotteryEntrance;
