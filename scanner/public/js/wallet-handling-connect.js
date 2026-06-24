//wallet connect
//var WalletConnectProvider = window["@walletconnect/ethereum-provider"].EthereumProvider;
const WalletConnectProjectId = "c441e32d31db9533e084675f7290897d";
const WalletConnectInfuraId = "7809098bc3af4ebdb57464bffac0242c";
const bridgeUrl = "https://etherscan.bridge.walletconnect.org";
const WalletConnect_Url = "https://walletconnect.com/";
const WalletConnect_Icon = "https://avatars.githubusercontent.com/u/37784886";


//wallet link
const WalletLinkInfuraId = "e3301c1a14f943c0b2f3801cb6c7e347";
const WalletLink = window.WalletLink;
// Chosen wallet provider given by the dialog window
let provider; //required


let web3Modal; 

let providers = [];


function ListenProviderList() {
    window.addEventListener(
        "eip6963:announceProvider",
        function (event) {
            providers.push(event.detail);
        }
    );

    window.dispatchEvent(new Event("eip6963:requestProvider"));
}

async function initweb3walletProvider(providerName) {
    console.log(providers);
    var provider;
    var iseip6963 = false;
    //get selected provider from available providers
    let SelectedProvider = providers.find((p) => p.info.name == providerName);

    // if provider available then use the provider for web3 injection, else use general web3.ethereum 
    if (typeof SelectedProvider !== 'undefined') {
        web3obj = new Web3(SelectedProvider.provider);
        provider = SelectedProvider.provider;
        iseip6963 = true;
    }
    else {
        const Web3Modal = window.Web3Modal.default;
        if (typeof parent.ethereum !== 'undefined') {
            if (parent.ethereum.providers?.length > 1) {
                // choose not isCoinbaseWallet - CoinbaseWallet has an official WalletLink package
                let indexProvider = parent.ethereum.providers.findIndex((provider) => provider.isCoinbaseWallet);
                // not found coinbase provider
                if (indexProvider < 0) {
                    indexProvider = 0;
                } else if (indexProvider == 0) {
                    indexProvider = 1;
                } else {
                    indexProvider = indexProvider - 1;
                }
                web3obj = new Web3(parent.ethereum.providers[indexProvider]);
                ethereum = parent.ethereum.providers[indexProvider];
            } else {
                ethereum = parent.ethereum;
                web3obj = new Web3(parent.ethereum);
            }

        } else if (typeof ethereum !== 'undefined') {
            web3obj = new Web3(ethereum);
        } else if (typeof web3 !== 'undefined') {
            web3obj = new Web3(web3.givenProvider);
        } else {
            web3obj = new Web3(new Web3HttpProvider('https://' + net + '.infura.io/v3/dbd67a522fc4476c95ca076ac34d69fc'));
        }

        provider = window.ethereum
    }

    return { web3obj, provider, iseip6963 };
}

async function initweb3wallet() { 
    const Web3Modal = window.Web3Modal.default;
    if (typeof parent.ethereum !== 'undefined') {
        if (parent.ethereum.providers?.length > 1) {
            // choose not isCoinbaseWallet - CoinbaseWallet has an official WalletLink package
            let indexProvider = parent.ethereum.providers.findIndex((provider) => provider.isCoinbaseWallet);
            // not found coinbase provider
            if (indexProvider < 0) {
                indexProvider = 0;
            } else if (indexProvider == 0) {
                indexProvider = 1;
            } else {
                indexProvider = indexProvider - 1;
            }
            web3obj = new Web3(parent.ethereum.providers[indexProvider]);
            ethereum = parent.ethereum.providers[indexProvider];
        } else {
            web3obj = new Web3(parent.ethereum);
            ethereum = parent.ethereum;
        }

    } else if (typeof ethereum !== 'undefined') {
        web3obj = new Web3(ethereum);
    } else if (typeof web3 !== 'undefined') {
        web3obj = new Web3(web3.givenProvider);
    } else {
        web3obj = new Web3(new Web3HttpProvider('https://' + net + '.infura.io/v3/dbd67a522fc4476c95ca076ac34d69fc'));
    }

    return web3obj;
}



// Note: In future to comment or remove
async function initConnectWallet(networkChainid, SiteNetId, SitePublicRpcUrl) {
    const Web3Modal = window.Web3Modal.default;
    SiteNetId.toString()
    var WalletConnectProvider = window["@walletconnect/ethereum-provider"].EthereumProvider;
    var walletConnectObj = await WalletConnectProvider.init({
        projectId: WalletConnectProjectId, // REQUIRED your projectId
        chains: [networkChainid],
        showQrModal: true,
        rpcMap:
        {
            [SiteNetId] : SitePublicRpcUrl
        }
    });
    return walletConnectObj
}

