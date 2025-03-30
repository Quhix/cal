import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Switch, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from "@mui/material";
import { DarkMode, LightMode, Event } from "@mui/icons-material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Quhixcal() {
  const [darkMode, setDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", recurrence: "none" });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://https:/cal-backend-hc3r.onrender.com/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#000" : "#F9A825";
    document.body.style.color = darkMode ? "#F9A825" : "#000";
  }, [darkMode]);

  const handleDateClick = (info) => {
    setNewEvent({ ...newEvent, date: info.dateStr });
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!newEvent.title || !newEvent.date) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post("http://https:/cal-backend-hc3r.onrender.com/events", newEvent);
      const response = await axios.get("http://https:/cal-backend-hc3r.onrender.com/events");
      setEvents(response.data);
      setOpen(false);
      setNewEvent({ title: "", date: "", recurrence: "none" });
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Quhixcal</h1>
      <p>Your open-source calendar alternative.</p>
      <div className="flex items-center gap-2">
        <LightMode />
        <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        <DarkMode />
      </div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Event />}
        onClick={() => setOpen(true)}
        style={{ marginBottom: "10px" }}
      >
        Add Event
      </Button>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
      />

      {/* Add Event Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField
            label="Event Title"
            fullWidth
            margin="normal"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <TextField
            label="Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <TextField
            label="Recurrence"
            select
            fullWidth
            margin="normal"
            value={newEvent.recurrence}
            onChange={(e) => setNewEvent({ ...newEvent, recurrence: e.target.value })}
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
