# sepaxmljs
Generate XML-SEPA credit transfert (SCT)

## Installation
Via NPM

```
npm install --save sepaxmljs
```

## Example
```javascript
  var XmlSEPA = require('sepaxmljs');

  var sepa = new XmlSEPA({
    debitor:{
        name: "ACME Corp",
        iban : "FR7630004000031234567890143",
        bic: "BNPAFRPPFAK"
    },
    MsgId: "MyMessageID",
    version: "urn:iso:std:iso:20022:tech:xsd:pain.001.001.03"
    });

  sepa.addPaymentInfo("Payment1");
  sepa.addTransaction("TransactionId", "John Doe", 50, "FR7630004000031234567890143", "BNPAFRPPXXX", "Transaction instruction");
  sepa.addTransaction("Id2","John DOE", {amount: 100, currency: "EURO"}, "FR7630004000031234567890143", "BNPAFRPPXXX", "instructionJohn")
  sepa.toString();

```