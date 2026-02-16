# Структура сторінок фронтенду - Intra 360 Feedback Platform

## Навігація та архітектура

### Основне меню (Header/Sidebar)
- **Кабінет** (Dashboard)
- **360° Feedback**
  - Цикли оцінювання
  - Огляди (Reviews)
  - Мої оцінки (для EMPLOYEE/MANAGER)
- **Звіти** (Reporting)
- **Бібліотека**
  - Шаблони питань
  - Компетенції
  - Кластери
- **Організація**
  - Команди
  - Посади
- **Користувачі** (тільки ADMIN/HR)
- **Профіль**

---

## 1. 🏠 Dashboard (Головна сторінка)

**URL**: `/`  
**Доступ**: Всі авторизовані користувачі

### Контент залежно від ролі:

#### Для EMPLOYEE:
- **Заголовок**: "Вітаємо, [Ім'я]!"
- **Мої активні оцінки** (Cards):
  - Список reviews, де користувач є respondent
  - Статус: INVITED, RESPONDED
  - Кнопка "Пройти опитування"
- **Мої звіти**:
  - Посилання на звіти, де користувач є ratee
- **Статистика**:
  - Кількість пройдених опитувань
  - Середній бал (якщо є історія)

#### Для MANAGER:
- Все, що у EMPLOYEE +
- **Огляди моєї команди**:
  - Reviews підлеглих працівників
  - Прогрес проходження (turnout %)
- **Запити від HR**:
  - Запрошення оцінити співробітників

#### Для HR/ADMIN:
- **Активні цикли**:
  - Список усіх активних cycles
  - Прогрес: скільки reviews створено/завершено
- **Недавні огляди**:
  - Таблиця останніх 10 reviews з можливістю швидких дій
- **Статистика**:
  - Загальна кількість користувачів
  - Кількість активних reviews
  - Середній turnout по організації
- **Швидкі дії**:
  - Кнопка "Створити цикл"
  - Кнопка "Створити огляд"

---

## 2. 🔄 360° Feedback Module

### 2.1. Цикли оцінювання (Cycles List)

**URL**: `/feedback360/cycles`  
**Доступ**: HR, ADMIN

#### Контент:
- **Заголовок**: "Цикли 360° Feedback"
- **Кнопка**: "Створити новий цикл"
- **Таблиця циклів**:
  - Колонки: Назва | Дати (startDate - endDate) | Статус (ACTIVE, FINISHED) | Кількість reviews | Дії
  - Фільтри: По статусу, по датах
  - Сортування: По даті створення (за замовчуванням), по назві
- **Дії в рядку**:
  - Переглянути
  - Редагувати
  - Видалити
  - "Завершити цикл" (force-finish)

---

### 2.2. Створення/Редагування циклу

**URL**: `/feedback360/cycles/new` | `/feedback360/cycles/:id/edit`  
**Доступ**: HR, ADMIN

#### Контент (Форма):
- **Назва циклу** (текст)
- **Опис** (textarea)
- **Дати**: startDate, endDate (date pickers)
- **Статус** (select): ACTIVE, FINISHED
- **Кнопки**: Зберегти | Скасувати

---

### 2.3. Деталі циклу

**URL**: `/feedback360/cycles/:id`  
**Доступ**: HR, ADMIN

#### Контент:
- **Інформація про цикл**:
  - Назва, опис, дати, статус
  - Кнопка "Редагувати" | "Завершити цикл"
- **Список reviews в циклі** (таблиця):
  - Ratee | HR | Статус (stage) | Дії
  - Фільтр по ratee, по статусу
- **Статистика циклу**:
  - Загальна кількість reviews
  - Завершені / Активні
  - Середній turnout

---

### 2.4. Огляди - Список (Reviews List)

**URL**: `/feedback360/reviews`  
**Доступ**: HR, ADMIN (повний список), MANAGER/EMPLOYEE (тільки свої)

#### Контент:
- **Заголовок**: "Огляди 360°"
- **Кнопка**: "Створити огляд" (тільки для HR/ADMIN)
- **Таблиця оглядів**:
  - Колонки: Ratee | Cycle | HR | Manager | Stage | Дати | Дії
  - Фільтри: 
    - По ratee (autocomplete)
    - По cycle
    - По stage (DRAFT, VERIFICATION_BY_HR, COLLECTING_RESPONSES, PREPARING_REPORT, REPORT_READY)
    - По датах
  - Сортування: По даті створення (за замовчуванням)
