export interface BookingHost {
  name: string;
  title: string;
  initials: string;
}

function clean(value: string | undefined): string {
  return (value || "").trim().replace(/^(["'])(.*)\1$/, "$2").replace(/\s+/g, " ").trim();
}

export function getBookingHost(): BookingHost {
  const name = clean(process.env.BOOKING_HOST_NAME) || "Farhan Kabir Sifat";
  const title = clean(process.env.BOOKING_HOST_TITLE) || "Principal Architect";
  const words = name.split(" ");
  const initials = (words.length > 1 ? [words[0], words[words.length - 1]] : words)
    .map(word => Array.from(word)[0]).join("").toUpperCase();
  return { name, title, initials };
}
