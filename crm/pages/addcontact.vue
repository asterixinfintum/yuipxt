<template>
    <div class="addcontact container">
        <DashboardHeader />
        <div>
            <CreateClientForm />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.addcontact {
    @include container;

    &__content {
        @include content;  
    }
}
</style>