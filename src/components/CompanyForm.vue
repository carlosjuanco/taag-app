<template>
    <div :class="{'modal modal-fx-fadeInScale': true, 'is-active': show}">
        <div class="modal-background"></div>

        <div class="modal-content">
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title has-text-centered">
                        <template v-if="company.id">
                            Editar compania
                        </template>
                        <template v-else>
                            Nuevo compania
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
                                Correo
                            </label>

                            <div class="control">
                                <input type="text" :class="{'input': true, 'is-danger': form.errors.email}" v-model="form.data.email">
                            </div>

                            <strong class="help is-danger" v-text="form.errors.email" v-if="form.errors.email"></strong>
                        </div>
                        <div class="field-body mb-3">
                            <div class="field">
                                <label class="label">
                                    Logotipo
                                </label>

                                <div class="control">
                                    <div v-if="form.data.i_already_select_pdf">
                                        <p class="buttons">
                                            <button type="button" class="button"
                                                @click="form.data.signature_file_name ? getLogo(form.data.logo) : ''">
                                                <span class="icon">
                                                    <i class="fas fa-file-pdf"></i>
                                                </span>
                                                <span v-text="form.data.signature_file_name ? form.data.signature_file_name : form.data.attach_file_name"></span>
                                            </button>
                                            <button type="button" class="button"
                                                @click="form.data.i_already_select_pdf = false, form.data.signature_file_name = '', form.data.attach_file">
                                                <span class="icon">
                                                    <i class="fas fa-times-circle"></i>
                                                </span>
                                            </button>
                                        </p>
                                    </div>
                                    <div v-else class="field">
                                        <div class="file has-name is-fullwidth is-info">
                                            <label class="file-label">
                                                <input class="file-input" type="file" accept=".png, .jpg" @change="uploadFile">

                                                <span class="file-cta">
                                                    <span class="file-icon">
                                                        <i class="fas fa-upload"></i>
                                                    </span>

                                                    <span class="file-label">
                                                        Seleccionar archivo…
                                                    </span>
                                                </span>

                                                <span class="file-name" v-text="form.data.signature_file_name"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <strong class="help is-danger" v-text="form.errors.logo" v-if="form.errors.logo"></strong>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">
                                Sitio web
                            </label>

                            <div class="control">
                                <input type="text" :class="{'input': true, 'is-danger': form.errors.website}" v-model="form.data.website">
                            </div>

                            <strong class="help is-danger" v-text="form.errors.website" v-if="form.errors.website"></strong>
                        </div>

                        <div class="buttons is-right">
                            <button type="submit" :class="{'button is-rounded is-primary': true, 'is-loading': loading}">
                                <template v-if="company.id">
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
    import { watch, ref } from 'vue'
    import axios from 'axios'
    import helpers from '../helpers'

    export default {
        name: 'CompanyForm',
        emits: ['close'],
        props: {
            show: Boolean,
            company: Object
        },
        setup (props, { emit }) {
            let loading = ref(false)
            let form = ref({
                errors: {},
                data: {
                    name: '',
                    email: '',
                    logo: '',
                    i_already_select_pdf: '',
                    attach_file: '',
                    attach_file_name: '',
                    signature_file_name: '',
                    website: '',
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

                let data = new FormData
                let url = '/companies'

                data.append('name', form.value.data.name)
                data.append('email', form.value.data.email)
                data.append('website', form.value.data.website)
                if(form.value.data.attach_file) {
                    data.append('signature_file_name', form.value.data.attach_file_name)
                    data.append('logo', form.value.data.attach_file)
                    form.value.data.i_already_select_pdf = true
                }
                data.append('i_already_select_pdf', form.value.data.i_already_select_pdf ? 1 : 0)

                if (props.company.id) {
                    url += `/${props.company.id}`
                    data.append('_method', 'put')
                }

                try {
                    const response = await axios.post(url, data)

                    emit('close')
                }
                catch (error) {
                    form.value.errors = handleErrors(error)
                }
                finally {
                    loading.value = false
                }
            }

            watch(() => props.company, company => {
                form.value = setForm(form.value.data, company)
                form.value.data.i_already_select_pdf = company.logo ? true : false
                form.value.data.signature_file_name = company.logo
            })

            return { 
                form, 
                save, 
                loading,
                getLogo,
                uploadFile                 
            }
        }
    }
</script>
