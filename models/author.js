const mongoose = require('mongoose');
const { DateTime } =  require('luxon');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    family_name: { type: String, required: true, maxLendth: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date }
}, {
    virtuals: {
        name: {
            get() {
                let fullname = '';
                if (this.first_name && this.family_name) {
                    fullname = `${this.family_name}, ${this.first_name}`;
                }
                return fullname;
            },
        },
        url: {
            get() {
                return `/catalogue/author/${this._id}`;
            }
        },
        lifespan: {
            get() {
                if (!this.date_of_birth && !this.date_of_death) return '';
                const formattedBirthDate = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
                if (!this.date_of_death) return `(${formattedBirthDate})`;
                const formattedDeathDate = DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
                return `(${formattedBirthDate} - ${formattedDeathDate})`;
            }
        },
    }
});

// Alternative way to define virtual properties
//AuthorSchema.virtual('name').get(function());

module.exports = mongoose.model('Author', AuthorSchema);