// Note: In future to comment or remove
async function connectConnectWallet(walletConnectObj) {
    // is there a way for us to catch the qrmodal rejection and flush the object? TODO
    try {
        var walletConnectEnableTask = walletConnectObj.connect();
        await walletConnectEnableTask;
        walletConnectObj.on('disconnect', function (error, payload) {
            window.location.reload(true)
        });
        setTimeout(() => {
            $(".walletconnect-modal__footer>a").on("click", (el) => {
                if ($(el.currentTarget).html() == "Copy to clipboard") {
                    alert("Successfully copied to clipboard");
                }
            })
        });

        web3obj = new Web3(walletConnectObj);
        return web3obj;

    } catch (err) {
        alert('Failed to establish a connection to ' + type + '.');
        await exitProvider();
        return;
    }
}

async function disconnect(walletConnectObj) {
    if (walletConnectObj) {
        await walletConnectObj.disconnect();
        window.location.reload(true);
    }
}


async function initwalletLink(chainid, mainnetName, strExplorerUrl, strFavIcon) {
    const CoinbaseWalletSDK = window.CoinbaseWalletSDK;

    const web3Modal = new CoinbaseWalletSDK({
        appName: mainnetName,  // Your dApp's name
        appLogoUrl: strFavIcon,  // Optional logo URL
        darkMode: false  // Optional: Use dark mode
    });

    return web3Modal;
}

async function connectWalletLink(type, web3Modal, chainid, acceptedChainId) {
    provider = web3Modal.makeWeb3Provider(window.ethereum, chainid);

    web3obj = new Web3(provider);
    await provider.request({ method: 'eth_requestAccounts' })

    /* To catter smart wallet change chainid, 
   as from browser plugin select using smart wallet
   will not change accordingly default chain mainnet */
    network = await web3obj.eth.getChainId();
    if (chainid != network) {
        switchEthereumChainWithProvider(web3obj.currentProvider, acceptedChainId)
    }
    

    return web3obj
}

async function disconnectWalletLink(web3Modal) {
    if (provider.close) {
        await provider.close();
        await provider.disconnect();
        // If the cached provider is not cleared,
        // WalletConnect will default to the existing session
        // and does not allow to re-scan the QR code with a new wallet.
        // Depending on your use case you may want or want not his behavir.
        //await web3Modal.clearCachedProvider();
        provider = null;
        window.location.reload(true);
    }
}


// Defi wallet - This function only apply to Cronos
async function initialDefiWallet(strNetId, SiteNetChainId, SitePublicRpcUrl) {
    var walletConnectObj = new window.DeFiConnect.DeFiWeb3Connector({
        supportedChainIds: [strNetId],
        rpc: {

            [SiteNetChainId]: SitePublicRpcUrl
        },
        pollingInterval: 15000
    });

    return walletConnectObj
}

async function connectDefiWallet(walletConnectObj) {
    await walletConnectObj.activate();
    provider = await walletConnectObj.getProvider();
    web3obj = new Web3(provider);

    return web3obj
}

async function exitProvider(walletConnectObj_v2) {
    if (provider) {
        await provider.close();
        // If the cached provider is not cleared,
        // WalletConnect will default to the existing session
        // and does not allow to re-scan the QR code with a new wallet.
        // Depending on your use case you may want or want not his behavir.
        //await web3Modal.clearCachedProvider();
        provider = null;
        window.location.reload(true);
    }

    if (walletConnectObj_v2) {
        await walletConnectObj_v2.disconnect();
        window.location.reload(true);
    }
}

async function getDetailsFromMetamask() {
    try {
        if (!isMetamaskInstalled()) {
            return null;
        }

        var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length == 0) {
            return null;
        }

        var account = accounts[0]
        var chainId = ethereum.chainId

        return { account, chainId };
    } catch (error) {
        return null;
    }
}

async function getDetailsFromMetamaskWithProvider(provider) {
    try {
        if (!isMetamaskInstalled()) {
            return null;
        }

        var accounts = await provider.request({ method: 'eth_requestAccounts' });
        if (accounts.length == 0) {
            return null;
        }

        var account = accounts[0]
        var chainId = provider.chainId

        return { account, chainId };
    } catch (error) {
        return null;
    }
}

