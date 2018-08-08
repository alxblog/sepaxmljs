const Schema = require('schm')
const addressSchema = require('./Address.schema')



const CdtTrfTxInfSchema = Schema({
	PmtId: {
		InstrId: {
			type: String,
			maxlength: 35
		},
		EndToEndId: {
			type: String,
			maxlength: 35,
			required: true
		}
	},
	Amt: {
		InstdAmt: {
			"@Ccy": {
				type: String,
				default: "EUR"
			},
			"#text": {
				type: Number,
				required: true
			}
		}
	},
	ChrgBr: {
		type: String,
		enum: ["DEBT", "CRED", "SHAR", "SLEV"]
	},
	CdtrAgt: {
		FinInstnId: {
			BIC: {
				type: String, //TODO: REGEXP [A-Z]{6,6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3,3}){0,1}
				required: true
			}
		}
	},
	Cdtr: {
		Nm: {
			type: String,
			maxlength: 140,
			required: true
		},
		PstlAdr: addressSchema
	},
	CdtrAcct: {
		Id: {
			Othr: {
				Id: {
					type: String,
					maxlength: 35,
				}
			},
			IBAN: {
				type: String // TODO: [A-Z]{2,2}[0-9]{2,2}[a-zA-Z0-9]{1,30}
			}
		}
	},
	Purp: {
		Cd: {
			type: String,
			enum: ["MSIN", "CNFA", "DNFA", "CINV", "CREN", "DEBN", "HIRI", "SBIN", "CMCN", "SOAC", "DISP", "BOLD", "VCHR", "AROI", "TSUT"]
		}

	},
	RmtInf: {
		Strd: {
			RfrdDocInf: {
				Nb: Number,
				RltdDt: Date
			}
		}
	}
})

// TO REMOVE
const address = CdtTrfTxInfSchema.parse({

	PmtId: {
		EndToEndId: "EndToEndId"
	},
	Amt: {
		InstdAmt: {
			"@Ccy": "EUR",
			"#text": 100
		}
	},
	ChrgBr: "DEBT",
	CdtrAgt: {
		FinInstnId: {
			BIC: "CUSTDEM0XXX" 
		}
	},
	Cdtr: {
		Nm: 'Example Customer',
		PstlAdr: {
			AdrLine: ["ligne1", "ligne2", "ligne3"]
		}
	},
	CdtrAcct: {
		Id: {
			Othr: {
				Id: ""
			},
			IBAN: "DE40987654329876543210"
		}
	},
	Purp: {
		Cd: ["MSIN", "CNFA", "DNFA", "CINV", "CREN", "DEBN", "HIRI", "SBIN", "CMCN", "SOAC", "DISP", "BOLD", "VCHR", "AROI", "TSUT"]
	},
	RmtInf: {
		Strd: {
			RfrdDocInf: {
				Nb: 125
			}
		}
	}


})

console.log(address);