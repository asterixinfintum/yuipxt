<template>
    <div class="authfeedback">
        <div class="authfeedback__loading">
            <div class="authfeedback__loading--spinner"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .authfeedback {
        @include full-screen-overlay;

        &__loading {
            margin: 0 auto;
            width: #{scaleValue(400)};
            background: $white;
            height: #{scaleValue(200)};
            margin-top: #{scaleValue(200)};
            border-radius: #{scaleValue(10)};
            display: flex;
            align-items: center;

            &--spinner {
                @include loading-spinner;
            }
        }
    }
</style>