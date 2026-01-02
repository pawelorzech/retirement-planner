# Retirement Planner

A comprehensive retirement planning calculator that projects portfolio growth, simulates tax-optimized withdrawals, and visualizes your financial future through retirement.

✨Vibe✨ coded with Claude -- check results manually for accuracy.

Hosted at: [https://mjcrepeau.github.io/retirement-planner/](https://mjcrepeau.github.io/retirement-planner/)

## Features

### Portfolio Management
- **Country Selection**: Choose USA or Poland (PL) and see country-specific labels and tax logic
- **Multiple Account Types**: Support for Traditional 401(k), Roth 401(k), Traditional IRA, Roth IRA, Taxable Brokerage, and HSA accounts
- **Employer Matching**: Configure employer match percentage and limits for 401(k) accounts
- **Individual Returns**: Set expected return rates per account
- **Contribution Growth**: Model salary increases affecting future contributions

### Retirement Projections
- **Accumulation Phase**: Project portfolio growth from now until retirement with compound interest and contributions
- **Withdrawal Phase**: Simulate retirement spending with tax-optimized withdrawal strategies
- **Social Security Integration**: Include Social Security benefits starting at your chosen age
- **Inflation Adjustment**: All projections account for inflation over time

### Tax-Optimized Withdrawals
The withdrawal algorithm follows a tax-efficient strategy:
1. **Required Minimum Distributions (USA)**: Mandatory withdrawals from traditional accounts starting at age 73
2. **Tax Bracket Optimization**: Fill lower tax brackets with traditional withdrawals (or PIT scale in PL)
3. **Tax-Free Accounts**: Roth/IKE withdrawals for remaining needs
4. **Taxable Account Withdrawals**: With capital gains tracking (Belka in PL)
5. **HSA**: Used last, tax-free for qualified medical expenses (USA)

### Tax Calculations
- USA: 2024 federal income tax brackets (Single and Married Filing Jointly)
- USA: long-term capital gains rates with 0%/15%/20% brackets
- USA: state tax rate configuration and standard deduction
- USA: Social Security taxation (85% taxable)
- PL: PIT (scale 12%/32%, linear 19%, or ryczalt rate)
- PL: tax-free allowance (kwota wolna) for PIT scale
- PL: capital gains tax (Belka 19%)

### Visualizations
- **Accumulation Chart**: Stacked area chart showing portfolio growth by account
- **Drawdown Chart**: Portfolio balance through retirement years
- **Income Chart**: Annual retirement income breakdown (withdrawals, Social Security, taxes)
- **Tax Chart**: Tax burden over time
- **Composition Chart**: Pie chart of portfolio allocation by tax treatment

### Calculation Transparency
Full visibility into how every number is calculated:

- **Methodology Tab**: Complete reference documentation including:
  - All formulas used in accumulation and withdrawal phases
  - Country-specific tax brackets and assumptions (USA/PL)
  - Long-term capital gains rate tables (USA) and Belka (PL)
  - IRS Required Minimum Distribution (RMD) table (USA)
  - Tax-optimized withdrawal strategy explanation
  - Important assumptions and limitations

- **Year-by-Year Data Tables**: Expandable tables showing detailed projections:
  - *Accumulation Phase*: Summary, per-account balances, and contributions (with employer match)
  - *Withdrawal Phase*: Income & spending, withdrawals by account, remaining balances, and tax details
  - Lifetime totals and color-coded by tax treatment

- **Expandable Summary Cards**: Click any summary metric to see:
  - The formula used to calculate it
  - Step-by-step calculation breakdown
  - Context and explanations for the values

### User Experience
- **Dark Mode**: Toggle between light and dark themes
- **Data Persistence**: All data saved to localStorage automatically
- **Reset Function**: Clear all data and start fresh
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS v4** for styling
- **Recharts** for data visualization
- **UUID** for unique account identifiers

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd retirement-planner

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Docker

```bash
# Build and start in production mode
docker compose up -d --build

# Stop and remove container
docker compose down

# View logs
docker compose logs -f
```

The app will be available at `http://localhost`.

## Project Structure

```
src/
├── components/           # React components
│   ├── AccountForm.tsx           # Form for adding/editing accounts
│   ├── AccountList.tsx           # List of investment accounts
│   ├── AssumptionsForm.tsx       # Economic assumptions input
│   ├── ChartAccumulation.tsx     # Portfolio growth chart
│   ├── ChartComposition.tsx      # Pie chart of allocations
│   ├── ChartDrawdown.tsx         # Retirement drawdown chart
│   ├── ChartIncome.tsx           # Retirement income chart
│   ├── ChartTax.tsx              # Tax burden chart
│   ├── DataTableAccumulation.tsx # Year-by-year accumulation data
│   ├── DataTableWithdrawal.tsx   # Year-by-year withdrawal data
│   ├── Layout.tsx                # App layout with header/footer
│   ├── MethodologyPanel.tsx      # Formulas & assumptions reference
│   ├── NumberInput.tsx           # String to number conversion
│   ├── ProfileForm.tsx           # Personal information form
│   └── SummaryCards.tsx          # Expandable key metrics display
│   └── Tooltip.tsx               # Reusable tooltip componenet
├── hooks/
│   ├── useLocalStorage.ts    # localStorage persistence hook
│   └── useRetirementCalc.ts  # Main calculation orchestrator
├── types/
│   └── index.ts              # TypeScript type definitions
├── utils/
│   ├── constants.ts          # Tax brackets, RMD tables, defaults
│   ├── formatting.ts         # Currency formatting helpers
│   ├── projections.ts        # Accumulation phase calculations
│   ├── taxes.ts              # Tax calculation functions (USA/PL)
│   └── withdrawals.ts        # Withdrawal phase simulation
├── tests/
│   └── calculations.test.ts  # Comprehensive math tests
├── App.tsx                   # Main application component
├── index.css                 # Tailwind CSS configuration
└── main.tsx                  # Application entry point
```

## How It Works

### Accumulation Phase
For each year until retirement:
1. Apply investment returns to existing balance
2. Add annual contribution (with employer match if applicable)
3. Grow contribution amount by contribution growth rate

### Withdrawal Phase
For each year of retirement:
1. Calculate Required Minimum Distribution (if age 73+ and USA)
2. Determine target spending (safe withdrawal rate + inflation)
3. Subtract Social Security income from spending need
4. Withdraw from accounts in tax-optimized order
5. Apply investment returns to remaining balance
6. Calculate federal and state taxes

### Key Assumptions
- Investment returns are applied annually
- Contributions are made at year-end
- RMDs follow the IRS Uniform Lifetime Table (USA)
- Social Security benefits grow with inflation (USA)
- ZUS benefits are treated as taxable income (PL)
- Tax brackets are 2024 values (not inflation-adjusted)

## Configuration

### Default Values
| Setting | Default |
|---------|---------|
| Country | USA |
| Current Age | 35 |
| Retirement Age | 65 |
| Life Expectancy | 90 |
| Inflation Rate | 3% |
| Safe Withdrawal Rate | 4% |
| Retirement Return Rate | 5% |
| Social Security Benefit | 30,000/year |
| Social Security Start Age | 67 |
| PL Tax Regime | Scale |
| PL Ryczalt Rate | 12% |

### Account Defaults
| Setting | Default |
|---------|---------|
| Expected Return | 7% |
| Contribution Growth | 3% |

## Testing

The project includes comprehensive tests for all calculations:

```bash
npm test
```

Tests cover:
- Federal and state tax calculations (USA)
- PIT and Belka calculations (PL)
- Capital gains taxation
- RMD calculations (USA)
- Accumulation phase projections
- Withdrawal phase simulations
- Edge cases (zero balances, long retirements, etc.)

## Disclaimer

This tool provides estimates only and should not be considered financial advice. Tax laws change frequently, and individual circumstances vary. Consult a qualified financial advisor for personalized retirement planning.

## License

MIT
