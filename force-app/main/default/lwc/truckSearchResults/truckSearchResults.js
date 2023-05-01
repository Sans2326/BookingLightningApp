import { api, LightningElement, track, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

import getTrucks from '@salesforce/apex/TruckDataService.getTrucks';
import updateTruckList from '@salesforce/apex/TruckDataService.updateTruckList';
import TRUCKMC from '@salesforce/messageChannel/TruckMessageChannel__c';

const SUCCESS_TITLE = 'Success';
const MESSAGE_HOP = 'Horn OK Please!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Error';
const ERROR_VARIANT = 'error';

export default class TruckSearchResults extends LightningElement {
    @api
    selectedTruckId;
    columns = [
        { label: 'Name', fieldName: 'Name', editable: true },
        { label: 'Type', fieldName: 'Truck_Type__r.Name', type: 'String'},
        { label: 'Cost', fieldName: 'Cost__c', type: 'currency'},
        
    ];
    truckTypeId = '';
    @track
    trucks;
    isLoading = false;
    @track
    draftValues = [];
  
    // wired message context
    @wire(MessageContext)
    messageContext;

    // wired getTrucks method
    @wire(getTrucks, {truckTypeId: '$truckTypeId'})
    wiredTrucks({data, error}) {
        if (data) {
            this.trucks = data;
        } else if (error) {
            console.log('data.error')
            console.log(error)
        }
    }
  
    // public function that updates the existing truckTypeId property
    // uses notifyLoading
    @api
    searchTrucks(truckTypeId) {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        this.truckTypeId = truckTypeId;
    }
  
    // this public function must refresh the trucks asynchronously
    // uses notifyLoading
    @api
    async refresh() {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);      
        await refreshApex(this.trucks);
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }
  
    // this function must update selectedTruckId and call sendMessageService
    updateSelectedTile(event) {
        this.selectedTruckId = event.detail.truckId;
        this.sendMessageService(this.selectedTruckId)
    }
  
    // Publishes the selected truck Id on the TruckMC.
    sendMessageService(truckId) { 
        // explicitly pass truckId to the parameter recordId
        publish(this.messageContext, TRUCKMC, { recordId: truckId });
    }
  
    // The handleSave method must save the changes in the Truck Editor
    // passing the updated fields from draftValues to the 
    // Apex method updateTruckList(Object data).
    // Show a toast message with the title
    // clear lightning-datatable draft values
    handleSave(event) {
        // notify loading
        const updatedFields = event.detail.draftValues;
        // Update the records via Apex
        updateTruckList({data: updatedFields})
        .then(result => {
            const toast = new ShowToastEvent({
                title: SUCCESS_TITLE,
                message: MESSAGE_SHIP_IT,
                variant: SUCCESS_VARIANT,
            });
            this.dispatchEvent(toast);
            this.draftValues = [];
            return this.refresh();
        })
        .catch(error => {
            const toast = new ShowToastEvent({
                title: ERROR_TITLE,
                message: error.message,
                variant: ERROR_VARIANT,
            });
            this.dispatchEvent(toast);
        })
        .finally(() => {
            
        });
    }
    // Check the current value of isLoading before dispatching the doneloading or loading custom event
    notifyLoading(isLoading) {
        if (isLoading) {
            this.dispatchEvent(new CustomEvent('loading'));
        } else {
            this.dispatchEvent(CustomEvent('doneloading'));
        }        
    }
}