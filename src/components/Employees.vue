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
                                    Teléfono
                                </th>
                                <th>
                                    Compañia
                                </th>
                                <th>
                                    Operaciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="employees.length == 0">
                                <td colspan="5">
                                    No hay empleados para mostrar
                                </td>
                            </tr>

                            <tr v-for="employee in employees" :key="employee.id">
                                <td class="has-text-left is-vcentered" 
                                    v-text="`${employee.name} ${employee.last_name}`"></td>
                                <td class="has-text-left is-vcentered" v-text="employee.email"></td>
                                <td class="has-text-left is-vcentered" v-text="employee.phone"></td>
                                <td class="has-text-left is-vcentered" v-text="employee.company.name"></td>
                                <td class="has-text-left is-vcentered">
                                    <button type="button" class="button is-success" @click="showForm(employee)">
                                        <span class="icon">
                                            <i class="fas fa-edit"></i>
                                        </span>
                                    </button>
                                    <button type="button" class="button is-danger" @click="deleteEmployee(employee)">
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
                    @getData="getEmployees"
                ></table-pagination>
            </div>
        </transition>
        <employee-form
            :show="show_form"
            :employee="employee"
            @close="show_form = false, getEmployees(`${pagination.path}?page=${pagination.current_page}`)"
            @getEmployees="getData()"
        ></employee-form>
        <confirm-delete
            :show="show_confirmation"
            :data="data_confirmation"
            @close="show_confirmation = false, getEmployees(`${pagination.path}?page=${pagination.current_page}`)"
        ></confirm-delete>
    </div>
</template>

<script>
    import { onMounted, ref, watch } from 'vue'
    import EmployeeForm from './EmployeeForm.vue'
    import ConfirmDelete from './ConfirmDelete.vue'
    import TablePagination from './TablePagination.vue'
    import helpers from '../helpers'

    export default {
        name: 'Employees',
        components: { 
            EmployeeForm,
            ConfirmDelete,
            TablePagination
        },
        props: {},
        setup (props, { emit }) {
            let show_form = ref(false)
            let employee = ref({})
            let employees = ref([])
            let pagination = ref({})
            let loading = ref(true)
            let search = ref('')
            let show_confirmation = ref(false)
            let data_confirmation = ref({})

            const { handleRequest, handleErrors, clipHtml } = helpers()

            const getEmployees = async url => {
                loading.value = true

                try {
                    const response = await handleRequest('get', url)

                    pagination.value = response
                    employees.value = response.data
                }
                catch (error) {
                    handleErrors(error)
                }
                finally {
                    loading.value = false
                }
            }

            const showForm = _employee => {
                employee.value = _employee
                show_form.value = true
            }

            const deleteEmployee = _employee => {
                data_confirmation.value.title = 'Baja de empleado'
                data_confirmation.value.message = `¿Desea dar de baja el empleado ${_employee.name}`
                data_confirmation.value.url = `/employees/${_employee.id}`

                show_confirmation.value = true
            }

            const getData = () => {
                getEmployees(`/employees/${search.value}`)
            }

            // watch(() => search.value, _.debounce(search => {
            //     getEmployees(`/employees/${search}`)
            // }, 300))

            watch(() => show_form.value, show => clipHtml(show))
            
            onMounted(() => {
                getData()
            })

            return { 
                show_form, 
                employees, 
                employee, 
                showForm, 
                getEmployees, 
                pagination, 
                loading, 
                search,
                show_confirmation,
                data_confirmation,
                deleteEmployee, 
                getData 
            }
        }
    }
</script>