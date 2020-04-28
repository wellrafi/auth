let formidable = require('formidable')

function formData() {
    const form = formidable({multiples: true});
    form.parse(req, (err, fields, files) => {
        req.fields = fields;
        req.files = files
    })
    next()
}

module.exports = formData