import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const EventList = ({ events, setEvents, setEditingEvent }) => {
  const { user } = useAuth();

  const handleDelete = async (eventId) => {
    try {
      await axiosInstance.delete(`/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEvents(events.filter((event) => event._id !== eventId));
    } catch (error) {
      alert("Failed to delete event.");
    }
  };

  return (
    <div>
      {events.map((event) => (
        <div key={event._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold text-lg">{event.eventName}</h2>
          <p>{event.description}</p>
          <p className="text-sm text-gray-500">
            Date: {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">Location: {event.location}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingEvent(event)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(event._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
