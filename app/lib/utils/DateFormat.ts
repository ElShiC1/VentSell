export function formatDate(
    dateInput?: Date | string,
    label: "Creado" | "Actualizado" = "Actualizado",
    message?: string
): string {
    if (!dateInput) return message || "No editado";

    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const stringLabel = label === "Creado" ? "" : "";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return `${stringLabel} Hace ${diffSeconds} segundos`;
    if (diffMinutes < 60) return `${stringLabel} Hace ${diffMinutes} min`;
    if (diffHours < 24) return `${stringLabel} Hace ${diffHours} h`;
    if (diffDays < 7) return `${stringLabel} Hace ${diffDays} d`;

    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const año = date.getFullYear();

    return `${stringLabel} ${dia} ${mes} ${año}`;
}