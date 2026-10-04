export class PhotonJoinError extends Error {
  constructor(public readonly code: string, public readonly status: number) {
    super(code);
    this.name = "PhotonJoinError";
  }
}

export function e164(input: unknown): string {
  if (typeof input !== "string") throw new PhotonJoinError("invalid_phone", 400);
  const digits = input.replace(/[^\d+]/g, "");
  const normalized = digits.startsWith("+") ? digits
    : digits.length === 10 ? `+1${digits}`
    : digits.length === 11 && digits.startsWith("1") ? `+${digits}`
    : `+${digits}`;
  if (!/^\+[1-9]\d{6,14}$/.test(normalized)) throw new PhotonJoinError("invalid_phone", 400);
  return normalized;
}

/** Registers the number as a shared user so the project's iMessage line accepts it. */
export async function joinPhoton(
  phone: unknown,
  send: typeof fetch = fetch,
): Promise<{ line: string }> {
  const phoneNumber = e164(phone);
  const projectId = process.env.SPECTRUM_PROJECT_ID?.trim();
  const projectSecret = process.env.SPECTRUM_PROJECT_SECRET?.trim();
  if (!projectId || !projectSecret) throw new PhotonJoinError("photon_unavailable", 503);
  let data: { succeed?: boolean; data?: { assignedPhoneNumber?: string } };
  try {
    const response = await send(`https://spectrum.photon.codes/projects/${encodeURIComponent(projectId)}/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString("base64")}`,
      },
      body: JSON.stringify({ type: "shared", phoneNumber }),
    });
    data = await response.json() as typeof data;
  } catch {
    throw new PhotonJoinError("photon_unavailable", 503);
  }
  const line = data.data?.assignedPhoneNumber;
  if (!data.succeed || !line) throw new PhotonJoinError("photon_full", 503);
  return { line };
}
