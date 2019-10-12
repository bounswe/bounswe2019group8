This is the initial version of the backend API.
Request to API should be in application/json format.



Running the Project
----------- 
- You can run the project in Eclipse or Intellij Idea.
- Running the project from command line:
	- In command line navigate to the backend folder (where ```pom.xml``` exists)
	- enter commands: 
		``` maven package ``` 
	  or:
		``` mvn install ```
	- Then enter the command:
		```java -jar target/backend-0.0.1-SNAPSHOT.jar```
	  or:
		```mvn spring-boot:run```

Now project will run at ```localhost:8080```

Database
-----------
- You need to create a PostGreSQL database and collection.
- You can name the database as you wish, but you should modify the
``` application.properties ``` file under the resources folder accordingly.
- Then you should create a collection named ```users```. This parameter is currently
hardcoded inside the project but will be replaced to the application.properties later
on, in order to be able to change it easily.



- Now you can use ```/auth/register``` and ```/auth/login``` endpoints.

## POST ```/auth/register```
- Inside API request, *username* , *password* , *email* , and *authorityList*
	parameters should be provided. See example:
  ```
	{
		"username" : "test",
		"password" : "test",
		"email" : "email",
		"userRole" : "trader"
	}
  ```
  Current options for userRole are : *basic*, *trader*, *admin*

## POST ```/auth/login```
- Inside API request, *username* and *password* parameters should be provided. See:
	```
  {
		"username" : "test",
		"password" : "test"
	}
  ```
- This request will return the result ``` Bearer {jwtToken} ``` if login is successful.
- Retrieved ``` jwtToken ``` should be added to the header for every API request now.
(in header, key should be ``` Authorization ``` and value should be ``` Bearer {jwtToken} ```) 	

## GET ```/admin/allusers```
- This request will return all currently registered users if
	current user's *authorityList* includes ```admin```		

## POST ```/follows```
- This request will make currenty logged in user follow another user.
  ```
  {
		"id" = "5"
  }
  ```
  Currently logged in user will follow user with id = 5.
  