async function getDetailsFromProvider(provider) {
    try {
        var accounts = await provider.request({ method: 'eth_requestAccounts' });
        if (accounts.length == 0) {
            return null;
        }

        var account = accounts[0]
        var chainId = provider.chainId

        return { account, chainId };
    } catch (error) {
        return null;
    }
}

function isMetamaskInstalled() {
    return window.ethereum && window.ethereum.isMetaMask;
}

async function checkWeb3WalletProvider(providerName) {
    var rtnCheck = 0;
    let SelectedProvider = providers.find((p) => p.info.name == providerName);

    // if provider available then use the provider for web3 injection, else use general web3.ethereum 
    if (typeof SelectedProvider !== 'undefined') {
        rtnCheck = 1;
    }
    return rtnCheck;
}

function createContract(web3, abi, account, data) {
    var contract = web3.eth.contract(abi);

    web3.eth.estimateGas({
        from: account,
        data: data
    }, function (error, estimatedGas) {
        var gasfee;
        if (!error) {
            gasfee = estimatedGas
        }
        else {
            gasfee = '5000000';
        }

        contract.new(
            {
                from: account,
                data: data,
                gas: gasfee
            }, function (e, contract) {
                //if (typeof contract.address !== 'undefined') {
                //console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
                //}
            });
    });
}

function registerMetamaskEvents() {
    window.ethereum.on('accountsChanged', async (accounts) => {
        walletDetails.account = accounts[0];
    });

    window.ethereum.on('chainChanged', function (chainId) {
        var flag = false;
        if (chainId.toLowerCase() != acceptedChainId.toLowerCase()) {
            alert("Please connect to " + mainnetName + " network");
            flag = true;
        }

        if (flag) {
            window.location.reload();
        }
    });
}

function registerMetamaskEventsWithProvider(provider) {
    provider.on('accountsChanged', async (accounts) => {
        walletDetails.account = accounts[0];
    });

    provider.on('chainChanged', function (chainId) {
        var flag = false;
        if (chainId != acceptedChainId) {
            alert("Please connect to " + mainnetName + " network");
            flag = true;
        }

        if (flag) {
            window.location.reload();
        }
    });
}

function switchEthereumChain(acceptedChainId) {
    return window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: acceptedChainId }], // chainId must be hexadecimal.
    });
}

function switchEthereumChainWithProvider(provider, acceptedChainId) {
    return provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: acceptedChainId }], // chainId must be hexadecimal.
    });
}

function addEthereumChain(acceptedChainId, mainnetName, strSymbol, strRpcUrl, strExplorerUrl, decimal) {
    let p = [{
        chainId: acceptedChainId,
        chainName: mainnetName,
        nativeCurrency: {
            name: strSymbol,
            symbol: strSymbol,
            decimals: decimal
        },
        rpcUrls: [strRpcUrl],
        blockExplorerUrls: [strExplorerUrl]
    }]

    return window.ethereum.request({ method: 'wallet_addEthereumChain', params: p });
}


function addEthereumChainWithProvider(acceptedChainId, mainnetName, strSymbol, strRpcUrl, strExplorerUrl, decimal, provider) {
    let p = [{
        chainId: acceptedChainId,
        chainName: mainnetName,
        nativeCurrency: {
            name: strSymbol,
            symbol: strSymbol,
            decimals: decimal
        },
        rpcUrls: [strRpcUrl],
        blockExplorerUrls: [strExplorerUrl]
    }]

    return provider.request({ method: 'wallet_addEthereumChain', params: p });
}

function addEthereumTokenWithProvider(litAssetType, litAssetAddress, litAssetSymbol, litAssetDecimal, litAssetLogo, provider) {

    let p = {
        'type': litAssetType,
        'options': {
            'address': litAssetAddress,
            'symbol': litAssetSymbol,
            'decimals': litAssetDecimal,
            'image': litAssetLogo,
        },
    }

    return provider.sendAsync({
        method: 'wallet_watchAsset', params: p, id: Math.round(Math.random() * 100000)
    });
}

function GeneralRequestWithProvider(method, param, provider) {

    return provider.request({ method: method, params: param });
}


function isInputAddress(web3, address) {
    var isAddress = false;
    try {
        var checkSumAddress = web3.utils.toChecksumAddress(address);
        isAddress = web3.utils.isAddress(checkSumAddress);
    } catch {
        isAddress = false
    }

    return isAddress
}


