const Schema = require('schm');

const addressSchema = Schema({
	AdrTp: {
		type: String,
		enum: ["ADDR" ,"PBOX" ,"HOME" ,"BIZZ" ,"MLTO" ,"DLVY"]
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
		maxlength: 4 //TODO: REGEXP [A-Z]{2,2}
	},
	AdrLine: Array
});

module.exports = addressSchema;
