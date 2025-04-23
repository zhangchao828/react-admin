module.exports = {
  getUnitRegexp: (unit) =>
    new RegExp(
      "\"[^\"]+\"|'[^']+'|url\\([^\\)]+\\)|(\\d*\\.?\\d+)" + unit,
      "g"
    ),
};
