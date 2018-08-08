"use strict";

const CreditTransfer = require('./CdtTrfTxInf');

 /**
  * Payment Information Identification
  * @class 
  * @param {string} pmtInfId Unique identification, as assigned by a sending party, to unambiguously identify the payment information group within the message.
  * @param {string)} debtor Debtor name
  * @param {string} iban Debtor International Bank Account Number (IBAN) -  identifier used internationally by financial institutions to uniquely identify the account of a customer.
  * @param {string} bic Debtor Bank Identifier Code. 
  * @todo TODO: pmtInfId: Implement 35 maxsize validation
  * @todo TODO: debtor: Implement 140 maxsize validation
  * @todo TODO: iban: Implement IBAN validation (checksum)
  * @todo TODO: bic: Implement BIC validation
  */
var PmtInf = function (pmtInfId, debtor, iban, bic) {
    this.CdtTrfTxInf = [];
    this.CtrlSum = 0;
    this.NbOfTxs = 0;
    this.pmtInfId = pmtInfId;
    this.name = debtor;
    this.iban = iban;
    this.bic = bic;
    return this;
}

 /**
  * Add new Credit Transfer Transaction Information
  * @param {string} pmtId Set of elements used to reference a payment instruction.
  * @param {(string|Object)} creditor Name by which a party is known and which is usually used to identify that party
  * @param {number} amount Amount of money to be moved between the debtor and creditor, before deduction of charges, expressed in the currency as ordered by the initiating party.
  * @param {string} iban Creditor International Bank Account Number (IBAN) -  identifier used internationally by financial institutions to uniquely identify the account of a customer.
  * @param {string} bic Creditor Bank Identifier Code. 
  * @param {string} [instruction] Information supplied to enable the matching of an entry with the items that the transfer is intended to settle, such as commercial invoices in an accounts' receivable system.
  */
PmtInf.prototype.addTransaction = function (pmtId, creditor, amount, iban, bic, instruction) {
    this.CdtTrfTxInf.push(new CreditTransfer(pmtId, creditor, amount, iban, bic, instruction))
    this.countCdtTrfTx()
    this.calcCtrlSum()    
    return this
}

/**
 * Calculate ControlSum
 * @returns {number}
 */
PmtInf.prototype.calcCtrlSum = function () {
    this.CtrlSum = 0;
    for (let i = 0; i < this.CdtTrfTxInf.length; i++) {
        const element = this.CdtTrfTxInf[i];
        this.CtrlSum += element.amount
    }
    return this.CtrlSum;
}

/**
 * Count number of Credit Transfer Transaction Information
 * @returns {number}
 */
PmtInf.prototype.countCdtTrfTx = function () {
    return this.NbOfTxs = this.CdtTrfTxInf.length;
}

/**
 * Generate PmtInf tree ready for XMLBUILDER 
 * @returns {object} PaymentInformation representation
 * @todo TODO: rename function
 */
PmtInf.prototype.toString = function () {
    this.countCdtTrfTx()
    this.calcCtrlSum()
    return {
        PmtInfId: this.pmtInfId,
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