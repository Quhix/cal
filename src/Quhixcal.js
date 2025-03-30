import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Switch } from "@mui/material";
import { DarkMode, LightMode, Event } from "@mui/icons-material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Quhixcal() {
  const [darkMode, setDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://https://cal-backend-hc3r.onrender.com//events");
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

  const handleDateClick = async (info) => {
    const title = prompt("Enter event title:");
    const recurrence = prompt("Enter recurrence (daily, weekly, monthly, none):");
    if (title) {
      try {
        await axios.post("http://https://cal-backend-hc3r.onrender.com//events", {
          title,
          date: info.dateStr,
          recurrence: recurrence !== "none" ? recurrence : null,
        });

        const response = await axios.get("http://https://cal-backend-hc3r.onrender.com//events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error creating event:", error);
      }
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
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
      />
    </div>
  );
}