function getNativeChainTokenDetails(intChainId) {
    switch (intChainId) {
        case 56: // BNB Smart Chain Mainnet
        case 97: // BNB Smart Chain Testnet
            return {
                tokenTicker: "BNB",
                tokenName: "BNB",
                decimals: 18
            };
        case 137: // Polygon Mainnet
        case 80002: // Polygon Amoy Testnet
            return {
                tokenTicker: "POL",
                tokenName: "Polygon",
                decimals: 18
            };
        case 1284: // Moonbeam Mainnet
            return {
                tokenTicker: "GLMR",
                tokenName: "Glimmer",
                decimals: 18
            };
        case 1285: // Moonriver Mainnet
            return {
                tokenTicker: "MOVR",
                tokenName: "Moonriver",
                decimals: 18
            };
        case 1287: // Moonbase Alpha Testnet
            return {
                tokenTicker: "DEV",
                tokenName: "Moonbase Alpha",
                decimals: 18
            };
        case 25: // Cronos
            return {
                tokenTicker: "CRO",
                tokenName: "Cronos",
                decimals: 18
            };
        case 199: // BitTorrent Chain Mainnet
            return {
                tokenTicker: "BTT",
                tokenName: "BitTorrent",
                decimals: 18
            };
        case 42220: // Celo Mainnet
        case 44787: // Celo Alfajores Testnet
            return {
                tokenTicker: "CELO",
                tokenName: "Celo",
                decimals: 18
            };
        case 100: // Gnosis Chain
            return {
                tokenTicker: "xDAI",
                tokenName: "XDAI",
                decimals: 18
            };
        case 1111: // WEMIX Mainnet
        case 1112: // WEMIX Testnet
            return {
                tokenTicker: "WEMIX",
                tokenName: "WEMIX",
                decimals: 18
            };
        case 43114: // Avalanche C-Chain Mainnet
        case 43113: // Avalanche Fuji Testnet
            return {
                tokenTicker: "AVAX",
                tokenName: "Avalanche",
                decimals: 18
            };
        case 50: // XDC Network
        case 51: // XDC Apothem Network
            return {
                tokenTicker: "XDC",
                tokenName: "XDC",
                decimals: 18
            };
        case 146: // Sonic Mainnet
        case 14601: // Sonic Testnet
            return {
                tokenTicker: "S",
                tokenName: "Sonic",
                decimals: 18
            };
        case 50104: // Sophon Mainnet
        case 531050104: // Sophon Testnet
            return {
                tokenTicker: "SOPH",
                tokenName: "Sophon",
                decimals: 18
            };
        case 80094: // Berachain Mainnet
            return {
                tokenTicker: "BERA",
                tokenName: "Berachain",
                decimals: 18
            };
        case 4352: // Memecore Mainnet
        case 43521: // Memecore Testnet
            return {
                tokenTicker: "M",
                tokenName: "Memecore",
                decimals: 18
            };
        default:
            return {
                tokenTicker: "ETH",
                tokenName: "Ether",
                decimals: 18
            };
    }
}

async function connectWithRabby(providerName) {
    const walletInput = String(providerName || '').toLowerCase();
    let nonBrowserWallet = true;
    let web3obj = null;

    const isRabbyInfo = (info) => {
        const s = ((info?.name || '') + ' ' + (info?.rdns || '')).toLowerCase();
        // Accepts "Rabby Wallet", "io.rabby", etc.
        return s.includes('rabby');
    };

    // 1) Try EIP-6963-discovered Rabby first
    try {
        let entry = null;

        // If a specific label was passed ("Rabby"), prefer entries whose name contains it;
        // otherwise any provider that looks like Rabby.
        if (Array.isArray(providers) && providers.length) {
            entry = providers.find(p => // Prefer “name contains Rabby” if available
                p?.info && isRabbyInfo(p.info) &&
                (walletInput ? String(p.info.name || '').toLowerCase().includes(walletInput) : true)
            ) || providers.find(p => p?.info && isRabbyInfo(p.info));
        }

        if (entry && entry.provider) {
            web3obj = new Web3(entry.provider);
            const provider = entry.provider;
            const iseip6963 = true;
            return { web3obj, provider, iseip6963, nonBrowserWallet };
        }
    } catch (err) {
        console.error("connectWithRabby #1 - ", err);
    }

    // 2) Fallback: classic injected provider that identifies as Rabby
    try {
        if (window.ethereum && (window.ethereum.isRabby === true ||
            window.ethereum.provider?.isRabby === true)) {
            web3obj = new Web3(window.ethereum);
            const provider = window.ethereum;
            const iseip6963 = false;
            return { web3obj, provider, iseip6963, nonBrowserWallet };
        }
    } catch (err) {
        console.error("connectWithRabby #2 - ", err);
    }

    // 3) Mobile: fall back to "whatever injected provider exists" so Rabby Mobile / MetaMask-in-Rabby still work.
    const isEIP6963Env = Array.isArray(providers) && providers.length > 0;
    const hasInjected = typeof parent.ethereum !== 'undefined';
    const isLikelyMobile = !isEIP6963Env && hasInjected;
    try {
        if (isLikelyMobile) {
            ethereum = parent.ethereum;
            web3obj = new Web3(parent.ethereum);
            const provider = parent.ethereum;
            const iseip6963 = false;
            nonBrowserWallet = false;
            return { web3obj, provider, iseip6963, nonBrowserWallet };
        }
    } catch (err) {
        console.error("connectWithRabby #3 - ", err);
    }

    // 4) Not found → return nulls
    return { web3obj: null, provider: null, iseip6963: false, nonBrowserWallet: null };
}

