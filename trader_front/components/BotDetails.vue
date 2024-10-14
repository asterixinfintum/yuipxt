<template>
    <div class="popup">
        <div class="botdetails popup__body transactionstyle__body">

            <div class="transactionstyle__subject">
                <div class="transactionstyle__subject--name">
                    <h3>{{ tradingbot.name }} Details</h3>
                </div>
                <div class="transactionstyle__subject--closebtn" @click="toggleviewbot">
                    <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-onkibi" aria-hidden="true">
                        <path fill="currentColor"
                            d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z">
                        </path>
                    </svg>
                </div>
            </div>

            <div class="transactionstyle__container">
                <div class="previewtrade__content">

                    <div class="previewtrade__contentarea">
                        <div class="previewtrade__contentitem">
                            <div class="previewtrade__contentitemleft">Name</div>
                            <div class="previewtrade__contentitemright">
                                <div class="previewtrade__contentitemright--top">
                                    {{ tradingbot.name }}
                                </div>
                                <div class="previewtrade__contentitemright--bottom">
                                    {{ tradingbot.type }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="previewtrade__contentarea">
                        <div class="previewtrade__contentitem">
                            <div class="previewtrade__contentitemleft">Parameter Type</div>
                            <div class="previewtrade__contentitemright">
                                <div class="previewtrade__contentitemright--top">
                                    {{ tradingbot.subtype }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="previewtrade__contentarea">
                        <div class="previewtrade__contentitem">
                            <div class="previewtrade__contentitemleft">Initial Capital</div>
                            <div class="previewtrade__contentitemright">
                                <div class="previewtrade__contentitemright--top">
                                    ${{ tradingbot.capital }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="previewtrade__contentarea">
                        <div class="previewtrade__contentitem">
                            <div class="previewtrade__contentitemleft">Profit</div>
                            <div class="previewtrade__contentitemright success-text">
                                <div class="previewtrade__contentitemright--top">
                                    {{ tradingbot.profit }}
                                </div>
                                <div class="previewtrade__contentitemright--bottom">
                                    10%
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="previewtrade__contentarea">
                        <div class="previewtrade__contentitem">
                            <div class="previewtrade__contentitemleft">Loss</div>
                            <div class="previewtrade__contentitemright error-text">
                                <div class="previewtrade__contentitemright--top">
                                    {{ tradingbot.loss }}
                                </div>
                                <div class="previewtrade__contentitemright--bottom">
                                    2%
                                </div>
                            </div>
                        </div>
                    </div>


                    <div class="previewtrade__contentarea" v-for="parameter in parameters">
                        <div class="previewtrade__contentitem">
                            <div class="previewtrade__contentitemleft">{{ parameter.name }}</div>
                            <div class="previewtrade__contentitemright">
                                <div class="previewtrade__contentitemright--top">
                                    {{ parameter.value }}
                                </div>
                            </div>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['tradingbot', 'toggleviewbot'],
    data() {
        return {
            parameters: []
        }
    },
    mounted() {
        this.displayKeysAndValues(this.tradingbot.parameters)
    },
    methods: {
        displayKeysAndValues(obj, parentKey = '') {
            for (let key in obj) {
                let newKey = parentKey ? `${parentKey}.${key}` : key;
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    this.displayKeysAndValues(obj[key], newKey);
                } else {
                    console.log(`${this.revertCamelCase(newKey)}: ${obj[key]}`);
                    //this.parameters.push(`${this.revertCamelCase(newKey)}: ${obj[key]}`)

                    this.parameters.push({
                         name: `${this.revertCamelCase(newKey)}`,
                         value: `${obj[key]}`
                        })
                }
            }
        },
        revertCamelCase(camelStr) {
            return camelStr
                // insert a space before all found uppercase letters
                .replace(/([A-Z])/g, ' $1')
                // trim any leading/trailing spaces
                .trim()
                // capitalize the first letter of the resulting string
                .replace(/^./, str => str.toUpperCase());
        }
    }
}
</script>

<style lang="scss" scoped>
.botdetails {}
</style>