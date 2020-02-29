import {connect} from 'redibase'
const redibase = connect(process.env.redis)
export {redibase}
