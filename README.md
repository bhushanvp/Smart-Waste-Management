## Project Structure
* /Project
  - /db
    + conn.js
  - /middlewares
    + producer_middlewares
    + recycler_middlewares
  - /routes
    + app_routes
    + producer_routes
    + recycler_routes
  - /static
    - /css
      + dashboard.css
      + index.css
      + login.css
    - /images
      + create_order_icon.png
    - /js
      + producer_dashboard.js
      + recycler_dashboard.js
      + login.js
      + register.js
  - /templates
    - /partials
      + header.hbs
      + footer.hbs
    - /views
      + contact.hbs
      + index.hbs
      + login.hbs
      + producer_dashboard.hbs
      + recycler_dashboard.hbs
      + register.hbs
  + index.js
  + package-lock.json
  + package.json
  + README.md

<hr>

## Routes
1. **App Routes**
    -  [[GET] /](#/)
    -  [[GET] /login](#/login)
    -  [[GET] /register](#/register)
    -  [[GET] /contact](#/contact_g)
    -  [[POST] /contact](#/contact_p)

2. **Producer Routes**
    -  [[POST] /producer/login](#/producer/login)
    -  [[POST] /producer/register](#/producer/register)
    -  [[POST] /producer/dashboard](#/producer/dashboard)
    -  [[POST] /producer/create-order](#/producer/create-order)
    -  [[POST] /producer/order/execute/:id](#/producer/order/execute/:id)
    -  [[GET]  /producer/logout](#/producer/logout)

3. **Recycler Routes**
    -  [[POST] /recycler/login](#/recycler/login)
    -  [[POST] /recycler/dashboard](#/recycler/dashboard)
    -  [[GET]  /recycler/accept](#/recycler/accept)
    -  [[GET]  /recycler/execute/:id](#/recycler/execute/:id)
    -  [[GET]  /recycler/reject/:id](#/recycler/reject/:id)
    -  [[GET]  /recycler/logout](#/recycler/logout)
    
<hr>

## Routes Explained
- <a name="/">**/**  [GET]</a>
   * This route uses a GET request to display the static 'Home Page'

- <a name="/login">**/login**  [GET]</a>
   * The '/login' route uses a GET request to display the static 'Login Page'

- <a name="/register">**/register**  [GET]</a>
   * The '/register' route uses a GET request to display the static 'Registration Page'

- <a name="/contact_g">**/contact**  [GET]</a>
   * The '/contact' get route uses a GET request to display the static 'Contact Us Page'

- <a name="/contact_p">**/contact**  [POST]</a>
   * The '/contact' post route uses a POST request to send an email to the company.

- <a name="/producer/register">**/producer/register**  [POST]</a>
   * The '/producer/register' route handles the POST request from the 'Register Page'
   * It has a middleware [isAuth](#producer_isAuth) which checks if the user is already logged in.
     + If the user is already logged in it redirects the Producer to their dashboard.
     + Else it proceeds further.
   * It then updates the databases using the [register](#producer_register) middleware.
   * Upon successful registration, it redirects the Producer to the dashboard.
   * Else it refreshes the 'Registration Page'.

- <a name="/producer/login">**/producer/login**  [POST]</a>
   * The '/producer/login' route handles the POST request from the 'Login Page'
   * It has a middleware [isAuth](#producer_isAuth) which checks if the user is already logged in.
     + If the user is already logged in it redirects the Producer to their dashboard.
     + Else it proceeds further
   * Then it checks the entry in the database using the [login](#producer_login) middleware.
   * Upon successful login, it redirects the user to the dashboard of the Producer.
   * Else it refreshes the 'Login Page'.

- <a name="/producer/dashboard">**/producer/dashboard**  [GET]</a>
   * The '/producer/dashboard' route displays the dashboard of the Producer.
   * It has a middleware [isAuth](#producer_isAuth) which checks if the user is logged in or not.
     + If the user is already logged it proceeds further.
     + Else it redirects the Producer to the 'Login Page'.
   * It displays all the accepted and pending requests.
   
- <a name="/producer/create-order">**/producer/create-order**  [POST]</a>
   * This request is posted after the Producer clicks on 'Create Order' button present on the dashboard.
   * Displays an interface to create an order.
   * It has a [createOrder](#createOrder) middleware which updates the databases.
   * Then it refreshes the dashboard page also displaying the order and order status.

- <a name="/producer/order/execute/:id">**/producer/order/execute/:id**  [POST]</a>
   * This request is posted after the Producer clicks on 'Execute Order' button present on the dashboard.
   * The order with order id = id is executed from both the ends.
   * It has a [executeOrder](#p_executeOrder) middleware which updates the databases.
   * Then it refreshes the dashboard page.

- <a name="/producer/logout">**/producer/logout**  [GET]</a>
   * Delete the session.
   * Clear the cookies.
   * Redirect to the 'Login Page'.

- <a name="/recycler/register">**/recycler/register**  [POST]</a>
   * The '/recycler/register' route handles the POST request from the 'Register Page'
   * It has a middleware [isAuth](recycler_isAuth) which checks if the user is already logged in.
     + If the user is already logged in it redirects the Recycler to their dashboard.
     + Else it proceeds further.
   * It then updates the databases using the [register](#recycler_register) middleware.
   * Upon successful registration, it redirects the Recycler to the dashboard.
   * Else it refreshes the 'Registration Page'.

- <a name="/recycler/login">**/recycler/login**  [POST]</a>
   * The '/recycler/login' route handles the POST request from the 'Login Page'
   * It has a middleware [isAuth](recycler_isAuth) which checks if the user is already logged in.
     + If the user is already logged in it redirects the Recycler to their dashboard.
     + Else it proceeds further
   * Then it checks the entry in the database using the [login](#recycler_login) middleware.
   * Upon successful login, it redirects the user to the dashboard of the Recycler.
   * Else it refreshes the 'Login Page'.

- <a name="/recycler/dashboard">**/recycler/dashboard**  [GET]</a>
   * The '/recycler/dashboard' route displays the dashboard of the Recycler.
   * It has a middleware [isAuth](recycler_isAuth) which checks if the user is logged in or not.
     + If the user is already logged it proceeds further.
     + Else it redirects the Recycler to the 'Login Page'.
   * It displays all the accepted and pending requests.
   
- <a name="/recycler/accept/:id">**/recycler/accept/:id**  [GET]</a>
   * This request facilitates the Recycler to accept the order corresponding to order_id=id.
   * It has a middlware [acceptOrder](#acceptOrder) which updates the databases.
   * Then it refreshes the dashboard page.

- <a name="/recycler/execute/:id">**/recycler/execute/:id**  [GET]</a>
   * This request facilitates the Recycler to initialize the execution of order corresponding to order_id=id.
   * It has a middlware [executeOrder](#r_executeOrder) which updates the databases.
   * Then it refreshes the dashboard page.

- <a name="/recycler/reject/:id">**/recycler/reject/:id**  [GET]</a>
   * This request facilitates the Recycler to reject the order corresponding to order_id=id.
   * It has a middlware [rejectOrder](#rejectOrder) which updates the databases.
   * Then it refreshes the dashboard page.
   
- <a name="/recycler/logout">**/recycler/logout**  [GET]</a>
   * Delete the session.
   * Clear the cookies.
   * Redirect to the 'Login Page'.
   
<hr>

## Middlewares
1. **Producer Middlewares**
   - **register** <a name="producer_register"></a>
      * It takes all the information from the input fields of the 'Registration Page'.
      * Inserts all the information about Producer into the db1.Producers table.
      * Then it inserts the information about the location into the db1.addresses table
      * Upon successful insertions it stores the following session variables :-
        - req.session.username = Producer's Name
        - req.session.id = Company ID
        - req.session.north = North Coordinates
        - req.session.east = East Coordinates
        - req.session.entity = "producer"
        - req.session.isAuth = true
      * And proceeds further
   
   - **login** <a name="producer_login"></a>
      * It takes all the information from the input fields of the 'Login Page'.
      * Checks all the information about Producer into the db1.Producers table.
      * Upon successful checking the databases it stores the following session variables :-
        - req.session.username = Producer's Name
        - req.session.id = Company ID
        - req.session.north = North Coordinates
        - req.session.east = East Coordinates
        - req.session.entity = "producer"
        - req.session.isAuth = true
      * And proceeds further
      
   - **isAuth**<a name="producer_isAuth"></a>
      * It checks the req.session.isAuth variable to check the user is already logged in.
      
   - **createOrder** <a name="createOrder"></a>
      * **IMP** First it checks if there are any available recyclers who recycle that particular waste.
      * Then it checks which recycler is the nearest (within some radius).
      * If no recyclers are present which satisfy the above conditions then it doesn't create any order.
      * Else it creates an order with order_status = number of available recyclers whoc satisfy the conditions.
      * Updates the order status (created/not) in the Producer's dashboard.

   - **executeOrder** <a name="p_executeOrder"></a>
      * This option is visible at the pending verification section.
      * The recycler has to initiate the execution process by clicking on the execute button.
      * The status of order with order_id = id is set as executed by the producer.
      * The order is then set as completely executed.

2. **Recycler Middlewares**
   - **register** <a name="recycler_register"></a>
      * It takes all the information from the input fields of the 'Registration Page'.
      * Inserts all the information about Recycler into the db1.Recyclers table.
      * Then it inserts the information about the location into the db1.addresses table
      * Upon successful insertions it stores the following session variables :-
        - req.session.username = Recycler's Name
        - req.session.id = Company ID
        - req.session.waste_type = Waste Type
        - req.session.entity = "recycler"
        - req.session.isAuth = true
      * And proceeds further

   - **login** <a name="recycler_login"></a>
      * It takes all the information from the input fields of the 'Login Page'.
      * Checks all the information about Producer into the db1.Producers table.
      * Upon successful checking the databases it stores the following session variables :-
        + req.session.username = Recycler's Name
        + req.session.id = Company ID
        + req.session.waste_type = Waste Type
        + req.session.entity = "recycler"
        + req.session.isAuth = true
      * And proceeds further

   - **isAuth**<a name="recycler_isAuth"></a>
      * It checks the req.session.isAuth variable to check the user is already logged in.

   - **acceptOrder** <a name="acceptOrder"></a>
      * It takes all the order_id from the url itself using req.params.
      * It updates the order_status in the orders table as 111.
      * It also updates the recycler_id of the same entry.

   - **executeOrder** <a name="r_executeOrder"></a>
      * The recycler has to initiate the execution process by clicking on the execute button.
      * The status of order with order_id = id is set as executed by the recycler.
      * This makes the order display in the pending verfication section of the producer.
      * The order is then set as executed by the recycler.

   - **rejectOrder** <a name="rejectOrder"></a>
      * The recycler can reject an order by clicking on Reject button.
      * The status of order with order_id = id is set as rejected by the corresponding recycler.
      * This order is never show to that recycler again.

<hr>

## Databases
1. **MySQL**
   - **Producers Table**
      * Schema
      
      | Field                   | Type        | Null | Key | Default | Extra          |
      |-------------------------|-------------|------|-----|---------|----------------|
      | company_id              | int         | NO   | PRI | NULL    | auto_increment |
      | producer_name           | char(30)    | YES  |     | NULL    |                |
      | producer_email          | varchar(30) | YES  |     | NULL    |                |
      | producer_contact_number | varchar(13) | YES  |     | NULL    |                |
      | waste_type              | int         | YES  |     | NULL    |                |
      | password                | char(60)    | YES  |     | NULL    |                |

   - **Recyclers Table**
      * Schema
      
      | Field                   | Type        | Null | Key | Default | Extra          |
      |-------------------------|-------------|------|-----|---------|----------------|
      | company_id              | int         | NO   | PRI | NULL    | auto_increment |
      | recycler_name           | char(30)    | YES  |     | NULL    |                |
      | recycler_email          | varchar(30) | YES  |     | NULL    |                |
      | recycler_contact_number | varchar(13) | YES  |     | NULL    |                |
      | waste_type              | int         | YES  |     | NULL    |                |
      | password                | char(60)    | YES  |     | NULL    |                |

   - **Orders Table**
      * Schema
      
      | Field            | Type        | Null | Key | Default | Extra          |
      |------------------|-------------|------|-----|---------|----------------|
      | order_id         | int         | NO   | PRI | NULL    | auto_increment |
      | recycler_id      | int         | YES  | MUL | NULL    |                |
      | producer_id      | int         | YES  | MUL | NULL    |                |
      | waste_type       | int         | YES  |     | NULL    |                |
      | waste_quantity   | varchar(20) | YES  |     | NULL    |                |
      | pickup_date      | datetime    | YES  |     | NULL    |                |
      | order_status     | int         | YES  |     | NULL    |                |
      | north_coordinate | float       | YES  |     | NULL    |                |
      | east_coordinate  | float       | YES  |     | NULL    |                |

   - **Addresses Table**
      * Schema
      
      | Field            | Type        | Null | Key | Default | Extra |
      |------------------|-------------|------|-----|---------|-------|
      | company_id       | int         | NO   | PRI | NULL    |       |
      | building_number  | varchar(20) | YES  |     | NULL    |       |
      | building_name    | varchar(20) | YES  |     | NULL    |       |
      | street_landmark  | varchar(20) | YES  |     | NULL    |       |
      | city             | varchar(20) | YES  |     | NULL    |       |
      | district         | varchar(20) | YES  |     | NULL    |       |
      | pincode          | int         | YES  |     | NULL    |       |
      | north_coordinate | float       | YES  |     | NULL    |       |
      | east_coordinate  | float       | YES  |     | NULL    |       |

2. **MongoDB**
   - **Rejected Orders Collection**
      * Model

      | Field         | Type      |
      |---------------|-----------|
      | _id           | ObjectId  |
      | order_id      | int       |
      | building_name | int array |