- **Дії в рядку**:
  - Переглянути
  - Редагувати (HR/ADMIN)
  - Видалити (HR/ADMIN)
  - "Force Complete" (HR/ADMIN)

---

### 2.5. Створення огляду (Create Review)

**URL**: `/feedback360/reviews/new`  
**Доступ**: HR, ADMIN

#### Контент (Multi-step Form):

**Крок 1: Основна інформація**
- **Ratee** (autocomplete користувачів):
  - Після вибору автоматично підтягується: positionId, positionTitle
- **HR** (autocomplete користувачів з роллю HR):
  - Після вибору автоматично підтягується: hrFullName
- **Manager** (autocomplete, опціонально):
  - Після вибору автоматично підтягується: managerFullName, managerPositionId, managerPositionTitle
- **Team** (select, опціонально):
  - Після вибору автоматично підтягується: teamTitle
- **Cycle** (select, опціонально)
- **HR Note** (textarea, опціонально)

**Крок 2: Додавання питань**
- **Список доступних питань з бібліотеки**:
  - Фільтр по competenceId, по positionId
  - Checkbox для вибору питань
- **Вибрані питання** (список):
  - Можливість видалити з вибраних

**Крок 3: Додавання respondents**
- **Форма додавання respondent**:
  - RespondentId (autocomplete користувачів)
  - Category (select): SELF_ASSESSMENT, TEAM_MEMBER, OTHER
  - Response Status (select): INVITED, RESPONDED, CANCELED
  - Respondent Note (textarea, опціонально)
  - HR Note (textarea, опціонально)
  - InvitedAt (date, опціонально)
- **Список доданих respondents** (таблиця):
  - FullName | Category | Status | Дії (видалити)

**Крок 4: Додавання reviewers**
- **Форма додавання reviewer**:
  - ReviewerId (autocomplete користувачів)
  - Після вибору автоматично підтягується: fullName, positionId, positionTitle, teamId, teamTitle
- **Список доданих reviewers** (таблиця):
  - FullName | Position | Team | Дії (видалити)

**Фінальний крок: Підтвердження**
- **Резюме огляду**:
  - Ratee, HR, Manager, Team, Cycle
  - Кількість питань
  - Кількість respondents
  - Кількість reviewers
- **Кнопки**: Створити огляд | Назад | Скасувати

---

### 2.6. Деталі огляду (Review Details)

**URL**: `/feedback360/reviews/:id`  
**Доступ**: HR, ADMIN, MANAGER (якщо manager цього review), EMPLOYEE (якщо ratee або respondent)

#### Контент:

