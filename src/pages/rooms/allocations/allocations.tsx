 

 
export default function Allocations() {
  return (
    <div>
      <p>Allocations details logic and UI goes here</p>
    </div>
  )
}



// To Get available allocations-details for the particula hotel
"GET: https://hotel.safaripro.net/api/v1/allocation-details/?hotel=9fbc1834-ed70-4a77-befa-e2707cf75c78"

Response object ({
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "fa225d61-8967-461c-9155-29d038b5b5d2",
      "created_by": null,
      "updated_by": null,
      "deleted_by": null,
      "is_active": true,
      "is_deleted": false,
      "created_at": "2025-08-16T14:24:24.906767+03:00",
      "updated_at": "2025-08-16T14:30:58.053023+03:00",
      "deleted_at": null,
      "date": "2025-10-09",
      "status": "Pending",
      "is_price_per_night": true,
      "special_conditions": "This allocation has no any special conditions",
      "allocation": "1c1fc94b-0605-4f0a-9270-9654d176a2c5",
      "hotel": "9fbc1834-ed70-4a77-befa-e2707cf75c78",
      "room": "83fe901b-409a-4e42-80e7-c3e6f4454778",
      "room_type": "9ae282ac-cdf8-442c-9d5f-fcc3d1684208"
    },
    {
      "id": "0f80235f-efe9-4033-8f3d-8ac3e573fa02",
      "created_by": "",
      "updated_by": "",
      "deleted_by": "",
      "is_active": false,
      "is_deleted": false,
      "created_at": "2025-08-16T13:57:05.124399+03:00",
      "updated_at": "2025-08-16T13:57:05.124419+03:00",
      "deleted_at": null,
      "date": "2025-08-20",
      "status": "Completed",
      "is_price_per_night": false,
      "special_conditions": "",
      "allocation": "ee403c0e-cfb0-4c91-8196-2e64aec3231a",
      "hotel": "9fbc1834-ed70-4a77-befa-e2707cf75c78",
      "room": "63dbe05c-73ac-4402-a0ec-638d58ce1cf3",
      "room_type": "9ae282ac-cdf8-442c-9d5f-fcc3d1684208"
    }
  ]
})


// To create allocation details
"POST: https://hotel.safaripro.net/api/v1/allocation-details/?hotel=9fbc1834-ed70-4a77-befa-e2707cf75c78"
Payload Object - ({
  "date": "2025-10-10",
  "allocation": "1c1fc94b-0605-4f0a-9270-9654d176a2c5",
  "hotel": "9fbc1834-ed70-4a77-befa-e2707cf75c78",
  "room": "83fe901b-409a-4e42-80e7-C3e6f4454778",
  "room_type": "9ae282ac-cdf8-442c-9d5f-fcc3d1684208",
  "is_price_per_night": true,
  "status":"Pending",
  "special_conditions": "This allocation has no any special conditions"
})
NOTE: status is an enum selection between("Draft", "Pending", "Confirmed", "Cancelled", "Expired")

// To Edit (PATCH) edit hotel allocations
"PATCH: https://hotel.safaripro.net/api/v1/allocation-details/fa225d61-8967-461c-9155-29d038b5b5d2/"
Passing in the id of the allocation details
payload is the property of the allocation details that has to be updated "eg. {
  "status": "Pending"
}"

// To Delete (DELETE) room allocation details
"DELETE: https://hotel.safaripro.net/api/v1/allocation-details/fa225d61-8967-461c-9155-29d038b5b5d2/"
passing in the id of the room allocation to be deleted, 

