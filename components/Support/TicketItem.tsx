// components/Support/TicketItem.tsx
type TicketItemProps = {
  subject: string;
  description: string;
  status: "open" | "in_progress" | "closed";
  created_at: string;
};

export default function TicketItem({ subject, description, status, created_at }: TicketItemProps) {
  const statusLabel =
    status === "open" ? "Ouvert" : status === "in_progress" ? "En cours" : "Fermé";

  const statusColor =
    status === "open"
      ? "bg-yellow-100 text-yellow-800"
      : status === "in_progress"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";

  return (
    <div className="border p-4 rounded shadow-sm bg-white">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold">{subject}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded ${statusColor}`}>
          {statusLabel}
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Créé le {new Date(created_at).toLocaleDateString()}
      </p>
    </div>
  );
}
