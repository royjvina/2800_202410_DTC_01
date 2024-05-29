## 1. Project Description
Our team, DTC01, is developing Pennywise to help individuals manage their personal finances by creating a web application that provides tools for budgeting, expense tracking, and AI financial advisor. Our core features include a dashboard that details a user's financial overview, a transaction history, budget planning tools, and the ability to set and track financial goals.

## 2. Names of Contributors
List team members and/or short bios here...

* Eunji Kwon
* Claudia Le
* Juhyun Park
* Balpreet Sekhon
* Roy Vina

## 3. Technologies and Resources Used
List technologies (with version numbers), APIs, icons, fonts, images, media, or data sources that were used.
* Node.js
* Express.js
* MongoDB
* Mongoose
* Joi for validation
* Tailwind CSS for UI, https://tailwindcss.com/
* Nodemailer for email handling
* Google OAuth2 for authentication
* Font Awesome for icons, https://fontawesome.com/
* Google Fonts, https://fonts.google.com/
* ChatGPT for advisor feature, https://openai.api.com/

## 4. Complete Setup/Installation/Usage
The current version 1.0 of the application is hosted on https://pennywisedtc01.online/

### Setup and Installation
1. **Clone the Repository:**
    ```bash
    git clone https://github.com/royjvina/2800_202410_DTC_01.git
    cd 2800_202410_DTC_01
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Set Up Environment Variables:**
    For the environment variables, ask directly for the necessary details.

4. **Start the Application:**
    ```bash
    npm start
    ```

### Usage
- **Access the Application:** Open your browser and navigate to `http://localhost:3000`.
- **Authentication:** 
  - **Register:** Create a new account by providing your email, phone number, username, and password.
  - **Login:** Access your account using your registered email and password.
  - **Password Reset:** Request a password reset link if you've forgotten your password.

- **Homepage:**
  - **Overview:** View a summary of your groups, friends, and recent activities.
  - **Navigation:** Use the navigation bar to switch between different sections such as groups, friends, and recent activities.


- **Groups and Friends Management:**
  - **Add Group:** Create a new group by providing a group name and adding friends.
  - **Update Group:** Edit existing group details and manage group members.
  - **Delete Group:** Remove a group and all its associated transactions.
  - **Add Friend:** Add a new friend by providing their email or phone number.
  - **Delete Friend:** Remove a friend from your friends list.

- **Expense Management:**
  - **Add Expense:** Record a new expense by selecting a group, entering expense details, and splitting the cost among group members.
  - **Update Expense:** Edit existing expense details.
  - **Delete Expense:** Remove an expense from the group.

- **Settings:**
  - **Profile Information:** Update your username, email, phone number, and profile picture.
  - **Change Password:** Update your account password.
  - **Delete Account:** Permanently delete your account and all associated data.

  - **AI Advisor:**
  - **Chat:** Interact with the AI financial advisor for personalized financial advice.
  - **History:** View the history of your interactions with the AI advisor.

### Additional Notes
- **Function Headers and Comments:** Refer to function headers and comments within the codebase to understand the functionality of different components.
- **Script Files:** Each page has its own script file, which can be found in the `scripts` directory.
- **Best Viewed On:** The application is optimized for mobile views.


## 5. Known Bugs and Limitations
Here are some known bugs and limitations of the application:

- **AI Advisor Response Time:** Occasionally, the AI advisor may take longer to respond due to server latency or high demand.
- **Group Picture Upload:** In some instances, uploading a group picture may fail if the file size is too large.
- **Expense Calculation Discrepancies:** There may be minor discrepancies in expense calculations when rounding off amounts split among many group members.
- **Session Expiry:** Users may experience unexpected session expiries, requiring them to log in again.


## 6. Features for Future
What we'd like to build in the future:
* Integration with bank APIs for automatic transaction import.
* Advanced data visualization for spending trends.
* Multi-currency support.

