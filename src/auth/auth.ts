import Auth from '@/auth'
import dbconnect from '@/helpers/dbconnect'

const auth = new Auth({
    dbconnect: dbconnect,
})

export default auth
