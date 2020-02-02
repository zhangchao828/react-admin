const updateServer = require('../utils/tools/updateServer')
const { reactAdminNpmName } = require('../utils/tools/constant')
module.exports = function() {
  updateServer(reactAdminNpmName)
}
