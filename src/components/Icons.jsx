import { RotateCw, MousePointer, Clock } from "lucide-react";

const defaultClassName='w-4 h-4';

export function RotateClockWiseIcon({ className=null }) {
  return (
    <RotateCw className={ className ?? defaultClassName } />
  )
}

export function MousePointerIcon({ className=null }) {
  return (
    <MousePointer className={ className ?? defaultClassName } />
  )
}

export function ClockIcon({ className=null }) {
  return (
    <Clock className={ className ?? defaultClassName } />
  )
}
