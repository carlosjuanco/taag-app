<template>
    <nav class="pagination">
        <a class="pagination-previous" v-if="pagination.links[0].url == null" disabled>
            <span class="icon">
                <i class="fas fa-chevron-left"></i>
            </span>
        </a>

        <a class="pagination-previous" v-else @click="getData(pagination.links[0])">
            <span class="icon">
                <i class="fas fa-chevron-left"></i>
            </span>
        </a>

        <a class="pagination-next" v-if="pagination.links[pagination.links.length - 1].url == null" disabled>
            <span class="icon">
                <i class="fas fa-chevron-right"></i>
            </span>
        </a>

        <a class="pagination-next" v-else @click="getData(pagination.links[pagination.links.length - 1])">
            <span class="icon">
                <i class="fas fa-chevron-right"></i>
            </span>
        </a>

        <ul class="pagination-list">
            <li v-for="link in pagination.links.slice(1, -1)" :key="link.label">
                <span class="pagination-ellipsis icon" v-if="link.label == '...'">
                    <i class="fas fa-ellipsis-h"></i>
                </span>

                <a
                    :class="{
                        'pagination-link': true,
                        'is-current': link.active
                    }"
                    v-text="link.label"
                    @click="getData(link)"
                    v-else
                ></a>
            </li>
        </ul>
    </nav>
</template>

<script>
    export default {
        name: 'TablePagination',
        props: {
            pagination: Object
        },
        emits: ['getData'],
        setup (props, { emit }) {
            const getData = link => {
                if (link.active == false) {
                    emit('getData', link.url)
                }
            }

            return { getData }
        }
    }
</script>