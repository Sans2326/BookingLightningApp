import { LightningElement, track, wire } from 'lwc';
import getTruckTypes from '@salesforce/apex/TruckDataService.getTruckTypes';

export default class TruckSearchForm extends LightningElement {
    
    selectedTruckTypeId = '';
    
    // Private
    error = undefined;
    
    // Needs explicit track due to nested data
    @track
    searchOptions;
    
    // Wire a custom Apex method
    @wire(getTruckTypes)
    truckTypes({ data, error }) {
        if (data) {
            this.searchOptions = data.map(type => {
                return { label: type.Name, value: type.Id };
            });
            this.searchOptions.unshift({ label: 'All Types', value: '' });
        } else if (error) {
            this.searchOptions = undefined;
            this.error = error;
        }
    }
    
    // Fires event that the search option has changed.
    // passes truckTypeId (value of this.selectedTruckTypeId) in the detail
    handleSearchOptionChange(event) {
        this.selectedTruckTypeId = event.detail.value
        // Create the const searchEvent        
        const searchEvent = new CustomEvent('search', { 
            detail: {
                truckTypeId: this.selectedTruckTypeId
            }
        });
        this.dispatchEvent(searchEvent);
    }
}  