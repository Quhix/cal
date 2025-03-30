import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Switch, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from "@mui/material";
import { DarkMode, LightMode, Event } from "@mui/icons-material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const API_ENDPOINT = "http://https:/cal-backend-hc3r.onrender.com/events";

const RECURRENCE_VALUES = ["none", "daily", "weekly", "monthly"];

export default function Quhixcal() {
  const [darkMode, setDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", recurrence: "none" });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(API_ENDPOINT);
        setEvents(response.data);
      } catch (error) {
        setError("Error fetching events: " + error.message);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    updateBodyStyles(darkMode);
  }, [darkMode]);

  const updateBodyStyles = (darkMode) => {
    document.body.style.backgroundColor = darkMode ? "#000" : "#F9A825";
    document.body.style.color = darkMode ? "#F9A825" : "#000";
  };

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
      await axios.post(API_ENDPOINT, newEvent);
      const response = await axios.get(API_ENDPOINT);
      setEvents(response.data);
      setOpen(false);
      setNewEvent({ title: "", date: "", recurrence: "none" });
    } catch (error) {
      setError("Error creating event: " + error.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Quhixcal</h1>
      <p>Your open-source calendar alternative.</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
            {RECURRENCE_VALUES.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
