export const registrationReceiptPath = "/pendaftaran/bukti";

export function registrationReceiptHref(id: string): string {
  return `${registrationReceiptPath}?${new URLSearchParams({ id })}`;
}

export function getRegistrationReceiptId(params: Pick<URLSearchParams, "getAll">): string | null {
  const ids = params.getAll("id");
  const id = ids[0];
  return ids.length === 1 && id?.trim() === id && /^SID-\d{8}-[A-F0-9]{12}$/.test(id) ? id : null;
}