async function disconnectMmAndRabby(provider) {
    // Reference link for the method:
    // https://docs.metamask.io/wallet/reference/json-rpc-methods/wallet_revokepermissions
    // https://github.com/MetaMask/metamask-improvement-proposals/blob/main/MIPs/mip-2.md
    await provider.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }],
    });
}

async function getDetailsFromRabbyWithProvider(provider) {
    try {
        if (!(window.ethereum && window.ethereum.isRabby)) {
            return null;
        }

        var accounts = await provider.request({ method: 'eth_requestAccounts' });
        if (accounts.length == 0) {
            return null;
        }

        var account = accounts[0]
        var chainId = provider.chainId

        return { account, chainId };
    } catch (error) {
        return null;
    }
}

async function connectWithOther(providerName, ps = null) {
    const walletInput = String(providerName || '').toLowerCase();
    let nonBrowserWallet = true;
    let web3obj = null;

    // 1) Try EIP-6963-discovered wallet
    try {
        let entry = null;

        // get the selected wallet provider 
        if (Array.isArray(providers) && providers.length) {
            entry = providers.find((p) => p.info.name == providerName);
        }

        if (entry == undefined && ps != null) {
            entry = ps.find((p) => p.info.name == providerName);
        }

        if (entry && entry.provider) {
            web3obj = new Web3(entry.provider);
            const provider = entry.provider;
            const iseip6963 = true;
            return { web3obj, provider, iseip6963, nonBrowserWallet };
        }
    } catch (err) {
        console.error("connectWithOther #1 - ", err);
        // fall through to window.ethereum fallback
    }

    // 2) Fallback: classic injected provider
    try {
        if (window.ethereum) {
            web3obj = new Web3(window.ethereum);
            const provider = window.ethereum;
            const iseip6963 = false;
            return { web3obj, provider, iseip6963, nonBrowserWallet };
        }
    } catch (err) {
        console.error("connectWithOther #2 - ", err);
    }

    // 3) Mobile: fall back to "whatever injected provider exists"
    const isEIP6963Env = Array.isArray(providers) && providers.length > 0;
    const hasInjected = typeof parent.ethereum !== 'undefined';
    const isLikelyMobile = !isEIP6963Env && hasInjected;
    try {
        if (isLikelyMobile) {
            ethereum = parent.ethereum;
            web3obj = new Web3(parent.ethereum);
            const provider = parent.ethereum;
            const iseip6963 = false;
            nonBrowserWallet = false;
            return { web3obj, provider, iseip6963, nonBrowserWallet };
        }
    } catch (err) {
        console.error("connectWithOther #3 - ", err);
    }

    // 4) Not found → return nulls
    return { web3obj: null, provider: null, iseip6963: false, nonBrowserWallet: null };
}

async function getDetailsFromOtherProvider(provider) {
    try {
        var accounts = await provider.request({ method: 'eth_requestAccounts' });
        var chainId = await provider.request({ method: "eth_chainId" });
        if (accounts.length == 0) {
            return null;
        }

        var account = accounts[0]
        //var chainId = provider.chainId

        return { account, chainId };
    } catch (error) {
        return null;
    }
}

async function revokeConnection(provider) {
    try {
        await provider.request({
            method: "wallet_revokePermissions",
            params: [{ eth_accounts: {} }],
        });
        return true;
    } catch { }

    try {
        if (typeof provider.disconnect === "function") {
            await provider.disconnect();
            return true;
        }
    } catch { }

    return false;
}