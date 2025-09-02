
import { generateHourlySlots } from '@/app/day/[dayName]/page';

describe('generateHourlySlots', () => {
  it('should generate correct hourly slots for a standard morning interval', () => {
    const intervalLabel = '上午 (09:00 - 12:00)';
    const expectedSlots = [
      '09:00 - 10:00',
      '10:00 - 11:00',
      '11:00 - 12:00',
    ];
    expect(generateHourlySlots(intervalLabel)).toEqual(expectedSlots);
  });

  it('should generate correct slots for an evening interval spanning across midnight', () => {
    const intervalLabel = '晚上 (18:00 - 24:00)';
    const expectedSlots = [
      '18:00 - 19:00',
      '19:00 - 20:00',
      '20:00 - 21:00',
      '21:00 - 22:00',
      '22:00 - 23:00',
      '23:00 - 24:00',
    ];
    expect(generateHourlySlots(intervalLabel)).toEqual(expectedSlots);
  });

  it('should generate correct slots for a midnight interval', () => {
    const intervalLabel = '凌晨 (00:00 - 05:00)';
    const expectedSlots = [
      '00:00 - 01:00',
      '01:00 - 02:00',
      '02:00 - 03:00',
      '03:00 - 04:00',
      '04:00 - 05:00',
    ];
    expect(generateHourlySlots(intervalLabel)).toEqual(expectedSlots);
  });

  it('should return an empty array for an invalid label format', () => {
    const intervalLabel = 'Invalid Label';
    expect(generateHourlySlots(intervalLabel)).toEqual([]);
  });

  it('should handle single-hour intervals correctly', () => {
    const intervalLabel = 'Test (14:00 - 15:00)';
    const expectedSlots = ['14:00 - 15:00'];
    expect(generateHourlySlots(intervalLabel)).toEqual(expectedSlots);
  });

  it('should return an empty array if start time is greater than end time', () => {
    const intervalLabel = 'Invalid (15:00 - 14:00)';
    expect(generateHourlySlots(intervalLabel)).toEqual([]);
  });
});
