<template>
    <div :class="{'modal modal-fx-fadeInScale': true, 'is-active': show}">
        <div class="modal-background"></div>

        <div class="modal-content">
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title has-text-centered">
                        <template v-if="employee.id">
                            Editar empleado
                        </template>
                        <template v-else>
                            Nuevo empleado
                        </template>
                    </p>
                </header>

                <section class="modal-card-body">
                    <form @submit.prevent="save">
                        <div class="field">
                            <label class="label">
                                Nombre
                            </label>

                            <div class="control">
                                <input type="text" :class="{'input': true, 'is-danger': form.errors.name}" v-model="form.data.name">
                            </div>

                            <strong class="help is-danger" v-text="form.errors.name" v-if="form.errors.name"></strong>
                        </div>
                        <div class="field">
                            <label class="label">
                                Apellidos
                            </label>

                            <div class="control">
                                <input type="text" :class="{'input': true, 
                                'is-danger': form.errors.last_name}" v-model="form.data.last_name">
                            </div>

                            <strong class="help is-danger" v-text="form.errors.last_name" 
                            v-if="form.errors.last_name"></strong>
                        </div>

                        <div class="field">
                            <label class="label">
                                Correo
                            </label>

                            <div class="control">
                                <input type="text" :class="{'input': true, 'is-danger': form.errors.email}" v-model="form.data.email">
                            </div>

                            <strong class="help is-danger" v-text="form.errors.email" v-if="form.errors.email"></strong>
                        </div>
                        <div class="field">
                            <label class="label">
                                Teléfono
                            </label>

                            <div class="control">
                                <input type="text" :class="{'input': true, 
                                'is-danger': form.errors.phone}" v-model="form.data.phone">
                            </div>

                            <strong class="help is-danger" v-text="form.errors.phone" 
                            v-if="form.errors.phone"></strong>
                        </div>
                        <div class="field">
                            <label class="label">
                                Compañia
                            </label>

                            <div class="control">
                                <div :class="{'select is-fullwidth': true, 'is-danger': form.errors.company_id}">
                                    <select v-model="form.data.company_id">
                                        <option value="" selected disabled>
                                            Seleccione...
                                        </option>
                                        <option :value="company.id" v-for="company in companies" 
                                        :key="company.id" v-text="company.name"></option>
                                    </select>
                                </div>
                            </div>

                            <strong class="help is-danger" v-text="form.errors.company_id" 
                            v-if="form.errors.company_id"></strong>
                        </div>

                        <div class="buttons is-right">
                            <button type="submit" :class="{'button is-rounded is-primary': true, 'is-loading': loading}">
                                <template v-if="employee.id">
                                    Actualizar
                                </template>
                                <template v-else>
                                    Guardar
                                </template>
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
    import { onMounted, watch, ref } from 'vue'
    import axios from 'axios'
    import helpers from '../helpers'

    export default {
        name: 'CompanyForm',
        emits: ['close'],
        props: {
            show: Boolean,
            employee: Object
        },
        setup (props, { emit }) {
            let loading = ref(false)
            let companies = ref([])
            let form = ref({
                errors: {},
                data: {
                    name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    company_id: ''
                }
            })

            const { handleRequest, handleErrors, setForm, getFile } = helpers()

            const getLogo = file => {
                getFile(file)
            }

            const uploadFile = event => {
                form.value.data.attach_file = event.target.files[0]
                form.value.data.attach_file_name = event.target.files[0].name

                form.value.data.signature_file_name = form.value.data.attach_file_name
            }

            const save = async () => {
                loading.value = true

                try {
                    await handleRequest('post', '/employees', form.value.data, props.employee.id)

                    emit('close')
                }
                catch (error) {
                    form.value.errors = handleErrors(error)
                }
                finally {
                    loading.value = false
                }
            }

            watch(() => props.employee, employee => {
                form.value = setForm(form.value.data, employee)
            })

            onMounted(async () => {
                try {
                    companies.value = await handleRequest('get', '/companies/get-all-companies')
                }
                catch (error) {
                    handleErrors(error)
                }
            })

            return { 
                form, 
                save, 
                loading,
                getLogo,
                uploadFile,
                companies               
            }
        }
    }
</script>
