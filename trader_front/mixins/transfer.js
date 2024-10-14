import walletMixin from './wallet';
import listMixin from '@/mixins/list';

export default {
    data() {
        return {
            view: 'main',
            fromWallet: 'fiat/spot',
            toWallet: 'margin',
            direction: 'from',
            assetCategoriesOpen: false,
            assetToTransfer: null,
            numberInput: '',
            showPreview: false,
            inputError: false,
            transactionType: 'transfer',
            transactionFee: 0,
            assetType: "crypto",
        }
    },
    mixins: [walletMixin, listMixin],
    methods: {
        togglePreview() {
            this.showPreview ? this.showPreview = false : 
            this.showPreview = true;
        },
        validateNumberInput() {
            const { customSplitByDot, removePeriodAndCommas } = this;
            const formattedNumber = this.numberInput.replace(/[^1234567890.]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            const characters = removePeriodAndCommas(customSplitByDot(formattedNumber));
            
            return this.numberInput = characters;
        },
        customSplitByDot(inputString) {
            const dotIndex = inputString.indexOf('.');
            if (dotIndex !== -1) {
                const firstPart = inputString.slice(0, dotIndex + 1);
                const secondPart = inputString.slice(dotIndex + 1);
                return [firstPart, secondPart];
            } else {
                return [inputString, '']; // If there's no dot, return the whole string in the first part and an empty string in the second part.
            }
        },
        removePeriodAndCommas(array) {
            const withoutPeriodAndCommas = array.map((str, index) => {
                if (index === 1) {
                    return str.replace(/[.,]/g, '');
                }

                return str;
            });

            return withoutPeriodAndCommas.join('');
        },
        toggleMenu(direction) {
            if (direction) {
                this.direction = direction;
            }

            this.view === 'main' ? this.view = 'category options' : this.view = 'main'
        },
        selectWallet(wallet) {
            const { direction } = this;
            if (direction === 'from') {
                this.fromWallet = wallet;
            }

            if (direction === 'to') {
                this.toWallet = wallet;
            }

            return this.view = 'main';
        },
        toggleSwitch() {
            const { fromWallet, toWallet } = this;
            const from = fromWallet;
            const to = toWallet;

            this.fromWallet = to;
            this.toWallet = from;
        },
        toggleAssetsMenu() {
            this.assetCategoriesOpen ? 
            this.assetCategoriesOpen = false : 
            this.assetCategoriesOpen = true;
        },
        setCurrentAsset(cryptoasset) {
            const { toggleAssetsMenu } = this;
            this.assetToTransfer = cryptoasset;
            toggleAssetsMenu();
        },
        checkBalance() {
            const { assetWalletBalance, client, youPayUSD, calculatePercentage } = this;
            
            if (!assetWalletBalance) {
                return this.inputError = true;
            }

            if (assetWalletBalance) {
                const { balanceInDollars } = assetWalletBalance;
                const { transactionFeePercentage } = client;

                if (assetWalletBalance.base.balanceinWallet) {
                    const transactionFee = calculatePercentage(youPayUSD, transactionFeePercentage);
                    const transactionTotal = parseFloat(transactionFee) + parseFloat(youPayUSD);
                    this.transactionFee = transactionFee.toFixed(20);

                    if (balanceInDollars <= transactionTotal) {
                        this.inputError = true;
                    }

                    if (balanceInDollars > transactionTotal) {
                        this.inputError = false;
                    }
                }
            }
        },
        calculatePercentage(input, percentage) {
            return input * (percentage / 100);
        }
    },
    computed: {
        dataToSubmit() {
            const { client, toWallet, fromWallet, numberInput, assetToTransferData, fee } = this;
            const transactionDescription = `transfered ${numberInput} ${assetToTransferData._id} from ${fromWallet} wallet to ${toWallet} wallet`;

            
            const body = {
                assetName: assetToTransferData.name,
                youPayUSD: this.youPayUSD,
                assetType: this.assetType,
                ownerId: client._id,
                assetId: assetToTransferData._id,
                balanceAmount: parseFloat(numberInput),
                transactionType: {
                    type: "transfer",
                    fee: parseFloat(this.transactionFee),
                    fromWallet,
                    toWallet
                },
                transactionDescription,
                currentWallet: toWallet,
                formerWallet: fromWallet
            }
            
            return body
        },
        enablePreviewBtn() {
            const { numberInput, inputError } = this;

            if (!isNaN(parseFloat(numberInput))) {
                if (parseFloat(numberInput) > 0 && !inputError) {
                    return true
                }

                return false;
            }

            return false
        },
        youPayUSD() {
            const { numberInput, assetToTransferData } = this;

            if (assetToTransferData) {
                const priceOfAsset = parseFloat(assetToTransferData.price);

                if (numberInput) {
                   return  (this.numberInput * priceOfAsset).toFixed(6)
                } else {
                    return `0.00`
                }
            }

            return `0.00`;
        },
        assetToTransferData() {
            const { assets, assetToTransfer } = this;

            if (assets.length && !assetToTransfer) {
                const initialAssetToTransfer = assets[0];
                return initialAssetToTransfer;
            } else if (assetToTransfer) {
                return assetToTransfer;
            } else {
                return null;
            }
        },
        walletBalanceOfAssets() {
            const { balances, fromWallet } = this;
            const walletbalances = balances.find(balance => balance.wallet === fromWallet);
            const { assetDetails } = walletbalances;

            return assetDetails;
        },
        assetWalletBalance() {
            const { walletBalanceOfAssets, assetToTransferData } = this;
            const { _id } = assetToTransferData

            if (assetToTransferData) {
                const assetData = walletBalanceOfAssets.find(assetbalance => assetbalance.detail._id === _id);
                
                if (assetData !== undefined) {
                    return assetData;
                } else {
                    return null
                }
            } else {
                return null
            }
        }
    },
    watch: {
        numberInput() {
            const { checkBalance } = this;
            checkBalance();
        },
        assetWalletBalance() {
            this.numberInput = '';
            this.inputError = false;
        }
    }
}