**Секція 1: Інформація про огляд**
- **Card з основною інформацією**:
  - Ratee (з посадою)
  - HR (з ім'ям)
  - Manager (опціонально)
  - Team (опціонально)
  - Cycle (якщо прикріплено)
  - Stage (з кольоровим індикатором)
  - HR Note
  - Дати: createdAt, updatedAt
- **Дії** (залежно від ролі):
  - Редагувати (HR/ADMIN)
  - Видалити (HR/ADMIN)
  - Force Complete (HR/ADMIN)

**Секція 2: Питання в огляді**
- **Tabs**:
  - **Всі питання** (список з групуванням по competence):
    - Question title
    - Competence
    - Answer type (NUMERICAL, TEXT)
    - isForSelfassessment (badge)
  - **Додати питання** (форма для HR/ADMIN):
    - Вибір з бібліотеки питань

**Секція 3: Respondents**
- **Таблиця respondents**:
  - FullName | Category | Status | Position | Team | Invited At | Responded At | Дії
  - Групування по Category (SELF_ASSESSMENT, TEAM_MEMBER, OTHER)
  - Прогрес-бар: Скільки відповіли / Всього
- **Дії в рядку**:
  - Редагувати статус (HR/ADMIN/MANAGER)
  - Видалити (HR/ADMIN)
- **Кнопка**: "Додати respondent" (HR/ADMIN)

**Секція 4: Reviewers**
- **Таблиця reviewers**:
  - FullName | Position | Team | Дії
- **Дії в рядку**:
  - Видалити (HR/ADMIN)
- **Кнопка**: "Додати reviewer" (HR/ADMIN)

**Секція 5: Відповіді (Answers)** (тільки для ADMIN)
- **Таблиця відповідей**:
  - Question | Respondent Category | Answer Type | Value | Created At
  - Фільтр по respondent category

---

### 2.7. Проходження опитування (Survey Taking)

**URL**: `/feedback360/reviews/:id/survey`  
**Доступ**: EMPLOYEE/MANAGER (тільки якщо вони є respondent з статусом INVITED)

#### Контент:
- **Заголовок**: "Оцінка для [Ratee Name]"
- **Прогрес-бар**: Питання N з M
- **Форма питань**:
  - Кожне питання відображається окремо або групами по competence
  - **Для NUMERICAL питань**: Rating (1-5 stars або slider)
  - **Для TEXT питань**: Textarea
- **Навігація**:
  - Кнопка "Наступне питання"
  - Кнопка "Попереднє питання"
  - Кнопка "Зберегти чернетку"
  - Кнопка "Відправити відповіді" (на останньому питанні)
- **Підтвердження відправки**:
  - Modal: "Ви впевнені? Після відправки редагування неможливе"

---

### 2.8. Бібліотека питань (Questions Library)

**URL**: `/library/questions`  
**Доступ**: HR, ADMIN

#### Контент:
- **Заголовок**: "Бібліотека шаблонів питань"
- **Кнопка**: "Створити питання"
- **Таблиця питань**:
  - Колонки: Title | Competence | Answer Type | For Self-assessment | Status (ACTIVE, ARCHIVED) | Linked Positions | Дії
  - Фільтри: 
    - По competence
    - По answer type
    - По status
    - По positionId
  - Пошук по title
- **Дії в рядку**:
  - Переглянути
  - Редагувати
  - Видалити
  - Attach/Detach competence
  - Attach/Detach position

---

### 2.9. Створення/Редагування питання

**URL**: `/library/questions/new` | `/library/questions/:id/edit`  
**Доступ**: HR, ADMIN

#### Контент (Форма):
- **Title** (текст)
- **Competence** (select з бібліотеки competences)
- **Answer Type** (radio): NUMERICAL | TEXT
- **For Self-assessment** (checkbox)
- **Status** (select): ACTIVE | ARCHIVED
- **Linked Positions** (multi-select):
  - Autocomplete посад
- **Кнопки**: Зберегти | Скасувати

---

### 2.10. Competences (Компетенції)

**URL**: `/library/competences`  
**Доступ**: HR, ADMIN

#### Контент:
- **Заголовок**: "Компетенції"
- **Кнопка**: "Створити компетенцію"
- **Таблиця компетенцій**:
  - Колонки: Title | Description | Status | Linked Questions | Linked Positions | Дії
  - Фільтри: По status
  - Пошук по title
- **Дії в рядку**:
  - Переглянути
  - Редагувати
  - Видалити

---

### 2.11. Створення/Редагування компетенції

**URL**: `/library/competences/new` | `/library/competences/:id/edit`  
**Доступ**: HR, ADMIN

#### Контент (Форма):
- **Title** (текст)
- **Description** (textarea, опціонально)
- **Status** (select): ACTIVE | ARCHIVED
- **Linked Positions** (multi-select)
- **Кнопки**: Зберегти | Скасувати

---

### 2.12. Clusters (Кластери)

**URL**: `/library/clusters`  
**Доступ**: HR, ADMIN

#### Контент:
- **Заголовок**: "Кластери оцінок"
- **Кнопка**: "Створити кластер"
- **Таблиця кластерів**:
  - Колонки: Title | Min Score | Max Score | Status | Дії
  - Пошук по title
- **Дії в рядку**:
  - Переглянути
  - Редагувати
  - Видалити

---

### 2.13. Створення/Редагування кластера

**URL**: `/library/clusters/new` | `/library/clusters/:id/edit`  
**Доступ**: HR, ADMIN

#### Контент (Форма):
- **Title** (текст)
- **Min Score** (number, 0-5)
- **Max Score** (number, 0-5)
- **Status** (select): ACTIVE | ARCHIVED
- **Кнопки**: Зберегти | Скасувати

---

## 3. 📊 Reporting Module

### 3.1. Звіт по огляду (Report View)

**URL**: `/reports/:id` або `/reports/review/:reviewId`  
**Доступ**: HR, ADMIN, MANAGER (якщо manager цього review), EMPLOYEE (якщо ratee)

#### Контент:

**Секція 1: Загальна інформація про звіт**
- **Card з основною інформацією**:
  - Review ID, Cycle (якщо є)
  - Кількість respondents
  - Turnout % (по Team, по Other)
  - Created At
- **Кнопка**: "Експортувати PDF" (можна додати пізніше)

**Секція 2: Візуалізація даних**

**Tab 1: Питання (Question Summaries)**
- **Таблиця з summary по кожному питанню**:
  - Колонки: Question Title | Avg Self | Avg Team | Avg Other | Delta Team | Delta Other
  - Кольорове кодування для delta (зелений +, червоний -)
- **Bar Chart**: Порівняння середніх оцінок по категоріям respondents для кожного питання

**Tab 2: Компетенції (Competence Summaries)**
- **Таблиця з summary по кожній competence**:
  - Колонки: Competence Title | Avg Self | Avg Team | Avg Other | Delta Team | Delta Other
- **Radar/Spider Chart**: Візуалізація компетенцій по категоріях

**Tab 3: Загальна оцінка (Overall Totals)**
- **Cards з великими числами**:
  - Середній бал по всіх питаннях (Self, Team, Other)
  - Середній бал по всіх компетенціях
  - Процентні показники
- **Progress bars**: Візуалізація % по категоріях

**Секція 3: Текстові відповіді (Text Answers)**
- **URL**: `/reports/review/:reviewId/text-answers`
- **Список анонімізованих текстових відповідей**:
  - Групування по питанням
  - Відображення respondent category (SELF_ASSESSMENT, TEAM_MEMBER, OTHER)
  - Текст відповіді
- **Фільтр**: По respondent category

**Секція 4: Коментарі до звіту (Report Comments)**
- **Список коментарів**:
  - Author (FullName)
  - Comment text
  - Created At
  - Дії (редагувати/видалити для власних коментарів або для HR/ADMIN)
- **Форма додавання коментаря**:
  - Textarea
  - Кнопка "Додати коментар"

---

### 3.2. Analytics Dashboard (Розширена аналітика)

**URL**: `/analytics`  
**Доступ**: HR, ADMIN

#### Контент:
- **Заголовок**: "Аналітика організації"
- **Фільтри**:
  - По періоду (date range)
  - По team
  - По cycle

**Секція 1: Загальна статистика**
- **Cards**:
  - Загальна кількість завершених reviews
  - Середній turnout по організації
  - Найвища/найнижча оцінка

**Секція 2: Топ-компетенції**
- **Bar Chart**: Топ-5 компетенцій з найвищими оцінками
- **Bar Chart**: Топ-5 компетенцій з найнижчими оцінками

**Секція 3: Аналітика по командах**
- **Table**: Середні оцінки по командах
  - Team | Avg Score | Turnout % | Кількість reviews

**Секція 4: Trending**
- **Line Chart**: Динаміка середніх оцінок по місяцях/циклах

---

## 4. 👥 Organisation Module

### 4.1. Команди - Список (Teams List)

**URL**: `/organisation/teams`  
**Доступ**: Всі авторизовані (перегляд), HR/ADMIN (редагування)

#### Контент:
- **Заголовок**: "Команди"
- **Кнопка**: "Створити команду" (HR/ADMIN)
- **Таблиця команд**:
  - Колонки: Title | Head (керівник) | Кількість членів | Description | Дії
  - Пошук по title
  - Сортування
- **Дії в рядку**:
  - Переглянути
  - Редагувати (HR/ADMIN)
  - Видалити (HR/ADMIN)

---

### 4.2. Деталі команди (Team Details)

**URL**: `/organisation/teams/:id`  
**Доступ**: Всі авторизовані

#### Контент:
- **Інформація про команду**:
  - Title
  - Description
  - Head (з посиланням на профіль)
- **Кнопка**: "Редагувати" (HR/ADMIN)
- **Список членів команди** (таблиця):
  - Колонки: FullName | Position | Is Primary | Дії
  - Дії (HR/ADMIN): Видалити з команди
- **Кнопка**: "Додати члена" (HR/ADMIN)
  - Modal з формою:
    - Member (autocomplete користувачів)
    - Is Primary (checkbox)

---

### 4.3. Створення/Редагування команди

**URL**: `/organisation/teams/new` | `/organisation/teams/:id/edit`  
**Доступ**: HR, ADMIN

#### Контент (Форма):
- **Title** (текст)
- **Description** (textarea, опціонально)
- **Head** (autocomplete користувачів, опціонально)
- **Кнопки**: Зберегти | Скасувати

---

### 4.4. Посади - Список (Positions List)

**URL**: `/organisation/positions`  
**Доступ**: Всі авторизовані (перегляд), HR/ADMIN (редагування)

#### Контент:
- **Заголовок**: "Посади"
- **Кнопка**: "Створити посаду" (HR/ADMIN)
- **Таблиця посад**:
  - Колонки: Title | Description | Parent Position | Кількість підлеглих | Дії
  - Пошук по title
- **Дії в рядку**:
  - Переглянути
  - Редагувати (HR/ADMIN)
  - Видалити (HR/ADMIN)

---

### 4.5. Деталі посади (Position Details)

**URL**: `/organisation/positions/:id`  
**Доступ**: Всі авторизовані

#### Контент:
- **Інформація про посаду**:
  - Title
  - Description
  - Parent Position (якщо є)
- **Кнопка**: "Редагувати" (HR/ADMIN)
- **Ієрархія посад** (Tree diagram або список):
  - Parent positions (хлібні крихти)
  - Дочірні позиції (якщо є)
- **Linked Competences**:
  - Список компетенцій, прикріплених до цієї посади
- **Linked Questions**:
  - Список питань, прикріплених до цієї посади

---

### 4.6. Створення/Редагування посади

**URL**: `/organisation/positions/new` | `/organisation/positions/:id/edit`  
**Доступ**: HR, ADMIN

#### Контент (Форма):
- **Title** (текст)
- **Description** (textarea, опціонально)
- **Parent Position** (select з посад, опціонально)
- **Кнопки**: Зберегти | Скасувати

---

## 5. 🧑‍💼 Identity Module

### 5.1. Користувачі - Список (Users List)

**URL**: `/users`  
**Доступ**: Всі авторизовані (перегляд обмежених даних), ADMIN (повний доступ)

#### Контент:
- **Заголовок**: "Користувачі"
- **Кнопка**: "Створити користувача" (ADMIN)
- **Таблиця користувачів**:
  - Колонки: FullName | Email | Position | Team | Manager | Roles | Status | Дії
  - Фільтри:
    - По team
    - По position
    - По role
    - По status (ACTIVE, INACTIVE)
  - Пошук по email, fullName
- **Дії в рядку**:
  - Переглянути
  - Редагувати (ADMIN/HR)
  - Керувати ролями (ADMIN)
  - Видалити (ADMIN)

---

### 5.2. Профіль користувача (User Profile)

**URL**: `/users/:id`  
**Доступ**: Всі авторизовані (власний профіль + основна інформація інших), ADMIN (повна інформація)

#### Контент:
- **Інформація про користувача**:
  - FullName (firstName, secondName, lastName)
  - Email
  - Position (з посиланням на позицію)
  - Team (з посиланням на команду)
  - Manager (з посиланням на профіль)
  - Roles (badges)
  - Status (badge: ACTIVE/INACTIVE)
- **Кнопки** (тільки ADMIN/HR):
  - Редагувати
  - Керувати ролями
  - Видалити

**Tabs**:

**Tab 1: Огляди**
- Список reviews, де користувач є:
  - Ratee (оглядувана особа)
  - Respondent (хто оцінює)
  - Reviewer (спостерігач)

**Tab 2: Звіти**
- Список звітів користувача (якщо є доступ)

**Tab 3: Команди** (якщо користувач в декількох командах)
- Список команд з isPrimary

---

### 5.3. Створення/Редагування користувача

**URL**: `/users/new` | `/users/:id/edit`  
**Доступ**: ADMIN

#### Контент (Форма):
- **First Name** (текст)
- **Second Name** (текст, опціонально)
- **Last Name** (текст)
- **Full Name** (текст, auto-generated або ручне введення)
- **Email** (текст)
- **Position** (select)
- **Team** (select, опціонально)
- **Manager** (autocomplete користувачів, опціонально)
- **Roles** (multi-select): ADMIN, HR, MANAGER, EMPLOYEE
- **Status** (select): ACTIVE, INACTIVE
- **Кнопки**: Зберегти | Скасувати

---

### 5.4. Керування ролями користувача

**URL**: `/users/:id/roles`  
**Доступ**: ADMIN

#### Контент:
- **Заголовок**: "Керування ролями для [FullName]"
- **Поточні ролі** (список з badges):
  - ADMIN, HR, MANAGER, EMPLOYEE
- **Форма зміни ролей**:
  - Multi-select (checkboxes)
- **Кнопки**: Зберегти | Скасувати

---

### 5.5. Мій профіль (My Profile)

**URL**: `/profile`  
**Доступ**: Поточний авторизований користувач

#### Контент:
- **Інформація про мене**:
  - FullName
  - Email
  - Position
  - Team
  - Manager
  - Roles
- **Мої активні оцінки**:
  - Список reviews, де я respondent з статусом INVITED
  - Кнопка "Пройти опитування"
- **Мої звіти**:
  - Список звітів, де я ratee

---

## 6. 🔐 Auth Module

### 6.1. Вхід (Login)

**URL**: `/auth/login`  
**Доступ**: Неавторизовані користувачі

#### Контент:
- **Заголовок**: "Вхід до Intra 360 Feedback"
- **Google OAuth кнопка**: "Увійти через Google"
- **(Dev mode)**: Форма dev-логіну (тільки у development):
  - Email (текст)
  - Кнопка "Dev Login"

---

### 6.2. Вихід (Logout)

**URL**: `/auth/logout` (або просто кнопка в Header)  
**Доступ**: Авторизовані користувачі

#### Контент:
- Виклик logout endpoint
- Редірект на `/auth/login`

---

## 7. 🔔 Додаткові сторінки

### 7.1. 404 - Сторінка не знайдена

**URL**: `*` (wildcard)  
**Доступ**: Всі

#### Контент:
- **Заголовок**: "404 - Сторінка не знайдена"
- **Текст**: "Вибачте, сторінка, яку ви шукаєте, не існує"
- **Кнопка**: "Повернутись на головну"

---

### 7.2. 403 - Доступ заборонено

**URL**: `/403`  
**Доступ**: Всі

#### Контент:
- **Заголовок**: "403 - Доступ заборонено"
- **Текст**: "У вас немає прав для перегляду цієї сторінки"
- **Кнопка**: "Повернутись на головну"

---

### 7.3. 500 - Внутрішня помилка сервера

**URL**: `/500`  
**Доступ**: Всі

#### Контент:
- **Заголовок**: "500 - Щось пішло не так"
- **Текст**: "Сталася помилка на сервері. Спробуйте пізніше"
- **Кнопка**: "Повернутись на головну"

---

## Підсумок

### Загальна кількість основних сторінок: **~35**

#### По модулях:
1. **Dashboard**: 1 сторінка
2. **Feedback360**: 13 сторінок (cycles, reviews, questions, competences, clusters, survey)
3. **Reporting**: 2 сторінки (report view, analytics)
4. **Organisation**: 6 сторінок (teams, positions)
5. **Identity**: 5 сторінок (users, profile)
6. **Auth**: 2 сторінки (login, logout)
7. **Error pages**: 3 сторінки (404, 403, 500)

### Ключові компоненти для розробки:
- **Forms**: React Hook Form + Zod
- **Tables**: Mantine DataTable
- **Charts**: Mantine Charts (Recharts)
- **Modals**: Mantine Modal
- **Notifications**: Mantine Notifications
- **Navigation**: Next.js App Router
- **Auth**: better-auth integration
- **State Management**: TanStack Query для server state
