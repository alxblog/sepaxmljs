"use strict";

var builder  = require('xmlbuilder');
var PmtInf = require('./PmtInf');

function SepaXML(args) {
    this.version = args.version || "urn:iso:std:iso:20022:tech:xsd:pain.001.001.03";
    this.debitor = args.debitor;
    this.MsgId = args.MsgId;
    this.GrpHdr = {};
    this.PmtInf = [];
    this.CtrlSum = 0;
    this.NbOfTxs = 0
    return this;
}

SepaXML.prototype.setGroupHeader = function(){
    this.countCdtTrfTx();
    this.calcCtrlSum();
    this.GrpHdr = {
        MsgId : this.MsgId,
        CreDtTm : new Date().toISOString(),
        NbOfTxs : this.NbOfTxs,
        CtrlSum : this.CtrlSum,
        InitgPty : { Nm: this.debitor.name }
    }
}

SepaXML.prototype.calcCtrlSum = function () {
    this.CtrlSum = 0;
    for (let i = 0; i < this.PmtInf.length; i++) {
        const element = this.PmtInf[i].calcCtrlSum();
        this.CtrlSum += element;        
    }
    return this.CtrlSum;
}

SepaXML.prototype.countCdtTrfTx = function () {
    this.NbOfTxs = 0;
    for (let i = 0; i < this.PmtInf.length; i++) {
        const element = this.PmtInf[i].countCdtTrfTx();
        this.NbOfTxs += element;        
    }
    return this
}

SepaXML.prototype.addPaymentInfo = function(PmtInfId){
    let newPmtInf = new PmtInf(PmtInfId, this.debitor.name, this.debitor.iban, this.debitor.bic);
    this.PmtInf.push(newPmtInf)
    return this
}

SepaXML.prototype.addTransaction = function(PmtId, creditor, amount, iban, bic, instruction){
    let lastAddPmtInf = this.PmtInf[this.PmtInf.length - 1]
    lastAddPmtInf.addTransaction(PmtId, creditor, amount, iban, bic, instruction)
    this.countCdtTrfTx();
    this.calcCtrlSum();
    return this
}


SepaXML.prototype.countTransaction = function(){
    let count = 0;
    let CstmrCdtTrfInitn = this.xmlObj.Document.CstmrCdtTrfInitn;
    for (let i = 0; i < CstmrCdtTrfInitn.PmtInf.length; i++) {
        count += CstmrCdtTrfInitn.PmtInf[i].CdtTrfTxInf.length;
    }
    CstmrCdtTrfInitn.GrpHdr.NbOfTxs = count;
}

SepaXML.prototype.toString = function(){
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
    return this.xmlOutPput
}

module.exports = SepaXML;