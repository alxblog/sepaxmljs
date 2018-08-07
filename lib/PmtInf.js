"use strict";

const CreditTransfer = require('./CdtTrfTxInf');

/**
 * Credit Transfer Transaction Information
 */

var PmtInf = function (PmtInfId, name, iban, bic) {
    this.CdtTrfTxInf = [];
    this.CtrlSum = 0;
    this.NbOfTxs = 0;
    this.PmtInfId = PmtInfId;
    this.name = name;
    this.iban = iban;
    this.bic = bic;
    return this;
}

PmtInf.prototype.addTransaction = function (PmtId, creditor, amount, iban, bic, instruction) {
    this.CdtTrfTxInf.push(new CreditTransfer(PmtId, creditor, amount, iban, bic, instruction))
    this.countCdtTrfTx()
    this.calcCtrlSum()    
    return this
}

PmtInf.prototype.calcCtrlSum = function () {
    this.CtrlSum = 0;
    for (let i = 0; i < this.CdtTrfTxInf.length; i++) {
        const element = this.CdtTrfTxInf[i];
        this.CtrlSum += element.amount
    }
    return this.CtrlSum;
}

PmtInf.prototype.countCdtTrfTx = function () {
    return this.NbOfTxs = this.CdtTrfTxInf.length;
}

PmtInf.prototype.toString = function () {
    this.countCdtTrfTx()
    this.calcCtrlSum()
    return {
        PmtInfId: this.PmtInfId,
        PmtMtd: "TRF",
        BtchBookg: false,
        NbOfTxs: this.NbOfTxs,
        CtrlSum: this.CtrlSum,
        PmtTpInf: {
            SvcLvl: {
                Cd: "SEPA"
            }
        },
        ReqdExctnDt: "2018-01-03", //TO CHANGE
        Dbtr: {
            Nm: this.name
        },
        DbtrAcct: {
            Id: {
                IBAN: this.iban
            }
        },
        DbtrAgt: {
            FinInstnId: {
                BIC: this.bic
            }
        },
        CdtTrfTxInf: this.CdtTrfTxInf.map(CdtTrfTxInf => CdtTrfTxInf.toString())
    }
}

module.exports = PmtInf;