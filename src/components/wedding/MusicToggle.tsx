import { useEffect, useRef, useState } from "react";
import { Music, Pause } from "lucide-react";
import { wedding } from "@/config/wedding";
import { useI18n } from "@/lib/i18n";

/** Renders nothing unless a licensed/royalty-free music file is configured. Never autoplays. */
export function MusicToggle() {
  const { t } = useI18n();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => audioRef.current?.pause(), []);

  if (!wedding.musicUrl) return null;

  const toggle = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(wedding.musicUrl!);
      audioRef.current.loop = true;
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? t.musicOff : t.musicOn}
      className="fixed bottom-4 left-4 z-40 flex size-12 items-center justify-center rounded-full border border-gold bg-maroon text-gold-light shadow-card"
    >
      {playing ? <Pause className="size-5" /> : <Music className="size-5" />}
    </button>
  );
}
