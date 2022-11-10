const { ConnectButton } = require("web3uikit");

const Header = function () {
  return (
    <div className="border-b-2 p-5 flex flex-row">
      <h1 className="py-4 px-4 font-blog text-3xl italic">
        Dicentrialized Lottery
      </h1>
      <div className="ml-auto py-2 px-4">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
};

module.exports = Header;
