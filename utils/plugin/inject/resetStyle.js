const resetCssStr = `
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
iframe,
img,
input {
  border: none;
}
select,
textarea,
input,
button {
  outline: none;
}
textarea {
  resize: none;
}
ul,
ol {
  list-style: none;
}
cite,
i {
  font-style: normal;
}
input {
  -webkit-appearance: none;
}
a {
  color: inherit;
  text-decoration: none;
}
`
exports.injectResetStyle = function($) {
  $('head').append(`<style>${resetCssStr}</style>`)
}
