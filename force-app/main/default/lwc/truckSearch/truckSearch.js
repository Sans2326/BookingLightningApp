import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class TruckSearch extends NavigationMixin(LightningElement) {
    isLoading = false;
    
    // Handles loading event
    handleLoading() {
        this.isLoading = true;
    }
    
    // Handles done loading event
    handleDoneLoading() {
        this.isLoading = false;
    }
    
    // Handles search truck event
    // This custom event comes from the form
    searchTrucks(event) {
        let truckTypeId = event.detail.truckTypeId;
        this.template.querySelector('c-truck-search-results').searchTrucks(truckTypeId);
        this.handleDoneLoading();
    }
    
    createNewBooking() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Tr__c',
                actionName: 'new'
            }
        });  
    }
}