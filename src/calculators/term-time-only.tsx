import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getWeek,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import {
  parseAsBoolean,
  parseAsFloat,
  parseAsIsoDateTime,
  useQueryStates,
} from 'nuqs';
import RadixSlider from '../components/RadixSlider';

// UK School term dates
const TERM_DATES = [
  // 2025 (approximate)
  { start: new Date(2025, 0, 6), end: new Date(2025, 1, 14) }, // Spring Term: Jan 6 - Feb 14
  { start: new Date(2025, 1, 24), end: new Date(2025, 3, 4) }, // Spring Term: Feb 24 - Apr 4
  { start: new Date(2025, 3, 22), end: new Date(2025, 4, 23) }, // Summer Term: Apr 22 - May 23
  { start: new Date(2025, 5, 2), end: new Date(2025, 6, 18) }, // Summer Term: Jun 2 - Jul 18

  // 2025-2026 Academic Year
  { start: new Date(2025, 8, 1), end: new Date(2025, 9, 24) }, // Autumn Term: Sep 1 - Oct 24
  { start: new Date(2025, 10, 3), end: new Date(2025, 11, 19) }, // Autumn Term: Nov 3 - Dec 19
  { start: new Date(2026, 0, 5), end: new Date(2026, 1, 13) }, // Spring Term: Jan 5 - Feb 13
  { start: new Date(2026, 1, 23), end: new Date(2026, 2, 27) }, // Spring Term: Feb 23 - Mar 27
  { start: new Date(2026, 3, 13), end: new Date(2026, 4, 22) }, // Summer Term: Apr 13 - May 22
  { start: new Date(2026, 5, 1), end: new Date(2026, 6, 17) }, // Summer Term: Jun 1 - Jul 17

  // 2026-2027 Academic Year
  { start: new Date(2026, 8, 3), end: new Date(2026, 9, 23) }, // Autumn Term: Sep 3 - Oct 23
  { start: new Date(2026, 10, 2), end: new Date(2026, 11, 18) }, // Autumn Term: Nov 2 - Dec 18
  { start: new Date(2027, 0, 4), end: new Date(2027, 1, 12) }, // Spring Term: Jan 4 - Feb 12
  { start: new Date(2027, 1, 22), end: new Date(2027, 2, 25) }, // Spring Term: Feb 22 - Mar 25
  { start: new Date(2027, 3, 12), end: new Date(2027, 4, 28) }, // Summer Term: Apr 12 - May 28
  { start: new Date(2027, 5, 7), end: new Date(2027, 6, 22) }, // Summer Term: Jun 7 - Jul 22

  // 2027-2028 Academic Year
  { start: new Date(2027, 8, 2), end: new Date(2027, 9, 22) }, // Autumn Term: Sep 2 - Oct 22
  { start: new Date(2027, 10, 1), end: new Date(2027, 11, 17) }, // Autumn Term: Nov 1 - Dec 17
  { start: new Date(2028, 0, 3), end: new Date(2028, 1, 11) }, // Spring Term: Jan 3 - Feb 11
  { start: new Date(2028, 1, 21), end: new Date(2028, 2, 24) }, // Spring Term: Feb 21 - Mar 24
  { start: new Date(2028, 3, 10), end: new Date(2028, 4, 26) }, // Summer Term: Apr 10 - May 26
  { start: new Date(2028, 5, 5), end: new Date(2028, 6, 21) }, // Summer Term: Jun 5 - Jul 21

  // 2028-2029 Academic Year
  { start: new Date(2028, 8, 4), end: new Date(2028, 9, 27) }, // Autumn Term: Sep 4 - Oct 27
  { start: new Date(2028, 10, 6), end: new Date(2028, 11, 22) }, // Autumn Term: Nov 6 - Dec 22
];

