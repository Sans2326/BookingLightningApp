import { api, LightningElement } from 'lwc';

const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';

export default class TruckTile extends LightningElement {
    
    @api
    truck;
    @api
    selectedTruckId;
    
    // Getter for dynamically setting the background image for the picture

    get backgroundStyle() {
        return `background-image:url(${this.truck.Image__c})`;
      }
    
    // Getter for dynamically setting the tile class based on whether the
    // current truck is selected
    get tileClass() {
        if (this.truck.Id == this.selectedTruckId) {
            return TILE_WRAPPER_SELECTED_CLASS;
        }
        return TILE_WRAPPER_UNSELECTED_CLASS;
    }
    
    // Fires event with the Id of the truck that has been selected.
    selectTruck() {
        this.selectedTruckId = this.truck.Id;
        const truckselect = new CustomEvent('truckselect', {
            detail: {
                truckId: this.selectedTruckId
            }
        });
        this.dispatchEvent(truckselect);
    }
}