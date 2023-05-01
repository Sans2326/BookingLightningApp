import { api, LightningElement } from 'lwc';

export default class FinancierView extends LightningElement {
    @api
    recordId;
    @api objectApiName;
    handleSubmit(){
        console.log("Payment updated succesfully");
    }
}