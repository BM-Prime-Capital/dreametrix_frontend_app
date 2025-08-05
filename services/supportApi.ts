import axios from "axios";

export const getUserTickets = () =>
  axios.get("/api/support/tickets/").then((res) => res.data);

export const createSupportTicket = (data: {
  subject: string;
  description: string;
}) => axios.post("/api/support/tickets/", data);
