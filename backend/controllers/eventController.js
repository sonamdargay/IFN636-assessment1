const Event = require("../models/Event");

const addEvent = async (req, res) => {
  const { eventName, description, date, location } = req.body;
  try {
    const event = await Event.create({
      eventName,
      description,
      date,
      location,
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find(); // Fetch all events
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  const { eventName, description, date, location } = req.body;
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.eventName = eventName || event.eventName;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.remove();
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEvents, addEvent, updateEvent, deleteEvent };
