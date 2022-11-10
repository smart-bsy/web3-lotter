const { useEffect } = require("react");
const { useMoralis } = require("react-moralis");

const walletConnected = "walletConnected";
const ManualHeader = function () {
  const {
    account,
    enableWeb3,
    isWeb3Enabled,
    chainId,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  function connectWallet() {
    enableWeb3()
      .then((res) => {
        if (res) {
          console.log(res);
          if (typeof window != "undefined") {
            localStorage.setItem(walletConnected, "injected");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined") {
      if (localStorage.getItem(walletConnected)) {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      if (!account) {
        localStorage.removeItem(walletConnected);
        deactivateWeb3();
      }
    });
  }, []);

  return (
    <>
      <div>
        {account ? (
          <button>
            connected to {account.slice(0, 6)}...{account.slice(-4)}
          </button>
        ) : (
          <button onClick={connectWallet} disabled={isWeb3EnableLoading}>
            connect wallet
          </button>
        )}
      </div>
    </>
  );
};

module.exports = ManualHeader;