## 7. Contents of Folder
Content of the project folder:
```
 Top level of project folder: 
├── .env                                # Environment variables file
├── .gitignore                          # Git ignore file
├── constants.json                      # Constants used in the project
├── databaseConnection.js               # Database connection setup
├── include_config.js                   # Configuration include setup
├── package.json                        # Package file
├── README.md                           # Information about our application, bugs, future features, about us
├── server.js                           # Main server file
└── tailwind.config.js                  # Tailwind CSS configuration

It has the following subfolders and files:
├── controllers                         # Folder for controllers
│   ├── dataFetcherController.js        # Data fetching controller
│   ├── friendController.js             # Friend handling controller
│   ├── groupController.js              # Group handling controller
│   ├── insightFetcherController.js     # Insight fetching controller
│   ├── mailer.js                       # Mailer setup
│   ├── recentActivityFetcherController.js # Recent activity fetching controller
│   └── sortingController.js            # Sorting controller
│
├── models                              # Folder for models
│   ├── chatHistory.js                  # Chat history model
│   ├── Group.js                        # Group model
│   ├── Transaction.js                  # Transaction model
│   ├── User.js                         # User model
│   ├── UserPassword.js                 # User password model
│   └── UserRegistration.js             # User registration model
│
├── public                              # Folder for public assets
│   ├── images                          # Folder for images
│   │   ├── addGroupIcons               # Icons for adding groups
│   │   ├── homepageIconsAndPlaceholders # Homepage icons and placeholders
│   │   ├── navbarIcons                 # Navigation bar icons
│   │   └── otherIcons                  # Other icons
│   ├── scripts                         # Folder for scripts
│   │   ├── addExpenses.js              # Script for adding expenses
│   │   ├── addFriend.js                # Script for adding friends
│   │   ├── addGroup.js                 # Script for adding groups
│   │   ├── ai.js                       # Script for AI interactions
│   │   ├── aiLog.js                    # Script for AI logs
│   │   ├── easterEgg.js                # Script for easter eggs
│   │   ├── expensePersonal.js          # Script for personal expenses
│   │   ├── groups.js                   # Script for groups
│   │   ├── individualExpense.js        # Script for individual expenses
│   │   ├── insightChart.js             # Script for insight charts
│   │   ├── main.js                     # Main script
│   │   ├── personalChart.js            # Script for personal charts
│   │   ├── register.js                 # Script for registration
│   │   ├── reimbursement.js            # Script for reimbursements
│   │   ├── setBudget.js                # Script for setting budgets
│   │   └── settings.js                 # Script for settings
│   └── style                           # Folder for styles
│       ├── style.css                   # Main stylesheet
│       └── styleAi.css                 # Stylesheet for AI components
│
├── routes                              # Folder for routes
│   ├── addExpenses.js                  # Routes for adding expenses
│   ├── aiAdvisor.js                    # Routes for AI advisor
│   ├── authentication.js               # Routes for authentication
│   ├── expensePersonal.js              # Routes for personal expenses
│   ├── groups.js                       # Routes for groups
│   ├── home.js                         # Routes for home
│   ├── individualExpense.js            # Routes for individual expenses
│   ├── insight.js                      # Routes for insights
│   ├── personal.js                     # Routes for personal section
│   ├── recentActivity.js               # Routes for recent activities
│   ├── settings.js                     # Routes for settings
│   └── suggestedReimbursements.js      # Routes for suggested reimbursements
│
└── views                               # Folder for views
    ├── 404.ejs                         # 404 error page
    ├── addExpenses.ejs                 # Add expenses page
    ├── addFriend.ejs                   # Add friend page
    ├── addGroup.ejs                    # Add group page
    ├── aiAdvisor.ejs                   # AI advisor page
    ├── aiLog.ejs                       # AI log page
    ├── changeNum.ejs                   # Change phone number page
    ├── changePass.ejs                  # Change password page
    ├── deleteAccount.ejs               # Delete account page
    ├── error400.ejs                    # 400 error page
    ├── error500.ejs                    # 500 error page
    ├── expensePersonal.ejs             # Personal expenses page
    ├── groups.ejs                      # Groups page
    ├── index.ejs                       # Index page
    ├── individualExpense.ejs           # Individual expense page
    ├── insight.ejs                     # Insight page
    ├── main.ejs                        # Main page
    ├── personal.ejs                    # Personal page
    ├── recentActivity.ejs              # Recent activity page
    ├── register.ejs                    # Register page
    ├── reset.ejs                       # Reset password page
    ├── resetForm.ejs                   # Reset password form
    ├── setBudget.ejs                   # Set budget page
    ├── settings.ejs                    # Settings page
    ├── suggestedReimbursements.ejs     # Suggested reimbursements page
    ├── verificationSuccess.ejs         # Verification success page
    └── templates                       # Folder for templates
        ├── categoryCards.ejs           # Category cards template
        ├── footer.ejs                  # Footer template
        ├── friendsAddGroup.ejs         # Friends add group template
        ├── friendsEqualExpense.ejs     # Friends equal expense template
        ├── friendsHomepage.ejs         # Friends homepage template
        ├── friendsManualExpense.ejs    # Friends manual expense template
        ├── friendsPercentExpense.ejs   # Friends percent expense template
        ├── groupExpense.ejs            # Group expense template
        ├── groupsHomepage.ejs          # Groups homepage template
        ├── header.ejs                  # Header template
        ├── headTags.ejs                # Head tags template
        ├── keyExpense.ejs              # Key expense template
        ├── nameExpense.ejs             # Name expense template
        ├── suggestedReimbursementsTemplate.ejs # Suggested reimbursements template
        ├── usersForExpense.ejs         # Users for expense template
        └── usersSplit.ejs              # Users split template
```
