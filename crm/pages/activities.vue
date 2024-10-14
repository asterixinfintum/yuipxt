<template>
    <div class="activities container">
        <DashboardHeader />
        <div class="activities__content">
            <div class="activities__grid">
                <ActivityCard />
                <ActivityCard />
                <ActivityCard />
                <ActivityCard />
                <ActivityCard />
                <ActivityCard />
                <ActivityCard />
                <ActivityCard />
                <ActivityCard />
                <ActivityCard />
                <ActivityCard />
                <ActivityCard />
            </div>
        </div>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.activities {
    @include container;

    &__content {
        @include content;  
    }

    &__grid {
        margin-top: #{scaleValue(30)};
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 1rem;
    }
}
</style>