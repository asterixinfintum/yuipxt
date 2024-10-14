<template>
    <div class="warning">
        <!--<div class="warning__body">
            <span class="warning__body--warningtext">{{ warning_text }}</span>
            <span>
                <button class="warning__body--btn">{{ btn_text }}</button>
            </span>
        </div>-->
        <div class="warning__body">
            <span class="warning__body--warningtext">Please upload a new ID before the current one expires, or your
                account will be restricted to “Withdrawal Only” mode.</span>
            <span>
                <button class="warning__body--btn btn" @click="$router.push('/identification')">Start Now > </button>
            </span>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import BASE_VARS from '@/store/base_vars';

const { VERIFICATION_FRONT } = BASE_VARS;

export default {
    props: ['warning_text', 'btn_text']
}
</script>