<template>
    <div class="activitycard">
        <div class="activitycard__header">Action</div>
        <div class="activitycard__content">
            <div class="activitycard__owner">User Name</div>
            <div class="activitycard__paragraph">User Name did something that you should know about, did something that you should know about, did something that you should know about</div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.activitycard {
    padding: #{scaleValue(30)};
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    border-radius: #{scaleValue(10)};
    height: #{scaleValue(200)};
    
    &__header {
        font-weight: 500;
        font-size: #{scaleValue(15)};
        color: $primary-color;
    }

    &__owner {
        margin: #{scaleValue(13)} 0;
        font-size: #{scaleValue(13.5)};
        opacity: .5;
        font-weight: 500;
    }

    &__paragraph {
        line-height:  #{scaleValue(20)};
        font-size: #{scaleValue(13)};
    }
}
</style>