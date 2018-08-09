"use strict";

var builder  = require('xmlbuilder');
var PmtInf = require('./PmtInf');

 /**
  * SEPA-XML Object
  * @class
  * @param {Object} options 
  * @param {string} [options.version=pain.001.001.03] xmlns: SEPA XML pain version  
  * @param {object} options.debtor debtor
  * @param {string} options.debtor.name debtor's name
  * @param {string} options.debtor.iban debtor's International Bank Account Number (IBAN)
  * @param {string} options.debtor.bic debtor
  * @param {string} options.msgId Point to point reference, as assigned by the instructing party, and sent to the next party in the chain to unambiguously identify the message.
  * @todo TODO: agrs: separate named parameters and handle optionals
  * @example
  * var XmlSEPA = require('sepaxmljs');
  * 
  * var sepa = new XmlSEPA({
  *     debtor:{
  *         name: "ACME Corp",
  *         iban : "FR7630004000031234567890143",
  *         bic: "BNPAFRPPFAK"
  *     },
  *     msgId: "MyMessageID",
  *     version: "pain.001.001.03"
  * });
  * 
  * sepa.addPaymentInfo("Payment1")
  *     .addTransaction("Id1", "Alexandre", 50, "FR7630004000031234567890143", "BNPAFRPPXXX", "instruction1")
  *     .addPaymentInfo("Payment2")
  *     .addTransaction("Id2","John DOE", {amount: 100, currency: "EURO"}, "FR7630004000031234567890143", "BNPAFRPPXXX");
  * 
  * console.log( sepa.toString() );
  */
function SepaXML(options) {
    this.version = "urn:iso:std:iso:20022:tech:xsd:" + (options.version || "pain.001.001.03");
    this.debtor = options.debtor;
    this.msgId = options.msgId;
    this.GrpHdr = {};
    this.PmtInf = [];
    this.CtrlSum = 0;
    this.NbOfTxs = 0
    return this;
}

/**
 * Set SEPA Group Header informations
 * @private
 */
SepaXML.prototype.setGroupHeader = function(){
    this.countCdtTrfTx();
    this.calcCtrlSum();
    this.GrpHdr = {
        MsgId : this.msgId,
        CreDtTm : new Date().toISOString(),
        NbOfTxs : this.NbOfTxs,
        CtrlSum : this.CtrlSum,
        InitgPty : { Nm: this.debtor.name }
    }
}
/**
 * Calculate ControlSum
 * @private
 * @returns {number}
 */
SepaXML.prototype.calcCtrlSum = function () {
    this.CtrlSum = 0;
    for (let i = 0; i < this.PmtInf.length; i++) {
        const element = this.PmtInf[i].calcCtrlSum();
        this.CtrlSum += element;        
    }
    return this.CtrlSum;
}

/**
 * Count number of Credit Transfer Transaction Information
 * @private
 */
SepaXML.prototype.countCdtTrfTx = function () {
    this.NbOfTxs = 0;
    for (let i = 0; i < this.PmtInf.length; i++) {
        const element = this.PmtInf[i].countCdtTrfTx();
        this.NbOfTxs += element;        
    }
    return this
}

 /**
  * Add new Credit Transfer Transaction Information
  * @param {string} pmtInfId Set of elements used to reference a payment instruction.
  */
SepaXML.prototype.addPaymentInfo = function(pmtInfId){
    let newPmtInf = new PmtInf(pmtInfId, this.debtor.name, this.debtor.iban, this.debtor.bic);
    this.PmtInf.push(newPmtInf)
    return this
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
SepaXML.prototype.addTransaction = function(PmtId, creditor, amount, iban, bic, instruction){
    let lastAddPmtInf = this.PmtInf[this.PmtInf.length - 1]
    lastAddPmtInf.addTransaction(PmtId, creditor, amount, iban, bic, instruction)
    this.countCdtTrfTx();
    this.calcCtrlSum();
    return this
}

/**
 * Count and set number of Credit Transfer Transaction Information contained in file
 * @private
 */
SepaXML.prototype.countTransaction = function(){
    let count = 0;
    let CstmrCdtTrfInitn = this.xmlObj.Document.CstmrCdtTrfInitn;
    for (let i = 0; i < CstmrCdtTrfInitn.PmtInf.length; i++) {
        count += CstmrCdtTrfInitn.PmtInf[i].CdtTrfTxInf.length;
    }
    CstmrCdtTrfInitn.GrpHdr.NbOfTxs = count;
}

/**
 * Generate XML SEPA content 
 * @returns {string} XML SEPA
 */
SepaXML.prototype.toString = function(cb){
    this.setGroupHeader();

    this.xmlObj = {
        Document : {
            '@xmlns': this.version,
            CstmrCdtTrfInitn : {
                GrpHdr: this.GrpHdr,
                PmtInf: this.PmtInf.map(PmtInf => PmtInf.toString())
            }
        }
    };

    this.xmlOutPput = builder.create(this.xmlObj, { encoding: 'utf-8' }).end({ pretty: true });
    if(cb) return cb(this.xmlOutPput)
    return this.xmlOutPput
}

module.exports = SepaXML;