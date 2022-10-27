import axios from 'axios'
import { toast } from 'bulma-toast'
import _ from 'lodash'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const helpers = () => {
    let mistakes = [
        {
            error: "No tienes asignado este modulo",
            message: "<p>No tines asignado éste módulo</p>"
        }
        
    ]

    const store = useStore()
    const router = useRouter()

    const handleRequest = async (method, url, data, id) => {
        if (url.endsWith('/')) {
            url = url.slice(0, -1)
        }

        if (id) {
            url += `/${id}`
            data['_method'] = 'put'
        }

        const response = await axios({ method, url, data })

        if (response.data.message) {
            toast({
                message: response.data.message,
                type: 'is-success'
            })
        }

        return response.data
    }

    const handleErrors = error => {
        let errors = {}

        if (error.response) {
            if (error.response.data.errors) {
                Object.entries(error.response.data.errors).map(item => {
                    errors[item[0]] = item[1][0]
                })
            }
            else {
                let messageAndColor = mistakes.find(e => error.response.data.message.search(e.error) >= 0 )
                if(messageAndColor && messageAndColor.error == 'No tienes asignado este modulo') {
                    logout()
                }
                else {
                    toast({
                        duration: 1000 * 60,
                        message: messageAndColor ? messageAndColor.message : error.response.data.message,
                        type: messageAndColor ? 'is-info' : 'is-danger' ,
                        dismissible: true
                    })
                }
            }
        }
        else {
            toast({
                duration: 1000 * 60,
                message: error.message ? error.message : error,
                type: 'is-danger',
                dismissible: true
            })
        }

        return errors
    }

    const logout = async () => {
        try {
            await store.dispatch('logout')

            router.replace({ name: 'login' })
        }
        catch (error) {
            handleErrors(error)
        }
    }

    const getInformationUser = () => {
        return store.getters.user
    }

    const setForm = (fields, data) => {
        let form = {
            errors: {},
            data: {}
        }

        Object.keys(fields).map(k => {
            if (k != '_method') {
                form.data[k] = data[k] ? data[k] : ''
            }
        })

        return form
    }

    const clipHtml = show => {
        const html = document.querySelector('html')

        if (show) {
            html.classList.add('is-clipped')
        }
        else {
            html.classList.remove('is-clipped')
        }
    }

    

    const getFile = url => {
        window.open(`http://127.0.0.1:8000/storage/${url}`, '_blank')
    }

    return {
        handleRequest,
        handleErrors,
        logout,
        getInformationUser,
        setForm,
        clipHtml,
        getFile
    }
}

export default helpers