const slotsCache = new Map<string, string[]>();

export const generateHourlySlots = (intervalLabelWithTime: string): string[] => {
  if (slotsCache.has(intervalLabelWithTime)) {
    return slotsCache.get(intervalLabelWithTime)!;
  }
  const match = intervalLabelWithTime.match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/);
  if (!match) {
    slotsCache.set(intervalLabelWithTime, []);
    return [];
  }
  const startTimeStr = match[1];
  const endTimeStr = match[2];
  const startHour = parseInt(startTimeStr.split(':')[0]);
  let endHour = parseInt(endTimeStr.split(':')[0]);
  if (endTimeStr === "00:00" && startHour !== 0 && endHour === 0) endHour = 24;
  const slots: string[] = [];
  if (startHour > endHour && !(endHour === 0 && startHour > 0) ) {
     if (!(startHour < 24 && endHour === 0)) {
       slotsCache.set(intervalLabelWithTime, []);
       return [];
     }
  }
  for (let h = startHour; h < endHour; h++) {
    const currentSlotStart = `${String(h).padStart(2, '0')}:00`;
    const nextHour = h + 1;
    const currentSlotEnd = `${String(nextHour).padStart(2, '0')}:00`;
    slots.push(`${currentSlotStart} - ${currentSlotEnd}`);
  }
  slotsCache.set(intervalLabelWithTime, slots);
  return slots;
};
