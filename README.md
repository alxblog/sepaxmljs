# sepaxmljs
Generate XML-SEPA credit transfert (SCT)

## Installation
Via NPM

```
npm install --save sepaxmljs
```

<a name="SepaXML"></a>

## SepaXML
**Kind**: global class  
**Todo**

- [ ] TODO: agrs: separate named parameters and handle optionals


* [SepaXML](#SepaXML)
    * [new SepaXML(options)](#new_SepaXML_new)
    * [.addPaymentInfo(pmtInfId)](#SepaXML+addPaymentInfo)
    * [.addTransaction(pmtId, creditor, amount, iban, bic, [instruction])](#SepaXML+addTransaction)
    * [.toString()](#SepaXML+toString) ⇒ <code>string</code>

<a name="new_SepaXML_new"></a>

### new SepaXML(options)
SEPA-XML Object


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| [options.version] | <code>string</code> | <code>&quot;urn:iso:std:iso:20022:tech:xsd:pain.001.001.03&quot;</code> | xmlns: SEPA XML pain version |
| options.debtor | <code>object</code> |  | debtor |
| options.debtor.name | <code>string</code> |  | debtor's name |
| options.debtor.iban | <code>string</code> |  | debtor's International Bank Account Number (IBAN) |
| options.debtor.bic | <code>string</code> |  | debtor |
| options.msgId | <code>string</code> |  | Point to point reference, as assigned by the instructing party, and sent to the next party in the chain to unambiguously identify the message. |

**Example**  
```js
var XmlSEPA = require('sepaxmljs');

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
    .addTransaction("Id1", "Alexandre", 50, "FR7630004000031234567890143", "BNPAFRPPXXX", "instruction1")
    .addPaymentInfo("Payment2")
    .addTransaction("Id2","John DOE", {amount: 100, currency: "EURO"}, "FR7630004000031234567890143", "BNPAFRPPXXX");

console.log( sepa.toString() );
```
<a name="SepaXML+addPaymentInfo"></a>

### sepaXML.addPaymentInfo(pmtInfId)
Add new Credit Transfer Transaction Information

**Kind**: instance method of [<code>SepaXML</code>](#SepaXML)  

| Param | Type | Description |
| --- | --- | --- |
| pmtInfId | <code>string</code> | Set of elements used to reference a payment instruction. |

<a name="SepaXML+addTransaction"></a>

### sepaXML.addTransaction(pmtId, creditor, amount, iban, bic, [instruction])
Add new Credit Transfer Transaction Information

**Kind**: instance method of [<code>SepaXML</code>](#SepaXML)  

| Param | Type | Description |
| --- | --- | --- |
| pmtId | <code>string</code> | Set of elements used to reference a payment instruction. |
| creditor | <code>string</code> \| <code>Object</code> | Name by which a party is known and which is usually used to identify that party |
| amount | <code>number</code> | Amount of money to be moved between the debtor and creditor, before deduction of charges, expressed in the currency as ordered by the initiating party. |
| iban | <code>string</code> | Creditor International Bank Account Number (IBAN) -  identifier used internationally by financial institutions to uniquely identify the account of a customer. |
| bic | <code>string</code> | Creditor Bank Identifier Code. |
| [instruction] | <code>string</code> | Information supplied to enable the matching of an entry with the items that the transfer is intended to settle, such as commercial invoices in an accounts' receivable system. |

<a name="SepaXML+toString"></a>

### sepaXML.toString() ⇒ <code>string</code>
Generate XML SEPA content

**Kind**: instance method of [<code>SepaXML</code>](#SepaXML)  
**Returns**: <code>string</code> - XML SEPA  

