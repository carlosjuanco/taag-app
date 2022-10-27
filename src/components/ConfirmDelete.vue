<template>
    <div :class="{'modal modal-fx-fadeInScale': true, 'is-active': show}">
        <div class="modal-background"></div>

        <div class="modal-content">
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title has-text-centered" v-text="data.title"></p>
                </header>

                <section class="modal-card-body">
                    <h5 class="subtitle has-text-centered mb-0" v-text="data.message"></h5>

                    <form class="mt-4" @submit.prevent="destroy">
                        <div class="buttons is-centered">
                            <button type="submit" :class="{'button is-rounded is-primary': true, 'is-loading': loading}">
                                Aceptar
                            </button>

                            <button type="button" class="button is-rounded is-danger" @click="$emit('close')" v-if="loading == false">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue'
import helpers from '../helpers'

export default {
    name: 'ConfirmDelete',
    emits: ['close', 'getData'],
    props: {
        show: Boolean,
        data: Object
    },
    setup (props, { emit }) {
        let loading = ref(false)
        let form = ref({
            errors: {},
            data: {
                reason_delete: '',
                _method: 'put'
            }
        })

        const { handleRequest, handleErrors } = helpers()

        const destroy = async () => {
            loading.value = true

            try {
                await handleRequest('delete', props.data.url)

                emit('close')
            }
            catch (error) {
                form.value.errors = handleErrors(error)
            }
            finally {
                loading.value = false
            }
        }

        watch(() => props.show, () => {
            form.value.errors = {}
            form.value.data.reason_delete = ''
            form.value.data._method = 'put'
        })

        return { loading, destroy, form }
    }
}
</script>