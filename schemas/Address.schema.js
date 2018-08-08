const Schema = require('schm');

const addressSchema = Schema({
    AdrTp: {
        type: String,
        //enum: ["ADDR" ,"PBOX" ,"HOME" ,"BIZZ" ,"MLTO" ,"DLVY"],
        validate: [function (val) {          
            if(typeof val == 'undefined') { return true }
            else {
                return (["ADDR", "PBOX", "HOME", "BIZZ", "MLTO", "DLVY"].indexOf(val) > 0) ? true : false;
            }
        }, 'ENUM : ADDR, PBOX, HOME, BIZZ, MLTO, DLVY']
    },
    Dept: {
        type: String,
        maxlength: 70
    },
    SubDept: {
        type: String,
        maxlength: 70
    },
    StrtNm: {
        type: String,
        maxlength: 70
    },
    BldgNb: {
        type: String,
        maxlength: 16
    },
    PstCd: {
        type: String,
        maxlength: 16
    },
    TwnNm: {
        type: String,
        maxlength: 35
    },
    CtrySubDvsn: {
        type: String,
        maxlength: 35
    },
    Ctry: {
        type: String,
        validate: function (val) {            
            if(typeof val == 'undefined') { return true }
            else {
                return /[A-Z]{2,2}/.test(val)
            }
        }
    },
    AdrLine: {
        type: Array
    },
});

module.exports = addressSchema;