// UK Bank Holidays
const BANK_HOLIDAYS = [
  // 2025
  new Date(2025, 0, 1), // New Year's Day
  new Date(2025, 3, 18), // Good Friday
  new Date(2025, 3, 21), // Easter Monday
  new Date(2025, 4, 5), // Early May Bank Holiday
  new Date(2025, 4, 26), // Spring Bank Holiday
  new Date(2025, 7, 25), // Summer Bank Holiday
  new Date(2025, 11, 25), // Christmas Day
  new Date(2025, 11, 26), // Boxing Day

  // 2026
  new Date(2026, 0, 1), // New Year's Day
  new Date(2026, 3, 3), // Good Friday
  new Date(2026, 3, 6), // Easter Monday
  new Date(2026, 4, 4), // Early May Bank Holiday
  new Date(2026, 4, 25), // Spring Bank Holiday
  new Date(2026, 7, 31), // Summer Bank Holiday
  new Date(2026, 11, 25), // Christmas Day
  new Date(2026, 11, 28), // Boxing Day (substitute day)

  // 2027
  new Date(2027, 0, 1), // New Year's Day
  new Date(2027, 2, 26), // Good Friday
  new Date(2027, 2, 29), // Easter Monday
  new Date(2027, 4, 3), // Early May Bank Holiday (May Day)
  new Date(2027, 4, 31), // Spring Bank Holiday
  new Date(2027, 7, 30), // Summer Bank Holiday
  new Date(2027, 11, 27), // Christmas Day (substitute day)
  new Date(2027, 11, 28), // Boxing Day (substitute day)

  // 2028
  new Date(2028, 0, 3), // New Year's Day (substitute day)
  new Date(2028, 3, 14), // Good Friday
  new Date(2028, 3, 17), // Easter Monday
  new Date(2028, 4, 1), // Early May Bank Holiday
  new Date(2028, 4, 29), // Spring Bank Holiday
  new Date(2028, 7, 28), // Summer Bank Holiday
  new Date(2028, 11, 25), // Christmas Day
  new Date(2028, 11, 26), // Boxing Day
];

const isTermTime = (date: Date): boolean => {
  return TERM_DATES.some((term) => date >= term.start && date <= term.end);
};

const isBankHoliday = (date: Date): boolean => {
  return BANK_HOLIDAYS.some(
    (holiday) =>
      holiday.getFullYear() === date.getFullYear() &&
      holiday.getMonth() === date.getMonth() &&
      holiday.getDate() === date.getDate(),
  );
};

const isChristmasPeriod = (date: Date): boolean => {
  const month = date.getMonth();
  const day = date.getDate();
  // December 24-31 and January 1-2
  return (
    (month === 11 && day >= 24) || // Dec 24-31
    (month === 0 && day <= 2) // Jan 1-2
  );
};

const isUnpaidDay = (date: Date): boolean => {
  return isBankHoliday(date) || isChristmasPeriod(date);
};

interface TermTimeOnlyCalcProps {
  onToggle?: () => void;
}

