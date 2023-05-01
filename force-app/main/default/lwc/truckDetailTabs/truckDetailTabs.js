import { wire, LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

// Custom Labels Imports
import labelFullDetails from '@salesforce/label/c.Full_Details';
import labelPleaseSelectATruck from '@salesforce/label/c.Please_select_a_truck';
import labelBookYourTruck from '@salesforce/label/c.Book_Your_Truck'
// Truck__c Schema Imports
import TRUCK_ID_FIELD from '@salesforce/schema/Truck__c.Id';
import TRUCK_NAME_FIELD from '@salesforce/schema/Truck__c.Name';
const TRUCK_FIELDS = [TRUCK_ID_FIELD, TRUCK_NAME_FIELD];
// import TRUCKMC from the message channel
import TRUCKMC from '@salesforce/messageChannel/TruckMessageChannel__c';
import { subscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';

export default class TruckDetailTabs extends NavigationMixin(LightningElement) {

    // Initialize messageContext for Message Service
    @wire(MessageContext)
    messageContext;
    truckId;

    @wire(getRecord, {recordId: '$truckId', fields: TRUCK_FIELDS})
    wiredRecord;
    label = {
        labelFullDetails,
        labelBookYourTruck,
        labelPleaseSelectATruck,
    };
  
    // Decide when to show or hide the icon
    // returns 'utility:anchor' or null
    get detailsTabIconName() {
        return this.wiredRecord.data ? 'utility:anchor' : null;
    }
    
    // Utilize getFieldValue to extract the truck name from the record wire
    get truckName() {
        return getFieldValue(this.wiredRecord.data, TRUCK_NAME_FIELD);
    }
    
    // Private
    subscription = null;
    
    // Subscribe to the message channel
    subscribeMC() {
        // local truckId must receive the recordId from the message
        if (this.subscription) {
            return;
        }
        // Subscribe to the message channel to retrieve the recordId and explicitly assign it to truckId.
            this.subscription = subscribe(
            this.messageContext,
            TRUCKMC,
            (message) => { this.truckId = message.recordId },
            { scope: APPLICATION_SCOPE }
        );
    }
    
    // Calls subscribeMC()
    connectedCallback() {
        this.subscribeMC();
    }
    
    // Navigates to record page
    navigateToRecordViewPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.truckId,
                objectApiName: "Truck__c",
                actionName: "view"
            },
        });
    }

    createNewBooking() {

        
        const truckDefaultValue = 'Truck__c='+this.truckId;
         this[NavigationMixin.Navigate]({
             type: 'standard__objectPage',
             attributes: {
                 objectApiName: 'Truck_Booking__c',
                 actionName: 'new'
             },
             state: {
                 defaultFieldValues : truckDefaultValue,
                 nooverride: '1'
             }
         });  
     }

    navigateToBookRecordViewPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.truckId,
                objectApiName: "Truck_Booking__c",
                actionName: "view"
            },
        });
    }

}