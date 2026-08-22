/**
 * Minimal AIFF/WAV reader so the gate script can measure real durations and real
 * pauses without shelling out to ffmpeg. Test-only — the app decodes in the
 * browser with AudioContext, which handles the recorder's webm/opus natively.
 */
export type Pcm = { channel: Float32Array; sampleRate: number; durationSec: number };

export function decodeAiffOrWav(buf: Buffer): Pcm | null {
  if (buf.length < 12) return null;
  const magic = buf.toString("ascii", 0, 4);
  if (magic === "FORM" && buf.toString("ascii", 8, 12).startsWith("AIF")) return aiff(buf);
  if (magic === "RIFF" && buf.toString("ascii", 8, 12) === "WAVE") return wav(buf);
  return null;
}

function aiff(buf: Buffer): Pcm | null {
  const comm = buf.indexOf("COMM", 12, "ascii");
  const ssnd = buf.indexOf("SSND", 12, "ascii");
  if (comm < 0 || ssnd < 0) return null;

  const channels = buf.readInt16BE(comm + 8);
  const frames = buf.readUInt32BE(comm + 10);
  const bits = buf.readInt16BE(comm + 14);
  if (bits !== 16) return null;
  const sampleRate = extended80(buf, comm + 16);

  const offset = buf.readUInt32BE(ssnd + 8);
  const start = ssnd + 16 + offset;
  const channel = new Float32Array(frames);
  for (let i = 0; i < frames; i++) {
    const at = start + i * channels * 2;
    if (at + 1 >= buf.length) break;
    channel[i] = buf.readInt16BE(at) / 32768; // first channel only
  }
  return { channel, sampleRate, durationSec: frames / sampleRate };
}

function wav(buf: Buffer): Pcm | null {
  let pos = 12;
  let channels = 1;
  let sampleRate = 44100;
  let bits = 16;
  let dataAt = -1;
  let dataLen = 0;
  while (pos + 8 <= buf.length) {
    const id = buf.toString("ascii", pos, pos + 4);
    const size = buf.readUInt32LE(pos + 4);
    if (id === "fmt ") {
      channels = buf.readUInt16LE(pos + 10);
      sampleRate = buf.readUInt32LE(pos + 12);
      bits = buf.readUInt16LE(pos + 22);
    } else if (id === "data") {
      dataAt = pos + 8;
      dataLen = size;
      break;
    }
    pos += 8 + size + (size % 2);
  }
  if (dataAt < 0 || bits !== 16) return null;

  const frames = Math.floor(dataLen / (channels * 2));
  const channel = new Float32Array(frames);
  for (let i = 0; i < frames; i++) {
    const at = dataAt + i * channels * 2;
    if (at + 1 >= buf.length) break;
    channel[i] = buf.readInt16LE(at) / 32768;
  }
  return { channel, sampleRate, durationSec: frames / sampleRate };
}

/** AIFF stores its sample rate as an 80-bit IEEE extended float. */
function extended80(buf: Buffer, at: number): number {
  const exponent = buf.readUInt16BE(at) - 16383;
  const mantissa = Number(buf.readBigUInt64BE(at + 2));
  return Math.round(mantissa * 2 ** (exponent - 63));
}