const TermTimeOnlyCalc = ({ onToggle }: TermTimeOnlyCalcProps) => {
  const [state, setState] = useQueryStates({
    currentMonth: parseAsIsoDateTime.withDefault(new Date()),
    daysPerWeek: parseAsFloat.withDefault(4),
    hoursPerDay: parseAsFloat.withDefault(11),
    costPerHour: parseAsFloat.withDefault(6.5),
    hasGovtFunding: parseAsBoolean.withDefault(true),
    hasTaxFreeChildcare: parseAsBoolean.withDefault(true),
    bothParentsUnder100k: parseAsBoolean.withDefault(true),
  });

  const {
    currentMonth,
    daysPerWeek,
    hoursPerDay,
    costPerHour,
    hasGovtFunding,
    hasTaxFreeChildcare,
    bothParentsUnder100k,
  } = state;

  const setCurrentMonth = (value: Date) => setState({ currentMonth: value });
  const setDaysPerWeek = (value: number) => setState({ daysPerWeek: value });
  const setHoursPerDay = (value: number) => setState({ hoursPerDay: value });
  const setCostPerHour = (value: number | string) =>
    setState({ costPerHour: typeof value === 'string' ? 0 : value });
  const setHasGovtFunding = (value: boolean) =>
    setState({ hasGovtFunding: value });
  const setHasTaxFreeChildcare = (value: boolean) =>
    setState({ hasTaxFreeChildcare: value });
  const setBothParentsUnder100k = (value: boolean) =>
    setState({ bothParentsUnder100k: value });

  const govtFundedHoursPerWeek = 30;
  const surchargePerHour = 1.5;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateWeekCost = (weekStart: Date) => {
    const hourlyRate = costPerHour;
    const totalHoursPerWeek = daysPerWeek * hoursPerDay;

    // Calculate which days of the week are used (always starting from Monday)
    // daysPerWeek represents consecutive days starting from Monday
    // e.g., 3 days = Mon, Tue, Wed; 4 days = Mon, Tue, Wed, Thu
    const fullDaysInWeek = Math.floor(daysPerWeek);
    const partialDay = daysPerWeek - fullDaysInWeek;

    // Check if specific weekdays (Monday to Friday/Saturday/Sunday based on daysPerWeek) contain unpaid days
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    // Count unpaid days only within the days that childcare is used
    // Monday = 0, Tuesday = 1, etc.
    let unpaidDays = 0;
    for (let i = 0; i < fullDaysInWeek; i++) {
      if (isUnpaidDay(weekDays[i])) {
        unpaidDays++;
      }
    }

    // Handle partial day (e.g., 0.5 days)
    let unpaidPartialDay = 0;
    if (partialDay > 0 && fullDaysInWeek < 7) {
      if (isUnpaidDay(weekDays[fullDaysInWeek])) {
        unpaidPartialDay = partialDay;
      }
    }

    const totalUnpaidDays = unpaidDays + unpaidPartialDay;

    // If all selected days are unpaid, return zero cost
    if (totalUnpaidDays >= daysPerWeek) {
      return {
        total: 0,
        fundedHours: 0,
        unfundedHours: 0,
        isTermTime: false,
        isUnpaid: true,
      };
    }

    // Adjust hours based on unpaid days within the selected days
    const paidDaysRatio = (daysPerWeek - totalUnpaidDays) / daysPerWeek;
    const adjustedTotalHours = totalHoursPerWeek * paidDaysRatio;

    // Check if this week is term time
    const isTermWeek = isTermTime(weekStart);

    if (isTermWeek && hasGovtFunding) {
      // Term time with government funding
      const fundedHours = Math.min(
        govtFundedHoursPerWeek * paidDaysRatio,
        adjustedTotalHours,
      );
      const unfundedHours = Math.max(0, adjustedTotalHours - fundedHours);

      // Funded hours have a surcharge
      const fundedCost = fundedHours * surchargePerHour;
      // Unfunded hours charged at normal rate
      const unfundedCost = unfundedHours * hourlyRate;

      return {
        total: fundedCost + unfundedCost,
        fundedHours,
        unfundedHours,
        isTermTime: true,
        isUnpaid: false,
        unpaidDays: totalUnpaidDays,
      };
    } else {
      // Holiday time - full cost, no funding
      return {
        total: adjustedTotalHours * hourlyRate,
        fundedHours: 0,
        unfundedHours: adjustedTotalHours,
        isTermTime: false,
        isUnpaid: false,
        unpaidDays: totalUnpaidDays,
      };
    }
  };

  const getCalendarWeeks = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks;
  };

  // const calculateMonthTotal = () => {
  //   const weeks = getCalendarWeeks();
  //   let total = 0;

  //   weeks.forEach((week) => {
  //     if (isSameMonth(week[0], currentMonth)) {
  //       const cost = calculateWeekCost(week[0]);
  //       total += cost.total;
  //     }
  //   });

  //   return total;
  // };

  // Calculate detailed month breakdown with savings
  const calculateMonthBreakdown = () => {
    const weeks = getCalendarWeeks();
    const hourlyRate = costPerHour;

    let grossCost = 0;
    let govtFundingSavings = 0;
    let actualCost = 0;

    weeks.forEach((week) => {
      if (isSameMonth(week[0], currentMonth)) {
        const cost = calculateWeekCost(week[0]);
        actualCost += cost.total;

        // Calculate what the gross cost would have been
        const totalHoursPerWeek = daysPerWeek * hoursPerDay;

        // Calculate unpaid days for this week
        const weekDays = Array.from({ length: 7 }, (_, j) =>
          addDays(week[0], j),
        );
        const fullDaysInWeek = Math.floor(daysPerWeek);
        const partialDay = daysPerWeek - fullDaysInWeek;

        let unpaidDays = 0;
        for (let j = 0; j < fullDaysInWeek; j++) {
          if (isUnpaidDay(weekDays[j])) {
            unpaidDays++;
          }
        }

        let unpaidPartialDay = 0;
        if (partialDay > 0 && fullDaysInWeek < 7) {
          if (isUnpaidDay(weekDays[fullDaysInWeek])) {
            unpaidPartialDay = partialDay;
          }
        }

        const totalUnpaidDays = unpaidDays + unpaidPartialDay;

        if (totalUnpaidDays < daysPerWeek) {
          const paidDaysRatio = (daysPerWeek - totalUnpaidDays) / daysPerWeek;
          const adjustedTotalHours = totalHoursPerWeek * paidDaysRatio;

          const weekGrossCost = adjustedTotalHours * hourlyRate;
          grossCost += weekGrossCost;

          // Calculate government funding savings for this week
          const isTermWeek = isTermTime(week[0]);
          if (isTermWeek && hasGovtFunding && bothParentsUnder100k) {
            const fundedHours = Math.min(
              govtFundedHoursPerWeek * paidDaysRatio,
              adjustedTotalHours,
            );
            // The saving is the difference between full cost and surcharge
            const fundingSaving = fundedHours * (hourlyRate - surchargePerHour);
            govtFundingSavings += fundingSaving;
          }
        }
      }
    });

    // Calculate Tax-Free Childcare savings (20% of actual cost after govt funding)
    const costAfterGovtFunding = grossCost - govtFundingSavings;
    const taxFreeSavings =
      hasTaxFreeChildcare && bothParentsUnder100k
        ? Math.min(costAfterGovtFunding * 0.2, 2000 / 12) // Monthly max is annual max / 12
        : 0;

    const netCost = grossCost - govtFundingSavings - taxFreeSavings;

    return {
      grossCost,
      govtFundingSavings,
      taxFreeSavings,
      netCost,
    };
  };

  // const calculateYearTotal = () => {
  //   let total = 0;
  //   const startDate = new Date(currentMonth.getFullYear(), 0, 1);

  //   for (let i = 0; i < 52; i++) {
  //     const weekStart = addDays(startDate, i * 7);
  //     const cost = calculateWeekCost(weekStart);
  //     total += cost.total;
  //   }

  //   return total;
  // };

  // Calculate detailed year breakdown with savings
  const calculateYearBreakdown = () => {
    const startDate = new Date(currentMonth.getFullYear(), 0, 1);
    const hourlyRate = typeof costPerHour === 'string' ? 0 : costPerHour;

    let grossCost = 0;
    let govtFundingSavings = 0;
    let actualCost = 0;

    for (let i = 0; i < 52; i++) {
      const weekStart = addDays(startDate, i * 7);
      const cost = calculateWeekCost(weekStart);

      actualCost += cost.total;

      // Calculate what the gross cost would have been
      const totalHoursPerWeek = daysPerWeek * hoursPerDay;

      // Calculate unpaid days for this week
      const weekDays = Array.from({ length: 7 }, (_, j) =>
        addDays(weekStart, j),
      );
      const fullDaysInWeek = Math.floor(daysPerWeek);
      const partialDay = daysPerWeek - fullDaysInWeek;

      let unpaidDays = 0;
      for (let j = 0; j < fullDaysInWeek; j++) {
        if (isUnpaidDay(weekDays[j])) {
          unpaidDays++;
        }
      }

      let unpaidPartialDay = 0;
      if (partialDay > 0 && fullDaysInWeek < 7) {
        if (isUnpaidDay(weekDays[fullDaysInWeek])) {
          unpaidPartialDay = partialDay;
        }
      }

      const totalUnpaidDays = unpaidDays + unpaidPartialDay;

      if (totalUnpaidDays < daysPerWeek) {
        const paidDaysRatio = (daysPerWeek - totalUnpaidDays) / daysPerWeek;
        const adjustedTotalHours = totalHoursPerWeek * paidDaysRatio;

        const weekGrossCost = adjustedTotalHours * hourlyRate;
        grossCost += weekGrossCost;

        // Calculate government funding savings for this week
        const isTermWeek = isTermTime(weekStart);
        if (isTermWeek && hasGovtFunding && bothParentsUnder100k) {
          const fundedHours = Math.min(
            govtFundedHoursPerWeek * paidDaysRatio,
            adjustedTotalHours,
          );
          // The saving is the difference between full cost and surcharge
          const fundingSaving = fundedHours * (hourlyRate - surchargePerHour);
          govtFundingSavings += fundingSaving;
        }
      }
    }

    // Calculate Tax-Free Childcare savings (20% of actual cost after govt funding)
    const costAfterGovtFunding = grossCost - govtFundingSavings;
    const taxFreeSavings =
      hasTaxFreeChildcare && bothParentsUnder100k
        ? Math.min(costAfterGovtFunding * 0.2, 2000)
        : 0;

    const netCost = grossCost - govtFundingSavings - taxFreeSavings;

    return {
      grossCost,
      govtFundingSavings,
      taxFreeSavings,
      netCost,
    };
  };

  const weeks = getCalendarWeeks();
  // const monthTotal = calculateMonthTotal();
  const monthBreakdown = calculateMonthBreakdown();
  // const yearTotal = calculateYearTotal();
  const yearBreakdown = calculateYearBreakdown();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1600px]">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Left Column - Header & Input Form */}
          <div className="flex flex-col gap-5 md:col-span-2 lg:col-span-1">
            {/* Header Card */}
            <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 p-8 text-white shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Term-Time Only Calculator
                  </h1>
                  <p className="mt-2 text-sm text-violet-100">
                    With £{surchargePerHour} surcharge on funded hours
                  </p>
                </div>
                {onToggle && (
                  <button
                    onClick={onToggle}
                    className="flex-shrink-0 rounded-lg bg-white/20 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30"
                    title="Switch to Stretched Hours Calculator"
                  >
                    Switch Calculator
                  </button>
                )}
              </div>
            </div>

            {/* Settings Card */}
            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-900/5 sm:p-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Settings
              </h2>

              {/* Days Per Week */}
              <div className="mb-4">
                <RadixSlider
                  value={daysPerWeek}
                  min={0}
                  max={7}
                  step={0.5}
                  onChange={setDaysPerWeek}
                  label="Days per week"
                />
              </div>

              {/* Hours Per Day */}
              <div className="mb-4">
                <RadixSlider
                  value={hoursPerDay}
                  min={4}
                  max={14}
                  step={0.5}
                  onChange={setHoursPerDay}
                  label="Hours per day"
                />
              </div>

              {/* Cost Per Hour */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Cost per hour (holiday rate)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base font-semibold text-gray-500">
                    £
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.10"
                    value={costPerHour}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || value === '.') {
                        setCostPerHour('');
                      } else {
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue) && numValue >= 0) {
                          setCostPerHour(numValue);
                        }
                      }
                    }}
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-2.5 pl-8 pr-4 text-base font-semibold text-gray-900 transition-colors focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100"
                  />
                </div>
              </div>

              {/* Both Parents Under 100k */}
              <div className="mb-4">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-gray-200 p-3 transition-all hover:border-violet-300 hover:bg-violet-50/50">
                  <input
                    type="checkbox"
                    checked={bothParentsUnder100k}
                    onChange={(e) => setBothParentsUnder100k(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-violet-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Both parents earn under £100k
                  </span>
                </label>
              </div>

              {/* Government Funding */}
              <div className="mb-4">
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                    bothParentsUnder100k
                      ? 'border-gray-200 hover:border-violet-300 hover:bg-violet-50/50'
                      : 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={hasGovtFunding}
                    onChange={(e) => setHasGovtFunding(e.target.checked)}
                    disabled={!bothParentsUnder100k}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-violet-600 disabled:cursor-not-allowed"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    30 hours government funding (term-time)
                  </span>
                </label>
              </div>

              {/* Tax-Free Childcare */}
              <div className="mb-4">
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                    bothParentsUnder100k
                      ? 'border-gray-200 hover:border-violet-300 hover:bg-violet-50/50'
                      : 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={hasTaxFreeChildcare}
                    onChange={(e) => setHasTaxFreeChildcare(e.target.checked)}
                    disabled={!bothParentsUnder100k}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-violet-600 disabled:cursor-not-allowed"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">
                      Tax-Free Childcare (20% top-up)
                    </div>
                  </div>
                </label>
              </div>

              {/* Surcharge Info */}
              <div className="rounded-xl bg-violet-50 p-3">
                <div className="text-xs font-medium text-violet-900">
                  Term-time surcharge:{' '}
                  <span className="font-bold">£{surchargePerHour}/hour</span>
                </div>
                <div className="mt-1 text-xs text-violet-700">
                  Applied to government funded hours only
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Calendar */}
          <div className="md:col-span-2 lg:col-span-2">
            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-900/5 sm:p-6">
              {/* Calendar Header */}
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="flex-1 rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-violet-300 hover:bg-violet-50 sm:flex-none"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date())}
                    className="flex-1 rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-violet-300 hover:bg-violet-50 sm:flex-none"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="flex-1 rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-violet-300 hover:bg-violet-50 sm:flex-none"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="overflow-x-auto">
                <div className="min-w-[280px]">
                  {/* Weekday Headers */}
                  <div className="mb-2 grid grid-cols-7 gap-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-[10px] font-semibold text-gray-600 sm:text-xs"
                        >
                          {day}
                        </div>
                      ),
                    )}
                  </div>

                  {/* Calendar Weeks */}
                  <div className="space-y-2">
                    {weeks.map((week, weekIndex) => {
                      const weekCost = calculateWeekCost(week[0]);
                      const isCurrentMonthWeek = isSameMonth(
                        week[0],
                        currentMonth,
                      );

                      return (
                        <div key={weekIndex} className="space-y-1">
                          {/* Days */}
                          <div className="grid grid-cols-7 gap-1">
                            {week.map((day, dayIndex) => {
                              const isCurrentMonth = isSameMonth(
                                day,
                                currentMonth,
                              );
                              const isToday = isSameDay(day, new Date());
                              const isTerm = isTermTime(day);
                              const isUnpaid = isUnpaidDay(day);

                              return (
                                <div
                                  key={dayIndex}
                                  className={`relative rounded-lg p-1 text-center text-xs sm:p-2 sm:text-sm ${
                                    isCurrentMonth
                                      ? isUnpaid
                                        ? 'bg-gray-200 text-gray-500'
                                        : isTerm
                                          ? 'bg-green-50 text-gray-900'
                                          : 'bg-orange-50 text-gray-900'
                                      : 'bg-gray-50 text-gray-400'
                                  } ${isToday ? 'ring-2 ring-violet-500' : ''}`}
                                >
                                  <div className="font-semibold">
                                    {format(day, 'd')}
                                  </div>
                                  {isCurrentMonth && isUnpaid && (
                                    <div className="mt-0.5 text-[8px] sm:text-[10px]">
                                      ❌
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Week Cost */}
                          {isCurrentMonthWeek && (
                            <div
                              className={`rounded-lg p-2 ${
                                weekCost.isUnpaid
                                  ? 'bg-gray-200 text-gray-700'
                                  : weekCost.isTermTime
                                    ? 'bg-green-100 text-green-900'
                                    : 'bg-orange-100 text-orange-900'
                              }`}
                            >
                              <div className="flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                                <div className="font-medium">
                                  Week {getWeek(week[0])}
                                  <span className="ml-2 text-[10px] sm:text-xs">
                                    {weekCost.isUnpaid
                                      ? '❌ Unpaid'
                                      : weekCost.isTermTime
                                        ? '📚 Term'
                                        : '🏖️ Holiday'}
                                  </span>
                                </div>
                                <div className="font-bold">
                                  {formatCurrency(weekCost.total)}
                                </div>
                              </div>
                              {!weekCost.isUnpaid &&
                                weekCost.unpaidDays !== undefined &&
                                weekCost.unpaidDays > 0 && (
                                  <div className="mt-1 text-[10px] opacity-75 sm:text-xs">
                                    ({weekCost.unpaidDays} unpaid day
                                    {weekCost.unpaidDays > 1 ? 's' : ''})
                                  </div>
                                )}
                              {!weekCost.isUnpaid &&
                                weekCost.isTermTime &&
                                weekCost.fundedHours > 0 && (
                                  <div className="mt-1 text-[10px] sm:text-xs">
                                    {weekCost.fundedHours.toFixed(1)}h funded @
                                    £{surchargePerHour}/h
                                    {weekCost.unfundedHours > 0 &&
                                      ` + ${weekCost.unfundedHours.toFixed(
                                        1,
                                      )}h @ £${costPerHour}/h`}
                                  </div>
                                )}
                              {!weekCost.isUnpaid && !weekCost.isTermTime && (
                                <div className="mt-1 text-[10px] sm:text-xs">
                                  {weekCost.unfundedHours.toFixed(1)}h @ £
                                  {costPerHour}/h (no funding)
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Month Total */}
                  <div className="mt-4 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">
                        {format(currentMonth, 'MMMM')} Total
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {formatCurrency(monthBreakdown.netCost)}
                        </div>
                        {(monthBreakdown.govtFundingSavings > 0 ||
                          monthBreakdown.taxFreeSavings > 0) && (
                          <div className="mt-0.5 text-xs text-violet-200">
                            (Gross: {formatCurrency(monthBreakdown.grossCost)})
                          </div>
                        )}
                      </div>
                    </div>
                    {(monthBreakdown.govtFundingSavings > 0 ||
                      monthBreakdown.taxFreeSavings > 0) && (
                      <div className="mt-2 border-t border-white/20 pt-2 text-xs text-violet-100">
                        {monthBreakdown.govtFundingSavings > 0 && (
                          <div className="flex justify-between">
                            <span>Govt Funding Saved:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                monthBreakdown.govtFundingSavings,
                              )}
                            </span>
                          </div>
                        )}
                        {monthBreakdown.taxFreeSavings > 0 && (
                          <div className="flex justify-between">
                            <span>Tax-Free Saved:</span>
                            <span className="font-semibold">
                              {formatCurrency(monthBreakdown.taxFreeSavings)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-3 text-xs sm:gap-4 sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-green-50 ring-1 ring-green-200 sm:h-4 sm:w-4"></div>
                  <span className="text-gray-600">
                    Term Time (with funding)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-orange-50 ring-1 ring-orange-200 sm:h-4 sm:w-4"></div>
                  <span className="text-gray-600">Holiday (full cost)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-gray-200 ring-1 ring-gray-300 sm:h-4 sm:w-4"></div>
                  <span className="text-gray-600">
                    Unpaid (bank holidays, Xmas period)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Cost Breakdown */}
          <div className="md:col-span-2 lg:col-span-1">
            {/* Cost Breakdown */}
            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-900/5 sm:p-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Annual Cost Breakdown
              </h2>

              <div className="space-y-2 text-sm">
                {/* Gross Cost */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-700">Gross Cost</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(yearBreakdown.grossCost)}
                  </span>
                </div>

                {/* Government Funding */}
                <div
                  className={`flex items-center justify-between pb-2 ${
                    yearBreakdown.govtFundingSavings > 0
                      ? 'text-green-700'
                      : 'text-gray-400'
                  }`}
                >
                  <span className="font-medium">
                    Govt Funding
                    {yearBreakdown.govtFundingSavings > 0 && ' (term-time)'}
                  </span>
                  <span className="font-semibold">
                    {yearBreakdown.govtFundingSavings > 0
                      ? `-${formatCurrency(yearBreakdown.govtFundingSavings)}`
                      : '−'}
                  </span>
                </div>

                {/* Tax-Free Childcare */}
                <div
                  className={`flex items-center justify-between border-b border-gray-200 pb-2 ${
                    yearBreakdown.taxFreeSavings > 0
                      ? 'text-blue-700'
                      : 'text-gray-400'
                  }`}
                >
                  <span className="font-medium">Tax-Free (20%)</span>
                  <span className="font-semibold">
                    {yearBreakdown.taxFreeSavings > 0
                      ? `-${formatCurrency(yearBreakdown.taxFreeSavings)}`
                      : '−'}
                  </span>
                </div>

                {/* Net Cost */}
                <div className="flex items-center justify-between pt-2">
                  <span className="font-bold text-gray-900">
                    Net Annual Cost
                  </span>
                  <span className="text-xl font-bold text-violet-600">
                    {formatCurrency(yearBreakdown.netCost)}
                  </span>
                </div>
              </div>

              {/* Monthly average */}
              <div className="mt-3 rounded-lg bg-violet-50 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-violet-900">
                    Monthly Average
                  </span>
                  <span className="font-bold text-violet-900">
                    {formatCurrency(yearBreakdown.netCost / 12)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-5 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 lg:mt-6">
          <div className="flex items-start gap-2.5">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-sm font-semibold text-amber-900">
                How Term-Time Pricing Works
              </h3>
              <p className="mb-0 text-xs leading-relaxed text-amber-800">
                During term time (green weeks), government funded hours incur a
                £{surchargePerHour} surcharge per hour. Any additional hours are
                charged at the standard rate. During holidays (orange weeks), no
                government funding is available and all hours are charged at the
                full rate. Bank holidays and the Christmas period (Dec 24-Jan 2)
                are unpaid days with no childcare costs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermTimeOnlyCalc;
