# reftApi
Simple and lightweight nodejs REST api builder for mysql and mongoDB
with a great automatic tables relations based on names of tables and fields
supose you have 2 tables [products][providers] , 
if in products you put a field with named "providers_id" then the api will create an object 
in the row named "Providers" with the firs provider row correspondient with the field "id" in "providers"
this principle works for all fields in the table that a fill this rule [tableName]_[fieldName]
also this api it's and excelent example of a simple web server without using express 
This proyect is still on pre-alpha state, i'm moving all code from the lab to a real proyect , documentation and examples will be abalible soon 
Mongo suport it's not ready yet.
