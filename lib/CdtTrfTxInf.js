"use strict";

 /**
  * Credit Transfer Transaction Information
  * @class
  * @param {string} pmtId Set of elements used to reference a payment instruction.
  * @param {(string|Object)} creditor Name by which a party is known and which is usually used to identify that party
  * @param {number} amount Amount of money to be moved between the debtor and creditor, before deduction of charges, expressed in the currency as ordered by the initiating party.
  * @param {string} iban Creditor International Bank Account Number (IBAN) -  identifier used internationally by financial institutions to uniquely identify the account of a customer.
  * @param {string} bic Creditor Bank Identifier Code. 
  * @param {string} [instruction] Information supplied to enable the matching of an entry with the items that the transfer is intended to settle, such as commercial invoices in an accounts' receivable system.
  * @todo TODO: pmtId: Implement 35 maxsize validation
  * @todo TODO: creditor: Implement 140 maxsize validation
  * @todo TODO: amount: Implement number type validation
  * @todo TODO: iban: Implement IBAN validation (checksum)
  * @todo TODO: bic: Implement BIC validation
  */
var CdtTrfTxInf = function (pmtId, creditor, amount, iban, bic, instruction) {
    this.pmtId = pmtId;
    this.creditor = creditor;
    
    if(amount.hasOwnProperty('amount') && amount.hasOwnProperty('currency')){
        this.amount = amount.amount;
        this.currency = amount.currency
    }
    else {
        this.amount = amount;
        this.currency = "EUR"
    }
    this.iban = iban;
    this.bic = bic;
    this.RmtInf = instruction;
    return this;
}

/**
 * Generate CdtTrfTxInf tree ready for XMLBUILDER 
 * @returns {object} Credit Transfer Transaction Information representation
 * @todo TODO: rename function
 */
CdtTrfTxInf.prototype.toString = function(){
    let transaction = {
        PmtId: {
            InstrId: this.pmtId,
            EndToEndId: this.pmtId
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