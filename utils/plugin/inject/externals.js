const { getExternals } = require('../../webpack')
const { cdnList } = getExternals()
exports.injectExternals = function($) {
  cdnList.forEach(cdn => {
    $('body').append(`<script src="${cdn}"></script>`)
  })
}
