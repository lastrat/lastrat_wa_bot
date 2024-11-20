const hidePrivateData = (data) =>
JSON.parse(
    JSON.stringify(data).replace(/"\d{10}/g, (m) => `"${m.slice(1,3)}xxxxxxxx`)
);

module.exports = {hidePrivateData};