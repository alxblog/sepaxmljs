"use strict";

/**
 * Credit Transfer Transaction Information
 */

var CdtTrfTxInf = function (PmtId, creditor, amount, iban, bic, instruction) {
    this.PmtId = PmtId;
    this.creditor = creditor;
    
    if(amount.hasOwnProperty('amount') && amount.hasOwnProperty('currency')){
        this.amount = amount.amount;
        this.currency = amount.currency
    }
    else {
        this.amount = amount;
        this.currency = "EUR"
    }

    console.log(Object.prototype.toString.call(amount))
    this.iban = iban;
    this.bic = bic;
    this.RmtInf = instruction;
    return this;
}

CdtTrfTxInf.prototype.toString = function(){
    let transaction = {
        PmtId: {
            InstrId: this.PmtId,
            EndToEndId: this.PmtId
        },
        Amt: {
            InstdAmt: {
                "@Ccy": "EUR",
                "#text": this.amount
            }
        },
        CdtrAgt: {
            FinInstnId: {
                BIC: this.bic
            }
        },
        Cdtr: {
            Nm: this.creditor
        },
        CdtrAcct: {
            Id: {
                IBAN: this.iban
            }
        }
    }
    if(!this.RmtInf === 'undefined') {transaction.RmtInf.Ustrd = this.RmtInf};
   
    return transaction
}

module.exports = CdtTrfTxInf;