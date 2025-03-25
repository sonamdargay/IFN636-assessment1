import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const EventForm = ({ events, setEvents, editingEvent, setEditingEvent }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    date: "",
    location: "",
  });

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        eventName: editingEvent.eventName,
        description: editingEvent.description,
        date: editingEvent.date,
        location: editingEvent.location,
      });
    } else {
      setFormData({ eventName: "", description: "", date: "", location: "" });
    }
  }, [editingEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        const response = await axiosInstance.put(
          `/api/events/${editingEvent._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setEvents(
          events.map((event) =>
            event._id === response.data._id ? response.data : event
          )
        );
      } else {
        const response = await axiosInstance.post("/api/events", formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEvents([...events, response.data]);
      }
      setEditingEvent(null);
      setFormData({ eventName: "", description: "", date: "", location: "" });
    } catch (error) {
      alert("Failed to save event.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded mb-6"
    >
      <h1 className="text-2xl font-bold mb-4">
        {editingEvent ? "Edit Event" : "Create Event"}
      </h1>
      <input
        type="text"
        placeholder="Event Name"
        value={formData.eventName}
        onChange={(e) =>
          setFormData({ ...formData, eventName: e.target.value })
        }
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <textarea
        placeholder="Event Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        {editingEvent ? "Update Event" : "Create Event"}
      </button>
    </form>
  );
};

export default EventForm;
