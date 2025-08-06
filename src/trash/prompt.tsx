Now that we have inventory-categories, let's create a table component that will be responsible for managing Inventory Items, CREATE, EDIT, PATCH(UPDATE) and DELETE, The Base Endpoint to get all the available hotel inventory items is "http://192.168.110.207:8020/api/v1/inventory-items?hotel_id=30f0241a-67d7-42e9-a2e8-3958211702fd" note the hotel id is a hard coded value and does not change,  sample response object of hotel inventory items "{

  "count": 2,

  "next": null,

  "previous": null,

  "results": [

    {

      "id": "8598648d-c745-47b5-b2c3-3e628edf2cdd",

      "created_by": null,

      "updated_by": null,

      "deleted_by": null,

      "is_active": true,

      "is_deleted": false,

      "created_at": "2025-08-02T15:44:03.585166+03:00",

      "updated_at": "2025-08-02T15:46:03.112569+03:00",

      "deleted_at": null,

      "name": "Shower Towel",

      "description": null,

      "quantity_instock": 0,

      "unit": "200",

      "reorder_level": 10,

      "quantity_in_reorder": 10,

      "cost_per_unit": "12500.00",

      "category": "3bd3bb9a-efdf-457e-afe3-c49e4b619294",

      "hotel": "30f0241a-67d7-42e9-a2e8-3958211702fd"

    },

    {

      "id": "feb5ce3c-e196-4f32-ae0a-398b8d066866",

      "created_by": null,

      "updated_by": null,

      "deleted_by": null,

      "is_active": true,

      "is_deleted": false,

      "created_at": "2025-08-02T15:53:58.702608+03:00",

      "updated_at": "2025-08-02T15:53:58.702608+03:00",

      "deleted_at": null,

      "name": "Shower Lotion",

      "description": null,

      "quantity_instock": 500,

      "unit": "200",

      "reorder_level": 1,

      "quantity_in_reorder": 0,

      "cost_per_unit": "12500.00",

      "category": "3bd3bb9a-efdf-457e-afe3-c49e4b619294",

      "hotel": "30f0241a-67d7-42e9-a2e8-3958211702fd"

    }

  ]

}" and the endpoint to create a new inventory item  is "POST: http://192.168.110.207:8020/api/v1/inventory-items/" - - Sample Inventory Item Form Payload is "{

  "is_active": true,

  "quantity_instock": 500,

  "reorder_level": 1,

  "quantity_in_reorder": 0,

  "name": "Shower Lotion",

  "unit": "200",

  "cost_per_unit": "12500",

  "category": "3bd3bb9a-efdf-457e-afe3-c49e4b619294",

  "hotel": "30f0241a-67d7-42e9-a2e8-3958211702fd"

}" and reorder level can only be greater than  or equal to 0 and less than or equal to 10, and the cost per unit should be in TZS (Tanzanian Shilling),  and the endpoint to update the hotel inventory item is "PATCH http://192.168.110.207:8020/api/v1/inventory-items/8598648d-c745-47b5-b2c3-3e628edf2cdd/" and the sample form payload is "{

  "name": "Shower Towel"

}"  NOTE: The  "category": "3bd3bb9a-efdf-457e-afe3-c49e4b619294" is an id of the inventory category and can be deducted from sending a GET request to hotel inventory categories and then user will have a dropdown selection and select which category the inventory item fall into then they will be able to create the inventory item, the same to when Updating the inventory item, fetch the category from the inventory categories items like we have already done previously, RETURN ME A FULL "InventoryItems" component with these implementations "// - - - src/pages/inventory/inventory-items.tsx



export default function InventoryItems() {

  return (

    <div>

          <p>Inventory Items</p>

     </div>

  );

}

"