import { useEffect, useState } from 'react';
import RadixSlider from './components/RadixSlider';

const App = () => {
  // Input states
  const [weeksPerYear, setWeeksPerYear] = useState(38);
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [hoursPerDay, setHoursPerDay] = useState(11);
  const [costPerHour, setCostPerHour] = useState<number | string>(6.5);
  const [hasGovtFunding, setHasGovtFunding] = useState(true);
  const [hasTaxFreeChildcare, setHasTaxFreeChildcare] = useState(true);
  const [bothParentsUnder100k, setBothParentsUnder100k] = useState(true);

  // Calculation states
  const [totalHours, setTotalHours] = useState(0);
  const [grossCost, setGrossCost] = useState(0);
  const [govtFundedHours, setGovtFundedHours] = useState(0);
  const [govtFundingSavings, setGovtFundingSavings] = useState(0);
  const [taxFreeChildcareSavings, setTaxFreeChildcareSavings] = useState(0);
  const [netCost, setNetCost] = useState(0);

  useEffect(() => {
    calculateCosts();
  }, [
    weeksPerYear,
    daysPerWeek,
    hoursPerDay,
    costPerHour,
    hasGovtFunding,
    hasTaxFreeChildcare,
    bothParentsUnder100k,
  ]);

  const calculateCosts = () => {
    // Convert costPerHour to number for calculations
    const hourlyRate = typeof costPerHour === 'string' ? 0 : costPerHour;

    // Calculate total hours per year
    const total = weeksPerYear * daysPerWeek * hoursPerDay;
    setTotalHours(total);

    // Calculate gross cost
    const gross = total * hourlyRate;
    setGrossCost(gross);

    let savings = 0;
    let fundedHours = 0;

    // Government funded 30 hours (38 weeks, term-time only)
    // Only eligible if both parents earn under £100k
    if (hasGovtFunding && bothParentsUnder100k) {
      // 30 hours per week for 38 weeks = 1,140 hours per year
      fundedHours = 30 * 38;
      const fundingSavings = fundedHours * hourlyRate;
      setGovtFundedHours(fundedHours);
      setGovtFundingSavings(fundingSavings);
      savings += fundingSavings;
    } else {
      setGovtFundedHours(0);
      setGovtFundingSavings(0);
    }

    // Calculate cost after government funding
    const costAfterFunding = gross - savings;

    // Tax-Free Childcare (20% government top-up, max £2,000 per year per child)
    // Only eligible if both parents earn under £100k
    let tfcSavings = 0;
    if (hasTaxFreeChildcare && bothParentsUnder100k) {
      // Can claim 20% back on childcare costs (government adds £2 for every £8 you pay)
      // Maximum £2,000 per year per child
      tfcSavings = Math.min(costAfterFunding * 0.2, 2000);
      setTaxFreeChildcareSavings(tfcSavings);
    } else {
      setTaxFreeChildcareSavings(0);
    }

    // Calculate net cost
    const net = gross - savings - tfcSavings;
    setNetCost(Math.max(0, net));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  // Calculate weekly, monthly, yearly costs
  const weeklyGross = weeksPerYear > 0 ? grossCost / weeksPerYear : 0;
  const monthlyGross = grossCost / 12;

  const weeklyNet = weeksPerYear > 0 ? netCost / weeksPerYear : 0;
  const monthlyNet = netCost / 12;

  const weeklyGovtFunding =
    weeksPerYear > 0 ? govtFundingSavings / weeksPerYear : 0;
  const monthlyGovtFunding = govtFundingSavings / 12;

  const weeklyTaxFree =
    weeksPerYear > 0 ? taxFreeChildcareSavings / weeksPerYear : 0;
  const monthlyTaxFree = taxFreeChildcareSavings / 12;

  const totalSavings = govtFundingSavings + taxFreeChildcareSavings;
  const savingsPercentage =
    grossCost > 0 ? (totalSavings / grossCost) * 100 : 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl">
        {/* Main Grid - Side by side on desktop, stacked on mobile */}
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          {/* Left Column - Header & Input Form */}
          <div className="flex flex-col gap-5">
            {/* Header Card */}
            <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 p-8 text-white shadow-lg">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Childcare Costs Calculator
              </h1>
            </div>

            {/* Childcare Details Card */}
            <div className="flex-1 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-900/5 sm:p-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Childcare Details
              </h2>

              {/* Weeks Per Year */}
              <div className="mb-4">
                <RadixSlider
                  value={weeksPerYear}
                  min={0}
                  max={52}
                  step={1}
                  onChange={setWeeksPerYear}
                  label="Weeks per year"
                />
              </div>

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
                  Cost per hour
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
                      // Allow empty string for deletion
                      if (value === '' || value === '.') {
                        setCostPerHour('');
                      } else {
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue) && numValue >= 0) {
                          setCostPerHour(numValue);
                        }
                      }
                    }}
                    onBlur={() => {
                      // Convert empty string to 0 when user leaves the field
                      if (costPerHour === '' || costPerHour === '.') {
                        setCostPerHour(0);
                      }
                    }}
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-2.5 pl-8 pr-4 text-base font-semibold text-gray-900 transition-colors focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100"
                  />
                </div>
              </div>

              {/* Total Hours Display */}
              <div className="rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Total hours per year
                  </span>
                  <span className="text-xl font-bold text-violet-600">
                    {totalHours.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Benefits & Costs */}
          <div className="flex flex-col gap-5">
            {/* Benefits Eligibility Card */}
            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-900/5 sm:p-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Benefits Eligibility
              </h2>

              <div className="space-y-3">
                {/* Both Parents Under 100k */}
                <label className="group flex cursor-pointer items-start gap-3 rounded-xl border-2 border-gray-200 p-3 transition-all hover:border-violet-300 hover:bg-violet-50/50">
                  <input
                    type="checkbox"
                    checked={bothParentsUnder100k}
                    onChange={(e) => setBothParentsUnder100k(e.target.checked)}
                    className="mt-0.5 h-5 w-5 cursor-pointer rounded border-gray-300 text-violet-600 transition-colors focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">
                      Both parents earn under £100k
                    </div>
                    <p className="mb-0 mt-0.5 text-xs text-gray-600">
                      Required for government benefits
                    </p>
                  </div>
                </label>

                {/* Government Funded Hours */}
                <label
                  className={`group flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-all ${
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
                    className="mt-0.5 h-5 w-5 cursor-pointer rounded border-gray-300 text-violet-600 transition-colors focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-not-allowed"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">
                      30 hours government funded childcare
                    </div>
                    <p className="mb-0 mt-0.5 text-xs text-gray-600">
                      38 weeks per year, term-time only
                    </p>
                  </div>
                </label>

                {/* Tax-Free Childcare */}
                <label
                  className={`group flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-all ${
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
                    className="mt-0.5 h-5 w-5 cursor-pointer rounded border-gray-300 text-violet-600 transition-colors focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-not-allowed"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">
                      Tax-Free Childcare eligible
                    </div>
                    <p className="mb-0 mt-0.5 text-xs text-gray-600">
                      Up to £2,000 per child per year
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Cost Breakdown Card */}
            <div className="flex flex-1 flex-col rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-900/5 sm:p-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Cost Breakdown
              </h2>

              {/* Financial Breakdown Table */}
              <div className="flex flex-1 flex-col">
                <div className="space-y-2">
                  {/* Header Row */}
                  <div className="grid grid-cols-3 gap-2 border-b-2 border-gray-200 px-2 pb-2 text-xs font-semibold text-gray-600 sm:grid-cols-4">
                    <div className="text-left">Item</div>
                    <div className="hidden text-right sm:block">Weekly</div>
                    <div className="text-right sm:hidden">Monthly</div>
                    <div className="text-right">Yearly</div>
                  </div>

                  {/* Gross Cost */}
                  <div className="grid grid-cols-3 gap-2 px-2 py-2 sm:grid-cols-4">
                    <div className="text-xs font-medium text-gray-900 sm:text-sm">
                      Gross Cost
                    </div>
                    <div className="hidden text-right text-xs text-gray-700 sm:block sm:text-sm">
                      {formatCurrency(weeklyGross)}
                    </div>
                    <div className="text-right text-xs text-gray-700 sm:hidden sm:text-sm">
                      {formatCurrency(monthlyGross)}
                    </div>
                    <div className="text-right text-xs font-semibold text-gray-900 sm:text-sm">
                      {formatCurrency(grossCost)}
                    </div>
                  </div>

                  {/* Government Funding - Always visible */}
                  <div
                    className={`grid grid-cols-3 gap-2 text-nowrap rounded-lg px-2 py-2 sm:grid-cols-4 ${
                      govtFundingSavings > 0
                        ? 'bg-green-50'
                        : 'bg-gray-50 opacity-50'
                    }`}
                  >
                    <div
                      className={`text-xs font-medium sm:text-sm ${
                        govtFundingSavings > 0
                          ? 'text-green-900'
                          : 'text-gray-500'
                      }`}
                    >
                      Govt Funding
                      {govtFundingSavings > 0 && (
                        <span className="ml-1 text-xs text-green-600">
                          ({govtFundedHours}h)
                        </span>
                      )}
                    </div>
                    <div
                      className={`hidden text-right text-xs sm:block sm:text-sm ${
                        govtFundingSavings > 0
                          ? 'text-green-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {govtFundingSavings > 0
                        ? `-${formatCurrency(weeklyGovtFunding)}`
                        : '−'}
                    </div>
                    <div
                      className={`text-right text-xs sm:hidden sm:text-sm ${
                        govtFundingSavings > 0
                          ? 'text-green-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {govtFundingSavings > 0
                        ? `-${formatCurrency(monthlyGovtFunding)}`
                        : '−'}
                    </div>
                    <div
                      className={`text-right text-xs font-semibold sm:text-sm ${
                        govtFundingSavings > 0
                          ? 'text-green-800'
                          : 'text-gray-400'
                      }`}
                    >
                      {govtFundingSavings > 0
                        ? `-${formatCurrency(govtFundingSavings)}`
                        : '−'}
                    </div>
                  </div>

                  {/* Tax-Free Childcare - Always visible */}
                  <div
                    className={`grid grid-cols-3 gap-2 text-nowrap rounded-lg px-2 py-2 sm:grid-cols-4 ${
                      taxFreeChildcareSavings > 0
                        ? 'bg-blue-50'
                        : 'bg-gray-50 opacity-50'
                    }`}
                  >
                    <div
                      className={`text-xs font-medium sm:text-sm ${
                        taxFreeChildcareSavings > 0
                          ? 'text-blue-900'
                          : 'text-gray-500'
                      }`}
                    >
                      Tax-Free (20%)
                    </div>
                    <div
                      className={`hidden text-right text-xs sm:block sm:text-sm ${
                        taxFreeChildcareSavings > 0
                          ? 'text-blue-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {taxFreeChildcareSavings > 0
                        ? `-${formatCurrency(weeklyTaxFree)}`
                        : '−'}
                    </div>
                    <div
                      className={`text-right text-xs sm:hidden sm:text-sm ${
                        taxFreeChildcareSavings > 0
                          ? 'text-blue-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {taxFreeChildcareSavings > 0
                        ? `-${formatCurrency(monthlyTaxFree)}`
                        : '−'}
                    </div>
                    <div
                      className={`text-right text-xs font-semibold sm:text-sm ${
                        taxFreeChildcareSavings > 0
                          ? 'text-blue-800'
                          : 'text-gray-400'
                      }`}
                    >
                      {taxFreeChildcareSavings > 0
                        ? `-${formatCurrency(taxFreeChildcareSavings)}`
                        : '−'}
                    </div>
                  </div>

                  {/* Total Savings Summary - Always visible */}
                  <div
                    className={`mb-2 grid grid-cols-3 gap-2 text-nowrap border-t border-gray-200 px-2 py-2 sm:grid-cols-4 ${
                      totalSavings === 0 ? 'opacity-50' : ''
                    }`}
                  >
                    <div
                      className={`text-xs font-semibold sm:text-sm ${
                        totalSavings > 0 ? 'text-violet-900' : 'text-gray-500'
                      }`}
                    >
                      Total Savings
                      {totalSavings > 0 && (
                        <span className="ml-1 text-xs text-violet-600">
                          ({savingsPercentage.toFixed(0)}%)
                        </span>
                      )}
                    </div>
                    <div
                      className={`hidden text-right text-xs font-semibold sm:block sm:text-sm ${
                        totalSavings > 0 ? 'text-violet-700' : 'text-gray-400'
                      }`}
                    >
                      {totalSavings > 0
                        ? `-${formatCurrency(totalSavings / weeksPerYear || 0)}`
                        : '−'}
                    </div>
                    <div
                      className={`text-right text-xs font-semibold sm:hidden sm:text-sm ${
                        totalSavings > 0 ? 'text-violet-700' : 'text-gray-400'
                      }`}
                    >
                      {totalSavings > 0
                        ? `-${formatCurrency(totalSavings / 12)}`
                        : '−'}
                    </div>
                    <div
                      className={`text-right text-xs font-bold sm:text-sm ${
                        totalSavings > 0 ? 'text-violet-800' : 'text-gray-400'
                      }`}
                    >
                      {totalSavings > 0
                        ? `-${formatCurrency(totalSavings)}`
                        : '−'}
                    </div>
                  </div>
                </div>

                {/* Net Cost (Final) */}
                <div className="mt-auto grid grid-cols-3 items-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 p-3 text-white sm:grid-cols-4">
                  <div className="text-xs font-bold sm:text-sm">Net Cost</div>
                  <div className="text-right text-base font-bold">
                    {formatCurrency(weeklyNet)}
                  </div>
                  <div className="hidden text-right text-base font-bold sm:block">
                    {formatCurrency(monthlyNet)}
                  </div>
                  <div className="text-right text-lg font-bold">
                    {formatCurrency(netCost)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card - Full Width at Bottom */}
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
                Important Information
              </h3>
              <p className="mb-0 text-xs leading-relaxed text-amber-800">
                This calculator is for estimation purposes only. Eligibility
                depends on income, employment status, and child's age. The 30
                hours funded childcare is for children aged 3-4 years and runs
                during term-time (38 weeks).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
