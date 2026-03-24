"use client";

import { STAMP_SHAPES } from "@/lib/stampShapes";

interface StampShapePickerProps {
  value: string;
  onChange: (v: string) => void;
}

export default function StampShapePicker({ value, onChange }: StampShapePickerProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {STAMP_SHAPES.map((s) => {
        const selected = value === s.value;
        return (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange(s.value)}
            title={s.label}
            className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl border transition-all"
            style={{
              borderColor: selected ? "#6366f1" : "#e5e7eb",
              background: selected ? "#eef2ff" : "#fff",
              outline: "none",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={22} height={22}
              style={{ color: selected ? "#6366f1" : "#6b7280" }}
              dangerouslySetInnerHTML={{ __html: s.svg }}
            />
            <span
              className="text-[9px] font-medium text-center leading-tight"
              style={{ color: selected ? "#6366f1" : "#6b7280" }}
            >
              {s.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
