XmlSEPA = require('../lib/');

var sepa = new XmlSEPA({
     debtor:{
         name: "ACME Corp",
         iban : "FR7630004000031234567890143",
         bic: "BNPAFRPPFAK"
     },
     msgId: "MyMessageID",
     version: "urn:iso:std:iso:20022:tech:xsd:pain.001.001.03"
 });
 
 sepa.addPaymentInfo("Payment1")
     .addTransaction("Id1", "Alexandre", 50.05, "FR7630004000031234567890143", "BNPAFRPPXXX", "instruction1")
     .addPaymentInfo("Payment2")
     .addTransaction("Id2","John DOE", {amount: 100.00002, currency: "EURO"}, "FR7630004000031234567890143", "BNPAFRPPXXX");
 
 console.log( sepa.toString() );