# Smart Spend Hub

Build a complete, polished, responsive web application called "SmartSpend – Personal Expense & Budget Management System".

This is a college-level BTech CSE project. The application should look like a real modern web application, not a basic template.

CORE PURPOSE:

The app helps students and individuals track their income and expenses, manage monthly budgets, and understand their spending patterns through dashboards and charts.

TECHNOLOGY:

Use a modern React-based frontend with TypeScript and Tailwind CSS. Use a clean component-based architecture. Use a suitable database/backend if required for persistent storage. Keep the code well organized and easy for a student to understand.

MAIN FEATURES:

1. DASHBOARD

Create a professional dashboard showing:

- Total income

- Total expenses

- Current balance

- Monthly budget

- Remaining budget

- Savings

- Recent transactions

- Expense category breakdown

- Monthly spending trend

Use attractive cards, charts and icons.

2. ADD TRANSACTION

Create a form where the user can add:

- Transaction type: Income or Expense

- Amount

- Category

- Date

- Description

Expense categories:

Food, Shopping, Transport, Education, Entertainment, Bills, Healthcare, Travel, Other

Income categories:

Salary, Allowance, Freelance, Scholarship, Other

Validate the form properly.

3. TRANSACTION HISTORY

Create a dedicated page showing all transactions in a clean table/list.

Include:

- Search

- Category filter

- Income/Expense filter

- Date filter

- Edit transaction

- Delete transaction

4. BUDGET MANAGEMENT

Allow the user to:

- Set a monthly budget

- See amount spent

- See amount remaining

- See percentage of budget used

- Display a warning when spending approaches or exceeds the budget

Use progress indicators and clear visual feedback.

5. ANALYTICS

Create an analytics page with:

- Category-wise expense pie/donut chart

- Monthly income vs expense bar chart

- Spending trend line chart

- Top spending categories

- Monthly savings

Charts should update automatically based on transaction data.

6. SMART SPENDING INSIGHTS

Add a simple rule-based "Smart Insights" section.

Examples:

- "Food is your highest spending category this month."

- "You have used 80% of your monthly budget."

- "Your spending is higher than last month."

- "You saved ₹X this month."

- "Consider reducing spending in your highest expense category."

Do NOT claim that this is a sophisticated AI model. Present it as smart/rule-based financial insights.

7. USER EXPERIENCE

Create a modern responsive interface suitable for desktop and mobile.

Use:

- Sidebar navigation on desktop

- Mobile-friendly navigation

- Clean cards

- Rounded components

- Consistent typography

- Professional dashboard

- Empty states

- Loading states

- Error messages

- Confirmation before deleting transactions

8. DATA STORAGE

Make transaction and budget data persistent so that refreshing the page does not erase everything.

Use the simplest reliable database/storage approach supported by the platform.

9. SAMPLE DATA

Include a small amount of realistic sample transaction data so that the dashboard and charts look populated on first use.

Clearly structure the code so sample data can later be removed.

10. ABOUT PAGE

Create an About page containing:

Project name:

"SmartSpend – Personal Expense & Budget Management System"

Description:

"A personal finance management web application designed to help users track income and expenses, manage budgets and understand their spending patterns."

Include sections for:

- Problem Statement

- Objectives

- Key Features

- Technology Used

DESIGN:

Use a professional finance-dashboard aesthetic.

Do not make it overly colorful or childish.

Keep the interface clean, modern and suitable for a BTech project presentation.

IMPORTANT:

- Make the application fully functional, not just a static UI.

- All buttons should work.

- Forms should actually add/update/delete data.

- Charts should use actual transaction data.

- Keep the code organized and readable.

- Avoid unnecessary complex features.

- Do not copy the UI or branding of an existing website.

- Make the design original.

- Make the project easy for a student to demonstrate and explain in a viva.

Before finishing, test the main user flow:

Add transaction → dashboard updates → analytics updates → transaction appears in history → edit/delete works → budget calculations update correctly.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://smart-spend-buddy-987.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7acf0c49-63ee-5ad3-9b7d-fc347ac8a1fa).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
