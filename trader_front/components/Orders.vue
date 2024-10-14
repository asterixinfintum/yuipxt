<template>
    <div>
        <div class="assetlistheader index__headerarea order" v-for="order in orders">
            <div class="assetlistheader__item index__headerarea--menuitem">
                <label class="assetlistheader__item--label">{{ order.tradingPair }}</label>
            </div>

            <div class="assetlistheader__item index__headerarea--menuitem">
                <label class="assetlistheader__item--label">{{ formatDate(order.date) }}</label>
            </div>

            <div class="assetlistheader__item index__headerarea--menuitem">
                <label class="assetlistheader__item--label">{{ order.type }}</label>
            </div>

            <div class="assetlistheader__item index__headerarea--menuitem">
                <label class="assetlistheader__item--label">{{ order.side }}</label>
            </div>

            <div class="assetlistheader__item index__headerarea--menuitem">
                <label class="assetlistheader__item--label">{{ order.price }}</label>
            </div>

            <div class="assetlistheader__item index__headerarea--menuitem">
                <label class="assetlistheader__item--label">{{ order.quantity }}</label>
            </div>

            <div class="assetlistheader__item index__headerarea--menuitem">
                <label class="assetlistheader__item--label">{{ order.orderAmount }}</label>
            </div>

            <div class="assetlistheader__item index__headerarea--menuitem">
                <label class="assetlistheader__item--label">{{ order.filled }}</label>
            </div>

            <div class="assetlistheader__item index__headerarea--menuitem">
                <label class="assetlistheader__item--label">{{ }}</label>
            </div>

            <div class="assetlistheader__item index__headerarea--menuitem">
                <label class="assetlistheader__item--label">Cancel</label>
            </div>
        </div>
    </div>
</template>

<script>
import generalutilities from '@/mixins/generalutilities';

export default {
    props: ['orders'],
    mixins: [generalutilities]
}
</script>