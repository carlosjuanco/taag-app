<template>
    <div class="column">
        <div class="field is-grouped is-grouped-right">
            <div class="control">
                <button class="button is-primary is-rounded" @click="showForm({})">
                    <span class="icon">
                        <i class="fas fa-plus"></i>
                    </span>
                </button>
            </div>
        </div>

        <transition name="fade" mode="out-in">
            <div v-if="loading" key="loading">
                <h5 class="subtitle has-text-centered">
                    Cargando...
                </h5>
            </div>

            <div v-else key="data">
                <div class="table-container">
                    <table class="table is-fullwidth has-text-centered">
                        <thead>
                            <tr>
                                <th class="has-text-left">
                                    Nombre
                                </th>
                                <th>
                                    Email
                                </th>
                                <th>
                                    Logo
                                </th>
                                <th>
                                    Sitio web
                                </th>
                                <th>
                                    Operaciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="companies.length == 0">
                                <td colspan="5">
                                    No hay companias para mostrar
                                </td>
                            </tr>

                            <tr v-for="company in companies" :key="company.id">
                                <td class="has-text-left is-vcentered" v-text="company.name"></td>
                                <td class="has-text-left is-vcentered" v-text="company.email"></td>
                                <td class="has-text-left is-vcentered" v-text="company.logo"></td>
                                <td class="has-text-left is-vcentered" v-text="company.website"></td>
                                <td class="has-text-left is-vcentered">
                                    <button type="button" class="button is-success" @click="showForm(company)">
                                        <span class="icon">
                                            <i class="fas fa-edit"></i>
                                        </span>
                                    </button>
                                    <button type="button" class="button is-danger" @click="deleteCompany(company)">
                                        <span class="icon">
                                            <i class="fas fa-trash"></i>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <table-pagination
                    :pagination="pagination"
                    @getData="getCompanies"
                ></table-pagination>
            </div>
        </transition>
        <company-form
            :show="show_form"
            :company="company"
            @close="show_form = false, getCompanies(`${pagination.path}?page=${pagination.current_page}`)"
            @getCompanies="getData()"
        ></company-form>
        <confirm-delete
            :show="show_confirmation"
            :data="data_confirmation"
            @close="show_confirmation = false, getCompanies(`${pagination.path}?page=${pagination.current_page}`)"
        ></confirm-delete>
    </div>
</template>

<script>
    import { onMounted, ref, watch } from 'vue'
    import CompanyForm from './CompanyForm.vue'
    import ConfirmDelete from './ConfirmDelete.vue'
    import TablePagination from './TablePagination.vue'
    import helpers from '../helpers'

    export default {
        name: 'Companies',
        components: { 
            CompanyForm,
            ConfirmDelete,
            TablePagination
        },
        props: {},
        setup (props, { emit }) {
            let show_form = ref(false)
            let company = ref({})
            let companies = ref([])
            let pagination = ref({})
            let loading = ref(true)
            let search = ref('')
            let show_confirmation = ref(false)
            let data_confirmation = ref({})

            const { handleRequest, handleErrors, clipHtml } = helpers()

            const getCompanies = async url => {
                loading.value = true

                try {
                    const response = await handleRequest('get', url)

                    pagination.value = response
                    companies.value = response.data
                }
                catch (error) {
                    handleErrors(error)
                }
                finally {
                    loading.value = false
                }
            }

            const showForm = _company => {
                company.value = _company
                show_form.value = true
            }

            const deleteCompany = _company => {
                data_confirmation.value.title = 'Baja de compañia'
                data_confirmation.value.message = `¿Desea dar de baja la compañia ${_company.name}`
                data_confirmation.value.url = `/companies/${_company.id}`

                show_confirmation.value = true
            }

            const getData = () => {
                getCompanies(`/companies/${search.value}`)
            }

            // watch(() => search.value, _.debounce(search => {
            //     getCompanies(`/companies/${search}`)
            // }, 300))

            watch(() => show_form.value, show => clipHtml(show))
            
            onMounted(() => {
                getData()
            })

            return { 
                show_form, 
                companies, 
                company, 
                showForm, 
                getCompanies, 
                pagination, 
                loading, 
                search,
                show_confirmation,
                data_confirmation,
                deleteCompany, 
                getData 
            }
        }
    }
</script>