import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Ticket, TicketStatus } from "@/lib/types";
import { seedTickets } from "@/lib/seed";

interface BoardState {
  tickets: Ticket[];
  filter: TicketStatus | "all";
  search: string;
  setFilter: (f: TicketStatus | "all") => void;
  setSearch: (s: string) => void;
  addTicket: (t: Ticket) => void;
  setTickets: (t: Ticket[]) => void;
  updateStatus: (id: string, s: TicketStatus) => void;
  reset: () => void;
}

export const useBoard = create<BoardState>()(
  persist(
    (set) => ({
      tickets: seedTickets,
      filter: "all",
      search: "",
      setFilter: (filter) => set({ filter }),
      setSearch: (search) => set({ search }),
      addTicket: (t) => set((s) => ({ tickets: [t, ...s.tickets] })),
      setTickets: (tickets) => set({ tickets }),
      updateStatus: (id, status) =>
        set((s) => ({ tickets: s.tickets.map((t) => (t.id === id ? { ...t, status } : t)) })),
      reset: () => set({ tickets: seedTickets, filter: "all", search: "" }),
    }),
    { name: "insight-board-v1" }
  )
);
