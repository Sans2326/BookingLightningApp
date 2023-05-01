import { api, LightningElement } from 'lwc';

export default class DriverFieldCheck extends LightningElement {
    @api
    recordId;
    @api objectApiName;
    handleSubmit(){
        console.log("Status updated succesfully");
    }
}