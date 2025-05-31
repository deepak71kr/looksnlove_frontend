import React, { useState } from "react";

const OrderHistory = () => {
  const [order, setOrder] = useState({
    id: 1,
    items: [
      {
        id: 1,
        name: "Item 1",
        image: "combo-image.jpeg",
      },
      {
        id: 2,
        name: "Item 2",
        image: "combo-image.jpeg",
      },
    ],
    totalPrice: 55,
    deliveryDate: "2025-03-15",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleDateChange = (newDate) => {
    setOrder({ ...order, deliveryDate: newDate });
  };

  const handleCancelOrUpdate = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setOrder(null);
    }
  };

  return (
    <div className="p-2 border rounded-lg bg-white shadow-md flex items-center justify-between">
      {order ? (
        <>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Order #{order.id}</span>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg"
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            ))}
            <span className="font-semibold">${order.totalPrice}</span>
          </div>
          <div className="flex space-x-2">
            <input
              type="date"
              value={order.deliveryDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className={`p-1 text-xs border rounded-lg ${
                isEditing ? "" : "bg-gray-200"
              }`}
              disabled={!isEditing}
            />
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-500 text-white text-xs px-2 py-1 rounded-lg"
            >
              {isEditing ? "Save" : "Edit Date"}
            </button>
            <button
              onClick={handleCancelOrUpdate}
              className={`text-xs px-2 py-1 rounded-lg ${
                isEditing ? "bg-green-500" : "bg-red-500"
              } text-white`}
            >
              {isEditing ? "Update" : "Cancel"}
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No orders found.</p>
      )}
    </div>
  );
};

export default OrderHistory;
