require("sucrase/register/ts");
const dotenvsafe = require('dotenv-safe')
const skip_safe_env = process.env.skip_safe_env === 'true'
if (!skip_safe_env) {
    
    dotenvsafe.config()
}

require('src/server') 